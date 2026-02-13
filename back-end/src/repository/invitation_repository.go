package repository

import (
	"context"
	"errors"
	"time"

	"github.com/proxima-labs/wedding-invitation-back-end/src/model"
	"github.com/proxima-labs/wedding-invitation-back-end/src/query"
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
	DB *gorm.DB
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
	return r.createWithDB(ctx, r.DB, input)
}

func (r *InvitationRepository) CreateTx(ctx context.Context, tx *gorm.DB, input InvitationCreateInput) (string, error) {
	return r.createWithDB(ctx, tx, input)
}

func (r *InvitationRepository) createWithDB(ctx context.Context, db *gorm.DB, input InvitationCreateInput) (string, error) {
	inv := model.Invitation{
		CustomerID:  input.CustomerID,
		Slug:        input.Slug,
		Title:       input.Title,
		SearchName:  input.SearchName,
		EventDate:   input.EventDate,
		ThemeKey:    input.ThemeKey,
		IsPublished: input.IsPublished,
		Content:     input.Content,
	}
	if err := db.WithContext(ctx).Model(&model.Invitation{}).Create(&inv).Error; err != nil {
		return "", err
	}
	return inv.ID, nil
}

func (r *InvitationRepository) GetByID(ctx context.Context, id string) (model.Invitation, bool, error) {
	var inv model.Invitation
	err := r.DB.WithContext(ctx).Model(&model.Invitation{}).Where("id = ?", id).First(&inv).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return model.Invitation{}, false, nil
	}
	if err != nil {
		return model.Invitation{}, false, err
	}
	return inv, true, nil
}

func (r *InvitationRepository) Update(ctx context.Context, id string, input InvitationUpdateInput) error {
	updates := map[string]any{
		"customer_id":  input.CustomerID,
		"slug":         input.Slug,
		"title":        input.Title,
		"search_name":  input.SearchName,
		"event_date":   input.EventDate,
		"theme_key":    input.ThemeKey,
		"is_published": input.IsPublished,
		"content":      input.Content,
	}

	return r.DB.WithContext(ctx).
		Model(&model.Invitation{}).
		Where("id = ?", id).
		Updates(updates).Error
}

func (r *InvitationRepository) Delete(ctx context.Context, id string) error {
	return r.DB.WithContext(ctx).Where("id = ?", id).Delete(&model.Invitation{}).Error
}

func (r *InvitationRepository) FindPublishedByCustomerAndSlug(ctx context.Context, customerID, slug string) (model.Invitation, bool, error) {
	var inv model.Invitation
	err := r.DB.WithContext(ctx).
		Model(&model.Invitation{}).
		Where("customer_id = ? AND slug = ? AND is_published = ?", customerID, slug, true).
		First(&inv).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return model.Invitation{}, false, nil
	}
	if err != nil {
		return model.Invitation{}, false, err
	}
	return inv, true, nil
}

func (r *InvitationRepository) List(ctx context.Context, filters query.InvitationListFilters) ([]model.Invitation, error) {
	query := r.DB.WithContext(ctx).Model(&model.Invitation{})

	if filters.CustomerID != "" {
		query = query.Where("customer_id = ?", filters.CustomerID)
	}
	if filters.Status != "" {
		query = query.Where("is_published = ?", filters.Status == "published")
	}
	if filters.DateFrom != nil {
		query = query.Where("event_date >= ?", *filters.DateFrom)
	}
	if filters.DateTo != nil {
		query = query.Where("event_date <= ?", *filters.DateTo)
	}
	if filters.Query != "" {
		likeQuery := "%" + filters.Query + "%"
		query = query.Where("(title ILIKE ? OR search_name ILIKE ?)", likeQuery, likeQuery)
	}

	items := make([]model.Invitation, 0)
	if err := query.Order("created_at DESC").Limit(filters.Limit).Offset(filters.Offset).Find(&items).Error; err != nil {
		return nil, err
	}

	return items, nil
}

func (r *InvitationRepository) ListWithCustomer(ctx context.Context, filters query.InvitationListFilters) ([]InvitationWithCustomer, error) {
	query := r.DB.WithContext(ctx).
		Model(&model.Invitation{}).
		Select("invitations.id, invitations.customer_id, invitations.slug, invitations.title, invitations.search_name, invitations.event_date, invitations.theme_key, invitations.is_published, invitations.content, invitations.created_at, invitations.updated_at, customers.full_name as customer_name, customers.domain as customer_domain").
		Joins("LEFT JOIN customers ON customers.id = invitations.customer_id")

	if filters.CustomerID != "" {
		query = query.Where("invitations.customer_id = ?", filters.CustomerID)
	}
	if filters.Status != "" {
		query = query.Where("invitations.is_published = ?", filters.Status == "published")
	}
	if filters.DateFrom != nil {
		query = query.Where("invitations.event_date >= ?", *filters.DateFrom)
	}
	if filters.DateTo != nil {
		query = query.Where("invitations.event_date <= ?", *filters.DateTo)
	}
	if filters.Query != "" {
		likeQuery := "%" + filters.Query + "%"
		query = query.Where("(invitations.title ILIKE ? OR invitations.search_name ILIKE ?)", likeQuery, likeQuery)
	}

	rows := make([]invitationWithCustomerRow, 0)
	if err := query.Order("invitations.created_at DESC").Limit(filters.Limit).Offset(filters.Offset).Scan(&rows).Error; err != nil {
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

func (r *InvitationRepository) ExistsByCustomerAndSlug(ctx context.Context, customerID, slug string) (bool, error) {
	var count int64
	err := r.DB.WithContext(ctx).
		Model(&model.Invitation{}).
		Where("customer_id = ? AND slug = ?", customerID, slug).
		Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func derefString(value *string) string {
	if value == nil {
		return ""
	}
	return *value
}
