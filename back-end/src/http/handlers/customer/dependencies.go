package customer

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	customerService "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
)

var (
	registerService   *customerService.RegisterService
	loginService      *customerService.LoginService
	invitationService *customerService.InvitationService
	paymentService    *customerService.PaymentService
)

var ErrHandlersNotConfigured = errors.New("customer handlers not configured")

func ConfigureServices(register *customerService.RegisterService, login *customerService.LoginService, invitation *customerService.InvitationService, payment *customerService.PaymentService) {
	registerService = register
	loginService = login
	invitationService = invitation
	paymentService = payment
}

func writeServiceUnavailable(c *gin.Context) {
	c.JSON(http.StatusInternalServerError, gin.H{"error": "handler services not configured"})
}
