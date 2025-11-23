CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    gmail VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    keycloak_id VARCHAR(255),
    user_name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS token_session (
    id BIGSERIAL PRIMARY KEY,
    keycloak_user_id VARCHAR(255),
    username VARCHAR(255),
    access_token TEXT,
    refresh_token TEXT,
    access_token_expiry TIMESTAMPTZ,
    refresh_token_expiry TIMESTAMPTZ,
    client_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_token_session_username ON token_session (username);
