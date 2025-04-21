package utils

import (
	"regexp"
	"strings"
	"time"

	"github.com/go-playground/validator/v10"
)

var Validate *validator.Validate

func init() {
	Validate = validator.New(validator.WithRequiredStructEnabled())
	Validate.RegisterValidation("trimmedSpace", trimmedSpace)
	Validate.RegisterValidation("birthday", validBirthday)
	Validate.RegisterValidation("alpha_with_spaces", validateAlphaWithSpaces)
}

func trimmedSpace(fl validator.FieldLevel) bool {
	str := fl.Field().String()
	return strings.TrimSpace(str) == str
}

// Custom validation function to allow alphabetic characters and spaces
func validateAlphaWithSpaces(fl validator.FieldLevel) bool {
	// The regex allows alphabetic characters and spaces
	re := regexp.MustCompile(`^[A-Za-z\s]+$`)
	return re.MatchString(fl.Field().String())
}

func validBirthday(fl validator.FieldLevel) bool {
	// Define the expected layout for the birthday string (e.g., "2006-01-02" format)
	layout := "2006-01-02"

	// Get the birthday string from the field
	birthdayStr := fl.Field().String()

	// Try to parse the string into time.Time
	birthday, err := time.Parse(layout, birthdayStr)
	if err != nil {
		return false // Return false if parsing fails
	}

	// Optionally, check if the birthday is in the past (you can adjust this as needed)
	// You can skip this if you just want to ensure the date is valid without checking if it's in the past
	if birthday.After(time.Now()) {
		return false // If the birthday is in the future, it's invalid
	}

	// If everything is good, return true
	return true
}
