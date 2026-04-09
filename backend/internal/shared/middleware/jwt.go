package middleware

import (
	"net/http"

	pkgmiddleware "github.com/base-go/backend/pkg/middleware"
)

// JWTMiddleware keeps backward compatibility with older handler imports.
func JWTMiddleware(next http.Handler) http.Handler {
	return pkgmiddleware.JWTAuthMiddleware(next)
}
