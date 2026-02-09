package customer

import (
	"context"
	"errors"
	"strings"

	"golang.org/x/crypto/bcrypt"

	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
)

var ErrInvalidCredentials = errors.New("invalid credentials")
var ErrInvitationNotFound = errors.New("invitation not found")

var bcryptCompare = bcrypt.CompareHashAndPassword

// LoginService handles customer authentication.
type LoginService struct {
	CustomerRepo   *repository.CustomerRepository
	InvitationRepo *repository.InvitationRepository
}

func (s *LoginService) Login(ctx context.Context, email, password string) (customerID string, invitationID string, slug string, domain string, err error) {
	if s.CustomerRepo == nil || s.InvitationRepo == nil {
		return "", "", "", "", ErrInvalidCredentials
	}

	email = strings.TrimSpace(strings.ToLower(email))
	password = strings.TrimSpace(password)

	customer, ok, err := s.CustomerRepo.FindByEmail(ctx, email)
	if err != nil || !ok {
		return "", "", "", "", ErrInvalidCredentials
	}
	if err := bcryptCompare([]byte(customer.PasswordHash), []byte(password)); err != nil {
		return "", "", "", "", ErrInvalidCredentials
	}

	items, err := s.InvitationRepo.List(ctx, repository.InvitationListFilters{
		CustomerID: customer.ID,
		Limit:      1,
		Offset:     0,
	})
	if err != nil {
		return "", "", "", "", err
	}
	if len(items) == 0 {
		return "", "", "", "", ErrInvitationNotFound
	}

	inv := items[0]

	return customer.ID, inv.ID, inv.Slug, customer.Domain, nil
}
