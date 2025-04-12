package main

import (
	"net/http"

	"github.com/edzhabs/bookkeeping/internal/utils"
)

func (app *application) healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	data := map[string]string{
		"status":  "ok",
		"env":     app.config.env,
		"version": version,
	}

	if err := utils.ResponseJSON(w, http.StatusOK, data); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}
}
