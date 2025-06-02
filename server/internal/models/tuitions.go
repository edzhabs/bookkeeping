package models

import (
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type TuitionsTableData struct {
	EnrollmentID    uuid.UUID       `json:"enrollment_id"`
	FullName        string          `json:"full_name"`
	GradeLevel      string          `json:"grade_level"`
	SchoolYear      string          `json:"school_year"`
	DiscountTypes   []string        `json:"discount_types"`
	TotalAmount     decimal.Decimal `json:"total_amount"`
	TotalPaid       decimal.Decimal `json:"total_paid"`
	RemainingAmount decimal.Decimal `json:"remaining_amount"`
	PaymentStatus   string          `json:"payment_status"`
}
