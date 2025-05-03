package store

import (
	"context"
	"database/sql"

	"github.com/edzhabs/bookkeeping/internal/models"
	"github.com/lib/pq"
)

type StudentWithAge struct {
	models.Student
	Age int
}

type StudentStore struct {
	db *sql.DB
}

func (s *StudentStore) Create(ctx context.Context, student *Student) error {
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
		student.MotherJob,
		student.MotherEducation,
		student.FatherName,
		student.FatherJob,
		student.FatherEducation,
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

func (s *StudentStore) GetAll(ctx context.Context) ([]StudentWithAge, error) {
	// query := `
	// 	SELECT id, first_name, middle_name, last_name, suffix,
	// 		CONCAT_WS(' ', first_name, middle_name, last_name) AS full_name,
	// 		gender, birthdate, EXTRACT(YEAR FROM age(birthdate)) AS age,
	// 		address, mother_name, mother_occupation,
	// 		mother_education_attain, father_name, father_occupation, father_education_attain,
	// 		contact_numbers, living_with, created_at
	// 	FROM students
	// 	WHERE
	// 		(last_name ILIKE '%' || $1 || '%' OR middle_name ILIKE '%' || $1 || '%' OR first_name ILIKE '%' || $1 || '%' OR last_name ILIKE '%' || $1 || '%') AND
	// 		deleted_at IS NULL
	// 	ORDER BY created_at DESC
	// `

	query := `
		SELECT id, first_name, middle_name, last_name, suffix, 
			CONCAT_WS(' ', first_name, middle_name, last_name) AS full_name,
			gender, birthdate, EXTRACT(YEAR FROM age(birthdate)) AS age,  
			address, mother_name, mother_occupation,
			mother_education_attain, father_name, father_occupation, father_education_attain,
			contact_numbers, living_with, created_at
		FROM students
		WHERE
			deleted_at IS NULL
		ORDER BY created_at DESC
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
			&student.FullName,
			&student.Gender,
			&student.Birthdate,
			&student.Age,
			&student.Address,
			&student.MotherName,
			&student.MotherJob,
			&student.MotherEducation,
			&student.FatherName,
			&student.FatherJob,
			&student.FatherEducation,
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
