package pricing

import "github.com/google/uuid"

type CreatePackageRequest struct {
	BusinessLine string   `json:"business_line" validate:"required,oneof=studio photobooth digital coffee"`
	Name         string   `json:"name" validate:"required,min=2,max=255"`
	Description  string   `json:"description" validate:"omitempty,max=2000"`
	PriceLabel   string   `json:"price_label" validate:"required,min=1,max=120"`
	Features     []string `json:"features" validate:"omitempty,dive,max=200"`
	Highlight    bool     `json:"highlight"`
	DisplayOrder int      `json:"display_order" validate:"gte=0,lte=9999"`
	IsActive     *bool    `json:"is_active"`
}

type UpdatePackageRequest struct {
	BusinessLine *string   `json:"business_line" validate:"omitempty,oneof=studio photobooth digital coffee"`
	Name         *string   `json:"name" validate:"omitempty,min=2,max=255"`
	Description  *string   `json:"description" validate:"omitempty,max=2000"`
	PriceLabel   *string   `json:"price_label" validate:"omitempty,min=1,max=120"`
	Features     *[]string `json:"features" validate:"omitempty,dive,max=200"`
	Highlight    *bool     `json:"highlight"`
	DisplayOrder *int      `json:"display_order" validate:"omitempty,gte=0,lte=9999"`
	IsActive     *bool     `json:"is_active"`
}

type PackageResponse struct {
	ID           uuid.UUID `json:"id"`
	BusinessLine string    `json:"business_line"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
	PriceLabel   string    `json:"price_label"`
	Features     []string  `json:"features"`
	Highlight    bool      `json:"highlight"`
	DisplayOrder int       `json:"display_order"`
	IsActive     bool      `json:"is_active"`
	CreatedAt    string    `json:"created_at"`
	UpdatedAt    string    `json:"updated_at"`
}