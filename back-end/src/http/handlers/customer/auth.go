package customer

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/proxima-labs/wedding-invitation-back-end/src/auth"
	httpRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request"
	customerRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request/customer"
	customerService "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
)

func RegisterHandler(c *gin.Context) {
	if authService == nil {
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

	customerID, invitationID, slug, domain, err := authService.Register(c.Request.Context(), req.Input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to register"})
		return
	}

	token, err := auth.NewAccessToken(jwtConfig, customerID, req.Input.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to issue token"})
		return
	}

	refreshToken, err := authService.IssueRefreshToken(c.Request.Context(), customerService.IssueRefreshTokenInput{
		CustomerID: customerID,
		UserAgent:  c.Request.UserAgent(),
		IP:         c.ClientIP(),
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to issue token"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"token":         token,
		"refresh_token": refreshToken,
		"customer_id":   customerID,
		"invitation_id": invitationID,
		"slug":          slug,
		"domain":        domain,
	})
}

func LoginHandler(c *gin.Context) {
	if authService == nil {
		writeServiceUnavailable(c)
		return
	}

	req, payload, err := customerRequest.NewLoginRequest(c)
	if err != nil {
		httpRequest.WriteValidationError(c, payload, err)
		return
	}

	customerID, invitationID, slug, domain, email, err := authService.Login(c.Request.Context(), req.Email, req.Password)
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

	token, err := auth.NewAccessToken(jwtConfig, customerID, email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to issue token"})
		return
	}

	refreshToken, err := authService.IssueRefreshToken(c.Request.Context(), customerService.IssueRefreshTokenInput{
		CustomerID: customerID,
		UserAgent:  c.Request.UserAgent(),
		IP:         c.ClientIP(),
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to issue token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token":         token,
		"refresh_token": refreshToken,
		"customer_id":   customerID,
		"invitation_id": invitationID,
		"slug":          slug,
		"domain":        domain,
	})
}

func RefreshHandler(c *gin.Context) {
	if authService == nil {
		writeServiceUnavailable(c)
		return
	}

	var body struct {
		RefreshToken string `json:"refresh_token" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "refresh_token is required"})
		return
	}

	accessToken, err := authService.Refresh(c.Request.Context(), body.RefreshToken)
	if err != nil {
		switch err {
		case customerService.ErrInvalidRefreshToken:
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired refresh token"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to refresh token"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": accessToken})
}
