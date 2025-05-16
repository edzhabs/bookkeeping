package utils

import (
	"regexp"
	"strings"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/shopspring/decimal"
)

var Validate *validator.Validate

func init() {
	Validate = validator.New(validator.WithRequiredStructEnabled())
	Validate.RegisterValidation("trimmedSpace", trimmedSpace)
	Validate.RegisterValidation("validBirthdate", validBirthdate)
	Validate.RegisterValidation("alpha_with_spaces", validateAlphaWithSpaces)
	Validate.RegisterValidation("schoolyear", validateSchoolYear)
	Validate.RegisterValidation("discounts", validateDiscounts)
	Validate.RegisterValidation("decimalGt", validateDecimalGTZero)
	Validate.RegisterValidation("sortfq", sortValidation)
}

func trimmedSpace(fl validator.FieldLevel) bool {
	str := fl.Field().String()
	return strings.TrimSpace(str) == str
}

func validateAlphaWithSpaces(fl validator.FieldLevel) bool {
	// The regex allows alphabetic characters and spaces
	re := regexp.MustCompile(`^[A-Za-z\s]+$`)
	return re.MatchString(fl.Field().String())
}

func validBirthdate(fl validator.FieldLevel) bool {
	// Define the expected layout for the birthday string (e.g., "2006-01-02" format)
	layout := "2006-01-02"

	birthdayStr := fl.Field().String()

	birthday, err := time.Parse(layout, birthdayStr)
	if err != nil {
		return false
	}

	if birthday.After(time.Now()) {
		return false
	}

	return true
}

func validateSchoolYear(fl validator.FieldLevel) bool {
	schoolYear := fl.Field().String()

	// Match pattern YYYY-YYYY
	pattern := regexp.MustCompile(`^(\d{4})-(\d{4})$`)
	matches := pattern.FindStringSubmatch(schoolYear)

	if len(matches) != 3 {
		return false
	}

	firstYear := matches[1]
	secondYear := matches[2]

	// Check if second year is one more than first year
	if secondYear != firstYear[:2]+firstYear[2:]+"1" {
		firstYearInt := atoi(firstYear)
		secondYearInt := atoi(secondYear)

		if secondYearInt != firstYearInt+1 {
			return false
		}
	}

	return true
}

func validateDiscounts(fl validator.FieldLevel) bool {
	validDiscounts := map[string]bool{
		"rank_1":    true,
		"sibling":   true,
		"full_year": true,
		"scholar":   true,
		"carpool":   true,
	}

	discounts, ok := fl.Field().Interface().([]string)
	if !ok || discounts == nil {
		return true // Allow empty or nil discounts
	}
	seen := make(map[string]bool)

	for _, d := range discounts {
		if !validDiscounts[d] {
			return false
		}
		seen[d] = true
	}

	// Ensure "scholar", "sibling", and "full_year" cannot coexist
	if (seen["scholar"] && seen["sibling"]) || (seen["scholar"] && seen["full_year"]) || (seen["sibling"] && seen["full_year"]) {
		return false
	}

	if seen["carpool"] && len(discounts) > 1 {
		return false
	}

	return true
}

func atoi(s string) int {
	var result int
	for _, c := range s {
		result = result*10 + int(c-'0')
	}
	return result
}

func validateDecimalGTZero(fl validator.FieldLevel) bool {
	value, ok := fl.Field().Interface().(decimal.Decimal)
	if !ok {
		return false // Ensure the field is of type decimal.Decimal
	}
	return value.GreaterThan(decimal.Zero) // Check if the value is greater than 0
}

func sortValidation(fl validator.FieldLevel) bool {
	sortValue := fl.Field().String()
	sortValue = strings.ToUpper(sortValue)
	return sortValue == "ASC" || sortValue == "DESC"

}
