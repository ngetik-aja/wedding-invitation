package admin

import (
	"context"

	"github.com/proxima-labs/wedding-invitation-back-end/internal/model"
	"github.com/proxima-labs/wedding-invitation-back-end/internal/repository"
)

type UserService struct {
	Repo *repository.UserRepository
}

func (s *UserService) GetByID(ctx context.Context, userID string) (model.User, bool, error) {
	return s.Repo.FindByID(ctx, userID)
}
