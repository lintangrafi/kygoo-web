package contact

import (
	"net/http"
	"strconv"

	httputils "github.com/base-go/backend/internal/shared/http"
	"github.com/base-go/backend/pkg/middleware"
	"github.com/base-go/backend/pkg/response"
	"github.com/base-go/backend/pkg/validator"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func getActorFromRequest(r *http.Request) string {
	if userCtx, ok := r.Context().Value(middleware.ContextUser).(response.UserContext); ok {
		if userCtx.UserID != "" {
			return userCtx.UserID
		}
	}
	if userCtx, ok := r.Context().Value("user_context").(response.UserContext); ok {
		if userCtx.UserID != "" {
			return userCtx.UserID
		}
	}
	return "system"
}

func (h *Handler) CreateInquiry(w http.ResponseWriter, r *http.Request) {
	var req CreateInquiryRequest
	if err := httputils.DecodeJSON(r.Body, &req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := validator.Validate(req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	inquiry, err := h.service.Create(&req)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusCreated, response.JSON{Status: true, Message: "inquiry created", Data: inquiry})
}

func (h *Handler) GetRecentInquiries(w http.ResponseWriter, r *http.Request) {
	limit := 20
	if raw := r.URL.Query().Get("limit"); raw != "" {
		if parsed, err := strconv.Atoi(raw); err == nil {
			limit = parsed
		}
	}

	inquiries, err := h.service.GetRecent(limit)
	if err != nil {
		response.ResponseError(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusOK, response.JSON{Status: true, Message: "success", Data: inquiries})
}

func (h *Handler) UpdateInquiryStatus(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	inquiryID, err := uuid.Parse(id)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid inquiry ID")
		return
	}

	var req UpdateInquiryStatusRequest
	if err := httputils.DecodeJSON(r.Body, &req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := validator.Validate(req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	inquiry, err := h.service.UpdateStatus(inquiryID, &req)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusOK, response.JSON{Status: true, Message: "inquiry updated", Data: inquiry})
}

func RegisterRoutes(r chi.Router, handler *Handler, jwtMiddleware func(next http.Handler) http.Handler) {
	r.Post("/api/v1/contact/inquiries", handler.CreateInquiry)

	r.Group(func(ar chi.Router) {
		ar.Use(jwtMiddleware)
		ar.Use(middleware.RequireRole("Super Admin", "Admin"))
		ar.Get("/api/v1/admin/contact/inquiries", handler.GetRecentInquiries)
		ar.Put("/api/v1/admin/contact/inquiries/{id}", handler.UpdateInquiryStatus)
	})
}

func (h *Handler) RegisterRoutes(r chi.Router) {
	RegisterRoutes(r, h, middleware.JWTAuthMiddleware)
}
