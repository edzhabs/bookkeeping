package main

import (
	"net/http"
	"strings"
	"time"

	"github.com/edzhabs/bookkeeping/internal/store"
	"github.com/edzhabs/bookkeeping/internal/utils"
	"github.com/shopspring/decimal"
)

const (
	enrollment_months = 10
)

type CreateEnrollmentPayload struct {
	Student        Student         `json:"student"`
	SchoolYear     string          `json:"school_year" validate:"required,schoolyear"`
	MonthlyTuition decimal.Decimal `json:"monthly_tuition" validate:"required,decimalGt"`
	EnrollmentFee  decimal.Decimal `json:"enrollment_fee" validate:"required,decimalGt"`
	MiscFee        decimal.Decimal `json:"misc_fee" validate:"required,decimalGt"`
	PtaFee         decimal.Decimal `json:"pta_fee" validate:"required,decimalGt"`
	LmsFee         decimal.Decimal `json:"lms_books_fee" validate:"required,decimalGt"`
	AvailDiscounts []string        `json:"discounts" validate:"omitempty,discounts"`
}

type Student struct {
	FirstName       string   `json:"first_name" validate:"required,alpha_with_spaces,trimmedSpace,max=100"`
	MiddleName      string   `json:"middle_name" validate:"required,alpha_with_spaces,trimmedSpace,max=100"`
	LastName        string   `json:"last_name" validate:"required,alpha_with_spaces,trimmedSpace,max=100"`
	Suffix          string   `json:"suffix" validate:"omitempty,alpha_with_spaces,max=10"`
	Gender          string   `json:"gender" validate:"oneofci=male female"`
	Birthdate       string   `json:"birthdate" validate:"required,validBirthdate"`
	Address         string   `json:"address" validate:"required,max=100"`
	MotherName      string   `json:"mother_name" validate:"omitempty,alpha_with_spaces,trimmedSpace,max=100"`
	MotherJob       string   `json:"mother_job" validate:"omitempty,max=100"`
	MotherEducation string   `json:"mother_education" validate:"omitempty,max=100"`
	FatherName      string   `json:"father_name" validate:"omitempty,alpha_with_spaces,trimmedSpace,max=100"`
	FatherJob       string   `json:"father_job" validate:"omitempty,max=100"`
	FatherEducation string   `json:"father_education" validate:"omitempty,max=100"`
	ContactNumbers  []string `json:"contact_numbers"`
	LivingWith      string   `json:"living_with" validate:"omitempty,max=100"`
}

func (app *application) createEnrollmentHandler(w http.ResponseWriter, r *http.Request) {
	var payload CreateEnrollmentPayload

	if err := utils.ReadJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}
	if err := utils.Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	birthdate, err := time.Parse(dateLayout, payload.Student.Birthdate)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	// TODO: auth to add user log to know who created this
	student := &store.Student{
		FirstName:       payload.Student.FirstName,
		MiddleName:      payload.Student.MiddleName,
		LastName:        payload.Student.LastName,
		Suffix:          payload.Student.Suffix,
		Gender:          strings.ToLower(payload.Student.Gender),
		Birthdate:       birthdate,
		Address:         payload.Student.Address,
		MotherName:      payload.Student.MotherName,
		MotherJob:       payload.Student.MotherJob,
		MotherEducation: payload.Student.MotherEducation,
		FatherName:      payload.Student.FatherName,
		FatherJob:       payload.Student.FatherJob,
		FatherEducation: payload.Student.FatherEducation,
		ContactNumbers:  payload.Student.ContactNumbers,
		LivingWith:      payload.Student.LivingWith,
	}

	var discounts []*store.Discount
	if len(payload.AvailDiscounts) > 0 {
		for _, d := range payload.AvailDiscounts {
			discount := &store.Discount{}
			total_tuition := payload.MonthlyTuition.Mul(decimal.NewFromInt(enrollment_months))
			switch d {
			case "rank_1":
				discount.Type = "rank_1"
				discount.Amount = payload.LmsFee
				discounts = append(discounts, discount)
			case "sibling":
				discount.Type = "sibling"
				discount.Amount = total_tuition.Mul(decimal.NewFromFloat(0.05))
				discounts = append(discounts, discount)
			case "full_year":
				discount.Type = "full_year"
				discount.Amount = payload.MonthlyTuition
			case "scholar":
				discount.Type = "scholar"
				total_fees := payload.EnrollmentFee.Add(payload.MiscFee).Add(payload.PtaFee).Add(payload.LmsFee)
				discount.Amount = total_tuition.Add(total_fees)
				discounts = append(discounts, discount)
			default:
				continue
			}

		}
	}

	enrollment := &store.Enrollment{
		Student:        student,
		SchoolYear:     payload.SchoolYear,
		MonthlyTuition: payload.MonthlyTuition,
		EnrollmentFee:  payload.EnrollmentFee,
		MiscFee:        payload.MiscFee,
		PtaFee:         payload.PtaFee,
		LmsFee:         payload.LmsFee,
		Discounts:      discounts,
	}

	if err := app.store.Enrollments.Create(r.Context(), enrollment); err != nil {
		switch err {
		case store.ErrDuplicate:
			app.badRequestResponse(w, r, err)
		case store.ErrRequiredFees:
			app.badRequestResponse(w, r, err)
		default:
			app.internalServerError(w, r, err)
		}
		return
	}

	if err := utils.ResponseJSON(w, http.StatusCreated, enrollment); err != nil {
		app.internalServerError(w, r, err)
		return
	}
}
