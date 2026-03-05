package repository

import (
	"context"
	"errors"
	"strings"

	"github.com/proxima-labs/wedding-invitation-back-end/src/model"
	"gorm.io/gorm"
)

type PlanRepository struct {
	DB *gorm.DB
}

func (r *PlanRepository) FindByCode(ctx context.Context, code string) (model.Plan, bool, error) {
	var plan model.Plan
	err := r.DB.WithContext(ctx).
		Model(&model.Plan{}).
		Where("LOWER(code) = ?", strings.ToLower(strings.TrimSpace(code))).
		First(&plan).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return model.Plan{}, false, nil
	}
	if err != nil {
		return model.Plan{}, false, err
	}
	return plan, true, nil
}
