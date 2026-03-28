package photobooth

import (
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	httputils "github.com/kygoo-web/backend/internal/shared/http"
	"github.com/kygoo-web/backend/internal/shared/middleware"
)

type Handler struct {
	packageService PackageService
	eventService   EventService
}

func NewHandler(packageService PackageService, eventService EventService) *Handler {
	return &Handler{
		packageService: packageService,
		eventService:   eventService,
	}
}

func (h *Handler) RegisterRoutes(router chi.Router) {
	router.Route("/api/v1/photobooth", func(r chi.Router) {
		// Public routes
		r.Get("/packages", h.GetPackages)
		r.Get("/packages/{id}", h.GetPackageByID)
		r.Get("/events", h.GetEvents)
		r.Get("/events/{id}", h.GetEventByID)

		// Admin protected routes
		r.With(middleware.JWTMiddleware).Post("/packages", h.CreatePackage)
		r.With(middleware.JWTMiddleware).Put("/packages/{id}", h.UpdatePackage)
		r.With(middleware.JWTMiddleware).Delete("/packages/{id}", h.DeletePackage)

		r.With(middleware.JWTMiddleware).Post("/events", h.CreateEvent)
		r.With(middleware.JWTMiddleware).Put("/events/{id}", h.UpdateEvent)
		r.With(middleware.JWTMiddleware).Delete("/events/{id}", h.DeleteEvent)

		r.With(middleware.JWTMiddleware).Post("/events/{eventId}/images", h.AddEventImage)
		r.With(middleware.JWTMiddleware).Delete("/events/images/{imageId}", h.RemoveEventImage)
	})
}

// Handlers

