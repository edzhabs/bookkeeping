package store

import (
	"context"
	"database/sql"

	"github.com/edzhabs/bookkeeping/internal/models"
	"github.com/edzhabs/bookkeeping/internal/utils"
	"github.com/google/uuid"
	"github.com/lib/pq"
)

type TuitionStore struct {
	db *sql.DB
}

func (s *TuitionStore) GetAll(ctx context.Context) ([]models.TuitionsTableData, error) {
	query := `
	SELECT
      e.id,
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
      e.school_year,
	  e.grade_level,
	  COALESCE(array_agg(DISTINCT d.type) FILTER (WHERE d.type IS NOT NULL), ARRAY[]::text[]) AS discount_types,
      (e.monthly_tuition * e.months + e.enrollment_fee + e.misc_fee + e.pta_fee + e.lms_books_fee
         - COALESCE(SUM(d.amount), 0)) AS total_amount,
	  COALESCE(SUM(tp.reservation_fee + tp.tuition_fee + tp.advance_payment), 0) AS total_paid,
	  (
	 	(e.monthly_tuition * e.months + e.enrollment_fee + e.misc_fee + e.pta_fee + e.lms_books_fee)
		- COALESCE(SUM(d.amount), 0)
		- COALESCE(SUM(tp.reservation_fee + tp.tuition_fee + tp.advance_payment), 0) 
	  ) AS remaining_amount,
	  CASE
	  	WHEN COALESCE(SUM(tp.reservation_fee + tp.tuition_fee + tp.advance_payment), 0) = 0
			THEN 'unpaid'
		WHEN COALESCE(SUM(tp.reservation_fee + tp.tuition_fee + tp.advance_payment), 0) >=
			   (e.monthly_tuition * e.months + e.enrollment_fee + e.misc_fee + e.pta_fee + e.lms_books_fee - COALESCE(SUM(d.amount), 0))
			THEN 'paid'
		ELSE 'partial'
	  END AS payment_status
    FROM enrollments e
    LEFT JOIN discounts d ON d.enrollment_id = e.id AND d.deleted_at IS NULL
	LEFT JOIN tuition_payments tp ON tp.enrollment_id = e.id AND tp.deleted_at IS NULL
    LEFT JOIN students s ON s.id = e.student_id AND s.deleted_at IS NULL
    WHERE e.deleted_at IS NULL
    GROUP BY e.id, s.first_name, s.middle_name, s.last_name, s.suffix
	ORDER BY e.created_at DESC
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	var tuitions []models.TuitionsTableData

	rows, err := s.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var tuition models.TuitionsTableData
		err := rows.Scan(
			&tuition.ID,
			&tuition.FullName,
			&tuition.SchoolYear,
			&tuition.GradeLevel,
			pq.Array(&tuition.DiscountTypes),
			&tuition.TotalAmount,
			&tuition.TotalPaid,
			&tuition.RemainingAmount,
			&tuition.PaymentStatus,
		)
		if err != nil {
			return nil, err
		}
		tuitions = append(tuitions, tuition)
	}

	return tuitions, nil
}

func (s *TuitionStore) GetTuitionByID(ctx context.Context, id uuid.UUID) (models.TuitionDetails, error) {
	query := `
		SELECT
	  e.id,
	  s.id,
	  s.first_name,
	  s.middle_name,
	  s.last_name,
	  s.suffix,
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
	  e.grade_level,
	  e.school_year,
	  e.enrollment_fee,
	  e.monthly_tuition,
	  e.misc_fee,
	  e.pta_fee,
	  e.lms_books_fee,
	  COALESCE(array_agg(DISTINCT d.type) FILTER (WHERE d.type IS NOT NULL), ARRAY[]::text[]) AS discount_types,
	  COALESCE(SUM(d.amount), 0) AS discount_total_amount,
	  jsonb_agg(
			jsonb_build_object('type', d.type, 'amount', d.amount)
			ORDER BY d.type
		) FILTER (WHERE d.amount > 0)::jsonb AS discount_details,
      (e.monthly_tuition * e.months + e.enrollment_fee + e.misc_fee + e.pta_fee + e.lms_books_fee
         - COALESCE(SUM(d.amount), 0)) AS total_amount,
	  COALESCE(SUM(tp.reservation_fee + tp.tuition_fee + tp.advance_payment), 0) AS total_paid,
	  (
	 	(e.monthly_tuition * e.months + e.enrollment_fee + e.misc_fee + e.pta_fee + e.lms_books_fee)
		- COALESCE(SUM(d.amount), 0)
		- COALESCE(SUM(tp.reservation_fee + tp.tuition_fee + tp.advance_payment), 0) 
	  ) AS remaining_amount,
	  CASE
	  	WHEN COALESCE(SUM(tp.reservation_fee + tp.tuition_fee + tp.advance_payment), 0) = 0
			THEN 'unpaid'
		WHEN COALESCE(SUM(tp.reservation_fee + tp.tuition_fee + tp.advance_payment), 0) >=
			   (e.monthly_tuition * e.months + e.enrollment_fee + e.misc_fee + e.pta_fee + e.lms_books_fee - COALESCE(SUM(d.amount), 0))
			THEN 'paid'
		ELSE 'partial'
	  END AS payment_status
    FROM enrollments e
    LEFT JOIN discounts d ON d.enrollment_id = e.id AND d.deleted_at IS NULL
	LEFT JOIN tuition_payments tp ON tp.enrollment_id = e.id AND tp.deleted_at IS NULL
    LEFT JOIN students s ON s.id = e.student_id AND s.deleted_at IS NULL
    WHERE e.deleted_at IS NULL AND e.id = $1
	GROUP BY e.id, s.id, s.first_name, s.middle_name, s.last_name, s.suffix, e.type, e.school_year, e.grade_level,
	  s.gender, s.birthdate, s.address, s.mother_name, s.mother_job, s.mother_education, s.father_name, s.father_job,
	  s.father_education, s.living_with, s.contact_numbers, e.monthly_tuition, e.months, e.enrollment_fee, e.misc_fee,
	  e.pta_fee, e.lms_books_fee
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	var tuition models.TuitionDetails
	tuition.Student = new(models.BaseStudent)

	err := s.db.QueryRowContext(
		ctx,
		query,
		id,
	).Scan(
		&tuition.ID,
		&tuition.Student.ID,
		&tuition.Student.FirstName,
		&tuition.Student.MiddleName,
		&tuition.Student.LastName,
		&tuition.Student.Suffix,
		&tuition.Student.FullName,
		&tuition.GradeLevel,
		&tuition.SchoolYear,
		&tuition.EnrollmentFee,
		&tuition.MonthlyTuition,
		&tuition.MiscFee,
		&tuition.PtaFee,
		&tuition.LmsFee,
		pq.Array(&tuition.DiscountTypes),
		&tuition.DiscountTotalAmount,
		&tuition.DiscountDetails,
		&tuition.TotalAmount,
		&tuition.TotalPaid,
		&tuition.RemainingAmount,
		&tuition.PaymentStatus,
	)
	if err != nil {
		switch err {
		case sql.ErrNoRows:
			return tuition, ErrNotFound
		default:
			return tuition, err
		}
	}

	return tuition, nil
}

