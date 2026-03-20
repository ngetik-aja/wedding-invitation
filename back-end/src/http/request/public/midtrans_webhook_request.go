package publicrequest

import (
	"github.com/gin-gonic/gin"
	httpRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request"
	customerService "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
)

type midtransWebhookPayload struct {
	OrderID           string `json:"order_id" binding:"required"`
	TransactionStatus string `json:"transaction_status" binding:"required"`
	FraudStatus       string `json:"fraud_status"`
	StatusCode        string `json:"status_code" binding:"required"`
	GrossAmount       string `json:"gross_amount" binding:"required"`
	SignatureKey      string `json:"signature_key" binding:"required"`
}

type MidtransWebhookRequest struct {
	Input customerService.MidtransWebhookInput
}

func NewMidtransWebhookRequest(c *gin.Context) (MidtransWebhookRequest, any, error) {
	var payload midtransWebhookPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		return MidtransWebhookRequest{}, payload, err
	}

	if err := httpRequest.ValidateStruct(payload); err != nil {
		return MidtransWebhookRequest{}, payload, err
	}

	return MidtransWebhookRequest{
		Input: customerService.MidtransWebhookInput{
			OrderID:           payload.OrderID,
			TransactionStatus: payload.TransactionStatus,
			FraudStatus:       payload.FraudStatus,
			StatusCode:        payload.StatusCode,
			GrossAmount:       payload.GrossAmount,
			SignatureKey:      payload.SignatureKey,
		},
	}, payload, nil
}
