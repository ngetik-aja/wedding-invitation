package repository

import (
	"context"
	"errors"
	"time"

	"github.com/proxima-labs/wedding-invitation-back-end/src/model"
	"gorm.io/gorm"
)

type UserRepository struct {
	DB *gorm.DB
}

func (r *UserRepository) FindByEmail(ctx context.Context, email string) (model.User, bool, error) {
	var user model.User
	err := r.DB.WithContext(ctx).Model(&model.User{}).Where("email = ?", email).First(&user).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return model.User{}, false, nil
	}
	if err != nil {
		return model.User{}, false, err
	}
	return user, true, nil
}

func (r *UserRepository) FindByID(ctx context.Context, userID string) (model.User, bool, error) {
	var user model.User
	err := r.DB.WithContext(ctx).Model(&model.User{}).Where("id = ?", userID).First(&user).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return model.User{}, false, nil
	}
	if err != nil {
		return model.User{}, false, err
	}
	return user, true, nil
}

func (r *UserRepository) SaveRefreshToken(ctx context.Context, token model.UserRefreshToken) error {
	return r.DB.WithContext(ctx).Model(&model.UserRefreshToken{}).Create(&token).Error
}

func (r *UserRepository) FindRefreshToken(ctx context.Context, tokenHash string) (model.UserRefreshToken, bool, error) {
	var token model.UserRefreshToken
	err := r.DB.WithContext(ctx).Model(&model.UserRefreshToken{}).Where("token_hash = ?", tokenHash).First(&token).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return model.UserRefreshToken{}, false, nil
	}
	if err != nil {
		return model.UserRefreshToken{}, false, err
	}
	return token, true, nil
}

func (r *UserRepository) RevokeRefreshToken(ctx context.Context, tokenHash string) error {
	return r.DB.WithContext(ctx).
		Model(&model.UserRefreshToken{}).
		Where("token_hash = ? AND revoked_at IS NULL", tokenHash).
		Update("revoked_at", gorm.Expr("NOW()")).Error
}

func (r *UserRepository) RevokeAllForUser(ctx context.Context, userID string) error {
	return r.DB.WithContext(ctx).
		Model(&model.UserRefreshToken{}).
		Where("user_id = ? AND revoked_at IS NULL", userID).
		Update("revoked_at", gorm.Expr("NOW()")).Error
}

func (r *UserRepository) CleanupExpired(ctx context.Context) error {
	return r.DB.WithContext(ctx).
		Where("expires_at < NOW() OR revoked_at IS NOT NULL").
		Delete(&model.UserRefreshToken{}).Error
}

func (r *UserRepository) TouchRefreshToken(ctx context.Context, tokenHash string, expiresAt time.Time) error {
	return r.DB.WithContext(ctx).
		Model(&model.UserRefreshToken{}).
		Where("token_hash = ?", tokenHash).
		Update("expires_at", expiresAt).Error
}
