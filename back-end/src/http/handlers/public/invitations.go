package public

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	publicMiddleware "github.com/proxima-labs/wedding-invitation-back-end/src/http/middleware/public"
	publicRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request/public"
)

func GetInvitationHandler(c *gin.Context) {
	tenant, ok := publicMiddleware.GetTenant(c)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "tenant missing"})
		return
	}

	req, err := publicRequest.NewInvitationSlugRequest(c)
	if err != nil {
		if errors.Is(err, publicRequest.ErrMissingSlug) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "missing invitation slug"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	content, ok, err := invitationSvc.GetPublishedContent(c.Request.Context(), tenant.ID, req.Slug)
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
