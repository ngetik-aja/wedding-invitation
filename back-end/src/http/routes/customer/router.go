package customer

import (
	"github.com/gin-gonic/gin"

	customhandlers "github.com/proxima-labs/wedding-invitation-back-end/src/http/handlers/customer"
	customersvc "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
)

type Services struct {
	Register   *customersvc.RegisterService
	Invitation *customersvc.InvitationService
}

func RegisterRoutes(group *gin.RouterGroup, services Services) {
	customerRegisterHandler := &customhandlers.RegisterHandler{Service: services.Register}
	customerInvitationHandler := &customhandlers.InvitationHandler{Service: services.Invitation}

	group.POST("/register", customerRegisterHandler.Register)
	group.GET("/invitations/:id", customerInvitationHandler.GetInvitation)
	group.PATCH("/invitations/:id", customerInvitationHandler.UpdateInvitation)
}
