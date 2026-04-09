package businessproject

import (
	"fmt"
	"net/url"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/base-go/backend/internal/shared/models"
)

type Service interface {
	Create(req *CreateProjectRequest, changedBy string) (*ProjectResponse, error)
	GetByBusinessLine(line string, includeInactive bool) ([]ProjectResponse, error)
	GetAll(includeInactive bool) ([]ProjectResponse, error)
	GetByID(id uuid.UUID, includeInactive bool) (*ProjectResponse, error)
	Update(id uuid.UUID, req *UpdateProjectRequest, changedBy string) (*ProjectResponse, error)
	Delete(id uuid.UUID, changedBy string) error
	GetAuditLogs(projectID *uuid.UUID, limit int) ([]ProjectAuditLogResponse, error)
	AddGalleryItems(projectID uuid.UUID, files []GalleryUploadItem) ([]ProjectGalleryItem, error)
	DeleteGalleryItem(projectID uuid.UUID, mediaID uuid.UUID) error
	UpdateGalleryItemSort(projectID uuid.UUID, mediaID uuid.UUID, sortOrder int) error
	SetGalleryCover(projectID uuid.UUID, mediaID uuid.UUID) error
}

type GalleryUploadItem struct {
	FileURL   string
	FileName  string
	SortOrder int
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func validateYearRange(year string) error {
	y, err := strconv.Atoi(year)
	if err != nil {
		return fmt.Errorf("year must be numeric")
	}
	if y < 2000 || y > 2100 {
		return fmt.Errorf("year must be between 2000 and 2100")
	}
	return nil
}

func mapProjectToResponse(project *models.BusinessProject) *ProjectResponse {
	gallery := make([]ProjectGalleryItem, len(project.Gallery))
	for i := range project.Gallery {
		gallery[i] = ProjectGalleryItem{
			ID:        project.Gallery[i].ID,
			ProjectID: project.Gallery[i].ProjectID,
			FileURL:   project.Gallery[i].FileURL,
			FileName:  project.Gallery[i].FileName,
			IsCover:   project.Gallery[i].IsCover,
			SortOrder: project.Gallery[i].SortOrder,
			CreatedAt: project.Gallery[i].CreatedAt.Format(time.RFC3339),
		}
	}

	return &ProjectResponse{
		ID:           project.ID,
		BusinessLine: project.BusinessLine,
		Name:         project.Name,
		EventLocation: project.EventLocation,
		Day:          project.Day,
		Month:        project.Month,
		Year:         project.Year,
		Impact:       project.Impact,
		SortOrder:    project.SortOrder,
		IsActive:     project.IsActive,
		Gallery:      gallery,
		CreatedAt:    project.CreatedAt.Format(time.RFC3339),
		UpdatedAt:    project.UpdatedAt.Format(time.RFC3339),
	}
}

func (s *service) Create(req *CreateProjectRequest, changedBy string) (*ProjectResponse, error) {
	if err := validateYearRange(req.Year); err != nil {
		return nil, err
	}

	isActive := true
	if req.IsActive != nil {
		isActive = *req.IsActive
	}

	project := &models.BusinessProject{
		BusinessLine: req.BusinessLine,
		Name:         req.Name,
		EventLocation: req.EventLocation,
		Day:          req.Day,
		Month:        req.Month,
		Year:         req.Year,
		Impact:       req.Impact,
		SortOrder:    req.SortOrder,
		IsActive:     isActive,
	}

	if err := s.repo.Create(project, changedBy); err != nil {
		return nil, fmt.Errorf("failed to create project: %w", err)
	}

	return mapProjectToResponse(project), nil
}

func (s *service) GetByBusinessLine(line string, includeInactive bool) ([]ProjectResponse, error) {
	projects, err := s.repo.GetByBusinessLine(line, includeInactive)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch projects: %w", err)
	}

	res := make([]ProjectResponse, len(projects))
	for i := range projects {
		res[i] = *mapProjectToResponse(&projects[i])
	}

	return res, nil
}

func (s *service) GetAll(includeInactive bool) ([]ProjectResponse, error) {
	projects, err := s.repo.GetAll(includeInactive)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch projects: %w", err)
	}

	res := make([]ProjectResponse, len(projects))
	for i := range projects {
		res[i] = *mapProjectToResponse(&projects[i])
	}

	return res, nil
}

func (s *service) GetByID(id uuid.UUID, includeInactive bool) (*ProjectResponse, error) {
	project, err := s.repo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch project: %w", err)
	}
	if project == nil || (!includeInactive && !project.IsActive) {
		return nil, fmt.Errorf("project not found")
	}

	return mapProjectToResponse(project), nil
}

func (s *service) Update(id uuid.UUID, req *UpdateProjectRequest, changedBy string) (*ProjectResponse, error) {
	project, err := s.repo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to get project: %w", err)
	}
	if project == nil {
		return nil, fmt.Errorf("project not found")
	}

	beforeState := *project

	if req.BusinessLine != nil {
		project.BusinessLine = *req.BusinessLine
	}
	if req.Name != nil {
		project.Name = *req.Name
	}
	if req.EventLocation != nil {
		project.EventLocation = *req.EventLocation
	}
	if req.Day != nil {
		project.Day = *req.Day
	}
	if req.Month != nil {
		project.Month = *req.Month
	}
	if req.Year != nil {
		if err := validateYearRange(*req.Year); err != nil {
			return nil, err
		}
		project.Year = *req.Year
	}
	if req.Impact != nil {
		project.Impact = *req.Impact
	}
	if req.SortOrder != nil {
		project.SortOrder = *req.SortOrder
	}
	if req.IsActive != nil {
		project.IsActive = *req.IsActive
	}

	if err := s.repo.Update(project, changedBy, &beforeState); err != nil {
		return nil, fmt.Errorf("failed to update project: %w", err)
	}

	updated, err := s.repo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to load updated project: %w", err)
	}
	if updated == nil {
		return nil, fmt.Errorf("project not found after update")
	}
	return mapProjectToResponse(updated), nil
}

