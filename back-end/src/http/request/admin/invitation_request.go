package adminrequest

import (
	"encoding/json"
	"errors"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	httpRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request"
	"github.com/proxima-labs/wedding-invitation-back-end/src/query"
	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
)

var (
	ErrMissingID        = errors.New("missing id")
	ErrInvalidStatus    = errors.New("invalid status")
	ErrInvalidDateFrom  = errors.New("invalid date_from")
	ErrInvalidDateTo    = errors.New("invalid date_to")
	ErrInvalidOffset    = errors.New("invalid offset")
	ErrInvalidEventDate = errors.New("invalid event_date")
)

type ListInvitationsRequest struct {
	Filters query.InvitationListFilters
}

func NewListInvitationsRequest(c *gin.Context) (ListInvitationsRequest, error) {
	filters := query.InvitationListFilters{}
	filters.CustomerID = strings.TrimSpace(c.Query("customer_id"))
	filters.Query = strings.TrimSpace(c.Query("q"))
	filters.Status = strings.TrimSpace(c.Query("status"))
	if filters.Status != "" && filters.Status != "published" && filters.Status != "draft" {
		return ListInvitationsRequest{}, ErrInvalidStatus
	}

	if value := strings.TrimSpace(c.Query("date_from")); value != "" {
		parsed, err := time.Parse("2006-01-02", value)
		if err != nil {
			return ListInvitationsRequest{}, ErrInvalidDateFrom
		}
		filters.DateFrom = &parsed
	}

	if value := strings.TrimSpace(c.Query("date_to")); value != "" {
		parsed, err := time.Parse("2006-01-02", value)
		if err != nil {
			return ListInvitationsRequest{}, ErrInvalidDateTo
		}
		filters.DateTo = &parsed
	}

	if value := strings.TrimSpace(c.Query("limit")); value != "" {
		limit, err := strconv.Atoi(value)
		if err != nil {
			return ListInvitationsRequest{}, ErrInvalidLimit
		}
		filters.Limit = limit
	}

	if value := strings.TrimSpace(c.Query("offset")); value != "" {
		offset, err := strconv.Atoi(value)
		if err != nil {
			return ListInvitationsRequest{}, ErrInvalidOffset
		}
		filters.Offset = offset
	}

	if filters.Limit <= 0 {
		filters.Limit = 20
	}
	if filters.Limit > 100 {
		filters.Limit = 100
	}
	if filters.Offset < 0 {
		filters.Offset = 0
	}

	return ListInvitationsRequest{Filters: filters}, nil
}

type invitationPayload struct {
	CustomerID  string          `json:"customer_id" binding:"required"`
	Slug        string          `json:"slug"`
	Title       string          `json:"title"`
	SearchName  string          `json:"search_name"`
	EventDate   string          `json:"event_date"`
	ThemeKey    string          `json:"theme_key"`
	IsPublished bool            `json:"is_published"`
	Content     json.RawMessage `json:"content" binding:"required"`
}

type UpsertInvitationRequest struct {
	Input repository.InvitationCreateInput
}

func NewCreateInvitationRequest(c *gin.Context) (UpsertInvitationRequest, any, error) {
	return newUpsertInvitationRequest(c)
}

func NewUpdateInvitationRequest(c *gin.Context) (UpsertInvitationRequest, any, error) {
	return newUpsertInvitationRequest(c)
}

func newUpsertInvitationRequest(c *gin.Context) (UpsertInvitationRequest, any, error) {
	var payload invitationPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		return UpsertInvitationRequest{}, payload, err
	}

	if err := httpRequest.ValidateStruct(payload); err != nil {
		return UpsertInvitationRequest{}, payload, err
	}

	payload.CustomerID = strings.TrimSpace(payload.CustomerID)
	payload.Slug = strings.TrimSpace(payload.Slug)
	payload.Title = strings.TrimSpace(payload.Title)
	payload.SearchName = strings.TrimSpace(payload.SearchName)
	payload.ThemeKey = strings.TrimSpace(payload.ThemeKey)

	if payload.SearchName == "" {
		payload.SearchName = payload.Title
	}

	var eventDate *time.Time
	if payload.EventDate != "" {
		parsed, err := time.Parse("2006-01-02", payload.EventDate)
		if err != nil {
			return UpsertInvitationRequest{}, payload, ErrInvalidEventDate
		}
		eventDate = &parsed
	}

	return UpsertInvitationRequest{
		Input: repository.InvitationCreateInput{
			CustomerID:  payload.CustomerID,
			Slug:        payload.Slug,
			Title:       payload.Title,
			SearchName:  payload.SearchName,
			EventDate:   eventDate,
			ThemeKey:    payload.ThemeKey,
			IsPublished: payload.IsPublished,
			Content:     payload.Content,
		},
	}, payload, nil
}

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
