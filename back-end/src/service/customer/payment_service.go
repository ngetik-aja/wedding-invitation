package customer

import (
	"context"
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

var (
	ErrPaymentServiceNotConfigured = errors.New("payment service not configured")
	ErrMidtransNotConfigured       = errors.New("midtrans not configured")
	ErrCustomerNotFound            = errors.New("customer not found")
	ErrPlanNotFound                = errors.New("plan not found")
	ErrPaymentNotFound             = errors.New("payment not found")
	ErrMidtransOrderNotFound       = errors.New("midtrans order id not found")
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
	var paidAt *time.Time
	if normalizedStatus == "paid" {
		if payment.PaidAt != nil {
			paidAt = payment.PaidAt
		} else {
			now := time.Now().UTC()
			paidAt = &now
		}
	}

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
