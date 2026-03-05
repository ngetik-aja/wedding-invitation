package model

import "time"

type Payment struct {
	ID             string     `gorm:"column:id;type:uuid;default:gen_random_uuid();primaryKey"`
	CustomerID     string     `gorm:"column:customer_id"`
	PlanID         string     `gorm:"column:plan_id"`
	Amount         int        `gorm:"column:amount"`
	Currency       string     `gorm:"column:currency"`
	ProofOfPayment string     `gorm:"column:proof_of_payment"`
	Status         string     `gorm:"column:status"`
	PaidAt         *time.Time `gorm:"column:paid_at"`
	CreatedAt      time.Time  `gorm:"column:created_at;autoCreateTime"`
	UpdatedAt      time.Time  `gorm:"column:updated_at;autoUpdateTime"`
}

func (Payment) TableName() string {
	return "payments"
}
