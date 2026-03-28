package models

import (
	"database/sql/driver"
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

// PhotoboothPackage represents a photobooth service package with pricing
type PhotoboothPackage struct {
	ID          uuid.UUID  `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Name        string     `gorm:"type:varchar(255);not null"`
	Description string     `gorm:"type:text"`
	Price       float64    `gorm:"type:decimal(10,2);not null"`
	Features    JSONArray `gorm:"type:jsonb;default:'[]'::jsonb"`
	TosURL      string     `gorm:"type:text"`
	CreatedAt   time.Time  `gorm:"not null;default:now()"`
	UpdatedAt   time.Time  `gorm:"not null;default:now()"`
	DeletedAt   *time.Time `gorm:"index"`
}

func (PhotoboothPackage) TableName() string {
	return "photobooth_packages"
}

// PhotoboothEvent represents a photobooth event with portfolio
type PhotoboothEvent struct {
	ID                 uuid.UUID                `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	EventName          string                   `gorm:"type:varchar(255);not null"`
	EventType          string                   `gorm:"type:varchar(50)"` // wedding, organizational, other
	EventDate          *time.Time               `gorm:"type:date"`
	Location           string                   `gorm:"type:varchar(255)"`
	Description        string                   `gorm:"type:text"`
	FeaturedImageURL   string                   `gorm:"type:text"`
	Status             string                   `gorm:"type:varchar(20);default:'draft'"` // draft, published
	CreatedAt          time.Time                `gorm:"not null;default:now()"`
	UpdatedAt          time.Time                `gorm:"not null;default:now()"`
	DeletedAt          *time.Time               `gorm:"index"`
	
	// Relationships
	Images             []PhotoboothEventImage `json:"images,omitempty" gorm:"foreignKey:EventID;references:ID"`
}

func (PhotoboothEvent) TableName() string {
	return "photobooth_events"
}

// PhotoboothEventImage represents an image in a photobooth event
type PhotoboothEventImage struct {
	ID           uuid.UUID  `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	EventID      uuid.UUID  `gorm:"type:uuid;not null;index"`
	ImageURL     string     `gorm:"type:text;not null"`
	Caption      string     `gorm:"type:text"`
	DisplayOrder int        `gorm:"type:int;default:0"`
	CreatedAt    time.Time  `gorm:"not null;default:now()"`
	DeletedAt    *time.Time `gorm:"index"`
}

func (PhotoboothEventImage) TableName() string {
	return "photobooth_event_images"
}

// JSONArray is a custom type for JSONB arrays
type JSONArray []string

func (ja JSONArray) Value() (driver.Value, error) {
	return json.Marshal(ja)
}

func (ja *JSONArray) Scan(value interface{}) error {
	return json.Unmarshal(value.([]byte), ja)
}
