package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type TuitionPayment struct {
	ID            uuid.UUID             `json:"id"`
	EnrollmentID  uuid.UUID             `json:"enrollment_id"`
	PaymentMethod string                `json:"payment_method"`
	PaymentDate   time.Time             `json:"payment_date"`
	InvoiceNumber string                `json:"invoice_number"`
	Notes         string                `json:"notes"`
	Items         []*TuitionInvoiceItem `json:"items"`
	CreatedAt     time.Time             `json:"created_at"`
	UpdatedAt     time.Time             `json:"updated_at"`
	DeletedAt     time.Time             `json:"deleted_at"`
}

type TuitionInvoiceItem struct {
	ID        uuid.UUID       `json:"id"`
	InvoiceID uuid.UUID       `json:"invoice_id"`
	Type      string          `json:"type"`
	Amount    decimal.Decimal `json:"amount"`
	CreatedAt time.Time       `json:"created_at"`
	UpdatedAt time.Time       `json:"updated_at"`
	DeletedAt time.Time       `json:"deleted_at"`
}

type OtherPayment struct {
	ID            uuid.UUID           `json:"id"`
	EnrollmentID  uuid.UUID           `json:"enrollment_id"`
	PaymentMethod string              `json:"payment_method"`
	PaymentDate   time.Time           `json:"payment_date"`
	InvoiceNumber string              `json:"invoice_number"`
	Notes         string              `json:"notes"`
	Items         []*OtherPaymentItem `json:"items"`
	CreatedAt     time.Time           `json:"created_at"`
	UpdatedAt     time.Time           `json:"updated_at"`
	DeletedAt     time.Time           `json:"deleted_at"`
}

type OtherPaymentItem struct {
	ID        uuid.UUID       `json:"id"`
	Category  string          `json:"category"`
	Amount    decimal.Decimal `json:"amount"`
	Remarks   string          `json:"remarks"`
	CreatedAt time.Time       `json:"created_at"`
	UpdatedAt time.Time       `json:"updated_at"`
	DeletedAt time.Time       `json:"deleted_at"`
}

type Payment struct {
	ID            uuid.UUID       `json:"id"`
	InvoiceNumber string          `json:"invoice_number"`
	PaymentDate   time.Time       `json:"payment_date"`
	Category      []string        `json:"category"`
	Amount        decimal.Decimal `json:"amount"`
	PaymentMethod string          `json:"payment_method"`
	Notes         string          `json:"notes"`
}
