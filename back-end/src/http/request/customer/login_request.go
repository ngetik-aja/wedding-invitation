package customerrequest

import (
	"strings"

	"github.com/gin-gonic/gin"
	httpRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request"
)

type loginPayload struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginRequest struct {
	Email    string
	Password string
}

func NewLoginRequest(c *gin.Context) (LoginRequest, any, error) {
	var payload loginPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		return LoginRequest{}, payload, err
	}

	if err := httpRequest.ValidateStruct(payload); err != nil {
		return LoginRequest{}, payload, err
	}

	return LoginRequest{
		Email:    strings.TrimSpace(payload.Email),
		Password: strings.TrimSpace(payload.Password),
	}, payload, nil
}
