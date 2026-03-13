package adminrequest

import (
	"strings"

	"github.com/gin-gonic/gin"
	httpRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request"
)

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func NewLoginRequest(c *gin.Context) (LoginRequest, any, error) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		return LoginRequest{}, req, err
	}

	req.Email = strings.TrimSpace(req.Email)
	req.Password = strings.TrimSpace(req.Password)

	if err := httpRequest.ValidateStruct(req); err != nil {
		return LoginRequest{}, req, err
	}

	return req, req, nil
}
