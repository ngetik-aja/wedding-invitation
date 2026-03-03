package customerrequest

import (
	"bytes"
	"encoding/json"
	"errors"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	httpRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request"
)

var (
	ErrMissingID        = errors.New("missing id")
	ErrInvalidEventDate = errors.New("invalid event_date")
)

type InvitationIDRequest struct {
	ID string
}

func NewInvitationIDRequest(c *gin.Context) (InvitationIDRequest, error) {
	id := strings.TrimSpace(c.Param("id"))
	if id == "" {
		return InvitationIDRequest{}, ErrMissingID
	}
	return InvitationIDRequest{ID: id}, nil
}

type invitationUpdatePayload struct {
	CustomerID  string          `json:"customer_id" binding:"required"`
	Slug        string          `json:"slug"`
	Title       string          `json:"title"`
	EventDate   string          `json:"event_date"`
	ThemeKey    string          `json:"theme_key"`
	IsPublished *bool           `json:"is_published"`
	Content     json.RawMessage `json:"content" binding:"required"`
}

type UpdateInvitationRequest struct {
	CustomerID        string
	Slug              string
	Title             string
	ThemeKey          string
	IsPublished       *bool
	Content           json.RawMessage
	EventDate         *time.Time
	HasEventDateInput bool
}

func NewUpdateInvitationRequest(c *gin.Context) (UpdateInvitationRequest, any, error) {
	var payload invitationUpdatePayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		return UpdateInvitationRequest{}, payload, err
	}

	if err := httpRequest.ValidateStruct(payload); err != nil {
		return UpdateInvitationRequest{}, payload, err
	}

	var eventDate *time.Time
	hasEventDate := strings.TrimSpace(payload.EventDate) != ""
	if hasEventDate {
		parsed, err := time.Parse("2006-01-02", strings.TrimSpace(payload.EventDate))
		if err != nil {
			return UpdateInvitationRequest{}, payload, ErrInvalidEventDate
		}
		eventDate = &parsed
	}

	content := payload.Content
	if len(bytes.TrimSpace(content)) == 0 {
		content = []byte("{}")
	}

	return UpdateInvitationRequest{
		CustomerID:        strings.TrimSpace(payload.CustomerID),
		Slug:              strings.TrimSpace(payload.Slug),
		Title:             strings.TrimSpace(payload.Title),
		ThemeKey:          strings.TrimSpace(payload.ThemeKey),
		IsPublished:       payload.IsPublished,
		Content:           content,
		EventDate:         eventDate,
		HasEventDateInput: hasEventDate,
	}, payload, nil
}
