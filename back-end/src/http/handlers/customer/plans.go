package customer

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	customerService "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
)

type planResponse struct {
	Code        string          `json:"code"`
	Name        string          `json:"name"`
	PriceAmount int             `json:"price_amount"`
	Currency    string          `json:"currency"`
	Features    json.RawMessage `json:"features"`
	Limits      json.RawMessage `json:"limits"`
}

type plansResponse struct {
	Items []planResponse `json:"items"`
}

func ListPlansHandler(c *gin.Context) {
	if planService == nil {
		writeServiceUnavailable(c)
		return
	}

	items, err := planService.List(c.Request.Context())
	if err != nil {
		if errors.Is(err, customerService.ErrPlanServiceNotConfigured) {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "plan service unavailable"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list plans"})
		return
	}

	responseItems := make([]planResponse, 0, len(items))
	for _, item := range items {
		features := json.RawMessage(item.Features)
		if len(features) == 0 {
			features = json.RawMessage("{}")
		}
		limits := json.RawMessage(item.Limits)
		if len(limits) == 0 {
			limits = json.RawMessage("{}")
		}

		responseItems = append(responseItems, planResponse{
			Code:        item.Code,
			Name:        item.Name,
			PriceAmount: item.PriceAmount,
			Currency:    item.Currency,
			Features:    features,
			Limits:      limits,
		})
	}

	c.JSON(http.StatusOK, plansResponse{Items: responseItems})
}
