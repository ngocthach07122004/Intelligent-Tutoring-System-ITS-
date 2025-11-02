-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE class_member_role AS ENUM ('teacher', 'student', 'ta', 'observer');
CREATE TYPE conversation_type AS ENUM ('direct', 'group', 'class');
CREATE TYPE message_type AS ENUM ('text', 'system');
CREATE TYPE notification_type AS ENUM ('class_invite', 'mention', 'new_message');
CREATE TYPE event_status AS ENUM ('pending', 'processing', 'processed', 'failed');

-- ============================================================================
-- TABLES
-- ============================================================================

-- Classes (Lớp học)
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    code VARCHAR(50) UNIQUE NOT NULL,

    -- MongoDB User reference
    created_by VARCHAR(24) NOT NULL,

    -- Metadata
    archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Class Members (Thành viên lớp)
CREATE TABLE class_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,

    -- MongoDB User reference
    user_id VARCHAR(24) NOT NULL,

    role class_member_role NOT NULL DEFAULT 'student',

    joined_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    UNIQUE(class_id, user_id)
);

-- Conversations (Cuộc trò chuyện)
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type conversation_type NOT NULL,

    -- For direct: null
    -- For group: user-defined name
    -- For class: auto-generated from class name
    name VARCHAR(255),

    -- Link to class if type='class'
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,

    -- Metadata
    created_by VARCHAR(24) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Conversation Participants (Người tham gia)
CREATE TABLE conversation_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

    user_id VARCHAR(24) NOT NULL,

    -- Sequence number của tin nhắn cuối cùng đã đọc
    last_read_seq BIGINT DEFAULT 0,

    -- Đã rời khỏi conversation chưa
    left_at TIMESTAMPTZ,

    joined_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(conversation_id, user_id)
);

-- Messages (Tin nhắn)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

    sender_id VARCHAR(24) NOT NULL,

    -- Sequence number (auto-increment per conversation)
    seq BIGINT NOT NULL,

    type message_type NOT NULL DEFAULT 'text',
    content TEXT NOT NULL,

    -- For future: file attachments (JSON array)
    attachments JSONB,

    -- Reply to another message
    reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,

    -- Edit history
    edited_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    -- Full-text search
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', coalesce(content, ''))
    ) STORED,

    -- Unique sequence per conversation
    UNIQUE(conversation_id, seq)
);

-- Notifications (Thông báo in-app)
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id VARCHAR(24) NOT NULL,

    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT,

    -- Link to related entity
    entity_type VARCHAR(50),
    entity_id UUID,

    -- Metadata
    data JSONB,

    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Outbox (Event outbox pattern)
CREATE TABLE outbox (
    id BIGSERIAL PRIMARY KEY,

    -- Event metadata
    aggregate_type VARCHAR(100) NOT NULL,
    aggregate_id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL,

    -- Event payload (JSON)
    payload JSONB NOT NULL,

    -- Processing status
    status event_status DEFAULT 'pending',
    attempts INT DEFAULT 0,
    last_error TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Classes
CREATE INDEX idx_classes_code ON classes(code) WHERE deleted_at IS NULL;
CREATE INDEX idx_classes_created_by ON classes(created_by) WHERE deleted_at IS NULL;

-- Class Members
CREATE INDEX idx_class_members_class ON class_members(class_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_class_members_user ON class_members(user_id) WHERE deleted_at IS NULL;

-- Conversations
CREATE INDEX idx_conversations_type ON conversations(type) WHERE deleted_at IS NULL;
CREATE INDEX idx_conversations_class ON conversations(class_id) WHERE deleted_at IS NULL;

-- Conversation Participants
CREATE INDEX idx_conv_participants_conv ON conversation_participants(conversation_id);
CREATE INDEX idx_conv_participants_user ON conversation_participants(user_id);

-- Messages
CREATE INDEX idx_messages_conv ON messages(conversation_id, seq DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_messages_sender ON messages(sender_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_messages_created ON messages(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_messages_search ON messages USING GIN(search_vector);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read_at IS NULL AND deleted_at IS NULL;

-- Outbox
CREATE INDEX idx_outbox_pending ON outbox(created_at) WHERE status = 'pending';
CREATE INDEX idx_outbox_aggregate ON outbox(aggregate_type, aggregate_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_classes_updated_at
    BEFORE UPDATE ON classes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-assign sequence number to messages
CREATE OR REPLACE FUNCTION assign_message_seq()
RETURNS TRIGGER AS $$
BEGIN
    -- Get next sequence number for this conversation
    NEW.seq := COALESCE(
        (SELECT MAX(seq) FROM messages WHERE conversation_id = NEW.conversation_id),
        0
    ) + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assign_message_seq_trigger
    BEFORE INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION assign_message_seq();
