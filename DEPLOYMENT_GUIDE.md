# Deployment Guide

## Quick Start Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Backend API deployed
- [ ] Frontend deployed to Vercel
- [ ] API endpoints verified
- [ ] SSL certificates configured
- [ ] Email service configured
- [ ] Monitoring and logging setup

## Prerequisites

- Node.js 18+
- Go 1.21+
- Docker & Docker Compose
- Git
- Vercel CLI (for frontend)

## Frontend Deployment (Next.js to Vercel)

### 1. Local Setup

```bash
cd frontend
npm install
npm run dev
```

### 2. Vercel Deployment

#### First Time Setup:
```bash
npm install -g vercel
vercel login
vercel link
```

#### Configure Environment Variables in Vercel:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add the following variables for each environment (Production/Preview/Development):

**Production Environment:**
```
NEXT_PUBLIC_API_URL=https://api.kygoo.group/api
NEXT_PUBLIC_APP_URL=https://kygoo.group
```

**Preview/Development:**
```
NEXT_PUBLIC_API_URL=https://api-staging.kygoo.group/api
NEXT_PUBLIC_APP_URL=https://staging.kygoo.group
```

#### Deploy:
```bash
# Automatic via git push to main
git push origin main

# Or manual deploy
vercel --prod
```

### 3. Post-Deployment Verification

```bash
# Check health endpoint
curl https://kygoo.group/api/health

# Verify API connectivity
curl https://kygoo.group/auth/login -X POST

# Check performance
npm run analyze
```

## Backend Deployment (Go API)

### 1. Docker Build & Push

```bash
cd backend

# Build image
docker build -f Dockerfile -t kygoo-api:latest .

# Tag for registry
docker tag kygoo-api:latest ghcr.io/username/kygoo-api:latest

# Push to registry
docker login ghcr.io
docker push ghcr.io/username/kygoo-api:latest
```

### 2. Environment Variables

Create `.env` file in backend root:
```
DB_HOST=postgres.internal
DB_PORT=5432
DB_NAME=kygoo_prod
DB_USER=postgres
DB_PASSWORD=<secure_password>
JWT_SECRET=<secure_secret>
JWT_EXPIRY=24h
CORS_ALLOWED_ORIGINS=https://kygoo.group,https://admin.kygoo.group
```

### 3. Database Migrations

```bash
cd backend

# Apply migrations
go run cmd/api/main.go migrate

# Or using migrate CLI
migrate -path migrations -database "postgres://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?sslmode=require" up
```

### 4. Service Deployment

#### Docker Compose (Local/Staging):
```bash
docker-compose -f docker-compose.dev.yaml up -d
```

#### Production (Cloud):
- **Recommended**: Deploy to cloud services:
  - AWS ECS/EKS
  - Google Cloud Run
  - DigitalOcean App Platform
  - Railway
  - Render

Example Railway deployment:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

## CI/CD Pipeline

### GitHub Actions Workflow

The CI/CD pipeline runs on:
- **Push to main**: Auto-deploys to production
- **Push to develop**: Deploys to staging
- **Pull requests**: Runs tests and linting

### Monitoring Workflow

```
Code Push → GitHub → Run Tests → Build Docker → Push Registry → Deploy
```

### View Logs:
```bash
# GitHub Actions
https://github.com/username/kygoo-web/actions

# Vercel
vercel logs

# Backend (if using Railway)
railway logs
```

## SSL/HTTPS Configuration

### For Vercel (Automatic):
- Vercel automatically provisions SSL via Let's Encrypt
- All connections are HTTPS by default

### For Custom Domain:
1. Add custom domain in Vercel settings
2. Update DNS records
3. SSL is auto-provisioned within 24 hours

### For Backend API:
- Generate Let's Encrypt certificate
- Store in environment
- Or use cloud provider's managed SSL (recommended)

## Monitoring & Logging

### Frontend (Vercel):
- View analytics: https://vercel.com/dashboard
- Error tracking: Integrate Sentry
- Performance: Use Web Vitals

### Backend:
- Logs available via deployment platform
- Set up centralized logging (e.g., DataDog, Papertrail)
- Monitor health endpoint: `/api/health`

## Rollback Procedure

### Frontend (Vercel):
```bash
# View deployment history
vercel ls

# Rollback to previous deployment
vercel rollback
```

### Backend:
```bash
# Docker
docker-compose -f docker-compose.yaml down
docker-compose -f docker-compose.yaml up -d  # with previous image tag

# Or redeploy previous version
git revert <commit-hash>
git push origin main
```

## Performance Optimization

### Frontend:
```bash
# Run analysis
cd frontend
npm run analyze

# Check bundle size
npm run build
```

### Backend:
```bash
# Profile performance
go test -bench=. -benchmem ./...

# Check memory usage
go tool pprof http://localhost:8080/debug/pprof/heap
```

## Security Checklist

- [ ] Change default credentials
- [ ] Enable 2FA on all accounts
- [ ] Rotate JWT secrets monthly
- [ ] Use strong database passwords
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable HTTPS everywhere
- [ ] Run security audit: `npm audit`
- [ ] Scan dependencies: `go list -m all | nancy sleuth`

## Troubleshooting

### Frontend Won't Deploy
```bash
# Clear cache and retry
vercel --prod

# Check environment variable
vercel env list

# View build logs
vercel logs --follow
```

### Backend Connection Issues
```bash
# Test API
curl https://api.kygoo.group/api/health

# Check database connection
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1"
```

### Database Migration Errors
```bash
# Check migration status
migrate -path migrations -database "postgres://..." version

# Rollback
migrate -path migrations -database "postgres://..." down 1

# Rerun migration
migrate -path migrations -database "postgres://..." up
```

## Support & Escalation

- **Technical Issues**: Check logs first, then GitHub Issues
- **Deployment Issues**: Contact platform support
- **Security Issues**: Follow responsible disclosure policy
- **Performance Issues**: Run diagnostics and monitor dashboards

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Go Deployment Best Practices](https://golang.org/doc/effective_go)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
