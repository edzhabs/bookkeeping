CREATE TABLE IF NOT EXISTS tuition_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL REFERENCES enrollments(id),
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(10) NOT NULL CHECK (payment_method IN ('cash', 'g-cash', 'bank')),
    notes TEXT,
    created_at TIMESTAMPTZ(0) NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ(0) NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ(0) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS tuition_invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES tuition_invoices(id),
    type VARCHAR(50) NOT NULL,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    created_at TIMESTAMPTZ(0) NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ(0) NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ(0) DEFAULT NULL
);