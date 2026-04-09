package businessproject

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/base-go/backend/internal/shared/models"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Repository interface {
	Create(project *models.BusinessProject, changedBy string) error
	GetByID(id uuid.UUID) (*models.BusinessProject, error)
	GetByBusinessLine(line string, includeInactive bool) ([]models.BusinessProject, error)
	GetAll(includeInactive bool) ([]models.BusinessProject, error)
	Update(project *models.BusinessProject, changedBy string, beforeState *models.BusinessProject) error
	Delete(project *models.BusinessProject, changedBy string) error
	GetAuditLogs(projectID *uuid.UUID, limit int) ([]models.BusinessProjectAuditLog, error)
	CreateGalleryItems(items []models.BusinessProjectMedia) error
	DeleteGalleryItem(projectID uuid.UUID, mediaID uuid.UUID) error
	UpdateGalleryItemSort(projectID uuid.UUID, mediaID uuid.UUID, sortOrder int) error
	SetGalleryCover(projectID uuid.UUID, mediaID uuid.UUID) error
	SetFirstGalleryItemAsCover(projectID uuid.UUID) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func toJSON(v interface{}) datatypes.JSON {
	if v == nil {
		return datatypes.JSON([]byte("null"))
	}
	b, err := json.Marshal(v)
	if err != nil {
		return datatypes.JSON([]byte("null"))
	}
	return datatypes.JSON(b)
}

func (r *repository) createAuditLog(tx *gorm.DB, projectID uuid.UUID, action string, changedBy string, before interface{}, after interface{}) error {
	log := &models.BusinessProjectAuditLog{
		ProjectID:  projectID,
		Action:     action,
		BeforeData: toJSON(before),
		AfterData:  toJSON(after),
		ChangedBy:  changedBy,
		ChangedAt:  time.Now(),
	}
	return tx.Create(log).Error
}

func (r *repository) Create(project *models.BusinessProject, changedBy string) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(project).Error; err != nil {
			return err
		}
		return r.createAuditLog(tx, project.ID, "create", changedBy, nil, project)
	})
}

func (r *repository) GetByID(id uuid.UUID) (*models.BusinessProject, error) {
	var project models.BusinessProject
	if err := r.db.Where("deleted_at IS NULL").
		Preload("Gallery", func(db *gorm.DB) *gorm.DB {
			return db.Where("deleted_at IS NULL").Order("is_cover DESC").Order("sort_order ASC").Order("created_at ASC")
		}).
		First(&project, "id = ?", id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &project, nil
}

func (r *repository) GetByBusinessLine(line string, includeInactive bool) ([]models.BusinessProject, error) {
	var projects []models.BusinessProject
	query := r.db.Where("business_line = ?", line).Where("deleted_at IS NULL")
	if !includeInactive {
		query = query.Where("is_active = ?", true)
	}
	if err := query.
		Preload("Gallery", func(db *gorm.DB) *gorm.DB {
			return db.Where("deleted_at IS NULL").Order("is_cover DESC").Order("sort_order ASC").Order("created_at ASC")
		}).
		Order("sort_order ASC").Order("created_at DESC").Find(&projects).Error; err != nil {
		return nil, err
	}
	return projects, nil
}

func (r *repository) GetAll(includeInactive bool) ([]models.BusinessProject, error) {
	var projects []models.BusinessProject
	query := r.db.Where("deleted_at IS NULL")
	if !includeInactive {
		query = query.Where("is_active = ?", true)
	}
	if err := query.
		Preload("Gallery", func(db *gorm.DB) *gorm.DB {
			return db.Where("deleted_at IS NULL").Order("is_cover DESC").Order("sort_order ASC").Order("created_at ASC")
		}).
		Order("business_line ASC").Order("sort_order ASC").Order("created_at DESC").Find(&projects).Error; err != nil {
		return nil, err
	}
	return projects, nil
}

func (r *repository) Update(project *models.BusinessProject, changedBy string, beforeState *models.BusinessProject) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&models.BusinessProject{}).Where("id = ?", project.ID).Updates(project).Error; err != nil {
			return err
		}
		return r.createAuditLog(tx, project.ID, "update", changedBy, beforeState, project)
	})
}

func (r *repository) Delete(project *models.BusinessProject, changedBy string) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&models.BusinessProject{}).
			Where("id = ?", project.ID).
			Update("deleted_at", gorm.Expr("NOW()")).Error; err != nil {
			return err
		}
		if err := tx.Model(&models.BusinessProjectMedia{}).
			Where("project_id = ?", project.ID).
			Where("deleted_at IS NULL").
			Update("deleted_at", gorm.Expr("NOW()")).Error; err != nil {
			return err
		}
		return r.createAuditLog(tx, project.ID, "delete", changedBy, project, nil)
	})
}

func (r *repository) CreateGalleryItems(items []models.BusinessProjectMedia) error {
	if len(items) == 0 {
		return nil
	}
	return r.db.Create(&items).Error
}

func (r *repository) DeleteGalleryItem(projectID uuid.UUID, mediaID uuid.UUID) error {
	return r.db.Model(&models.BusinessProjectMedia{}).
		Where("project_id = ?", projectID).
		Where("id = ?", mediaID).
		Where("deleted_at IS NULL").
		Update("deleted_at", gorm.Expr("NOW()")).Error
}

func (r *repository) UpdateGalleryItemSort(projectID uuid.UUID, mediaID uuid.UUID, sortOrder int) error {
	return r.db.Model(&models.BusinessProjectMedia{}).
		Where("project_id = ?", projectID).
		Where("id = ?", mediaID).
		Where("deleted_at IS NULL").
		Update("sort_order", sortOrder).Error
}

func (r *repository) SetGalleryCover(projectID uuid.UUID, mediaID uuid.UUID) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&models.BusinessProjectMedia{}).
			Where("project_id = ?", projectID).
			Where("deleted_at IS NULL").
			Update("is_cover", false).Error; err != nil {
			return err
		}

		if err := tx.Model(&models.BusinessProjectMedia{}).
			Where("project_id = ?", projectID).
			Where("id = ?", mediaID).
			Where("deleted_at IS NULL").
			Update("is_cover", true).Error; err != nil {
			return err
		}

		return nil
	})
}

func (r *repository) SetFirstGalleryItemAsCover(projectID uuid.UUID) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&models.BusinessProjectMedia{}).
			Where("project_id = ?", projectID).
			Where("deleted_at IS NULL").
			Update("is_cover", false).Error; err != nil {
			return err
		}

		var first models.BusinessProjectMedia
		if err := tx.Where("project_id = ?", projectID).
			Where("deleted_at IS NULL").
			Order("sort_order ASC").
			Order("created_at ASC").
			First(&first).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return nil
			}
			return err
		}

		return tx.Model(&models.BusinessProjectMedia{}).
			Where("id = ?", first.ID).
			Update("is_cover", true).Error
	})
}

func (r *repository) GetAuditLogs(projectID *uuid.UUID, limit int) ([]models.BusinessProjectAuditLog, error) {
	if limit <= 0 || limit > 200 {
		limit = 50
	}
	var logs []models.BusinessProjectAuditLog
	query := r.db.Model(&models.BusinessProjectAuditLog{}).Order("changed_at DESC").Limit(limit)
	if projectID != nil {
		query = query.Where("project_id = ?", *projectID)
	}
	if err := query.Find(&logs).Error; err != nil {
		return nil, err
	}
	return logs, nil
}
