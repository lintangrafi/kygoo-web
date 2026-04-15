package businessproject

import (
	"fmt"
	"io"
	"mime/multipart"
	"net"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	httputils "github.com/base-go/backend/internal/shared/http"
	"github.com/base-go/backend/pkg/middleware"
	"github.com/base-go/backend/pkg/response"
	"github.com/base-go/backend/pkg/validator"
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

func publicBaseURL(r *http.Request) string {
	scheme := "http"
	if r.TLS != nil {
		scheme = "https"
	}
	if forwardedProto := r.Header.Get("X-Forwarded-Proto"); forwardedProto != "" {
		scheme = forwardedProto
	}
	host := strings.TrimSpace(r.Header.Get("X-Forwarded-Host"))
	if host == "" {
		host = r.Host
	}
	return fmt.Sprintf("%s://%s", scheme, host)
}

func normalizeUploadsPath(path string) string {
	if path == "" {
		return ""
	}
	normalized := strings.ReplaceAll(path, "\\", "/")
	if idx := strings.Index(normalized, "/uploads/"); idx >= 0 {
		return normalized[idx:]
	}
	if strings.HasPrefix(normalized, "uploads/") {
		return "/" + normalized
	}
	return normalized
}

func normalizeProjectFileURL(r *http.Request, rawURL string) string {
	rawURL = strings.TrimSpace(rawURL)
	if rawURL == "" {
		return rawURL
	}

	normalizedPath := normalizeUploadsPath(rawURL)
	if strings.HasPrefix(normalizedPath, "/uploads/") {
		return publicBaseURL(r) + normalizedPath
	}

	parsed, err := url.Parse(rawURL)
	if err != nil {
		return rawURL
	}
	if parsed == nil {
		return rawURL
	}

	if parsed.IsAbs() || parsed.Host != "" {
		path := normalizeUploadsPath(parsed.Path)
		if strings.HasPrefix(path, "/uploads/") {
			if parsed.RawQuery != "" {
				path += "?" + parsed.RawQuery
			}
			return publicBaseURL(r) + path
		}
		return rawURL
	}

	if strings.HasPrefix(parsed.Path, "business-projects/") {
		return publicFileURL(r, parsed.Path)
	}

	if parsed.Path == "" && parsed.Opaque != "" {
		host, path, splitErr := net.SplitHostPort(parsed.Opaque)
		if splitErr == nil && host != "" {
			normalized := normalizeUploadsPath(path)
			if strings.HasPrefix(normalized, "/uploads/") {
				return publicBaseURL(r) + normalized
			}
		}
	}

	return rawURL
}

func normalizeProjectMediaURLs(r *http.Request, project *ProjectResponse) {
	if project == nil {
		return
	}
	for i := range project.Gallery {
		project.Gallery[i].FileURL = normalizeProjectFileURL(r, project.Gallery[i].FileURL)
	}
}

func normalizeProjectMediaURLsList(r *http.Request, projects []ProjectResponse) {
	for i := range projects {
		normalizeProjectMediaURLs(r, &projects[i])
	}
}

func saveGalleryFile(r *http.Request, projectID uuid.UUID, fileHeader *multipart.FileHeader) (string, string, error) {
	if fileHeader == nil {
		return "", "", fmt.Errorf("file is required")
	}

	if fileHeader.Size > (10 * 1024 * 1024) {
		return "", "", fmt.Errorf("file %s exceeds 10MB", fileHeader.Filename)
	}

	ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
	allowedExt := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".webp": true,
		".gif":  true,
		".mp4":  true,
	}
	if !allowedExt[ext] {
		return "", "", fmt.Errorf("unsupported file extension for %s", fileHeader.Filename)
	}

	file, err := fileHeader.Open()
	if err != nil {
		return "", "", err
	}
	defer file.Close()

	dir := filepath.Join("uploads", "business-projects", projectID.String())
	if err := os.MkdirAll(dir, 0755); err != nil {
		return "", "", err
	}

	storedName := fmt.Sprintf("%s%s", uuid.NewString(), ext)
	absPath := filepath.Join(dir, storedName)

	destination, err := os.Create(absPath)
	if err != nil {
		return "", "", err
	}
	defer destination.Close()

	if _, err := io.Copy(destination, file); err != nil {
		return "", "", err
	}

	relativePath := filepath.Join("business-projects", projectID.String(), storedName)
	return publicFileURL(r, relativePath), fileHeader.Filename, nil
}

