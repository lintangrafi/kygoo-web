package sitebranding

import (
	"github.com/base-go/backend/internal/shared/models"
	"gorm.io/gorm"
)

type Repository interface {
	GetCurrent() (*models.SiteBranding, error)
	Create(branding *models.SiteBranding) error
	Update(branding *models.SiteBranding) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) GetCurrent() (*models.SiteBranding, error) {
	var branding models.SiteBranding
	if err := r.db.Where("deleted_at IS NULL").Order("created_at DESC").First(&branding).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &branding, nil
}

func (r *repository) Create(branding *models.SiteBranding) error {
	return r.db.Create(branding).Error
}

func (r *repository) Update(branding *models.SiteBranding) error {
	return r.db.Save(branding).Error
}
