-- Create tables
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id),
    school_year VARCHAR(20) NOT NULL,
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
    amount NUMERIC(10,2),
    created_at TIMESTAMPTZ(0) NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ(0) NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ(0) DEFAULT NULL
);

-- Create function for the discount validation trigger
CREATE OR REPLACE FUNCTION validate_discount_rules()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type IN ('sibling', 'full_year', 'rank_1') THEN
        IF EXISTS (
            SELECT 1 FROM discounts d
            WHERE d.enrollment_id = NEW.enrollment_id
              AND d.type = 'scholar'
              AND d.deleted_at IS NULL
        ) THEN
            RAISE EXCEPTION 'Cannot apply tuition-related discount (%) when scholar discount exists.', NEW.type;
        END IF;
        
        IF (NEW.type = 'sibling' AND EXISTS (
            SELECT 1 FROM discounts d
            WHERE d.enrollment_id = NEW.enrollment_id
              AND d.type = 'full_year'
              AND d.deleted_at IS NULL
        )) OR
           (NEW.type = 'full_year' AND EXISTS (
            SELECT 1 FROM discounts d
            WHERE d.enrollment_id = NEW.enrollment_id
              AND d.type = 'sibling'
              AND d.deleted_at IS NULL
        )) THEN
            RAISE EXCEPTION 'Cannot combine sibling and full year tuition discount.';
        END IF;
    ELSIF NEW.type = 'scholar' THEN
        IF EXISTS (
            SELECT 1 FROM discounts d
            WHERE d.enrollment_id = NEW.enrollment_id
              AND d.type IN ('sibling', 'full_year', 'rank_1')
              AND d.deleted_at IS NULL
        ) THEN
            RAISE EXCEPTION 'Cannot apply scholar with other tuition-related discounts.';
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