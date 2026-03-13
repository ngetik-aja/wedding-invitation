package customer

import (
	"context"
	"errors"

	"github.com/proxima-labs/wedding-invitation-back-end/src/model"
	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
)

var ErrPlanServiceNotConfigured = errors.New("plan service not configured")

type PlanService struct {
	Repo *repository.PlanRepository
}

func (s *PlanService) List(ctx context.Context) ([]model.Plan, error) {
	if s == nil || s.Repo == nil {
		return nil, ErrPlanServiceNotConfigured
	}

	return s.Repo.List(ctx)
}
