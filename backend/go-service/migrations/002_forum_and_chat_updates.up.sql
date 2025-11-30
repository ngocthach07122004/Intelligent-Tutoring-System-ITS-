-- Update Conversation Type Enum
ALTER TYPE conversation_type ADD VALUE IF NOT EXISTS 'channel';

-- Update Conversations Table
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS topic TEXT,
ADD COLUMN IF NOT EXISTS avatar TEXT;

-- Forum: Posts
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id VARCHAR(24) NOT NULL,
    tags TEXT[],
    views INT DEFAULT 0,
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Forum: Comments
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_id VARCHAR(24) NOT NULL,
    is_accepted BOOLEAN DEFAULT FALSE,
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Forum: Votes
CREATE TABLE votes (
    user_id VARCHAR(24) NOT NULL,
    target_id UUID NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('post', 'comment')),
    value INT NOT NULL CHECK (value IN (1, -1)),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    PRIMARY KEY (user_id, target_id, type)
);

-- Indexes
CREATE INDEX idx_posts_author ON posts(author_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_created ON posts(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_comments_post ON comments(post_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_comments_author ON comments(author_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_votes_target ON votes(target_id, type);

-- Triggers for updated_at
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
