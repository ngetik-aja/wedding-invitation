package customer

import (
	"bytes"
	"context"
	"errors"
	"strings"
	"time"

	"github.com/proxima-labs/wedding-invitation-back-end/internal/service/shared"

	"golang.org/x/crypto/bcrypt"

	"github.com/proxima-labs/wedding-invitation-back-end/internal/repository"
)

type RegisterInput struct {
	FullName  string
	Email     string
	Password  string
	Slug      string
	Title     string
	EventDate *time.Time
	ThemeKey  string
	Content   []byte
}

type RegisterService struct {
	CustomerRepo   *repository.CustomerRepository
	InvitationRepo *repository.InvitationRepository
	BaseDomain     string
}

var ErrRegisterNotConfigured = errors.New("register service not configured")

func (s *RegisterService) Register(ctx context.Context, input RegisterInput) (customerID string, invitationID string, err error) {
	if s.CustomerRepo == nil || s.InvitationRepo == nil {
		return "", "", ErrRegisterNotConfigured
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return "", "", err
	}

	searchName := strings.TrimSpace(input.Title)
	if searchName == "" {
		searchName = strings.TrimSpace(input.FullName)
	}

	baseSlug := shared.Slugify(input.Slug)
	if baseSlug == "" {
		baseSlug = shared.Slugify(input.Title)
	}
	if baseSlug == "" {
		baseSlug = shared.Slugify(input.FullName)
	}

	slug, err := shared.EnsureUniqueSlug(ctx, baseSlug, func(ctx context.Context, candidate string) (bool, error) {
		domain := buildCustomerDomain(candidate, s.BaseDomain)
		return s.CustomerRepo.ExistsByDomain(ctx, domain)
	})
	if err != nil {
		return "", "", err
	}

	domain := buildCustomerDomain(slug, s.BaseDomain)

	tx, err := s.CustomerRepo.DB.Begin(ctx)
	if err != nil {
		return "", "", err
	}
	defer func() {
		if err != nil {
			_ = tx.Rollback(ctx)
		}
	}()

	customerID, err = s.CustomerRepo.CreateTx(ctx, tx, repository.CustomerCreateInput{
		FullName:     input.FullName,
		Email:        input.Email,
		PasswordHash: string(passwordHash),
		Domain:       domain,
	})
	if err != nil {
		return "", "", err
	}

	invitationID, err = s.InvitationRepo.CreateTx(ctx, tx, repository.InvitationCreateInput{
		CustomerID:  customerID,
		Slug:        slug,
		Title:       input.Title,
		SearchName:  searchName,
		EventDate:   input.EventDate,
		ThemeKey:    input.ThemeKey,
		IsPublished: false,
		Content:     normalizeContent(input.Content),
	})
	if err != nil {
		return "", "", err
	}

	if err = tx.Commit(ctx); err != nil {
		return "", "", err
	}

	return customerID, invitationID, nil
}

func buildCustomerDomain(slug string, baseDomain string) string {
	slug = strings.TrimSpace(slug)
	baseDomain = strings.TrimSpace(baseDomain)
	if slug == "" {
		return baseDomain
	}
	if baseDomain == "" {
		return slug
	}
	return slug + "." + baseDomain
}

func normalizeContent(input []byte) []byte {
	if len(bytes.TrimSpace(input)) == 0 {
		return []byte("{}")
	}
	return input
}
