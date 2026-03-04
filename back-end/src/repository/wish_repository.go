package repository

import (
	"context"

	"github.com/proxima-labs/wedding-invitation-back-end/src/model"
	"gorm.io/gorm"
)

type WishRepository struct {
	DB *gorm.DB
}

type CreateWishInput struct {
	InvitationID string
	GuestName    string
	Message      string
}

func (r *WishRepository) Create(ctx context.Context, input CreateWishInput) (model.Wish, error) {
	item := model.Wish{
		InvitationID: input.InvitationID,
		GuestName:    input.GuestName,
		Message:      input.Message,
	}
	if err := r.DB.WithContext(ctx).Model(&model.Wish{}).Create(&item).Error; err != nil {
		return model.Wish{}, err
	}
	return item, nil
}

func (r *WishRepository) ListByInvitationID(ctx context.Context, invitationID string, limit int) ([]model.Wish, error) {
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}

	items := make([]model.Wish, 0)
	err := r.DB.WithContext(ctx).
		Model(&model.Wish{}).
		Where("invitation_id = ?", invitationID).
		Order("created_at DESC").
		Limit(limit).
		Find(&items).Error
	if err != nil {
		return nil, err
	}
	return items, nil
}
