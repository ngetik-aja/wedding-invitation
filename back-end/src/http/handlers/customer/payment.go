package customer

import (
	"net/http"

	"github.com/gin-gonic/gin"
	httpRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request"
	customerRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request/customer"
	customerMiddleware "github.com/proxima-labs/wedding-invitation-back-end/src/http/middleware/customer"
	customerService "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
)

func CreatePaymentHandler(c *gin.Context) {
	if paymentService == nil {
		writeServiceUnavailable(c)
		return
	}

	customerID, ok := customerMiddleware.GetCustomerID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	req, payload, err := customerRequest.NewCreatePaymentRequest(c, customerID)
	if err != nil {
		httpRequest.WriteValidationError(c, payload, err)
		return
	}

	result, err := paymentService.Create(c.Request.Context(), req.Input)
	if err != nil {
		switch err {
		case customerService.ErrPaymentServiceNotConfigured, customerService.ErrMidtransNotConfigured:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "payment service unavailable"})
		case customerService.ErrCustomerNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "customer not found"})
		case customerService.ErrPlanNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "plan not found"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create payment"})
		}
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"payment_id":          result.PaymentID,
		"status":              result.Status,
		"amount":              result.Amount,
		"currency":            result.Currency,
		"midtrans_order_id":   result.MidtransOrderID,
		"midtrans_client_key": result.MidtransClientKey,
		"midtrans_token":      result.MidtransToken,
		"midtrans_redirect":   result.MidtransRedirect,
	})
}

func PaymentProgressHandler(c *gin.Context) {
	if paymentService == nil {
		writeServiceUnavailable(c)
		return
	}

	customerID, ok := customerMiddleware.GetCustomerID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	req, err := customerRequest.NewPaymentProgressRequest(c, customerID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	result, err := paymentService.Progress(c.Request.Context(), req.Input)
	if err != nil {
		switch err {
		case customerService.ErrPaymentServiceNotConfigured, customerService.ErrMidtransNotConfigured:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "payment service unavailable"})
		case customerService.ErrPaymentNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "payment not found"})
		case customerService.ErrMidtransOrderNotFound:
			c.JSON(http.StatusBadRequest, gin.H{"error": "midtrans order id not found"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch payment progress"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"payment_id":        result.PaymentID,
		"status":            result.Status,
		"midtrans_status":   result.MidtransStatus,
		"paid_at":           result.PaidAt,
		"midtrans_order_id": result.MidtransOrderID,
		"midtrans_redirect": result.RedirectURL,
	})
}
