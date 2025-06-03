package models

import (
	"time"

	"github.com/google/uuid"
)

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

type StudentDropdown struct {
	ID         uuid.UUID `json:"id"`
	FirstName  string    `json:"first_name"`
	MiddleName string    `json:"middle_name"`
	LastName   string    `json:"last_name"`
	Suffix     string    `json:"suffix"`
	Address    string    `json:"address"`
	SchoolYear string    `json:"school_year"`
	GradeLevel string    `json:"grade_level"`
}

type BaseStudent struct {
	ID         uuid.UUID `json:"id"`
	FirstName  string    `json:"first_name"`
	MiddleName string    `json:"middle_name"`
	LastName   string    `json:"last_name"`
	Suffix     string    `json:"suffix"`
	FullName   string    `json:"full_name"`
	Gender     string    `json:"gender"`
	Birthdate  time.Time `json:"birthdate"`
	Address    string    `json:"address"`
}
