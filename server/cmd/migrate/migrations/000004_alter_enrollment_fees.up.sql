ALTER TABLE enrollments
    ADD CONSTRAINT check_positive_fees
    CHECK (
        monthly_tuition > 0 AND
        enrollment_fee > 0 AND
        misc_fee > 0 AND
        pta_fee > 0
    );