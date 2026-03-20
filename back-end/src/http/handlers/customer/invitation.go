package customer

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	httpRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request"
	customerRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request/customer"
	customerMiddleware "github.com/proxima-labs/wedding-invitation-back-end/src/http/middleware/customer"
	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
	customerService "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
	"github.com/proxima-labs/wedding-invitation-back-end/src/slug"
)

func GetInvitationHandler(c *gin.Context) {
	if invitationService == nil {
		writeServiceUnavailable(c)
		return
	}

	req, err := customerRequest.NewInvitationIDRequest(c)
	if err != nil {
		if errors.Is(err, customerRequest.ErrMissingID) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "missing id"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	inv, ok, err := invitationService.GetByID(c.Request.Context(), req.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load invitation"})
		return
	}
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"error": "invitation not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":           inv.ID,
		"customer_id":  inv.CustomerID,
		"slug":         inv.Slug,
		"title":        inv.Title,
		"search_name":  inv.SearchName,
		"event_date":   inv.EventDate,
		"theme_key":    inv.ThemeKey,
		"is_published": inv.IsPublished,
		"content":      json.RawMessage(inv.Content),
		"created_at":   inv.CreatedAt,
		"updated_at":   inv.UpdatedAt,
	})
}

func UpdateInvitationHandler(c *gin.Context) {
	if invitationService == nil {
		writeServiceUnavailable(c)
		return
	}

	customerID, ok := customerMiddleware.GetCustomerID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	idReq, err := customerRequest.NewInvitationIDRequest(c)
	if err != nil {
		if errors.Is(err, customerRequest.ErrMissingID) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "missing id"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	req, payload, err := customerRequest.NewUpdateInvitationRequest(c)
	if err != nil {
		if errors.Is(err, customerRequest.ErrInvalidEventDate) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid event_date"})
			return
		}
		httpRequest.WriteValidationError(c, payload, err)
		return
	}

	inv, ok, err := invitationService.GetByID(c.Request.Context(), idReq.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load invitation"})
		return
	}
	if !ok || inv.CustomerID != customerID {
		c.JSON(http.StatusNotFound, gin.H{"error": "invitation not found"})
		return
	}

	limits, err := planEnforcer.GetCustomerLimits(c.Request.Context(), customerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check plan"})
		return
	}
	if err := customerService.ValidateContent(req.Content, limits); err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error(), "code": "plan_limit_exceeded"})
		return
	}

	eventDate := inv.EventDate
	if req.HasEventDateInput {
		eventDate = req.EventDate
	}

	title := req.Title
	if title == "" {
		title = inv.Title
	}

	themeKey := req.ThemeKey
	if themeKey == "" {
		themeKey = inv.ThemeKey
	}

	searchName := inv.SearchName
	if title != "" {
		searchName = title
	}

	isPublished := inv.IsPublished
	if req.IsPublished != nil {
		isPublished = *req.IsPublished
	}

	derivedSlug := deriveSlugFromContent(req.Content, customerID)
	if derivedSlug == "" {
		derivedSlug = req.Slug
	}
	if derivedSlug == "" {
		derivedSlug = inv.Slug
	}

	if err := invitationService.Update(c.Request.Context(), idReq.ID, repository.InvitationUpdateInput{
		CustomerID:  customerID,
		Slug:        derivedSlug,
		Title:       title,
		SearchName:  searchName,
		EventDate:   eventDate,
		ThemeKey:    themeKey,
		IsPublished: isPublished,
		Content:     req.Content,
	}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update invitation"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func deriveSlugFromContent(raw json.RawMessage, customerID string) string {
	if len(bytes.TrimSpace(raw)) == 0 {
		return ""
	}

	var payload map[string]any
	if err := json.Unmarshal(raw, &payload); err != nil {
		return ""
	}

	couple, _ := payload["couple"].(map[string]any)
	if couple == nil {
		return ""
	}

	groomName, _ := couple["groomName"].(string)
	brideName, _ := couple["brideName"].(string)
	groom := slug.Slugify(groomName)
	brideSlug := slug.Slugify(brideName)
	var base string
	if groom != "" && brideSlug != "" {
		base = groom + "-dan-" + brideSlug
	} else if groom != "" {
		base = groom
	} else if brideSlug != "" {
		base = brideSlug
	}

	if base == "" {
		return ""
	}

	return base + "-" + slug.ShortID(customerID)
}

