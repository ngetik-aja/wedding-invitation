package publicrequest

import (
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	httpRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request"
	customerService "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
)

const (
	defaultWishesLimit = 20
	maxWishesLimit     = 100
)

type createWishPayload struct {
	GuestName string `json:"guest_name" binding:"required"`
	Message   string `json:"message" binding:"required"`
}

type CreateWishRequest struct {
	Input customerService.CreateWishInput
}

func NewCreateWishRequest(c *gin.Context, customerID string, slug string) (CreateWishRequest, any, error) {
	var payload createWishPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		return CreateWishRequest{}, payload, err
	}

	if err := httpRequest.ValidateStruct(payload); err != nil {
		return CreateWishRequest{}, payload, err
	}

	return CreateWishRequest{
		Input: customerService.CreateWishInput{
			CustomerID: strings.TrimSpace(customerID),
			Slug:       strings.TrimSpace(slug),
			GuestName:  strings.TrimSpace(payload.GuestName),
			Message:    strings.TrimSpace(payload.Message),
		},
	}, payload, nil
}

type ListWishesRequest struct {
	Input customerService.ListWishesInput
}

func NewListWishesRequest(c *gin.Context, customerID string, slug string) ListWishesRequest {
	limit := defaultWishesLimit
	limitRaw := strings.TrimSpace(c.Query("limit"))
	if limitRaw != "" {
		if parsedLimit, err := strconv.Atoi(limitRaw); err == nil {
			limit = parsedLimit
		}
	}
	if limit <= 0 {
		limit = defaultWishesLimit
	}
	if limit > maxWishesLimit {
		limit = maxWishesLimit
	}

	return ListWishesRequest{
		Input: customerService.ListWishesInput{
			CustomerID: strings.TrimSpace(customerID),
			Slug:       strings.TrimSpace(slug),
			Limit:      limit,
		},
	}
}
