package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/proxima-labs/wedding-invitation-back-end/internal/auth"
	"github.com/proxima-labs/wedding-invitation-back-end/internal/db"
	handlers "github.com/proxima-labs/wedding-invitation-back-end/internal/http/handlers"
	adminhandlers "github.com/proxima-labs/wedding-invitation-back-end/internal/http/handlers/admin"
	publichandlers "github.com/proxima-labs/wedding-invitation-back-end/internal/http/handlers/public"
	adminmw "github.com/proxima-labs/wedding-invitation-back-end/internal/http/middleware/admin"
	middleware "github.com/proxima-labs/wedding-invitation-back-end/internal/http/middleware"
	publicmw "github.com/proxima-labs/wedding-invitation-back-end/internal/http/middleware/public"
	"github.com/proxima-labs/wedding-invitation-back-end/internal/repository"
	adminsvc "github.com/proxima-labs/wedding-invitation-back-end/internal/service/admin"
	globalsvc "github.com/proxima-labs/wedding-invitation-back-end/internal/service/global"
)

func main() {
	ctx := context.Background()

	pool, err := db.NewPool(ctx)
	if err != nil {
		log.Fatalf("db: %v", err)
	}
	defer pool.Close()

	baseDomain := os.Getenv("BASE_DOMAIN")
	if baseDomain == "" {
		log.Println("BASE_DOMAIN not set; custom-domain lookup only")
	}

	jwtSecret := os.Getenv("ADMIN_JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("ADMIN_JWT_SECRET is required")
	}

	jwtConfig := auth.Config{
		Issuer:       "wedding-invitation-admin",
		AccessSecret: []byte(jwtSecret),
		AccessTTL:    15 * time.Minute,
		RefreshTTL:   7 * 24 * time.Hour,
	}

	customerRepo := &repository.CustomerRepository{DB: pool}
	invitationRepo := &repository.InvitationRepository{DB: pool}
	userRepo := &repository.UserRepository{DB: pool}

	customerService := &globalsvc.CustomerService{Repo: customerRepo}
	invitationService := &globalsvc.InvitationService{Repo: invitationRepo}
	adminAuthService := &adminsvc.AuthService{Repo: userRepo, Config: jwtConfig}
	adminInvitationService := &adminsvc.InvitationService{Repo: invitationRepo}

	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(gin.Logger())
	router.Use(middleware.CORS())

	router.GET("/healthz", handlers.Healthz)

	customerMiddleware := publicmw.CustomerMiddleware(customerService, baseDomain)
	publicInvitationHandler := &publichandlers.InvitationHandler{Service: invitationService}
	adminAuthHandler := &adminhandlers.AuthHandler{Service: adminAuthService}
	adminInvitationHandler := &adminhandlers.InvitationHandler{Service: adminInvitationService}

	api := router.Group("/api/v1")

	public := api.Group("/public")
	public.Use(customerMiddleware)
	public.GET("/invitations/:slug", publicInvitationHandler.GetPublicInvitation)

	admin := api.Group("/admin")
	admin.POST("/auth/login", adminAuthHandler.Login)
	admin.POST("/auth/refresh", adminAuthHandler.Refresh)
	admin.POST("/auth/logout", adminAuthHandler.Logout)

	admin.Use(adminmw.Auth(jwtConfig))
	admin.GET("/invitations", adminInvitationHandler.ListInvitations)
	admin.POST("/invitations", adminInvitationHandler.CreateInvitation)
	admin.GET("/invitations/:id", adminInvitationHandler.GetInvitation)
	admin.PATCH("/invitations/:id", adminInvitationHandler.UpdateInvitation)
	admin.DELETE("/invitations/:id", adminInvitationHandler.DeleteInvitation)

	server := &http.Server{
		Addr:              ":8080",
		Handler:           router,
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Println("server listening on :8080")
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("server: %v", err)
	}
}
