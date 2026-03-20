package customer

import (
	"time"

	"github.com/gin-gonic/gin"
	customerHandlers "github.com/proxima-labs/wedding-invitation-back-end/src/http/handlers/customer"
	middleware "github.com/proxima-labs/wedding-invitation-back-end/src/http/middleware"
	customerMiddleware "github.com/proxima-labs/wedding-invitation-back-end/src/http/middleware/customer"
)

func RegisterRoutes(group *gin.RouterGroup) {
	authLimit := middleware.RateLimit(10, time.Minute)
	group.GET("/plans", customerHandlers.ListPlansHandler)
	group.POST("/register", authLimit, customerHandlers.RegisterHandler)
	group.POST("/login", authLimit, customerHandlers.LoginHandler)
	group.POST("/refresh", authLimit, customerHandlers.RefreshHandler)

	auth := group.Group("/")
	auth.Use(customerMiddleware.Auth(customerHandlers.JwtConfig()))
	auth.GET("/invitations/:id", customerHandlers.GetInvitationHandler)
	auth.PATCH("/invitations/:id", customerHandlers.UpdateInvitationHandler)
	auth.POST("/payments", customerHandlers.CreatePaymentHandler)
	auth.GET("/payments/progress", customerHandlers.PaymentProgressHandler)
	auth.GET("/my-plan", customerHandlers.GetMyPlanHandler)
}
