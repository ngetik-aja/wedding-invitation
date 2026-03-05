package customer

import (
	"github.com/gin-gonic/gin"

	customerHandlers "github.com/proxima-labs/wedding-invitation-back-end/src/http/handlers/customer"
)

func RegisterRoutes(group *gin.RouterGroup) {
	group.POST("/register", customerHandlers.RegisterHandler)
	group.POST("/login", customerHandlers.LoginHandler)
	group.GET("/invitations/:id", customerHandlers.GetInvitationHandler)
	group.PATCH("/invitations/:id", customerHandlers.UpdateInvitationHandler)
	group.POST("/payments", customerHandlers.CreatePaymentHandler)
	group.GET("/payments/progress", customerHandlers.PaymentProgressHandler)
}
