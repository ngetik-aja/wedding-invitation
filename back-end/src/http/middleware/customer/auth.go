package customer

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/proxima-labs/wedding-invitation-back-end/src/auth"
)

const contextKey = "customer_id"

func Auth(cfg auth.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing authorization"})
			return
		}
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid authorization"})
			return
		}

		claims, err := auth.ParseAccessToken(cfg, parts[1])
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			return
		}

		c.Set(contextKey, claims.UserID)
		c.Next()
	}
}

func GetCustomerID(c *gin.Context) (string, bool) {
	val, ok := c.Get(contextKey)
	if !ok {
		return "", false
	}
	id, ok := val.(string)
	return id, ok && id != ""
}
