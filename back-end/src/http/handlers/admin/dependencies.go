package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/proxima-labs/wedding-invitation-back-end/src/auth"
	adminService "github.com/proxima-labs/wedding-invitation-back-end/src/service/admin"
)

var (
	authService       *adminService.AuthService
	userService       *adminService.UserService
	invitationService *adminService.InvitationService
	customerService   *adminService.CustomerService
	paymentService    *adminService.PaymentService
	jwtConfig         auth.Config
)

type Services struct {
	Auth       *adminService.AuthService
	User       *adminService.UserService
	Invitation *adminService.InvitationService
	Customer   *adminService.CustomerService
	Payment    *adminService.PaymentService
	JwtConfig  auth.Config
}

func ConfigureServices(s Services) {
	authService = s.Auth
	userService = s.User
	invitationService = s.Invitation
	customerService = s.Customer
	paymentService = s.Payment
	jwtConfig = s.JwtConfig
}

func JwtConfig() auth.Config {
	return jwtConfig
}

func writeServiceUnavailable(c *gin.Context) {
	c.JSON(http.StatusInternalServerError, gin.H{"error": "handler services not configured"})
}

func ensureService(c *gin.Context, service any) bool {
	if service != nil {
		return true
	}
	writeServiceUnavailable(c)
	return false
}
