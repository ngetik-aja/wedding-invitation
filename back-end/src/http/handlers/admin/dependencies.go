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

func ConfigureServices(authSvc *adminService.AuthService, userSvc *adminService.UserService, invitationSvc *adminService.InvitationService, customerSvc *adminService.CustomerService, paymentSvc *adminService.PaymentService, config auth.Config) {
	authService = authSvc
	userService = userSvc
	invitationService = invitationSvc
	customerService = customerSvc
	paymentService = paymentSvc
	jwtConfig = config
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
