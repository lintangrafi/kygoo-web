package container

import (
	"github.com/go-chi/chi/v5"
	"go.uber.org/dig"
	"gorm.io/gorm"

	"github.com/base-go/backend/internal/auth"
	"github.com/base-go/backend/internal/sitebranding"
	"github.com/base-go/backend/internal/branding"
	"github.com/base-go/backend/internal/businessproject"
	"github.com/base-go/backend/internal/contact"
	"github.com/base-go/backend/internal/pricing"
	"github.com/base-go/backend/internal/rbac"
	"github.com/base-go/backend/internal/studiocontent"
	"github.com/base-go/backend/pkg/cache"
	"github.com/base-go/backend/pkg/database"
	"github.com/base-go/backend/pkg/router"
	"github.com/base-go/backend/pkg/server"
)

func New() (*dig.Container, error) {
	// we use go.uber.org/dig for autowire dependencies
	container := dig.New()

	// provide dependencies injection

	if err := container.Provide(cache.NewCache); err != nil {
		return nil, err
	}

	// database
	if err := container.Provide(database.NewDatabase); err != nil {
		return nil, err
	}

	if err := container.Provide(ProvideGormDB); err != nil {
		return nil, err
	}

	// auth module
	if err := container.Provide(auth.NewRepository); err != nil {
		return nil, err
	}

	if err := container.Provide(auth.NewService); err != nil {
		return nil, err
	}

	if err := container.Provide(auth.NewHandler); err != nil {
		return nil, err
	}

	// rbac module
	if err := container.Provide(rbac.NewRepository); err != nil {
		return nil, err
	}

	if err := container.Provide(rbac.NewService); err != nil {
		return nil, err
	}

	if err := container.Provide(rbac.NewHandler); err != nil {
		return nil, err
	}

	// studio content module
	if err := container.Provide(studiocontent.NewThemeRepository); err != nil {
		return nil, err
	}

	if err := container.Provide(studiocontent.NewTemplateRepository); err != nil {
		return nil, err
	}

	if err := container.Provide(studiocontent.NewThemeService); err != nil {
		return nil, err
	}

	if err := container.Provide(studiocontent.NewTemplateService); err != nil {
		return nil, err
	}

	if err := container.Provide(studiocontent.NewHandler); err != nil {
		return nil, err
	}

	// branding module
	if err := container.Provide(branding.NewRepository); err != nil {
		return nil, err
	}

	if err := container.Provide(branding.NewService); err != nil {
		return nil, err
	}

	if err := container.Provide(branding.NewHandler); err != nil {
		return nil, err
	}

	// site branding module
	if err := container.Provide(sitebranding.NewRepository); err != nil {
		return nil, err
	}

	if err := container.Provide(sitebranding.NewService); err != nil {
		return nil, err
	}

	if err := container.Provide(sitebranding.NewHandler); err != nil {
		return nil, err
	}

	// pricing module
	if err := container.Provide(pricing.NewRepository); err != nil {
		return nil, err
	}

	if err := container.Provide(pricing.NewService); err != nil {
		return nil, err
	}

	if err := container.Provide(pricing.NewHandler); err != nil {
		return nil, err
	}

	// contact module
	if err := container.Provide(contact.NewRepository); err != nil {
		return nil, err
	}

	if err := container.Provide(contact.NewService); err != nil {
		return nil, err
	}

	if err := container.Provide(contact.NewHandler); err != nil {
		return nil, err
	}

	// business project module
	if err := container.Provide(businessproject.NewRepository); err != nil {
		return nil, err
	}

	if err := container.Provide(businessproject.NewService); err != nil {
		return nil, err
	}

	if err := container.Provide(businessproject.NewHandler); err != nil {
		return nil, err
	}

	// other domain

	// end

	if err := container.Provide(router.SetupRoutes); err != nil {
		return nil, err
	}

	if err := container.Provide(ProvideHttpServer); err != nil {
		return nil, err
	}

	return container, nil
}

func ProvideHttpServer(mux *chi.Mux) (server.Server, error) {
	svr := server.New()
	svr.WithRoute(mux)
	return svr, nil
}

func ProvideGormDB(db database.Database) *gorm.DB {
	return db.GetDB()
}
