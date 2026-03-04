package external

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

const defaultMidtransBaseURL = "https://api.sandbox.midtrans.com"

type MidtransService struct {
	baseURL   string
	clientKey string
	serverKey string
	client    *http.Client
}

type MidtransCreateTransactionInput struct {
	OrderID  string
	Amount   int
	Currency string
	Email    string
	FullName string
	PlanCode string
	PlanName string
}

type MidtransCreateTransactionResult struct {
	Token       string
	RedirectURL string
}

type MidtransTransactionStatus struct {
	TransactionStatus string
	FraudStatus       string
}

type midtransCreateTransactionRequest struct {
	TransactionDetails midtransTransactionDetails `json:"transaction_details"`
	CustomerDetails    midtransCustomerDetails    `json:"customer_details"`
	ItemDetails        []midtransItemDetails      `json:"item_details,omitempty"`
}

type midtransTransactionDetails struct {
	OrderID     string `json:"order_id"`
	GrossAmount int    `json:"gross_amount"`
}

type midtransCustomerDetails struct {
	FirstName string `json:"first_name,omitempty"`
	LastName  string `json:"last_name,omitempty"`
	Email     string `json:"email,omitempty"`
}

type midtransItemDetails struct {
	ID       string `json:"id,omitempty"`
	Price    int    `json:"price"`
	Quantity int    `json:"quantity"`
	Name     string `json:"name,omitempty"`
}

type midtransCreateTransactionResponse struct {
	Token       string `json:"token"`
	RedirectURL string `json:"redirect_url"`
}

type midtransStatusResponse struct {
	TransactionStatus string `json:"transaction_status"`
	FraudStatus       string `json:"fraud_status"`
}

func NewMidtransService(baseURL, clientKey, serverKey string, client *http.Client) *MidtransService {
	baseURL = strings.TrimSpace(baseURL)
	if baseURL == "" {
		baseURL = defaultMidtransBaseURL
	}
	if client == nil {
		client = &http.Client{Timeout: 20 * time.Second}
	}

	return &MidtransService{
		baseURL:   strings.TrimRight(baseURL, "/"),
		clientKey: strings.TrimSpace(clientKey),
		serverKey: strings.TrimSpace(serverKey),
		client:    client,
	}
}

func (s *MidtransService) BaseURL() string {
	return s.baseURL
}

func (s *MidtransService) ClientKey() string {
	return s.clientKey
}

func (s *MidtransService) ServerKey() string {
	return s.serverKey
}

func (s *MidtransService) CreateTransaction(ctx context.Context, input MidtransCreateTransactionInput) (MidtransCreateTransactionResult, error) {
	firstName, lastName := splitFullName(input.FullName)
	planCode := strings.TrimSpace(input.PlanCode)
	planName := strings.TrimSpace(input.PlanName)
	if planName == "" {
		planName = planCode
	}
	if planName == "" {
		planName = "Undangan"
	}

	payload := midtransCreateTransactionRequest{
		TransactionDetails: midtransTransactionDetails{
			OrderID:     strings.TrimSpace(input.OrderID),
			GrossAmount: input.Amount,
		},
		CustomerDetails: midtransCustomerDetails{
			FirstName: firstName,
			LastName:  lastName,
			Email:     strings.TrimSpace(input.Email),
		},
		ItemDetails: []midtransItemDetails{{
			ID:       planCode,
			Price:    input.Amount,
			Quantity: 1,
			Name:     "Paket " + planName,
		}},
	}

	var response midtransCreateTransactionResponse
	if err := s.Post(ctx, "/snap/v1/transactions", payload, &response); err != nil {
		return MidtransCreateTransactionResult{}, err
	}

	return MidtransCreateTransactionResult{
		Token:       response.Token,
		RedirectURL: response.RedirectURL,
	}, nil
}

func (s *MidtransService) GetTransactionStatus(ctx context.Context, orderID string) (MidtransTransactionStatus, error) {
	orderID = strings.TrimSpace(orderID)
	if orderID == "" {
		return MidtransTransactionStatus{}, fmt.Errorf("order id is empty")
	}

	var response midtransStatusResponse
	if err := s.Get(ctx, "/v2/"+url.PathEscape(orderID)+"/status", &response); err != nil {
		return MidtransTransactionStatus{}, err
	}

	return MidtransTransactionStatus{
		TransactionStatus: strings.TrimSpace(response.TransactionStatus),
		FraudStatus:       strings.TrimSpace(response.FraudStatus),
	}, nil
}

func (s *MidtransService) Post(ctx context.Context, path string, payload any, out any) error {
	return s.doJSON(ctx, http.MethodPost, path, payload, out)
}

func (s *MidtransService) Get(ctx context.Context, path string, out any) error {
	return s.doJSON(ctx, http.MethodGet, path, nil, out)
}

func (s *MidtransService) doJSON(ctx context.Context, method, path string, payload any, out any) error {
	if strings.TrimSpace(s.serverKey) == "" {
		return fmt.Errorf("midtrans server key is empty")
	}

	requestURL := s.resolveURL(path)

	var bodyReader io.Reader
	if payload != nil {
		encoded, err := json.Marshal(payload)
		if err != nil {
			return fmt.Errorf("marshal payload: %w", err)
		}
		bodyReader = bytes.NewReader(encoded)
	}

	req, err := http.NewRequestWithContext(ctx, method, requestURL, bodyReader)
	if err != nil {
		return fmt.Errorf("build request: %w", err)
	}

	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Basic "+base64.StdEncoding.EncodeToString([]byte(s.serverKey+":")))

	resp, err := s.client.Do(req)
	if err != nil {
		return fmt.Errorf("request midtrans: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("read response: %w", err)
	}

	if resp.StatusCode >= http.StatusBadRequest {
		return fmt.Errorf("midtrans %s %s failed: status=%d body=%s", method, requestURL, resp.StatusCode, strings.TrimSpace(string(respBody)))
	}

	if out == nil || len(bytes.TrimSpace(respBody)) == 0 {
		return nil
	}

	if err := json.Unmarshal(respBody, out); err != nil {
		return fmt.Errorf("decode response: %w", err)
	}

	return nil
}

func (s *MidtransService) resolveURL(path string) string {
	path = strings.TrimSpace(path)
	if strings.HasPrefix(path, "http://") || strings.HasPrefix(path, "https://") {
		return path
	}

	if path == "" {
		return s.baseURL
	}
	if strings.HasPrefix(path, "/") {
		return s.baseURL + path
	}

	return s.baseURL + "/" + path
}

func splitFullName(fullName string) (string, string) {
	parts := strings.Fields(strings.TrimSpace(fullName))
	if len(parts) == 0 {
		return "", ""
	}
	if len(parts) == 1 {
		return parts[0], ""
	}
	return parts[0], strings.Join(parts[1:], " ")
}
