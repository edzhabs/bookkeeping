CREATE TABLE IF NOT EXISTS students(
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    suffix VARCHAR(10) DEFAULT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    birthdate DATE NOT NULL,
    address TEXT NOT NULL,
    mother_name VARCHAR(255) DEFAULT NULL,
    mother_occupation VARCHAR(100) DEFAULT NULL,
    mother_education_attain VARCHAR(100) DEFAULT NULL,
    father_name VARCHAR(255) DEFAULT NULL,
    father_occupation VARCHAR(100) DEFAULT NULL,
    father_education_attain VARCHAR(100) DEFAULT NULL,
    contact_numbers VARCHAR(15) [],
    living_with VARCHAR(100) DEFAULT NULL,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    updated_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ(0) DEFAULT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_student_name_birthday_gender
ON students (
    UPPER(first_name), UPPER(middle_name), UPPER(last_name), birthdate, LOWER(gender), COALESCE(suffix, '')
    )
WHERE deleted_at IS NULL;