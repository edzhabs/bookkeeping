CREATE TABLE IF NOT EXISTS other_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL REFERENCES enrollments(id),
    invoice_number VARCHAR(100) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(10) NOT NULL CHECK (payment_method IN ('cash', 'gcash', 'bank')),
    amount NUMERIC(10,2),
    category VARCHAR(50) NOT NULL,
    remarks TEXT,  -- only required if category = 'others'
    notes TEXT,
    created_at TIMESTAMPTZ(0) NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ(0) NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ(0) DEFAULT NULL,

    UNIQUE(invoice_number),

    CHECK (
        -- If category is 'others', remarks must be non-null and not just empty/whitespace
        category != 'others' OR (remarks IS NOT NULL AND LENGTH(TRIM(remarks)) > 0)
    )
);