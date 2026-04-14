package branding

import (
	"github.com/base-go/backend/internal/shared/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository interface {
	Create(logo *models.BusinessLineLogo) error
	GetByID(id uuid.UUID) (*models.BusinessLineLogo, error)
	GetByBusinessLine(line string, includeInactive bool) ([]models.BusinessLineLogo, error)
	GetAll(includeInactive bool) ([]models.BusinessLineLogo, error)
	Update(logo *models.BusinessLineLogo) error
	Delete(id uuid.UUID) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(logo *models.BusinessLineLogo) error {
	return r.db.Create(logo).Error
}

func (r *repository) GetByID(id uuid.UUID) (*models.BusinessLineLogo, error) {
	var logo models.BusinessLineLogo
	if err := r.db.Where("deleted_at IS NULL").First(&logo, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &logo, nil
}

func (r *repository) GetByBusinessLine(line string, includeInactive bool) ([]models.BusinessLineLogo, error) {
	var logos []models.BusinessLineLogo
	query := r.db.Where("deleted_at IS NULL")
	if line != "" {
		query = query.Where("business_line = ?", line)
	}
	if !includeInactive {
		query = query.Where("is_active = ?", true)
	}
	if err := query.Order("business_line ASC").Order("section ASC").Order("display_order ASC").Order("created_at ASC").Find(&logos).Error; err != nil {
		return nil, err
	}
	return logos, nil
}

func (r *repository) GetAll(includeInactive bool) ([]models.BusinessLineLogo, error) {
	return r.GetByBusinessLine("", includeInactive)
}

func (r *repository) Update(logo *models.BusinessLineLogo) error {
	return r.db.Save(logo).Error
}

func (r *repository) Delete(id uuid.UUID) error {
	return r.db.Model(&models.BusinessLineLogo{}).
		Where("id = ?", id).
		Where("deleted_at IS NULL").
		Update("deleted_at", gorm.Expr("NOW()")).Error
}