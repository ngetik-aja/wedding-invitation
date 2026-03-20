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

	jwtSecret, err := config.RequireEnv("ADMIN_JWT_SECRET")
	if err != nil {
		_ = sqlDB.Close()
		return nil, nil, err
	}

	customerJwtSecret, err := config.RequireEnv("CUSTOMER_JWT_SECRET")
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

	customerJwtConfig := auth.Config{
		Issuer:       "wedding-invitation-customer",
		AccessSecret: []byte(customerJwtSecret),
		AccessTTL:    15 * time.Minute,
		RefreshTTL:   30 * 24 * time.Hour,
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
	svc := serviceBootstrap.NewRegistry(repos, jwtConfig, customerJwtConfig, midtransService)


	customerHandlers.ConfigureServices(customerHandlers.Services{
		Auth:       svc.CustomerAuth,
		Invitation: svc.Invitation,
		Payment:    svc.CustomerPayment,
		Plan:       svc.CustomerPlan,
		Enforcer:   svc.CustomerPlanEnforce,
		JwtConfig:  customerJwtConfig,
	})
	adminHandlers.ConfigureServices(adminHandlers.Services{
		Auth:       svc.AdminAuth,
		User:       svc.AdminUser,
		Invitation: svc.AdminInvitation,
		Customer:   svc.AdminCustomer,
		Payment:    svc.AdminPayment,
		JwtConfig:  jwtConfig,
	})
	publicHandlers.ConfigureServices(publicHandlers.Services{
		Customer:         svc.Customer,
		Invitation:       svc.Invitation,
		Payment:          svc.CustomerPayment,
		PublicInvitation: svc.PublicInvitation,
		Plan:             svc.PublicPlan,
	})

	router := routes.SetupRouter(dbConn)

	cleanup := func() error {
		return sqlDB.Close()
	}

	return router, cleanup, nil
}
