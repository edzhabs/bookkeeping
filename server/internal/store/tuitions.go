package store

import (
	"context"
	"database/sql"

	"github.com/edzhabs/bookkeeping/internal/models"
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
			&tuition.EnrollmentID,
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
