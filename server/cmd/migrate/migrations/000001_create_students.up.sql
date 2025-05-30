CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    suffix VARCHAR(10) DEFAULT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    birthdate DATE NOT NULL,
    address TEXT NOT NULL,
    mother_name VARCHAR(255) DEFAULT NULL,
    mother_job VARCHAR(100) DEFAULT NULL,
    mother_education VARCHAR(100) DEFAULT NULL,
    father_name VARCHAR(255) DEFAULT NULL,
    father_job VARCHAR(100) DEFAULT NULL,
    father_education VARCHAR(100) DEFAULT NULL,
    living_with VARCHAR(100) DEFAULT NULL,
    contact_numbers VARCHAR(15) [],
    created_at TIMESTAMPTZ(0) NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ(0) NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ(0) DEFAULT NULL,

  UNIQUE(id)
);

-- Avoid duplicate student entries (case-insensitive and ignores deleted rows)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_student_name_birthday_gender
ON students (
  UPPER(first_name),
  UPPER(middle_name),
  UPPER(last_name),
  birthdate,
  LOWER(gender),
  COALESCE(suffix, ''),
  deleted_at
)
WHERE deleted_at IS NULL;
