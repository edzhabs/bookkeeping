package store

import (
	"context"
	"database/sql"

	"github.com/edzhabs/bookkeeping/internal/models"
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
