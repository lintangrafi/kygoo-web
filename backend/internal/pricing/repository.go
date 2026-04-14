package pricing

import (
	"github.com/base-go/backend/internal/shared/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository interface {
	Create(packageItem *models.BusinessLinePackage) error
	GetByID(id uuid.UUID) (*models.BusinessLinePackage, error)
	GetByBusinessLine(line string, includeInactive bool) ([]models.BusinessLinePackage, error)
	GetAll(includeInactive bool) ([]models.BusinessLinePackage, error)
	Update(packageItem *models.BusinessLinePackage) error
	Delete(id uuid.UUID) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(packageItem *models.BusinessLinePackage) error {
	return r.db.Create(packageItem).Error
}

func (r *repository) GetByID(id uuid.UUID) (*models.BusinessLinePackage, error) {
	var packageItem models.BusinessLinePackage
	if err := r.db.Where("deleted_at IS NULL").First(&packageItem, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &packageItem, nil
}

func (r *repository) GetByBusinessLine(line string, includeInactive bool) ([]models.BusinessLinePackage, error) {
	var packages []models.BusinessLinePackage
	query := r.db.Where("deleted_at IS NULL")
	if line != "" {
		query = query.Where("business_line = ?", line)
	}
	if !includeInactive {
		query = query.Where("is_active = ?", true)
	}
	if err := query.Order("business_line ASC").Order("display_order ASC").Order("created_at DESC").Find(&packages).Error; err != nil {
		return nil, err
	}
	return packages, nil
}

func (r *repository) GetAll(includeInactive bool) ([]models.BusinessLinePackage, error) {
	return r.GetByBusinessLine("", includeInactive)
}

func (r *repository) Update(packageItem *models.BusinessLinePackage) error {
	return r.db.Save(packageItem).Error
}

func (r *repository) Delete(id uuid.UUID) error {
	return r.db.Model(&models.BusinessLinePackage{}).
		Where("id = ?", id).
		Where("deleted_at IS NULL").
		Update("deleted_at", gorm.Expr("NOW()")).Error
}