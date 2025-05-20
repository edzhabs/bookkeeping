package store

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/edzhabs/bookkeeping/internal/models"
	"github.com/google/uuid"
	"github.com/lib/pq"
)

var (
	ErrConflict       = errors.New("resource already exist")
	ErrRequiredFees   = errors.New("enrollment, tuition, misc, pta, lms_books fees must be greater than zero")
	ErrDuplicate      = errors.New("student with that record already exist")
	ErrNotFound       = errors.New("record not found")
	QueryTimeDuration = time.Second * 5
)

type Storage struct {
	Students interface {
		Create(ctx context.Context, student *models.Student) error
		GetAll(ctx context.Context) ([]StudentWithAge, error)
		GetDropdown(ctx context.Context) ([]models.StudentDropdown, error)
	}
	Enrollments interface {
		Create(ctx context.Context, enrollment *models.Enrollment) error
		GetAll(ctx context.Context) ([]models.EnrollmentsTableData, error)
		GetStudentByID(ctx context.Context, id uuid.UUID) (models.EnrollmentStudentDetails, error)
	}
}

func NewStorage(db *sql.DB) Storage {
	return Storage{
		Students:    &StudentStore{db},
		Enrollments: &EnrollmentStore{db},
	}
}

func withTx(ctx context.Context, db *sql.DB, fn func(tx *sql.Tx) error) error {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	err = fn(tx)
	if err != nil {
		_ = tx.Rollback()
		return err
	}

	return tx.Commit()
}

func parsePgError(err error) error {
	var pgErr *pq.Error
	if errors.As(err, &pgErr) {
		switch pgErr.Constraint {
		case "enrollments_student_id_school_year_key":
			return ErrDuplicate
		case "check_positive_fees":
			return ErrRequiredFees
		}
	}

	return err
}
