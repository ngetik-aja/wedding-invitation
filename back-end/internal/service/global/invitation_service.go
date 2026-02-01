package global

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/proxima-labs/wedding-invitation-back-end/internal/model"
	"github.com/proxima-labs/wedding-invitation-back-end/internal/repository"
)

type InvitationService struct {
	Repo *repository.InvitationRepository
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
