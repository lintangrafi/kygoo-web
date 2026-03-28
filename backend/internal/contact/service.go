package contact

import (
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/kygoo-web/backend/internal/shared/models"
)

type InquiryService interface {
	CreateInquiry(req *CreateInquiryRequest) (*InquiryResponse, error)
	GetInquiry(id uuid.UUID) (*InquiryResponse, error)
	GetInquiries(page, pageSize int, status string) (*PaginatedInquiriesResponse, error)
	UpdateInquiry(id uuid.UUID, req *UpdateInquiryRequest) (*InquiryResponse, error)
	DeleteInquiry(id uuid.UUID) error
}

type LandingService interface {
	GetCoffeeLanding() (*LandingResponse, error)
	UpdateCoffeeLanding(req *UpdateLandingRequest) (*LandingResponse, error)
	GetDigitalLanding() (*LandingResponse, error)
	UpdateDigitalLanding(req *UpdateLandingRequest) (*LandingResponse, error)
}

type inquiryService struct {
	inquiryRepo InquiryRepository
}

type landingService struct {
	landingRepo LandingRepository
}

func NewInquiryService(inquiryRepo InquiryRepository) InquiryService {
	return &inquiryService{inquiryRepo}
}

func NewLandingService(landingRepo LandingRepository) LandingService {
	return &landingService{landingRepo}
}

// Inquiry Service Implementation

func (s *inquiryService) CreateInquiry(req *CreateInquiryRequest) (*InquiryResponse, error) {
	if req == nil {
		return nil, errors.New("request cannot be nil")
	}

	if req.Name == "" {
		return nil, errors.New("name is required")
	}

	if req.Email == "" {
		return nil, errors.New("email is required")
	}

	if req.Message == "" {
		return nil, errors.New("message is required")
	}

	inquiry := &models.ContactInquiry{
		ID:           uuid.New(),
		Name:         req.Name,
		Email:        req.Email,
		Phone:        req.Phone,
		BusinessLine: req.BusinessLine,
		Message:      req.Message,
		Status:       "new",
	}

	if err := s.inquiryRepo.Create(inquiry); err != nil {
		return nil, fmt.Errorf("failed to create inquiry: %w", err)
	}

	return toInquiryResponse(inquiry), nil
}

func (s *inquiryService) GetInquiry(id uuid.UUID) (*InquiryResponse, error) {
	inquiry, err := s.inquiryRepo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to get inquiry: %w", err)
	}

	if inquiry == nil {
		return nil, errors.New("inquiry not found")
	}

	return toInquiryResponse(inquiry), nil
}

func (s *inquiryService) GetInquiries(page, pageSize int, status string) (*PaginatedInquiriesResponse, error) {
	inquiries, total, err := s.inquiryRepo.GetAll(page, pageSize, status)
	if err != nil {
		return nil, fmt.Errorf("failed to get inquiries: %w", err)
	}

	resp := &PaginatedInquiriesResponse{
		Data:      make([]InquiryResponse, len(inquiries)),
		Total:     total,
		Page:      page,
		PageSize:  pageSize,
		TotalPage: (total + pageSize - 1) / pageSize,
	}

	for i, inquiry := range inquiries {
		resp.Data[i] = *toInquiryResponse(&inquiry)
	}

	return resp, nil
}

func (s *inquiryService) UpdateInquiry(id uuid.UUID, req *UpdateInquiryRequest) (*InquiryResponse, error) {
	if req == nil {
		return nil, errors.New("request cannot be nil")
	}

	existing, err := s.inquiryRepo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to get inquiry: %w", err)
	}

	if existing == nil {
		return nil, errors.New("inquiry not found")
	}

	if req.Status != "" && (req.Status == "new" || req.Status == "replied" || req.Status == "resolved") {
		existing.Status = req.Status
	}

	if err := s.inquiryRepo.Update(id, existing); err != nil {
		return nil, fmt.Errorf("failed to update inquiry: %w", err)
	}

	return toInquiryResponse(existing), nil
}

func (s *inquiryService) DeleteInquiry(id uuid.UUID) error {
	existing, err := s.inquiryRepo.GetByID(id)
	if err != nil {
		return fmt.Errorf("failed to get inquiry: %w", err)
	}

	if existing == nil {
		return errors.New("inquiry not found")
	}

	return s.inquiryRepo.Delete(id)
}

// Landing Service Implementation

func (s *landingService) GetCoffeeLanding() (*LandingResponse, error) {
	landing, err := s.landingRepo.GetOrCreateCoffee()
	if err != nil {
		return nil, fmt.Errorf("failed to get coffee landing: %w", err)
	}

	return toLandingResponse(landing.ID, landing.Title, landing.Subtitle, landing.Description, landing.CTAText, landing.Status), nil
}

func (s *landingService) UpdateCoffeeLanding(req *UpdateLandingRequest) (*LandingResponse, error) {
	if req == nil {
		return nil, errors.New("request cannot be nil")
	}

	existing, err := s.landingRepo.GetOrCreateCoffee()
	if err != nil {
		return nil, fmt.Errorf("failed to get coffee landing: %w", err)
	}

	if req.Title != "" {
		existing.Title = req.Title
	}

	if req.Subtitle != "" {
		existing.Subtitle = req.Subtitle
	}

	if req.Description != "" {
		existing.Description = req.Description
	}

	if req.CTAText != "" {
		existing.CTAText = req.CTAText
	}

	if req.Status != "" && (req.Status == "draft" || req.Status == "published") {
		existing.Status = req.Status
	}

	if err := s.landingRepo.UpdateCoffee(existing); err != nil {
		return nil, fmt.Errorf("failed to update coffee landing: %w", err)
	}

	return toLandingResponse(existing.ID, existing.Title, existing.Subtitle, existing.Description, existing.CTAText, existing.Status), nil
}

func (s *landingService) GetDigitalLanding() (*LandingResponse, error) {
	landing, err := s.landingRepo.GetOrCreateDigital()
	if err != nil {
		return nil, fmt.Errorf("failed to get digital landing: %w", err)
	}

	return toLandingResponse(landing.ID, landing.Title, landing.Subtitle, landing.Description, landing.CTAText, landing.Status), nil
}

func (s *landingService) UpdateDigitalLanding(req *UpdateLandingRequest) (*LandingResponse, error) {
	if req == nil {
		return nil, errors.New("request cannot be nil")
	}

	existing, err := s.landingRepo.GetOrCreateDigital()
	if err != nil {
		return nil, fmt.Errorf("failed to get digital landing: %w", err)
	}

	if req.Title != "" {
		existing.Title = req.Title
	}

	if req.Subtitle != "" {
		existing.Subtitle = req.Subtitle
	}

	if req.Description != "" {
		existing.Description = req.Description
	}

	if req.CTAText != "" {
		existing.CTAText = req.CTAText
	}

	if req.Status != "" && (req.Status == "draft" || req.Status == "published") {
		existing.Status = req.Status
	}

	if err := s.landingRepo.UpdateDigital(existing); err != nil {
		return nil, fmt.Errorf("failed to update digital landing: %w", err)
	}

	return toLandingResponse(existing.ID, existing.Title, existing.Subtitle, existing.Description, existing.CTAText, existing.Status), nil
}
