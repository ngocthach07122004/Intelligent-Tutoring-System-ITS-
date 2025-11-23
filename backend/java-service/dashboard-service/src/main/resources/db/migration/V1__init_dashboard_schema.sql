CREATE TABLE IF NOT EXISTS kpi_definition (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255),
    source_service VARCHAR(100),
    calculation_method VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS kpi_aggregate (
    id BIGSERIAL PRIMARY KEY,
    kpi_id BIGINT REFERENCES kpi_definition (id) ON DELETE CASCADE,
    period VARCHAR(20),
    value DOUBLE PRECISION,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_risk_profile (
    id BIGSERIAL PRIMARY KEY,
    student_id UUID NOT NULL,
    engagement_score DOUBLE PRECISION,
    performance_score DOUBLE PRECISION,
    risk_level VARCHAR(20),
    risk_factors JSONB,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (student_id)
);

CREATE INDEX IF NOT EXISTS idx_kpi_aggregate_kpi ON kpi_aggregate (kpi_id);
