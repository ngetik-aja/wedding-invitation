package customerrequest

import (
	"strings"

	"github.com/gin-gonic/gin"
	httpRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request"
	customerService "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
)

type paymentCreatePayload struct {
	PlanCode string `json:"plan_code" binding:"required"`
}

type CreatePaymentRequest struct {
	Input customerService.CreatePaymentInput
}

func NewCreatePaymentRequest(c *gin.Context, customerID string) (CreatePaymentRequest, any, error) {
	var payload paymentCreatePayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		return CreatePaymentRequest{}, payload, err
	}

	if err := httpRequest.ValidateStruct(payload); err != nil {
		return CreatePaymentRequest{}, payload, err
	}

	return CreatePaymentRequest{
		Input: customerService.CreatePaymentInput{
			CustomerID: customerID,
			PlanCode:   strings.TrimSpace(payload.PlanCode),
		},
	}, payload, nil
}

type PaymentProgressRequest struct {
	Input customerService.PaymentProgressInput
}

func NewPaymentProgressRequest(c *gin.Context, customerID string) (PaymentProgressRequest, error) {
	paymentID := strings.TrimSpace(c.Query("payment_id"))
	return PaymentProgressRequest{
		Input: customerService.PaymentProgressInput{
			CustomerID: customerID,
			PaymentID:  paymentID,
		},
	}, nil
}
