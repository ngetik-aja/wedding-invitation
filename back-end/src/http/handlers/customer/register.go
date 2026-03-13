package customer

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	httpRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request"
	customerRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request/customer"
)

func RegisterHandler(c *gin.Context) {
	if registerService == nil {
		writeServiceUnavailable(c)
		return
	}

	req, payload, err := customerRequest.NewRegisterRequest(c)
	if err != nil {
		if errors.Is(err, customerRequest.ErrInvalidRegisterEventDate) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid event_date"})
			return
		}
		httpRequest.WriteValidationError(c, payload, err)
		return
	}

	customerID, invitationID, slug, domain, err := registerService.Register(c.Request.Context(), req.Input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to register"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"customer_id":   customerID,
		"invitation_id": invitationID,
		"slug":          slug,
		"domain":        domain,
	})
}
