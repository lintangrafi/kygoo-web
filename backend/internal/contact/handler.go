package contact

import (
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	httputils "github.com/kygoo-web/backend/internal/shared/http"
	"github.com/kygoo-web/backend/internal/shared/middleware"
)

type Handler struct {
	inquiryService InquiryService
	landingService LandingService
}

func NewHandler(inquiryService InquiryService, landingService LandingService) *Handler {
	return &Handler{
		inquiryService: inquiryService,
		landingService: landingService,
	}
}

func (h *Handler) RegisterRoutes(router chi.Router) {
	router.Route("/api/v1/contact", func(r chi.Router) {
		// Public routes
		r.Post("/inquiries", h.CreateInquiry)
		r.Get("/landing/coffee", h.GetCoffeeLanding)
		r.Get("/landing/digital", h.GetDigitalLanding)

		// Admin protected routes
		r.With(middleware.JWTMiddleware).Get("/inquiries", h.GetInquiries)
		r.With(middleware.JWTMiddleware).Get("/inquiries/{id}", h.GetInquiryByID)
		r.With(middleware.JWTMiddleware).Put("/inquiries/{id}", h.UpdateInquiry)
		r.With(middleware.JWTMiddleware).Delete("/inquiries/{id}", h.DeleteInquiry)

		r.With(middleware.JWTMiddleware).Put("/landing/coffee", h.UpdateCoffeeLanding)
		r.With(middleware.JWTMiddleware).Put("/landing/digital", h.UpdateDigitalLanding)
	})
}

// Inquiry Handlers

