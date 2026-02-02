package customer

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/proxima-labs/wedding-invitation-back-end/internal/http/handlers/validation"
	customersvc "github.com/proxima-labs/wedding-invitation-back-end/internal/service/customer"
)

type RegisterHandler struct {
	Service *customersvc.RegisterService
}

type registerPayload struct {
	FullName  string          `json:"full_name" binding:"required"`
	Email     string          `json:"email" binding:"required,email"`
	Password  string          `json:"password" binding:"required,min=6"`
	Slug      string          `json:"slug"`
	Title     string          `json:"title"`
	EventDate string          `json:"event_date"`
	ThemeKey  string          `json:"theme_key"`
	Content   json.RawMessage `json:"content"`
}

func (h *RegisterHandler) Register(c *gin.Context) {
	var payload registerPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		validation.WriteValidationError(c, payload, err)
		return
	}

	payload.FullName = strings.TrimSpace(payload.FullName)
	payload.Email = strings.TrimSpace(payload.Email)
	payload.Password = strings.TrimSpace(payload.Password)
	payload.Slug = strings.TrimSpace(payload.Slug)

	if err := validation.ValidateStruct(payload); err != nil {
		validation.WriteValidationError(c, payload, err)
		return
	}

	var eventDate *time.Time
	if payload.EventDate != "" {
		parsed, err := time.Parse("2006-01-02", payload.EventDate)
		if err != nil {
			validation.WriteValidationError(c, payload, err)
			return
		}
		eventDate = &parsed
	}

	customerID, invitationID, err := h.Service.Register(c.Request.Context(), customersvc.RegisterInput{
		FullName:  payload.FullName,
		Email:     payload.Email,
		Password:  payload.Password,
		Slug:      payload.Slug,
		Title:     strings.TrimSpace(payload.Title),
		EventDate: eventDate,
		ThemeKey:  strings.TrimSpace(payload.ThemeKey),
		Content:   json.RawMessage(payload.Content),
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to register"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"customer_id":   customerID,
		"invitation_id": invitationID,
	})
}
