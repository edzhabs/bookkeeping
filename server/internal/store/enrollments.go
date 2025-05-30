package store

import (
	"context"
	"database/sql"

	"github.com/edzhabs/bookkeeping/internal/constants"
	"github.com/edzhabs/bookkeeping/internal/models"
	"github.com/google/uuid"
	"github.com/lib/pq"
)

var total_school_months = 10

type EnrollmentStore struct {
	db *sql.DB
}

func (s *EnrollmentStore) GetEnrollmentByID(ctx context.Context, id uuid.UUID) (models.EnrollmentStudentDetails, error) {
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
	  s.gender,
	  s.birthdate,
	  s.address,
	  s.mother_name,
	  s.mother_job,
	  s.mother_education,
	  s.father_name,
	  s.father_job,
	  s.father_education,
	  s.living_with,
	  s.contact_numbers,
	  e.type,
	  e.grade_level,
	  e.school_year,
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
    WHERE e.deleted_at IS NULL AND e.id = $1
	GROUP BY e.id, s.id, s.first_name, s.middle_name, s.last_name, s.suffix, e.type, e.school_year, e.grade_level,
	  s.gender, s.birthdate, s.address, s.mother_name, s.mother_job, s.mother_education, s.father_name, s.father_job,
	  s.father_education, s.living_with, s.contact_numbers, e.monthly_tuition, e.months, e.enrollment_fee, e.misc_fee,
	  e.pta_fee, e.lms_books_fee
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	var enrollment models.EnrollmentStudentDetails
	enrollment.Student = new(models.Student)

	err := s.db.QueryRowContext(
		ctx,
		query,
		id,
	).Scan(
		&enrollment.ID,
		&enrollment.Student.ID,
		&enrollment.Student.FirstName,
		&enrollment.Student.MiddleName,
		&enrollment.Student.LastName,
		&enrollment.Student.Suffix,
		&enrollment.Student.FullName,
		&enrollment.Student.Gender,
		&enrollment.Student.Birthdate,
		&enrollment.Student.Address,
		&enrollment.Student.MotherName,
		&enrollment.Student.MotherJob,
		&enrollment.Student.MotherEducation,
		&enrollment.Student.FatherName,
		&enrollment.Student.FatherJob,
		&enrollment.Student.FatherEducation,
		&enrollment.Student.LivingWith,
		pq.Array(&enrollment.Student.ContactNumbers),
		&enrollment.Type,
		&enrollment.GradeLevel,
		&enrollment.SchoolYear,
		pq.Array(&enrollment.DiscountTypes),
		&enrollment.TotalAmount,
		&enrollment.TotalPaid,
		&enrollment.RemainingAmount,
		&enrollment.PaymentStatus,
	)
	if err != nil {
		switch err {
		case sql.ErrNoRows:
			return enrollment, ErrNotFound
		default:
			return enrollment, err
		}
	}

	return enrollment, nil
}

