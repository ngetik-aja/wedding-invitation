package customer

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
)

type PlanLimits struct {
	GalleryPhotos int
	LoveStory     bool
	Music         bool
	Gifts         bool
	CustomDomain  bool
	Templates     string
}

var basicPlanLimits = PlanLimits{
	GalleryPhotos: 4,
	Templates:     "1",
}

type PlanEnforcer struct {
	PaymentRepo *repository.PaymentRepository
}

func ParsePlanLimits(_, limits []byte) PlanLimits {
	pl := basicPlanLimits

	if len(limits) == 0 {
		return pl
	}

	var l struct {
		GalleryPhotos interface{} `json:"gallery_photos"`
		LoveStory     interface{} `json:"love_story"`
		Music         interface{} `json:"music"`
		Gifts         interface{} `json:"gifts"`
		Templates     interface{} `json:"templates"`
	}
	if err := json.Unmarshal(limits, &l); err != nil {
		return pl
	}

	if v, ok := toBool(l.LoveStory); ok {
		pl.LoveStory = v
	}
	if v, ok := toBool(l.Music); ok {
		pl.Music = v
	}
	if v, ok := toBool(l.Gifts); ok {
		pl.Gifts = v
	}
	if v, ok := toInt(l.GalleryPhotos); ok {
		pl.GalleryPhotos = v
	}
	switch v := l.Templates.(type) {
	case string:
		pl.Templates = v
	case float64:
		pl.Templates = fmt.Sprintf("%d", int(v))
	}

	return pl
}

func (e *PlanEnforcer) GetCustomerLimits(ctx context.Context, customerID string) (PlanLimits, error) {
	if e == nil || e.PaymentRepo == nil {
		return basicPlanLimits, nil
	}

	row, err := e.PaymentRepo.GetActivePlanForCustomer(ctx, customerID)
	if err != nil {
		return PlanLimits{}, err
	}
	if row == nil {
		return basicPlanLimits, nil
	}

	return ParsePlanLimits(row.PlanFeatures, row.PlanLimits), nil
}

func (e *PlanEnforcer) GetCustomerLimitsWithCode(ctx context.Context, customerID string) (string, PlanLimits, error) {
	if e == nil || e.PaymentRepo == nil {
		return "none", basicPlanLimits, nil
	}

	row, err := e.PaymentRepo.GetActivePlanForCustomer(ctx, customerID)
	if err != nil {
		return "", PlanLimits{}, err
	}
	if row == nil {
		return "none", basicPlanLimits, nil
	}

	return row.PlanCode, ParsePlanLimits(row.PlanFeatures, row.PlanLimits), nil
}

var allowedBasicThemes = map[string]struct{}{
	"elegant": {},
}

func ValidateContent(content []byte, limits PlanLimits) error {
	if len(content) == 0 {
		return nil
	}

	var payload struct {
		Gallery *struct {
			Photos []interface{} `json:"photos"`
		} `json:"gallery"`
		Story *struct {
			Stories []interface{} `json:"stories"`
		} `json:"story"`
		Music *struct {
			Enabled bool `json:"enabled"`
		} `json:"music"`
		Gift *struct {
			Banks []interface{} `json:"banks"`
		} `json:"gift"`
		Theme *struct {
			Theme string `json:"theme"`
		} `json:"theme"`
	}

	if err := json.Unmarshal(content, &payload); err != nil {
		return nil
	}

	if payload.Gallery != nil && len(payload.Gallery.Photos) > limits.GalleryPhotos {
		return fmt.Errorf("gallery photos limit exceeded (max %d)", limits.GalleryPhotos)
	}
	if !limits.LoveStory && payload.Story != nil && len(payload.Story.Stories) > 0 {
		return errors.New("love story not included in your plan")
	}
	if !limits.Music && payload.Music != nil && payload.Music.Enabled {
		return errors.New("music not included in your plan")
	}
	if !limits.Gifts && payload.Gift != nil && len(payload.Gift.Banks) > 0 {
		return errors.New("digital gift not included in your plan")
	}
	if limits.Templates == "1" && payload.Theme != nil && payload.Theme.Theme != "" {
		if _, allowed := allowedBasicThemes[payload.Theme.Theme]; !allowed {
			return errors.New("this template not included in your plan")
		}
	}

	return nil
}

func toBool(v interface{}) (bool, bool) {
	if v == nil {
		return false, false
	}
	switch val := v.(type) {
	case bool:
		return val, true
	case float64:
		return val != 0, true
	case string:
		return val == "true" || val == "1", true
	}
	return false, false
}

func toInt(v interface{}) (int, bool) {
	if v == nil {
		return 0, false
	}
	switch val := v.(type) {
	case float64:
		return int(val), true
	case int:
		return val, true
	}
	return 0, false
}
