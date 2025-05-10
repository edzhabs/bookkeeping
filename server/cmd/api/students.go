package main

import (
	"net/http"
	"strings"
	"time"

	"github.com/edzhabs/bookkeeping/internal/models"
	"github.com/edzhabs/bookkeeping/internal/store"
	"github.com/edzhabs/bookkeeping/internal/utils"
)

type studentKey string

const (
	studentCtx studentKey = "student"
	dateLayout string     = "2006-01-02"
)

func (app *application) createStudentHandler(w http.ResponseWriter, r *http.Request) {
	var payload Student

	if err := utils.ReadJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}
	if err := utils.Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	birthdate, err := time.Parse(dateLayout, payload.Birthdate)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	// TODO: auth to add user log to know who created this

	student := &models.Student{
		FirstName:       strings.ToUpper(payload.FirstName),
		MiddleName:      strings.ToUpper(payload.MiddleName),
		LastName:        strings.ToUpper(payload.LastName),
		Suffix:          payload.Suffix,
		Gender:          strings.ToLower(payload.Gender),
		Birthdate:       birthdate,
		Address:         payload.Address,
		MotherName:      payload.MotherName,
		MotherJob:       payload.MotherJob,
		MotherEducation: payload.MotherEducation,
		FatherName:      payload.FatherName,
		FatherJob:       payload.FatherJob,
		FatherEducation: payload.FatherEducation,
		ContactNumbers:  payload.ContactNumbers,
		LivingWith:      payload.LivingWith,
	}

	if err := app.store.Students.Create(r.Context(), student); err != nil {
		switch err {
		case store.ErrDuplicate:
			app.badRequestResponse(w, r, err)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	if err := utils.ResponseJSON(w, http.StatusCreated, student); err != nil {
		app.internalServerError(w, r, err)
		return
	}
}

func (app *application) getStudentsHandler(w http.ResponseWriter, r *http.Request) {
	// fq := store.PaginatedQuery{
	// 	Limit:  10,
	// 	Offset: 0,
	// }

	// fq, err := fq.Parse(r)
	// if err != nil {
	// 	app.badRequestResponse(w, r, err)
	// 	return
	// }

	// if err := utils.Validate.Struct(fq); err != nil {
	// 	app.badRequestResponse(w, r, err)
	// 	return
	// }

	students, err := app.store.Students.GetAll(r.Context())
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if err := utils.ResponseJSON(w, http.StatusOK, students); err != nil {
		app.internalServerError(w, r, err)
		return
	}
}