func (s *EnrollmentStore) GetEditEnrollmentDetails(ctx context.Context, id uuid.UUID) (models.EditEnrollmentDetails, error) {
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
		s.gender,
		s.birthdate,
		s.address,
		s.mother_name,
		s.mother_job,
		s.mother_education,
		s.father_name,
		s.father_job,
		s.father_education,
		s.living_with,
		s.contact_numbers,
		e.type,
		e.grade_level,
		e.school_year,
		e.enrollment_fee,
		e.monthly_tuition,
		e.misc_fee,
		e.pta_fee,
		e.lms_books_fee,
		(
			SELECT EXISTS (
			SELECT 1 FROM discounts d
			WHERE d.enrollment_id = e.id AND d.deleted_at IS NULL AND d.type = 'rank_1'
			)
		) AS "isRankOne",
		(
			SELECT EXISTS (
			SELECT 1 FROM discounts d
			WHERE d.enrollment_id = e.id AND d.deleted_at IS NULL AND d.type = 'sibling'
			)
		) AS "hasSiblingDiscount",
		(
			SELECT EXISTS (
			SELECT 1 FROM discounts d
			WHERE d.enrollment_id = e.id AND d.deleted_at IS NULL AND d.type = 'full_year'
			)
		) AS "hasWholeYearDiscount",
		(
			SELECT EXISTS (
			SELECT 1 FROM discounts d
			WHERE d.enrollment_id = e.id AND d.deleted_at IS NULL AND d.type = 'scholar'
			)
		) AS "hasScholarDiscount"
	FROM enrollments e
	LEFT JOIN tuition_payments tp ON tp.enrollment_id = e.id AND tp.deleted_at IS NULL
	LEFT JOIN students s ON s.id = e.student_id AND s.deleted_at IS NULL
	WHERE e.deleted_at IS NULL AND e.id = $1
	GROUP BY
		e.id, s.id, s.first_name, s.middle_name, s.last_name, s.suffix,
		e.type, e.school_year, e.grade_level,
		s.gender, s.birthdate, s.address, s.mother_name, s.mother_job,
		s.mother_education, s.father_name, s.father_job, s.father_education,
		s.living_with, s.contact_numbers, e.monthly_tuition, e.months,
		e.enrollment_fee, e.misc_fee, e.pta_fee, e.lms_books_fee
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	var enrollment models.EditEnrollmentDetails
	enrollment.Student = new(models.Student)

	err := s.db.QueryRowContext(
		ctx,
		query,
		id,
	).Scan(
		&enrollment.ID,
		&enrollment.Student.ID,
		&enrollment.Student.FirstName,
		&enrollment.Student.MiddleName,
		&enrollment.Student.LastName,
		&enrollment.Student.Suffix,
		&enrollment.Student.FullName,
		&enrollment.Student.Gender,
		&enrollment.Student.Birthdate,
		&enrollment.Student.Address,
		&enrollment.Student.MotherName,
		&enrollment.Student.MotherJob,
		&enrollment.Student.MotherEducation,
		&enrollment.Student.FatherName,
		&enrollment.Student.FatherJob,
		&enrollment.Student.FatherEducation,
		&enrollment.Student.LivingWith,
		pq.Array(&enrollment.Student.ContactNumbers),
		&enrollment.Type,
		&enrollment.GradeLevel,
		&enrollment.SchoolYear,
		&enrollment.EnrollmentFee,
		&enrollment.MonthlyTuition,
		&enrollment.MiscFee,
		&enrollment.PtaFee,
		&enrollment.LmsFee,
		&enrollment.IsRankOne,
		&enrollment.HasSiblingDiscount,
		&enrollment.HasWholeYearDiscount,
		&enrollment.HasScholarDiscount,
	)
	if err != nil {
		switch err {
		case sql.ErrNoRows:
			return enrollment, ErrNotFound
		default:
			return enrollment, err
		}
	}

	return enrollment, nil
}

