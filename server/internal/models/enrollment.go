package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type Enrollment struct {
	*Student
	ID             uuid.UUID       `json:"id"`
	SchoolYear     string          `json:"school_year"`
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

type Student struct {
	ID              uuid.UUID `json:"id"`
	FirstName       string    `json:"first_name"`
	MiddleName      string    `json:"middle_name"`
	LastName        string    `json:"last_name"`
	Suffix          string    `json:"suffix"`
	FullName        string    `json:"full_name"`
	Gender          string    `json:"gender"`
	Birthdate       time.Time `json:"birthdate"`
	Address         string    `json:"address"`
	MotherName      string    `json:"mother_name"`
	MotherJob       string    `json:"mother_job"`
	MotherEducation string    `json:"mother_education"`
	FatherName      string    `json:"father_name"`
	FatherJob       string    `json:"father_job"`
	FatherEducation string    `json:"father_education"`
	ContactNumbers  []string  `json:"contact_numbers"`
	LivingWith      string    `json:"living_with"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
	DeletedAt       time.Time `json:"deleted_at"`
}

type Discount struct {
	ID           uuid.UUID       `json:"discount_id"`
	EnrollmentID uuid.UUID       `json:"enrollment_id"`
	Type         string          `json:"type"`
	Amount       decimal.Decimal `json:"amount"`
	CreatedAt    time.Time       `json:"created_at"`
	UpdatedAt    time.Time       `json:"updated_at"`
	DeletedAt    time.Time       `json:"deleted_at"`
}
