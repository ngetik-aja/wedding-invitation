package repository

import (
	"context"
	"errors"

	"github.com/proxima-labs/wedding-invitation-back-end/src/model"
	"gorm.io/gorm"
)

type CustomerRepository struct {
	DB *gorm.DB
}

type CustomerCreateInput struct {
	FullName     string
	Email        string
	PasswordHash string
	Domain       string
}

func (r *CustomerRepository) Create(ctx context.Context, input CustomerCreateInput) (string, error) {
	return r.createWithDB(ctx, r.DB, input)
}

func (r *CustomerRepository) CreateTx(ctx context.Context, tx *gorm.DB, input CustomerCreateInput) (string, error) {
	return r.createWithDB(ctx, tx, input)
}

func (r *CustomerRepository) createWithDB(ctx context.Context, db *gorm.DB, input CustomerCreateInput) (string, error) {
	customer := model.Customer{
		FullName:     input.FullName,
		Email:        input.Email,
		PasswordHash: input.PasswordHash,
		Domain:       input.Domain,
	}
	if err := db.WithContext(ctx).Model(&model.Customer{}).Create(&customer).Error; err != nil {
		return "", err
	}
	return customer.ID, nil
}

func (r *CustomerRepository) FindByEmail(ctx context.Context, email string) (model.Customer, bool, error) {
	var customer model.Customer
	err := r.DB.WithContext(ctx).Model(&model.Customer{}).Where("email = ?", email).First(&customer).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return model.Customer{}, false, nil
	}
	if err != nil {
		return model.Customer{}, false, err
	}
	return customer, true, nil
}

func (r *CustomerRepository) FindByDomain(ctx context.Context, domain string) (model.Customer, bool, error) {
	var customer model.Customer
	err := r.DB.WithContext(ctx).Model(&model.Customer{}).Where("domain = ?", domain).First(&customer).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return model.Customer{}, false, nil
	}
	if err != nil {
		return model.Customer{}, false, err
	}
	return customer, true, nil
}

func (r *CustomerRepository) FindByID(ctx context.Context, id string) (model.Customer, bool, error) {
	var customer model.Customer
	err := r.DB.WithContext(ctx).Model(&model.Customer{}).Where("id = ?", id).First(&customer).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return model.Customer{}, false, nil
	}
	if err != nil {
		return model.Customer{}, false, err
	}
	return customer, true, nil
}

func (r *CustomerRepository) UpdateDomainIfEmpty(ctx context.Context, id string, domain string) error {
	return r.DB.WithContext(ctx).
		Model(&model.Customer{}).
		Where("id = ? AND (domain = '' OR domain IS NULL)", id).
		Update("domain", domain).Error
}

func (r *CustomerRepository) UpdateDomain(ctx context.Context, id string, domain string) error {
	return r.DB.WithContext(ctx).
		Model(&model.Customer{}).
		Where("id = ?", id).
		Update("domain", domain).Error
}

func (r *CustomerRepository) ExistsByDomain(ctx context.Context, domain string) (bool, error) {
	var count int64
	err := r.DB.WithContext(ctx).Model(&model.Customer{}).Where("domain = ?", domain).Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *CustomerRepository) List(ctx context.Context, limit int) ([]model.Customer, error) {
	items := make([]model.Customer, 0)
	err := r.DB.WithContext(ctx).
		Model(&model.Customer{}).
		Order("created_at DESC").
		Limit(limit).
		Find(&items).Error
	if err != nil {
		return nil, err
	}

	return items, nil
}
