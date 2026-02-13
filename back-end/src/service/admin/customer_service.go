package admin

import (
	"context"

	"github.com/proxima-labs/wedding-invitation-back-end/src/model"
	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
)

type CustomerService struct {
	Repo *repository.CustomerRepository
}

func (s *CustomerService) NormalizeListLimit(limit int) int {
	if limit <= 0 {
		return 100
	}
	if limit > 500 {
		return 500
	}
	return limit
}

func (s *CustomerService) List(ctx context.Context, limit int) ([]model.Customer, error) {
	return s.Repo.List(ctx, s.NormalizeListLimit(limit))
}
