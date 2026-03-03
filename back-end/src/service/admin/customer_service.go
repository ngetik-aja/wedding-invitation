package admin

import (
	"context"

	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
)

type CustomerService struct {
	Repo *repository.CustomerRepository
}

type CustomerListItem struct {
	ID       string `json:"id"`
	FullName string `json:"full_name"`
	Email    string `json:"email"`
	Domain   string `json:"domain"`
	Status   string `json:"status"`
}

type CustomerListResult struct {
	Items []CustomerListItem `json:"items"`
	Limit int                `json:"limit"`
}

func (s *CustomerService) List(ctx context.Context, limit int) (CustomerListResult, error) {
	customers, err := s.Repo.List(ctx, limit)
	if err != nil {
		return CustomerListResult{}, err
	}

	items := make([]CustomerListItem, 0, len(customers))
	for _, customer := range customers {
		items = append(items, CustomerListItem{
			ID:       customer.ID,
			FullName: customer.FullName,
			Email:    customer.Email,
			Domain:   customer.Domain,
			Status:   customer.Status,
		})
	}

	return CustomerListResult{Items: items, Limit: limit}, nil
}
