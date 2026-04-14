package models

import (
	"time"

	"github.com/google/uuid"
)

// BusinessLinePackage represents a configurable price list entry for a business line.
type BusinessLinePackage struct {
	ID           uuid.UUID  `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	BusinessLine string     `gorm:"type:varchar(50);not null;uniqueIndex:ux_business_line_packages_line_name,priority:1;index:idx_business_line_packages_line_order,priority:1"`
	Name         string     `gorm:"type:varchar(255);not null;uniqueIndex:ux_business_line_packages_line_name,priority:2"`
	Description  string     `gorm:"type:text"`
	PriceLabel   string     `gorm:"column:price_label;type:varchar(120);not null"`
	Features     JSONArray  `gorm:"type:jsonb;default:'[]'::jsonb"`
	Highlight    bool       `gorm:"type:boolean;default:false"`
	DisplayOrder int        `gorm:"type:int;default:0;index:idx_business_line_packages_line_order,priority:2"`
	IsActive     bool       `gorm:"type:boolean;default:true;index"`
	CreatedAt    time.Time  `gorm:"not null;default:now()"`
	UpdatedAt    time.Time  `gorm:"not null;default:now()"`
	DeletedAt    *time.Time `gorm:"index"`
}

func (BusinessLinePackage) TableName() string {
	return "business_line_packages"
}