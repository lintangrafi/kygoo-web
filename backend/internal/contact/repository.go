package contact

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/kygoo-web/backend/internal/shared/models"
	"gorm.io/gorm"
)

type InquiryRepository interface {
	Create(inquiry *models.ContactInquiry) error
	GetByID(id uuid.UUID) (*models.ContactInquiry, error)
	GetAll(page, pageSize int, status string) ([]models.ContactInquiry, int, error)
	Update(id uuid.UUID, inquiry *models.ContactInquiry) error
	Delete(id uuid.UUID) error
	Restore(id uuid.UUID) error
}

type LandingRepository interface {
	GetOrCreateCoffee() (*models.CoffeeLanding, error)
	GetOrCreateDigital() (*models.DigitalLanding, error)
	UpdateCoffee(landing *models.CoffeeLanding) error
	UpdateDigital(landing *models.DigitalLanding) error
}

type inquiryRepository struct {
	db *gorm.DB
}

type landingRepository struct {
	db *gorm.DB
}

func NewInquiryRepository(db *gorm.DB) InquiryRepository {
	return &inquiryRepository{db}
}

func NewLandingRepository(db *gorm.DB) LandingRepository {
	return &landingRepository{db}
}

// Inquiry Repository Implementation

func (r *inquiryRepository) Create(inquiry *models.ContactInquiry) error {
	return r.db.Create(inquiry).Error
}

func (r *inquiryRepository) GetByID(id uuid.UUID) (*models.ContactInquiry, error) {
	var inquiry models.ContactInquiry
	if err := r.db.Where("deleted_at IS NULL").First(&inquiry, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &inquiry, nil
}

func (r *inquiryRepository) GetAll(page, pageSize int, status string) ([]models.ContactInquiry, int, error) {
	var inquiries []models.ContactInquiry
	var total int64

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}

	offset := (page - 1) * pageSize
	query := r.db.Where("deleted_at IS NULL")

	if status != "" && (status == "new" || status == "replied" || status == "resolved") {
		query = query.Where("status = ?", status)
	}

	if err := query.Model(&models.ContactInquiry{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := query.
		Order("created_at DESC").
		Offset(offset).
		Limit(pageSize).
		Find(&inquiries).Error; err != nil {
		return nil, 0, err
	}

	return inquiries, int(total), nil
}

func (r *inquiryRepository) Update(id uuid.UUID, inquiry *models.ContactInquiry) error {
	return r.db.Model(&models.ContactInquiry{}).Where("id = ?", id).Updates(inquiry).Error
}

func (r *inquiryRepository) Delete(id uuid.UUID) error {
	return r.db.Model(&models.ContactInquiry{}).Where("id = ?", id).Update("deleted_at", gorm.Expr("NOW()")).Error
}

func (r *inquiryRepository) Restore(id uuid.UUID) error {
	return r.db.Model(&models.ContactInquiry{}).Where("id = ?", id).Update("deleted_at", nil).Error
}

// Landing Repository Implementation

func (r *landingRepository) GetOrCreateCoffee() (*models.CoffeeLanding, error) {
	var landing models.CoffeeLanding

	// Try to get existing
	if err := r.db.Where("deleted_at IS NULL").First(&landing).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			// Create default if not exists
			landing = models.CoffeeLanding{
				ID:          uuid.New(),
				Title:       "Kygoo Coffee",
				Subtitle:    "Experience Exceptional Coffee Culture",
				Description: "Discover our premium coffee selection and cozy atmosphere",
				CTAText:     "Learn More",
				Status:      "published",
			}

			if err := r.db.Create(&landing).Error; err != nil {
				return nil, fmt.Errorf("failed to create coffee landing: %w", err)
			}

			return &landing, nil
		}
		return nil, err
	}

	return &landing, nil
}

func (r *landingRepository) GetOrCreateDigital() (*models.DigitalLanding, error) {
	var landing models.DigitalLanding

	// Try to get existing
	if err := r.db.Where("deleted_at IS NULL").First(&landing).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			// Create default if not exists
			landing = models.DigitalLanding{
				ID:          uuid.New(),
				Title:       "Kygoo Digital",
				Subtitle:    "Digital Solutions for Your Business",
				Description: "Transform your business with our innovative digital services",
				CTAText:     "Get Started",
				Status:      "published",
			}

			if err := r.db.Create(&landing).Error; err != nil {
				return nil, fmt.Errorf("failed to create digital landing: %w", err)
			}

			return &landing, nil
		}
		return nil, err
	}

	return &landing, nil
}

func (r *landingRepository) UpdateCoffee(landing *models.CoffeeLanding) error {
	return r.db.Model(&models.CoffeeLanding{}).Where("deleted_at IS NULL").Updates(landing).Error
}

func (r *landingRepository) UpdateDigital(landing *models.DigitalLanding) error {
	return r.db.Model(&models.DigitalLanding{}).Where("deleted_at IS NULL").Updates(landing).Error
}
