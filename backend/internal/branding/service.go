package branding

import (
	"fmt"
	"time"

	"github.com/base-go/backend/internal/shared/models"
	"github.com/google/uuid"
)

type Service interface {
	Create(req *CreateLogoRequest) (*LogoResponse, error)
	GetByID(id uuid.UUID, includeInactive bool) (*LogoResponse, error)
	GetByBusinessLine(line string, includeInactive bool) ([]LogoResponse, error)
	GetAll(includeInactive bool) ([]LogoResponse, error)
	Update(id uuid.UUID, req *UpdateLogoRequest) (*LogoResponse, error)
	Delete(id uuid.UUID) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func mapLogoToResponse(logo *models.BusinessLineLogo) *LogoResponse {
	return &LogoResponse{
		ID:           logo.ID,
		BusinessLine: logo.BusinessLine,
		Section:      logo.Section,
		Name:         logo.Name,
		ImageURL:     logo.ImageURL,
		AltText:      logo.AltText,
		DisplayOrder: logo.DisplayOrder,
		IsActive:     logo.IsActive,
		CreatedAt:    logo.CreatedAt.Format(time.RFC3339),
		UpdatedAt:    logo.UpdatedAt.Format(time.RFC3339),
	}
}

func (s *service) Create(req *CreateLogoRequest) (*LogoResponse, error) {
	isActive := true
	if req.IsActive != nil {
		isActive = *req.IsActive
	}

	logo := &models.BusinessLineLogo{
		BusinessLine: req.BusinessLine,
		Section:      req.Section,
		Name:         req.Name,
		ImageURL:     req.ImageURL,
		AltText:      req.AltText,
		DisplayOrder: req.DisplayOrder,
		IsActive:     isActive,
	}

	if err := s.repo.Create(logo); err != nil {
		return nil, fmt.Errorf("failed to create logo: %w", err)
	}

	return mapLogoToResponse(logo), nil
}

func (s *service) GetByID(id uuid.UUID, includeInactive bool) (*LogoResponse, error) {
	logo, err := s.repo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch logo: %w", err)
	}
	if logo == nil || (!includeInactive && !logo.IsActive) {
		return nil, fmt.Errorf("logo not found")
	}
	return mapLogoToResponse(logo), nil
}

func (s *service) GetByBusinessLine(line string, includeInactive bool) ([]LogoResponse, error) {
	logos, err := s.repo.GetByBusinessLine(line, includeInactive)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch logos: %w", err)
	}

	responses := make([]LogoResponse, len(logos))
	for i := range logos {
		responses[i] = *mapLogoToResponse(&logos[i])
	}

	return responses, nil
}

func (s *service) GetAll(includeInactive bool) ([]LogoResponse, error) {
	logos, err := s.repo.GetAll(includeInactive)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch logos: %w", err)
	}

	responses := make([]LogoResponse, len(logos))
	for i := range logos {
		responses[i] = *mapLogoToResponse(&logos[i])
	}

	return responses, nil
}

func (s *service) Update(id uuid.UUID, req *UpdateLogoRequest) (*LogoResponse, error) {
	logo, err := s.repo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to get logo: %w", err)
	}
	if logo == nil {
		return nil, fmt.Errorf("logo not found")
	}

	if req.BusinessLine != nil {
		logo.BusinessLine = *req.BusinessLine
	}
	if req.Section != nil {
		logo.Section = *req.Section
	}
	if req.Name != nil {
		logo.Name = *req.Name
	}
	if req.ImageURL != nil {
		logo.ImageURL = *req.ImageURL
	}
	if req.AltText != nil {
		logo.AltText = *req.AltText
	}
	if req.DisplayOrder != nil {
		logo.DisplayOrder = *req.DisplayOrder
	}
	if req.IsActive != nil {
		logo.IsActive = *req.IsActive
	}

	if err := s.repo.Update(logo); err != nil {
		return nil, fmt.Errorf("failed to update logo: %w", err)
	}

	updated, err := s.repo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to reload logo: %w", err)
	}
	if updated == nil {
		return nil, fmt.Errorf("logo not found after update")
	}

	return mapLogoToResponse(updated), nil
}

func (s *service) Delete(id uuid.UUID) error {
	logo, err := s.repo.GetByID(id)
	if err != nil {
		return fmt.Errorf("failed to get logo: %w", err)
	}
	if logo == nil {
		return fmt.Errorf("logo not found")
	}

	if err := s.repo.Delete(id); err != nil {
		return fmt.Errorf("failed to delete logo: %w", err)
	}

	return nil
}