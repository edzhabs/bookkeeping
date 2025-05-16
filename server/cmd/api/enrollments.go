package main

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/edzhabs/bookkeeping/internal/constants"
	"github.com/edzhabs/bookkeeping/internal/models"
	"github.com/edzhabs/bookkeeping/internal/store"
	"github.com/edzhabs/bookkeeping/internal/utils"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type enrollmentKey string

const (
	enrollment_months               = 10
	enrollmentID                    = "enrollmentID"
	enrollmentCtx     enrollmentKey = "enrollment"
)

type CreateEnrollmentPayload struct {
	Student        Student         `json:"student"`
	SchoolYear     string          `json:"school_year" validate:"required,schoolyear"`
	GradeLevel     string          `json:"grade_level" validate:"oneofci=nursery-1 nursery-2 kinder-1 kinder-2 grade-1 grade-2 grade-3 grade-4 grade-5 grade-6"`
	MonthlyTuition decimal.Decimal `json:"monthly_tuition" validate:"required,decimalGt"`
	Type           string          `json:"type" validate:"oneofci=new old"`
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
	student := &models.Student{
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

	var discounts []*models.Discount
	if len(payload.AvailDiscounts) > 0 {
		for _, d := range payload.AvailDiscounts {
			discount := &models.Discount{}
			total_tuition := payload.MonthlyTuition.Mul(decimal.NewFromInt(enrollment_months))
			switch strings.ToLower(d) {
			case constants.Rank_1:
				discount.Type = constants.Rank_1
				discount.Amount = payload.LmsFee
				discounts = append(discounts, discount)
			case constants.Sibling:
				discount.Type = constants.Sibling
				discount.Amount = total_tuition.Mul(decimal.NewFromFloat(0.05))
				discounts = append(discounts, discount)
			case constants.FullYear:
				discount.Type = constants.FullYear
				discount.Amount = payload.MonthlyTuition
				discounts = append(discounts, discount)
			case constants.Scholar:
				discount.Type = constants.Scholar
				discount.Amount = total_tuition.Mul(decimal.NewFromFloat(0.5))
				discounts = append(discounts, discount)
			default:
				continue
			}

		}
	}

	enrollment := &models.Enrollment{
		Student:        student,
		SchoolYear:     payload.SchoolYear,
		GradeLevel:     strings.ToLower(payload.GradeLevel),
		Type:           strings.ToLower(payload.Type),
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

func (app *application) getEnrollmentsHandler(w http.ResponseWriter, r *http.Request) {

	enrollments, err := app.store.Enrollments.GetAll(r.Context())
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if err := utils.ResponseJSON(w, http.StatusOK, enrollments); err != nil {
		app.internalServerError(w, r, err)
		return
	}
}

func (app *application) getEnrollmentHandler(w http.ResponseWriter, r *http.Request) {
	enrollment := app.getStudentFromCtx(r)

	if err := utils.ResponseJSON(w, http.StatusOK, enrollment); err != nil {
		app.internalServerError(w, r, err)
		return
	}
}

func (app *application) studentContextMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		idString := chi.URLParam(r, enrollmentID)
		id, err := uuid.Parse(idString)
		if err != nil {
			app.internalServerError(w, r, err)
			return
		}

		ctx := r.Context()

		enrollment, err := app.store.Enrollments.GetStudentByID(ctx, id)
		if err != nil {
			switch err {
			case store.ErrNotFound:
				app.notFoundResponse(w, r, err)
			default:
				app.internalServerError(w, r, err)
			}
			return
		}

		ctx = context.WithValue(ctx, enrollmentCtx, enrollment)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (app *application) getStudentFromCtx(r *http.Request) models.EnrollmentStudentDetails {
	enrollment, _ := r.Context().Value(enrollmentCtx).(models.EnrollmentStudentDetails)
	return enrollment
}
