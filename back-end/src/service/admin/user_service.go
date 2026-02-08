package admin

import (
	"context"

	"github.com/proxima-labs/wedding-invitation-back-end/src/model"
	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
)

type UserService struct {
	Repo *repository.UserRepository
}

func (s *UserService) GetByID(ctx context.Context, userID string) (model.User, bool, error) {
	return s.Repo.FindByID(ctx, userID)
}
