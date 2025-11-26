CREATE TABLE IF NOT EXISTS user_profile (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    bio TEXT,
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    avatar_url VARCHAR(512),
    learning_style VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning_attribute (
    id BIGSERIAL PRIMARY KEY,
    profile_id BIGINT REFERENCES user_profile (id) ON DELETE CASCADE,
    learning_style VARCHAR(50),
    weak_topics TEXT,
    strengths TEXT
);

CREATE TABLE IF NOT EXISTS user_schedule (
    id BIGSERIAL PRIMARY KEY,
    profile_id BIGINT REFERENCES user_profile (id) ON DELETE CASCADE,
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_recurring BOOLEAN DEFAULT TRUE,
    recurrence_rule VARCHAR(255),
    timezone VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS class_group (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    creator_id UUID,
    join_code VARCHAR(20) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS group_member (
    id BIGSERIAL PRIMARY KEY,
    group_id BIGINT REFERENCES class_group (id) ON DELETE CASCADE,
    student_id UUID NOT NULL,
    role VARCHAR(30) DEFAULT 'MEMBER',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (group_id, student_id)
);

CREATE TABLE IF NOT EXISTS group_permission (
    id BIGSERIAL PRIMARY KEY,
    group_id BIGINT REFERENCES class_group (id) ON DELETE CASCADE,
    permission VARCHAR(50) NOT NULL,
    min_role VARCHAR(30) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_group_member_group ON group_member (group_id);
