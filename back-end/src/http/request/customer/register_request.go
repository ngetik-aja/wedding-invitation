package customerrequest

import (
	"encoding/json"
	"errors"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	httpRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request"
	customerService "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
)

var ErrInvalidRegisterEventDate = errors.New("invalid event_date")

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

type RegisterRequest struct {
	Input customerService.RegisterInput
}

func NewRegisterRequest(c *gin.Context) (RegisterRequest, any, error) {
	var payload registerPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		return RegisterRequest{}, payload, err
	}

	if err := httpRequest.ValidateStruct(payload); err != nil {
		return RegisterRequest{}, payload, err
	}

	payload.FullName = strings.TrimSpace(payload.FullName)
	payload.Email = strings.TrimSpace(payload.Email)
	payload.Password = strings.TrimSpace(payload.Password)
	payload.Slug = strings.TrimSpace(payload.Slug)
	payload.Title = strings.TrimSpace(payload.Title)
	payload.ThemeKey = strings.TrimSpace(payload.ThemeKey)

	var eventDate *time.Time
	if payload.EventDate != "" {
		parsed, err := time.Parse("2006-01-02", payload.EventDate)
		if err != nil {
			return RegisterRequest{}, payload, ErrInvalidRegisterEventDate
		}
		eventDate = &parsed
	}

	return RegisterRequest{
		Input: customerService.RegisterInput{
			FullName:  payload.FullName,
			Email:     payload.Email,
			Password:  payload.Password,
			Slug:      payload.Slug,
			Title:     payload.Title,
			EventDate: eventDate,
			ThemeKey:  payload.ThemeKey,
			Content:   json.RawMessage(payload.Content),
		},
	}, payload, nil
}
