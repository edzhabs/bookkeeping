package db

import (
	"context"
	"database/sql"
	"log"
	"math/rand"
	"time"

	"github.com/edzhabs/bookkeeping/internal/store"
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

	students := generateStudents(100)
	for _, student := range students {
		if err := store.Students.Create(ctx, student); err != nil {
			log.Printf("Error creating student: %v, err: %s", student, err)
			return
		}
	}

	log.Println("Seeding Complete")
}

func generateStudents(num int) []*store.Student {
	students := make([]*store.Student, num)

	for i := 0; i < num; i++ {
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

		students[i] = &store.Student{
			FirstName:       firstNames[rand.Intn(len(firstNames))],
			MiddleName:      middleNames[rand.Intn(len(middleNames))],
			LastName:        lastNames[rand.Intn(len(lastNames))],
			Suffix:          suffixes[rand.Intn(len(suffixes))],
			Gender:          gender,
			Birthdate:       birthdate,
			Address:         addresses[rand.Intn(len(addresses))],
			MotherName:      firstNames[rand.Intn(len(firstNames))] + " " + lastNames[rand.Intn(len(lastNames))],
			MotherJob:       occupations[rand.Intn(len(occupations))],
			MotherEducation: educationLevels[rand.Intn(len(educationLevels))],
			FatherName:      firstNames[rand.Intn(len(firstNames))] + " " + lastNames[rand.Intn(len(lastNames))],
			FatherJob:       occupations[rand.Intn(len(occupations))],
			FatherEducation: educationLevels[rand.Intn(len(educationLevels))],
			ContactNumbers:  contactNumbers,
			LivingWith:      livingWiths[rand.Intn(len(livingWiths))],
		}
	}

	return students
}
