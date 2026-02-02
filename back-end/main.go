package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/proxima-labs/wedding-invitation-back-end/internal/auth"
	"github.com/proxima-labs/wedding-invitation-back-end/internal/db"
	handlers "github.com/proxima-labs/wedding-invitation-back-end/internal/http/handlers"
	adminhandlers "github.com/proxima-labs/wedding-invitation-back-end/internal/http/handlers/admin"
	customhandlers "github.com/proxima-labs/wedding-invitation-back-end/internal/http/handlers/customer"
	publichandlers "github.com/proxima-labs/wedding-invitation-back-end/internal/http/handlers/public"
	middleware "github.com/proxima-labs/wedding-invitation-back-end/internal/http/middleware"
	adminmw "github.com/proxima-labs/wedding-invitation-back-end/internal/http/middleware/admin"
	publicmw "github.com/proxima-labs/wedding-invitation-back-end/internal/http/middleware/public"
	"github.com/proxima-labs/wedding-invitation-back-end/internal/repository"
	adminsvc "github.com/proxima-labs/wedding-invitation-back-end/internal/service/admin"
	customersvc "github.com/proxima-labs/wedding-invitation-back-end/internal/service/customer"
)

type routeInfo struct {
	Method   string
	Path     string
	Handler  string
	Handlers int
}

func initRouteLogger() func() {
	routes := make([]routeInfo, 0)
	gin.DebugPrintRouteFunc = func(method, absolutePath, handlerName string, nuHandlers int) {
		routes = append(routes, routeInfo{
			Method:   method,
			Path:     absolutePath,
			Handler:  handlerName,
			Handlers: nuHandlers,
		})
	}

	return func() {
		logGroupedRoutes(routes)
	}
}

func logGroupedRoutes(routes []routeInfo) {
	if len(routes) == 0 {
		return
	}
	groups := map[string][]routeInfo{
		"system":   {},
		"public":   {},
		"customer": {},
		"admin":    {},
		"other":    {},
	}

	for _, route := range routes {
		group := "other"
		switch {
		case strings.HasPrefix(route.Path, "/api/v1/admin"):
			group = "admin"
		case strings.HasPrefix(route.Path, "/api/v1/customer"):
			group = "customer"
		case strings.HasPrefix(route.Path, "/api/v1/public"):
			group = "public"
		case strings.HasPrefix(route.Path, "/"):
			group = "system"
		}
		groups[group] = append(groups[group], route)
	}

	order := []string{"system", "public", "customer", "admin", "other"}
	for _, name := range order {
		items := groups[name]
		if len(items) == 0 {
			continue
		}
		log.Printf("[ROUTES] %s", name)
		for _, route := range items {
			log.Printf("  %s %-30s -> %s (%d)", route.Method, route.Path, route.Handler, route.Handlers)
		}
		log.Println()
	}
}

func main() {
	ctx := context.Background()

	printRoutes := initRouteLogger()

	_ = godotenv.Load()

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

	customerService := &customersvc.CustomerService{Repo: customerRepo}
	invitationService := &customersvc.InvitationService{Repo: invitationRepo}
	registerService := &customersvc.RegisterService{CustomerRepo: customerRepo, InvitationRepo: invitationRepo, BaseDomain: baseDomain}
	adminAuthService := &adminsvc.AuthService{Repo: userRepo, Config: jwtConfig}
	adminUserService := &adminsvc.UserService{Repo: userRepo}
	adminInvitationService := &adminsvc.InvitationService{Repo: invitationRepo, CustomerRepo: customerRepo, BaseDomain: baseDomain}

	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(gin.Logger())
	router.Use(middleware.CORS())

	healthHandler := &handlers.HealthHandler{DB: pool}

	// System routes
	router.GET("/healthz", healthHandler.Healthz)

	customerMiddleware := publicmw.CustomerMiddleware(customerService, baseDomain)
	publicInvitationHandler := &publichandlers.InvitationHandler{Service: invitationService}
	customerRegisterHandler := &customhandlers.RegisterHandler{Service: registerService}
	adminAuthHandler := &adminhandlers.AuthHandler{Service: adminAuthService}
	adminUserHandler := &adminhandlers.UserHandler{Service: adminUserService}
	adminInvitationHandler := &adminhandlers.InvitationHandler{Service: adminInvitationService}

	api := router.Group("/api/v1")

	public := api.Group("/public")
	publicWithCustomer := public.Group("")
	publicWithCustomer.Use(customerMiddleware)
	publicWithCustomer.GET("/invitations/:slug", publicInvitationHandler.GetInvitation)

	// Customer routes
	customer := api.Group("/customer")
	customer.POST("/register", customerRegisterHandler.Register)

	// Admin routes
	admin := api.Group("/admin")
	admin.POST("/auth/login", adminAuthHandler.Login)
	admin.POST("/auth/refresh", adminAuthHandler.Refresh)
	admin.POST("/auth/logout", adminAuthHandler.Logout)

	admin.Use(adminmw.Auth(jwtConfig))
	admin.GET("/me", adminUserHandler.Me)
	admin.GET("/invitations", adminInvitationHandler.ListInvitations)
	admin.POST("/invitations", adminInvitationHandler.CreateInvitation)
	admin.GET("/invitations/:id", adminInvitationHandler.GetInvitation)
	admin.PATCH("/invitations/:id", adminInvitationHandler.UpdateInvitation)
	admin.DELETE("/invitations/:id", adminInvitationHandler.DeleteInvitation)

	printRoutes()

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
