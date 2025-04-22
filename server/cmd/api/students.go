package main

import (
	"net/http"
	"strings"
	"time"

	"github.com/edzhabs/bookkeeping/internal/store"
	"github.com/edzhabs/bookkeeping/internal/utils"
)

type studentKey string

const (
	studentCtx studentKey = "student"
	dateLayout string     = "2006-01-02"
)

type CreateStudentPayload struct {
	FirstName        string   `json:"first_name" validate:"required,alpha_with_spaces,trimmedSpace,max=100"`
	MiddleName       string   `json:"middle_name" validate:"required,alpha_with_spaces,trimmedSpace,max=100"`
	LastName         string   `json:"last_name" validate:"required,alpha_with_spaces,trimmedSpace,max=100"`
	Suffix           string   `json:"suffix" validate:"omitempty,alpha_with_spaces,max=10"`
	Gender           string   `json:"gender" validate:"oneofci=male female"`
	Birthdate        string   `json:"birthdate" validate:"required,validBirthdate"`
	Address          string   `json:"address" validate:"required,max=100"`
	MotherName       string   `json:"mother_name" validate:"omitempty,alpha_with_spaces,trimmedSpace,max=100"`
	MotherOccupation string   `json:"mother_occupation" validate:"omitempty,max=100"`
	MotherEducAttain string   `json:"mother_education_attain" validate:"omitempty,max=100"`
	FatherName       string   `json:"father_name" validate:"omitempty,alpha_with_spaces,trimmedSpace,max=100"`
	FatherOccupation string   `json:"father_occupation" validate:"omitempty,max=100"`
	FatherEducAttain string   `json:"father_education_attain" validate:"omitempty,max=100"`
	ContactNumbers   []string `json:"contact_numbers"`
	LivingWith       string   `json:"living_with" validate:"omitempty,max=100"`
}

func (app *application) createStudentHandler(w http.ResponseWriter, r *http.Request) {
	var payload CreateStudentPayload

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

	student := &store.ExtendedStudent{
		Student: store.Student{
			FirstName:  strings.ToUpper(payload.FirstName),
			MiddleName: strings.ToUpper(payload.MiddleName),
			LastName:   strings.ToUpper(payload.LastName),
			Suffix:     payload.Suffix,
			Gender:     strings.ToLower(payload.Gender),
			Birthdate:  birthdate,
			Address:    payload.Address,
		},
		MotherName:       payload.MotherName,
		MotherOccupation: payload.MotherOccupation,
		MotherEducAttain: payload.MotherEducAttain,
		FatherName:       payload.FatherName,
		FatherOccupation: payload.FatherOccupation,
		FatherEducAttain: payload.FatherEducAttain,
		ContactNumbers:   payload.ContactNumbers,
		LivingWith:       payload.LivingWith,
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
