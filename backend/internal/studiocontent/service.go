package studiocontent

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/kygoo-web/backend/internal/shared/models"
)

type ThemeService interface {
	CreateTheme(req *CreateThemeRequest) (*ThemeResponse, error)
	GetThemeByID(id uuid.UUID) (*ThemeResponse, error)
	GetAllThemes(page, pageSize int) (*PaginatedThemesResponse, error)
	UpdateTheme(id uuid.UUID, req *UpdateThemeRequest) (*ThemeResponse, error)
	DeleteTheme(id uuid.UUID) error
	RestoreTheme(id uuid.UUID) error
}

type TemplateService interface {
	CreateTemplate(req *CreateTemplateRequest) (*TemplateResponse, error)
	GetTemplateByID(id uuid.UUID) (*TemplateResponse, error)
	GetTemplatesByThemeID(themeID uuid.UUID) ([]TemplateResponse, error)
	UpdateTemplate(id uuid.UUID, req *UpdateTemplateRequest) (*TemplateResponse, error)
	DeleteTemplate(id uuid.UUID) error
	RestoreTemplate(id uuid.UUID) error
}

type themeService struct {
	themeRepo ThemeRepository
}

type templateService struct {
	templateRepo TemplateRepository
	themeRepo    ThemeRepository
}

func NewThemeService(themeRepo ThemeRepository) ThemeService {
	return &themeService{themeRepo}
}

func NewTemplateService(templateRepo TemplateRepository, themeRepo ThemeRepository) TemplateService {
	return &templateService{templateRepo, themeRepo}
}

// Theme Service Implementation

func (s *themeService) CreateTheme(req *CreateThemeRequest) (*ThemeResponse, error) {
	theme := &models.StudioTheme{
		Name:               req.Name,
		Description:        req.Description,
		BackgroundImageURL: req.BackgroundImageURL,
		DisplayOrder:       req.DisplayOrder,
	}

	if err := s.themeRepo.Create(theme); err != nil {
		return nil, fmt.Errorf("failed to create theme: %w", err)
	}

	return MapThemeToResponse(theme), nil
}

func (s *themeService) GetThemeByID(id uuid.UUID) (*ThemeResponse, error) {
	theme, err := s.themeRepo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to get theme: %w", err)
	}
	if theme == nil {
		return nil, fmt.Errorf("theme not found")
	}
	return MapThemeToResponse(theme), nil
}

func (s *themeService) GetAllThemes(page, pageSize int) (*PaginatedThemesResponse, error) {
	themes, total, err := s.themeRepo.GetAll(page, pageSize)
	if err != nil {
		return nil, fmt.Errorf("failed to get themes: %w", err)
	}

	if pageSize < 1 {
		pageSize = 10
	}
	if page < 1 {
		page = 1
	}

	responses := make([]ThemeResponse, len(themes))
	for i, theme := range themes {
		responses[i] = *MapThemeToResponse(&theme)
	}

	totalPages := (total + pageSize - 1) / pageSize

	return &PaginatedThemesResponse{
		Items:      responses,
		Total:      total,
		Page:       page,
		PageSize:   pageSize,
		TotalPages: totalPages,
	}, nil
}

func (s *themeService) UpdateTheme(id uuid.UUID, req *UpdateThemeRequest) (*ThemeResponse, error) {
	theme, err := s.themeRepo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to get theme: %w", err)
	}
	if theme == nil {
		return nil, fmt.Errorf("theme not found")
	}

	if req.Name != "" {
		theme.Name = req.Name
	}
	if req.Description != "" {
		theme.Description = req.Description
	}
	if req.BackgroundImageURL != "" {
		theme.BackgroundImageURL = req.BackgroundImageURL
	}
	theme.DisplayOrder = req.DisplayOrder

	if err := s.themeRepo.Update(id, theme); err != nil {
		return nil, fmt.Errorf("failed to update theme: %w", err)
	}

	// Fetch updated theme
	updatedTheme, _ := s.themeRepo.GetByID(id)
	return MapThemeToResponse(updatedTheme), nil
}

