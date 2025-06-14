package main

import (
	"fmt"
	"net/http"
	"strings"
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

type OtherPaymentPayload struct {
	EnrollmentID  uuid.UUID          `json:"enrollment_id" validate:"required"`
	PaymentMethod string             `json:"payment_method" validate:"oneofci=cash g-cash bank"`
	PaymentDate   string             `json:"payment_date" validate:"required,validBirthdate"`
	InvoiceNumber string             `json:"invoice_number" validate:"required"`
	Notes         string             `json:"notes" validate:"omitempty"`
	Items         []OtherPaymentItem `json:"items" validate:"required,dive"`
}

type OtherPaymentItem struct {
	Category string          `json:"category" validate:"oneofci=enrollment_fee pta_fee misc_fee lms_fee pe_shirt pe_pants id patch carpool others"`
	Amount   decimal.Decimal `json:"amount" validate:"required,decimalGt"`
	Remarks  string          `json:"remarks" validate:"omitempty"`
}

func (app *application) createTuitionPaymentHandler(w http.ResponseWriter, r *http.Request) {
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

	var items []*models.TuitionInvoiceItem
	item := &models.TuitionInvoiceItem{
		Type:   "tuition",
		Amount: payload.Amount,
	}
	items = append(items, item)

	payment := &models.TuitionPayment{
		EnrollmentID:  payload.EnrollmentID,
		PaymentMethod: payload.PaymentMethod,
		PaymentDate:   paymentDate,
		InvoiceNumber: payload.InvoiceNumber,
		Notes:         payload.Notes,
		Items:         items,
	}

	// TODO: auth to add user log to know who created this
	if err := app.store.Payments.TuitionPayment(r.Context(), payment); err != nil {
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

func (app *application) createOtherPaymentHandler(w http.ResponseWriter, r *http.Request) {
	var payload OtherPaymentPayload

	if err := utils.ReadJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	for i, item := range payload.Items {
		if strings.EqualFold(item.Category, "others") && strings.TrimSpace(item.Remarks) == "" {
			errMsg := fmt.Errorf("remarks are required for item %d because category is 'others'", i+1)
			app.badRequestResponse(w, r, errMsg)
			return
		}
	}

	paymentDate, err := time.Parse(dateLayout, payload.PaymentDate)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	var items []*models.OtherPaymentItem
	for _, t := range payload.Items {
		item := &models.OtherPaymentItem{
			Category: t.Category,
			Amount:   t.Amount,
			Remarks:  t.Remarks,
		}

		items = append(items, item)
	}

	payment := &models.OtherPayment{
		EnrollmentID:  payload.EnrollmentID,
		PaymentMethod: payload.PaymentMethod,
		PaymentDate:   paymentDate,
		InvoiceNumber: payload.InvoiceNumber,
		Notes:         payload.Notes,
		Items:         items,
	}

	if err := app.store.Payments.OtherPayment(r.Context(), payment); err != nil {
		switch err {
		case store.ErrDuplicate:
			app.badRequestResponse(w, r, store.ErrDuplicate)
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

func (app *application) getTuitionPaymentsHandler(w http.ResponseWriter, r *http.Request) {
	enrollmentID := app.getEnrollmentIDFromCtx(r)

	payments, err := app.store.Payments.GetTuitionsPaymentsByID(r.Context(), enrollmentID)
	if err != nil {
		switch err {
		case store.ErrNotFound:
			app.badRequestResponse(w, r, store.ErrDuplicate)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	if err := utils.ResponseJSON(w, http.StatusOK, payments); err != nil {
		app.internalServerError(w, r, err)
		return
	}
}

func (app *application) getOtherPaymentsHandler(w http.ResponseWriter, r *http.Request) {
	enrollmentID := app.getEnrollmentIDFromCtx(r)

	payments, err := app.store.Payments.GetOtherPaymentsByID(r.Context(), enrollmentID)
	if err != nil {
		switch err {
		case store.ErrNotFound:
			app.badRequestResponse(w, r, store.ErrDuplicate)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	if err := utils.ResponseJSON(w, http.StatusOK, payments); err != nil {
		app.internalServerError(w, r, err)
		return
	}
}
