package admin

import (
	"context"
	"errors"
	"strings"

	"github.com/proxima-labs/wedding-invitation-back-end/src/model"
	"github.com/proxima-labs/wedding-invitation-back-end/src/query"
	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
	"github.com/proxima-labs/wedding-invitation-back-end/src/service/shared"
)

type InvitationService struct {
	Repo         *repository.InvitationRepository
	CustomerRepo *repository.CustomerRepository
	BaseDomain   string
}

var (
	ErrCustomerNotFound          = errors.New("customer not found")
	ErrCustomerNotPaid           = errors.New("customer not paid")
	ErrCustomerRepoNotConfigured = errors.New("customer repository not configured")
)

func (s *InvitationService) Create(ctx context.Context, input repository.InvitationCreateInput) (string, error) {
	if s.CustomerRepo == nil {
		return "", ErrCustomerRepoNotConfigured
	}
	customer, ok, err := s.CustomerRepo.FindByID(ctx, input.CustomerID)
	if err != nil {
		return "", err
	}
	if !ok {
		return "", ErrCustomerNotFound
	}
	if !isCustomerPaid(customer.Status) {
		return "", ErrCustomerNotPaid
	}
	slug, err := s.ensureSlug(ctx, input.CustomerID, input.Slug, input.Title)
	if err != nil {
		return "", err
	}
	input.Slug = slug
	return s.Repo.Create(ctx, input)
}

func (s *InvitationService) GetByID(ctx context.Context, id string) (model.Invitation, bool, error) {
	return s.Repo.GetByID(ctx, id)
}

func (s *InvitationService) Update(ctx context.Context, id string, input repository.InvitationUpdateInput) error {
	if input.Slug == "" {
		current, ok, err := s.Repo.GetByID(ctx, id)
		if err != nil {
			return err
		}
		if ok {
			input.Slug = current.Slug
		}
	}
	if input.Slug == "" {
		slug, err := s.ensureSlug(ctx, input.CustomerID, input.Slug, input.Title)
		if err != nil {
			return err
		}
		input.Slug = slug
	}
	if err := s.Repo.Update(ctx, id, input); err != nil {
		return err
	}
	if !input.IsPublished || s.CustomerRepo == nil {
		return nil
	}
	customer, ok, err := s.CustomerRepo.FindByID(ctx, input.CustomerID)
	if err != nil {
		return err
	}
	if !ok {
		return nil
	}
	if strings.TrimSpace(customer.Domain) != "" {
		return nil
	}
	domain := buildCustomerDomain(input.Slug, s.BaseDomain)
	return s.CustomerRepo.UpdateDomainIfEmpty(ctx, input.CustomerID, domain)
}

func (s *InvitationService) Delete(ctx context.Context, id string) error {
	return s.Repo.Delete(ctx, id)
}

func (s *InvitationService) NormalizeListFilters(filters query.InvitationListFilters) query.InvitationListFilters {
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
	return s.Repo.List(ctx, s.NormalizeListFilters(filters))
}

func buildCustomerDomain(slug string, baseDomain string) string {
	slug = strings.TrimSpace(slug)
	baseDomain = strings.TrimSpace(baseDomain)
	if slug == "" {
		return baseDomain
	}
	if baseDomain == "" {
		return slug
	}
	return slug + "." + baseDomain
}

func isCustomerPaid(status string) bool {
	normalized := strings.ToLower(strings.TrimSpace(status))
	switch normalized {
	case "paid":
		return true
	default:
		return false
	}
}

func (s *InvitationService) ensureSlug(ctx context.Context, customerID, slug, title string) (string, error) {
	base := shared.Slugify(slug)
	if base == "" {
		base = shared.Slugify(title)
	}
	return shared.EnsureUniqueSlug(ctx, base, func(ctx context.Context, candidate string) (bool, error) {
		return s.Repo.ExistsByCustomerAndSlug(ctx, customerID, candidate)
	})
}

func (s *InvitationService) ListWithCustomers(ctx context.Context, filters query.InvitationListFilters) ([]repository.InvitationWithCustomer, error) {
	return s.Repo.ListWithCustomer(ctx, s.NormalizeListFilters(filters))
}
