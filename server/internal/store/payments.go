package store

import (
	"context"
	"database/sql"

	"github.com/edzhabs/bookkeeping/internal/models"
	"github.com/google/uuid"
	"github.com/lib/pq"
)

type PaymentStore struct {
	db *sql.DB
}

func (s *PaymentStore) GetTuitionsPaymentsByID(ctx context.Context, id uuid.UUID) ([]models.Payment, error) {
	query := `
		SELECT
			ti.id,
			ti.invoice_number,
			ti.payment_date,
			array_agg(tii.type ORDER BY tii.type) AS category,
			SUM(tii.amount) AS amount,
			ti.payment_method,
			ti.notes
		FROM tuition_invoices ti
		JOIN tuition_invoice_items tii ON ti.id = tii.invoice_id
		WHERE 
			ti.deleted_at IS NULL AND tii.deleted_at IS NULL
			AND ti.enrollment_id = $1
		GROUP BY
			ti.id, ti.invoice_number, ti.payment_date,
			ti.payment_method, ti.notes
		ORDER BY payment_date DESC
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	rows, err := s.db.QueryContext(ctx, query, id)
	if err != nil {
		switch err {
		case sql.ErrNoRows:
			return nil, ErrNotFound
		default:
			return nil, err
		}
	}

	defer rows.Close()

	var payments []models.Payment

	for rows.Next() {
		var payment models.Payment
		err := rows.Scan(
			&payment.ID,
			&payment.InvoiceNumber,
			&payment.PaymentDate,
			pq.Array(&payment.Category),
			&payment.Amount,
			&payment.PaymentMethod,
			&payment.Notes,
		)
		if err != nil {
			return nil, err
		}

		payments = append(payments, payment)
	}

	return payments, nil

}

func (s *PaymentStore) GetOtherPaymentsByID(ctx context.Context, id uuid.UUID) ([]models.Payment, error) {
	query := `
		SELECT
			oi.id,
			oi.invoice_number,
			oi.payment_date,
			array_agg(oii.category ORDER BY oii.category) AS category,
			SUM(oii.amount) AS amount,
			oi.payment_method,
			oi.notes
		FROM other_invoices oi
		JOIN other_invoice_items oii ON oi.id = oii.invoice_id
		WHERE oi.deleted_at IS NULL
		AND oii.deleted_at IS NULL
		AND oi.enrollment_id = $1
		GROUP BY
			oi.id, oi.invoice_number, oi.payment_date,
			oi.payment_method, oi.notes
		ORDER BY payment_date DESC
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	rows, err := s.db.QueryContext(ctx, query, id)
	if err != nil {
		switch err {
		case sql.ErrNoRows:
			return nil, ErrNotFound
		default:
			return nil, err
		}
	}

	defer rows.Close()

	var payments []models.Payment

	for rows.Next() {
		var payment models.Payment
		err := rows.Scan(
			&payment.ID,
			&payment.InvoiceNumber,
			&payment.PaymentDate,
			pq.Array(&payment.Category),
			&payment.Amount,
			&payment.PaymentMethod,
			&payment.Notes,
		)
		if err != nil {
			return nil, err
		}

		payments = append(payments, payment)
	}

	return payments, nil

}

func (s *PaymentStore) TuitionPayment(ctx context.Context, payment *models.TuitionPayment) error {
	return withTx(ctx, s.db, func(tx *sql.Tx) error {
		if err := s.createTuitionInvoice(ctx, tx, payment); err != nil {
			return err
		}

		for _, item := range payment.Items {
			if err := s.createTuitionInvoiceItem(ctx, tx, payment.ID, item); err != nil {
				return err
			}
		}

		return nil
	})
}

func (s *PaymentStore) OtherPayment(ctx context.Context, payment *models.OtherPayment) error {
	return withTx(ctx, s.db, func(tx *sql.Tx) error {
		if err := s.createOtherPaymentInvoice(ctx, tx, payment); err != nil {
			return err
		}

		for _, item := range payment.Items {
			if err := s.createOtherInvoiceItem(ctx, tx, payment.ID, item); err != nil {
				return err
			}
		}

		return nil
	})
}

func (s *PaymentStore) createTuitionInvoice(ctx context.Context, tx *sql.Tx, payment *models.TuitionPayment) error {
	query := `
		INSERT INTO tuition_invoices
			(enrollment_id, payment_method, payment_date, invoice_number, notes)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	err := tx.QueryRowContext(
		ctx,
		query,
		payment.EnrollmentID,
		payment.PaymentMethod,
		payment.PaymentDate,
		payment.InvoiceNumber,
		payment.Notes,
	).Scan(
		&payment.ID,
		&payment.CreatedAt,
	)
	if err != nil {
		switch err.Error() {
		case `pq: duplicate key value violates unique constraint "tuition_invoices_invoice_number_key"`:
			return ErrDuplicate
		default:
			return err
		}
	}

	return nil
}

func (s *PaymentStore) createTuitionInvoiceItem(ctx context.Context, tx *sql.Tx, invoiceID uuid.UUID, item *models.TuitionInvoiceItem) error {
	query := `
		INSERT INTO tuition_invoice_items
			(invoice_id, type, amount)
		VALUES ($1, $2, $3)
		RETURNING id, created_at
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	err := tx.QueryRowContext(
		ctx,
		query,
		invoiceID,
		item.Type,
		item.Amount,
	).Scan(
		&item.ID,
		&item.CreatedAt,
	)
	if err != nil {
		return err
	}

	return nil
}

func (s *PaymentStore) createOtherPaymentInvoice(ctx context.Context, tx *sql.Tx, payment *models.OtherPayment) error {
	query := `
		INSERT INTO other_invoices
			(enrollment_id, payment_method, payment_date, invoice_number, notes)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	err := tx.QueryRowContext(
		ctx,
		query,
		payment.EnrollmentID,
		payment.PaymentMethod,
		payment.PaymentDate,
		payment.InvoiceNumber,
		payment.Notes,
	).Scan(
		&payment.ID,
		&payment.CreatedAt,
	)
	if err != nil {
		switch err.Error() {
		case `pq: duplicate key value violates unique constraint "other_invoices_invoice_number_key"`:
			return ErrDuplicate
		default:
			return err
		}
	}

	return nil
}

func (s *PaymentStore) createOtherInvoiceItem(ctx context.Context, tx *sql.Tx, invoiceID uuid.UUID, item *models.OtherPaymentItem) error {
	query := `
		INSERT INTO other_invoice_items
			(invoice_id, category, amount, remarks)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	err := tx.QueryRowContext(
		ctx,
		query,
		invoiceID,
		item.Category,
		item.Amount,
		item.Remarks,
	).Scan(
		&item.ID,
		&item.CreatedAt,
	)
	if err != nil {
		return err
	}

	return nil
}
