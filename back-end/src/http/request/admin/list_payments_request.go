package adminrequest

import (
	"errors"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
)

var (
	ErrInvalidPaymentStatus = errors.New("invalid payment status")
	ErrInvalidPaymentOffset = errors.New("invalid payment offset")
)

type ListPaymentsRequest struct {
	Filters repository.AdminPaymentFilters
}

func NewListPaymentsRequest(c *gin.Context) (ListPaymentsRequest, error) {
	filters := repository.AdminPaymentFilters{
		CustomerID: strings.TrimSpace(c.Query("customer_id")),
		Status:     strings.TrimSpace(c.Query("status")),
		Limit:      defaultListLimit,
		Offset:     0,
	}

	if filters.Status != "" {
		switch filters.Status {
		case "pending", "paid", "failed", "refunded":
		default:
			return ListPaymentsRequest{}, ErrInvalidPaymentStatus
		}
	}

	if value := strings.TrimSpace(c.Query("limit")); value != "" {
		limit, err := strconv.Atoi(value)
		if err != nil {
			return ListPaymentsRequest{}, ErrInvalidLimit
		}
		if limit <= 0 {
			limit = defaultListLimit
		}
		if limit > maxListLimit {
			limit = maxListLimit
		}
		filters.Limit = limit
	}

	if value := strings.TrimSpace(c.Query("offset")); value != "" {
		offset, err := strconv.Atoi(value)
		if err != nil {
			return ListPaymentsRequest{}, ErrInvalidPaymentOffset
		}
		if offset < 0 {
			offset = 0
		}
		filters.Offset = offset
	}

	return ListPaymentsRequest{Filters: filters}, nil
}
