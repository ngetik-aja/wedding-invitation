package admin

import (
	"context"
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"

	"github.com/proxima-labs/wedding-invitation-back-end/internal/auth"
	"github.com/proxima-labs/wedding-invitation-back-end/internal/model"
	"github.com/proxima-labs/wedding-invitation-back-end/internal/repository"
)

var ErrInvalidCredentials = errors.New("invalid credentials")
var ErrInvalidRefreshToken = errors.New("invalid refresh token")

var bcryptCompare = bcrypt.CompareHashAndPassword

// AuthService handles admin authentication and refresh sessions.
type AuthService struct {
	Repo   *repository.UserRepository
	Config auth.Config
}

func (s *AuthService) Login(ctx context.Context, email, password, userAgent, ip string) (accessToken string, refreshToken string, refreshExpires time.Time, err error) {
	user, ok, err := s.Repo.FindByEmail(ctx, email)
	if err != nil || !ok {
		return "", "", time.Time{}, ErrInvalidCredentials
	}
	if err := bcryptCompare([]byte(user.PasswordHash), []byte(password)); err != nil {
		return "", "", time.Time{}, ErrInvalidCredentials
	}

	accessToken, err = auth.NewAccessToken(s.Config, user.ID, user.Email)
	if err != nil {
		return "", "", time.Time{}, err
	}

	refreshToken, refreshHash, err := auth.NewRefreshToken(s.Config)
	if err != nil {
		return "", "", time.Time{}, err
	}

	refreshExpires = time.Now().Add(s.Config.RefreshTTL)
	err = s.Repo.SaveRefreshToken(ctx, model.UserRefreshToken{
		UserID:    user.ID,
		TokenHash: refreshHash,
		ExpiresAt: refreshExpires,
		UserAgent: userAgent,
		IPAddress: ip,
	})
	if err != nil {
		return "", "", time.Time{}, err
	}

	return accessToken, refreshToken, refreshExpires, nil
}

func (s *AuthService) Refresh(ctx context.Context, refreshToken string) (string, time.Time, error) {
	hash := auth.HashToken(refreshToken)
	stored, ok, err := s.Repo.FindRefreshToken(ctx, hash)
	if err != nil || !ok {
		return "", time.Time{}, ErrInvalidRefreshToken
	}
	if stored.RevokedAt != nil || time.Now().After(stored.ExpiresAt) {
		return "", time.Time{}, ErrInvalidRefreshToken
	}

	user, ok, err := s.Repo.FindByID(ctx, stored.UserID)
	if err != nil || !ok {
		return "", time.Time{}, ErrInvalidRefreshToken
	}

	accessToken, err := auth.NewAccessToken(s.Config, user.ID, user.Email)
	if err != nil {
		return "", time.Time{}, err
	}

	newExpiry := time.Now().Add(s.Config.RefreshTTL)
	_ = s.Repo.TouchRefreshToken(ctx, hash, newExpiry)

	return accessToken, newExpiry, nil
}

func (s *AuthService) Logout(ctx context.Context, refreshToken string) error {
	if refreshToken == "" {
		return nil
	}
	return s.Repo.RevokeRefreshToken(ctx, auth.HashToken(refreshToken))
}
