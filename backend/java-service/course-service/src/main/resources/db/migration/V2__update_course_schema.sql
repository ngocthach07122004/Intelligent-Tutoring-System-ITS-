-- Update Course Service Database Schema to match entities
-- Version: 2.0
-- Description: Update schema to match JPA entities

-- Drop old tables that don't match our entity model
DROP TABLE IF EXISTS user_course_enrollment CASCADE;
DROP TABLE IF EXISTS course_tag CASCADE;
DROP TABLE IF EXISTS prerequisites CASCADE;

-- Alter courses table
ALTER TABLE courses 
    DROP COLUMN IF EXISTS level,
    DROP COLUMN IF EXISTS tags,
    ADD COLUMN IF NOT EXISTS visibility VARCHAR(20) NOT NULL DEFAULT 'PRIVATE',
    ADD COLUMN IF NOT EXISTS thumbnail_url VARCHAR(500),
    ADD COLUMN IF NOT EXISTS objectives TEXT,
    ADD COLUMN IF NOT EXISTS published_at TIMESTAMP,
    ALTER COLUMN instructor_id TYPE BIGINT USING instructor_id::text::bigint;

-- Add constraints to courses
ALTER TABLE courses
    DROP CONSTRAINT IF EXISTS chk_course_status,
    DROP CONSTRAINT IF EXISTS chk_course_visibility,
    ADD CONSTRAINT chk_course_status CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    ADD CONSTRAINT chk_course_visibility CHECK (visibility IN ('PUBLIC', 'PRIVATE'));

-- Alter course_versions table
ALTER TABLE course_versions
    DROP COLUMN IF EXISTS version_number,
    DROP COLUMN IF EXISTS snapshot_data,
    ADD COLUMN IF NOT EXISTS version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    ADD COLUMN IF NOT EXISTS change_log TEXT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add constraint to course_versions
