package customer

import (
	"context"
	"crypto/sha512"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/proxima-labs/wedding-invitation-back-end/src/model"
	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
	"github.com/proxima-labs/wedding-invitation-back-end/src/service/external"
)

type PaymentService struct {
	CustomerRepo *repository.CustomerRepository
	PlanRepo     *repository.PlanRepository
	PaymentRepo  *repository.PaymentRepository
	Midtrans     *external.MidtransService
}

type CreatePaymentInput struct {
	CustomerID string
	PlanCode   string
}

type CreatePaymentResult struct {
	PaymentID         string
	Status            string
	Amount            int
	Currency          string
	MidtransOrderID   string
	MidtransClientKey string
	MidtransToken     string
	MidtransRedirect  string
}

type PaymentProgressInput struct {
	CustomerID string
	PaymentID  string
}

type PaymentProgressResult struct {
	PaymentID       string
	Status          string
	MidtransStatus  string
	PaidAt          *time.Time
	MidtransOrderID string
	RedirectURL     string
}

type MidtransWebhookInput struct {
	OrderID           string
	TransactionStatus string
	FraudStatus       string
	StatusCode        string
	GrossAmount       string
	SignatureKey      string
}

type MidtransWebhookResult struct {
	PaymentID string
	Status    string
	PaidAt    *time.Time
}

var (
	ErrPaymentServiceNotConfigured = errors.New("payment service not configured")
	ErrMidtransNotConfigured       = errors.New("midtrans not configured")
	ErrCustomerNotFound            = errors.New("customer not found")
	ErrPlanNotFound                = errors.New("plan not found")
	ErrPaymentNotFound             = errors.New("payment not found")
	ErrMidtransOrderNotFound       = errors.New("midtrans order id not found")
	ErrInvalidMidtransSignature    = errors.New("invalid midtrans signature")
)

type paymentMeta struct {
	Provider    string `json:"provider"`
	OrderID     string `json:"order_id"`
	RedirectURL string `json:"redirect_url,omitempty"`
	SnapToken   string `json:"snap_token,omitempty"`
	PlanCode    string `json:"plan_code,omitempty"`
	PlanName    string `json:"plan_name,omitempty"`
	Amount      int    `json:"amount,omitempty"`
	Currency    string `json:"currency,omitempty"`
}

func (s *PaymentService) Create(ctx context.Context, input CreatePaymentInput) (CreatePaymentResult, error) {
	if s.CustomerRepo == nil || s.PlanRepo == nil || s.PaymentRepo == nil {
		return CreatePaymentResult{}, ErrPaymentServiceNotConfigured
	}
	if s.Midtrans == nil {
		return CreatePaymentResult{}, ErrMidtransNotConfigured
	}

	customer, ok, err := s.CustomerRepo.FindByID(ctx, strings.TrimSpace(input.CustomerID))
	if err != nil {
		return CreatePaymentResult{}, err
	}
	if !ok {
		return CreatePaymentResult{}, ErrCustomerNotFound
	}

	plan, ok, err := s.PlanRepo.FindByCode(ctx, strings.TrimSpace(input.PlanCode))
	if err != nil {
		return CreatePaymentResult{}, err
	}
	if !ok {
		return CreatePaymentResult{}, ErrPlanNotFound
	}

	currency := strings.ToUpper(strings.TrimSpace(plan.Currency))
	if currency == "" {
		currency = "IDR"
	}

	orderID := buildOrderID(customer.ID)
	midtransResult, err := s.Midtrans.CreateTransaction(ctx, external.MidtransCreateTransactionInput{
		OrderID:  orderID,
		Amount:   plan.PriceAmount,
		Currency: currency,
		Email:    customer.Email,
		FullName: customer.FullName,
		PlanCode: plan.Code,
		PlanName: plan.Name,
	})
	if err != nil {
		return CreatePaymentResult{}, err
	}

	metaRaw, err := marshalPaymentMeta(paymentMeta{
		Provider:    "midtrans",
		OrderID:     orderID,
		RedirectURL: midtransResult.RedirectURL,
		SnapToken:   midtransResult.Token,
		PlanCode:    plan.Code,
		PlanName:    plan.Name,
		Amount:      plan.PriceAmount,
		Currency:    currency,
	})
	if err != nil {
		return CreatePaymentResult{}, err
	}

	paymentID, err := s.PaymentRepo.Create(ctx, repository.PaymentCreateInput{
		CustomerID:     customer.ID,
		PlanID:         plan.ID,
		Amount:         plan.PriceAmount,
		Currency:       currency,
		ProofOfPayment: metaRaw,
		Status:         "pending",
	})
	if err != nil {
		return CreatePaymentResult{}, err
	}

	return CreatePaymentResult{
		PaymentID:         paymentID,
		Status:            "pending",
		Amount:            plan.PriceAmount,
		Currency:          currency,
		MidtransOrderID:   orderID,
		MidtransClientKey: s.Midtrans.ClientKey(),
		MidtransToken:     midtransResult.Token,
		MidtransRedirect:  midtransResult.RedirectURL,
	}, nil
}

