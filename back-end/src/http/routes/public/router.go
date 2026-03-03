package public

import (
	"github.com/gin-gonic/gin"

	publicHandlers "github.com/proxima-labs/wedding-invitation-back-end/src/http/handlers/public"
)

func RegisterRoutes(group *gin.RouterGroup) {
	publicWithTenant := group.Group("")
	publicWithTenant.Use(publicHandlers.TenantMiddleware())
	publicWithTenant.GET("/invitations/:slug", publicHandlers.GetInvitationHandler)
	publicWithTenant.GET("/invitation/:slug", publicHandlers.GetInvitationHandler)

	demoWithTenant := group.Group("/:owner")
	demoWithTenant.Use(publicHandlers.TenantMiddleware())
	demoWithTenant.GET("/invitations/:slug", publicHandlers.GetInvitationHandler)
	demoWithTenant.GET("/invitation/:slug", publicHandlers.GetInvitationHandler)
}
