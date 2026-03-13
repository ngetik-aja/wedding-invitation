package model

import "time"

type Plan struct {
	ID          string    `gorm:"column:id;type:uuid;default:gen_random_uuid();primaryKey"`
	Code        string    `gorm:"column:code"`
	Name        string    `gorm:"column:name"`
	PriceAmount int       `gorm:"column:price_amount"`
	Currency    string    `gorm:"column:currency"`
	Features    []byte    `gorm:"column:features;type:jsonb"`
	Limits      []byte    `gorm:"column:limits;type:jsonb"`
	CreatedAt   time.Time `gorm:"column:created_at;autoCreateTime"`
}

func (Plan) TableName() string {
	return "plans"
}
