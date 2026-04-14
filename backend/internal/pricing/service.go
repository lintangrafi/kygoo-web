package pricing

import (
	"fmt"
	"time"

	"github.com/base-go/backend/internal/shared/models"
	"github.com/google/uuid"
)

type Service interface {
	Create(req *CreatePackageRequest) (*PackageResponse, error)
	GetByID(id uuid.UUID, includeInactive bool) (*PackageResponse, error)
	GetByBusinessLine(line string, includeInactive bool) ([]PackageResponse, error)
	GetAll(includeInactive bool) ([]PackageResponse, error)
	Update(id uuid.UUID, req *UpdatePackageRequest) (*PackageResponse, error)
	Delete(id uuid.UUID) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func mapPackageToResponse(packageItem *models.BusinessLinePackage) *PackageResponse {
	features := make([]string, len(packageItem.Features))
	copy(features, packageItem.Features)

	return &PackageResponse{
		ID:           packageItem.ID,
		BusinessLine: packageItem.BusinessLine,
		Name:         packageItem.Name,
		Description:  packageItem.Description,
		PriceLabel:   packageItem.PriceLabel,
		Features:     features,
		Highlight:    packageItem.Highlight,
		DisplayOrder: packageItem.DisplayOrder,
		IsActive:     packageItem.IsActive,
		CreatedAt:    packageItem.CreatedAt.Format(time.RFC3339),
		UpdatedAt:    packageItem.UpdatedAt.Format(time.RFC3339),
	}
}

func (s *service) Create(req *CreatePackageRequest) (*PackageResponse, error) {
	isActive := true
	if req.IsActive != nil {
		isActive = *req.IsActive
	}

	packageItem := &models.BusinessLinePackage{
		BusinessLine: req.BusinessLine,
		Name:         req.Name,
		Description:  req.Description,
		PriceLabel:   req.PriceLabel,
		Features:     models.JSONArray(req.Features),
		Highlight:    req.Highlight,
		DisplayOrder: req.DisplayOrder,
		IsActive:     isActive,
	}

	if err := s.repo.Create(packageItem); err != nil {
		return nil, fmt.Errorf("failed to create package: %w", err)
	}

	return mapPackageToResponse(packageItem), nil
}

func (s *service) GetByID(id uuid.UUID, includeInactive bool) (*PackageResponse, error) {
	packageItem, err := s.repo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch package: %w", err)
	}
	if packageItem == nil || (!includeInactive && !packageItem.IsActive) {
		return nil, fmt.Errorf("package not found")
	}
	return mapPackageToResponse(packageItem), nil
}

func (s *service) GetByBusinessLine(line string, includeInactive bool) ([]PackageResponse, error) {
	packages, err := s.repo.GetByBusinessLine(line, includeInactive)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch packages: %w", err)
	}

	responses := make([]PackageResponse, len(packages))
	for i := range packages {
		responses[i] = *mapPackageToResponse(&packages[i])
	}

	return responses, nil
}

func (s *service) GetAll(includeInactive bool) ([]PackageResponse, error) {
	packages, err := s.repo.GetAll(includeInactive)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch packages: %w", err)
	}

	responses := make([]PackageResponse, len(packages))
	for i := range packages {
		responses[i] = *mapPackageToResponse(&packages[i])
	}

	return responses, nil
}

func (s *service) Update(id uuid.UUID, req *UpdatePackageRequest) (*PackageResponse, error) {
	packageItem, err := s.repo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to get package: %w", err)
	}
	if packageItem == nil {
		return nil, fmt.Errorf("package not found")
	}

	if req.BusinessLine != nil {
		packageItem.BusinessLine = *req.BusinessLine
	}
	if req.Name != nil {
		packageItem.Name = *req.Name
	}
	if req.Description != nil {
		packageItem.Description = *req.Description
	}
	if req.PriceLabel != nil {
		packageItem.PriceLabel = *req.PriceLabel
	}
	if req.Features != nil {
		packageItem.Features = models.JSONArray(*req.Features)
	}
	if req.Highlight != nil {
		packageItem.Highlight = *req.Highlight
	}
	if req.DisplayOrder != nil {
		packageItem.DisplayOrder = *req.DisplayOrder
	}
	if req.IsActive != nil {
		packageItem.IsActive = *req.IsActive
	}

	if err := s.repo.Update(packageItem); err != nil {
		return nil, fmt.Errorf("failed to update package: %w", err)
	}

	updated, err := s.repo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to reload package: %w", err)
	}
	if updated == nil {
		return nil, fmt.Errorf("package not found after update")
	}

	return mapPackageToResponse(updated), nil
}

func (s *service) Delete(id uuid.UUID) error {
	packageItem, err := s.repo.GetByID(id)
	if err != nil {
		return fmt.Errorf("failed to get package: %w", err)
	}
	if packageItem == nil {
		return fmt.Errorf("package not found")
	}

	if err := s.repo.Delete(id); err != nil {
		return fmt.Errorf("failed to delete package: %w", err)
	}

	return nil
}