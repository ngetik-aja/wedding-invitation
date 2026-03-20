package repository

import (
	"context"
	"errors"
	"time"

	"github.com/proxima-labs/wedding-invitation-back-end/src/model"
	"gorm.io/gorm"
)

type CustomerRefreshTokenRepository struct {
	DB *gorm.DB
}

func (r *CustomerRefreshTokenRepository) Save(ctx context.Context, token model.CustomerRefreshToken) error {
	return r.DB.WithContext(ctx).Create(&token).Error
}

func (r *CustomerRefreshTokenRepository) FindByHash(ctx context.Context, hash string) (model.CustomerRefreshToken, bool, error) {
	var token model.CustomerRefreshToken
	err := r.DB.WithContext(ctx).Where("token_hash = ?", hash).First(&token).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return model.CustomerRefreshToken{}, false, nil
	}
	if err != nil {
		return model.CustomerRefreshToken{}, false, err
	}
	return token, true, nil
}

func (r *CustomerRefreshTokenRepository) Touch(ctx context.Context, hash string, newExpiry time.Time) error {
	return r.DB.WithContext(ctx).
		Model(&model.CustomerRefreshToken{}).
		Where("token_hash = ?", hash).
		Update("expires_at", newExpiry).Error
}

func (r *CustomerRefreshTokenRepository) Revoke(ctx context.Context, hash string) error {
	now := time.Now()
	return r.DB.WithContext(ctx).
		Model(&model.CustomerRefreshToken{}).
		Where("token_hash = ?", hash).
		Update("revoked_at", &now).Error
}
