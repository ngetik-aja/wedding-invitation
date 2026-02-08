package app

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"

	"github.com/proxima-labs/wedding-invitation-back-end/src/auth"
	"github.com/proxima-labs/wedding-invitation-back-end/src/db"
	"github.com/proxima-labs/wedding-invitation-back-end/src/http/routes"
	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
	adminsvc "github.com/proxima-labs/wedding-invitation-back-end/src/service/admin"
	customersvc "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
)

func Run() error {
	ctx := context.Background()

	_ = godotenv.Load()

	pool, err := db.NewPool(ctx)
	if err != nil {
		return fmt.Errorf("db: %w", err)
	}
	defer pool.Close()

	baseDomain := os.Getenv("BASE_DOMAIN")
	if baseDomain == "" {
		log.Println("BASE_DOMAIN not set; custom-domain lookup only")
	}

	jwtSecret := os.Getenv("ADMIN_JWT_SECRET")
	if jwtSecret == "" {
		return fmt.Errorf("ADMIN_JWT_SECRET is required")
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

	customerService := &customersvc.CustomerService{Repo: customerRepo}
	invitationService := &customersvc.InvitationService{Repo: invitationRepo}
	registerService := &customersvc.RegisterService{CustomerRepo: customerRepo, InvitationRepo: invitationRepo, BaseDomain: baseDomain}
	adminAuthService := &adminsvc.AuthService{Repo: userRepo, Config: jwtConfig}
	adminUserService := &adminsvc.UserService{Repo: userRepo}
	adminInvitationService := &adminsvc.InvitationService{Repo: invitationRepo, CustomerRepo: customerRepo, BaseDomain: baseDomain}

	router := routes.SetupRouter(pool, baseDomain, jwtConfig, routes.Services{
		Customer:        customerService,
		Invitation:      invitationService,
		Register:        registerService,
		AdminAuth:       adminAuthService,
		AdminUser:       adminUserService,
		AdminInvitation: adminInvitationService,
	})

	server := &http.Server{
		Addr:              ":8080",
		Handler:           router,
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Println("server listening on :8080")
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		return fmt.Errorf("server: %w", err)
	}

	return nil
}
