package admin

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	adminRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request/admin"
)

func ListPaymentsHandler(c *gin.Context) {
	if !ensureService(c, paymentService) {
		return
	}

	req, err := adminRequest.NewListPaymentsRequest(c)
	if err != nil {
		switch {
		case errors.Is(err, adminRequest.ErrInvalidLimit):
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid limit"})
		case errors.Is(err, adminRequest.ErrInvalidPaymentOffset):
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid offset"})
		case errors.Is(err, adminRequest.ErrInvalidPaymentStatus):
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid status"})
		default:
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		}
		return
	}

	result, err := paymentService.List(c.Request.Context(), req.Filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list payments"})
		return
	}

	c.JSON(http.StatusOK, result)
}
