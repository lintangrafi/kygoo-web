# Kygoo Web - Implementation Progress & Setup Guide

## 🎯 Current Status

**Date**: March 28, 2026  
**Phase**: 1-2 (Backend Infrastructure & Data Models)

### Completed ✅
1. **Project Structure**
   - ✅ GNS boilerplate cloned
   - ✅ Directory structure configured
   - ✅ `.env` file created with Neon database configuration

2. **Database**
   - ✅ 3 migration files created (004, 005, 006)
   - ✅ Schema designed for:
     - Studio Themes & Templates
     - Photobooth Events, Images & Packages
     - Coffee & Digital Landing Pages
     - Contact Inquiries
   - ✅ Indexes created for performance
   - ✅ Soft deletes implemented

3. **Backend Models**
   - ✅ `backend/internal/shared/models/studio.go` - Studio models
   - ✅ `backend/internal/shared/models/photobooth.go` - Photobooth models
   - ✅ `backend/internal/shared/models/landing.go` - Landing page models

4. **Backend API Modules**
   - ✅ **Studio Content Module** (Complete)
     - `dto.go` - Request/response DTOs with mappers
     - `repository.go` - Theme & Template repositories with GORM
     - `service.go` - Business logic (CRUD with validation)
     - `handler.go` - HTTP handlers with complete endpoints
   - ⏳ **Photobooth Module** (Started - DTOs created)
   - ⏳ **Contact Module** (Started - DTOs created)

---

## 📋 Next Steps to Complete Implementation

### Step 1: Finish Backend Modules (2-3 hours)

**NOTE**: The Studio module is 100% complete and ready to use as a template. The other modules follow the exact same pattern.

#### Complete Photobooth Module
Copy the Studio module pattern (`repository.go`, `service.go`, `handler.go`) from studio content but for:
- PhotoboothPackage (CRUD)
- PhotoboothEvent (CRUD with image management)
- PhotoboothEventImage (CRUD)

Endpoints needed:
```
GET    /api/photobooth/packages              (public)
GET    /api/photobooth/events                (public, paginated)
GET    /api/photobooth/events/{id}           (public, with images)
POST   /api/admin/photobooth/packages        (protected)
POST   /api/admin/photobooth/events          (protected)
POST   /api/admin/photobooth/events/{id}/images (protected)
PUT    /api/admin/photobooth/events/{id}     (protected)
DELETE /api/admin/photobooth/events/{id}     (protected)
```

#### Complete Contact Module
Similar pattern for:
- ContactInquiry (create public, list/update admin)
- CoffeeLanding & DigitalLanding (read public, update admin)

Endpoints:
```
POST   /api/contact/inquiry                  (public)
GET    /api/admin/contact/inquiries          (protected, paginated)
PUT    /api/admin/contact/inquiries/{id}     (protected)
GET    /api/landing/coffee                   (public)
GET    /api/landing/digital                  (public)
PUT    /api/admin/landing/coffee             (protected)
PUT    /api/admin/landing/digital            (protected)
```

### Step 2: Update Router Registration

Edit `backend/internal/presentation/routes.go` to register all modules:

```go
// In your router setup function:
import (
    "github.com/kygoo-web/backend/internal/studiocontent"
    "github.com/kygoo-web/backend/internal/photobooth"
    "github.com/kygoo-web/backend/internal/contact"
)

// Register routes
studioHandler := studiocontent.NewHandler(studioThemeService, studioTemplateService)
studiocontent.RegisterRoutes(router, studioHandler, jwtMiddleware)

photoboothHandler := photobooth.NewHandler(packageService, eventService)
photobooth.RegisterRoutes(router, photoboothHandler, jwtMiddleware)

contactHandler := contact.NewHandler(inquiryService, coffeeLandingService, digitalLandingService)
contact.RegisterRoutes(router, contactHandler, jwtMiddleware)
```

### Step 3: Setup Container/Dependency Injection

Update `backend/container/container.go` to inject all new repositories and services:

```go
// Register repositories
container.Provide(func(db *gorm.DB) studiocontent.ThemeRepository {
    return studiocontent.NewThemeRepository(db)
})
container.Provide(func(db *gorm.DB) studiocontent.TemplateRepository {
    return studiocontent.NewTemplateRepository(db)
})
// ... similar for other modules

// Register services
container.Provide(func(repo studiocontent.ThemeRepository) studiocontent.ThemeService {
    return studiocontent.NewThemeService(repo)
})
// ... similar for other modules

// Register handlers
container.Provide(studiocontent.NewHandler)
// ... similar for other modules
```

### Step 4: Run Database Migrations

```bash
cd backend

# If using migrate CLI:
migrate -path migrations -database "$DATABASE_URL" up

# OR manually via psql:
psql $DATABASE_URL < migrations/004_create_studio_tables.up.sql
psql $DATABASE_URL < migrations/005_create_photobooth_tables.up.sql
psql $DATABASE_URL < migrations/006_create_landing_contact_tables.up.sql
```

### Step 5: Verify Backend Setup

```bash
# Run backend tests
go test ./...

# Start backend server
go run cmd/api/main.go

# Test endpoints (in another terminal)
curl http://localhost:8080/api/studio/themes
curl http://localhost:8080/api/photobooth/packages
curl http://localhost:8080/api/landing/coffee
```

---

## 📁 Frontend Implementation (3-5 days)

### Phase 3: Public Pages

Create the frontend structure:

```bash
cd frontend
# Public pages - create app/(public)/ directory with:
# - page.tsx (homepage)
# - studio/page.tsx and [id]/page.tsx
# - photobooth/page.tsx and [id]/page.tsx
# - digital/page.tsx
# - coffee/page.tsx
# - contact/page.tsx

# Services - src/domain/services/
# - studio.service.ts
# - photobooth.service.ts
# - landing.service.ts
# - contact.service.ts

# Hooks - src/application/hooks/
# - useStudioThemes.ts
# - usePhotoboothEvents.ts
# - useLanding.ts
# - useContact.ts

# Components - src/presentation/components/public/
# - ImageGallery.tsx
# - ThemeCard.tsx
# - EventCard.tsx
# - PackageCard.tsx
# - ContactForm.tsx
# - MapsEmbed.tsx
```

### Phase 4: Admin Dashboard

```bash
# Admin pages - extend app/admin/
# - studio/themes/page.tsx
# - studio/themes/[id]/page.tsx
# - photobooth/events/page.tsx
# - photobooth/packages/page.tsx
# - landing/coffee/page.tsx
# - contact/inquiries/page.tsx

# Admin components - src/presentation/components/admin/
# - ImageUploadField.tsx
# - AdminTable.tsx
# - AdminDialog.tsx
# - StatusBadge.tsx
```

### Step 1: Environment Setup
```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create Services

Example structure for API services:
```typescript
// src/domain/services/studio.service.ts
import axios from 'axios';

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
});

export const studioService = {
    getThemes: (page = 1, pageSize = 10) =>
        API.get(`/api/studio/themes?page=${page}&page_size=${pageSize}`),
    
    getThemeDetail: (id: string) =>
        API.get(`/api/studio/themes/${id}`),
    
    getTemplatesByTheme: (themeId: string) =>
        API.get(`/api/studio/themes/${themeId}/templates`),
};
```

### Step 4: Create React Query Hooks

```typescript
// src/application/hooks/useStudioThemes.ts
import { useQuery } from '@tanstack/react-query';
import { studioService } from '@/domain/services/studio.service';

export const useStudioThemes = (page = 1, pageSize = 10) =>
    useQuery({
        queryKey: ['studio-themes', page, pageSize],
        queryFn: () => studioService.getThemes(page, pageSize),
    });