// Public endpoint
func (h *Handler) GetProjectsByBusinessLine(w http.ResponseWriter, r *http.Request) {
	line := r.URL.Query().Get("business_line")
	if line == "" {
		response.ResponseError(w, http.StatusBadRequest, "business_line is required")
		return
	}

	projects, err := h.service.GetByBusinessLine(line, false)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	normalizeProjectMediaURLsList(r, projects)

	response.ResponseJSON(w, http.StatusOK, response.JSON{Status: true, Message: "success", Data: projects})
}

func (h *Handler) GetProjectByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	projectID, err := uuid.Parse(id)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid project ID")
		return
	}

	project, err := h.service.GetByID(projectID, false)
	if err != nil {
		response.ResponseError(w, http.StatusNotFound, err.Error())
		return
	}

	normalizeProjectMediaURLs(r, project)

	response.ResponseJSON(w, http.StatusOK, response.JSON{Status: true, Message: "success", Data: project})
}

// Admin endpoint
func (h *Handler) GetAllProjects(w http.ResponseWriter, r *http.Request) {
	includeInactive := r.URL.Query().Get("include_inactive") == "true"

	projects, err := h.service.GetAll(includeInactive)
	if err != nil {
		response.ResponseError(w, http.StatusInternalServerError, err.Error())
		return
	}

	normalizeProjectMediaURLsList(r, projects)

	response.ResponseJSON(w, http.StatusOK, response.JSON{Status: true, Message: "success", Data: projects})
}

func (h *Handler) CreateProject(w http.ResponseWriter, r *http.Request) {
	var req CreateProjectRequest
	if err := httputils.DecodeJSON(r.Body, &req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := validator.Validate(req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	project, err := h.service.Create(&req, getActorFromRequest(r))
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	normalizeProjectMediaURLs(r, project)

	response.ResponseJSON(w, http.StatusCreated, response.JSON{Status: true, Message: "project created", Data: project})
}

func (h *Handler) UpdateProject(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	projectID, err := uuid.Parse(id)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid project ID")
		return
	}

	var req UpdateProjectRequest
	if err := httputils.DecodeJSON(r.Body, &req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := validator.Validate(req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	project, err := h.service.Update(projectID, &req, getActorFromRequest(r))
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	normalizeProjectMediaURLs(r, project)

	response.ResponseJSON(w, http.StatusOK, response.JSON{Status: true, Message: "project updated", Data: project})
}

func (h *Handler) DeleteProject(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	projectID, err := uuid.Parse(id)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid project ID")
		return
	}

	if err := h.service.Delete(projectID, getActorFromRequest(r)); err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusOK, response.JSON{Status: true, Message: "project deleted"})
}

func (h *Handler) GetAuditLogs(w http.ResponseWriter, r *http.Request) {
	var projectID *uuid.UUID
	if id := r.URL.Query().Get("project_id"); id != "" {
		parsed, err := uuid.Parse(id)
		if err != nil {
			response.ResponseError(w, http.StatusBadRequest, "Invalid project ID")
			return
		}
		projectID = &parsed
	}

	limit := 50
	if raw := r.URL.Query().Get("limit"); raw != "" {
		if parsed, err := strconv.Atoi(raw); err == nil {
			limit = parsed
		}
	}

	logs, err := h.service.GetAuditLogs(projectID, limit)
	if err != nil {
		response.ResponseError(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusOK, response.JSON{Status: true, Message: "success", Data: logs})
}

func (h *Handler) UploadProjectGallery(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	projectID, err := uuid.Parse(id)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid project ID")
		return
	}

	if err := r.ParseMultipartForm(32 << 20); err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid multipart form")
		return
	}

	fileHeaders := r.MultipartForm.File["files"]
	if len(fileHeaders) == 0 {
		response.ResponseError(w, http.StatusBadRequest, "files is required")
		return
	}

	uploads := make([]GalleryUploadItem, 0, len(fileHeaders))
	for i := range fileHeaders {
		fileURL, fileName, saveErr := saveGalleryFile(r, projectID, fileHeaders[i])
		if saveErr != nil {
			response.ResponseError(w, http.StatusBadRequest, saveErr.Error())
			return
		}

		uploads = append(uploads, GalleryUploadItem{
			FileURL:   fileURL,
			FileName:  fileName,
			SortOrder: i,
		})
	}

	items, err := h.service.AddGalleryItems(projectID, uploads)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusCreated, response.JSON{Status: true, Message: "gallery uploaded", Data: items})
}

