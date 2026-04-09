package models

import (
	"time"

	"github.com/google/uuid"
)

// StudioTheme represents a photography studio theme/background
type StudioTheme struct {
	ID                 uuid.UUID      `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Name               string         `gorm:"type:varchar(255);not null"`
	Description        string         `gorm:"type:text"`
	BackgroundImageURL string         `gorm:"type:text"`
	DisplayOrder       int            `gorm:"type:int;default:0"`
	CreatedAt          time.Time      `gorm:"not null;default:now()"`
	UpdatedAt          time.Time      `gorm:"not null;default:now()"`
	DeletedAt          *time.Time     `gorm:"index"`
	
	// Relationships
	Templates          []StudioTemplate `json:"templates,omitempty" gorm:"foreignKey:ThemeID;references:ID"`
}

func (StudioTheme) TableName() string {
	return "studio_themes"
}

// StudioTemplate represents a template/strip with before/after examples
type StudioTemplate struct {
	ID                 uuid.UUID  `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	ThemeID            uuid.UUID  `gorm:"type:uuid;not null;index"`
	Name               string     `gorm:"type:varchar(255);not null"`
	TemplateImageURL   string     `gorm:"type:text;not null"`
	ResultImageURL     string     `gorm:"type:text;not null"`
	Description        string     `gorm:"type:text"`
	DisplayOrder       int        `gorm:"type:int;default:0"`
	CreatedAt          time.Time  `gorm:"not null;default:now()"`
	UpdatedAt          time.Time  `gorm:"not null;default:now()"`
	DeletedAt          *time.Time `gorm:"index"`
}

func (StudioTemplate) TableName() string {
	return "studio_templates"
}
