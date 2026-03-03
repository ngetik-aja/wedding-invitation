package customerrequest

import (
	"errors"
	"strings"

	"github.com/gin-gonic/gin"
	httpRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request"
	customerService "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
)

var ErrMissingCustomerID = errors.New("customer_id is required")

type paymentCreatePayload struct {
	CustomerID string `json:"customer_id" binding:"required"`
	PlanCode   string `json:"plan_code" binding:"required"`
}

type CreatePaymentRequest struct {
	Input customerService.CreatePaymentInput
}

func NewCreatePaymentRequest(c *gin.Context) (CreatePaymentRequest, any, error) {
	var payload paymentCreatePayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		return CreatePaymentRequest{}, payload, err
	}

	if err := httpRequest.ValidateStruct(payload); err != nil {
		return CreatePaymentRequest{}, payload, err
	}

	return CreatePaymentRequest{
		Input: customerService.CreatePaymentInput{
			CustomerID: strings.TrimSpace(payload.CustomerID),
			PlanCode:   strings.TrimSpace(payload.PlanCode),
		},
	}, payload, nil
}

type PaymentProgressRequest struct {
	Input customerService.PaymentProgressInput
}

func NewPaymentProgressRequest(c *gin.Context) (PaymentProgressRequest, error) {
	customerID := strings.TrimSpace(c.Query("customer_id"))
	paymentID := strings.TrimSpace(c.Query("payment_id"))
	if customerID == "" {
		return PaymentProgressRequest{}, ErrMissingCustomerID
	}

	return PaymentProgressRequest{
		Input: customerService.PaymentProgressInput{
			CustomerID: customerID,
			PaymentID:  paymentID,
		},
	}, nil
}
