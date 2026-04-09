# 🚀 Panduan Menjalankan Kygoo Web

> **Tanggal**: 28 Maret 2026  
> **Status**: Siap Dijalankan (Frontend 100%, Backend Infrastructure)

---

## 📋 Daftar Isi
1. [Prerequisites](#prerequisites)
2. [Setup Backend](#setup-backend)
3. [Setup Frontend](#setup-frontend)
4. [Menjalankan Aplikasi](#menjalankan-aplikasi)
5. [Docker Setup](#docker-setup)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Requirements yang Harus Diinstall

#### Backend (Go)
- **Go** 1.21 atau lebih baru ([Download](https://golang.org/dl))
- **PostgreSQL** atau **Neon** Database ([Neon.tech](https://neon.tech))
- **Git**

#### Frontend (Node.js)
- **Node.js** 18 atau lebih baru ([Download](https://nodejs.org))
- **npm** atau **yarn** (sudah termasuk dengan Node.js)

**Verifikasi instalasi:**
```bash
go version          # Go version: go1.21.x
node --version      # v18.x.x atau lebih
npm --version       # 9.x.x atau lebih
```

---

## Setup Backend

### Step 1: Navigasi ke Folder Backend

```bash
cd d:\Project\kygoo-web\backend
```

### Step 2: Download Dependencies

```bash
go mod download
```

### Step 3: Setup Environment Variables

```bash
# Buat file .env di folder backend (jika belum ada)
# Isi dengan konfigurasi database:

DATABASE_URL=postgresql://user:password@host/dbname
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=kygoo
JWT_SECRET=your_super_secret_jwt_key_here
PORT=8080
ENVIRONMENT=development
LOG_LEVEL=debug
```

**Jika menggunakan Neon:**
```
DATABASE_URL=postgresql://user:password@ep-xxxxx.us-east-1.neon.tech/neondb
```

### Step 4: Jalankan Database Migrations

```bash
# Navigasi ke folder cmd/api
cd cmd/api

# Jalankan aplikasi untuk setup database
go run main.go migrate

# Atau dari folder backend:
go run ./cmd/api/main.go migrate
```

### Step 5: Jalankan Backend Server

```bash
# Dari folder backend/cmd/api
go run main.go

# Atau dari folder backend:
go run ./cmd/api/main.go server
```

**Output yang diharapkan:**
```
Starting API server on :8080
Database connected successfully
Server running at http://localhost:8080
```

✅ **Backend siap di**: `http://localhost:8080`

---

## Setup Frontend

### Step 1: Navigasi ke Folder Frontend

```bash
cd d:\Project\kygoo-web\frontend
```

### Step 2: Install Dependencies

```bash
# Install semua packages
npm install --legacy-peer-deps
```

**Hal yang akan diinstall:**
- Next.js 16.1.3
- React 19.2.3
- TypeScript
- Framer Motion
- Emotion (styling)
- Radix UI Components
- Dan 300+ dependencies lainnya

### Step 3: Setup Environment Variables

```bash
# Buat file .env.local di folder frontend
# Isi dengan:

NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_APP_NAME=Kygoo
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Lokasi file:**
```
frontend/
├── .env.local           (← Buat di sini)
├── package.json
└── ...
```

### Step 4: Verifikasi TypeScript (Optional tapi Recommended)

```bash
npm run type-check

# Output yang diharapkan:
# > gns@0.1.0 type-check
# > tsc --noEmit
# (tidak ada error, langsung selesai)
```

### Step 5: Jalankan Development Server

```bash
npm run dev

# Output yang diharapkan:
# > gns@0.1.0 dev
# > next dev
# 
# ▲ Next.js 16.1.3
# - Local:        http://localhost:3000
# - Environments: .env.local
```

✅ **Frontend siap di**: `http://localhost:3000`

---

## Menjalankan Aplikasi (Full Stack)

### Setup Paralel (Recommended)

Buka **2 terminal** terpisah:

**Terminal 1 - Backend:**
```bash
cd d:\Project\kygoo-web\backend
go run ./cmd/api/main.go
# Berjalan di http://localhost:8080
```

**Terminal 2 - Frontend:**
```bash
cd d:\Project\kygoo-web\frontend
npm run dev
# Berjalan di http://localhost:3000
```

### Akses Aplikasi

| Komponen | URL | Deskripsi |
|----------|-----|-----------|
| **Frontend Web** | http://localhost:3000 | User interface aplikasi |
| **Backend API** | http://localhost:8080 | REST API endpoints |
| **API Docs** | http://localhost:8080/docs | Swagger documentation (jika ada) |

---

## Docker Setup (Advanced)

### Menggunakan Docker Compose

```bash
# Dari folder root project
cd d:\Project\kygoo-web

# Build dan jalankan backend dengan Docker
cd backend
docker-compose -f docker-compose.dev.yaml up

# Di terminal/terminal baru, jalankan frontend
cd ../frontend
npm run dev
```

### Docker Commands

```bash
# Start services
docker-compose -f docker-compose.dev.yaml up

# Stop services
docker-compose -f docker-compose.dev.yaml down

# View logs
docker-compose -f docker-compose.dev.yaml logs -f

# Rebuild container
docker-compose -f docker-compose.dev.yaml up --build
```

---

## Build untuk Production

### Frontend Build

```bash
cd frontend

# Generate production build
npm run build

# Jalankan production server
npm run start
```

### Backend Build

```bash
cd backend

# Build binary
go build -o api ./cmd/api

# Jalankan binary
./api

# Atau gunakan Makefile jika ada:
make build
make run
```

---

## Troubleshooting

### 🔴 Error: "Port 8080 already in use"

**Solusi:**

```bash
# Cari proses yang menggunakan port 8080
netstat -ano | findstr :8080

# Kill process (ganti PID dengan nomor yang muncul)
taskkill /PID 12345 /F

# Atau gunakan PORT berbeda
$env:PORT=8081
go run ./cmd/api/main.go
```

### 🔴 Error: "Port 3000 already in use"

**Solusi:**

```bash
# Gunakan port berbeda
npm run dev -- -p 3001

# Maka aplikasi akan berjalan di http://localhost:3001
```

### 🔴 Error: "Cannot connect to database"

**Pengecekan:**

```bash
# 1. Verifikasi DATABASE_URL di .env backend
cat .env

# 2. Test koneksi dengan psql
psql $DATABASE_URL -c "\dt"

# 3. Jika Neon, pastikan connection string benar
# Format: postgresql://user:password@host/dbname
```

### 🔴 Error: "Module not found" atau Import errors

**Solusi:**

```bash
cd frontend

# Clean install
rm -r node_modules package-lock.json
npm install --legacy-peer-deps

# Clear Next.js cache
rm -r .next

# Run type-check
npm run type-check
```

### 🔴 Error: TypeScript Compilation Error

**Solusi:**

```bash
cd frontend

# Check errors
npm run type-check

# Fix formatting
npm run lint -- --fix

# Rebuild
npm run build
```

### 🔴 Database Migration Failed

**Solusi:**

```bash
cd backend

# Run migrations dengan verbose
go run ./cmd/api/main.go migrate -v

# Atau manual check database
psql $DATABASE_URL
\dt                    # List semua tables
\d users               # Describe table
```

---

## Quick Start Script

### Windows Batch (.bat)

Buat file `run.bat` di folder root:

```batch
@echo off
echo Starting Kygoo Web...

REM Start backend
echo [1/2] Starting Backend...
cd backend
start cmd /k "go run ./cmd/api/main.go"

REM Start frontend
echo [2/2] Starting Frontend...
cd ..\frontend
start cmd /k "npm run dev"

echo.
echo ✅ Aplikasi dibuka di:
echo   - Frontend: http://localhost:3000
echo   - Backend:  http://localhost:8080
pause
```

**Jalankan:**
```bash
./run.bat
```

### PowerShell Script (.ps1)

Buat file `run.ps1` di folder root:

```powershell
# Start backend in background
Write-Host "Starting Backend..." -ForegroundColor Green
Set-Location backend
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "go run ./cmd/api/main.go"

# Start frontend in background
Write-Host "Starting Frontend..." -ForegroundColor Green
Set-Location ..\frontend
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host "`n✅ Aplikasi siap:" -ForegroundColor Green
Write-Host "   - Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   - Backend:  http://localhost:8080" -ForegroundColor Cyan
```

**Jalankan:**
```powershell
.\run.ps1
```

---

## Struktur Project

```
kygoo-web/
│
├── 📁 backend/
│   ├── cmd/
│   │   └── api/main.go              # Entry point
│   ├── internal/
│   │   ├── auth/                    # Authentication module
│   │   ├── studiocontent/           # Studio API ✅ Complete
│   │   ├── photobooth/              # Photobooth API ⏳ In Progress
│   │   ├── contact/                 # Contact API ⏳ In Progress
│   │   ├── rbac/                    # Role-based access control
│   │   └── shared/models/           # Shared data models
│   ├── migrations/                  # Database schemas
│   ├── Dockerfile                   # Docker configuration
│   ├── docker-compose.dev.yaml      # Docker compose for dev
│   ├── Makefile                     # Build scripts
│   ├── go.mod & go.sum              # Go dependencies
│   └── README.md
│
├── 📁 frontend/
│   ├── app/
│   │   ├── [locale]/                # Multi-language pages
│   │   ├── admin/                   # Admin dashboard
│   │   ├── auth/                    # Authentication pages
│   │   └── contact/, studio/, etc.  # Feature pages
│   ├── src/
│   │   ├── components/              # React components
│   │   ├── services/                # API clients
│   │   ├── contexts/                # React contexts
│   │   ├── lib/                     # Utilities & helpers
│   │   └── styles/                  # Global styles
│   ├── components/ui/               # UI component library
│   ├── public/                      # Static assets
│   ├── package.json                 # Dependencies
│   ├── tsconfig.json                # TypeScript config
│   ├── next.config.ts               # Next.js config
│   └── README.md
│
├── 🐳 docker-compose.yaml           # Production compose
├── 📄 SETUP_GUIDE.md                # Setup documentation
├── 📄 README.md                     # Project overview
└── 📄 PROJECT_STATUS.md             # Implementation status

```

---

## Status Implementasi

| Komponen | Status | Progress |
|----------|--------|----------|
| **Frontend** | ✅ Ready | 100% |
| **Backend Models** | ✅ Complete | 100% |
| **Studio API** | ✅ Complete | 100% |
| **Photobooth API** | ⏳ In Progress | 40% |
| **Contact API** | ⏳ In Progress | 30% |
| **Database Schema** | ✅ Complete | 100% |
| **Authentication** | ⏳ In Progress | 60% |

---

## Resources & Dokumentasi

- **Next.js**: https://nextjs.org/docs
- **Go**: https://golang.org/doc
- **PostgreSQL**: https://www.postgresql.org/docs
- **Neon Database**: https://neon.tech/docs
- **Framer Motion**: https://www.framer.com/motion
- **Radix UI**: https://www.radix-ui.com/docs/primitives/overview/introduction

---

## Support & Questions

📧 Hubungi tim development untuk pertanyaan lebih lanjut.

**Last Updated**: 28 Maret 2026  
**Version**: 1.0.0
