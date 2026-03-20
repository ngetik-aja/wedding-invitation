package public

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func ListPlansHandler(c *gin.Context) {
	if !ensureService(c, planSvc) {
		return
	}

	result, err := planSvc.List(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list plans"})
		return
	}

	c.JSON(http.StatusOK, result)
}
