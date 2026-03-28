package studiocontent

import (
	"time"

	"github.com/google/uuid"
	"github.com/kygoo-web/backend/internal/shared/models"
)

// Theme Request DTOs

type CreateThemeRequest struct {
	Name               string `json:"name" validate:"required,min=1,max=255"`
	Description        string `json:"description"`
	BackgroundImageURL string `json:"background_image_url"`
	DisplayOrder       int    `json:"display_order"`
}

type UpdateThemeRequest struct {
	Name               string `json:"name" validate:"omitempty,min=1,max=255"`
	Description        string `json:"description"`
	BackgroundImageURL string `json:"background_image_url"`
	DisplayOrder       int    `json:"display_order"`
}

// Template Request DTOs

type CreateTemplateRequest struct {
	ThemeID          uuid.UUID `json:"theme_id" validate:"required"`
	Name             string    `json:"name" validate:"required,min=1,max=255"`
	TemplateImageURL string    `json:"template_image_url" validate:"required"`
	ResultImageURL   string    `json:"result_image_url" validate:"required"`
	Description      string    `json:"description"`
	DisplayOrder     int       `json:"display_order"`
}

type UpdateTemplateRequest struct {
	Name             string `json:"name" validate:"omitempty,min=1,max=255"`
	TemplateImageURL string `json:"template_image_url"`
	ResultImageURL   string `json:"result_image_url"`
	Description      string `json:"description"`
	DisplayOrder     int    `json:"display_order"`
}

// Response DTOs

type ThemeResponse struct {
	ID                 uuid.UUID           `json:"id"`
	Name               string              `json:"name"`
	Description        string              `json:"description"`
	BackgroundImageURL string              `json:"background_image_url"`
	DisplayOrder       int                 `json:"display_order"`
	Templates          []TemplateResponse  `json:"templates,omitempty"`
	CreatedAt          time.Time           `json:"created_at"`
	UpdatedAt          time.Time           `json:"updated_at"`
}

type TemplateResponse struct {
	ID               uuid.UUID `json:"id"`
	ThemeID          uuid.UUID `json:"theme_id"`
	Name             string    `json:"name"`
	TemplateImageURL string    `json:"template_image_url"`
	ResultImageURL   string    `json:"result_image_url"`
	Description      string    `json:"description"`
	DisplayOrder     int       `json:"display_order"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type PaginatedThemesResponse struct {
	Items      []ThemeResponse `json:"items"`
	Total      int             `json:"total"`
	Page       int             `json:"page"`
	PageSize   int             `json:"page_size"`
	TotalPages int             `json:"total_pages"`
}

// Mappers
func MapThemeToResponse(theme *models.StudioTheme) *ThemeResponse {
	resp := &ThemeResponse{
		ID:                 theme.ID,
		Name:               theme.Name,
		Description:        theme.Description,
		BackgroundImageURL: theme.BackgroundImageURL,
		DisplayOrder:       theme.DisplayOrder,
		CreatedAt:          theme.CreatedAt,
		UpdatedAt:          theme.UpdatedAt,
	}
	
	if len(theme.Templates) > 0 {
		resp.Templates = make([]TemplateResponse, len(theme.Templates))
		for i, t := range theme.Templates {
			resp.Templates[i] = *MapTemplateToResponse(&t)
		}
	}
	
	return resp
}

func MapTemplateToResponse(template *models.StudioTemplate) *TemplateResponse {
	return &TemplateResponse{
		ID:               template.ID,
		ThemeID:          template.ThemeID,
		Name:             template.Name,
		TemplateImageURL: template.TemplateImageURL,
		ResultImageURL:   template.ResultImageURL,
		Description:      template.Description,
		DisplayOrder:     template.DisplayOrder,
		CreatedAt:        template.CreatedAt,
		UpdatedAt:        template.UpdatedAt,
	}
}
