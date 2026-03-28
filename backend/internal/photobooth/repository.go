package photobooth

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/kygoo-web/backend/internal/shared/models"
	"gorm.io/gorm"
)

type PackageRepository interface {
	Create(pkg *models.PhotoboothPackage) error
	GetByID(id uuid.UUID) (*models.PhotoboothPackage, error)
	GetAll(page, pageSize int) ([]models.PhotoboothPackage, int, error)
	Update(id uuid.UUID, pkg *models.PhotoboothPackage) error
	Delete(id uuid.UUID) error
	Restore(id uuid.UUID) error
}

type EventRepository interface {
	Create(event *models.PhotoboothEvent) error
	GetByID(id uuid.UUID) (*models.PhotoboothEvent, error)
	GetAll(page, pageSize int, status string) ([]models.PhotoboothEvent, int, error)
	Update(id uuid.UUID, event *models.PhotoboothEvent) error
	Delete(id uuid.UUID) error
	Restore(id uuid.UUID) error
}

type EventImageRepository interface {
	Create(image *models.PhotoboothEventImage) error
	GetByID(id uuid.UUID) (*models.PhotoboothEventImage, error)
	GetByEventID(eventID uuid.UUID) ([]models.PhotoboothEventImage, error)
	Update(id uuid.UUID, image *models.PhotoboothEventImage) error
	Delete(id uuid.UUID) error
	Restore(id uuid.UUID) error
}

type packageRepository struct {
	db *gorm.DB
}

type eventRepository struct {
	db *gorm.DB
}

type eventImageRepository struct {
	db *gorm.DB
}

func NewPackageRepository(db *gorm.DB) PackageRepository {
	return &packageRepository{db}
}

func NewEventRepository(db *gorm.DB) EventRepository {
	return &eventRepository{db}
}

func NewEventImageRepository(db *gorm.DB) EventImageRepository {
	return &eventImageRepository{db}
}

// Package Repository Implementation

func (r *packageRepository) Create(pkg *models.PhotoboothPackage) error {
	return r.db.Create(pkg).Error
}

func (r *packageRepository) GetByID(id uuid.UUID) (*models.PhotoboothPackage, error) {
	var pkg models.PhotoboothPackage
	if err := r.db.Where("deleted_at IS NULL").First(&pkg, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &pkg, nil
}

func (r *packageRepository) GetAll(page, pageSize int) ([]models.PhotoboothPackage, int, error) {
	var packages []models.PhotoboothPackage
	var total int64

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}

	offset := (page - 1) * pageSize

	if err := r.db.Where("deleted_at IS NULL").
		Model(&models.PhotoboothPackage{}).
		Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := r.db.Where("deleted_at IS NULL").
		Order("created_at DESC").
		Offset(offset).
		Limit(pageSize).
		Find(&packages).Error; err != nil {
		return nil, 0, err
	}

	return packages, int(total), nil
}

func (r *packageRepository) Update(id uuid.UUID, pkg *models.PhotoboothPackage) error {
	return r.db.Model(&models.PhotoboothPackage{}).Where("id = ?", id).Updates(pkg).Error
}

func (r *packageRepository) Delete(id uuid.UUID) error {
	return r.db.Model(&models.PhotoboothPackage{}).Where("id = ?", id).Update("deleted_at", gorm.Expr("NOW()")).Error
}

func (r *packageRepository) Restore(id uuid.UUID) error {
	return r.db.Model(&models.PhotoboothPackage{}).Where("id = ?", id).Update("deleted_at", nil).Error
}

// Event Repository Implementation

func (r *eventRepository) Create(event *models.PhotoboothEvent) error {
	return r.db.Create(event).Error
}

func (r *eventRepository) GetByID(id uuid.UUID) (*models.PhotoboothEvent, error) {
	var event models.PhotoboothEvent
	if err := r.db.Where("deleted_at IS NULL").
		Preload("Images", "deleted_at IS NULL", func(db *gorm.DB) *gorm.DB {
			return db.Order("display_order ASC")
		}).
		First(&event, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &event, nil
}

func (r *eventRepository) GetAll(page, pageSize int, status string) ([]models.PhotoboothEvent, int, error) {
	var events []models.PhotoboothEvent
	var total int64

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}

	offset := (page - 1) * pageSize
	query := r.db.Where("deleted_at IS NULL")

	if status != "" && (status == "draft" || status == "published") {
		query = query.Where("status = ?", status)
	}

	if err := query.Model(&models.PhotoboothEvent{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := query.
		Preload("Images", "deleted_at IS NULL", func(db *gorm.DB) *gorm.DB {
			return db.Order("display_order ASC")
		}).
		Order("created_at DESC").
		Offset(offset).
		Limit(pageSize).
		Find(&events).Error; err != nil {
		return nil, 0, err
	}

	return events, int(total), nil
}

func (r *eventRepository) Update(id uuid.UUID, event *models.PhotoboothEvent) error {
	return r.db.Model(&models.PhotoboothEvent{}).Where("id = ?", id).Updates(event).Error
}

func (r *eventRepository) Delete(id uuid.UUID) error {
	return r.db.Model(&models.PhotoboothEvent{}).Where("id = ?", id).Update("deleted_at", gorm.Expr("NOW()")).Error
}

func (r *eventRepository) Restore(id uuid.UUID) error {
	return r.db.Model(&models.PhotoboothEvent{}).Where("id = ?", id).Update("deleted_at", nil).Error
}

// Event Image Repository Implementation

func (r *eventImageRepository) Create(image *models.PhotoboothEventImage) error {
	return r.db.Create(image).Error
}

func (r *eventImageRepository) GetByID(id uuid.UUID) (*models.PhotoboothEventImage, error) {
	var image models.PhotoboothEventImage
	if err := r.db.Where("deleted_at IS NULL").First(&image, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &image, nil
}

func (r *eventImageRepository) GetByEventID(eventID uuid.UUID) ([]models.PhotoboothEventImage, error) {
	var images []models.PhotoboothEventImage
	if err := r.db.Where("event_id = ? AND deleted_at IS NULL", eventID).
		Order("display_order ASC").
		Find(&images).Error; err != nil {
		return nil, err
	}
	return images, nil
}

func (r *eventImageRepository) Update(id uuid.UUID, image *models.PhotoboothEventImage) error {
	return r.db.Model(&models.PhotoboothEventImage{}).Where("id = ?", id).Updates(image).Error
}

func (r *eventImageRepository) Delete(id uuid.UUID) error {
	return r.db.Model(&models.PhotoboothEventImage{}).Where("id = ?", id).Update("deleted_at", gorm.Expr("NOW()")).Error
}

func (r *eventImageRepository) Restore(id uuid.UUID) error {
	return r.db.Model(&models.PhotoboothEventImage{}).Where("id = ?", id).Update("deleted_at", nil).Error
}