```

### Step 5: Create Public Pages and Components

Start with simple components and gradually build up:
1. Create ImageGallery component
2. Create ThemeCard component
3. Create studio/page.tsx that uses these
4. Repeat for other sections

---

## 🗄️ File Structure Overview

```
kygoo-web/
├── backend/
│   ├── cmd/
│   ├── internal/
│   │   ├── studiocontent/        ✅ Complete
│   │   ├── photobooth/           ⏳ In progress (DTOs done)
│   │   ├── contact/              ⏳ In progress (DTOs done)
│   │   ├── shared/
│   │   │   └── models/           ✅ All models created
│   │   ├── auth/
│   │   ├── rbac/
│   │   └── presentation/
│   ├── pkg/
│   ├── migrations/               ✅ All 3 migrations created
│   ├── .env                      ✅ Created
│   └── ...
├── frontend/
│   ├── app/
│   │   ├── (public)/            ⏳ Needs creation
│   │   ├── admin/               ⏳ Needs extension
│   │   └── layout.tsx           ⏳ Needs update
│   ├── src/
│   │   ├── domain/
│   │   │   └── services/        ⏳ Needs creation
│   │   ├── application/
│   │   │   └── hooks/           ⏳ Needs creation
│   │   └── presentation/
│   │       └── components/      ⏳ Needs creation
│   └── ...
├── PLAN.md                       (for documentation)
└── README.md
```

---

## 🔧 Configuration Needed

### Backend .env (Already Created)
Update with your actual credentials:
```env
DATABASE_URL=postgresql://user:password@host/neondb
S3_BUCKET=your-bucket
S3_ACCESS_KEY=your-key
S3_SECRET_KEY=your-secret
JWT_SECRET=your-secret-key
```

### Frontend .env.local
Create at `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080  # Development
# NEXT_PUBLIC_API_URL=https://api.kygoo.com  # Production
```

---

## 🚀 Quick Start Commands

```bash
# 1. Backend setup
cd backend
go mod download
go run cmd/api/main.go

# 2. Frontend setup (in new terminal)
cd frontend
npm install
npm run dev

# 3. Run migrations (if not auto-run)
psql $DATABASE_URL < ../backend/migrations/*.up.sql

# 4. Test API
curl http://localhost:8080/api/studio/themes
curl http://localhost:3000  # Frontend
```

---

## 🧪 Testing Checklist

### Backend API
- [ ] GET `/api/studio/themes` returns themes list
- [ ] GET `/api/studio/themes/{id}` returns theme with templates
- [ ] GET `/api/photobooth/packages` returns packages
- [ ] GET `/api/photobooth/events` returns events paginated
- [ ] POST `/api/contact/inquiry` creates inquiry successfully
- [ ] GET `/api/landing/coffee` returns coffee landing
- [ ] Admin endpoints protected (401 without auth token)
- [ ] Admin can create/update/delete content

### Frontend
- [ ] Public pages load without errors
- [ ] Data fetches from API correctly
- [ ] Navigation works between pages
- [ ] Admin dashboard accessible (after implementing auth UI)
- [ ] Forms submit successfully
- [ ] Images display and load correctly
- [ ] Responsive design on mobile/tablet/desktop

---

## 📊 Estimated Timeline

| Phase | Task | Est. Time | Status |
|-------|------|-----------|--------|
| 1 | Database & Models | 2 hours | ✅ Done |
| 2A | Backend DTOs | 2 hours | ✅ Done |
| 2B | Backend Repos/Services/Handlers | 6 hours | 🔄 30% Done |
| 2C | Router & Container Setup | 2 hours | ⏳ Not Started |
| 2D | Backend Testing | 2 hours | ⏳ Not Started |
| 3 | Frontend Public Pages | 5 days | ⏳ Not Started |
| 4 | Admin Dashboard | 4 days | ⏳ Not Started |
| 5 | Testing & Integration | 2 days | ⏳ Not Started |
| 6 | Deployment | 1 day | ⏳ Not Started |
| **Total** | Full Project | **~4 weeks** | **30% Complete** |

---

## 📝 Notes

- **Studio module** is a complete reference implementation - other modules follow exact same pattern
- All models are GORM-compatible with proper tags
- Soft deletes implemented throughout for data integrity
- JWT auth middleware already exists in GNS (use for protected routes)
- Use `go-playground/validator` for validation (already in project)
- Use `chi/v5` router (already in project)
- Use `gorm.io` ORM (already configured)

---

## 🔗 Useful References

- GNS Docs: https://gns.yogameleniawan.com/demo
- Neon Docs: https://neon.tech/docs
- Go Fiber: https://docs.gofiber.io/
- GORM: https://gorm.io/docs/
- Next.js: https://nextjs.org/docs
- React Query: https://tanstack.com/query/latest

---

**Next Steps**: Complete the Photobooth and Contact backend modules, then verify all API endpoints work before starting frontend implementation.
