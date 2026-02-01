package admin

import (
	"context"

	"github.com/proxima-labs/wedding-invitation-back-end/internal/model"
	"github.com/proxima-labs/wedding-invitation-back-end/internal/repository"
)

type InvitationService struct {
	Repo *repository.InvitationRepository
}

func (s *InvitationService) Create(ctx context.Context, input repository.InvitationCreateInput) (string, error) {
	return s.Repo.Create(ctx, input)
}

func (s *InvitationService) GetByID(ctx context.Context, id string) (model.Invitation, bool, error) {
	return s.Repo.GetByID(ctx, id)
}

func (s *InvitationService) Update(ctx context.Context, id string, input repository.InvitationUpdateInput) error {
	return s.Repo.Update(ctx, id, input)
}

func (s *InvitationService) Delete(ctx context.Context, id string) error {
	return s.Repo.Delete(ctx, id)
}

func (s *InvitationService) List(ctx context.Context, filters repository.InvitationListFilters) ([]model.Invitation, error) {
	return s.Repo.List(ctx, filters)
}
