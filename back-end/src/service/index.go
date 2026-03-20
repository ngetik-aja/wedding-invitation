package service

import (
	"github.com/proxima-labs/wedding-invitation-back-end/src/auth"
	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
	adminService "github.com/proxima-labs/wedding-invitation-back-end/src/service/admin"
	customerService "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
	"github.com/proxima-labs/wedding-invitation-back-end/src/service/external"
)

type Registry struct {
	Customer            *customerService.CustomerService
	CustomerAuth        *customerService.AuthService
	Invitation          *customerService.InvitationService
	PublicInvitation    *customerService.PublicInvitationService
	CustomerPayment     *customerService.PaymentService
	CustomerPlan        *customerService.PlanService
	CustomerPlanEnforce *customerService.PlanEnforcer
	AdminAuth           *adminService.AuthService
	AdminUser           *adminService.UserService
	AdminInvitation     *adminService.InvitationService
	AdminCustomer       *adminService.CustomerService
	AdminPayment        *adminService.PaymentService
}

func NewRegistry(repos repository.Registry, jwtConfig auth.Config, customerJwtConfig auth.Config, midtransService *external.MidtransService) Registry {
	customerSvc := &customerService.CustomerService{Repo: repos.Customer}
	customerAuthSvc := &customerService.AuthService{
		CustomerRepo:     repos.Customer,
		InvitationRepo:   repos.Invitation,
		RefreshTokenRepo: repos.CustomerRefreshToken,
		Config:           customerJwtConfig,
	}
	invitationSvc := &customerService.InvitationService{Repo: repos.Invitation, CustomerRepo: repos.Customer}
	publicInvitationSvc := &customerService.PublicInvitationService{InvitationRepo: repos.Invitation, RsvpRepo: repos.Rsvp, WishRepo: repos.Wish}
	paymentSvc := &customerService.PaymentService{CustomerRepo: repos.Customer, PlanRepo: repos.Plan, PaymentRepo: repos.Payment, Midtrans: midtransService}
	planSvc := &customerService.PlanService{Repo: repos.Plan}
	planEnforcerSvc := &customerService.PlanEnforcer{PaymentRepo: repos.Payment}
	adminAuthSvc := &adminService.AuthService{Repo: repos.User, Config: jwtConfig}
	adminUserSvc := &adminService.UserService{Repo: repos.User}
	adminInvitationSvc := &adminService.InvitationService{Repo: repos.Invitation, CustomerRepo: repos.Customer}
	adminCustomerSvc := &adminService.CustomerService{Repo: repos.Customer}
	adminPaymentSvc := &adminService.PaymentService{Repo: repos.Payment}

	return Registry{
		Customer:            customerSvc,
		CustomerAuth:        customerAuthSvc,
		Invitation:          invitationSvc,
		PublicInvitation:    publicInvitationSvc,
		CustomerPayment:     paymentSvc,
		CustomerPlan:        planSvc,
		CustomerPlanEnforce: planEnforcerSvc,
		AdminAuth:           adminAuthSvc,
		AdminUser:           adminUserSvc,
		AdminInvitation:     adminInvitationSvc,
		AdminCustomer:       adminCustomerSvc,
		AdminPayment:        adminPaymentSvc,
	}
}
