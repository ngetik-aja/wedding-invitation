package repository

import "gorm.io/gorm"

type Registry struct {
	Customer              *CustomerRepository
	CustomerRefreshToken  *CustomerRefreshTokenRepository
	Invitation            *InvitationRepository
	User                  *UserRepository
	Plan                  *PlanRepository
	Payment               *PaymentRepository
	Rsvp                  *RsvpRepository
	Wish                  *WishRepository
}

func NewRegistry(db *gorm.DB) Registry {
	return Registry{
		Customer:             &CustomerRepository{DB: db},
		CustomerRefreshToken: &CustomerRefreshTokenRepository{DB: db},
		Invitation:           &InvitationRepository{DB: db},
		User:                 &UserRepository{DB: db},
		Plan:                 &PlanRepository{DB: db},
		Payment:              &PaymentRepository{DB: db},
		Rsvp:                 &RsvpRepository{DB: db},
		Wish:                 &WishRepository{DB: db},
	}
}
