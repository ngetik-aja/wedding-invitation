package admin

import (
	"context"
	"errors"
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
	if !content.IsPaid(customer.Status) {
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
	return s.CustomerRepo.UpdateDomainIfEmpty(ctx, input.CustomerID, input.Slug)
}

func (s *InvitationService) Delete(ctx context.Context, id string) error {
	return s.Repo.Delete(ctx, id)
}

func (s *InvitationService) List(ctx context.Context, filters query.InvitationListFilters) ([]model.Invitation, error) {
	return s.Repo.List(ctx, filters)
}


func (s *InvitationService) ensureSlug(ctx context.Context, customerID, inputSlug, title string) (string, error) {
	base := slug.Slugify(inputSlug)
	if base == "" {
		base = slug.Slugify(title)
	}
	return slug.EnsureUnique(ctx, base, func(ctx context.Context, candidate string) (bool, error) {
		return s.Repo.ExistsByCustomerAndSlug(ctx, customerID, candidate)
	})
}

func (s *InvitationService) ListWithCustomers(ctx context.Context, filters query.InvitationListFilters) ([]repository.InvitationWithCustomer, error) {
	return s.Repo.ListWithCustomer(ctx, filters)
}
