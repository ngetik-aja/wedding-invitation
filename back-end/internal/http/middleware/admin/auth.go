package admin

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/proxima-labs/wedding-invitation-back-end/internal/auth"
)

type Claims struct {
	UserID string
	Email  string
}

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

		c.Set("admin", Claims{UserID: claims.UserID, Email: claims.Email})
		c.Next()
	}
}

func Get(c *gin.Context) (Claims, bool) {
	value, ok := c.Get("admin")
	if !ok {
		return Claims{}, false
	}
	claims, ok := value.(Claims)
	return claims, ok
}
