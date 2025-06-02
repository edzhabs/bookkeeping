-- Drop existing constraint
ALTER TABLE discounts
DROP CONSTRAINT IF EXISTS discounts_enrollment_id_type_scope_deleted_at_key;

-- Add a new hard unique constraint that works with ON CONFLICT
ALTER TABLE discounts
ADD CONSTRAINT discounts_unique_enrollment_type_scope
UNIQUE (enrollment_id, type, scope);