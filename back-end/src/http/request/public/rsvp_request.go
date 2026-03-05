package publicrequest

import (
	"strings"

	"github.com/gin-gonic/gin"
	httpRequest "github.com/proxima-labs/wedding-invitation-back-end/src/http/request"
	customerService "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
)

type createRsvpPayload struct {
	GuestName   string `json:"guest_name" binding:"required"`
	Attendance  string `json:"attendance"`
	GuestsCount int    `json:"guests_count"`
	Message     string `json:"message"`
}

type CreateRsvpRequest struct {
	Input customerService.CreateRsvpInput
}

func NewCreateRsvpRequest(c *gin.Context, customerID string, slug string) (CreateRsvpRequest, any, error) {
	var payload createRsvpPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		return CreateRsvpRequest{}, payload, err
	}

	if err := httpRequest.ValidateStruct(payload); err != nil {
		return CreateRsvpRequest{}, payload, err
	}

	return CreateRsvpRequest{
		Input: customerService.CreateRsvpInput{
			CustomerID:  strings.TrimSpace(customerID),
			Slug:        strings.TrimSpace(slug),
			GuestName:   strings.TrimSpace(payload.GuestName),
			Attendance:  strings.TrimSpace(payload.Attendance),
			GuestsCount: payload.GuestsCount,
			Message:     strings.TrimSpace(payload.Message),
		},
	}, payload, nil
}
