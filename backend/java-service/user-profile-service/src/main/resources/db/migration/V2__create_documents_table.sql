CREATE TABLE IF NOT EXISTS document (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(20) NOT NULL,
    course VARCHAR(100),
    tags JSONB DEFAULT '[]'::jsonb,
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_document_user ON document (user_id);
CREATE INDEX IF NOT EXISTS idx_document_category ON document (user_id, category);
CREATE INDEX IF NOT EXISTS idx_document_favorite ON document (user_id, is_favorite);
CREATE INDEX IF NOT EXISTS idx_document_updated_at ON document (user_id, updated_at DESC);
