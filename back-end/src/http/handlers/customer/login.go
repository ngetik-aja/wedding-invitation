package customer

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/proxima-labs/wedding-invitation-back-end/src/http/handlers/validation"
	customersvc "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
)

type LoginHandler struct {
	Service *customersvc.LoginService
}

type loginPayload struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func (h *LoginHandler) Login(c *gin.Context) {
	var payload loginPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		validation.WriteValidationError(c, payload, err)
		return
	}

	payload.Email = strings.TrimSpace(payload.Email)
	payload.Password = strings.TrimSpace(payload.Password)

	if err := validation.ValidateStruct(payload); err != nil {
		validation.WriteValidationError(c, payload, err)
		return
	}

	customerID, invitationID, slug, domain, err := h.Service.Login(c.Request.Context(), payload.Email, payload.Password)
	if err != nil {
		switch err {
		case customersvc.ErrInvalidCredentials:
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		case customersvc.ErrInvitationNotFound:
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
