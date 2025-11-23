CREATE TABLE IF NOT EXISTS courses (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id UUID NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT',
    level VARCHAR(20),
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_versions (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT REFERENCES courses (id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    snapshot_data JSONB,
    published_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS chapters (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT REFERENCES courses (id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    sequence_order INT NOT NULL
);

CREATE TABLE IF NOT EXISTS lessons (
    id BIGSERIAL PRIMARY KEY,
    chapter_id BIGINT REFERENCES chapters (id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL,
    content_url VARCHAR(500),
    mastery_threshold DOUBLE PRECISION DEFAULT 0.7,
    sequence_order INT NOT NULL
);

CREATE TABLE IF NOT EXISTS asset_metadata (
    id BIGSERIAL PRIMARY KEY,
    lesson_id BIGINT REFERENCES lessons (id) ON DELETE CASCADE,
    storage_url VARCHAR(500) NOT NULL,
    mime_type VARCHAR(50),
    checksum VARCHAR(64),
    file_size_bytes BIGINT
);

CREATE TABLE IF NOT EXISTS prerequisites (
    lesson_id BIGINT REFERENCES lessons (id) ON DELETE CASCADE,
    prerequisite_lesson_id BIGINT REFERENCES lessons (id) ON DELETE CASCADE,
    PRIMARY KEY (lesson_id, prerequisite_lesson_id)
);

CREATE TABLE IF NOT EXISTS assignments (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT REFERENCES courses (id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    due_date TIMESTAMPTZ,
    max_score INT DEFAULT 100,
    config JSONB
);

CREATE TABLE IF NOT EXISTS user_course_enrollment (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    course_id BIGINT REFERENCES courses (id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, course_id)
);

CREATE TABLE IF NOT EXISTS tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    type VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS course_tag (
    course_id BIGINT REFERENCES courses (id) ON DELETE CASCADE,
    tag_id BIGINT REFERENCES tags (id) ON DELETE CASCADE,
    PRIMARY KEY (course_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_courses_status ON courses (status);
CREATE INDEX IF NOT EXISTS idx_enrollment_user ON user_course_enrollment (user_id);
