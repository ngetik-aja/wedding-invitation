package customer

import (
	"context"
	"strings"

	"github.com/proxima-labs/wedding-invitation-back-end/src/model"
	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
)

type CustomerService struct {
	Repo *repository.CustomerRepository
}

func (s *CustomerService) ResolveByHost(ctx context.Context, host string) (model.Customer, bool, error) {
	host = strings.TrimSpace(host)
	if host == "" {
		return model.Customer{}, false, nil
	}
	if strings.Contains(host, ":") {
		host = strings.Split(host, ":")[0]
	}

	customer, ok, err := s.Repo.FindByDomain(ctx, host)
	if err != nil || ok {
		return customer, ok, err
	}

	return model.Customer{}, false, nil
}

func (s *CustomerService) ResolveByDomain(ctx context.Context, domain string) (model.Customer, bool, error) {
	domain = strings.TrimSpace(domain)
	if domain == "" {
		return model.Customer{}, false, nil
	}

	return s.Repo.FindByDomain(ctx, domain)
}
