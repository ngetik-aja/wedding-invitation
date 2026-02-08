package admin

import (
	"github.com/gin-gonic/gin"

	"github.com/proxima-labs/wedding-invitation-back-end/src/auth"
	adminhandlers "github.com/proxima-labs/wedding-invitation-back-end/src/http/handlers/admin"
	adminmw "github.com/proxima-labs/wedding-invitation-back-end/src/http/middleware/admin"
	adminsvc "github.com/proxima-labs/wedding-invitation-back-end/src/service/admin"
)

type Services struct {
	Auth       *adminsvc.AuthService
	User       *adminsvc.UserService
	Invitation *adminsvc.InvitationService
}

func RegisterRoutes(group *gin.RouterGroup, services Services, jwtConfig auth.Config) {
	adminAuthHandler := &adminhandlers.AuthHandler{Service: services.Auth}
	adminUserHandler := &adminhandlers.UserHandler{Service: services.User}
	adminInvitationHandler := &adminhandlers.InvitationHandler{Service: services.Invitation}

	group.POST("/auth/login", adminAuthHandler.Login)
	group.POST("/auth/refresh", adminAuthHandler.Refresh)
	group.POST("/auth/logout", adminAuthHandler.Logout)

	group.Use(adminmw.Auth(jwtConfig))
	group.GET("/me", adminUserHandler.Me)
	group.GET("/invitations", adminInvitationHandler.ListInvitations)
	group.POST("/invitations", adminInvitationHandler.CreateInvitation)
	group.GET("/invitations/:id", adminInvitationHandler.GetInvitation)
	group.PATCH("/invitations/:id", adminInvitationHandler.UpdateInvitation)
	group.DELETE("/invitations/:id", adminInvitationHandler.DeleteInvitation)
}
