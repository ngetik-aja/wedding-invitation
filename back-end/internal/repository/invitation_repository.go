package repository

import (
	"context"
	"strconv"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/proxima-labs/wedding-invitation-back-end/internal/model"
)

type InvitationRepository struct {
	DB *pgxpool.Pool
}

type InvitationCreateInput struct {
	CustomerID  string
	Slug        string
	Title       string
	SearchName  string
	EventDate   *time.Time
	ThemeKey    string
	IsPublished bool
	Content     []byte
}

type InvitationUpdateInput = InvitationCreateInput

func (r *InvitationRepository) Create(ctx context.Context, input InvitationCreateInput) (string, error) {
	var id string
	err := r.DB.QueryRow(ctx, `
		INSERT INTO invitations (
			customer_id,
			slug,
			title,
			search_name,
			event_date,
			theme_key,
			is_published,
			content
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id
	`, input.CustomerID, input.Slug, input.Title, input.SearchName, input.EventDate, input.ThemeKey, input.IsPublished, input.Content).Scan(&id)
	return id, err
}

func (r *InvitationRepository) GetByID(ctx context.Context, id string) (model.Invitation, bool, error) {
	var inv model.Invitation
	row := r.DB.QueryRow(ctx, `
		SELECT id, customer_id, slug, title, search_name, event_date, theme_key, is_published, content, created_at, updated_at
		FROM invitations
		WHERE id = $1
		LIMIT 1
	`, id)
	if err := row.Scan(
		&inv.ID,
		&inv.CustomerID,
		&inv.Slug,
		&inv.Title,
		&inv.SearchName,
		&inv.EventDate,
		&inv.ThemeKey,
		&inv.IsPublished,
		&inv.Content,
		&inv.CreatedAt,
		&inv.UpdatedAt,
	); err != nil {
		return model.Invitation{}, false, nil
	}
	return inv, true, nil
}

func (r *InvitationRepository) Update(ctx context.Context, id string, input InvitationUpdateInput) error {
	_, err := r.DB.Exec(ctx, `
		UPDATE invitations
		SET customer_id = $2,
			slug = $3,
			title = $4,
			search_name = $5,
			event_date = $6,
			theme_key = $7,
			is_published = $8,
			content = $9,
			updated_at = now()
		WHERE id = $1
	`, id, input.CustomerID, input.Slug, input.Title, input.SearchName, input.EventDate, input.ThemeKey, input.IsPublished, input.Content)
	return err
}

func (r *InvitationRepository) Delete(ctx context.Context, id string) error {
	_, err := r.DB.Exec(ctx, `
		DELETE FROM invitations
		WHERE id = $1
	`, id)
	return err
}

func (r *InvitationRepository) FindPublishedByCustomerAndSlug(ctx context.Context, customerID, slug string) (model.Invitation, bool, error) {
	var inv model.Invitation
	row := r.DB.QueryRow(ctx, `
		SELECT id, customer_id, slug, title, search_name, event_date, theme_key, is_published, content, created_at, updated_at
		FROM invitations
		WHERE customer_id = $1 AND slug = $2 AND is_published = true
		LIMIT 1
	`, customerID, slug)
	if err := row.Scan(
		&inv.ID,
		&inv.CustomerID,
		&inv.Slug,
		&inv.Title,
		&inv.SearchName,
		&inv.EventDate,
		&inv.ThemeKey,
		&inv.IsPublished,
		&inv.Content,
		&inv.CreatedAt,
		&inv.UpdatedAt,
	); err != nil {
		return model.Invitation{}, false, nil
	}
	return inv, true, nil
}

func (r *InvitationRepository) List(ctx context.Context, filters InvitationListFilters) ([]model.Invitation, error) {
	args := make([]any, 0)
	where := make([]string, 0)

	if filters.CustomerID != "" {
		args = append(args, filters.CustomerID)
		where = append(where, "customer_id = $"+itoa(len(args)))
	}
	if filters.Status != "" {
		args = append(args, filters.Status == "published")
		where = append(where, "is_published = $"+itoa(len(args)))
	}
	if filters.DateFrom != nil {
		args = append(args, *filters.DateFrom)
		where = append(where, "event_date >= $"+itoa(len(args)))
	}
	if filters.DateTo != nil {
		args = append(args, *filters.DateTo)
		where = append(where, "event_date <= $"+itoa(len(args)))
	}
	if filters.Query != "" {
		args = append(args, "%"+filters.Query+"%")
		idx := itoa(len(args))
		where = append(where, "(title ILIKE $"+idx+" OR search_name ILIKE $"+idx+")")
	}

	limit := filters.Limit
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	offset := filters.Offset
	if offset < 0 {
		offset = 0
	}

	args = append(args, limit)
	limitIdx := itoa(len(args))
	args = append(args, offset)
	offsetIdx := itoa(len(args))

	query := `
		SELECT id, customer_id, slug, title, search_name, event_date, theme_key, is_published, content, created_at, updated_at
		FROM invitations
	`
	if len(where) > 0 {
		query += "WHERE " + strings.Join(where, " AND ") + "\n"
	}
	query += "ORDER BY created_at DESC\n"
	query += "LIMIT $" + limitIdx + " OFFSET $" + offsetIdx

	rows, err := r.DB.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := make([]model.Invitation, 0)
	for rows.Next() {
		var item model.Invitation
		if err := rows.Scan(
			&item.ID,
			&item.CustomerID,
			&item.Slug,
			&item.Title,
			&item.SearchName,
			&item.EventDate,
			&item.ThemeKey,
			&item.IsPublished,
			&item.Content,
			&item.CreatedAt,
			&item.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, item)
	}

	return items, rows.Err()
}

func itoa(value int) string {
	return strconv.Itoa(value)
}
