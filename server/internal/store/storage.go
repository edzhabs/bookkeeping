package store

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

var (
	ErrNotFound       = errors.New("record not found")
	ErrConflict       = errors.New("resource already exist")
	QueryTimeDuration = time.Second * 5
)

type Storage struct {
	Students interface {
		Create(ctx context.Context) error
	}
}

func New(db *sql.DB) Storage {
	return Storage{
		Students: &StudentStore{db},
	}
}
