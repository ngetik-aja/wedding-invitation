package customer

import (
	"bytes"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/proxima-labs/wedding-invitation-back-end/src/http/handlers/validation"
	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
	customersvc "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
)

type InvitationHandler struct {
	Service *customersvc.InvitationService
}

type invitationUpdatePayload struct {
	CustomerID  string          `json:"customer_id" binding:"required"`
	Title       string          `json:"title"`
	EventDate   string          `json:"event_date"`
	ThemeKey    string          `json:"theme_key"`
	IsPublished *bool           `json:"is_published"`
	Content     json.RawMessage `json:"content" binding:"required"`
}

func (h *InvitationHandler) GetInvitation(c *gin.Context) {
	id := strings.TrimSpace(c.Param("id"))
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing id"})
		return
	}

	inv, ok, err := h.Service.GetByID(c.Request.Context(), id)
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

func (h *InvitationHandler) UpdateInvitation(c *gin.Context) {
	id := strings.TrimSpace(c.Param("id"))
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing id"})
		return
	}

	var payload invitationUpdatePayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		validation.WriteValidationError(c, payload, err)
		return
	}

	if err := validation.ValidateStruct(payload); err != nil {
		validation.WriteValidationError(c, payload, err)
		return
	}

	inv, ok, err := h.Service.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load invitation"})
		return
	}
	if !ok || inv.CustomerID != payload.CustomerID {
		c.JSON(http.StatusNotFound, gin.H{"error": "invitation not found"})
		return
	}

	var eventDate *time.Time
	if payload.EventDate != "" {
		parsed, err := time.Parse("2006-01-02", payload.EventDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid event_date"})
			return
		}
		eventDate = &parsed
	} else {
		eventDate = inv.EventDate
	}

	title := strings.TrimSpace(payload.Title)
	if title == "" {
		title = inv.Title
	}

	themeKey := strings.TrimSpace(payload.ThemeKey)
	if themeKey == "" {
		themeKey = inv.ThemeKey
	}

	searchName := inv.SearchName
	if title != "" {
		searchName = title
	}

	isPublished := inv.IsPublished
	if payload.IsPublished != nil {
		isPublished = *payload.IsPublished
	}

	content := payload.Content
	if len(bytes.TrimSpace(content)) == 0 {
		content = []byte("{}")
	}

	if err := h.Service.Update(c.Request.Context(), id, repository.InvitationUpdateInput{
		CustomerID:  inv.CustomerID,
		Slug:        inv.Slug,
		Title:       title,
		SearchName:  searchName,
		EventDate:   eventDate,
		ThemeKey:    themeKey,
		IsPublished: isPublished,
		Content:     content,
	}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update invitation"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
