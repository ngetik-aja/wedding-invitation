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
	adminHandlers "github.com/proxima-labs/wedding-invitation-back-end/src/http/handlers/admin"
	customerHandlers "github.com/proxima-labs/wedding-invitation-back-end/src/http/handlers/customer"
	publicHandlers "github.com/proxima-labs/wedding-invitation-back-end/src/http/handlers/public"
	"github.com/proxima-labs/wedding-invitation-back-end/src/http/routes"
	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
	serviceBootstrap "github.com/proxima-labs/wedding-invitation-back-end/src/service"
	"github.com/proxima-labs/wedding-invitation-back-end/src/service/external"
)

func buildHandler(ctx context.Context) (http.Handler, func() error, error) {
	_ = godotenv.Load()

	dbConn, err := config.NewDatabase(ctx)
	if err != nil {
		return nil, nil, fmt.Errorf("db: %w", err)
	}

	sqlDB, err := dbConn.DB()
	if err != nil {
		return nil, nil, fmt.Errorf("sql db: %w", err)
	}

	baseDomain := config.GetEnv("BASE_DOMAIN")
	if baseDomain == "" {
		log.Println("BASE_DOMAIN not set; custom-domain lookup only")
	}

	jwtSecret, err := config.RequireEnv("ADMIN_JWT_SECRET")
	if err != nil {
		_ = sqlDB.Close()
		return nil, nil, err
	}

	jwtConfig := auth.Config{
		Issuer:       "wedding-invitation-admin",
		AccessSecret: []byte(jwtSecret),
		AccessTTL:    15 * time.Minute,
		RefreshTTL:   7 * 24 * time.Hour,
	}

	midtransConfig := config.BuildMidtransConfig()
	var midtransService *external.MidtransService
	if !midtransConfig.IsConfigured() {
		log.Println("MIDTRANS_CLIENT_KEY or MIDTRANS_SERVER_KEY not set; customer payment API will be unavailable")
	} else {
		midtransService = external.NewMidtransService(
			midtransConfig.BaseURL,
			midtransConfig.ClientKey,
			midtransConfig.ServerKey,
			nil,
		)
		log.Printf("midtrans base url: %s", midtransConfig.BaseURL)
	}

	repos := repository.NewRegistry(dbConn)
	svc := serviceBootstrap.NewRegistry(repos, baseDomain, jwtConfig, midtransService)

	svc.Register.Slugify = Slugify
	svc.Register.EnsureUniqueSlug = EnsureUniqueSlug
	svc.Invitation.Slugify = Slugify
	svc.AdminInvitation.Slugify = Slugify
	svc.AdminInvitation.EnsureUniqueSlug = EnsureUniqueSlug

	customerHandlers.ConfigureServices(svc.Register, svc.CustomerLogin, svc.Invitation, svc.CustomerPayment)
	adminHandlers.ConfigureServices(svc.AdminAuth, svc.AdminUser, svc.AdminInvitation, svc.AdminCustomer, jwtConfig)
	publicHandlers.ConfigureServices(svc.Customer, svc.Invitation, baseDomain)

	router := routes.SetupRouter(dbConn)

	cleanup := func() error {
		return sqlDB.Close()
	}

	return router, cleanup, nil
}
