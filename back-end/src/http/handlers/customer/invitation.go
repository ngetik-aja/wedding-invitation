package customer

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"regexp"
	"strings"

	"github.com/gin-gonic/gin"
	httpRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request"
	customerRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request/customer"
	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
)

var invitationSlugRe = regexp.MustCompile(`[^a-z0-9-]+`)

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
	if !ok || inv.CustomerID != req.CustomerID {
		c.JSON(http.StatusNotFound, gin.H{"error": "invitation not found"})
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

	slug := deriveSlugFromContent(req.Content)
	if slug == "" {
		slug = req.Slug
	}
	if slug == "" {
		slug = inv.Slug
	}

	if err := invitationService.Update(c.Request.Context(), idReq.ID, repository.InvitationUpdateInput{
		CustomerID:  inv.CustomerID,
		Slug:        slug,
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

func deriveSlugFromContent(content json.RawMessage) string {
	if len(bytes.TrimSpace(content)) == 0 {
		return ""
	}

	var payload map[string]any
	if err := json.Unmarshal(content, &payload); err != nil {
		return ""
	}

	coupleRaw, ok := payload["couple"]
	if !ok {
		return ""
	}

	couple, ok := coupleRaw.(map[string]any)
	if !ok {
		return ""
	}

	groom, _ := couple["groomName"].(string)
	bride, _ := couple["brideName"].(string)

	groomSlug := slugify(groom)
	brideSlug := slugify(bride)

	if groomSlug != "" && brideSlug != "" {
		return groomSlug + "-" + brideSlug
	}
	if groomSlug != "" {
		return groomSlug
	}
	if brideSlug != "" {
		return brideSlug
	}

	return ""
}

func slugify(value string) string {
	value = strings.ToLower(strings.TrimSpace(value))
	slug := strings.ReplaceAll(value, " ", "-")
	slug = invitationSlugRe.ReplaceAllString(slug, "-")
	slug = strings.Trim(slug, "-")
	for strings.Contains(slug, "--") {
		slug = strings.ReplaceAll(slug, "--", "-")
	}
	return slug
}
