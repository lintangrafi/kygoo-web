package models

import (
	"time"

	"github.com/google/uuid"
)

// SiteBranding stores the primary Kygoo Group identity used across the site.
type SiteBranding struct {
	ID               uuid.UUID  `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	SiteName         string     `gorm:"type:varchar(255);not null"`
	SiteDescription  string     `gorm:"type:text"`
	MainLogoURL      string     `gorm:"type:text;not null"`
	MainLogoAlt      string     `gorm:"type:varchar(255)"`
	IsActive         bool       `gorm:"type:boolean;default:true;index"`
	CreatedAt        time.Time  `gorm:"not null;default:now()"`
	UpdatedAt        time.Time  `gorm:"not null;default:now()"`
	DeletedAt        *time.Time `gorm:"index"`
}

func (SiteBranding) TableName() string {
	return "site_branding"
}