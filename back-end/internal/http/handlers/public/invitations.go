package public

import (
	"net/http"

	"github.com/gin-gonic/gin"
	publicmw "github.com/proxima-labs/wedding-invitation-back-end/internal/http/middleware/public"
	customersvc "github.com/proxima-labs/wedding-invitation-back-end/internal/service/customer"
)

type InvitationHandler struct {
	Service *customersvc.InvitationService
}

func (h *InvitationHandler) GetInvitation(c *gin.Context) {
	customer, ok := publicmw.GetCustomer(c)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "customer missing"})
		return
	}

	slug := c.Param("slug")
	if slug == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing invitation slug"})
		return
	}

	content, ok, err := h.Service.GetPublishedContent(c.Request.Context(), customer.ID, slug)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load invitation"})
		return
	}
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"error": "invitation not found"})
		return
	}

	c.JSON(http.StatusOK, content)
}
