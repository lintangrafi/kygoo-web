package studiocontent

import (
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	httputils "github.com/base-go/backend/internal/shared/http"
	"github.com/base-go/backend/pkg/middleware"
	"github.com/base-go/backend/pkg/response"
	"github.com/base-go/backend/pkg/validator"
)

type Handler struct {
	themeService    ThemeService
	templateService TemplateService
}

func NewHandler(themeService ThemeService, templateService TemplateService) *Handler {
	return &Handler{
		themeService:    themeService,
		templateService: templateService,
	}
}

// Public Endpoints

// GetThemes godoc
// @Summary Get all studio themes
// @Description Get paginated list of studio themes
// @Tags Studio
// @Param page query int false "Page number (default: 1)"
// @Param page_size query int false "Page size (default: 10)"
// @Success 200 {object} PaginatedThemesResponse
// @Router /api/studio/themes [get]
func (h *Handler) GetThemes(w http.ResponseWriter, r *http.Request) {
	page := 1
	pageSize := 10

	if p := r.URL.Query().Get("page"); p != "" {
		if parsed, err := strconv.Atoi(p); err == nil && parsed > 0 {
			page = parsed
		}
	}

	if ps := r.URL.Query().Get("page_size"); ps != "" {
		if parsed, err := strconv.Atoi(ps); err == nil && parsed > 0 && parsed <= 100 {
			pageSize = parsed
		}
	}

	result, err := h.themeService.GetAllThemes(page, pageSize)
	if err != nil {
		response.ResponseError(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusOK, result)
}

// GetThemeByID godoc
// @Summary Get studio theme by ID
// @Description Get a specific studio theme with its templates
// @Tags Studio
// @Param id path string true "Theme ID"
// @Success 200 {object} ThemeResponse
// @Router /api/studio/themes/{id} [get]
func (h *Handler) GetThemeByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	themeID, err := uuid.Parse(id)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid theme ID")
		return
	}

	theme, err := h.themeService.GetThemeByID(themeID)
	if err != nil {
		response.ResponseError(w, http.StatusNotFound, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusOK, theme)
}

// GetTemplatesByThemeID godoc
// @Summary Get templates for a theme
// @Description Get all templates for a specific theme
// @Tags Studio
// @Param id path string true "Theme ID"
// @Success 200 {object} []TemplateResponse
// @Router /api/studio/themes/{id}/templates [get]
func (h *Handler) GetTemplatesByThemeID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	themeID, err := uuid.Parse(id)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid theme ID")
		return
	}

	templates, err := h.templateService.GetTemplatesByThemeID(themeID)
	if err != nil {
		response.ResponseError(w, http.StatusNotFound, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusOK, templates)
}

// Admin Endpoints - Protected

