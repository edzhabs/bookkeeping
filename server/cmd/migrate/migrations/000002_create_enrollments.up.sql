-- Create tables
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id),
    school_year VARCHAR(20) NOT NULL,
    grade_level VARCHAR(20) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('new', 'old')),
    monthly_tuition NUMERIC(10,2) NOT NULL,
    months INTEGER NOT NULL DEFAULT 10,
    enrollment_fee NUMERIC(10,2) NOT NULL,
    misc_fee NUMERIC(10,2) NOT NULL,
    pta_fee NUMERIC(10,2) NOT NULL,
    lms_books_fee NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ(0) NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ(0) NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ(0) DEFAULT NULL,
    UNIQUE(student_id, school_year)
);

-- Discounts table
CREATE TABLE discounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL REFERENCES enrollments(id),
    type VARCHAR(10) NOT NULL CHECK (type IN ('rank_1', 'sibling', 'full_year', 'scholar', 'carpool')),
    scope TEXT NOT NULL CHECK (scope IN ('tuition', 'lms_books', 'carpool')),
    amount NUMERIC(10,2),
    created_at TIMESTAMPTZ(0) NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ(0) NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ(0) DEFAULT NULL
);

-- Create function for the discount validation trigger
CREATE OR REPLACE FUNCTION validate_discount_rules()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure carpool is alone
    IF NEW.type = 'carpool' THEN
        IF EXISTS (
            SELECT 1 FROM discounts d
            WHERE d.enrollment_id = NEW.enrollment_id
              AND d.type != 'carpool'
              AND d.deleted_at IS NULL
        ) THEN
            RAISE EXCEPTION 'Cannot combine carpool discount with other discounts.';
        END IF;
    ELSE
        -- Ensure sibling, full_year, and scholar cannot coexist
        IF (NEW.type = 'sibling' AND EXISTS (
            SELECT 1 FROM discounts d
            WHERE d.enrollment_id = NEW.enrollment_id
              AND d.type IN ('full_year', 'scholar')
              AND d.deleted_at IS NULL
        )) OR
           (NEW.type = 'full_year' AND EXISTS (
            SELECT 1 FROM discounts d
            WHERE d.enrollment_id = NEW.enrollment_id
              AND d.type IN ('sibling', 'scholar')
              AND d.deleted_at IS NULL
        )) OR
           (NEW.type = 'scholar' AND EXISTS (
            SELECT 1 FROM discounts d
            WHERE d.enrollment_id = NEW.enrollment_id
              AND d.type IN ('sibling', 'full_year')
              AND d.deleted_at IS NULL
        )) THEN
            RAISE EXCEPTION 'Cannot combine sibling, full_year, and scholar tuition discounts.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER check_discount_rules
BEFORE INSERT OR UPDATE ON discounts
FOR EACH ROW
EXECUTE FUNCTION validate_discount_rules();