// GetPackages godoc
//
//	@Summary		Get all photobooth packages
//	@Description	Get paginated list of photobooth packages
//	@Tags			photobooth/packages
//	@Accept			json
//	@Produce		json
//	@Param			page	query		int	false	"Page number" default(1)
//	@Param			limit	query		int	false	"Items per page" default(10)
//	@Success		200	{object}	PaginatedPackagesResponse
//	@Failure		400	{object}	httputils.ErrorResponse
//	@Failure		500	{object}	httputils.ErrorResponse
//	@Router			/api/v1/photobooth/packages [get]
func (h *Handler) GetPackages(w http.ResponseWriter, r *http.Request) {
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	if page < 1 {
		page = 1
	}

	pageSize, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	if pageSize < 1 {
		pageSize = 10
	}

	resp, err := h.packageService.GetPackages(page, pageSize)
	if err != nil {
		httputils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	httputils.RespondSuccess(w, http.StatusOK, resp)
}

// GetPackageByID godoc
//
//	@Summary		Get package by ID
//	@Description	Get a specific photobooth package by ID
//	@Tags			photobooth/packages
//	@Accept			json
//	@Produce		json
//	@Param			id	path		string	true	"Package ID"
//	@Success		200	{object}	PackageResponse
//	@Failure		400	{object}	httputils.ErrorResponse
//	@Failure		404	{object}	httputils.ErrorResponse
//	@Failure		500	{object}	httputils.ErrorResponse
//	@Router			/api/v1/photobooth/packages/{id} [get]
func (h *Handler) GetPackageByID(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		httputils.RespondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	resp, err := h.packageService.GetPackage(id)
	if err != nil {
		httputils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	httputils.RespondSuccess(w, http.StatusOK, resp)
}

// CreatePackage godoc
//
//	@Summary		Create photobooth package
//	@Description	Create a new photobooth package (admin only)
//	@Tags			photobooth/packages
//	@Accept			json
//	@Produce		json
//	@Security		Bearer
//	@Param			request	body		CreatePackageRequest	true	"Package creation request"
//	@Success		201	{object}	PackageResponse
//	@Failure		400	{object}	httputils.ErrorResponse
//	@Failure		401	{object}	httputils.ErrorResponse
//	@Failure		500	{object}	httputils.ErrorResponse
//	@Router			/api/v1/photobooth/packages [post]
func (h *Handler) CreatePackage(w http.ResponseWriter, r *http.Request) {
	var req CreatePackageRequest
	if err := httputils.DecodeJSON(r.Body, &req); err != nil {
		httputils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	resp, err := h.packageService.CreatePackage(&req)
	if err != nil {
		httputils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	httputils.RespondSuccess(w, http.StatusCreated, resp)
}

// UpdatePackage godoc
//
//	@Summary		Update photobooth package
//	@Description	Update an existing photobooth package (admin only)
//	@Tags			photobooth/packages
//	@Accept			json
//	@Produce		json
//	@Security		Bearer
//	@Param			id		path		string					true	"Package ID"
//	@Param			request	body		UpdatePackageRequest	true	"Package update request"
//	@Success		200	{object}	PackageResponse
//	@Failure		400	{object}	httputils.ErrorResponse
//	@Failure		401	{object}	httputils.ErrorResponse
//	@Failure		404	{object}	httputils.ErrorResponse
//	@Failure		500	{object}	httputils.ErrorResponse
//	@Router			/api/v1/photobooth/packages/{id} [put]
func (h *Handler) UpdatePackage(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		httputils.RespondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	var req UpdatePackageRequest
	if err := httputils.DecodeJSON(r.Body, &req); err != nil {
		httputils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	resp, err := h.packageService.UpdatePackage(id, &req)
	if err != nil {
		httputils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	httputils.RespondSuccess(w, http.StatusOK, resp)
}

// DeletePackage godoc
//
//	@Summary		Delete photobooth package
//	@Description	Delete a photobooth package (admin only, soft delete)
//	@Tags			photobooth/packages
//	@Accept			json
//	@Produce		json
//	@Security		Bearer
//	@Param			id	path		string	true	"Package ID"
//	@Success		204
//	@Failure		400	{object}	httputils.ErrorResponse
//	@Failure		401	{object}	httputils.ErrorResponse
//	@Failure		404	{object}	httputils.ErrorResponse
//	@Failure		500	{object}	httputils.ErrorResponse
//	@Router			/api/v1/photobooth/packages/{id} [delete]
func (h *Handler) DeletePackage(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		httputils.RespondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	if err := h.packageService.DeletePackage(id); err != nil {
		httputils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// GetEvents godoc
//
//	@Summary		Get all photobooth events
//	@Description	Get paginated list of photobooth events
//	@Tags			photobooth/events
//	@Accept			json
//	@Produce		json
//	@Param			page	query		int		false	"Page number" default(1)
//	@Param			limit	query		int		false	"Items per page" default(10)
//	@Param			status	query		string	false	"Filter by status (draft, published)"
//	@Success		200	{object}	PaginatedEventsResponse
//	@Failure		400	{object}	httputils.ErrorResponse
//	@Failure		500	{object}	httputils.ErrorResponse
//	@Router			/api/v1/photobooth/events [get]
func (h *Handler) GetEvents(w http.ResponseWriter, r *http.Request) {
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	if page < 1 {
		page = 1
	}

	pageSize, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	if pageSize < 1 {
		pageSize = 10
	}

	status := r.URL.Query().Get("status")

	resp, err := h.eventService.GetEvents(page, pageSize, status)
	if err != nil {
		httputils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	httputils.RespondSuccess(w, http.StatusOK, resp)
}

// GetEventByID godoc
//
//	@Summary		Get event by ID
//	@Description	Get a specific photobooth event by ID with all images
//	@Tags			photobooth/events
//	@Accept			json
//	@Produce		json
//	@Param			id	path		string	true	"Event ID"
//	@Success		200	{object}	EventResponse
//	@Failure		400	{object}	httputils.ErrorResponse
//	@Failure		404	{object}	httputils.ErrorResponse
//	@Failure		500	{object}	httputils.ErrorResponse
//	@Router			/api/v1/photobooth/events/{id} [get]
func (h *Handler) GetEventByID(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		httputils.RespondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	resp, err := h.eventService.GetEvent(id)
	if err != nil {
		httputils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	httputils.RespondSuccess(w, http.StatusOK, resp)
}

// CreateEvent godoc
//
//	@Summary		Create photobooth event
//	@Description	Create a new photobooth event (admin only)
//	@Tags			photobooth/events
//	@Accept			json
//	@Produce		json
//	@Security		Bearer
//	@Param			request	body		CreateEventRequest	true	"Event creation request"
//	@Success		201	{object}	EventResponse
//	@Failure		400	{object}	httputils.ErrorResponse
//	@Failure		401	{object}	httputils.ErrorResponse
//	@Failure		500	{object}	httputils.ErrorResponse
//	@Router			/api/v1/photobooth/events [post]
func (h *Handler) CreateEvent(w http.ResponseWriter, r *http.Request) {
	var req CreateEventRequest
	if err := httputils.DecodeJSON(r.Body, &req); err != nil {
		httputils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	resp, err := h.eventService.CreateEvent(&req)
	if err != nil {
		httputils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	httputils.RespondSuccess(w, http.StatusCreated, resp)
}

// UpdateEvent godoc
//
//	@Summary		Update photobooth event
//	@Description	Update an existing photobooth event (admin only)
//	@Tags			photobooth/events
//	@Accept			json
//	@Produce		json
//	@Security		Bearer
//	@Param			id		path		string				true	"Event ID"
//	@Param			request	body		UpdateEventRequest	true	"Event update request"
//	@Success		200	{object}	EventResponse
//	@Failure		400	{object}	httputils.ErrorResponse
//	@Failure		401	{object}	httputils.ErrorResponse
//	@Failure		404	{object}	httputils.ErrorResponse
//	@Failure		500	{object}	httputils.ErrorResponse
//	@Router			/api/v1/photobooth/events/{id} [put]
func (h *Handler) UpdateEvent(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		httputils.RespondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	var req UpdateEventRequest
	if err := httputils.DecodeJSON(r.Body, &req); err != nil {
		httputils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	resp, err := h.eventService.UpdateEvent(id, &req)
	if err != nil {
		httputils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	httputils.RespondSuccess(w, http.StatusOK, resp)
}

// DeleteEvent godoc
//
//	@Summary		Delete photobooth event
//	@Description	Delete a photobooth event (admin only, soft delete)
//	@Tags			photobooth/events
//	@Accept			json
//	@Produce		json
//	@Security		Bearer
//	@Param			id	path		string	true	"Event ID"
//	@Success		204
//	@Failure		400	{object}	httputils.ErrorResponse
//	@Failure		401	{object}	httputils.ErrorResponse
//	@Failure		404	{object}	httputils.ErrorResponse
//	@Failure		500	{object}	httputils.ErrorResponse
//	@Router			/api/v1/photobooth/events/{id} [delete]
func (h *Handler) DeleteEvent(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		httputils.RespondError(w, http.StatusBadRequest, "Invalid ID format")
		return
	}

	if err := h.eventService.DeleteEvent(id); err != nil {
		httputils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// AddEventImage godoc
//
//	@Summary		Add image to photobooth event
//	@Description	Add a new image to a photobooth event (admin only)
//	@Tags			photobooth/events/images
//	@Accept			json
//	@Produce		json
//	@Security		Bearer
//	@Param			eventId	path		string					true	"Event ID"
//	@Param			request	body		CreateEventImageRequest	true	"Image creation request"
//	@Success		201	{object}	EventImageResponse
//	@Failure		400	{object}	httputils.ErrorResponse
//	@Failure		401	{object}	httputils.ErrorResponse
//	@Failure		404	{object}	httputils.ErrorResponse
//	@Failure		500	{object}	httputils.ErrorResponse
//	@Router			/api/v1/photobooth/events/{eventId}/images [post]
func (h *Handler) AddEventImage(w http.ResponseWriter, r *http.Request) {
	eventIDStr := chi.URLParam(r, "eventId")
	eventID, err := uuid.Parse(eventIDStr)
	if err != nil {
		httputils.RespondError(w, http.StatusBadRequest, "Invalid event ID format")
		return
	}

	var req CreateEventImageRequest
	if err := httputils.DecodeJSON(r.Body, &req); err != nil {
		httputils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	resp, err := h.eventService.AddEventImage(eventID, &req)
	if err != nil {
		httputils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	httputils.RespondSuccess(w, http.StatusCreated, resp)
}

// RemoveEventImage godoc
//
//	@Summary		Remove image from photobooth event
//	@Description	Remove an image from a photobooth event (admin only, soft delete)
//	@Tags			photobooth/events/images
//	@Accept			json
//	@Produce		json
//	@Security		Bearer
//	@Param			imageId	path		string	true	"Image ID"
//	@Success		204
//	@Failure		400	{object}	httputils.ErrorResponse
//	@Failure		401	{object}	httputils.ErrorResponse
//	@Failure		404	{object}	httputils.ErrorResponse
//	@Failure		500	{object}	httputils.ErrorResponse
//	@Router			/api/v1/photobooth/events/images/{imageId} [delete]
func (h *Handler) RemoveEventImage(w http.ResponseWriter, r *http.Request) {
	imageIDStr := chi.URLParam(r, "imageId")
	imageID, err := uuid.Parse(imageIDStr)
	if err != nil {
		httputils.RespondError(w, http.StatusBadRequest, "Invalid image ID format")
		return
	}

	if err := h.eventService.RemoveEventImage(imageID); err != nil {
		httputils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
