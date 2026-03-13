package model

import "time"

type RSVP struct {
	ID           string    `gorm:"column:id;type:uuid;default:gen_random_uuid();primaryKey"`
	InvitationID string    `gorm:"column:invitation_id"`
	GuestName    string    `gorm:"column:guest_name"`
	Attendance   string    `gorm:"column:attendance"`
	GuestsCount  int       `gorm:"column:guests_count"`
	Message      string    `gorm:"column:message"`
	CreatedAt    time.Time `gorm:"column:created_at;autoCreateTime"`
}

func (RSVP) TableName() string {
	return "rsvps"
}
