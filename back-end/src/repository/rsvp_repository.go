package repository

import (
	"context"

	"github.com/proxima-labs/wedding-invitation-back-end/src/model"
	"gorm.io/gorm"
)

type RsvpRepository struct {
	DB *gorm.DB
}

type CreateRsvpInput struct {
	InvitationID string
	GuestName    string
	Attendance   string
	GuestsCount  int
	Message      string
}

func (r *RsvpRepository) Create(ctx context.Context, input CreateRsvpInput) (model.RSVP, error) {
	item := model.RSVP{
		InvitationID: input.InvitationID,
		GuestName:    input.GuestName,
		Attendance:   input.Attendance,
		GuestsCount:  input.GuestsCount,
		Message:      input.Message,
	}
	if err := r.DB.WithContext(ctx).Model(&model.RSVP{}).Create(&item).Error; err != nil {
		return model.RSVP{}, err
	}
	return item, nil
}
