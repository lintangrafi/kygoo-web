package contact

import (
	"time"

	"github.com/base-go/backend/internal/shared/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository interface {
	Create(inquiry *models.ContactInquiry) error
	GetRecent(limit int) ([]models.ContactInquiry, error)
	GetByID(id uuid.UUID) (*models.ContactInquiry, error)
	UpdateStatus(id uuid.UUID, status string) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(inquiry *models.ContactInquiry) error {
	return r.db.Create(inquiry).Error
}

func (r *repository) GetRecent(limit int) ([]models.ContactInquiry, error) {
	if limit <= 0 || limit > 100 {
		limit = 20
	}

	var inquiries []models.ContactInquiry
	if err := r.db.Order("created_at DESC").Limit(limit).Find(&inquiries).Error; err != nil {
		return nil, err
	}
	return inquiries, nil
}

func (r *repository) GetByID(id uuid.UUID) (*models.ContactInquiry, error) {
	var inquiry models.ContactInquiry
	if err := r.db.First(&inquiry, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &inquiry, nil
}

func (r *repository) UpdateStatus(id uuid.UUID, status string) error {
	return r.db.Model(&models.ContactInquiry{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":     status,
			"updated_at": time.Now(),
		}).Error
}
