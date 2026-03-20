package customer

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/proxima-labs/wedding-invitation-back-end/src/auth"
	customerService "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
)

var (
	authService       *customerService.AuthService
	invitationService *customerService.InvitationService
	paymentService    *customerService.PaymentService
	planService       *customerService.PlanService
	planEnforcer      *customerService.PlanEnforcer
	jwtConfig         auth.Config
)

var ErrHandlersNotConfigured = errors.New("customer handlers not configured")

type Services struct {
	Auth       *customerService.AuthService
	Invitation *customerService.InvitationService
	Payment    *customerService.PaymentService
	Plan       *customerService.PlanService
	Enforcer   *customerService.PlanEnforcer
	JwtConfig  auth.Config
}

func ConfigureServices(s Services) {
	authService = s.Auth
	invitationService = s.Invitation
	paymentService = s.Payment
	planService = s.Plan
	planEnforcer = s.Enforcer
	jwtConfig = s.JwtConfig
}

func JwtConfig() auth.Config {
	return jwtConfig
}

func writeServiceUnavailable(c *gin.Context) {
	c.JSON(http.StatusInternalServerError, gin.H{"error": "handler services not configured"})
}
