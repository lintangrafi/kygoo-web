package models

import (
	"time"

	"github.com/google/uuid"
)

// BusinessLineLogo represents a partner/client logo that can be shown per business line.
type BusinessLineLogo struct {
	ID           uuid.UUID  `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	BusinessLine string     `gorm:"type:varchar(50);not null;index:idx_business_line_logos_lookup,priority:1"`
	Section      string     `gorm:"type:varchar(20);not null;index:idx_business_line_logos_lookup,priority:2"`
	Name         string     `gorm:"type:varchar(255);not null"`
	ImageURL     string     `gorm:"type:text;not null"`
	AltText      string     `gorm:"type:varchar(255)"`
	DisplayOrder int        `gorm:"type:int;default:0;index:idx_business_line_logos_lookup,priority:3"`
	DisplayWidth int        `gorm:"type:int;default:150"`
	DisplayHeight int       `gorm:"type:int;default:64"`
	IsActive     bool       `gorm:"type:boolean;default:true;index"`
	CreatedAt    time.Time  `gorm:"not null;default:now()"`
	UpdatedAt    time.Time  `gorm:"not null;default:now()"`
	DeletedAt    *time.Time `gorm:"index"`
}

func (BusinessLineLogo) TableName() string {
	return "business_line_logos"
}