func (s *EnrollmentStore) GetAll(ctx context.Context) ([]models.EnrollmentsTableData, error) {
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
	  e.type,
      e.school_year,
	  e.grade_level,
	  s.gender,
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
    GROUP BY e.id, s.first_name, s.middle_name, s.last_name, s.suffix, s.gender, s.birthdate
	ORDER BY e.created_at DESC
    `

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	rows, err := s.db.QueryContext(
		ctx,
		query,
	)
	if err != nil {
		return nil, err
	}

	var enrollments []models.EnrollmentsTableData

	defer rows.Close()

	for rows.Next() {
		var enrollment models.EnrollmentsTableData
		err := rows.Scan(
			&enrollment.ID,
			&enrollment.FullName,
			&enrollment.Type,
			&enrollment.SchoolYear,
			&enrollment.GradeLevel,
			&enrollment.Gender,
			pq.Array(&enrollment.DiscountTypes),
			&enrollment.TotalAmount,
			&enrollment.TotalPaid,
			&enrollment.RemainingAmount,
			&enrollment.PaymentStatus,
		)
		if err != nil {
			return nil, err
		}
		enrollments = append(enrollments, enrollment)
	}

	return enrollments, nil
}

// *for future server-side table
// func (s *EnrollmentStore) GetAll(ctx context.Context, schoolYear, discount, gradeLevel string, fq PaginatedQuery) ([]models.EnrollmentsTableData, error) {
// 	query := `
//     SELECT
//       e.student_id,
//       TRIM(CONCAT_WS(' ',
//         s.first_name,
//         CASE
//           WHEN s.middle_name IS NOT NULL AND s.middle_name <> ''
//           THEN LEFT(s.middle_name, 1) || '.'
//           ELSE NULL
//         END,
//         s.last_name,
//         s.suffix
//       )) AS full_name,
// 	  e.type,
//       e.school_year,
// 	  e.grade_level,
// 	  s.gender,
// 	  COALESCE(array_agg(DISTINCT d.type) FILTER (WHERE d.type IS NOT NULL), ARRAY[]::text[]) AS discount_types,
//       (e.monthly_tuition * e.months + e.enrollment_fee + e.misc_fee + e.pta_fee + e.lms_books_fee
//          - COALESCE(SUM(d.amount), 0)) AS total_amount
//     FROM enrollments e
//     LEFT JOIN discounts d ON d.enrollment_id = e.id AND d.deleted_at IS NULL
//     LEFT JOIN students s ON s.id = e.student_id AND s.deleted_at IS NULL
//     WHERE e.deleted_at IS NULL
//       AND (COALESCE($1, '') = '' OR $1 = 'All' OR e.school_year = $1)
// 	  AND (COALESCE($2, '') = '' OR $2 = 'All' OR e.grade_level = $2)
// 	  AND (COALESCE($3, '') = '' OR $3 = 'All' OR d.type = $3)
// 	  AND (
// 	  	s.first_name ILIKE '%' || $4 || '%' OR
// 		s.middle_name ILIKE '%' || $4 || '%' OR
// 		s.last_name ILIKE '%' || $4 || '%' OR
// 		s.suffix ILIKE '%' || $4 || '%'
// 		)
//     GROUP BY e.id, s.first_name, s.middle_name, s.last_name, s.suffix, s.gender, s.birthdate
//     ORDER BY ` + fq.SortBy + ` ` + fq.SortDir + `
//     LIMIT $5 OFFSET $6;
//     `

// 	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
// 	defer cancel()

// 	rows, err := s.db.QueryContext(
// 		ctx,
// 		query,
// 		schoolYear,
// 		gradeLevel,
// 		discount,
// 		fq.Search,
// 		fq.Limit,
// 		fq.Offset,
// 	)
// 	if err != nil {
// 		return nil, err
// 	}

// 	var enrollments []models.EnrollmentsTableData

// 	defer rows.Close()

// 	for rows.Next() {
// 		var enrollment models.EnrollmentsTableData
// 		err := rows.Scan(
// 			&enrollment.ID,
// 			&enrollment.FullName,
// 			&enrollment.Type,
// 			&enrollment.SchoolYear,
// 			&enrollment.GradeLevel,
// 			&enrollment.Gender,
// 			pq.Array(&enrollment.DiscountTypes),
// 			&enrollment.TotalAmount,
// 		)
// 		if err != nil {
// 			return nil, err
// 		}
// 		enrollments = append(enrollments, enrollment)
// 	}

// 	return enrollments, nil
// }

func (s *EnrollmentStore) Create(ctx context.Context, enrollment *models.Enrollment) error {
	return withTx(ctx, s.db, func(tx *sql.Tx) error {

		if enrollment.Type == "new" {
			if err := s.createStudent(ctx, tx, enrollment); err != nil {
				return err
			}
		}

		if err := s.createEnrollment(ctx, tx, enrollment); err != nil {
			return err
		}

		if len(enrollment.Discounts) > 0 {
			for _, discount := range enrollment.Discounts {
				switch discount.Type {
				case constants.Rank_1:
					discount.Scope = constants.LmsBooks
				case constants.Sibling, constants.FullYear, constants.Scholar:
					discount.Scope = constants.Tuition
				case constants.Carpool:
					discount.Scope = constants.Carpool
				default:
					continue
				}

				if err := s.createDiscount(ctx, tx, enrollment.ID, discount); err != nil {
					return err
				}
			}
		}

		return nil
	})
}

func (s *EnrollmentStore) Update(ctx context.Context, enrollment *models.Enrollment, enrollmentID uuid.UUID) error {
	return withTx(ctx, s.db, func(tx *sql.Tx) error {
		if err := s.updateStudent(ctx, tx, enrollment); err != nil {
			return err
		}

		if err := s.updateEnrollment(ctx, tx, enrollment, enrollmentID); err != nil {
			return err
		}

		activeTypes := make([]string, 0, len(enrollment.Discounts))
		for _, discount := range enrollment.Discounts {
			switch discount.Type {
			case constants.Rank_1:
				discount.Scope = constants.LmsBooks
			case constants.Sibling, constants.FullYear, constants.Scholar:
				discount.Scope = constants.Tuition
			case constants.Carpool:
				discount.Scope = constants.Carpool
			default:
				continue
			}

			if err := s.updateDiscount(ctx, tx, enrollmentID, discount); err != nil {
				return err
			}

			activeTypes = append(activeTypes, discount.Type)
		}

		if len(activeTypes) == 0 {
			if err := s.softDeleteDiscounts(ctx, tx, enrollmentID); err != nil {
				return err
			}
		} else {
			if err := s.softDeleteMissingDiscounts(ctx, tx, enrollmentID, activeTypes); err != nil {
				return err
			}
		}

		return nil
	})
}

func (s *EnrollmentStore) Delete(ctx context.Context, enrollmentID uuid.UUID) error {
	return withTx(ctx, s.db, func(tx *sql.Tx) error {
		studentID, err := s.softDeleteEnrollment(ctx, tx, enrollmentID)
		if err != nil {
			return err
		}

		hasOtherEnrollments, err := s.checkStudentOtherEnrollments(ctx, tx, studentID)
		if err != nil {
			return err
		}

		if !hasOtherEnrollments {
			if err := s.softDeleteStudent(ctx, tx, studentID); err != nil {
				return err
			}
		}

		return nil
	})
}

func (s *EnrollmentStore) createStudent(ctx context.Context, tx *sql.Tx, enrollment *models.Enrollment) error {
	query := `
		INSERT INTO students 
			(first_name, middle_name, last_name, suffix, gender, birthdate, address,
			mother_name, mother_job, mother_education,
			father_name, father_job, father_education, 
			contact_numbers, living_with)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
		RETURNING id, created_at
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	err := tx.QueryRowContext(
		ctx,
		query,
		enrollment.Student.FirstName,
		enrollment.Student.MiddleName,
		enrollment.Student.LastName,
		enrollment.Student.Suffix,
		enrollment.Student.Gender,
		enrollment.Student.Birthdate,
		enrollment.Student.Address,
		enrollment.Student.MotherName,
		enrollment.Student.MotherJob,
		enrollment.Student.MotherEducation,
		enrollment.Student.FatherName,
		enrollment.Student.FatherJob,
		enrollment.Student.FatherEducation,
		pq.Array(enrollment.Student.ContactNumbers),
		enrollment.Student.LivingWith,
	).Scan(
		&enrollment.Student.ID,
		&enrollment.Student.CreatedAt,
	)

	if err != nil {
		switch err.Error() {
		case `pq: duplicate key value violates unique constraint "idx_unique_student_name_birthday_gender"`:
			return ErrDuplicate
		default:
			return err
		}
	}

	return nil
}

func (s *EnrollmentStore) createEnrollment(ctx context.Context, tx *sql.Tx, enrollment *models.Enrollment) error {
	query := `
		INSERT INTO enrollments
			(student_id, school_year, grade_level, type, monthly_tuition, months, enrollment_fee, misc_fee, pta_fee, 
			lms_books_fee)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id, created_at
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	err := tx.QueryRowContext(
		ctx,
		query,
		enrollment.Student.ID,
		enrollment.SchoolYear,
		enrollment.GradeLevel,
		enrollment.Type,
		enrollment.MonthlyTuition,
		total_school_months,
		enrollment.EnrollmentFee,
		enrollment.MiscFee,
		enrollment.PtaFee,
		enrollment.LmsFee,
	).Scan(
		&enrollment.ID,
		&enrollment.CreatedAt,
	)

	if err != nil {
		return parsePgError(err)
	}

	return nil
}

func (s *EnrollmentStore) createDiscount(ctx context.Context, tx *sql.Tx, enrollmentID uuid.UUID, discount *models.Discount) error {
	query := `
		INSERT INTO discounts
			(enrollment_id, type, scope, amount)
		VALUES ($1, $2, $3, $4)
		RETURNING id, enrollment_id, created_at
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	err := tx.QueryRowContext(
		ctx,
		query,
		enrollmentID,
		discount.Type,
		discount.Scope,
		discount.Amount,
	).Scan(
		&discount.ID,
		&discount.EnrollmentID,
		&discount.CreatedAt,
	)

	if err != nil {
		return err
	}

	return nil
}

func (s *EnrollmentStore) updateStudent(ctx context.Context, tx *sql.Tx, enrollment *models.Enrollment) error {
	query := `
		UPDATE students
		SET 
			first_name = $1,
			middle_name = $2,
			last_name = $3,
			suffix = $4,
			gender = $5,
			birthdate = $6,
			address = $7,
			mother_name = $8,
			mother_job = $9,
			mother_education = $10,
			father_name = $11,
			father_job = $12,
			father_education = $13,
			contact_numbers = $14,
			living_with = $15,
			updated_at = now()
		WHERE
			id = $16 AND deleted_at IS NULL
		RETURNING updated_at
	`
	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	err := tx.QueryRowContext(
		ctx,
		query,
		enrollment.Student.FirstName,
		enrollment.Student.MiddleName,
		enrollment.Student.LastName,
		enrollment.Student.Suffix,
		enrollment.Student.Gender,
		enrollment.Student.Birthdate,
		enrollment.Student.Address,
		enrollment.Student.MotherName,
		enrollment.Student.MotherJob,
		enrollment.Student.MotherEducation,
		enrollment.Student.FatherName,
		enrollment.Student.FatherJob,
		enrollment.Student.FatherEducation,
		pq.Array(enrollment.Student.ContactNumbers),
		enrollment.Student.LivingWith,
		enrollment.Student.ID,
	).Scan(
		&enrollment.Student.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return ErrNotFound
		}
		switch err.Error() {
		case `pq: duplicate key value violates unique constraint "idx_unique_student_name_birthday_gender"`:
			return ErrDuplicate
		default:
			return err
		}
	}

	return nil
}

func (s *EnrollmentStore) updateEnrollment(ctx context.Context, tx *sql.Tx, enrollment *models.Enrollment, enrollmentID uuid.UUID) error {
	query := `
		UPDATE enrollments
		SET
			school_year = $1,
			grade_level = $2,
			monthly_tuition = $3,
			enrollment_fee = $4,
			misc_fee = $5,
			pta_fee = $6,
			lms_books_fee = $7,
			updated_at = now()
		WHERE
			id = $8 AND deleted_at IS NULL
		RETURNING updated_at
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	err := tx.QueryRowContext(
		ctx,
		query,
		enrollment.SchoolYear,
		enrollment.GradeLevel,
		enrollment.MonthlyTuition,
		enrollment.EnrollmentFee,
		enrollment.MiscFee,
		enrollment.PtaFee,
		enrollment.LmsFee,
		enrollmentID,
	).Scan(
		&enrollment.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return ErrNotFound
		}
		return parsePgError(err)
	}

	return nil
}

