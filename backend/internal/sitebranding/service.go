package sitebranding

import (
	"fmt"
	"time"

	"github.com/base-go/backend/internal/shared/models"
	"github.com/google/uuid"
)

type Service interface {
	GetCurrent() (*SiteBrandingResponse, error)
	Update(req *UpdateSiteBrandingRequest) (*SiteBrandingResponse, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func mapSiteBrandingToResponse(branding *models.SiteBranding) *SiteBrandingResponse {
	return &SiteBrandingResponse{
		ID:                branding.ID,
		SiteName:          branding.SiteName,
		SiteDescription:   branding.SiteDescription,
		MainLogoURL:       branding.MainLogoURL,
		MainLogoAlt:       branding.MainLogoAlt,
		MainLogoSize:      branding.MainLogoSize,
		HeaderLogoRounded: branding.HeaderLogoRounded,
		IsActive:          branding.IsActive,
		CreatedAt:         branding.CreatedAt.Format(time.RFC3339),
		UpdatedAt:         branding.UpdatedAt.Format(time.RFC3339),
	}
}

func (s *service) GetCurrent() (*SiteBrandingResponse, error) {
	branding, err := s.repo.GetCurrent()
	if err != nil {
		return nil, fmt.Errorf("failed to fetch site branding: %w", err)
	}
	if branding == nil {
		branding = &models.SiteBranding{
			ID:                uuid.New(),
			SiteName:          "Kygoo Group",
			SiteDescription:   "A production-ready platform for photography, coffee, and digital services.",
			MainLogoURL:       "https://placehold.co/160x160/0f172a/e2e8f0?text=KYGOO",
			MainLogoAlt:       "Kygoo Group",
			MainLogoSize:      40,
			HeaderLogoRounded: true,
			IsActive:          true,
		}
		if err := s.repo.Create(branding); err != nil {
			return nil, fmt.Errorf("failed to create default site branding: %w", err)
		}
	}

	return mapSiteBrandingToResponse(branding), nil
}

func (s *service) Update(req *UpdateSiteBrandingRequest) (*SiteBrandingResponse, error) {
	branding, err := s.repo.GetCurrent()
	if err != nil {
		return nil, fmt.Errorf("failed to fetch site branding: %w", err)
	}
	if branding == nil {
		branding = &models.SiteBranding{ID: uuid.New()}
	}

	branding.SiteName = req.SiteName
	branding.SiteDescription = req.SiteDescription
	branding.MainLogoURL = req.MainLogoURL
	branding.MainLogoAlt = req.MainLogoAlt
	if req.MainLogoSize != nil {
		branding.MainLogoSize = *req.MainLogoSize
	} else if branding.MainLogoSize <= 0 {
		branding.MainLogoSize = 40
	}
	if req.HeaderLogoRounded != nil {
		branding.HeaderLogoRounded = *req.HeaderLogoRounded
	} else if !branding.HeaderLogoRounded {
		branding.HeaderLogoRounded = true
	}
	if req.IsActive != nil {
		branding.IsActive = *req.IsActive
	} else if !branding.IsActive {
		branding.IsActive = true
	}

	if branding.CreatedAt.IsZero() {
		if err := s.repo.Create(branding); err != nil {
			return nil, fmt.Errorf("failed to save site branding: %w", err)
		}
	} else {
		if err := s.repo.Update(branding); err != nil {
			return nil, fmt.Errorf("failed to update site branding: %w", err)
		}
	}

	updated, err := s.repo.GetCurrent()
	if err != nil {
		return nil, fmt.Errorf("failed to reload site branding: %w", err)
	}
	if updated == nil {
		return nil, fmt.Errorf("site branding not found after update")
	}

	return mapSiteBrandingToResponse(updated), nil
}