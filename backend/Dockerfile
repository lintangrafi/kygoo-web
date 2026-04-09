FROM golang:1.24.5-alpine AS builder

RUN apk add --no-cache git ca-certificates

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o main cmd/api/main.go

# -------------------------------------------------
# Stage 2: Runtime (alpine)
# -------------------------------------------------
FROM alpine:latest AS runtime

RUN apk --no-cache add ca-certificates gettext

WORKDIR /app

COPY --from=builder /app/main ./main
COPY --from=builder /app/config ./config
COPY --from=builder /app/migrations ./migrations
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh && mkdir -p /app/uploads

ENV APP_ENV=staging
EXPOSE 8080

ENTRYPOINT ["./docker-entrypoint.sh"]