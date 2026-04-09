package businessproject

import "github.com/google/uuid"

type CreateProjectRequest struct {
	BusinessLine string `json:"business_line" validate:"required,oneof=studio photobooth digital coffee"`
	Name         string `json:"name" validate:"required,min=3,max=160"`
	EventLocation string `json:"event_location" validate:"required,min=2,max=255"`
	Day          int    `json:"day" validate:"required,min=1,max=31"`
	Month        int    `json:"month" validate:"required,min=1,max=12"`
	Year         string `json:"year" validate:"required,len=4,numeric"`
	Impact       string `json:"impact" validate:"required,min=10,max=600"`
	SortOrder    int    `json:"sort_order" validate:"gte=0,lte=9999"`
	IsActive     *bool  `json:"is_active"`
}

type UpdateProjectRequest struct {
	BusinessLine *string `json:"business_line" validate:"omitempty,oneof=studio photobooth digital coffee"`
	Name         *string `json:"name" validate:"omitempty,min=3,max=160"`
	EventLocation *string `json:"event_location" validate:"omitempty,min=2,max=255"`
	Day          *int    `json:"day" validate:"omitempty,min=1,max=31"`
	Month        *int    `json:"month" validate:"omitempty,min=1,max=12"`
	Year         *string `json:"year" validate:"omitempty,len=4,numeric"`
	Impact       *string `json:"impact" validate:"omitempty,min=10,max=600"`
	SortOrder    *int    `json:"sort_order" validate:"omitempty,gte=0,lte=9999"`
	IsActive     *bool   `json:"is_active"`
}

type ProjectResponse struct {
	ID           uuid.UUID `json:"id"`
	BusinessLine string    `json:"business_line"`
	Name         string    `json:"name"`
	EventLocation string   `json:"event_location"`
	Day          int       `json:"day"`
	Month        int       `json:"month"`
	Year         string    `json:"year"`
	Impact       string    `json:"impact"`
	SortOrder    int       `json:"sort_order"`
	IsActive     bool      `json:"is_active"`
	Gallery      []ProjectGalleryItem `json:"gallery"`
	CreatedAt    string    `json:"created_at"`
	UpdatedAt    string    `json:"updated_at"`
}

type ProjectGalleryItem struct {
	ID        uuid.UUID `json:"id"`
	ProjectID uuid.UUID `json:"project_id"`
	FileURL   string    `json:"file_url"`
	FileName  string    `json:"file_name"`
	IsCover   bool      `json:"is_cover"`
	SortOrder int       `json:"sort_order"`
	CreatedAt string    `json:"created_at"`
}

type ProjectAuditLogResponse struct {
	ID        uuid.UUID `json:"id"`
	ProjectID uuid.UUID `json:"project_id"`
	Action    string    `json:"action"`
	ChangedBy string    `json:"changed_by"`
	ChangedAt string    `json:"changed_at"`
	BeforeData string   `json:"before_data"`
	AfterData  string   `json:"after_data"`
}