func (s *EnrollmentStore) updateDiscount(ctx context.Context, tx *sql.Tx, enrollmentID uuid.UUID, discount *models.Discount) error {
	query := `
	INSERT INTO discounts 
		(enrollment_id, type, scope, amount, created_at, updated_at)
	VALUES 
		($1, $2, $3, $4, now(), now())
	ON CONFLICT 
		(enrollment_id, type, scope)
	WHERE 
		deleted_at IS NULL
	DO UPDATE SET
		amount = EXCLUDED.amount,
		updated_at = now(),
		deleted_at = NULL
	RETURNING id, type, scope, amount, created_at, updated_at
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	err := tx.QueryRowContext(
		ctx,
		query,
		enrollmentID,
		discount.Type,
		discount.Scope,
		discount.Amount,
	).Scan(
		&discount.ID,
		&discount.Type,
		&discount.Scope,
		&discount.Amount,
		&discount.CreatedAt,
		&discount.UpdatedAt,
	)
	if err != nil {
		return err
	}

	return nil
}

func (s *EnrollmentStore) softDeleteMissingDiscounts(ctx context.Context, tx *sql.Tx, enrollmentID uuid.UUID, activeTypes []string) error {
	// Soft-delete only types not in activeTypes, excluding carpool
	query := `
		UPDATE discounts
		SET deleted_at = now(), updated_at = now()
		WHERE enrollment_id = $1
			AND deleted_at IS NULL
			AND type NOT IN (SELECT unnest($2::text[]))
			AND type != 'carpool'
		`
	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	_, err := tx.ExecContext(ctx, query, enrollmentID, pq.Array(activeTypes))
	if err != nil {
		return err
	}

	return nil
}

func (s *EnrollmentStore) softDeleteEnrollment(ctx context.Context, tx *sql.Tx, enrollmentID uuid.UUID) (uuid.UUID, error) {
	query := `
		UPDATE enrollments SET
			deleted_at = now()
		WHERE id = $1
		RETURNING student_id
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	var studentID uuid.UUID

	err := tx.QueryRowContext(ctx, query, enrollmentID).Scan(&studentID)
	if err != nil {
		if err == sql.ErrNoRows {
			return studentID, ErrNotFound
		}
		return studentID, err
	}

	return studentID, nil
}

