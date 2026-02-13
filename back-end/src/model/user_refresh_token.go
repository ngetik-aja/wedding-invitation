package model

import "time"

type UserRefreshToken struct {
	ID        string     `gorm:"column:id;type:uuid;default:gen_random_uuid();primaryKey"`
	UserID    string     `gorm:"column:user_id"`
	TokenHash string     `gorm:"column:token_hash"`
	ExpiresAt time.Time  `gorm:"column:expires_at"`
	RevokedAt *time.Time `gorm:"column:revoked_at"`
	UserAgent string     `gorm:"column:user_agent"`
	IPAddress string     `gorm:"column:ip_address"`
}

func (UserRefreshToken) TableName() string {
	return "user_refresh_tokens"
}