func (h *Handler) DeleteProjectGalleryItem(w http.ResponseWriter, r *http.Request) {
	projectIDRaw := chi.URLParam(r, "id")
	mediaIDRaw := chi.URLParam(r, "mediaId")

	projectID, err := uuid.Parse(projectIDRaw)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid project ID")
		return
	}

	mediaID, err := uuid.Parse(mediaIDRaw)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid media ID")
		return
	}

	if err := h.service.DeleteGalleryItem(projectID, mediaID); err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusOK, response.JSON{Status: true, Message: "gallery item deleted"})
}

type updateGallerySortRequest struct {
	SortOrder int `json:"sort_order"`
}

func (h *Handler) UpdateProjectGallerySort(w http.ResponseWriter, r *http.Request) {
	projectIDRaw := chi.URLParam(r, "id")
	mediaIDRaw := chi.URLParam(r, "mediaId")

	projectID, err := uuid.Parse(projectIDRaw)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid project ID")
		return
	}

	mediaID, err := uuid.Parse(mediaIDRaw)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid media ID")
		return
	}

	var req updateGallerySortRequest
	if err := httputils.DecodeJSON(r.Body, &req); err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := h.service.UpdateGalleryItemSort(projectID, mediaID, req.SortOrder); err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusOK, response.JSON{Status: true, Message: "gallery sort updated"})
}

func (h *Handler) SetProjectGalleryCover(w http.ResponseWriter, r *http.Request) {
	projectIDRaw := chi.URLParam(r, "id")
	mediaIDRaw := chi.URLParam(r, "mediaId")

	projectID, err := uuid.Parse(projectIDRaw)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid project ID")
		return
	}

	mediaID, err := uuid.Parse(mediaIDRaw)
	if err != nil {
		response.ResponseError(w, http.StatusBadRequest, "Invalid media ID")
		return
	}

	if err := h.service.SetGalleryCover(projectID, mediaID); err != nil {
		response.ResponseError(w, http.StatusBadRequest, err.Error())
		return
	}

	response.ResponseJSON(w, http.StatusOK, response.JSON{Status: true, Message: "gallery cover updated"})
}

func RegisterRoutes(r chi.Router, handler *Handler, jwtMiddleware func(next http.Handler) http.Handler) {
	r.Get("/api/v1/business-projects", handler.GetProjectsByBusinessLine)
	r.Get("/api/v1/business-projects/{id}", handler.GetProjectByID)

	r.Group(func(ar chi.Router) {
		ar.Use(jwtMiddleware)
		ar.Use(middleware.RequireRole("Super Admin", "Admin"))
		ar.Get("/api/v1/admin/business-projects", handler.GetAllProjects)
		ar.Post("/api/v1/admin/business-projects", handler.CreateProject)
		ar.Put("/api/v1/admin/business-projects/{id}", handler.UpdateProject)
		ar.Delete("/api/v1/admin/business-projects/{id}", handler.DeleteProject)
		ar.Post("/api/v1/admin/business-projects/{id}/gallery", handler.UploadProjectGallery)
		ar.Delete("/api/v1/admin/business-projects/{id}/gallery/{mediaId}", handler.DeleteProjectGalleryItem)
		ar.Put("/api/v1/admin/business-projects/{id}/gallery/{mediaId}/sort", handler.UpdateProjectGallerySort)
		ar.Put("/api/v1/admin/business-projects/{id}/gallery/{mediaId}/cover", handler.SetProjectGalleryCover)
		ar.Get("/api/v1/admin/business-projects/audit-logs", handler.GetAuditLogs)
	})
}

func (h *Handler) RegisterRoutes(r chi.Router) {
	RegisterRoutes(r, h, middleware.JWTAuthMiddleware)
}
