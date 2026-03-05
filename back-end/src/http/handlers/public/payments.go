package public

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	httpRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request"
	publicRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request/public"
	customerService "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
)

func MidtransWebhookHandler(c *gin.Context) {
	if paymentSvc == nil {
		writeServiceUnavailable(c)
		return
	}

	req, payload, err := publicRequest.NewMidtransWebhookRequest(c)
	if err != nil {
		httpRequest.WriteValidationError(c, payload, err)
		return
	}

	result, err := paymentSvc.HandleMidtransWebhook(c.Request.Context(), req.Input)
	if err != nil {
		switch {
		case errors.Is(err, customerService.ErrInvalidMidtransSignature):
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid midtrans signature"})
		case errors.Is(err, customerService.ErrPaymentNotFound), errors.Is(err, customerService.ErrMidtransOrderNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "payment not found"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to process midtrans webhook"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":      "ok",
		"payment_id":  result.PaymentID,
		"paid_status": result.Status,
		"paid_at":     result.PaidAt,
	})
}