ALTER TABLE course_versions
    DROP CONSTRAINT IF EXISTS chk_version_status,
    ADD CONSTRAINT chk_version_status CHECK (status IN ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'));

-- Alter chapters table
ALTER TABLE chapters
    DROP COLUMN IF EXISTS sequence_order,
    DROP COLUMN IF EXISTS course_id,
    ADD COLUMN IF NOT EXISTS version_id BIGINT,
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS sequence INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add foreign key for chapters
ALTER TABLE chapters
    DROP CONSTRAINT IF EXISTS fk_chapter_version,
    ADD CONSTRAINT fk_chapter_version FOREIGN KEY (version_id) REFERENCES course_versions(id) ON DELETE CASCADE;

-- Alter lessons table
ALTER TABLE lessons
    DROP COLUMN IF EXISTS content_url,
    DROP COLUMN IF EXISTS sequence_order,
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS content TEXT,
    ADD COLUMN IF NOT EXISTS sequence INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS estimated_duration INTEGER,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN mastery_threshold SET DEFAULT 0.8;

-- Add constraint to lessons
ALTER TABLE lessons
    DROP CONSTRAINT IF EXISTS chk_lesson_type,
    DROP CONSTRAINT IF EXISTS chk_mastery_threshold,
    ADD CONSTRAINT chk_lesson_type CHECK (type IN ('VIDEO', 'TEXT', 'QUIZ')),
    ADD CONSTRAINT chk_mastery_threshold CHECK (mastery_threshold >= 0 AND mastery_threshold <= 1);

-- Alter asset_metadata table
ALTER TABLE asset_metadata
    DROP COLUMN IF EXISTS file_size_bytes,
    ADD COLUMN IF NOT EXISTS size_bytes BIGINT,
    ADD COLUMN IF NOT EXISTS original_file_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN mime_type TYPE VARCHAR(100);

-- Alter assignments table
ALTER TABLE assignments
    DROP COLUMN IF EXISTS course_id,
    ADD COLUMN IF NOT EXISTS lesson_id BIGINT,
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS type VARCHAR(20) NOT NULL DEFAULT 'UPLOAD',
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add foreign key and constraint for assignments
ALTER TABLE assignments
    DROP CONSTRAINT IF EXISTS fk_assignment_lesson,
    DROP CONSTRAINT IF EXISTS chk_assignment_type,
    ADD CONSTRAINT fk_assignment_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    ADD CONSTRAINT chk_assignment_type CHECK (type IN ('PROJECT', 'UPLOAD'));

-- Create adaptive_rules table
CREATE TABLE IF NOT EXISTS adaptive_rules (
    id BIGSERIAL PRIMARY KEY,
    source_lesson_id BIGINT NOT NULL,
    target_lesson_id BIGINT,
    condition VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rule_source_lesson FOREIGN KEY (source_lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    CONSTRAINT fk_rule_target_lesson FOREIGN KEY (target_lesson_id) REFERENCES lessons(id) ON DELETE SET NULL
);

-- Alter tags table
ALTER TABLE tags
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD CONSTRAINT IF NOT EXISTS uk_tag_name UNIQUE (name);

-- Add constraint to tags
ALTER TABLE tags
    DROP CONSTRAINT IF EXISTS chk_tag_type,
    ADD CONSTRAINT chk_tag_type CHECK (type IN ('TOPIC', 'SKILL', 'DIFFICULTY'));

-- Create course_tags junction table
CREATE TABLE IF NOT EXISTS course_tags (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_course_tag_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_course_tag_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    CONSTRAINT uk_course_tag UNIQUE (course_id, tag_id)
);

-- Create prerequisites table
CREATE TABLE IF NOT EXISTS prerequisites (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL,
    required_course_id BIGINT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'HARD',
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_prerequisite_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT chk_prerequisite_type CHECK (type IN ('HARD', 'SOFT')),
    CONSTRAINT chk_no_self_prerequisite CHECK (course_id != required_course_id)
);

-- Create additional indexes
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_visibility ON courses(visibility);
CREATE INDEX IF NOT EXISTS idx_courses_published_at ON courses(published_at);

CREATE INDEX IF NOT EXISTS idx_course_versions_course ON course_versions(course_id);
CREATE INDEX IF NOT EXISTS idx_course_versions_status ON course_versions(status);

CREATE INDEX IF NOT EXISTS idx_chapters_version ON chapters(version_id);
CREATE INDEX IF NOT EXISTS idx_chapters_sequence ON chapters(version_id, sequence);

CREATE INDEX IF NOT EXISTS idx_lessons_chapter ON lessons(chapter_id);
CREATE INDEX IF NOT EXISTS idx_lessons_sequence ON lessons(chapter_id, sequence);
CREATE INDEX IF NOT EXISTS idx_lessons_type ON lessons(type);

CREATE INDEX IF NOT EXISTS idx_asset_metadata_lesson ON asset_metadata(lesson_id);

CREATE INDEX IF NOT EXISTS idx_assignments_lesson ON assignments(lesson_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON assignments(due_date);

CREATE INDEX IF NOT EXISTS idx_adaptive_rules_source ON adaptive_rules(source_lesson_id);
CREATE INDEX IF NOT EXISTS idx_adaptive_rules_target ON adaptive_rules(target_lesson_id);

CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
CREATE INDEX IF NOT EXISTS idx_tags_type ON tags(type);

CREATE INDEX IF NOT EXISTS idx_course_tags_course ON course_tags(course_id);
CREATE INDEX IF NOT EXISTS idx_course_tags_tag ON course_tags(tag_id);

CREATE INDEX IF NOT EXISTS idx_prerequisites_course ON prerequisites(course_id);
CREATE INDEX IF NOT EXISTS idx_prerequisites_required ON prerequisites(required_course_id);

-- Insert default tags if not exists
INSERT INTO tags (name, type, description) 
SELECT 'Java', 'TOPIC', 'Java programming language'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Java');

INSERT INTO tags (name, type, description) 
SELECT 'Python', 'TOPIC', 'Python programming language'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Python');

INSERT INTO tags (name, type, description) 
SELECT 'JavaScript', 'TOPIC', 'JavaScript programming language'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'JavaScript');

INSERT INTO tags (name, type, description) 
SELECT 'Backend', 'SKILL', 'Backend development skills'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Backend');

INSERT INTO tags (name, type, description) 
SELECT 'Frontend', 'SKILL', 'Frontend development skills'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Frontend');

INSERT INTO tags (name, type, description) 
SELECT 'Database', 'SKILL', 'Database management skills'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Database');

INSERT INTO tags (name, type, description) 
SELECT 'Beginner', 'DIFFICULTY', 'Beginner level courses'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Beginner');

INSERT INTO tags (name, type, description) 
SELECT 'Intermediate', 'DIFFICULTY', 'Intermediate level courses'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Intermediate');

INSERT INTO tags (name, type, description) 
SELECT 'Advanced', 'DIFFICULTY', 'Advanced level courses'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Advanced');
