package service

import (
	"github.com/proxima-labs/wedding-invitation-back-end/src/auth"
	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
	adminService "github.com/proxima-labs/wedding-invitation-back-end/src/service/admin"
	customerService "github.com/proxima-labs/wedding-invitation-back-end/src/service/customer"
	"github.com/proxima-labs/wedding-invitation-back-end/src/service/external"
)

type Registry struct {
	Customer        *customerService.CustomerService
	Invitation      *customerService.InvitationService
	Register        *customerService.RegisterService
	CustomerLogin   *customerService.LoginService
	CustomerPayment *customerService.PaymentService
	AdminAuth       *adminService.AuthService
	AdminUser       *adminService.UserService
	AdminInvitation *adminService.InvitationService
	AdminCustomer   *adminService.CustomerService
}

func NewRegistry(repos repository.Registry, baseDomain string, jwtConfig auth.Config, midtransService *external.MidtransService) Registry {
	customerSvc := &customerService.CustomerService{Repo: repos.Customer}
	invitationSvc := &customerService.InvitationService{Repo: repos.Invitation, CustomerRepo: repos.Customer, BaseDomain: baseDomain}
	registerSvc := &customerService.RegisterService{CustomerRepo: repos.Customer, InvitationRepo: repos.Invitation, BaseDomain: baseDomain}
	loginSvc := &customerService.LoginService{CustomerRepo: repos.Customer, InvitationRepo: repos.Invitation}
	paymentSvc := &customerService.PaymentService{CustomerRepo: repos.Customer, PlanRepo: repos.Plan, PaymentRepo: repos.Payment, Midtrans: midtransService}
	adminAuthSvc := &adminService.AuthService{Repo: repos.User, Config: jwtConfig}
	adminUserSvc := &adminService.UserService{Repo: repos.User}
	adminInvitationSvc := &adminService.InvitationService{Repo: repos.Invitation, CustomerRepo: repos.Customer, BaseDomain: baseDomain}
	adminCustomerSvc := &adminService.CustomerService{Repo: repos.Customer}

	return Registry{
		Customer:        customerSvc,
		Invitation:      invitationSvc,
		Register:        registerSvc,
		CustomerLogin:   loginSvc,
		CustomerPayment: paymentSvc,
		AdminAuth:       adminAuthSvc,
		AdminUser:       adminUserSvc,
		AdminInvitation: adminInvitationSvc,
		AdminCustomer:   adminCustomerSvc,
	}
}
