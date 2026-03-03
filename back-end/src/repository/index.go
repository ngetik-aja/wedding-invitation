package repository

import "gorm.io/gorm"

type Registry struct {
	Customer   *CustomerRepository
	Invitation *InvitationRepository
	User       *UserRepository
	Plan       *PlanRepository
	Payment    *PaymentRepository
}

func NewRegistry(db *gorm.DB) Registry {
	return Registry{
		Customer:   &CustomerRepository{DB: db},
		Invitation: &InvitationRepository{DB: db},
		User:       &UserRepository{DB: db},
		Plan:       &PlanRepository{DB: db},
		Payment:    &PaymentRepository{DB: db},
	}
}
