package customer

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/proxima-labs/wedding-invitation-back-end/src/model"
	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
)

type InvitationService struct {
	Repo *repository.InvitationRepository
}

func (s *InvitationService) GetByID(ctx context.Context, id string) (model.Invitation, bool, error) {
	return s.Repo.GetByID(ctx, id)
}

func (s *InvitationService) Update(ctx context.Context, id string, input repository.InvitationUpdateInput) error {
	return s.Repo.Update(ctx, id, input)
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

func (s *InvitationService) List(ctx context.Context, filters repository.InvitationListFilters) ([]model.Invitation, error) {
	return s.Repo.List(ctx, filters)
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
