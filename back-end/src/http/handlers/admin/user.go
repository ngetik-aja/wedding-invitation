package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
	adminMiddleware "github.com/proxima-labs/wedding-invitation-back-end/src/http/middleware/admin"
)

type meResponse struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	CreatedAt string `json:"created_at"`
}

func MeHandler(c *gin.Context) {
	if !ensureService(c, userService) {
		return
	}

	claims, ok := adminMiddleware.Get(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	user, found, err := userService.GetByID(c.Request.Context(), claims.UserID)
	if err != nil || !found {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, meResponse{
		ID:        user.ID,
		Email:     user.Email,
		CreatedAt: user.CreatedAt.UTC().Format("2006-01-02T15:04:05Z07:00"),
	})
}
