package models

import (
	"time"

	"github.com/google/uuid"
)

// CoffeeLanding represents the coffee service landing page content
type CoffeeLanding struct {
	ID           uuid.UUID  `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Title        string     `gorm:"type:varchar(255);not null"`
	Subtitle     string     `gorm:"type:varchar(255)"`
	Description  string     `gorm:"type:text"`
	CTAText      string     `gorm:"column:cta_text;type:varchar(100)"`
	Status       string     `gorm:"type:varchar(20);default:'draft'"` // draft, published
	CreatedAt    time.Time  `gorm:"not null;default:now()"`
	UpdatedAt    time.Time  `gorm:"not null;default:now()"`
}

func (CoffeeLanding) TableName() string {
	return "coffee_landing"
}

// DigitalLanding represents the digital service landing page content
type DigitalLanding struct {
	ID           uuid.UUID  `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Title        string     `gorm:"type:varchar(255);not null"`
	Subtitle     string     `gorm:"type:varchar(255)"`
	Description  string     `gorm:"type:text"`
	CTAText      string     `gorm:"column:cta_text;type:varchar(100)"`
	Status       string     `gorm:"type:varchar(20);default:'draft'"` // draft, published
	CreatedAt    time.Time  `gorm:"not null;default:now()"`
	UpdatedAt    time.Time  `gorm:"not null;default:now()"`
}

func (DigitalLanding) TableName() string {
	return "digital_landing"
}

// ContactInquiry represents a contact form submission
type ContactInquiry struct {
	ID           uuid.UUID  `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Name         string     `gorm:"type:varchar(255);not null"`
	Email        string     `gorm:"type:varchar(255);not null;index"`
	Phone        string     `gorm:"type:varchar(20)"`
	BusinessLine string     `gorm:"type:varchar(50)"` // studio, photobooth, digital, coffee
	Message      string     `gorm:"type:text;not null"`
	Status       string     `gorm:"type:varchar(20);default:'new'"` // new, responded
	CreatedAt    time.Time  `gorm:"not null;default:now();index:idx_contact_created;sort:desc"`
	UpdatedAt    time.Time  `gorm:"not null;default:now()"`
}

func (ContactInquiry) TableName() string {
	return "contact_inquiries"
}
