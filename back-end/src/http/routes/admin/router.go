package admin

import (
	"github.com/gin-gonic/gin"

	adminHandlers "github.com/proxima-labs/wedding-invitation-back-end/src/http/handlers/admin"
	adminMiddleware "github.com/proxima-labs/wedding-invitation-back-end/src/http/middleware/admin"
)

func RegisterRoutes(group *gin.RouterGroup) {
	group.POST("/auth/login", adminHandlers.LoginHandler)
	group.POST("/auth/refresh", adminHandlers.RefreshHandler)
	group.POST("/auth/logout", adminHandlers.LogoutHandler)

	group.Use(adminMiddleware.Auth(adminHandlers.JwtConfig()))
	group.GET("/me", adminHandlers.MeHandler)
	group.GET("/customers", adminHandlers.ListCustomersHandler)
	group.GET("/invitations", adminHandlers.ListInvitationsHandler)
	group.POST("/invitations", adminHandlers.CreateInvitationHandler)
	group.GET("/invitations/:id", adminHandlers.GetInvitationHandler)
	group.PATCH("/invitations/:id", adminHandlers.UpdateInvitationHandler)
	group.DELETE("/invitations/:id", adminHandlers.DeleteInvitationHandler)
}
