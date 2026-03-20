package admin

import (
	"time"

	"github.com/gin-gonic/gin"

	adminHandlers "github.com/proxima-labs/wedding-invitation-back-end/src/http/handlers/admin"
	middleware "github.com/proxima-labs/wedding-invitation-back-end/src/http/middleware"
	adminMiddleware "github.com/proxima-labs/wedding-invitation-back-end/src/http/middleware/admin"
)

func RegisterRoutes(group *gin.RouterGroup) {
	authLimit := middleware.RateLimit(10, time.Minute)
	group.POST("/auth/login", authLimit, adminHandlers.LoginHandler)
	group.POST("/auth/refresh", authLimit, adminHandlers.RefreshHandler)
	group.POST("/auth/logout", authLimit, adminHandlers.LogoutHandler)

	group.Use(adminMiddleware.Auth(adminHandlers.JwtConfig()))
	group.GET("/me", adminHandlers.MeHandler)
	group.GET("/customers", adminHandlers.ListCustomersHandler)
	group.GET("/payments", adminHandlers.ListPaymentsHandler)
	group.GET("/invitations", adminHandlers.ListInvitationsHandler)
	group.POST("/invitations", adminHandlers.CreateInvitationHandler)
	group.GET("/invitations/:id", adminHandlers.GetInvitationHandler)
	group.PATCH("/invitations/:id", adminHandlers.UpdateInvitationHandler)
	group.DELETE("/invitations/:id", adminHandlers.DeleteInvitationHandler)
}
