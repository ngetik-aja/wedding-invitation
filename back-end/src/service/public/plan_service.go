package public

import (
	"context"
	"encoding/json"

	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
)

type PlanService struct {
	Repo *repository.PlanRepository
}

type PlanItem struct {
	Code        string          `json:"code"`
	Name        string          `json:"name"`
	PriceAmount int             `json:"price_amount"`
	Currency    string          `json:"currency"`
	Features    json.RawMessage `json:"features"`
	Limits      json.RawMessage `json:"limits"`
}

type PlanListResult struct {
	Items []PlanItem `json:"items"`
}

func (s *PlanService) List(ctx context.Context) (PlanListResult, error) {
	plans, err := s.Repo.List(ctx)
	if err != nil {
		return PlanListResult{}, err
	}

	items := make([]PlanItem, 0, len(plans))
	for _, p := range plans {
		features := json.RawMessage(p.Features)
		if len(features) == 0 {
			features = json.RawMessage("{}")
		}
		limits := json.RawMessage(p.Limits)
		if len(limits) == 0 {
			limits = json.RawMessage("{}")
		}
		items = append(items, PlanItem{
			Code:        p.Code,
			Name:        p.Name,
			PriceAmount: p.PriceAmount,
			Currency:    p.Currency,
			Features:    features,
			Limits:      limits,
		})
	}

	return PlanListResult{Items: items}, nil
}
