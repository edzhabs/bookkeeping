package db

import (
	"context"
	"database/sql"
	"log"
	"math/rand"
	"strings"
	"time"

	"github.com/edzhabs/bookkeeping/internal/constants"
	"github.com/edzhabs/bookkeeping/internal/models"
	"github.com/edzhabs/bookkeeping/internal/store"
	"github.com/shopspring/decimal"
)

var firstNames = []string{
	"Lucas", "Isabella", "Ethan", "Chloe", "Aiden",
	"Mia", "James", "Aria", "Benjamin", "Lily",
	"Alexander", "Grace", "Elijah", "Sofia", "Henry",
	"Zoe", "Daniel", "Nora", "Matthew", "Avery",
	"Jackson", "Ella", "Logan", "Scarlett", "Leo",
}
var middleNames = []string{
	"Marie", "James", "Ann", "Lee", "Ray",
	"Grace", "Jean", "Paul", "Rose", "Dale",
	"Mae", "John", "Skye", "Blake", "Kai",
	"Hope", "Noel", "Jude", "Reese", "Lane",
	"Blue", "Quinn", "Jade", "Brooke", "Finn",
}
var lastNames = []string{
	"Smith", "Johnson", "Williams", "Brown", "Jones",
	"Miller", "Davis", "Garcia", "Rodriguez", "Martinez",
	"Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
	"Thomas", "Taylor", "Moore", "Jackson", "Martin",
	"Lee", "Perez", "Thompson", "White", "Harris",
}
var suffixes = []string{"", "Jr.", "III", "Sr."}
var genders = []string{"male", "female"}
var addresses = []string{"123 Main St", "456 Oak Ave", "789 Pine Rd", "321 Maple Blvd"}
var occupations = []string{"Teacher", "Engineer", "Nurse", "Driver", "Vendor", "Farmer", "Carpenter"}
var educationLevels = []string{"High School", "College", "Vocational", "Elementary", "None"}
var livingWiths = []string{"Mother", "Father", "Both Parents", "Guardian", "Relatives"}

// var types = []string{"old", "new"}
var years = []string{"2023-2024", "2024-2025", "2025-2026"}
var gradeLevels = []string{
	"nursery-1", "nursery-2", "kinder-1", "kinder-2",
	"grade-1", "grade-2", "grade-3", "grade-4", "grade-5", "grade-6",
}
var discountsSeed = [][]string{
	{"rank_1"},
	{"rank_1", "scholar"},
	{"rank_1", "sibling"},
	{"rank_1", "full_year"},
	{},
}

func generateRandomDate(start, end time.Time) time.Time {
	delta := end.Sub(start)
	seconds := rand.Int63n(int64(delta.Seconds()))
	return start.Add(time.Duration(seconds) * time.Second)
}

func randomPhoneNumber() string {
	return "09" + randomDigits(9)
}

func randomDigits(n int) string {
	digits := ""
	for i := 0; i < n; i++ {
		digits += string('0' + rand.Intn(10))
	}
	return digits
}

func Seed(store store.Storage, db *sql.DB) {
	ctx := context.Background()

	enrollments := generateEnrollments(100)
	for _, enrollment := range enrollments {
		log.Printf("enrollment: %v", enrollment)
		if err := store.Enrollments.Create(ctx, enrollment); err != nil {
			log.Printf("Error creating enrollment: %v, err: %s", enrollment, err)
			return
		}
	}

	log.Println("Seeding Complete")
}

