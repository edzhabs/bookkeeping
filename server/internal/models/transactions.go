package models

import (
	"time"

	"github.com/shopspring/decimal"
)

type TransactionTableData struct {
	InvoiceNumber string          `json:"invoice_number"`
	FullName      string          `json:"full_name"`
	Category      []string        `json:"category"`
	PaymentDate   time.Time       `json:"payment_date"`
	Amount        decimal.Decimal `json:"amount"`
	PaymentMethod string          `json:"payment_method"`
}
