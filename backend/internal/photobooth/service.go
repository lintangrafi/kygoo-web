package photobooth

import (
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/kygoo-web/backend/internal/shared/models"
)

type PackageService interface {
	CreatePackage(req *CreatePackageRequest) (*PackageResponse, error)
	GetPackage(id uuid.UUID) (*PackageResponse, error)
	GetPackages(page, pageSize int) (*PaginatedPackagesResponse, error)
	UpdatePackage(id uuid.UUID, req *UpdatePackageRequest) (*PackageResponse, error)
	DeletePackage(id uuid.UUID) error
}

type EventService interface {
	CreateEvent(req *CreateEventRequest) (*EventResponse, error)
	GetEvent(id uuid.UUID) (*EventResponse, error)
	GetEvents(page, pageSize int, status string) (*PaginatedEventsResponse, error)
	UpdateEvent(id uuid.UUID, req *UpdateEventRequest) (*EventResponse, error)
	DeleteEvent(id uuid.UUID) error
	AddEventImage(eventID uuid.UUID, req *CreateEventImageRequest) (*EventImageResponse, error)
	RemoveEventImage(imageID uuid.UUID) error
}

type packageService struct {
	packageRepo PackageRepository
}

type eventService struct {
	eventRepo      EventRepository
	eventImageRepo EventImageRepository
}

func NewPackageService(packageRepo PackageRepository) PackageService {
	return &packageService{packageRepo}
}

func NewEventService(eventRepo EventRepository, eventImageRepo EventImageRepository) EventService {
	return &eventService{eventRepo, eventImageRepo}
}

// Package Service Implementation

func (s *packageService) CreatePackage(req *CreatePackageRequest) (*PackageResponse, error) {
	if req == nil {
		return nil, errors.New("request cannot be nil")
	}

	if req.Name == "" {
		return nil, errors.New("package name is required")
	}

	if req.Price <= 0 {
		return nil, errors.New("package price must be greater than 0")
	}

	pkg := &models.PhotoboothPackage{
		ID:       uuid.New(),
		Name:     req.Name,
		Price:    req.Price,
		Features: req.Features,
		TosURL:   req.TosURL,
	}

	if err := s.packageRepo.Create(pkg); err != nil {
		return nil, fmt.Errorf("failed to create package: %w", err)
	}

	return toPackageResponse(pkg), nil
}

func (s *packageService) GetPackage(id uuid.UUID) (*PackageResponse, error) {
	pkg, err := s.packageRepo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to get package: %w", err)
	}

	if pkg == nil {
		return nil, errors.New("package not found")
	}

	return toPackageResponse(pkg), nil
}

func (s *packageService) GetPackages(page, pageSize int) (*PaginatedPackagesResponse, error) {
	packages, total, err := s.packageRepo.GetAll(page, pageSize)
	if err != nil {
		return nil, fmt.Errorf("failed to get packages: %w", err)
	}

	resp := &PaginatedPackagesResponse{
		Data:      make([]PackageResponse, len(packages)),
		Total:     total,
		Page:      page,
		PageSize:  pageSize,
		TotalPage: (total + pageSize - 1) / pageSize,
	}

	for i, pkg := range packages {
		resp.Data[i] = *toPackageResponse(&pkg)
	}

	return resp, nil
}

func (s *packageService) UpdatePackage(id uuid.UUID, req *UpdatePackageRequest) (*PackageResponse, error) {
	if req == nil {
		return nil, errors.New("request cannot be nil")
	}

	existing, err := s.packageRepo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to get package: %w", err)
	}

	if existing == nil {
		return nil, errors.New("package not found")
	}

	if req.Name != "" {
		existing.Name = req.Name
	}

	if req.Price > 0 {
		existing.Price = req.Price
	}

	if req.Features != nil {
		existing.Features = req.Features
	}

	if req.TosURL != "" {
		existing.TosURL = req.TosURL
	}

	if err := s.packageRepo.Update(id, existing); err != nil {
		return nil, fmt.Errorf("failed to update package: %w", err)
	}

	return toPackageResponse(existing), nil
}

func (s *packageService) DeletePackage(id uuid.UUID) error {
	existing, err := s.packageRepo.GetByID(id)
	if err != nil {
		return fmt.Errorf("failed to get package: %w", err)
	}

	if existing == nil {
		return errors.New("package not found")
	}

	return s.packageRepo.Delete(id)
}

// Event Service Implementation

