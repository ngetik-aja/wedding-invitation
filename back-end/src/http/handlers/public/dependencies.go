package public

import (
	"net/http"

	"github.com/gin-gonic/gin"
	publicMiddleware "github.com/proxima-labs/wedding-invitation-back-end/src/http/middleware/public"
	customerService "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
)

var (
	tenantResolver      *customerService.CustomerService
	invitationSvc       *customerService.InvitationService
	paymentSvc          *customerService.PaymentService
	publicInvitationSvc *customerService.PublicInvitationService
)

type Services struct {
	Customer          *customerService.CustomerService
	Invitation        *customerService.InvitationService
	Payment           *customerService.PaymentService
	PublicInvitation  *customerService.PublicInvitationService
}

func ConfigureServices(s Services) {
	tenantResolver = s.Customer
	invitationSvc = s.Invitation
	paymentSvc = s.Payment
	publicInvitationSvc = s.PublicInvitation
}

func writeServiceUnavailable(c *gin.Context) {
	c.JSON(http.StatusInternalServerError, gin.H{"error": "handler services not configured"})
}

func TenantMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		if tenantResolver == nil {
			writeServiceUnavailable(c)
			c.Abort()
			return
		}
		publicMiddleware.TenantMiddleware(tenantResolver)(c)
	}
}