func (s *PaymentService) Progress(ctx context.Context, input PaymentProgressInput) (PaymentProgressResult, error) {
	if s.PaymentRepo == nil || s.CustomerRepo == nil {
		return PaymentProgressResult{}, ErrPaymentServiceNotConfigured
	}
	if s.Midtrans == nil {
		return PaymentProgressResult{}, ErrMidtransNotConfigured
	}

	customerID := strings.TrimSpace(input.CustomerID)
	if customerID == "" {
		return PaymentProgressResult{}, ErrCustomerNotFound
	}

	var (
		payment model.Payment
		ok      bool
		err     error
	)

	paymentID := strings.TrimSpace(input.PaymentID)
	if paymentID != "" {
		payment, ok, err = s.PaymentRepo.GetByIDAndCustomer(ctx, paymentID, customerID)
	} else {
		payment, ok, err = s.PaymentRepo.GetLatestByCustomer(ctx, customerID)
	}
	if err != nil {
		return PaymentProgressResult{}, err
	}
	if !ok {
		return PaymentProgressResult{}, ErrPaymentNotFound
	}

	meta, err := parsePaymentMeta(payment.ProofOfPayment)
	if err != nil {
		return PaymentProgressResult{}, err
	}
	if strings.TrimSpace(meta.OrderID) == "" {
		return PaymentProgressResult{}, ErrMidtransOrderNotFound
	}

	statusResult, err := s.Midtrans.GetTransactionStatus(ctx, meta.OrderID)
	if err != nil {
		return PaymentProgressResult{}, err
	}

	normalizedStatus := normalizeMidtransStatus(statusResult.TransactionStatus, statusResult.FraudStatus)
	paidAt := paidAtForStatus(normalizedStatus, payment.PaidAt)

	if err := s.PaymentRepo.UpdateStatus(ctx, payment.ID, normalizedStatus, paidAt); err != nil {
		return PaymentProgressResult{}, err
	}

	if normalizedStatus == "paid" {
		if err := s.CustomerRepo.UpdateStatus(ctx, customerID, "paid"); err != nil {
			return PaymentProgressResult{}, err
		}
	}

	return PaymentProgressResult{
		PaymentID:       payment.ID,
		Status:          normalizedStatus,
		MidtransStatus:  strings.TrimSpace(statusResult.TransactionStatus),
		PaidAt:          paidAt,
		MidtransOrderID: meta.OrderID,
		RedirectURL:     meta.RedirectURL,
	}, nil
}

