package contact

import (
	"time"

	"github.com/google/uuid"
	"github.com/kygoo-web/backend/internal/shared/models"
)

// Contact Request DTOs
type CreateInquiryRequest struct {
	Name         string `json:"name" validate:"required,min=1,max=255"`
	Email        string `json:"email" validate:"required,email"`
	Phone        string `json:"phone" validate:"omitempty,min=10"`
	BusinessLine string `json:"business_line" validate:"required,oneof=studio photobooth digital coffee"`
	Message      string `json:"message" validate:"required,min=10"`
}

type UpdateInquiryRequest struct {
	Status string `json:"status" validate:"omitempty,oneof=new responded"`
}

// Coffee & Digital Landing DTOs
type UpdateLandingRequest struct {
	Title       string `json:"title" validate:"omitempty,min=1,max=255"`
	Subtitle    string `json:"subtitle"`
	Description string `json:"description"`
	CTAText     string `json:"cta_text"`
	Status      string `json:"status" validate:"omitempty,oneof=draft published"`
}

// Response DTOs
type InquiryResponse struct {
	ID           uuid.UUID `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	Phone        string    `json:"phone"`
	BusinessLine string    `json:"business_line"`
	Message      string    `json:"message"`
	Status       string    `json:"status"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type PaginatedInquiriesResponse struct {
	Items      []InquiryResponse `json:"items"`
	Total      int               `json:"total"`
	Page       int               `json:"page"`
	PageSize   int               `json:"page_size"`
	TotalPages int               `json:"total_pages"`
}

type LandingResponse struct {
	ID          uuid.UUID `json:"id"`
	Title       string    `json:"title"`
	Subtitle    string    `json:"subtitle"`
	Description string    `json:"description"`
	CTAText     string    `json:"cta_text"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Mappers
func MapInquiryToResponse(inquiry *models.ContactInquiry) *InquiryResponse {
	return &InquiryResponse{
		ID:           inquiry.ID,
		Name:         inquiry.Name,
		Email:        inquiry.Email,
		Phone:        inquiry.Phone,
		BusinessLine: inquiry.BusinessLine,
		Message:      inquiry.Message,
		Status:       inquiry.Status,
		CreatedAt:    inquiry.CreatedAt,
		UpdatedAt:    inquiry.UpdatedAt,
	}
}

func MapCoffeeLandingToResponse(landing *models.CoffeeLanding) *LandingResponse {
	return &LandingResponse{
		ID:          landing.ID,
		Title:       landing.Title,
		Subtitle:    landing.Subtitle,
		Description: landing.Description,
		CTAText:     landing.CTAText,
		Status:      landing.Status,
		CreatedAt:   landing.CreatedAt,
		UpdatedAt:   landing.UpdatedAt,
	}
}

func MapDigitalLandingToResponse(landing *models.DigitalLanding) *LandingResponse {
	return &LandingResponse{
		ID:          landing.ID,
		Title:       landing.Title,
		Subtitle:    landing.Subtitle,
		Description: landing.Description,
		CTAText:     landing.CTAText,
		Status:      landing.Status,
		CreatedAt:   landing.CreatedAt,
		UpdatedAt:   landing.UpdatedAt,
	}
}
