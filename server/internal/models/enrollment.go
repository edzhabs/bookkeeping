package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type Enrollment struct {
	Student        *Student        `json:"student"`
	ID             uuid.UUID       `json:"id"`
	SchoolYear     string          `json:"school_year"`
	GradeLevel     string          `json:"grade_level"`
	Type           string          `json:"type"`
	MonthlyTuition decimal.Decimal `json:"monthly_tuition"`
	EnrollmentFee  decimal.Decimal `json:"enrollment_fee"`
	MiscFee        decimal.Decimal `json:"misc_fee"`
	PtaFee         decimal.Decimal `json:"pta_fee"`
	LmsFee         decimal.Decimal `json:"lms_books_fee"`
	Discounts      []*Discount     `json:"discounts"`
	CreatedAt      time.Time       `json:"created_at"`
	UpdatedAt      time.Time       `json:"updated_at"`
	DeletedAt      time.Time       `json:"deleted_at"`
}

type Discount struct {
	ID           uuid.UUID       `json:"discount_id"`
	EnrollmentID uuid.UUID       `json:"enrollment_id"`
	Type         string          `json:"type"`
	Scope        string          `json:"scope"`
	Amount       decimal.Decimal `json:"amount"`
	CreatedAt    time.Time       `json:"created_at"`
	UpdatedAt    time.Time       `json:"updated_at"`
	DeletedAt    time.Time       `json:"deleted_at"`
}

type EnrollmentsTableData struct {
	ID              uuid.UUID       `json:"id"`
	FullName        string          `json:"full_name"`
	Type            string          `json:"type"`
	GradeLevel      string          `json:"grade_level"`
	Gender          string          `json:"gender"`
	SchoolYear      string          `json:"school_year"`
	DiscountTypes   []string        `json:"discount_types"`
	TotalAmount     decimal.Decimal `json:"total_amount"`
	TotalPaid       decimal.Decimal `json:"total_paid"`
	RemainingAmount decimal.Decimal `json:"remaining_amount"`
	PaymentStatus   string          `json:"payment_status"`
}

type EnrollmentStudentDetails struct {
	ID              uuid.UUID       `json:"id"`
	Type            string          `json:"type"`
	GradeLevel      string          `json:"grade_level"`
	SchoolYear      string          `json:"school_year"`
	DiscountTypes   []string        `json:"discount_types"`
	TotalAmount     decimal.Decimal `json:"total_amount"`
	TotalPaid       decimal.Decimal `json:"total_paid"`
	RemainingAmount decimal.Decimal `json:"remaining_amount"`
	PaymentStatus   string          `json:"payment_status"`
	Student         *Student        `json:"student"`
}
