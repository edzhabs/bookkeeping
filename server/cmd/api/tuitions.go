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

func (app *application) getTuitionHandler(w http.ResponseWriter, r *http.Request) {
	tuitionID := app.getEnrollmentIDFromCtx(r)

	tuition, err := app.store.Tuitions.GetTuitionByID(r.Context(), tuitionID)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if err := utils.ResponseJSON(w, http.StatusOK, tuition); err != nil {
		app.internalServerError(w, r, err)
		return
	}
}