// CreateInquiry godoc
//
//	@Summary		Create contact inquiry
//	@Description	Create a new contact inquiry from visitor
//	@Tags			contact/inquiries
//	@Accept			json
//	@Produce		json
//	@Param			request	body		CreateInquiryRequest	true	"Inquiry creation request"
//	@Success		201	{object}	InquiryResponse
//	@Failure		400	{object}	httputils.ErrorResponse
//	@Failure		500	{object}	httputils.ErrorResponse
//	@Router			/api/v1/contact/inquiries [post]
func (h *Handler) CreateInquiry(w http.ResponseWriter, r *http.Request) {
	var req CreateInquiryRequest
	if err := httputils.DecodeJSON(r.Body, &req); err != nil {
		httputils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	resp, err := h.inquiryService.CreateInquiry(&req)
	if err != nil {
		httputils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	httputils.RespondSuccess(w, http.StatusCreated, resp)
}

// GetInquiries godoc
//
//	@Summary		Get contact inquiries
//	@Description	Get paginated list of contact inquiries (admin only)
//	@Tags			contact/inquiries
//	@Accept			json
//	@Produce		json
//	@Security		Bearer
//	@Param			page	query		int		false	"Page number" default(1)
//	@Param			limit	query		int		false	"Items per page" default(10)
//	@Param			status	query		string	false	"Filter by status (new, replied, resolved)"
//	@Success		200	{object}	PaginatedInquiriesResponse
//	@Failure		400	{object}	httputils.ErrorResponse
//	@Failure		401	{object}	httputils.ErrorResponse
//	@Failure		500	{object}	httputils.ErrorResponse
//	@Router			/api/v1/contact/inquiries [get]
func (h *Handler) GetInquiries(w http.ResponseWriter, r *http.Request) {
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	if page < 1 {
		page = 1
	}

	pageSize, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	if pageSize < 1 {
		pageSize = 10
	}

	status := r.URL.Query().Get("status")

	resp, err := h.inquiryService.GetInquiries(page, pageSize, status)
	if err != nil {
		httputils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	httputils.RespondSuccess(w, http.StatusOK, resp)
}

// GetInquiryByID godoc
//
//	@Summary		Get inquiry by ID
//	@Description	Get a specific contact inquiry by ID (admin only)
//	@Tags			contact/inquiries
//	@Accept			json
//	@Produce		json
//	@Security		Bearer
//	@Param			id	path		string	true	"Inquiry ID"
//	@Success		200	{object}	InquiryResponse
//	@Failure		400	{object}	httputils.ErrorResponse
//	@Failure		401	{object}	httputils.ErrorResponse
//	@Failure		404	{object}	httputils.ErrorResponse
//	@Failure		500	{object}	httputils.ErrorResponse
//	@Router			/api/v1/contact/inquiries/{id} [get]
func (h *Handler) GetInquiryByID(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		httputils.RespondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	resp, err := h.inquiryService.GetInquiry(id)
	if err != nil {
		httputils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	httputils.RespondSuccess(w, http.StatusOK, resp)
}

// UpdateInquiry godoc
//
//	@Summary		Update contact inquiry
//	@Description	Update a contact inquiry status (admin only)
//	@Tags			contact/inquiries
//	@Accept			json
//	@Produce		json
//	@Security		Bearer
//	@Param			id		path		string					true	"Inquiry ID"
//	@Param			request	body		UpdateInquiryRequest	true	"Inquiry update request"
//	@Success		200	{object}	InquiryResponse
//	@Failure		400	{object}	httputils.ErrorResponse
//	@Failure		401	{object}	httputils.ErrorResponse
//	@Failure		404	{object}	httputils.ErrorResponse
//	@Failure		500	{object}	httputils.ErrorResponse
//	@Router			/api/v1/contact/inquiries/{id} [put]
func (h *Handler) UpdateInquiry(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		httputils.RespondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	var req UpdateInquiryRequest
	if err := httputils.DecodeJSON(r.Body, &req); err != nil {
		httputils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	resp, err := h.inquiryService.UpdateInquiry(id, &req)
	if err != nil {
		httputils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	httputils.RespondSuccess(w, http.StatusOK, resp)
}

// DeleteInquiry godoc
//
//	@Summary		Delete contact inquiry
//	@Description	Delete a contact inquiry (admin only, soft delete)
//	@Tags			contact/inquiries
//	@Accept			json
//	@Produce		json
//	@Security		Bearer
//	@Param			id	path		string	true	"Inquiry ID"
//	@Success		204
//	@Failure		400	{object}	httputils.ErrorResponse
//	@Failure		401	{object}	httputils.ErrorResponse
//	@Failure		404	{object}	httputils.ErrorResponse
//	@Failure		500	{object}	httputils.ErrorResponse
//	@Router			/api/v1/contact/inquiries/{id} [delete]
func (h *Handler) DeleteInquiry(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		httputils.RespondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	if err := h.inquiryService.DeleteInquiry(id); err != nil {
		httputils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// Landing Handlers

// GetCoffeeLanding godoc
//
//	@Summary		Get coffee landing content
//	@Description	Get landing page content for coffee business line
//	@Tags			contact/landing
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	LandingResponse
//	@Failure		500	{object}	httputils.ErrorResponse
//	@Router			/api/v1/contact/landing/coffee [get]
func (h *Handler) GetCoffeeLanding(w http.ResponseWriter, r *http.Request) {
	resp, err := h.landingService.GetCoffeeLanding()
	if err != nil {
		httputils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	httputils.RespondSuccess(w, http.StatusOK, resp)
}

// GetDigitalLanding godoc
//
//	@Summary		Get digital landing content
//	@Description	Get landing page content for digital business line
//	@Tags			contact/landing
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	LandingResponse
//	@Failure		500	{object}	httputils.ErrorResponse
//	@Router			/api/v1/contact/landing/digital [get]
func (h *Handler) GetDigitalLanding(w http.ResponseWriter, r *http.Request) {
	resp, err := h.landingService.GetDigitalLanding()
	if err != nil {
		httputils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	httputils.RespondSuccess(w, http.StatusOK, resp)
}

// UpdateCoffeeLanding godoc
//
//	@Summary		Update coffee landing content
//	@Description	Update landing page content for coffee business line (admin only)
//	@Tags			contact/landing
//	@Accept			json
//	@Produce		json
//	@Security		Bearer
//	@Param			request	body		UpdateLandingRequest	true	"Landing update request"
//	@Success		200	{object}	LandingResponse
//	@Failure		400	{object}	httputils.ErrorResponse
//	@Failure		401	{object}	httputils.ErrorResponse
//	@Failure		500	{object}	httputils.ErrorResponse
//	@Router			/api/v1/contact/landing/coffee [put]
func (h *Handler) UpdateCoffeeLanding(w http.ResponseWriter, r *http.Request) {
	var req UpdateLandingRequest
	if err := httputils.DecodeJSON(r.Body, &req); err != nil {
		httputils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	resp, err := h.landingService.UpdateCoffeeLanding(&req)
	if err != nil {
		httputils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	httputils.RespondSuccess(w, http.StatusOK, resp)
}

// UpdateDigitalLanding godoc
//
//	@Summary		Update digital landing content
//	@Description	Update landing page content for digital business line (admin only)
//	@Tags			contact/landing
//	@Accept			json
//	@Produce		json
//	@Security		Bearer
//	@Param			request	body		UpdateLandingRequest	true	"Landing update request"
//	@Success		200	{object}	LandingResponse
//	@Failure		400	{object}	httputils.ErrorResponse
//	@Failure		401	{object}	httputils.ErrorResponse
//	@Failure		500	{object}	httputils.ErrorResponse
//	@Router			/api/v1/contact/landing/digital [put]
func (h *Handler) UpdateDigitalLanding(w http.ResponseWriter, r *http.Request) {
	var req UpdateLandingRequest
	if err := httputils.DecodeJSON(r.Body, &req); err != nil {
		httputils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	resp, err := h.landingService.UpdateDigitalLanding(&req)
	if err != nil {
		httputils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	httputils.RespondSuccess(w, http.StatusOK, resp)
}
