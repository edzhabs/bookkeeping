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

type EnrollmentsTableData struct {
	ID                    uuid.UUID       `json:"id"`
	FullName              string          `json:"full_name"`
	Type                  string          `json:"type"`
	GradeLevel            string          `json:"grade_level"`
	Gender                string          `json:"gender"`
	SchoolYear            string          `json:"school_year"`
	DiscountTypes         []string        `json:"discount_types"`
	TotalTuitionAmountDue decimal.Decimal `json:"total_tuition_amount_due"`
	TotalTuitionPaid      decimal.Decimal `json:"total_tuition_paid"`
	TuitionBalance        decimal.Decimal `json:"tuition_balance"`
	TuitionPaymentStatus  string          `json:"tuition_payment_status"`
}

type EnrollmentStudentDetails struct {
	ID                    uuid.UUID          `json:"id"`
	Type                  string             `json:"type"`
	GradeLevel            string             `json:"grade_level"`
	SchoolYear            string             `json:"school_year"`
	EnrollmentFee         decimal.Decimal    `json:"enrollment_fee"`
	MonthlyTuition        decimal.Decimal    `json:"monthly_tuition"`
	MiscFee               decimal.Decimal    `json:"misc_fee"`
	PtaFee                decimal.Decimal    `json:"pta_fee"`
	LmsFee                decimal.Decimal    `json:"lms_books_fee"`
	DiscountTypes         []string           `json:"discount_types"`
	DiscountDetails       DiscountDetailList `json:"discount_details"`
	DiscountTotalAmount   decimal.Decimal    `json:"discount_total_amount"`
	TotalTuitionAmountDue decimal.Decimal    `json:"total_tuition_amount_due"`
	TotalTuitionPaid      decimal.Decimal    `json:"total_tuition_paid"`
	TotalOtherPaid        decimal.Decimal    `json:"total_other_paid"`
	TuitionBalance        decimal.Decimal    `json:"tuition_balance"`
	TuitionPaymentStatus  string             `json:"tuition_payment_status"`
	Student               *Student           `json:"student"`
}

type EditEnrollmentDetails struct {
	ID                   uuid.UUID       `json:"id"`
	Student              *Student        `json:"student"`
	Type                 string          `json:"type"`
	GradeLevel           string          `json:"grade_level"`
	SchoolYear           string          `json:"school_year"`
	MonthlyTuition       decimal.Decimal `json:"monthly_tuition"`
	EnrollmentFee        decimal.Decimal `json:"enrollment_fee"`
	MiscFee              decimal.Decimal `json:"misc_fee"`
	PtaFee               decimal.Decimal `json:"pta_fee"`
	LmsFee               decimal.Decimal `json:"lms_books_fee"`
	IsRankOne            bool            `json:"isRankOne"`
	HasSiblingDiscount   bool            `json:"hasSiblingDiscount"`
	HasWholeYearDiscount bool            `json:"hasWholeYearDiscount"`
	HasScholarDiscount   bool            `json:"hasScholarDiscount"`
}
