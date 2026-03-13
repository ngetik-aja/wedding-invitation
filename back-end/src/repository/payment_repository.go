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

type AdminPaymentFilters struct {
	CustomerID string
	Status     string
	Limit      int
	Offset     int
}

type AdminPaymentRow struct {
	ID            string     `gorm:"column:id"`
	CustomerID    string     `gorm:"column:customer_id"`
	CustomerName  string     `gorm:"column:customer_name"`
	CustomerEmail string     `gorm:"column:customer_email"`
	PlanID        string     `gorm:"column:plan_id"`
	PlanCode      string     `gorm:"column:plan_code"`
	PlanName      string     `gorm:"column:plan_name"`
	Amount        int        `gorm:"column:amount"`
	Currency      string     `gorm:"column:currency"`
	Status        string     `gorm:"column:status"`
	PaidAt        *time.Time `gorm:"column:paid_at"`
	CreatedAt     time.Time  `gorm:"column:created_at"`
	UpdatedAt     time.Time  `gorm:"column:updated_at"`
}

type AdminPaymentSummary struct {
	TotalRevenue  int64
	PaidCount     int64
	PendingCount  int64
	FailedCount   int64
	RefundedCount int64
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

func (r *PaymentRepository) ListAdmin(ctx context.Context, filters AdminPaymentFilters) ([]AdminPaymentRow, error) {
	query := r.DB.WithContext(ctx).
		Table("payments").
		Select("payments.id, payments.customer_id, customers.full_name as customer_name, customers.email as customer_email, payments.plan_id, plans.code as plan_code, plans.name as plan_name, payments.amount, payments.currency, payments.status, payments.paid_at, payments.created_at, payments.updated_at").
		Joins("JOIN customers ON customers.id = payments.customer_id").
		Joins("JOIN plans ON plans.id = payments.plan_id")

	if strings.TrimSpace(filters.CustomerID) != "" {
		query = query.Where("payments.customer_id = ?", strings.TrimSpace(filters.CustomerID))
	}
	if strings.TrimSpace(filters.Status) != "" {
		query = query.Where("payments.status = ?", strings.TrimSpace(filters.Status))
	}

	rows := make([]AdminPaymentRow, 0)
	if err := query.
		Order("payments.created_at DESC").
		Limit(filters.Limit).
		Offset(filters.Offset).
		Scan(&rows).Error; err != nil {
		return nil, err
	}

	return rows, nil
}

func (r *PaymentRepository) SummaryAdmin(ctx context.Context) (AdminPaymentSummary, error) {
	summary := AdminPaymentSummary{}

	if err := r.DB.WithContext(ctx).
		Table("payments").
		Select(
			"COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) as total_revenue, " +
				"SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_count, " +
				"SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count, " +
				"SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_count, " +
				"SUM(CASE WHEN status = 'refunded' THEN 1 ELSE 0 END) as refunded_count",
		).
		Scan(&summary).Error; err != nil {
		return AdminPaymentSummary{}, err
	}

	return summary, nil
}
