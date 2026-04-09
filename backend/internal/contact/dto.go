package contact

import "github.com/google/uuid"

type CreateInquiryRequest struct {
	Name         string `json:"name" validate:"required,min=2,max=255"`
	Email        string `json:"email" validate:"required,email"`
	Phone        string `json:"phone" validate:"required,min=8,max=20"`
	BusinessLine string `json:"business_line" validate:"required,oneof=studio photobooth digital coffee"`
	EventType    string `json:"event_type" validate:"required,min=3,max=150"`
	EventDate    string `json:"event_date" validate:"required,min=4,max=20"`
	Location     string `json:"location" validate:"required,min=2,max=255"`
	GuestCount   string `json:"guest_count" validate:"required,min=1,max=50"`
	BudgetRange  string `json:"budget_range" validate:"required,min=2,max=100"`
	Notes        string `json:"notes" validate:"omitempty,max=2000"`
	Message      string `json:"message" validate:"required,min=20,max=4000"`
	Source       string `json:"source" validate:"omitempty,min=2,max=50"`
}

type UpdateInquiryStatusRequest struct {
	Status string `json:"status" validate:"required,oneof=new responded closed"`
}

type InquiryResponse struct {
	ID           uuid.UUID `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	Phone        string    `json:"phone"`
	BusinessLine string    `json:"business_line"`
	EventType    string    `json:"event_type"`
	EventDate    string    `json:"event_date"`
	Location     string    `json:"location"`
	GuestCount   string    `json:"guest_count"`
	BudgetRange  string    `json:"budget_range"`
	Notes        string    `json:"notes"`
	Message      string    `json:"message"`
	Status       string    `json:"status"`
	Source       string    `json:"source"`
	CreatedAt    string    `json:"created_at"`
	UpdatedAt    string    `json:"updated_at"`
}