// CreateTheme godoc
// @Summary Create a new studio theme
// @Description Create a new studio theme (admin only)
// @Tags Studio Admin
// @Security Bearer
// @Param request body CreateThemeRequest true "Create theme request"
// @Success 201 {object} ThemeResponse
// @Router /api/admin/studio/themes [post]
func (h *Handler) CreateTheme(w http.ResponseWriter, r *http.Request) {
	var req CreateThemeRequest
	if err := httputils.DecodeJSON(r.Body, &req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := validator.Validate(req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	theme, err := h.themeService.CreateTheme(&req)
	if err != nil {
		response.ResponseError(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusCreated, theme)
}

// UpdateTheme godoc
// @Summary Update a studio theme
// @Description Update an existing studio theme (admin only)
// @Tags Studio Admin
// @Security Bearer
// @Param id path string true "Theme ID"
// @Param request body UpdateThemeRequest true "Update theme request"
// @Success 200 {object} ThemeResponse
// @Router /api/admin/studio/themes/{id} [put]
func (h *Handler) UpdateTheme(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	themeID, err := uuid.Parse(id)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid theme ID")
		return
	}

	var req UpdateThemeRequest
	if err := httputils.DecodeJSON(r.Body, &req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := validator.Validate(req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	theme, err := h.themeService.UpdateTheme(themeID, &req)
	if err != nil {
		response.ResponseError(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusOK, theme)
}

// DeleteTheme godoc
// @Summary Delete a studio theme
// @Description Soft delete a studio theme (admin only)
// @Tags Studio Admin
// @Security Bearer
// @Param id path string true "Theme ID"
// @Success 204
// @Router /api/admin/studio/themes/{id} [delete]
func (h *Handler) DeleteTheme(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	themeID, err := uuid.Parse(id)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid theme ID")
		return
	}

	if err := h.themeService.DeleteTheme(themeID); err != nil {
		response.ResponseError(w, http.StatusInternalServerError, err.Error())
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// CreateTemplate godoc
// @Summary Create a new template
// @Description Create a new template for a theme (admin only)
// @Tags Studio Admin
// @Security Bearer
// @Param request body CreateTemplateRequest true "Create template request"
// @Success 201 {object} TemplateResponse
// @Router /api/admin/studio/templates [post]
func (h *Handler) CreateTemplate(w http.ResponseWriter, r *http.Request) {
	var req CreateTemplateRequest
	if err := httputils.DecodeJSON(r.Body, &req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := validator.Validate(req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	template, err := h.templateService.CreateTemplate(&req)
	if err != nil {
		response.ResponseError(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusCreated, template)
}

// UpdateTemplate godoc
// @Summary Update a template
// @Description Update an existing template (admin only)
// @Tags Studio Admin
// @Security Bearer
// @Param id path string true "Template ID"
// @Param request body UpdateTemplateRequest true "Update template request"
// @Success 200 {object} TemplateResponse
// @Router /api/admin/studio/templates/{id} [put]
func (h *Handler) UpdateTemplate(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	templateID, err := uuid.Parse(id)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid template ID")
		return
	}

	var req UpdateTemplateRequest
	if err := httputils.DecodeJSON(r.Body, &req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := validator.Validate(req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	template, err := h.templateService.UpdateTemplate(templateID, &req)
	if err != nil {
		response.ResponseError(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusOK, template)
}

// DeleteTemplate godoc
// @Summary Delete a template
// @Description Soft delete a template (admin only)
// @Tags Studio Admin
// @Security Bearer
// @Param id path string true "Template ID"
// @Success 204
// @Router /api/admin/studio/templates/{id} [delete]
func (h *Handler) DeleteTemplate(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	templateID, err := uuid.Parse(id)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid template ID")
		return
	}

	if err := h.templateService.DeleteTemplate(templateID); err != nil {
		response.ResponseError(w, http.StatusInternalServerError, err.Error())
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// RegisterRoutes registers all routes for the studio content module
func RegisterRoutes(r chi.Router, handler *Handler, jwtMiddleware func(next http.Handler) http.Handler) {
	// Public routes
	r.Get("/api/studio/themes", handler.GetThemes)
	r.Get("/api/studio/themes/{id}", handler.GetThemeByID)
	r.Get("/api/studio/themes/{id}/templates", handler.GetTemplatesByThemeID)

	// Admin routes (protected by JWT middleware)
	r.Group(func(ar chi.Router) {
		ar.Use(jwtMiddleware)
		ar.Post("/api/admin/studio/themes", handler.CreateTheme)
		ar.Put("/api/admin/studio/themes/{id}", handler.UpdateTheme)
		ar.Delete("/api/admin/studio/themes/{id}", handler.DeleteTheme)
		ar.Post("/api/admin/studio/templates", handler.CreateTemplate)
		ar.Put("/api/admin/studio/templates/{id}", handler.UpdateTemplate)
		ar.Delete("/api/admin/studio/templates/{id}", handler.DeleteTemplate)
	})
}

// RegisterRoutes provides a method form used by the central router package.
func (h *Handler) RegisterRoutes(r chi.Router) {
	RegisterRoutes(r, h, middleware.JWTAuthMiddleware)
}
