package customer

import (
	"context"
	"errors"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"github.com/proxima-labs/wedding-invitation-back-end/src/auth"
	"github.com/proxima-labs/wedding-invitation-back-end/src/content"
	"github.com/proxima-labs/wedding-invitation-back-end/src/model"
	"github.com/proxima-labs/wedding-invitation-back-end/src/query"
	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
	"github.com/proxima-labs/wedding-invitation-back-end/src/slug"
)

var (
	ErrInvalidCredentials  = errors.New("invalid credentials")
	ErrInvitationNotFound  = errors.New("invitation not found")
	ErrInvalidRefreshToken = errors.New("invalid refresh token")
	ErrAuthNotConfigured   = errors.New("auth service not configured")
)

var bcryptCompare = bcrypt.CompareHashAndPassword

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

type IssueRefreshTokenInput struct {
	CustomerID string
	UserAgent  string
	IP         string
}

type AuthService struct {
	CustomerRepo     *repository.CustomerRepository
	InvitationRepo   *repository.InvitationRepository
	RefreshTokenRepo *repository.CustomerRefreshTokenRepository
	Config           auth.Config
}

func (s *AuthService) Register(ctx context.Context, input RegisterInput) (customerID, invitationID, customerSlug, domain string, err error) {
	if s.CustomerRepo == nil || s.InvitationRepo == nil {
		return "", "", "", "", ErrAuthNotConfigured
	}

	customerID, err = slug.GenerateID()
	if err != nil {
		return "", "", "", "", err
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

	baseName := slug.Slugify(input.Slug)
	if baseName == "" {
		baseName = slug.Slugify(input.Title)
	}
	if baseName == "" {
		baseName = slug.Slugify(input.FullName)
	}

	customerSlug = baseName + "-" + slug.ShortID(customerID)
	domain = customerSlug

	err = s.CustomerRepo.DB.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		_, err = s.CustomerRepo.CreateTx(ctx, tx, repository.CustomerCreateInput{
			ID:           customerID,
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
			Slug:        customerSlug,
			Title:       input.Title,
			SearchName:  searchName,
			EventDate:   input.EventDate,
			ThemeKey:    input.ThemeKey,
			IsPublished: false,
			Content:     content.Normalize(input.Content, input.FullName),
		})
		return err
	})
	if err != nil {
		return "", "", "", "", err
	}

	return customerID, invitationID, customerSlug, domain, nil
}

func (s *AuthService) Login(ctx context.Context, email, password string) (customerID, invitationID, customerSlug, domain, normalizedEmail string, err error) {
	if s.CustomerRepo == nil || s.InvitationRepo == nil {
		return "", "", "", "", "", ErrInvalidCredentials
	}

	email = strings.TrimSpace(strings.ToLower(email))
	password = strings.TrimSpace(password)

	customer, ok, dbErr := s.CustomerRepo.FindByEmail(ctx, email)
	if dbErr != nil || !ok {
		return "", "", "", "", "", ErrInvalidCredentials
	}
	if err := bcryptCompare([]byte(customer.PasswordHash), []byte(password)); err != nil {
		return "", "", "", "", "", ErrInvalidCredentials
	}

	items, dbErr := s.InvitationRepo.List(ctx, query.InvitationListFilters{
		CustomerID: customer.ID,
		Limit:      1,
		Offset:     0,
	})
	if dbErr != nil {
		return "", "", "", "", "", dbErr
	}
	if len(items) == 0 {
		return "", "", "", "", "", ErrInvitationNotFound
	}

	inv := items[0]
	return customer.ID, inv.ID, inv.Slug, customer.Domain, customer.Email, nil
}

func (s *AuthService) IssueRefreshToken(ctx context.Context, input IssueRefreshTokenInput) (string, error) {
	token, hash, err := auth.NewRefreshToken(s.Config)
	if err != nil {
		return "", err
	}
	if err := s.RefreshTokenRepo.Save(ctx, model.CustomerRefreshToken{
		CustomerID: input.CustomerID,
		TokenHash:  hash,
		ExpiresAt:  time.Now().Add(s.Config.RefreshTTL),
		UserAgent:  input.UserAgent,
		IPAddress:  input.IP,
	}); err != nil {
		return "", err
	}
	return token, nil
}

func (s *AuthService) Refresh(ctx context.Context, refreshToken string) (string, error) {
	hash := auth.HashToken(refreshToken)
	stored, ok, err := s.RefreshTokenRepo.FindByHash(ctx, hash)
	if err != nil || !ok {
		return "", ErrInvalidRefreshToken
	}
	if stored.RevokedAt != nil || time.Now().After(stored.ExpiresAt) {
		return "", ErrInvalidRefreshToken
	}

	customer, ok, err := s.CustomerRepo.FindByID(ctx, stored.CustomerID)
	if err != nil || !ok {
		return "", ErrInvalidRefreshToken
	}

	accessToken, err := auth.NewAccessToken(s.Config, customer.ID, customer.Email)
	if err != nil {
		return "", err
	}

	_ = s.RefreshTokenRepo.Touch(ctx, hash, time.Now().Add(s.Config.RefreshTTL))

	return accessToken, nil
}
