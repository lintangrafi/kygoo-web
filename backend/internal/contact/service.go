package contact

import (
	"fmt"
	"time"

	"github.com/base-go/backend/internal/shared/models"
	"github.com/google/uuid"
)

type Service interface {
	Create(req *CreateInquiryRequest) (*InquiryResponse, error)
	GetRecent(limit int) ([]InquiryResponse, error)
	UpdateStatus(id uuid.UUID, req *UpdateInquiryStatusRequest) (*InquiryResponse, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func mapInquiryToResponse(inquiry *models.ContactInquiry) *InquiryResponse {
	return &InquiryResponse{
		ID:           inquiry.ID,
		Name:         inquiry.Name,
		Email:        inquiry.Email,
		Phone:        inquiry.Phone,
		BusinessLine: inquiry.BusinessLine,
		PackageID:    inquiry.PackageID,
		PackageName:  inquiry.PackageName,
		PackagePriceLabel: inquiry.PackagePriceLabel,
		EventType:    inquiry.EventType,
		EventDate:    inquiry.EventDate,
		Location:     inquiry.Location,
		GuestCount:   inquiry.GuestCount,
		BudgetRange:  inquiry.BudgetRange,
		Notes:        inquiry.Notes,
		Message:      inquiry.Message,
		Status:       inquiry.Status,
		Source:       inquiry.Source,
		CreatedAt:    inquiry.CreatedAt.Format(time.RFC3339),
		UpdatedAt:    inquiry.UpdatedAt.Format(time.RFC3339),
	}
}

func (s *service) Create(req *CreateInquiryRequest) (*InquiryResponse, error) {
	packageID, err := uuid.Parse(req.PackageID)
	if err != nil {
		return nil, fmt.Errorf("invalid package ID")
	}

	inquiry := &models.ContactInquiry{
		Name:         req.Name,
		Email:        req.Email,
		Phone:        req.Phone,
		BusinessLine: req.BusinessLine,
		PackageID:    &packageID,
		PackageName:  req.PackageName,
		PackagePriceLabel: req.PackagePriceLabel,
		EventType:    req.EventType,
		EventDate:    req.EventDate,
		Location:     req.Location,
		GuestCount:   req.GuestCount,
		BudgetRange:  req.PackageName,
		Notes:        req.Notes,
		Message:      req.Message,
		Status:       "new",
		Source:       req.Source,
	}
	if inquiry.Source == "" {
		inquiry.Source = "contact_page"
	}

	if err := s.repo.Create(inquiry); err != nil {
		return nil, fmt.Errorf("failed to save inquiry: %w", err)
	}

	return mapInquiryToResponse(inquiry), nil
}

func (s *service) GetRecent(limit int) ([]InquiryResponse, error) {
	inquiries, err := s.repo.GetRecent(limit)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch inquiries: %w", err)
	}

	responses := make([]InquiryResponse, len(inquiries))
	for i := range inquiries {
		responses[i] = *mapInquiryToResponse(&inquiries[i])
	}

	return responses, nil
}

func (s *service) UpdateStatus(id uuid.UUID, req *UpdateInquiryStatusRequest) (*InquiryResponse, error) {
	inquiry, err := s.repo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to get inquiry: %w", err)
	}
	if inquiry == nil {
		return nil, fmt.Errorf("inquiry not found")
	}

	if err := s.repo.UpdateStatus(id, req.Status); err != nil {
		return nil, fmt.Errorf("failed to update inquiry status: %w", err)
	}

	updated, err := s.repo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to reload inquiry: %w", err)
	}
	if updated == nil {
		return nil, fmt.Errorf("inquiry not found after update")
	}

	return mapInquiryToResponse(updated), nil
}
