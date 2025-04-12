package store

import (
	"context"
	"database/sql"
)

type Student struct {
	ID        int64  `json:"id"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

type StudentStore struct {
	db *sql.DB
}

func (s *StudentStore) Create(ctx context.Context) error {
	return nil
}
