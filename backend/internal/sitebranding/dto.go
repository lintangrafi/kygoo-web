package sitebranding

import "github.com/google/uuid"

type UpdateSiteBrandingRequest struct {
	SiteName          string `json:"site_name" validate:"required,min=2,max=255"`
	SiteDescription   string `json:"site_description" validate:"omitempty,max=2000"`
	MainLogoURL       string `json:"main_logo_url" validate:"required,url"`
	MainLogoAlt       string `json:"main_logo_alt" validate:"omitempty,max=255"`
	MainLogoSize      *int   `json:"main_logo_size" validate:"omitempty,gte=24,lte=160"`
	HeaderLogoRounded *bool  `json:"header_logo_rounded"`
	IsActive          *bool  `json:"is_active"`
}

type SiteBrandingResponse struct {
	ID                uuid.UUID `json:"id"`
	SiteName          string    `json:"site_name"`
	SiteDescription   string    `json:"site_description"`
	MainLogoURL       string    `json:"main_logo_url"`
	MainLogoAlt       string    `json:"main_logo_alt"`
	MainLogoSize      int       `json:"main_logo_size"`
	HeaderLogoRounded bool      `json:"header_logo_rounded"`
	IsActive          bool      `json:"is_active"`
	CreatedAt         string    `json:"created_at"`
	UpdatedAt         string    `json:"updated_at"`
}

type UploadLogoResponse struct {
	URL string `json:"url"`
}