func (s *themeService) DeleteTheme(id uuid.UUID) error {
	theme, err := s.themeRepo.GetByID(id)
	if err != nil {
		return fmt.Errorf("failed to get theme: %w", err)
	}
	if theme == nil {
		return fmt.Errorf("theme not found")
	}

	if err := s.themeRepo.Delete(id); err != nil {
		return fmt.Errorf("failed to delete theme: %w", err)
	}
	return nil
}

func (s *themeService) RestoreTheme(id uuid.UUID) error {
	if err := s.themeRepo.Restore(id); err != nil {
		return fmt.Errorf("failed to restore theme: %w", err)
	}
	return nil
}

// Template Service Implementation

func (s *templateService) CreateTemplate(req *CreateTemplateRequest) (*TemplateResponse, error) {
	// Verify theme exists
	theme, err := s.themeRepo.GetByID(req.ThemeID)
	if err != nil {
		return nil, fmt.Errorf("failed to verify theme: %w", err)
	}
	if theme == nil {
		return nil, fmt.Errorf("theme not found")
	}

	template := &models.StudioTemplate{
		ThemeID:          req.ThemeID,
		Name:             req.Name,
		TemplateImageURL: req.TemplateImageURL,
		ResultImageURL:   req.ResultImageURL,
		Description:      req.Description,
		DisplayOrder:     req.DisplayOrder,
	}

	if err := s.templateRepo.Create(template); err != nil {
		return nil, fmt.Errorf("failed to create template: %w", err)
	}

	return MapTemplateToResponse(template), nil
}

func (s *templateService) GetTemplateByID(id uuid.UUID) (*TemplateResponse, error) {
	template, err := s.templateRepo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to get template: %w", err)
	}
	if template == nil {
		return nil, fmt.Errorf("template not found")
	}
	return MapTemplateToResponse(template), nil
}

func (s *templateService) GetTemplatesByThemeID(themeID uuid.UUID) ([]TemplateResponse, error) {
	templates, err := s.templateRepo.GetByThemeID(themeID)
	if err != nil {
		return nil, fmt.Errorf("failed to get templates: %w", err)
	}

	responses := make([]TemplateResponse, len(templates))
	for i, t := range templates {
		responses[i] = *MapTemplateToResponse(&t)
	}
	return responses, nil
}

func (s *templateService) UpdateTemplate(id uuid.UUID, req *UpdateTemplateRequest) (*TemplateResponse, error) {
	template, err := s.templateRepo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to get template: %w", err)
	}
	if template == nil {
		return nil, fmt.Errorf("template not found")
	}

	if req.Name != "" {
		template.Name = req.Name
	}
	if req.TemplateImageURL != "" {
		template.TemplateImageURL = req.TemplateImageURL
	}
	if req.ResultImageURL != "" {
		template.ResultImageURL = req.ResultImageURL
	}
	if req.Description != "" {
		template.Description = req.Description
	}
	template.DisplayOrder = req.DisplayOrder

	if err := s.templateRepo.Update(id, template); err != nil {
		return nil, fmt.Errorf("failed to update template: %w", err)
	}

	updatedTemplate, _ := s.templateRepo.GetByID(id)
	return MapTemplateToResponse(updatedTemplate), nil
}

func (s *templateService) DeleteTemplate(id uuid.UUID) error {
	template, err := s.templateRepo.GetByID(id)
	if err != nil {
		return fmt.Errorf("failed to get template: %w", err)
	}
	if template == nil {
		return fmt.Errorf("template not found")
	}

	if err := s.templateRepo.Delete(id); err != nil {
		return fmt.Errorf("failed to delete template: %w", err)
	}
	return nil
}

func (s *templateService) RestoreTemplate(id uuid.UUID) error {
	if err := s.templateRepo.Restore(id); err != nil {
		return fmt.Errorf("failed to restore template: %w", err)
	}
	return nil
}
