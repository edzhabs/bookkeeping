package store

import (
	"context"
	"database/sql"

	"github.com/edzhabs/bookkeeping/internal/models"
	"github.com/lib/pq"
)

type TransactionStore struct {
	db *sql.DB
}

func (s *TransactionStore) GetAll(ctx context.Context) ([]models.TransactionTableData, error) {
	query := `
		SELECT
			ti.invoice_number,
			TRIM(CONCAT_WS(' ',
				s.first_name,
				CASE
					WHEN s.middle_name IS NOT NULL AND s.middle_name <> ''
					THEN LEFT(s.middle_name, 1) || '.'
					ELSE NULL
				END,
				s.last_name,
				s.suffix
			)) AS full_name,
			ARRAY_AGG(DISTINCT tii.type) AS category,
			ti.payment_date,
			SUM(tii.amount) AS amount,
			ti.payment_method
		FROM tuition_invoices ti
		JOIN tuition_invoice_items tii ON ti.id = tii.invoice_id AND tii.deleted_at IS NULL
		JOIN enrollments e ON ti.enrollment_id = e.id AND e.deleted_at IS NULL
		JOIN students s ON e.student_id = s.id AND s.deleted_at IS NULL
		WHERE ti.deleted_at IS NULL
		GROUP BY ti.invoice_number, s.first_name, s.middle_name, s.last_name, s.suffix, ti.payment_date, ti.payment_method

		UNION ALL

		-- Other Invoices
		SELECT
			oi.invoice_number,
			TRIM(CONCAT_WS(' ',
				s.first_name,
				CASE
					WHEN s.middle_name IS NOT NULL AND s.middle_name <> ''
					THEN LEFT(s.middle_name, 1) || '.'
					ELSE NULL
				END,
				s.last_name,
				s.suffix
			)) AS full_name,
			ARRAY_AGG(DISTINCT oii.category) AS category,
			oi.payment_date,
			SUM(oii.amount) AS amount,
			oi.payment_method
		FROM other_invoices oi
		JOIN other_invoice_items oii ON oi.id = oii.invoice_id AND oii.deleted_at IS NULL
		JOIN enrollments e ON oi.enrollment_id = e.id AND e.deleted_at IS NULL
		JOIN students s ON e.student_id = s.id AND s.deleted_at IS NULL
		WHERE oi.deleted_at IS NULL
		GROUP BY oi.invoice_number, s.first_name, s.middle_name, s.last_name, s.suffix, oi.payment_date, oi.payment_method

		ORDER BY payment_date DESC, invoice_number DESC
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	rows, err := s.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}

	var transactions []models.TransactionTableData

	defer rows.Close()

	for rows.Next() {
		var transaction models.TransactionTableData
		err := rows.Scan(
			&transaction.InvoiceNumber,
			&transaction.FullName,
			pq.Array(&transaction.Category),
			&transaction.PaymentDate,
			&transaction.Amount,
			&transaction.PaymentMethod,
		)
		if err != nil {
			return nil, err
		}

		transactions = append(transactions, transaction)
	}

	return transactions, nil
}
