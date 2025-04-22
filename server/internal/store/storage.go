package store

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

var (
	ErrConflict       = errors.New("resource already exist")
	ErrDuplicate      = errors.New("student with that record already exist")
	ErrNotFound       = errors.New("record not found")
	QueryTimeDuration = time.Second * 5
)

type Storage struct {
	Students interface {
		Create(ctx context.Context, student *Student) error
		GetAll(ctx context.Context, fq PaginatedQuery) ([]StudentWithAge, error)
	}
}

func NewStorage(db *sql.DB) Storage {
	return Storage{
		Students: &StudentStore{db},
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
