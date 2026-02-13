package admin

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/proxima-labs/wedding-invitation-back-end/src/http/handlers/validation"
	"github.com/proxima-labs/wedding-invitation-back-end/src/query"
	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
	adminsvc "github.com/proxima-labs/wedding-invitation-back-end/src/service/admin"
)

type InvitationHandler struct {
	Service *adminsvc.InvitationService
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

type invitationResponse struct {
	ID          string          `json:"id"`
	CustomerID  string          `json:"customerId"`
	Slug        string          `json:"slug"`
	Title       string          `json:"title"`
	SearchName  string          `json:"searchName"`
	EventDate   *time.Time      `json:"eventDate"`
	ThemeKey    string          `json:"themeKey"`
	IsPublished bool            `json:"isPublished"`
	Content     json.RawMessage `json:"content"`
	CreatedAt   time.Time       `json:"createdAt"`
	UpdatedAt   time.Time       `json:"updatedAt"`
}

type invitationListItem struct {
	ID             string     `json:"id"`
	CustomerID     string     `json:"customerId"`
	CustomerName   string     `json:"customerName"`
	CustomerDomain string     `json:"customerDomain"`
	Slug           string     `json:"slug"`
	Title          string     `json:"title"`
	SearchName     string     `json:"searchName"`
	EventDate      *time.Time `json:"eventDate"`
	ThemeKey       string     `json:"themeKey"`
	IsPublished    bool       `json:"isPublished"`
	CreatedAt      time.Time  `json:"createdAt"`
	UpdatedAt      time.Time  `json:"updatedAt"`
}

type invitationListResponse struct {
	Items  []invitationListItem `json:"items"`
	Limit  int                  `json:"limit"`
	Offset int                  `json:"offset"`
}

func (h *InvitationHandler) ListInvitations(c *gin.Context) {
	filters := query.InvitationListFilters{}
	filters.CustomerID = c.Query("customer_id")
	filters.Query = c.Query("q")
	filters.Status = c.Query("status")
	if filters.Status != "" && filters.Status != "published" && filters.Status != "draft" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid status"})
		return
	}

	if value := c.Query("date_from"); value != "" {
		parsed, err := time.Parse("2006-01-02", value)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date_from"})
			return
		}
		filters.DateFrom = &parsed
	}
	if value := c.Query("date_to"); value != "" {
		parsed, err := time.Parse("2006-01-02", value)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date_to"})
			return
		}
		filters.DateTo = &parsed
	}
	if value := c.Query("limit"); value != "" {
		limit, err := strconv.Atoi(value)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid limit"})
			return
		}
		filters.Limit = limit
	}
	if value := c.Query("offset"); value != "" {
		offset, err := strconv.Atoi(value)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid offset"})
			return
		}
		filters.Offset = offset
	}

	filters = h.Service.NormalizeListFilters(filters)

	items, err := h.Service.ListWithCustomers(c.Request.Context(), filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list invitations"})
		return
	}

	responseItems := make([]invitationListItem, 0, len(items))
	for _, item := range items {
		responseItems = append(responseItems, invitationListItem{
			ID:             item.Invitation.ID,
			CustomerID:     item.Invitation.CustomerID,
			CustomerName:   item.CustomerName,
			CustomerDomain: item.CustomerDomain,
			Slug:           item.Invitation.Slug,
			Title:          item.Invitation.Title,
			SearchName:     item.Invitation.SearchName,
			EventDate:      item.Invitation.EventDate,
			ThemeKey:       item.Invitation.ThemeKey,
			IsPublished:    item.Invitation.IsPublished,
			CreatedAt:      item.Invitation.CreatedAt,
			UpdatedAt:      item.Invitation.UpdatedAt,
		})
	}

	c.JSON(http.StatusOK, invitationListResponse{
		Items:  responseItems,
		Limit:  filters.Limit,
		Offset: filters.Offset,
	})
}

func (h *InvitationHandler) CreateInvitation(c *gin.Context) {
	var payload invitationPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		validation.WriteValidationError(c, payload, err)
		return
	}

	if err := validation.ValidateStruct(payload); err != nil {
		validation.WriteValidationError(c, payload, err)
		return
	}

	if payload.SearchName == "" {
		payload.SearchName = payload.Title
	}

	var eventDate *time.Time
	if payload.EventDate != "" {
		parsed, err := time.Parse("2006-01-02", payload.EventDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid event_date"})
			return
		}
		eventDate = &parsed
	}

	id, err := h.Service.Create(c.Request.Context(), repository.InvitationCreateInput{
		CustomerID:  payload.CustomerID,
		Slug:        payload.Slug,
		Title:       payload.Title,
		SearchName:  payload.SearchName,
		EventDate:   eventDate,
		ThemeKey:    payload.ThemeKey,
		IsPublished: payload.IsPublished,
		Content:     payload.Content,
	})
	if err != nil {
		switch {
		case errors.Is(err, adminsvc.ErrCustomerNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "customer not found"})
		case errors.Is(err, adminsvc.ErrCustomerNotPaid):
			c.JSON(http.StatusBadRequest, gin.H{"error": "customer has no active payment"})
		case errors.Is(err, adminsvc.ErrCustomerRepoNotConfigured):
			c.JSON(http.StatusInternalServerError, gin.H{"error": "customer repository not configured"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create invitation"})
		}
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": id})
}

func (h *InvitationHandler) GetInvitation(c *gin.Context) {
	id := c.Param("id")
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

	c.JSON(http.StatusOK, invitationResponse{
		ID:          inv.ID,
		CustomerID:  inv.CustomerID,
		Slug:        inv.Slug,
		Title:       inv.Title,
		SearchName:  inv.SearchName,
		EventDate:   inv.EventDate,
		ThemeKey:    inv.ThemeKey,
		IsPublished: inv.IsPublished,
		Content:     json.RawMessage(inv.Content),
		CreatedAt:   inv.CreatedAt,
		UpdatedAt:   inv.UpdatedAt,
	})
}

func (h *InvitationHandler) UpdateInvitation(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing id"})
		return
	}

	var payload invitationPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		validation.WriteValidationError(c, payload, err)
		return
	}

	if err := validation.ValidateStruct(payload); err != nil {
		validation.WriteValidationError(c, payload, err)
		return
	}

	if payload.SearchName == "" {
		payload.SearchName = payload.Title
	}

	var eventDate *time.Time
	if payload.EventDate != "" {
		parsed, err := time.Parse("2006-01-02", payload.EventDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid event_date"})
			return
		}
		eventDate = &parsed
	}

	err := h.Service.Update(c.Request.Context(), id, repository.InvitationUpdateInput{
		CustomerID:  payload.CustomerID,
		Slug:        payload.Slug,
		Title:       payload.Title,
		SearchName:  payload.SearchName,
		EventDate:   eventDate,
		ThemeKey:    payload.ThemeKey,
		IsPublished: payload.IsPublished,
		Content:     payload.Content,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update invitation"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func (h *InvitationHandler) DeleteInvitation(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing id"})
		return
	}

	if err := h.Service.Delete(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete invitation"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