func (s *TuitionStore) TuitionDropdown(ctx context.Context) ([]models.TuitionDropdown, error) {
	query := `
		SELECT 
			s.id as student_id,
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
			s.address,
			JSON_AGG(
				JSON_BUILD_OBJECT(
					'enrollment_id', e.id,
					'school_year', e.school_year,
					'grade_level', e.grade_level,

					-- Updated total_due: subtract discounts
					'total_due',
						((e.monthly_tuition * e.months)
						+ e.enrollment_fee + e.misc_fee + e.pta_fee + e.lms_books_fee
						- COALESCE(d.total_discount, 0)),

					-- Updated total_paid: tuition + selected other_payment categories
					'total_paid',
						COALESCE(tp.total_tuition_paid, 0) + COALESCE(op.total_other_paid, 0),

					-- Updated balance
					'balance',
						((e.monthly_tuition * e.months)
						+ e.enrollment_fee + e.misc_fee + e.pta_fee + e.lms_books_fee
						- COALESCE(d.total_discount, 0)
						- (COALESCE(tp.total_tuition_paid, 0) + COALESCE(op.total_other_paid, 0))
						)
				) ORDER BY e.school_year DESC
			) AS enrollments
		FROM students s
		JOIN enrollments e ON e.student_id = s.id

		-- Tuition payments
		LEFT JOIN (
			SELECT enrollment_id, SUM(amount) AS total_tuition_paid
			FROM tuition_payments
			WHERE deleted_at IS NULL
			GROUP BY enrollment_id
		) tp ON tp.enrollment_id = e.id

		-- Other payments for relevant categories
		LEFT JOIN (
			SELECT enrollment_id, SUM(amount) AS total_other_paid
			FROM other_payments
			WHERE deleted_at IS NULL
			AND category IN ('enrollment_fee', 'misc_fee', 'pta_fee', 'lms_books_fee')
			GROUP BY enrollment_id
		) op ON op.enrollment_id = e.id

		-- Discounts with relevant scope
		LEFT JOIN (
			SELECT enrollment_id, SUM(amount) AS total_discount
			FROM discounts
			WHERE deleted_at IS NULL
			AND scope IN ('tuition', 'lms_books')
			GROUP BY enrollment_id
		) d ON d.enrollment_id = e.id

		WHERE e.deleted_at IS NULL
		GROUP BY s.id, s.first_name, s.middle_name, s.last_name, s.suffix, s.address
		ORDER BY full_name ASC
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	rows, err := s.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var tuitions []models.TuitionDropdown
	for rows.Next() {
		var tuition models.TuitionDropdown
		var detailsJSON []byte
		err := rows.Scan(
			&tuition.StudentID,
			&tuition.FullName,
			&tuition.Address,
			&detailsJSON,
		)
		if err != nil {
			return nil, err
		}

		if err := utils.ScanJSON(detailsJSON, &tuition.TuitionDetails); err != nil {
			return nil, err
		}

		tuitions = append(tuitions, tuition)
	}

	return tuitions, nil
}

func (s *TuitionStore) TuitionPayment(ctx context.Context, payment *models.TuitionPayment) error {
	query := `
		INSERT INTO tuition_payments
			(enrollment_id, amount, payment_method, payment_date, invoice_number, notes)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	err := s.db.QueryRowContext(
		ctx,
		query,
		payment.EnrollmentID,
		payment.Amount,
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
		case `pq: duplicate key value violates unique constraint "tuition_payments_invoice_number_key"`:
			return ErrDuplicate
		default:
			return err
		}
	}

	return nil
}
