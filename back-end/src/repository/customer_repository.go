package repository

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/proxima-labs/wedding-invitation-back-end/src/model"
)

type CustomerRepository struct {
	DB *pgxpool.Pool
}

type CustomerCreateInput struct {
	FullName     string
	Email        string
	PasswordHash string
	Domain       string
}

func (r *CustomerRepository) Create(ctx context.Context, input CustomerCreateInput) (string, error) {
	return r.createWithQuerier(ctx, r.DB, input)
}

func (r *CustomerRepository) CreateTx(ctx context.Context, tx pgx.Tx, input CustomerCreateInput) (string, error) {
	return r.createWithQuerier(ctx, tx, input)
}

func (r *CustomerRepository) createWithQuerier(ctx context.Context, querier interface {
	QueryRow(context.Context, string, ...any) pgx.Row
}, input CustomerCreateInput) (string, error) {
	var id string
	err := querier.QueryRow(ctx, `
		INSERT INTO customers (full_name, email, password_hash, domain)
		VALUES ($1, $2, $3, $4)
		RETURNING id
	`, input.FullName, input.Email, input.PasswordHash, input.Domain).Scan(&id)
	return id, err
}

func (r *CustomerRepository) FindByDomain(ctx context.Context, domain string) (model.Customer, bool, error) {
	var customer model.Customer
	row := r.DB.QueryRow(ctx, `
		SELECT id, full_name, email, domain, status, created_at
		FROM customers
		WHERE domain = $1
		LIMIT 1
	`, domain)
	if err := row.Scan(&customer.ID, &customer.FullName, &customer.Email, &customer.Domain, &customer.Status, &customer.CreatedAt); err != nil {
		return model.Customer{}, false, nil
	}
	return customer, true, nil
}

func (r *CustomerRepository) FindByID(ctx context.Context, id string) (model.Customer, bool, error) {
	var customer model.Customer
	row := r.DB.QueryRow(ctx, `
		SELECT id, full_name, email, domain, status, created_at
		FROM customers
		WHERE id = $1
		LIMIT 1
	`, id)
	if err := row.Scan(&customer.ID, &customer.FullName, &customer.Email, &customer.Domain, &customer.Status, &customer.CreatedAt); err != nil {
		return model.Customer{}, false, nil
	}
	return customer, true, nil
}

func (r *CustomerRepository) UpdateDomainIfEmpty(ctx context.Context, id string, domain string) error {
	_, err := r.DB.Exec(ctx, `
		UPDATE customers
		SET domain = $2
		WHERE id = $1 AND (domain = '' OR domain IS NULL)
	`, id, domain)
	return err
}

func (r *CustomerRepository) ExistsByDomain(ctx context.Context, domain string) (bool, error) {
	var exists bool
	row := r.DB.QueryRow(ctx, `
		SELECT EXISTS (
			SELECT 1
			FROM customers
			WHERE domain = $1
		)
	`, domain)
	if err := row.Scan(&exists); err != nil {
		return false, err
	}
	return exists, nil
}

func (r *CustomerRepository) List(ctx context.Context, limit int) ([]model.Customer, error) {
	if limit <= 0 {
		limit = 100
	}
	if limit > 500 {
		limit = 500
	}
	rows, err := r.DB.Query(ctx, `
		SELECT id, full_name, email, domain, status, created_at
		FROM customers
		ORDER BY created_at DESC
		LIMIT $1
	`, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := make([]model.Customer, 0)
	for rows.Next() {
		var customer model.Customer
		if err := rows.Scan(&customer.ID, &customer.FullName, &customer.Email, &customer.Domain, &customer.Status, &customer.CreatedAt); err != nil {
			return nil, err
		}
		items = append(items, customer)
	}

	return items, rows.Err()
}
