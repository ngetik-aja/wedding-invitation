package public

import (
	"github.com/gin-gonic/gin"

	publichandlers "github.com/proxima-labs/wedding-invitation-back-end/src/http/handlers/public"
	publicmw "github.com/proxima-labs/wedding-invitation-back-end/src/http/middleware/public"
	customersvc "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
)

type Services struct {
	Customer   *customersvc.CustomerService
	Invitation *customersvc.InvitationService
}

func RegisterRoutes(group *gin.RouterGroup, services Services, baseDomain string) {
	customerMiddleware := publicmw.CustomerMiddleware(services.Customer, baseDomain)
	publicInvitationHandler := &publichandlers.InvitationHandler{Service: services.Invitation}

	publicWithCustomer := group.Group("")
	publicWithCustomer.Use(customerMiddleware)
	publicWithCustomer.GET("/invitations/:slug", publicInvitationHandler.GetInvitation)
	publicWithCustomer.GET("/invitation/:slug", publicInvitationHandler.GetInvitation)

	demoWithCustomer := group.Group("/:owner")
	demoWithCustomer.Use(customerMiddleware)
	demoWithCustomer.GET("/invitations/:slug", publicInvitationHandler.GetInvitation)
	demoWithCustomer.GET("/invitation/:slug", publicInvitationHandler.GetInvitation)
}
