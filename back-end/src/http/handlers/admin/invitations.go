package admin

import (
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	httpRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request"
	adminRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request/admin"
	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
	adminService "github.com/proxima-labs/wedding-invitation-back-end/src/service/admin"
)

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

func ListInvitationsHandler(c *gin.Context) {
	if !ensureService(c, invitationService) {
		return
	}

	req, err := adminRequest.NewListInvitationsRequest(c)
	if err != nil {
		switch {
		case errors.Is(err, adminRequest.ErrInvalidStatus):
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid status"})
		case errors.Is(err, adminRequest.ErrInvalidDateFrom):
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date_from"})
		case errors.Is(err, adminRequest.ErrInvalidDateTo):
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date_to"})
		case errors.Is(err, adminRequest.ErrInvalidLimit):
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid limit"})
		case errors.Is(err, adminRequest.ErrInvalidOffset):
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid offset"})
		default:
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		}
		return
	}

	items, err := invitationService.ListWithCustomers(c.Request.Context(), req.Filters)
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
		Limit:  req.Filters.Limit,
		Offset: req.Filters.Offset,
	})
}

func CreateInvitationHandler(c *gin.Context) {
	if !ensureService(c, invitationService) {
		return
	}

	req, payload, err := adminRequest.NewCreateInvitationRequest(c)
	if err != nil {
		if errors.Is(err, adminRequest.ErrInvalidEventDate) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid event_date"})
			return
		}
		httpRequest.WriteValidationError(c, payload, err)
		return
	}

	id, err := invitationService.Create(c.Request.Context(), req.Input)
	if err != nil {
		switch {
		case errors.Is(err, adminService.ErrCustomerNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "customer not found"})
		case errors.Is(err, adminService.ErrCustomerNotPaid):
			c.JSON(http.StatusBadRequest, gin.H{"error": "customer has no active payment"})
		case errors.Is(err, adminService.ErrCustomerRepoNotConfigured):
			c.JSON(http.StatusInternalServerError, gin.H{"error": "customer repository not configured"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create invitation"})
		}
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": id})
}

func GetInvitationHandler(c *gin.Context) {
	if !ensureService(c, invitationService) {
		return
	}

	req, err := adminRequest.NewInvitationIDRequest(c)
	if err != nil {
		if errors.Is(err, adminRequest.ErrMissingID) {
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

func UpdateInvitationHandler(c *gin.Context) {
	if !ensureService(c, invitationService) {
		return
	}

	idReq, err := adminRequest.NewInvitationIDRequest(c)
	if err != nil {
		if errors.Is(err, adminRequest.ErrMissingID) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "missing id"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	req, payload, err := adminRequest.NewUpdateInvitationRequest(c)
	if err != nil {
		if errors.Is(err, adminRequest.ErrInvalidEventDate) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid event_date"})
			return
		}
		httpRequest.WriteValidationError(c, payload, err)
		return
	}

	err = invitationService.Update(c.Request.Context(), idReq.ID, repository.InvitationUpdateInput{
		CustomerID:  req.Input.CustomerID,
		Slug:        req.Input.Slug,
		Title:       req.Input.Title,
		SearchName:  req.Input.SearchName,
		EventDate:   req.Input.EventDate,
		ThemeKey:    req.Input.ThemeKey,
		IsPublished: req.Input.IsPublished,
		Content:     req.Input.Content,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update invitation"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func DeleteInvitationHandler(c *gin.Context) {
	if !ensureService(c, invitationService) {
		return
	}

	req, err := adminRequest.NewInvitationIDRequest(c)
	if err != nil {
		if errors.Is(err, adminRequest.ErrMissingID) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "missing id"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	if err := invitationService.Delete(c.Request.Context(), req.ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete invitation"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
