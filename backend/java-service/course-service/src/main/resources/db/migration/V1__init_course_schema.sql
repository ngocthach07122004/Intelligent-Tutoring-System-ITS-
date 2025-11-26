-- Initial Course Service schema (base tables, no enrollments)

CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    visibility VARCHAR(20) NOT NULL DEFAULT 'PRIVATE',
    instructor_id BIGINT NOT NULL,
    thumbnail_url VARCHAR(500),
    objectives TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    CONSTRAINT chk_course_status CHECK (status IN ('DRAFT','PUBLISHED','ARCHIVED')),
    CONSTRAINT chk_course_visibility CHECK (visibility IN ('PUBLIC','PRIVATE'))
);

CREATE TABLE course_versions (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    change_log TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    CONSTRAINT chk_version_status CHECK (status IN ('DRAFT','REVIEW','PUBLISHED','ARCHIVED'))
);

CREATE TABLE chapters (
    id BIGSERIAL PRIMARY KEY,
    version_id BIGINT NOT NULL REFERENCES course_versions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sequence INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lessons (
    id BIGSERIAL PRIMARY KEY,
    chapter_id BIGINT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL,
    sequence INTEGER NOT NULL DEFAULT 1,
    mastery_threshold DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    content TEXT,
    estimated_duration INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_lesson_type CHECK (type IN ('VIDEO','TEXT','QUIZ')),
    CONSTRAINT chk_mastery_threshold CHECK (mastery_threshold >= 0 AND mastery_threshold <= 1)
);

CREATE TABLE asset_metadata (
    id BIGSERIAL PRIMARY KEY,
    lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    storage_url VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT,
    checksum VARCHAR(255),
    original_file_name VARCHAR(255),
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assignments (
    id BIGSERIAL PRIMARY KEY,
    lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL DEFAULT 'UPLOAD',
    due_date TIMESTAMP,
    max_score INTEGER NOT NULL DEFAULT 100,
    config JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_assignment_type CHECK (type IN ('PROJECT','UPLOAD'))
);

CREATE TABLE adaptive_rules (
    id BIGSERIAL PRIMARY KEY,
    source_lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    target_lesson_id BIGINT REFERENCES lessons(id) ON DELETE SET NULL,
    condition VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL,
    description TEXT,
    CONSTRAINT chk_tag_type CHECK (type IN ('TOPIC','SKILL','DIFFICULTY'))
);

CREATE TABLE course_tags (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_course_tag UNIQUE (course_id, tag_id)
);

CREATE TABLE prerequisites (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    required_course_id BIGINT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'HARD',
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_prerequisite_type CHECK (type IN ('HARD','SOFT')),
    CONSTRAINT chk_no_self_prerequisite CHECK (course_id != required_course_id)
);

-- Indexes
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_visibility ON courses(visibility);
CREATE INDEX idx_courses_published_at ON courses(published_at);

CREATE INDEX idx_course_versions_course ON course_versions(course_id);
CREATE INDEX idx_course_versions_status ON course_versions(status);

CREATE INDEX idx_chapters_version ON chapters(version_id);
CREATE INDEX idx_chapters_sequence ON chapters(version_id, sequence);

CREATE INDEX idx_lessons_chapter ON lessons(chapter_id);
CREATE INDEX idx_lessons_sequence ON lessons(chapter_id, sequence);
CREATE INDEX idx_lessons_type ON lessons(type);

CREATE INDEX idx_asset_metadata_lesson ON asset_metadata(lesson_id);

CREATE INDEX idx_assignments_lesson ON assignments(lesson_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);

CREATE INDEX idx_adaptive_rules_source ON adaptive_rules(source_lesson_id);
CREATE INDEX idx_adaptive_rules_target ON adaptive_rules(target_lesson_id);

CREATE INDEX idx_tags_type ON tags(type);
CREATE INDEX idx_course_tags_course ON course_tags(course_id);
CREATE INDEX idx_course_tags_tag ON course_tags(tag_id);

CREATE INDEX idx_prerequisites_course ON prerequisites(course_id);
CREATE INDEX idx_prerequisites_required ON prerequisites(required_course_id);
