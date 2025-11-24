-- Add extended course fields and indexes

ALTER TABLE courses
    ADD COLUMN IF NOT EXISTS code VARCHAR(20),
    ADD COLUMN IF NOT EXISTS credits INTEGER,
    ADD COLUMN IF NOT EXISTS semester VARCHAR(50),
    ADD COLUMN IF NOT EXISTS schedule VARCHAR(255),
    ADD COLUMN IF NOT EXISTS max_students INTEGER,
    ADD COLUMN IF NOT EXISTS start_date DATE,
    ADD COLUMN IF NOT EXISTS end_date DATE;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'uk_courses_code'
          AND conrelid = 'courses'::regclass
    ) THEN
        ALTER TABLE courses ADD CONSTRAINT uk_courses_code UNIQUE (code);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_courses_semester ON courses(semester);
CREATE INDEX IF NOT EXISTS idx_courses_max_students ON courses(max_students);