func (s *EnrollmentStore) checkStudentOtherEnrollments(ctx context.Context, tx *sql.Tx, studentID uuid.UUID) (bool, error) {
	query := `
		SELECT COUNT(1) FROM students
		WHERE id = $1 AND deleted_at IS NULL
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	var count int

	err := tx.QueryRowContext(ctx, query, studentID).Scan(&count)
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func (s *EnrollmentStore) softDeleteStudent(ctx context.Context, tx *sql.Tx, studentID uuid.UUID) error {
	query := `
		UPDATE students SET
		deleted_at = now()
		WHERE id = $1
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	rows, err := tx.ExecContext(ctx, query, studentID)
	if err != nil {
		return nil
	}

	row, err := rows.RowsAffected()
	if err != nil {
		return err
	}

	if row == 0 {
		return ErrNotFound
	}

	return nil
}

func (s *EnrollmentStore) softDeleteDiscounts(ctx context.Context, tx *sql.Tx, enrollmentID uuid.UUID) error {
	query := `
			UPDATE discounts
			SET deleted_at = now(), updated_at = now()
			WHERE enrollment_id = $1
			  AND deleted_at IS NULL
			  AND type != 'carpool'
		`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	_, err := tx.ExecContext(ctx, query, enrollmentID)
	if err == nil {
		return err
	}

	return nil
}
