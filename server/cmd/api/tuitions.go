package main

import (
	"net/http"

	"github.com/edzhabs/bookkeeping/internal/utils"
)

func (app *application) getTuitionsHandler(w http.ResponseWriter, r *http.Request) {
	tuitions, err := app.store.Tuitions.GetAll(r.Context())
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if err := utils.ResponseJSON(w, http.StatusOK, tuitions); err != nil {
		app.internalServerError(w, r, err)
		return
	}
}
