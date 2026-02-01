package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/proxima-labs/wedding-invitation-back-end/internal/model"
)

type CustomerRepository struct {
	DB *pgxpool.Pool
}

func (r *CustomerRepository) FindByDomain(ctx context.Context, domain string) (model.Customer, bool, error) {
	var customer model.Customer
	row := r.DB.QueryRow(ctx, `
		SELECT id, full_name, email, status, created_at
		FROM customers
		WHERE domain = $1
		LIMIT 1
	`, domain)
	if err := row.Scan(&customer.ID, &customer.FullName, &customer.Email, &customer.Status, &customer.CreatedAt); err != nil {
		return model.Customer{}, false, nil
	}
	return customer, true, nil
}

func (r *CustomerRepository) FindByID(ctx context.Context, id string) (model.Customer, bool, error) {
	var customer model.Customer
	row := r.DB.QueryRow(ctx, `
		SELECT id, full_name, email, status, created_at
		FROM customers
		WHERE id = $1
		LIMIT 1
	`, id)
	if err := row.Scan(&customer.ID, &customer.FullName, &customer.Email, &customer.Status, &customer.CreatedAt); err != nil {
		return model.Customer{}, false, nil
	}
	return customer, true, nil
}
