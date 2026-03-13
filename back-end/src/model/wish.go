package model

import "time"

type Wish struct {
	ID           string    `gorm:"column:id;type:uuid;default:gen_random_uuid();primaryKey"`
	InvitationID string    `gorm:"column:invitation_id"`
	GuestName    string    `gorm:"column:guest_name"`
	Message      string    `gorm:"column:message"`
	CreatedAt    time.Time `gorm:"column:created_at;autoCreateTime"`
}

func (Wish) TableName() string {
	return "wishes"
}
