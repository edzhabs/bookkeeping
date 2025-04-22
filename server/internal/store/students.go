package store

import (
	"context"
	"database/sql"
	"time"

	"github.com/lib/pq"
)

type Student struct {
	ID               int64     `json:"id"`
	FirstName        string    `json:"first_name"`
	MiddleName       string    `json:"middle_name"`
	LastName         string    `json:"last_name"`
	Suffix           string    `json:"suffix"`
	Gender           string    `json:"gender"`
	Birthdate        time.Time `json:"birthdate"`
	Address          string    `json:"address"`
	MotherName       string    `json:"mother_name"`
	MotherOccupation string    `json:"mother_occupation"`
	MotherEducAttain string    `json:"mother_education_attain"`
	FatherName       string    `json:"father_name"`
	FatherOccupation string    `json:"father_occupation"`
	FatherEducAttain string    `json:"father_education_attain"`
	ContactNumbers   []string  `json:"contact_numbers"`
	LivingWith       string    `json:"living_with"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
	DeletedAt        time.Time `json:"deleted_at"`
}

type StudentWithAge struct {
	Student
	Age int
}

type StudentStore struct {
	db *sql.DB
}

func (s *StudentStore) Create(ctx context.Context, student *Student) error {
	query := `
		INSERT INTO students 
			(first_name, middle_name, last_name, suffix, gender, birthdate, address,
			mother_name, mother_occupation, mother_education_attain,
			father_name, father_occupation, father_education_attain, 
			contact_numbers, living_with)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
		RETURNING id, created_at
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	err := s.db.QueryRowContext(
		ctx,
		query,
		student.FirstName,
		student.MiddleName,
		student.LastName,
		student.Suffix,
		student.Gender,
		student.Birthdate,
		student.Address,
		student.MotherName,
		student.MotherOccupation,
		student.MotherEducAttain,
		student.FatherName,
		student.FatherOccupation,
		student.FatherEducAttain,
		pq.Array(student.ContactNumbers),
		student.LivingWith,
	).Scan(
		&student.ID,
		&student.CreatedAt,
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

func (s *StudentStore) GetAll(ctx context.Context, fq PaginatedQuery) ([]StudentWithAge, error) {
	query := `
		SELECT id, first_name, middle_name, last_name, suffix, gender, birthdate, 
			EXTRACT(YEAR FROM age(birthdate)) AS age, address, mother_name, mother_occupation,
			mother_education_attain, father_name, father_occupation, father_education_attain,
			contact_numbers, living_with, created_at
		FROM students
		WHERE
			(last_name ILIKE '%' || $1 || '%' OR middle_name ILIKE '%' || $1 || '%' OR first_name ILIKE '%' || $1 || '%' OR last_name ILIKE '%' || $1 || '%') AND
			deleted_at IS NULL
		LIMIT $2
		OFFSET $3
	`

	ctx, cancel := context.WithTimeout(ctx, QueryTimeDuration)
	defer cancel()

	rows, err := s.db.QueryContext(
		ctx,
		query,
		fq.Search,
		fq.Limit,
		fq.Offset,
	)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var students []StudentWithAge

	for rows.Next() {
		var student StudentWithAge
		err := rows.Scan(
			&student.ID,
			&student.FirstName,
			&student.MiddleName,
			&student.LastName,
			&student.Suffix,
			&student.Gender,
			&student.Birthdate,
			&student.Age,
			&student.Address,
			&student.MotherName,
			&student.MotherOccupation,
			&student.MotherEducAttain,
			&student.FatherName,
			&student.FatherOccupation,
			&student.FatherEducAttain,
			pq.Array(&student.ContactNumbers),
			&student.LivingWith,
			&student.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		students = append(students, student)
	}

	return students, nil
}
