package admin

import (
	"context"
	"time"

	"github.com/proxima-labs/wedding-invitation-back-end/src/repository"
)

type PaymentService struct {
	Repo *repository.PaymentRepository
}

type PaymentListItem struct {
	ID            string     `json:"id"`
	CustomerID    string     `json:"customer_id"`
	CustomerName  string     `json:"customer_name"`
	CustomerEmail string     `json:"customer_email"`
	PlanID        string     `json:"plan_id"`
	PlanCode      string     `json:"plan_code"`
	PlanName      string     `json:"plan_name"`
	Amount        int        `json:"amount"`
	Currency      string     `json:"currency"`
	Status        string     `json:"status"`
	PaidAt        *time.Time `json:"paid_at"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}

type PaymentSummary struct {
	TotalRevenue  int64 `json:"total_revenue"`
	PaidCount     int64 `json:"paid_count"`
	PendingCount  int64 `json:"pending_count"`
	FailedCount   int64 `json:"failed_count"`
	RefundedCount int64 `json:"refunded_count"`
}

type PaymentListResult struct {
	Items   []PaymentListItem `json:"items"`
	Limit   int               `json:"limit"`
	Offset  int               `json:"offset"`
	Summary PaymentSummary    `json:"summary"`
}

func (s *PaymentService) List(ctx context.Context, filters repository.AdminPaymentFilters) (PaymentListResult, error) {
	rows, err := s.Repo.ListAdmin(ctx, filters)
	if err != nil {
		return PaymentListResult{}, err
	}

	summary, err := s.Repo.SummaryAdmin(ctx)
	if err != nil {
		return PaymentListResult{}, err
	}

	items := make([]PaymentListItem, 0, len(rows))
	for _, row := range rows {
		items = append(items, PaymentListItem{
			ID:            row.ID,
			CustomerID:    row.CustomerID,
			CustomerName:  row.CustomerName,
			CustomerEmail: row.CustomerEmail,
			PlanID:        row.PlanID,
			PlanCode:      row.PlanCode,
			PlanName:      row.PlanName,
			Amount:        row.Amount,
			Currency:      row.Currency,
			Status:        row.Status,
			PaidAt:        row.PaidAt,
			CreatedAt:     row.CreatedAt,
			UpdatedAt:     row.UpdatedAt,
		})
	}

	return PaymentListResult{
		Items:  items,
		Limit:  filters.Limit,
		Offset: filters.Offset,
		Summary: PaymentSummary{
			TotalRevenue:  summary.TotalRevenue,
			PaidCount:     summary.PaidCount,
			PendingCount:  summary.PendingCount,
			FailedCount:   summary.FailedCount,
			RefundedCount: summary.RefundedCount,
		},
	}, nil
}
