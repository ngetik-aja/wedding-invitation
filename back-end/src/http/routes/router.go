package routes

import (
	"log"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	handlers "github.com/proxima-labs/wedding-invitation-back-end/src/http/handlers"
	middleware "github.com/proxima-labs/wedding-invitation-back-end/src/http/middleware"
	"github.com/proxima-labs/wedding-invitation-back-end/src/http/routes/admin"
	"github.com/proxima-labs/wedding-invitation-back-end/src/http/routes/customer"
	"github.com/proxima-labs/wedding-invitation-back-end/src/http/routes/public"
)

type routeInfo struct {
	Method   string
	Path     string
	Handler  string
	Handlers int
}

func SetupRouter(db *gorm.DB) *gin.Engine {
	printRoutes := initRouteLogger()

	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(gin.Logger())
	router.Use(middleware.CORS())

	healthHandler := &handlers.HealthHandler{DB: db}
	router.GET("/healthz", healthHandler.Healthz)

	api := router.Group("/api/v1")
	public.RegisterRoutes(api.Group("/public"))
	customer.RegisterRoutes(api.Group("/customer"))
	admin.RegisterRoutes(api.Group("/admin"))

	printRoutes()
	return router
}

func initRouteLogger() func() {
	routes := make([]routeInfo, 0)
	gin.DebugPrintRouteFunc = func(method, absolutePath, handlerName string, nuHandlers int) {
		routes = append(routes, routeInfo{Method: method, Path: absolutePath, Handler: handlerName, Handlers: nuHandlers})
	}
	return func() { logGroupedRoutes(routes) }
}

func logGroupedRoutes(routes []routeInfo) {
	if len(routes) == 0 {
		return
	}
	groups := map[string][]routeInfo{"system": {}, "public": {}, "customer": {}, "admin": {}, "other": {}}

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

	for _, name := range []string{"system", "public", "customer", "admin", "other"} {
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
