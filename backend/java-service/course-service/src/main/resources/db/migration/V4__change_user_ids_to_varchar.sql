-- Change user IDs from BIGINT to VARCHAR to support UUIDs

-- Alter enrollments table
ALTER TABLE enrollments ALTER COLUMN student_id TYPE VARCHAR(255) USING student_id::varchar;

-- Alter courses table
ALTER TABLE courses ALTER COLUMN instructor_id TYPE VARCHAR(255) USING instructor_id::varchar;
