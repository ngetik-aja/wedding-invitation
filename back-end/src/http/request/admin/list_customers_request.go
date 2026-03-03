package adminrequest

import (
	"errors"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

const (
	defaultListLimit = 100
	maxListLimit     = 500
)

var ErrInvalidLimit = errors.New("invalid limit")

type ListCustomersRequest struct {
	Limit int
}

func NewListCustomersRequest(c *gin.Context) (ListCustomersRequest, error) {
	limitRaw := strings.TrimSpace(c.Query("limit"))
	if limitRaw == "" {
		return ListCustomersRequest{Limit: defaultListLimit}, nil
	}

	limit, err := strconv.Atoi(limitRaw)
	if err != nil {
		return ListCustomersRequest{}, ErrInvalidLimit
	}

	if limit <= 0 {
		limit = defaultListLimit
	}
	if limit > maxListLimit {
		limit = maxListLimit
	}

	return ListCustomersRequest{Limit: limit}, nil
}
