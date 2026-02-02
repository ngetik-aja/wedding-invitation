package admin

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	adminsvc "github.com/proxima-labs/wedding-invitation-back-end/internal/service/admin"
)

type CustomerHandler struct {
	Service *adminsvc.CustomerService
}

type customerListItem struct {
	ID       string `json:"id"`
	FullName string `json:"full_name"`
	Email    string `json:"email"`
	Domain   string `json:"domain"`
	Status   string `json:"status"`
}

type customerListResponse struct {
	Items []customerListItem `json:"items"`
	Limit int                `json:"limit"`
}

func (h *CustomerHandler) ListCustomers(c *gin.Context) {
	limit := 100
	if value := c.Query("limit"); value != "" {
		parsed, err := strconv.Atoi(value)
		if err != nil || parsed <= 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid limit"})
			return
		}
		limit = parsed
	}

	items, err := h.Service.List(c.Request.Context(), limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list customers"})
		return
	}

	responseItems := make([]customerListItem, 0, len(items))
	for _, item := range items {
		responseItems = append(responseItems, customerListItem{
			ID:       item.ID,
			FullName: item.FullName,
			Email:    item.Email,
			Domain:   item.Domain,
			Status:   item.Status,
		})
	}

	c.JSON(http.StatusOK, customerListResponse{Items: responseItems, Limit: limit})
}
