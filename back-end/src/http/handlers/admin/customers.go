package admin

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	adminRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request/admin"
)

func ListCustomersHandler(c *gin.Context) {
	if !ensureService(c, customerService) {
		return
	}

	req, err := adminRequest.NewListCustomersRequest(c)
	if err != nil {
		if errors.Is(err, adminRequest.ErrInvalidLimit) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid limit"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	result, err := customerService.List(c.Request.Context(), req.Limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list customers"})
		return
	}

	c.JSON(http.StatusOK, result)
}