func generateEnrollments(num int) []*models.Enrollment {
	enrollments := make([]*models.Enrollment, num)

	for i := 0; i < num; i++ {
		grade := gradeLevels[rand.Intn(len(gradeLevels))]
		isGradeSchool := strings.HasPrefix(grade, "grade")
		studentType := "new"

		// Fees
		var monthlyTuition, enrollmentFee, miscFee, ptaFee, lmsBooksFee decimal.Decimal

		miscFee = decimal.NewFromInt(500)
		ptaFee = decimal.NewFromInt(300)

		if isGradeSchool {
			monthlyTuition = decimal.NewFromInt(2600)
			if studentType == "new" {
				enrollmentFee = decimal.NewFromInt(4000)
				lmsBooksFee = decimal.NewFromInt(8000)
			} else {
				enrollmentFee = decimal.NewFromInt(3500)
				lmsBooksFee = decimal.NewFromInt(7500)
			}
		} else {
			monthlyTuition = decimal.NewFromInt(1800)
			if studentType == "new" {
				enrollmentFee = decimal.NewFromInt(4000)
			} else {
				enrollmentFee = decimal.NewFromInt(3500)
			}
			lmsBooksFee = decimal.Zero // not applicable
		}

		var discounts []*models.Discount
		dis := discountsSeed[rand.Intn(len(discountsSeed))]
		if len(dis) > 0 {
			for _, d := range dis {
				discount := &models.Discount{}
				total_tuition := monthlyTuition.Mul(decimal.NewFromInt(10))
				switch strings.ToLower(d) {
				case constants.Rank_1:
					if isGradeSchool {
						discount.Type = constants.Rank_1
						discount.Amount = lmsBooksFee
					}
				case constants.Sibling:
					discount.Type = constants.Sibling
					discount.Amount = total_tuition.Mul(decimal.NewFromFloat(0.05))
				case constants.FullYear:
					discount.Type = constants.FullYear
					discount.Amount = monthlyTuition
				case constants.Scholar:
					discount.Type = constants.Scholar
					discount.Amount = total_tuition.Mul(decimal.NewFromFloat(0.5))
				default:
					continue
				}
				discounts = append(discounts, discount)

			}
		}

		// student
		gender := genders[rand.Intn(len(genders))]
		birthdate := generateRandomDate(
			time.Date(2007, 1, 1, 0, 0, 0, 0, time.UTC),
			time.Date(2012, 12, 31, 0, 0, 0, 0, time.UTC),
		)

		contactCount := rand.Intn(3) + 1 // 1 to 3 numbers
		contactNumbers := make([]string, contactCount)
		for j := 0; j < contactCount; j++ {
			contactNumbers[j] = randomPhoneNumber()
		}

		includeParents := rand.Intn(2) == 1

		student := &models.Student{
			FirstName:      firstNames[rand.Intn(len(firstNames))],
			MiddleName:     middleNames[rand.Intn(len(middleNames))],
			LastName:       lastNames[rand.Intn(len(lastNames))],
			Suffix:         suffixes[rand.Intn(len(suffixes))],
			Gender:         gender,
			Birthdate:      birthdate,
			Address:        addresses[rand.Intn(len(addresses))],
			ContactNumbers: contactNumbers,
			LivingWith:     livingWiths[rand.Intn(len(livingWiths))],
		}

		if includeParents {
			student.MotherName = firstNames[rand.Intn(len(firstNames))] + " " + lastNames[rand.Intn(len(lastNames))]
			student.MotherJob = occupations[rand.Intn(len(occupations))]
			student.MotherEducation = educationLevels[rand.Intn(len(educationLevels))]
			student.FatherName = firstNames[rand.Intn(len(firstNames))] + " " + lastNames[rand.Intn(len(lastNames))]
			student.FatherJob = occupations[rand.Intn(len(occupations))]
			student.FatherEducation = educationLevels[rand.Intn(len(educationLevels))]
		}

		enrollment := &models.Enrollment{
			Student:        student,
			SchoolYear:     years[rand.Intn(len(years))],
			Type:           studentType,
			GradeLevel:     grade,
			MonthlyTuition: monthlyTuition,
			EnrollmentFee:  enrollmentFee,
			MiscFee:        miscFee,
			PtaFee:         ptaFee,
			LmsFee:         lmsBooksFee,
			Discounts:      discounts,
		}
		enrollments[i] = enrollment

	}

	return enrollments

}
