package app

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/joho/godotenv"

	"github.com/proxima-labs/wedding-invitation-back-end/src/auth"
	"github.com/proxima-labs/wedding-invitation-back-end/src/config"
	"github.com/proxima-labs/wedding-invitation-back-end/src/http/routes"
	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
	adminsvc "github.com/proxima-labs/wedding-invitation-back-end/src/service/admin"
	customersvc "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
)

func Run() error {
	ctx := context.Background()

	_ = godotenv.Load()

	dbConn, err := config.NewDatabase(ctx)
	if err != nil {
		return fmt.Errorf("db: %w", err)
	}

	sqlDB, err := dbConn.DB()
	if err != nil {
		return fmt.Errorf("sql db: %w", err)
	}
	defer sqlDB.Close()

	baseDomain := config.GetEnv("BASE_DOMAIN")
	if baseDomain == "" {
		log.Println("BASE_DOMAIN not set; custom-domain lookup only")
	}

	jwtSecret, err := config.RequireEnv("ADMIN_JWT_SECRET")
	if err != nil {
		return err
	}

	jwtConfig := auth.Config{
		Issuer:       "wedding-invitation-admin",
		AccessSecret: []byte(jwtSecret),
		AccessTTL:    15 * time.Minute,
		RefreshTTL:   7 * 24 * time.Hour,
	}

	customerRepo := &repository.CustomerRepository{DB: dbConn}
	invitationRepo := &repository.InvitationRepository{DB: dbConn}
	userRepo := &repository.UserRepository{DB: dbConn}

	customerService := &customersvc.CustomerService{Repo: customerRepo}
	invitationService := &customersvc.InvitationService{Repo: invitationRepo, CustomerRepo: customerRepo, BaseDomain: baseDomain}
	registerService := &customersvc.RegisterService{CustomerRepo: customerRepo, InvitationRepo: invitationRepo, BaseDomain: baseDomain}
	loginService := &customersvc.LoginService{CustomerRepo: customerRepo, InvitationRepo: invitationRepo}
	adminAuthService := &adminsvc.AuthService{Repo: userRepo, Config: jwtConfig}
	adminUserService := &adminsvc.UserService{Repo: userRepo}
	adminInvitationService := &adminsvc.InvitationService{Repo: invitationRepo, CustomerRepo: customerRepo, BaseDomain: baseDomain}

	router := routes.SetupRouter(dbConn, baseDomain, jwtConfig, routes.Services{
		Customer:        customerService,
		Invitation:      invitationService,
		Register:        registerService,
		CustomerLogin:   loginService,
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
