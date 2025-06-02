-- Drop the new hard unique constraint
ALTER TABLE discounts
DROP CONSTRAINT IF EXISTS discounts_unique_enrollment_type_scope;

-- Recreate the old soft-delete-aware constraint
ALTER TABLE discounts
ADD CONSTRAINT discounts_enrollment_type_scope_deleted_at_unique
UNIQUE (enrollment_id, type, scope, deleted_at);