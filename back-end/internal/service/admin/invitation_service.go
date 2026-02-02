package admin

import (
	"context"
	"strings"

	"github.com/proxima-labs/wedding-invitation-back-end/internal/service/shared"

	"github.com/proxima-labs/wedding-invitation-back-end/internal/model"
	"github.com/proxima-labs/wedding-invitation-back-end/internal/repository"
)

type InvitationService struct {
	Repo         *repository.InvitationRepository
	CustomerRepo *repository.CustomerRepository
	BaseDomain   string
}

func (s *InvitationService) Create(ctx context.Context, input repository.InvitationCreateInput) (string, error) {
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

func (s *InvitationService) List(ctx context.Context, filters repository.InvitationListFilters) ([]model.Invitation, error) {
	return s.Repo.List(ctx, filters)
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

func (s *InvitationService) ensureSlug(ctx context.Context, customerID, slug, title string) (string, error) {
	base := shared.Slugify(slug)
	if base == "" {
		base = shared.Slugify(title)
	}
	return shared.EnsureUniqueSlug(ctx, base, func(ctx context.Context, candidate string) (bool, error) {
		return s.Repo.ExistsByCustomerAndSlug(ctx, customerID, candidate)
	})
}
