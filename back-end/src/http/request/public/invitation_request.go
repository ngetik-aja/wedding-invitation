package publicrequest

import (
	"errors"
	"strings"

	"github.com/gin-gonic/gin"
)

var ErrMissingSlug = errors.New("missing invitation slug")

type InvitationSlugRequest struct {
	Slug string
}

func NewInvitationSlugRequest(c *gin.Context) (InvitationSlugRequest, error) {
	slug := strings.TrimSpace(c.Param("slug"))
	if slug == "" {
		return InvitationSlugRequest{}, ErrMissingSlug
	}
	return InvitationSlugRequest{Slug: slug}, nil
}
