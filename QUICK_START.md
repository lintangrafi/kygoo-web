# ⚡ Quick Start - Kygoo Web

## 30 detik: Jalankan Aplikasi

### Terminal 1 - Backend (Go)
```bash
cd backend
go mod download
go run ./cmd/api/main.go
```
👉 Backend: `http://localhost:8080`

### Terminal 2 - Frontend (Node.js)
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
👉 Frontend: `http://localhost:3000`

---

## Prerequisites
- ✅ Go 1.21+
- ✅ Node.js 18+
- ✅ PostgreSQL atau Neon (database)

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your_secret_key
PORT=8080
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## Common Commands

| Perintah | Fungsi |
|----------|--------|
| `go run ./cmd/api/main.go` | Jalankan backend |
| `npm run dev` | Jalankan frontend dev |
| `npm run build` | Build frontend production |
| `npm run type-check` | Check TypeScript errors |
| `npm run lint` | Format & lint code |

---

## Troubleshooting Cepat

| Error | Command |
|-------|---------|
| Port already in use | `npm run dev -- -p 3001` |
| Module not found | `npm install --legacy-peer-deps` |
| Type errors | `npm run type-check` |
| Database error | Cek DATABASE_URL |

---

📖 **Panduan lengkap**: Buka `PANDUAN_MENJALANKAN.md`