func (s *PaymentService) HandleMidtransWebhook(ctx context.Context, input MidtransWebhookInput) (MidtransWebhookResult, error) {
	if s.PaymentRepo == nil || s.CustomerRepo == nil || s.Midtrans == nil {
		return MidtransWebhookResult{}, ErrPaymentServiceNotConfigured
	}

	if !verifyMidtransSignature(input, s.Midtrans.ServerKey()) {
		return MidtransWebhookResult{}, ErrInvalidMidtransSignature
	}

	orderID := strings.TrimSpace(input.OrderID)
	if orderID == "" {
		return MidtransWebhookResult{}, ErrMidtransOrderNotFound
	}

	payment, ok, err := s.PaymentRepo.GetByMidtransOrderID(ctx, orderID)
	if err != nil {
		return MidtransWebhookResult{}, err
	}
	if !ok {
		return MidtransWebhookResult{}, ErrPaymentNotFound
	}

	normalizedStatus := normalizeMidtransStatus(input.TransactionStatus, input.FraudStatus)
	paidAt := paidAtForStatus(normalizedStatus, payment.PaidAt)

	if err := s.PaymentRepo.UpdateStatus(ctx, payment.ID, normalizedStatus, paidAt); err != nil {
		return MidtransWebhookResult{}, err
	}

	if normalizedStatus == "paid" {
		if err := s.CustomerRepo.UpdateStatus(ctx, payment.CustomerID, "paid"); err != nil {
			return MidtransWebhookResult{}, err
		}
	}

	return MidtransWebhookResult{
		PaymentID: payment.ID,
		Status:    normalizedStatus,
		PaidAt:    paidAt,
	}, nil
}

func verifyMidtransSignature(input MidtransWebhookInput, serverKey string) bool {
	serverKey = strings.TrimSpace(serverKey)
	if serverKey == "" {
		return false
	}
	signatureKey := strings.ToLower(strings.TrimSpace(input.SignatureKey))
	if signatureKey == "" {
		return false
	}

	raw := strings.TrimSpace(input.OrderID) + strings.TrimSpace(input.StatusCode) + strings.TrimSpace(input.GrossAmount) + serverKey
	hash := sha512.Sum512([]byte(raw))
	expected := hex.EncodeToString(hash[:])
	return signatureKey == strings.ToLower(expected)
}

func buildOrderID(customerID string) string {
	cleaned := strings.ReplaceAll(strings.TrimSpace(customerID), "-", "")
	if len(cleaned) > 12 {
		cleaned = cleaned[:12]
	}
	if cleaned == "" {
		cleaned = "customer"
	}
	return fmt.Sprintf("WED-%s-%d", cleaned, time.Now().UnixNano())
}

func normalizeMidtransStatus(transactionStatus, fraudStatus string) string {
	status := strings.ToLower(strings.TrimSpace(transactionStatus))
	fraud := strings.ToLower(strings.TrimSpace(fraudStatus))

	switch status {
	case "capture":
		if fraud == "challenge" {
			return "pending"
		}
		return "paid"
	case "settlement":
		return "paid"
	case "pending":
		return "pending"
	case "deny", "cancel", "expire", "failure":
		return "failed"
	case "refund", "partial_refund", "chargeback", "partial_chargeback":
		return "refunded"
	default:
		return "pending"
	}
}

func paidAtForStatus(status string, existing *time.Time) *time.Time {
	if status != "paid" {
		return nil
	}
	if existing != nil {
		return existing
	}
	now := time.Now().UTC()
	return &now
}

func marshalPaymentMeta(meta paymentMeta) (string, error) {
	encoded, err := json.Marshal(meta)
	if err != nil {
		return "", fmt.Errorf("encode payment meta: %w", err)
	}
	return string(encoded), nil
}

func parsePaymentMeta(raw string) (paymentMeta, error) {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return paymentMeta{}, nil
	}

	var meta paymentMeta
	if err := json.Unmarshal([]byte(raw), &meta); err == nil {
		return meta, nil
	}

	if strings.HasPrefix(raw, "midtrans:") {
		return paymentMeta{Provider: "midtrans", OrderID: strings.TrimPrefix(raw, "midtrans:")}, nil
	}

	return paymentMeta{Provider: "midtrans", OrderID: raw}, nil
}
