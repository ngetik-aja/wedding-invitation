package customer

import (
	"net/http"

	"github.com/gin-gonic/gin"
	httpRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request"
	customerRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request/customer"
	customerService "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
)

func LoginHandler(c *gin.Context) {
	if loginService == nil {
		writeServiceUnavailable(c)
		return
	}

	req, payload, err := customerRequest.NewLoginRequest(c)
	if err != nil {
		httpRequest.WriteValidationError(c, payload, err)
		return
	}

	customerID, invitationID, slug, domain, err := loginService.Login(c.Request.Context(), req.Email, req.Password)
	if err != nil {
		switch err {
		case customerService.ErrInvalidCredentials:
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		case customerService.ErrInvitationNotFound:
			c.JSON(http.StatusNotFound, gin.H{"error": "invitation not found"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to login"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"customer_id":   customerID,
		"invitation_id": invitationID,
		"slug":          slug,
		"domain":        domain,
	})
}
