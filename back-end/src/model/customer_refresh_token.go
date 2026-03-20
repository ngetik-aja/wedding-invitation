package model

import "time"

type CustomerRefreshToken struct {
	ID         string     `gorm:"column:id;type:uuid;default:gen_random_uuid();primaryKey"`
	CustomerID string     `gorm:"column:customer_id"`
	TokenHash  string     `gorm:"column:token_hash"`
	ExpiresAt  time.Time  `gorm:"column:expires_at"`
	RevokedAt  *time.Time `gorm:"column:revoked_at"`
	UserAgent  string     `gorm:"column:user_agent"`
	IPAddress  string     `gorm:"column:ip_address"`
	CreatedAt  time.Time  `gorm:"column:created_at"`
}

func (CustomerRefreshToken) TableName() string {
	return "customer_refresh_tokens"
}
