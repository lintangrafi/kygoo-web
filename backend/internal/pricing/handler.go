package pricing

import (
	"net/http"

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

func parseIncludeInactive(r *http.Request) bool {
	return r.URL.Query().Get("include_inactive") == "true"
}

func (h *Handler) ListPackages(w http.ResponseWriter, r *http.Request) {
	line := r.URL.Query().Get("business_line")
	includeInactive := parseIncludeInactive(r)

	var (
		packages []PackageResponse
		err      error
	)

	if line != "" {
		packages, err = h.service.GetByBusinessLine(line, includeInactive)
	} else {
		packages, err = h.service.GetAll(includeInactive)
	}
	if err != nil {
		response.ResponseError(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusOK, response.JSON{Status: true, Message: "success", Data: packages})
}

func (h *Handler) GetPackage(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	packageID, err := uuid.Parse(id)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid package ID")
		return
	}

	includeInactive := parseIncludeInactive(r)
	packageItem, err := h.service.GetByID(packageID, includeInactive)
	if err != nil {
		response.ResponseError(w, http.StatusNotFound, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusOK, response.JSON{Status: true, Message: "success", Data: packageItem})
}

func (h *Handler) CreatePackage(w http.ResponseWriter, r *http.Request) {
	var req CreatePackageRequest
	if err := httputils.DecodeJSON(r.Body, &req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := validator.Validate(req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	packageItem, err := h.service.Create(&req)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusCreated, response.JSON{Status: true, Message: "package created", Data: packageItem})
}

func (h *Handler) UpdatePackage(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	packageID, err := uuid.Parse(id)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid package ID")
		return
	}

	var req UpdatePackageRequest
	if err := httputils.DecodeJSON(r.Body, &req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := validator.Validate(req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	packageItem, err := h.service.Update(packageID, &req)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusOK, response.JSON{Status: true, Message: "package updated", Data: packageItem})
}

func (h *Handler) DeletePackage(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	packageID, err := uuid.Parse(id)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid package ID")
		return
	}

	if err := h.service.Delete(packageID); err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusOK, response.JSON{Status: true, Message: "package deleted"})
}

func RegisterRoutes(r chi.Router, handler *Handler, jwtMiddleware func(next http.Handler) http.Handler) {
	r.Get("/api/v1/pricing", handler.ListPackages)
	r.Get("/api/v1/pricing/{id}", handler.GetPackage)

	r.Group(func(ar chi.Router) {
		ar.Use(jwtMiddleware)
		ar.Use(middleware.RequireRole("Super Admin", "Admin"))
		ar.Get("/api/v1/admin/pricing", handler.ListPackages)
		ar.Post("/api/v1/admin/pricing", handler.CreatePackage)
		ar.Put("/api/v1/admin/pricing/{id}", handler.UpdatePackage)
		ar.Delete("/api/v1/admin/pricing/{id}", handler.DeletePackage)
	})
}

func (h *Handler) RegisterRoutes(r chi.Router) {
	RegisterRoutes(r, h, middleware.JWTAuthMiddleware)
}