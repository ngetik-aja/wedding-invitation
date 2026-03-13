package public

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	customerService "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
)

type Tenant struct {
	ID    string
	Email string
}

func TenantMiddleware(resolver *customerService.CustomerService) gin.HandlerFunc {
	return func(c *gin.Context) {
		customer, ok, err := resolver.ResolveByHost(c.Request.Context(), c.Request.Host)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to resolve domain"})
			return
		}

		if !ok {
			owner := strings.TrimSpace(c.Param("owner"))
			if owner != "" {
				customer, ok, err = resolver.ResolveByDomain(c.Request.Context(), owner)
				if err != nil {
					c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to resolve domain"})
					return
				}
			}
		}

		if !ok {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "domain not found"})
			return
		}

		c.Set("tenant", Tenant{ID: customer.ID, Email: customer.Email})
		c.Next()
	}
}

func GetTenant(c *gin.Context) (Tenant, bool) {
	value, ok := c.Get("tenant")
	if !ok {
		return Tenant{}, false
	}
	tenant, ok := value.(Tenant)
	return tenant, ok
}
