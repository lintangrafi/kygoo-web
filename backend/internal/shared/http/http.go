package http

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/base-go/backend/pkg/response"
)

// DecodeJSON decodes JSON request body into destination struct.
func DecodeJSON(body io.Reader, dst interface{}) error {
	decoder := json.NewDecoder(body)
	decoder.DisallowUnknownFields()
	return decoder.Decode(dst)
}

// RespondError writes a standardized error JSON response.
func RespondError(w http.ResponseWriter, statusCode int, message string) {
	response.ResponseError(w, statusCode, message)
}

// RespondSuccess writes a JSON success response payload.
func RespondSuccess(w http.ResponseWriter, statusCode int, data interface{}) {
	response.ResponseJSON(w, statusCode, data)
}
