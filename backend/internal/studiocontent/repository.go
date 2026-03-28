package studiocontent

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/kygoo-web/backend/internal/shared/models"
	"gorm.io/gorm"
)

type ThemeRepository interface {
	Create(theme *models.StudioTheme) error
	GetByID(id uuid.UUID) (*models.StudioTheme, error)
	GetAll(page, pageSize int) ([]models.StudioTheme, int, error)
	Update(id uuid.UUID, theme *models.StudioTheme) error
	Delete(id uuid.UUID) error
	Restore(id uuid.UUID) error
}

type TemplateRepository interface {
	Create(template *models.StudioTemplate) error
	GetByID(id uuid.UUID) (*models.StudioTemplate, error)
	GetByThemeID(themeID uuid.UUID) ([]models.StudioTemplate, error)
	Update(id uuid.UUID, template *models.StudioTemplate) error
	Delete(id uuid.UUID) error
	Restore(id uuid.UUID) error
}

type themeRepository struct {
	db *gorm.DB
}

type templateRepository struct {
	db *gorm.DB
}

func NewThemeRepository(db *gorm.DB) ThemeRepository {
	return &themeRepository{db}
}

func NewTemplateRepository(db *gorm.DB) TemplateRepository {
	return &templateRepository{db}
}

// Theme Repository Implementation

func (r *themeRepository) Create(theme *models.StudioTheme) error {
	return r.db.Create(theme).Error
}

func (r *themeRepository) GetByID(id uuid.UUID) (*models.StudioTheme, error) {
	var theme models.StudioTheme
	if err := r.db.Where("deleted_at IS NULL").Preload("Templates", "deleted_at IS NULL").First(&theme, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &theme, nil
}

func (r *themeRepository) GetAll(page, pageSize int) ([]models.StudioTheme, int, error) {
	var themes []models.StudioTheme
	var total int64

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}

	offset := (page - 1) * pageSize

	if err := r.db.Where("deleted_at IS NULL").
		Model(&models.StudioTheme{}).
		Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := r.db.Where("deleted_at IS NULL").
		Preload("Templates", "deleted_at IS NULL").
		Order("display_order ASC").
		Offset(offset).
		Limit(pageSize).
		Find(&themes).Error; err != nil {
		return nil, 0, err
	}

	return themes, int(total), nil
}

func (r *themeRepository) Update(id uuid.UUID, theme *models.StudioTheme) error {
	return r.db.Model(&models.StudioTheme{}).Where("id = ?", id).Updates(theme).Error
}

func (r *themeRepository) Delete(id uuid.UUID) error {
	return r.db.Model(&models.StudioTheme{}).Where("id = ?", id).Update("deleted_at", gorm.Expr("NOW()")).Error
}

func (r *themeRepository) Restore(id uuid.UUID) error {
	return r.db.Model(&models.StudioTheme{}).Where("id = ?", id).Update("deleted_at", nil).Error
}

// Template Repository Implementation

func (r *templateRepository) Create(template *models.StudioTemplate) error {
	return r.db.Create(template).Error
}

func (r *templateRepository) GetByID(id uuid.UUID) (*models.StudioTemplate, error) {
	var template models.StudioTemplate
	if err := r.db.Where("deleted_at IS NULL").First(&template, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &template, nil
}

func (r *templateRepository) GetByThemeID(themeID uuid.UUID) ([]models.StudioTemplate, error) {
	var templates []models.StudioTemplate
	if err := r.db.Where("theme_id = ? AND deleted_at IS NULL", themeID).
		Order("display_order ASC").
		Find(&templates).Error; err != nil {
		return nil, err
	}
	return templates, nil
}

func (r *templateRepository) Update(id uuid.UUID, template *models.StudioTemplate) error {
	return r.db.Model(&models.StudioTemplate{}).Where("id = ?", id).Updates(template).Error
}

func (r *templateRepository) Delete(id uuid.UUID) error {
	return r.db.Model(&models.StudioTemplate{}).Where("id = ?", id).Update("deleted_at", gorm.Expr("NOW()")).Error
}

func (r *templateRepository) Restore(id uuid.UUID) error {
	return r.db.Model(&models.StudioTemplate{}).Where("id = ?", id).Update("deleted_at", nil).Error
}
