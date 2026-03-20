package public

import (
	"github.com/gin-gonic/gin"

	publicHandlers "github.com/proxima-labs/wedding-invitation-back-end/src/http/handlers/public"
)

func RegisterRoutes(group *gin.RouterGroup) {
	group.GET("/plans", publicHandlers.ListPlansHandler)
	group.POST("/payments/midtrans/webhook", publicHandlers.MidtransWebhookHandler)

	publicWithTenant := group.Group("")
	publicWithTenant.Use(publicHandlers.TenantMiddleware())
	publicWithTenant.GET("/invitations/:slug", publicHandlers.GetInvitationHandler)
	publicWithTenant.GET("/invitation/:slug", publicHandlers.GetInvitationHandler)
	publicWithTenant.POST("/invitations/:slug/rsvps", publicHandlers.CreateRsvpHandler)
	publicWithTenant.GET("/invitations/:slug/wishes", publicHandlers.ListWishesHandler)
	publicWithTenant.POST("/invitations/:slug/wishes", publicHandlers.CreateWishHandler)

	demoWithTenant := group.Group("/:owner")
	demoWithTenant.Use(publicHandlers.TenantMiddleware())
	demoWithTenant.GET("/invitations/:slug", publicHandlers.GetInvitationHandler)
	demoWithTenant.GET("/invitation/:slug", publicHandlers.GetInvitationHandler)
	demoWithTenant.POST("/invitations/:slug/rsvps", publicHandlers.CreateRsvpHandler)
	demoWithTenant.GET("/invitations/:slug/wishes", publicHandlers.ListWishesHandler)
	demoWithTenant.POST("/invitations/:slug/wishes", publicHandlers.CreateWishHandler)
}
