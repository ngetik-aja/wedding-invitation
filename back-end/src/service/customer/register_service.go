package customer

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"strings"
	"time"

	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
	"github.com/proxima-labs/wedding-invitation-back-end/src/service/shared"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
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

func (s *RegisterService) Register(ctx context.Context, input RegisterInput) (customerID string, invitationID string, slug string, domain string, err error) {
	if s.CustomerRepo == nil || s.InvitationRepo == nil {
		return "", "", "", "", ErrRegisterNotConfigured
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return "", "", "", "", err
	}

	input.Title = strings.TrimSpace(input.Title)
	input.ThemeKey = strings.TrimSpace(input.ThemeKey)
	if input.ThemeKey == "" {
		input.ThemeKey = "elegant"
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

	slug, err = shared.EnsureUniqueSlug(ctx, baseSlug, func(ctx context.Context, candidate string) (bool, error) {
		domain := buildCustomerDomain(candidate, s.BaseDomain)
		return s.CustomerRepo.ExistsByDomain(ctx, domain)
	})
	if err != nil {
		return "", "", "", "", err
	}

	domain = buildCustomerDomain(slug, s.BaseDomain)

	err = s.CustomerRepo.DB.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		customerID, err = s.CustomerRepo.CreateTx(ctx, tx, repository.CustomerCreateInput{
			FullName:     input.FullName,
			Email:        input.Email,
			PasswordHash: string(passwordHash),
			Domain:       domain,
		})
		if err != nil {
			return err
		}

		invitationID, err = s.InvitationRepo.CreateTx(ctx, tx, repository.InvitationCreateInput{
			CustomerID:  customerID,
			Slug:        slug,
			Title:       input.Title,
			SearchName:  searchName,
			EventDate:   input.EventDate,
			ThemeKey:    input.ThemeKey,
			IsPublished: false,
			Content:     normalizeContent(input.Content, input.FullName),
		})
		if err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		return "", "", "", "", err
	}

	return customerID, invitationID, slug, domain, nil
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

func normalizeContent(input []byte, fullName string) []byte {
	if len(bytes.TrimSpace(input)) > 0 {
		return input
	}

	fullName = strings.TrimSpace(fullName)
	firstName := fullName
	if fullName != "" {
		parts := strings.Fields(fullName)
		if len(parts) > 0 {
			firstName = parts[0]
		}
	}

	payload := map[string]any{
		"couple": map[string]any{
			"groomName":     firstName,
			"groomFullName": fullName,
		},
	}

	encoded, err := json.Marshal(payload)
	if err != nil {
		return []byte("{}")
	}
	return encoded
}
