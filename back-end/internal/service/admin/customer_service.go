package admin

import (
	"context"

	"github.com/proxima-labs/wedding-invitation-back-end/internal/model"
	"github.com/proxima-labs/wedding-invitation-back-end/internal/repository"
)

type CustomerService struct {
	Repo *repository.CustomerRepository
}

func (s *CustomerService) List(ctx context.Context, limit int) ([]model.Customer, error) {
	return s.Repo.List(ctx, limit)
}
