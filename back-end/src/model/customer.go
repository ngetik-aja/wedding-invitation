package model

import "time"

type Customer struct {
	ID           string    `gorm:"column:id;type:uuid;default:gen_random_uuid();primaryKey"`
	FullName     string    `gorm:"column:full_name"`
	Email        string    `gorm:"column:email"`
	PasswordHash string    `gorm:"column:password_hash"`
	Domain       string    `gorm:"column:domain"`
	Status       string    `gorm:"column:status"`
	CreatedAt    time.Time `gorm:"column:created_at;autoCreateTime"`
}

func (Customer) TableName() string {
	return "customers"
}
