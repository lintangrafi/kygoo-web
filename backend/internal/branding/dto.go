package branding

import "github.com/google/uuid"

type CreateLogoRequest struct {
	BusinessLine string `json:"business_line" validate:"required,oneof=studio photobooth digital coffee"`
	Section      string `json:"section" validate:"required,oneof=partner client"`
	Name         string `json:"name" validate:"required,min=2,max=255"`
	ImageURL     string `json:"image_url" validate:"required,url"`
	AltText      string `json:"alt_text" validate:"omitempty,max=255"`
	DisplayOrder int    `json:"display_order" validate:"gte=0,lte=9999"`
	IsActive     *bool  `json:"is_active"`
}

type UpdateLogoRequest struct {
	BusinessLine *string `json:"business_line" validate:"omitempty,oneof=studio photobooth digital coffee"`
	Section      *string `json:"section" validate:"omitempty,oneof=partner client"`
	Name         *string `json:"name" validate:"omitempty,min=2,max=255"`
	ImageURL     *string `json:"image_url" validate:"omitempty,url"`
	AltText      *string `json:"alt_text" validate:"omitempty,max=255"`
	DisplayOrder *int    `json:"display_order" validate:"omitempty,gte=0,lte=9999"`
	IsActive     *bool   `json:"is_active"`
}

type LogoResponse struct {
	ID           uuid.UUID `json:"id"`
	BusinessLine string    `json:"business_line"`
	Section      string    `json:"section"`
	Name         string    `json:"name"`
	ImageURL     string    `json:"image_url"`
	AltText      string    `json:"alt_text"`
	DisplayOrder int       `json:"display_order"`
	IsActive     bool      `json:"is_active"`
	CreatedAt    string    `json:"created_at"`
	UpdatedAt    string    `json:"updated_at"`
}