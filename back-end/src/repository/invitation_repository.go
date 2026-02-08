package repository

import (
	"context"
	"strconv"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/proxima-labs/wedding-invitation-back-end/src/model"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type InvitationWithCustomer struct {
	Invitation     model.Invitation
	CustomerName   string
	CustomerDomain string
}

type invitationWithCustomerRow struct {
	ID             string     `gorm:"column:id"`
	CustomerID     string     `gorm:"column:customer_id"`
	Slug           string     `gorm:"column:slug"`
	Title          string     `gorm:"column:title"`
	SearchName     string     `gorm:"column:search_name"`
	EventDate      *time.Time `gorm:"column:event_date"`
	ThemeKey       string     `gorm:"column:theme_key"`
	IsPublished    bool       `gorm:"column:is_published"`
	Content        []byte     `gorm:"column:content"`
	CreatedAt      time.Time  `gorm:"column:created_at"`
	UpdatedAt      time.Time  `gorm:"column:updated_at"`
	CustomerName   *string    `gorm:"column:customer_name"`
	CustomerDomain *string    `gorm:"column:customer_domain"`
}

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
	return r.createWithQuerier(ctx, r.DB, input)
}

func (r *InvitationRepository) CreateTx(ctx context.Context, tx pgx.Tx, input InvitationCreateInput) (string, error) {
	return r.createWithQuerier(ctx, tx, input)
}

func (r *InvitationRepository) createWithQuerier(ctx context.Context, querier interface {
	QueryRow(context.Context, string, ...any) pgx.Row
}, input InvitationCreateInput) (string, error) {
	var id string
	err := querier.QueryRow(ctx, `
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

func (r *InvitationRepository) ListWithCustomer(ctx context.Context, filters InvitationListFilters) ([]InvitationWithCustomer, error) {
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
	likeQuery := "%" + filters.Query + "%"

	sqlDB := stdlib.OpenDBFromPool(r.DB)
	db, err := gorm.Open(postgres.New(postgres.Config{Conn: sqlDB}), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	query := db.Table("invitations as i").
		Select("i.id, i.customer_id, i.slug, i.title, i.search_name, i.event_date, i.theme_key, i.is_published, i.content, i.created_at, i.updated_at, c.full_name as customer_name, c.domain as customer_domain").
		Joins("LEFT JOIN customers c ON c.id = i.customer_id")

	if filters.CustomerID != "" {
		query = query.Where("i.customer_id = ?", filters.CustomerID)
	}
	if filters.Status != "" {
		query = query.Where("i.is_published = ?", filters.Status == "published")
	}
	if filters.DateFrom != nil {
		query = query.Where("i.event_date >= ?", *filters.DateFrom)
	}
	if filters.DateTo != nil {
		query = query.Where("i.event_date <= ?", *filters.DateTo)
	}
	if filters.Query != "" {
		query = query.Where("(i.title ILIKE ? OR i.search_name ILIKE ?)", likeQuery, likeQuery)
	}

	var rows []invitationWithCustomerRow
	if err := query.Order("i.created_at DESC").Limit(limit).Offset(offset).Scan(&rows).Error; err != nil {
		return nil, err
	}

	items := make([]InvitationWithCustomer, 0, len(rows))
	for _, row := range rows {
		items = append(items, InvitationWithCustomer{
			Invitation: model.Invitation{
				ID:          row.ID,
				CustomerID:  row.CustomerID,
				Slug:        row.Slug,
				Title:       row.Title,
				SearchName:  row.SearchName,
				EventDate:   row.EventDate,
				ThemeKey:    row.ThemeKey,
				IsPublished: row.IsPublished,
				Content:     row.Content,
				CreatedAt:   row.CreatedAt,
				UpdatedAt:   row.UpdatedAt,
			},
			CustomerName:   derefString(row.CustomerName),
			CustomerDomain: derefString(row.CustomerDomain),
		})
	}

	return items, nil
}

func itoa(value int) string {
	return strconv.Itoa(value)
}

func (r *InvitationRepository) ExistsByCustomerAndSlug(ctx context.Context, customerID, slug string) (bool, error) {
	var exists bool
	row := r.DB.QueryRow(ctx, `
		SELECT EXISTS (
			SELECT 1
			FROM invitations
			WHERE customer_id = $1 AND slug = $2
		)
	`, customerID, slug)
	if err := row.Scan(&exists); err != nil {
		return false, err
	}
	return exists, nil
}

func derefString(value *string) string {
	if value == nil {
		return ""
	}
	return *value
}
