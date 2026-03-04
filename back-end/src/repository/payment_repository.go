package repository

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/proxima-labs/wedding-invitation-back-end/src/model"
	"gorm.io/gorm"
)

type PaymentRepository struct {
	DB *gorm.DB
}

type PaymentCreateInput struct {
	CustomerID     string
	PlanID         string
	Amount         int
	Currency       string
	ProofOfPayment string
	Status         string
	PaidAt         *time.Time
}

func (r *PaymentRepository) Create(ctx context.Context, input PaymentCreateInput) (string, error) {
	payment := model.Payment{
		CustomerID:     input.CustomerID,
		PlanID:         input.PlanID,
		Amount:         input.Amount,
		Currency:       input.Currency,
		ProofOfPayment: input.ProofOfPayment,
		Status:         input.Status,
		PaidAt:         input.PaidAt,
	}
	if err := r.DB.WithContext(ctx).Model(&model.Payment{}).Create(&payment).Error; err != nil {
		return "", err
	}
	return payment.ID, nil
}

func (r *PaymentRepository) GetByIDAndCustomer(ctx context.Context, paymentID, customerID string) (model.Payment, bool, error) {
	var payment model.Payment
	err := r.DB.WithContext(ctx).
		Model(&model.Payment{}).
		Where("id = ? AND customer_id = ?", paymentID, customerID).
		First(&payment).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return model.Payment{}, false, nil
	}
	if err != nil {
		return model.Payment{}, false, err
	}
	return payment, true, nil
}

func (r *PaymentRepository) GetLatestByCustomer(ctx context.Context, customerID string) (model.Payment, bool, error) {
	var payment model.Payment
	err := r.DB.WithContext(ctx).
		Model(&model.Payment{}).
		Where("customer_id = ?", customerID).
		Order("created_at DESC").
		First(&payment).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return model.Payment{}, false, nil
	}
	if err != nil {
		return model.Payment{}, false, err
	}
	return payment, true, nil
}

func (r *PaymentRepository) GetByMidtransOrderID(ctx context.Context, orderID string) (model.Payment, bool, error) {
	orderID = strings.TrimSpace(orderID)
	if orderID == "" {
		return model.Payment{}, false, nil
	}

	var payment model.Payment
	err := r.DB.WithContext(ctx).
		Model(&model.Payment{}).
		Where(
			"(CASE WHEN proof_of_payment LIKE '{%' THEN proof_of_payment::jsonb ->> 'order_id' ELSE NULL END) = ? OR proof_of_payment = ? OR proof_of_payment = ?",
			orderID,
			orderID,
			"midtrans:"+orderID,
		).
		Order("created_at DESC").
		First(&payment).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return model.Payment{}, false, nil
	}
	if err != nil {
		return model.Payment{}, false, err
	}
	return payment, true, nil
}

func (r *PaymentRepository) UpdateStatus(ctx context.Context, paymentID, status string, paidAt *time.Time) error {
	updates := map[string]any{
		"status": status,
	}
	if paidAt != nil {
		updates["paid_at"] = *paidAt
	}

	return r.DB.WithContext(ctx).
		Model(&model.Payment{}).
		Where("id = ?", paymentID).
		Updates(updates).Error
}
