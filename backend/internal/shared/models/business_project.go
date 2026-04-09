package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
)

// BusinessProject stores completed project entries for each business line.
type BusinessProject struct {
	ID           uuid.UUID      `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	BusinessLine string         `gorm:"type:varchar(50);not null;index"`
	Name         string         `gorm:"type:varchar(255);not null"`
	EventLocation string        `gorm:"type:varchar(255);not null;default:''"`
	Day          int            `gorm:"not null;default:1"`
	Month        int            `gorm:"not null;default:1"`
	Year         string         `gorm:"type:varchar(4);not null"`
	Impact       string         `gorm:"type:text;not null"`
	SortOrder    int            `gorm:"not null;default:0"`
	IsActive     bool           `gorm:"not null;default:true"`
	CreatedAt    time.Time      `gorm:"not null;default:now()"`
	UpdatedAt    time.Time      `gorm:"not null;default:now()"`
	DeletedAt    datatypes.NullTime `gorm:"index"`
	Gallery      []BusinessProjectMedia `gorm:"foreignKey:ProjectID"`
}

func (BusinessProject) TableName() string {
	return "business_projects"
}

// BusinessProjectMedia stores gallery images for each completed project.
type BusinessProjectMedia struct {
	ID        uuid.UUID          `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	ProjectID uuid.UUID          `gorm:"type:uuid;not null;index"`
	FileURL   string             `gorm:"type:text;not null"`
	FileName  string             `gorm:"type:varchar(255);not null"`
	IsCover   bool               `gorm:"not null;default:false;index"`
	SortOrder int                `gorm:"not null;default:0"`
	CreatedAt time.Time          `gorm:"not null;default:now()"`
	DeletedAt datatypes.NullTime `gorm:"index"`
}

func (BusinessProjectMedia) TableName() string {
	return "business_project_media"
}

// BusinessProjectAuditLog stores immutable audit trail for project changes.
type BusinessProjectAuditLog struct {
	ID        uuid.UUID      `gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	ProjectID uuid.UUID      `gorm:"type:uuid;not null;index"`
	Action    string         `gorm:"type:varchar(20);not null"`
	BeforeData datatypes.JSON `gorm:"type:jsonb"`
	AfterData  datatypes.JSON `gorm:"type:jsonb"`
	ChangedBy string         `gorm:"type:varchar(120);not null"`
	ChangedAt time.Time      `gorm:"not null;default:now();index"`
}

func (BusinessProjectAuditLog) TableName() string {
	return "business_project_audit_logs"
}
