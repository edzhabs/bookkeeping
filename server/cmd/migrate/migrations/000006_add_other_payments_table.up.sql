CREATE TABLE IF NOT EXISTS other_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL REFERENCES enrollments(id),
    invoice_number VARCHAR(100) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(10) NOT NULL CHECK (payment_method IN ('cash', 'g-cash', 'bank')),
    notes TEXT,
    created_at TIMESTAMPTZ(0) NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ(0) NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ(0) DEFAULT NULL,
    UNIQUE(invoice_number, deleted_at)
);

CREATE TABLE IF NOT EXISTS other_invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES other_invoices(id),
    category VARCHAR(50) NOT NULL,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    remarks TEXT, 
    created_at TIMESTAMPTZ(0) NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ(0) NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ(0) DEFAULT NULL,

    CHECK (
        category != 'others' OR (remarks IS NOT NULL AND LENGTH(TRIM(remarks)) > 0)
    )
);