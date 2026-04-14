package branding

import (
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"

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

func publicFileURL(r *http.Request, relativePath string) string {
	scheme := "http"
	if r.TLS != nil {
		scheme = "https"
	}
	if forwardedProto := r.Header.Get("X-Forwarded-Proto"); forwardedProto != "" {
		scheme = forwardedProto
	}
	normalized := strings.ReplaceAll(relativePath, "\\", "/")
	return fmt.Sprintf("%s://%s/uploads/%s", scheme, r.Host, normalized)
}

func saveLogoFile(r *http.Request, fileHeader *multipart.FileHeader) (string, error) {
	if fileHeader == nil {
		return "", fmt.Errorf("file is required")
	}

	if fileHeader.Size > (10 * 1024 * 1024) {
		return "", fmt.Errorf("file exceeds 10MB")
	}

	ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
	allowedExt := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".webp": true,
		".svg":  true,
	}
	if !allowedExt[ext] {
		return "", fmt.Errorf("unsupported file extension")
	}

	file, err := fileHeader.Open()
	if err != nil {
		return "", err
	}
	defer file.Close()

	businessLine := r.FormValue("business_line")
	if businessLine == "" {
		businessLine = "shared"
	}

	dir := filepath.Join("uploads", "branding", businessLine)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return "", err
	}

	storedName := fmt.Sprintf("%s%s", uuid.NewString(), ext)
	absPath := filepath.Join(dir, storedName)

	destination, err := os.Create(absPath)
	if err != nil {
		return "", err
	}
	defer destination.Close()

	if _, err := io.Copy(destination, file); err != nil {
		return "", err
	}

	relativePath := filepath.Join("branding", businessLine, storedName)
	return publicFileURL(r, relativePath), nil
}

func includeInactive(r *http.Request) bool {
	return r.URL.Query().Get("include_inactive") == "true"
}

func (h *Handler) ListLogos(w http.ResponseWriter, r *http.Request) {
	line := r.URL.Query().Get("business_line")
	incInactive := includeInactive(r)

	var (
		logos []LogoResponse
		err   error
	)

	if line != "" {
		logos, err = h.service.GetByBusinessLine(line, incInactive)
	} else {
		logos, err = h.service.GetAll(incInactive)
	}
	if err != nil {
		response.ResponseError(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusOK, response.JSON{Status: true, Message: "success", Data: logos})
}

func (h *Handler) GetLogo(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	logoID, err := uuid.Parse(id)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid logo ID")
		return
	}

	logo, err := h.service.GetByID(logoID, includeInactive(r))
	if err != nil {
		response.ResponseError(w, http.StatusNotFound, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusOK, response.JSON{Status: true, Message: "success", Data: logo})
}

func (h *Handler) CreateLogo(w http.ResponseWriter, r *http.Request) {
	var req CreateLogoRequest
	if err := httputils.DecodeJSON(r.Body, &req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := validator.Validate(req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	logo, err := h.service.Create(&req)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusCreated, response.JSON{Status: true, Message: "logo created", Data: logo})
}

func (h *Handler) UpdateLogo(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	logoID, err := uuid.Parse(id)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid logo ID")
		return
	}

	var req UpdateLogoRequest
	if err := httputils.DecodeJSON(r.Body, &req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := validator.Validate(req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	logo, err := h.service.Update(logoID, &req)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusOK, response.JSON{Status: true, Message: "logo updated", Data: logo})
}

func (h *Handler) DeleteLogo(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	logoID, err := uuid.Parse(id)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid logo ID")
		return
	}

	if err := h.service.Delete(logoID); err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusOK, response.JSON{Status: true, Message: "logo deleted"})
}

func (h *Handler) UploadLogo(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(12 << 20); err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid multipart form")
		return
	}

	uploadedFiles := r.MultipartForm.File["file"]
	if len(uploadedFiles) == 0 {
		response.ResponseError(w, http.StatusBadRequest, "file is required")
		return
	}

	url, err := saveLogoFile(r, uploadedFiles[0])
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusCreated, response.JSON{
		Status:  true,
		Message: "logo uploaded",
		Data:    UploadLogoResponse{URL: url},
	})
}

func RegisterRoutes(r chi.Router, handler *Handler, jwtMiddleware func(next http.Handler) http.Handler) {
	r.Get("/api/v1/branding/logos", handler.ListLogos)
	r.Get("/api/v1/branding/logos/{id}", handler.GetLogo)
	r.Group(func(ar chi.Router) {
		ar.Use(jwtMiddleware)
		ar.Use(middleware.RequireRole("Super Admin", "Admin"))
		ar.Post("/api/v1/branding/logos/upload", handler.UploadLogo)
		ar.Post("/api/v1/branding/logos", handler.CreateLogo)
		ar.Put("/api/v1/branding/logos/{id}", handler.UpdateLogo)
		ar.Delete("/api/v1/branding/logos/{id}", handler.DeleteLogo)
	})

	r.Group(func(ar chi.Router) {
		ar.Use(jwtMiddleware)
		ar.Use(middleware.RequireRole("Super Admin", "Admin"))
		ar.Get("/api/v1/admin/branding/logos", handler.ListLogos)
		ar.Post("/api/v1/admin/branding/logos/upload", handler.UploadLogo)
		ar.Post("/api/v1/admin/branding/logos", handler.CreateLogo)
		ar.Put("/api/v1/admin/branding/logos/{id}", handler.UpdateLogo)
		ar.Delete("/api/v1/admin/branding/logos/{id}", handler.DeleteLogo)
	})
}

func (h *Handler) RegisterRoutes(r chi.Router) {
	RegisterRoutes(r, h, middleware.JWTAuthMiddleware)
}