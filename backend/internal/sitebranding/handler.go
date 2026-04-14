package sitebranding

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

	dir := filepath.Join("uploads", "branding", "site")
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

	relativePath := filepath.Join("branding", "site", storedName)
	return publicFileURL(r, relativePath), nil
}

func (h *Handler) GetCurrent(w http.ResponseWriter, r *http.Request) {
	branding, err := h.service.GetCurrent()
	if err != nil {
		response.ResponseError(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusOK, response.JSON{Status: true, Message: "success", Data: branding})
}

func (h *Handler) UpdateCurrent(w http.ResponseWriter, r *http.Request) {
	var req UpdateSiteBrandingRequest
	if err := httputils.DecodeJSON(r.Body, &req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := validator.Validate(req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	branding, err := h.service.Update(&req)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusOK, response.JSON{Status: true, Message: "site branding updated", Data: branding})
}

func (h *Handler) UploadLogo(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(12 << 20); err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid multipart form")
		return
	}

	fileHeader, _, err := r.FormFile("file")
	if err == nil && fileHeader != nil {
		_ = fileHeader.Close()
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
	r.Get("/api/v1/site-branding", handler.GetCurrent)
	r.Group(func(ar chi.Router) {
		ar.Use(jwtMiddleware)
		ar.Use(middleware.RequireRole("Super Admin", "Admin"))
		ar.Put("/api/v1/site-branding", handler.UpdateCurrent)
		ar.Post("/api/v1/site-branding/upload-logo", handler.UploadLogo)
	})
	r.Group(func(ar chi.Router) {
		ar.Use(jwtMiddleware)
		ar.Use(middleware.RequireRole("Super Admin", "Admin"))
		ar.Get("/api/v1/admin/site-branding", handler.GetCurrent)
		ar.Put("/api/v1/admin/site-branding", handler.UpdateCurrent)
		ar.Post("/api/v1/admin/site-branding/upload-logo", handler.UploadLogo)
	})
}

func (h *Handler) RegisterRoutes(r chi.Router) {
	RegisterRoutes(r, h, middleware.JWTAuthMiddleware)
}