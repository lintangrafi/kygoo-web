package photobooth

import (
	"time"

	"github.com/google/uuid"
	"github.com/kygoo-web/backend/internal/shared/models"
)

// Package Request DTOs
type CreatePackageRequest struct {
	Name        string   `json:"name" validate:"required,min=1,max=255"`
	Description string   `json:"description"`
	Price       float64  `json:"price" validate:"required,gt=0"`
	Features    []string `json:"features"`
	TosURL      string   `json:"tos_url"`
}

type UpdatePackageRequest struct {
	Name        string   `json:"name" validate:"omitempty,min=1,max=255"`
	Description string   `json:"description"`
	Price       float64  `json:"price" validate:"omitempty,gt=0"`
	Features    []string `json:"features"`
	TosURL      string   `json:"tos_url"`
}

// Event Request DTOs
type CreateEventRequest struct {
	EventName       string    `json:"event_name" validate:"required,min=1,max=255"`
	EventType       string    `json:"event_type" validate:"omitempty,oneof=wedding organizational other"`
	EventDate       *time.Time `json:"event_date"`
	Location        string    `json:"location"`
	Description     string    `json:"description"`
	FeaturedImageURL string   `json:"featured_image_url"`
	Status          string    `json:"status" validate:"omitempty,oneof=draft published"`
}

type UpdateEventRequest struct {
	EventName        string    `json:"event_name" validate:"omitempty,min=1,max=255"`
	EventType        string    `json:"event_type" validate:"omitempty,oneof=wedding organizational other"`
	EventDate        *time.Time `json:"event_date"`
	Location         string    `json:"location"`
	Description      string    `json:"description"`
	FeaturedImageURL string    `json:"featured_image_url"`
	Status           string    `json:"status" validate:"omitempty,oneof=draft published"`
}

type CreateEventImageRequest struct {
	EventID      uuid.UUID `json:"event_id" validate:"required"`
	ImageURL     string    `json:"image_url" validate:"required"`
	Caption      string    `json:"caption"`
	DisplayOrder int       `json:"display_order"`
}

// Response DTOs
type PackageResponse struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Price       float64   `json:"price"`
	Features    []string  `json:"features"`
	TosURL      string    `json:"tos_url"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type EventImageResponse struct {
	ID           uuid.UUID `json:"id"`
	EventID      uuid.UUID `json:"event_id"`
	ImageURL     string    `json:"image_url"`
	Caption      string    `json:"caption"`
	DisplayOrder int       `json:"display_order"`
	CreatedAt    time.Time `json:"created_at"`
}

type EventResponse struct {
	ID               uuid.UUID            `json:"id"`
	EventName        string               `json:"event_name"`
	EventType        string               `json:"event_type"`
	EventDate        *time.Time           `json:"event_date"`
	Location         string               `json:"location"`
	Description      string               `json:"description"`
	FeaturedImageURL string               `json:"featured_image_url"`
	Status           string               `json:"status"`
	Images           []EventImageResponse `json:"images,omitempty"`
	CreatedAt        time.Time            `json:"created_at"`
	UpdatedAt        time.Time            `json:"updated_at"`
}

type PaginatedPackagesResponse struct {
	Items      []PackageResponse `json:"items"`
	Total      int               `json:"total"`
	Page       int               `json:"page"`
	PageSize   int               `json:"page_size"`
	TotalPages int               `json:"total_pages"`
}

type PaginatedEventsResponse struct {
	Items      []EventResponse `json:"items"`
	Total      int             `json:"total"`
	Page       int             `json:"page"`
	PageSize   int             `json:"page_size"`
	TotalPages int             `json:"total_pages"`
}

// Mappers
func MapPackageToResponse(pkg *models.PhotoboothPackage) *PackageResponse {
	features := []string{}
	if len(pkg.Features) > 0 {
		features = pkg.Features
	}
	return &PackageResponse{
		ID:          pkg.ID,
		Name:        pkg.Name,
		Description: pkg.Description,
		Price:       pkg.Price,
		Features:    features,
		TosURL:      pkg.TosURL,
		CreatedAt:   pkg.CreatedAt,
		UpdatedAt:   pkg.UpdatedAt,
	}
}

func MapEventToResponse(event *models.PhotoboothEvent) *EventResponse {
	resp := &EventResponse{
		ID:               event.ID,
		EventName:        event.EventName,
		EventType:        event.EventType,
		EventDate:        event.EventDate,
		Location:         event.Location,
		Description:      event.Description,
		FeaturedImageURL: event.FeaturedImageURL,
		Status:           event.Status,
		CreatedAt:        event.CreatedAt,
		UpdatedAt:        event.UpdatedAt,
	}

	if len(event.Images) > 0 {
		resp.Images = make([]EventImageResponse, len(event.Images))
		for i, img := range event.Images {
			resp.Images[i] = EventImageResponse{
				ID:           img.ID,
				EventID:      img.EventID,
				ImageURL:     img.ImageURL,
				Caption:      img.Caption,
				DisplayOrder: img.DisplayOrder,
				CreatedAt:    img.CreatedAt,
			}
		}
	}

	return resp
}
