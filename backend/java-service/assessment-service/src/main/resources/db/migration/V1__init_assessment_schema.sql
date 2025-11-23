CREATE TABLE IF NOT EXISTS question_pool (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    difficulty VARCHAR(20),
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS question (
    id BIGSERIAL PRIMARY KEY,
    pool_id BIGINT REFERENCES question_pool (id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,
    metadata JSONB,
    weight DOUBLE PRECISION DEFAULT 1.0,
    skill_tag VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS rubric (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT REFERENCES question (id) ON DELETE CASCADE,
    name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS rubric_item (
    id BIGSERIAL PRIMARY KEY,
    rubric_id BIGINT REFERENCES rubric (id) ON DELETE CASCADE,
    criterion VARCHAR(255),
    max_points INT,
    description TEXT
);

CREATE TABLE IF NOT EXISTS exam_config (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    policy VARCHAR(30),
    browser_lock_enabled BOOLEAN DEFAULT FALSE,
    time_limit_minutes INT,
    lesson_id BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_section_rule (
    id BIGSERIAL PRIMARY KEY,
    config_id BIGINT REFERENCES exam_config (id) ON DELETE CASCADE,
    pool_id BIGINT REFERENCES question_pool (id) ON DELETE CASCADE,
    count_to_pull INT NOT NULL,
    points_per_question INT
);

CREATE TABLE IF NOT EXISTS attempt (
    id BIGSERIAL PRIMARY KEY,
    student_id UUID NOT NULL,
    exam_config_id BIGINT REFERENCES exam_config (id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL,
    started_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS answer (
    id BIGSERIAL PRIMARY KEY,
    attempt_id BIGINT REFERENCES attempt (id) ON DELETE CASCADE,
    question_id BIGINT REFERENCES question (id) ON DELETE CASCADE,
    response JSONB,
    score DOUBLE PRECISION,
    feedback JSONB,
    manual_review_needed BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS gradebook (
    id BIGSERIAL PRIMARY KEY,
    student_id UUID NOT NULL,
    course_id BIGINT,
    exam_id BIGINT REFERENCES exam_config (id) ON DELETE SET NULL,
    final_score DOUBLE PRECISION,
    grade VARCHAR(10),
    status VARCHAR(20),
    graded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attempt_student ON attempt (student_id);
CREATE INDEX IF NOT EXISTS idx_gradebook_course ON gradebook (course_id);
