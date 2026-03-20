package customer

import (
	"net/http"

	"github.com/gin-gonic/gin"
	customerMiddleware "github.com/proxima-labs/wedding-invitation-back-end/src/http/middleware/customer"
)

func GetMyPlanHandler(c *gin.Context) {
	if planEnforcer == nil {
		writeServiceUnavailable(c)
		return
	}

	customerID, ok := customerMiddleware.GetCustomerID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	planCode, limits, err := planEnforcer.GetCustomerLimitsWithCode(c.Request.Context(), customerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to retrieve plan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"plan_code": planCode,
		"limits": gin.H{
			"gallery_photos": limits.GalleryPhotos,
			"love_story":     limits.LoveStory,
			"music":          limits.Music,
			"gifts":          limits.Gifts,
			"templates":      limits.Templates,
		},
	})
}
