package model

import "time"

type Invitation struct {
	ID          string     `gorm:"column:id;type:uuid;default:gen_random_uuid();primaryKey"`
	CustomerID  string     `gorm:"column:customer_id"`
	Slug        string     `gorm:"column:slug"`
	Title       string     `gorm:"column:title"`
	SearchName  string     `gorm:"column:search_name"`
	EventDate   *time.Time `gorm:"column:event_date"`
	ThemeKey    string     `gorm:"column:theme_key"`
	IsPublished bool       `gorm:"column:is_published"`
	Content     []byte     `gorm:"column:content;type:jsonb"`
	CreatedAt   time.Time  `gorm:"column:created_at;autoCreateTime"`
	UpdatedAt   time.Time  `gorm:"column:updated_at;autoUpdateTime"`
}

func (Invitation) TableName() string {
	return "invitations"
}
