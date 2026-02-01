package global

import (
	"context"
	"strings"

	"github.com/proxima-labs/wedding-invitation-back-end/internal/model"
	"github.com/proxima-labs/wedding-invitation-back-end/internal/repository"
)

type CustomerService struct {
	Repo *repository.CustomerRepository
}

func (s *CustomerService) ResolveByHost(ctx context.Context, host string, baseDomain string) (model.Customer, bool, error) {
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

	_ = baseDomain
	return model.Customer{}, false, nil
}
