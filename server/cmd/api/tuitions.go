package main

import (
	"net/http"
	"time"

	"github.com/edzhabs/bookkeeping/internal/models"
	"github.com/edzhabs/bookkeeping/internal/store"
	"github.com/edzhabs/bookkeeping/internal/utils"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type TuitionPaymentPayload struct {
	EnrollmentID  uuid.UUID       `json:"enrollment_id" validate:"required"`
	Amount        decimal.Decimal `json:"amount" validate:"required,decimalGt"`
	PaymentMethod string          `json:"payment_method" validate:"oneofci=cash g-cash bank"`
	PaymentDate   string          `json:"payment_date" validate:"required,validBirthdate"`
	InvoiceNumber string          `json:"invoice_number" validate:"required"`
	Notes         string          `json:"notes" validate:"omitempty"`
}

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

func (app *application) getTuitionDropdownHandler(w http.ResponseWriter, r *http.Request) {
	tuitions, err := app.store.Tuitions.TuitionDropdown(r.Context())
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if err := utils.ResponseJSON(w, http.StatusOK, tuitions); err != nil {
		app.internalServerError(w, r, err)
		return
	}
}

func (app *application) createTuitionPayment(w http.ResponseWriter, r *http.Request) {
	var payload TuitionPaymentPayload

	if err := utils.ReadJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	paymentDate, err := time.Parse(dateLayout, payload.PaymentDate)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	payment := &models.TuitionPayment{
		EnrollmentID:  payload.EnrollmentID,
		Amount:        payload.Amount,
		PaymentMethod: payload.PaymentMethod,
		PaymentDate:   paymentDate,
		InvoiceNumber: payload.InvoiceNumber,
		Notes:         payload.Notes,
	}

	// TODO: auth to add user log to know who created this
	if err := app.store.Tuitions.TuitionPayment(r.Context(), payment); err != nil {
		switch err {
		case store.ErrDuplicate:
			app.badRequestResponse(w, r, err)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	if err := utils.ResponseJSON(w, http.StatusCreated, payment); err != nil {
		app.internalServerError(w, r, err)
		return
	}
}
