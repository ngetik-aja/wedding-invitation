package public

import (
	"net/http"

	"github.com/gin-gonic/gin"
	customersvc "github.com/proxima-labs/wedding-invitation-back-end/internal/service/customer"
)

type Customer struct {
	ID    string
	Email string
}

func CustomerMiddleware(customerService *customersvc.CustomerService, baseDomain string) gin.HandlerFunc {
	return func(c *gin.Context) {
		customer, ok, err := customerService.ResolveByHost(c.Request.Context(), c.Request.Host, baseDomain)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to resolve domain"})
			return
		}
		if !ok {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "domain not found"})
			return
		}

		c.Set("customer", Customer{ID: customer.ID, Email: customer.Email})
		c.Next()
	}
}

func GetCustomer(c *gin.Context) (Customer, bool) {
	value, ok := c.Get("customer")
	if !ok {
		return Customer{}, false
	}
	customer, ok := value.(Customer)
	return customer, ok
}
