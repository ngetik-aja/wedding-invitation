package middleware

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// HTTPSRedirect redirects HTTP to HTTPS when APP_ENV=production.
// Fly.io terminates TLS and sets X-Forwarded-Proto.
func HTTPSRedirect() gin.HandlerFunc {
	prod := os.Getenv("APP_ENV") == "production"
	return func(c *gin.Context) {
		if prod && c.GetHeader("X-Forwarded-Proto") == "http" {
			target := "https://" + c.Request.Host + c.Request.RequestURI
			c.Redirect(http.StatusMovedPermanently, target)
			c.Abort()
			return
		}
		c.Next()
	}
}

// MaxBodySize limits the request body to the given number of bytes.
func MaxBodySize(n int64) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, n)
		c.Next()
	}
}
