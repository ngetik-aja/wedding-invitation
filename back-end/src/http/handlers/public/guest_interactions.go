package public

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	publicMiddleware "github.com/proxima-labs/wedding-invitation-back-end/src/http/middleware/public"
	httpRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request"
	publicRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request/public"
	customerService "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
)

func CreateRsvpHandler(c *gin.Context) {
	tenant, ok := publicMiddleware.GetTenant(c)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "tenant missing"})
		return
	}

	slugReq, err := publicRequest.NewInvitationSlugRequest(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing invitation slug"})
		return
	}

	req, payload, err := publicRequest.NewCreateRsvpRequest(c, tenant.ID, slugReq.Slug)
	if err != nil {
		httpRequest.WriteValidationError(c, payload, err)
		return
	}

	result, err := publicInvitationSvc.CreateRsvp(c.Request.Context(), req.Input)
	if err != nil {
		switch {
		case errors.Is(err, customerService.ErrPublicInvitationNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "invitation not found"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to submit rsvp"})
		}
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":           result.ID,
		"guest_name":   result.GuestName,
		"attendance":   result.Attendance,
		"guests_count": result.GuestsCount,
		"message":      result.Message,
		"created_at":   result.CreatedAt,
	})
}

func CreateWishHandler(c *gin.Context) {
	tenant, ok := publicMiddleware.GetTenant(c)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "tenant missing"})
		return
	}

	slugReq, err := publicRequest.NewInvitationSlugRequest(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing invitation slug"})
		return
	}

	req, payload, err := publicRequest.NewCreateWishRequest(c, tenant.ID, slugReq.Slug)
	if err != nil {
		httpRequest.WriteValidationError(c, payload, err)
		return
	}

	result, err := publicInvitationSvc.CreateWish(c.Request.Context(), req.Input)
	if err != nil {
		switch {
		case errors.Is(err, customerService.ErrPublicInvitationNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "invitation not found"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to submit wish"})
		}
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":         result.ID,
		"guest_name": result.GuestName,
		"message":    result.Message,
		"created_at": result.CreatedAt,
	})
}

func ListWishesHandler(c *gin.Context) {
	tenant, ok := publicMiddleware.GetTenant(c)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "tenant missing"})
		return
	}

	slugReq, err := publicRequest.NewInvitationSlugRequest(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing invitation slug"})
		return
	}

	req := publicRequest.NewListWishesRequest(c, tenant.ID, slugReq.Slug)
	items, err := publicInvitationSvc.ListWishes(c.Request.Context(), req.Input)
	if err != nil {
		switch {
		case errors.Is(err, customerService.ErrPublicInvitationNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "invitation not found"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load wishes"})
		}
		return
	}

	responseItems := make([]gin.H, 0, len(items))
	for _, item := range items {
		responseItems = append(responseItems, gin.H{
			"id":         item.ID,
			"guest_name": item.GuestName,
			"message":    item.Message,
			"created_at": item.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, gin.H{"items": responseItems})
}
