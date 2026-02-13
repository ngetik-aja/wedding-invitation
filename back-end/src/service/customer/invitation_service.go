package customer

import (
	"context"
	"encoding/json"
	"fmt"
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

	slug := strings.TrimSpace(shared.Slugify(input.Slug))
	if slug == "" {
		slug = strings.TrimSpace(current.Slug)
	}
	input.Slug = slug

	if err := s.Repo.Update(ctx, id, input); err != nil {
		return err
	}

	if s.CustomerRepo != nil && input.CustomerID != "" && slug != "" {
		if err := s.syncDomainWithSlug(ctx, input.CustomerID, current.Slug, slug); err != nil {
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
	content, err := decodeContent(inv)
	if err != nil {
		return nil, false, err
	}
	return content, true, nil
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

	oldCandidates := map[string]struct{}{oldSlug: {}}
	baseDomain := strings.TrimSpace(s.BaseDomain)
	if baseDomain != "" {
		oldCandidates[oldSlug+"."+baseDomain] = struct{}{}
	}

	if _, shouldUpdate := oldCandidates[strings.TrimSpace(customer.Domain)]; !shouldUpdate {
		return nil
	}

	newDomain := newSlug
	if baseDomain != "" {
		newDomain = newSlug + "." + baseDomain
	}

	return s.CustomerRepo.UpdateDomain(ctx, customerID, newDomain)
}

func decodeContent(inv model.Invitation) (map[string]any, error) {
	if len(inv.Content) == 0 {
		return map[string]any{}, nil
	}
	var content map[string]any
	if err := json.Unmarshal(inv.Content, &content); err != nil {
		return nil, fmt.Errorf("invalid invitation content: %w", err)
	}
	return content, nil
}
