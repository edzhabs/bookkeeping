CREATE TABLE IF NOT EXISTS tuition_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL REFERENCES enrollments(id),
    invoice_number VARCHAR(100) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(10) NOT NULL CHECK (payment_method IN ('cash', 'gcash', 'bank')),
    reservation_fee NUMERIC(10,2),
    tuition_fee NUMERIC(10,2),
    advance_payment NUMERIC(10,2),
    notes TEXT,

    created_at TIMESTAMPTZ(0) NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ(0) NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ(0) DEFAULT NULL,

    UNIQUE(invoice_number)
);