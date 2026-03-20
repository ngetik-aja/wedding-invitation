package customer

import (
	"context"
	"fmt"
	"strings"

	"github.com/proxima-labs/wedding-invitation-back-end/src/content"
	"github.com/proxima-labs/wedding-invitation-back-end/src/model"
	"github.com/proxima-labs/wedding-invitation-back-end/src/query"
	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
	"github.com/proxima-labs/wedding-invitation-back-end/src/slug"
)

type InvitationService struct {
	Repo         *repository.InvitationRepository
	CustomerRepo *repository.CustomerRepository
}

func (s *InvitationService) GetByID(ctx context.Context, id string) (model.Invitation, bool, error) {
	return s.Repo.GetByID(ctx, id)
}

func (s *InvitationService) Update(ctx context.Context, id string, input repository.InvitationUpdateInput) error {
	current, ok, err := s.Repo.GetByID(ctx, id)
	if err != nil {
		return err
	}
	if !ok {
		return fmt.Errorf("invitation not found")
	}

	inputSlug := strings.TrimSpace(slug.Slugify(input.Slug))
	if inputSlug == "" {
		inputSlug = strings.TrimSpace(current.Slug)
	}
	input.Slug = inputSlug

	if err := s.Repo.Update(ctx, id, input); err != nil {
		return err
	}

	if s.CustomerRepo != nil && input.CustomerID != "" && inputSlug != "" {
		if err := s.syncDomainWithSlug(ctx, input.CustomerID, current.Slug, inputSlug); err != nil {
			return err
		}
	}

	return nil
}

func (s *InvitationService) GetPublishedContent(ctx context.Context, customerID, slug string) (map[string]any, bool, error) {
	inv, ok, err := s.Repo.FindPublishedByCustomerAndSlug(ctx, customerID, slug)
	if err != nil || !ok {
		return nil, ok, err
	}
	decoded, err := content.Decode(inv.Content)
	if err != nil {
		return nil, false, err
	}
	return decoded, true, nil
}

func (s *InvitationService) normalizeListFilters(filters query.InvitationListFilters) query.InvitationListFilters {
	if filters.Limit <= 0 {
		filters.Limit = 20
	}
	if filters.Limit > 100 {
		filters.Limit = 100
	}
	if filters.Offset < 0 {
		filters.Offset = 0
	}
	return filters
}

func (s *InvitationService) List(ctx context.Context, filters query.InvitationListFilters) ([]model.Invitation, error) {
	return s.Repo.List(ctx, s.normalizeListFilters(filters))
}

func (s *InvitationService) syncDomainWithSlug(ctx context.Context, customerID, oldSlug, newSlug string) error {
	oldSlug = strings.TrimSpace(oldSlug)
	newSlug = strings.TrimSpace(newSlug)
	if oldSlug == "" || newSlug == "" || oldSlug == newSlug {
		return nil
	}

	customer, ok, err := s.CustomerRepo.FindByID(ctx, customerID)
	if err != nil || !ok {
		return err
	}

	if strings.TrimSpace(customer.Domain) != oldSlug {
		return nil
	}

	return s.CustomerRepo.UpdateDomain(ctx, customerID, newSlug)
}