func (s *eventService) CreateEvent(req *CreateEventRequest) (*EventResponse, error) {
	if req == nil {
		return nil, errors.New("request cannot be nil")
	}

	if req.EventName == "" {
		return nil, errors.New("event name is required")
	}

	if req.EventType == "" {
		return nil, errors.New("event type is required")
	}

	status := "draft"
	if req.Status != "" && (req.Status == "draft" || req.Status == "published") {
		status = req.Status
	}

	event := &models.PhotoboothEvent{
		ID:               uuid.New(),
		EventName:        req.EventName,
		EventType:        req.EventType,
		EventDate:        req.EventDate,
		Location:         req.Location,
		FeaturedImageURL: req.FeaturedImageURL,
		Status:           status,
	}

	if err := s.eventRepo.Create(event); err != nil {
		return nil, fmt.Errorf("failed to create event: %w", err)
	}

	return toEventResponse(event, []models.PhotoboothEventImage{}), nil
}

func (s *eventService) GetEvent(id uuid.UUID) (*EventResponse, error) {
	event, err := s.eventRepo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to get event: %w", err)
	}

	if event == nil {
		return nil, errors.New("event not found")
	}

	return toEventResponse(event, event.Images), nil
}

func (s *eventService) GetEvents(page, pageSize int, status string) (*PaginatedEventsResponse, error) {
	events, total, err := s.eventRepo.GetAll(page, pageSize, status)
	if err != nil {
		return nil, fmt.Errorf("failed to get events: %w", err)
	}

	resp := &PaginatedEventsResponse{
		Data:      make([]EventResponse, len(events)),
		Total:     total,
		Page:      page,
		PageSize:  pageSize,
		TotalPage: (total + pageSize - 1) / pageSize,
	}

	for i, event := range events {
		resp.Data[i] = *toEventResponse(&event, event.Images)
	}

	return resp, nil
}

func (s *eventService) UpdateEvent(id uuid.UUID, req *UpdateEventRequest) (*EventResponse, error) {
	if req == nil {
		return nil, errors.New("request cannot be nil")
	}

	existing, err := s.eventRepo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to get event: %w", err)
	}

	if existing == nil {
		return nil, errors.New("event not found")
	}

	if req.EventName != "" {
		existing.EventName = req.EventName
	}

	if req.EventType != "" {
		existing.EventType = req.EventType
	}

	if !req.EventDate.IsZero() {
		existing.EventDate = req.EventDate
	}

	if req.Location != "" {
		existing.Location = req.Location
	}

	if req.FeaturedImageURL != "" {
		existing.FeaturedImageURL = req.FeaturedImageURL
	}

	if req.Status != "" && (req.Status == "draft" || req.Status == "published") {
		existing.Status = req.Status
	}

	if err := s.eventRepo.Update(id, existing); err != nil {
		return nil, fmt.Errorf("failed to update event: %w", err)
	}

	return toEventResponse(existing, existing.Images), nil
}

func (s *eventService) DeleteEvent(id uuid.UUID) error {
	existing, err := s.eventRepo.GetByID(id)
	if err != nil {
		return fmt.Errorf("failed to get event: %w", err)
	}

	if existing == nil {
		return errors.New("event not found")
	}

	return s.eventRepo.Delete(id)
}

func (s *eventService) AddEventImage(eventID uuid.UUID, req *CreateEventImageRequest) (*EventImageResponse, error) {
	if req == nil {
		return nil, errors.New("request cannot be nil")
	}

	if req.ImageURL == "" {
		return nil, errors.New("image URL is required")
	}

	// Verify event exists
	event, err := s.eventRepo.GetByID(eventID)
	if err != nil {
		return nil, fmt.Errorf("failed to get event: %w", err)
	}

	if event == nil {
		return nil, errors.New("event not found")
	}

	// Get max display order
	existingImages, err := s.eventImageRepo.GetByEventID(eventID)
	if err != nil {
		return nil, fmt.Errorf("failed to get existing images: %w", err)
	}

	maxOrder := 0
	for _, img := range existingImages {
		if img.DisplayOrder > maxOrder {
			maxOrder = img.DisplayOrder
		}
	}

	image := &models.PhotoboothEventImage{
		ID:           uuid.New(),
		EventID:      eventID,
		ImageURL:     req.ImageURL,
		Caption:      req.Caption,
		DisplayOrder: maxOrder + 1,
	}

	if err := s.eventImageRepo.Create(image); err != nil {
		return nil, fmt.Errorf("failed to create event image: %w", err)
	}

	return toEventImageResponse(image), nil
}

func (s *eventService) RemoveEventImage(imageID uuid.UUID) error {
	existing, err := s.eventImageRepo.GetByID(imageID)
	if err != nil {
		return fmt.Errorf("failed to get image: %w", err)
	}

	if existing == nil {
		return errors.New("image not found")
	}

	return s.eventImageRepo.Delete(imageID)
}
