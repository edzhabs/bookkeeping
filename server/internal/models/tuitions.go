package models

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type TuitionsTableData struct {
	ID              uuid.UUID       `json:"id"`
	FullName        string          `json:"full_name"`
	GradeLevel      string          `json:"grade_level"`
	SchoolYear      string          `json:"school_year"`
	DiscountTypes   []string        `json:"discount_types"`
	TotalAmount     decimal.Decimal `json:"total_amount"`
	TotalPaid       decimal.Decimal `json:"total_paid"`
	RemainingAmount decimal.Decimal `json:"remaining_amount"`
	PaymentStatus   string          `json:"payment_status"`
}

type TuitionDetails struct {
	ID                  uuid.UUID          `json:"id"`
	Type                string             `json:"type"`
	GradeLevel          string             `json:"grade_level"`
	SchoolYear          string             `json:"school_year"`
	EnrollmentFee       decimal.Decimal    `json:"enrollment_fee"`
	MonthlyTuition      decimal.Decimal    `json:"monthly_tuition"`
	MiscFee             decimal.Decimal    `json:"misc_fee"`
	PtaFee              decimal.Decimal    `json:"pta_fee"`
	LmsFee              decimal.Decimal    `json:"lms_books_fee"`
	DiscountTypes       []string           `json:"discount_types"`
	DiscountDetails     DiscountDetailList `json:"discount_details"`
	DiscountTotalAmount decimal.Decimal    `json:"discount_total_amount"`
	TotalAmount         decimal.Decimal    `json:"total_amount"`
	TotalPaid           decimal.Decimal    `json:"total_paid"`
	RemainingAmount     decimal.Decimal    `json:"remaining_amount"`
	PaymentStatus       string             `json:"payment_status"`
	Student             *BaseStudent       `json:"student"`
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

type DiscountDetail struct {
	Type   string          `json:"type"`
	Amount decimal.Decimal `json:"amount"`
}

type DiscountDetailList []DiscountDetail

func (d *DiscountDetailList) Scan(src interface{}) error {
	if src == nil {
		*d = DiscountDetailList{} // treat NULL as empty array
		return nil
	}

	bytes, ok := src.([]byte)
	if !ok {
		return fmt.Errorf("expected []byte for DiscountDetailList, got %T", src)
	}

	return json.Unmarshal(bytes, d)
}
