package main

import (
	"net/http"

	"github.com/edzhabs/bookkeeping/internal/utils"
)

// Warn
func (app *application) badRequestResponse(w http.ResponseWriter, r *http.Request, err error) {
	app.logger.Warnw("bad request", "method", r.Method, "path", r.URL.Path, "error", err)

	utils.ErrorJSON(w, http.StatusBadRequest, err.Error())
}

func (app *application) notFoundResponse(w http.ResponseWriter, r *http.Request, err error) {
	app.logger.Warnw("not found error", "method", r.Method, "path", r.URL.Path, "error", err)

	utils.ErrorJSON(w, http.StatusNotFound, "not found")
}

func (app *application) unauthorizedErrorResponse(w http.ResponseWriter, r *http.Request, err error) {
	app.logger.Warnw("unauthorized error", "method", r.Method, "path", r.URL.Path, "error", err)

	utils.ErrorJSON(w, http.StatusUnauthorized, "unauthorized")
}

func (app *application) unauthorizedBasicErrorResponse(w http.ResponseWriter, r *http.Request, err error) {
	app.logger.Warnw("basic unauthorized error", "method", r.Method, "path", r.URL.Path, "error", err)

	w.Header().Set("WWW-Authenticate", `Basic realm="restricted", charset="UTF-8"`)

	utils.ErrorJSON(w, http.StatusUnauthorized, "basic unauthorized")
}

func (app *application) forbiddenResponse(w http.ResponseWriter, r *http.Request) {
	app.logger.Warnw("forbidden", "method", r.Method, "path", r.URL.Path, "error")

	utils.ErrorJSON(w, http.StatusForbidden, "forbidden")
}

func (app *application) rateLimitReachedResponse(w http.ResponseWriter, r *http.Request, retryAfter string) {
	app.logger.Warnw("rate limit exceeded", "method", r.Method, "path", r.URL.Path)

	w.Header().Set("Retry-After", retryAfter)

	utils.ErrorJSON(w, http.StatusTooManyRequests, "rate limit exceeded, retry after: "+retryAfter)
}

// Error
func (app *application) conflictResponse(w http.ResponseWriter, r *http.Request, err error) {
	app.logger.Errorw("conflict error", "method", r.Method, "path", r.URL.Path, "error", err)

	utils.ErrorJSON(w, http.StatusConflict, err.Error())
}

func (app *application) internalServerError(w http.ResponseWriter, r *http.Request, err error) {
	app.logger.Errorw("internal error", "method", r.Method, "path", r.URL.Path, "error", err)

	utils.ErrorJSON(w, http.StatusInternalServerError, "the server encountered a problem")
}