func (s *service) Delete(id uuid.UUID, changedBy string) error {
	project, err := s.repo.GetByID(id)
	if err != nil {
		return fmt.Errorf("failed to get project: %w", err)
	}
	if project == nil {
		return fmt.Errorf("project not found")
	}

	if err := s.repo.Delete(project, changedBy); err != nil {
		return fmt.Errorf("failed to delete project: %w", err)
	}

	return nil
}

func (s *service) GetAuditLogs(projectID *uuid.UUID, limit int) ([]ProjectAuditLogResponse, error) {
	logs, err := s.repo.GetAuditLogs(projectID, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to get audit logs: %w", err)
	}

	responses := make([]ProjectAuditLogResponse, len(logs))
	for i, log := range logs {
		responses[i] = ProjectAuditLogResponse{
			ID:         log.ID,
			ProjectID:  log.ProjectID,
			Action:     log.Action,
			ChangedBy:  log.ChangedBy,
			ChangedAt:  log.ChangedAt.Format(time.RFC3339),
			BeforeData: string(log.BeforeData),
			AfterData:  string(log.AfterData),
		}
	}

	return responses, nil
}

func (s *service) AddGalleryItems(projectID uuid.UUID, files []GalleryUploadItem) ([]ProjectGalleryItem, error) {
	project, err := s.repo.GetByID(projectID)
	if err != nil {
		return nil, fmt.Errorf("failed to get project: %w", err)
	}
	if project == nil {
		return nil, fmt.Errorf("project not found")
	}

	if len(files) == 0 {
		return []ProjectGalleryItem{}, nil
	}

	startSortOrder := len(project.Gallery)
	setFirstAsCover := len(project.Gallery) == 0 && len(files) > 0
	items := make([]models.BusinessProjectMedia, len(files))
	for i, file := range files {
		items[i] = models.BusinessProjectMedia{
			ProjectID: projectID,
			FileURL:   file.FileURL,
			FileName:  file.FileName,
			IsCover:   setFirstAsCover && i == 0,
			SortOrder: startSortOrder + file.SortOrder,
		}
	}

	if err := s.repo.CreateGalleryItems(items); err != nil {
		return nil, fmt.Errorf("failed to save gallery items: %w", err)
	}

	updatedProject, err := s.repo.GetByID(projectID)
	if err != nil {
		return nil, fmt.Errorf("failed to reload project gallery: %w", err)
	}

	res := mapProjectToResponse(updatedProject)
	return res.Gallery, nil
}

func (s *service) DeleteGalleryItem(projectID uuid.UUID, mediaID uuid.UUID) error {
	project, err := s.repo.GetByID(projectID)
	if err != nil {
		return fmt.Errorf("failed to get project: %w", err)
	}
	if project == nil {
		return fmt.Errorf("project not found")
	}

	var media *models.BusinessProjectMedia
	for i := range project.Gallery {
		if project.Gallery[i].ID == mediaID {
			media = &project.Gallery[i]
			break
		}
	}
	if media == nil {
		return fmt.Errorf("gallery item not found")
	}

	if err := s.repo.DeleteGalleryItem(projectID, mediaID); err != nil {
		return fmt.Errorf("failed to delete gallery item: %w", err)
	}

	if media.IsCover {
		if err := s.repo.SetFirstGalleryItemAsCover(projectID); err != nil {
			return fmt.Errorf("gallery item deleted but failed to promote new cover: %w", err)
		}
	}

	parsedURL, parseErr := url.Parse(media.FileURL)
	if parseErr == nil {
		relativePath := strings.TrimPrefix(parsedURL.Path, "/uploads/")
		if relativePath != parsedURL.Path {
			filePath := filepath.Join("uploads", filepath.FromSlash(relativePath))
			if removeErr := os.Remove(filePath); removeErr != nil && !os.IsNotExist(removeErr) {
				return fmt.Errorf("gallery item deleted from database but failed to remove file: %w", removeErr)
			}
		}
	}

	return nil
}

func (s *service) SetGalleryCover(projectID uuid.UUID, mediaID uuid.UUID) error {
	project, err := s.repo.GetByID(projectID)
	if err != nil {
		return fmt.Errorf("failed to get project: %w", err)
	}
	if project == nil {
		return fmt.Errorf("project not found")
	}

	if err := s.repo.SetGalleryCover(projectID, mediaID); err != nil {
		return fmt.Errorf("failed to set gallery cover: %w", err)
	}

	return nil
}

func (s *service) UpdateGalleryItemSort(projectID uuid.UUID, mediaID uuid.UUID, sortOrder int) error {
	project, err := s.repo.GetByID(projectID)
	if err != nil {
		return fmt.Errorf("failed to get project: %w", err)
	}
	if project == nil {
		return fmt.Errorf("project not found")
	}

	if sortOrder < 0 {
		return fmt.Errorf("sort order must be zero or positive")
	}

	if err := s.repo.UpdateGalleryItemSort(projectID, mediaID, sortOrder); err != nil {
		return fmt.Errorf("failed to update gallery sort order: %w", err)
	}

	return nil
}
