package admin

import (
	"net/http"

	"github.com/gin-gonic/gin"
	adminmw "github.com/proxima-labs/wedding-invitation-back-end/internal/http/middleware/admin"
	adminsvc "github.com/proxima-labs/wedding-invitation-back-end/internal/service/admin"
)

type UserHandler struct {
	Service *adminsvc.UserService
}

type meResponse struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	CreatedAt string `json:"created_at"`
}

func (h *UserHandler) Me(c *gin.Context) {
	claims, ok := adminmw.Get(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	user, found, err := h.Service.GetByID(c.Request.Context(), claims.UserID)
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
