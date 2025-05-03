package store

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"github.com/shopspring/decimal"
)

var total_school_months = 10

type Enrollment struct {
	Student        *Student        `json:"student"`
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

type EnrollmentStore struct {
	db *sql.DB
}

func (s *EnrollmentStore) Create(ctx context.Context, enrollment *Enrollment) error {
	return withTx(ctx, s.db, func(tx *sql.Tx) error {
		if err := s.createStudent(ctx, tx, enrollment); err != nil {
			return err
		}

		if err := s.createEnrollment(ctx, tx, enrollment); err != nil {
			return err
		}

		if len(enrollment.Discounts) > 0 {
			for _, discount := range enrollment.Discounts {
				if err := s.createDiscount(ctx, tx, enrollment.ID, discount); err != nil {
					return err
				}
			}
		}

		return nil
	})
}

func (s *EnrollmentStore) createStudent(ctx context.Context, tx *sql.Tx, student *Enrollment) error {
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
		student.Student.FirstName,
		student.Student.MiddleName,
		student.Student.LastName,
		student.Student.Suffix,
		student.Student.Gender,
		student.Student.Birthdate,
		student.Student.Address,
		student.Student.MotherName,
		student.Student.MotherJob,
		student.Student.MotherEducation,
		student.Student.FatherName,
		student.Student.FatherJob,
		student.Student.FatherEducation,
		pq.Array(student.Student.ContactNumbers),
		student.Student.LivingWith,
	).Scan(
		&student.Student.ID,
		&student.Student.CreatedAt,
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

func (s *EnrollmentStore) createEnrollment(ctx context.Context, tx *sql.Tx, enrollment *Enrollment) error {
	query := `
		INSERT INTO enrollments
			(student_id, school_year, monthly_tuition, months, enrollment_fee, misc_fee, pta_fee,
			lms_books_fee)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, created_at
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	err := tx.QueryRowContext(
		ctx,
		query,
		enrollment.Student.ID,
		enrollment.SchoolYear,
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

func (s *EnrollmentStore) createDiscount(ctx context.Context, tx *sql.Tx, enrollmentID uuid.UUID, discount *Discount) error {
	query := `
		INSERT INTO discounts
			(enrollment_id, type, amount)
		VALUES ($1, $2, $3)
		RETURNING id, enrollment_id, created_at
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	err := tx.QueryRowContext(
		ctx,
		query,
		enrollmentID,
		discount.Type,
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
