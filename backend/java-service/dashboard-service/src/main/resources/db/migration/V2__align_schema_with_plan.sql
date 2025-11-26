-- Align student_risk_profile with Plan
-- Drop existing PK and ID if they exist (handling V1 structure)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'student_risk_profile' AND column_name = 'id') THEN
        ALTER TABLE student_risk_profile DROP CONSTRAINT IF EXISTS student_risk_profile_pkey;
        ALTER TABLE student_risk_profile DROP COLUMN id;
    END IF;
END $$;

-- Ensure student_id is PK
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'student_risk_profile' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE student_risk_profile ADD PRIMARY KEY (student_id);
    END IF;
END $$;

ALTER TABLE student_risk_profile ADD COLUMN IF NOT EXISTS overall_score DOUBLE PRECISION;

-- Align kpi_definition
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kpi_definition' AND column_name = 'id') THEN
        ALTER TABLE kpi_aggregate DROP CONSTRAINT IF EXISTS kpi_aggregate_kpi_id_fkey; -- Drop FK first
        ALTER TABLE kpi_definition DROP CONSTRAINT IF EXISTS kpi_definition_pkey CASCADE;
        ALTER TABLE kpi_definition DROP COLUMN id;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'kpi_definition' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE kpi_definition ADD PRIMARY KEY (code);
    END IF;
END $$;

ALTER TABLE kpi_definition ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE kpi_definition ADD COLUMN IF NOT EXISTS calculation_rule TEXT;

-- Align kpi_aggregate
ALTER TABLE kpi_aggregate ADD COLUMN IF NOT EXISTS kpi_code VARCHAR(50);
ALTER TABLE kpi_aggregate ADD COLUMN IF NOT EXISTS entity_id VARCHAR(50);
ALTER TABLE kpi_aggregate ADD COLUMN IF NOT EXISTS period_type VARCHAR(20);
ALTER TABLE kpi_aggregate ADD COLUMN IF NOT EXISTS period_start DATE;
ALTER TABLE kpi_aggregate ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Update FK
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'kpi_aggregate' AND constraint_name = 'fk_kpi_aggregate_code') THEN
        ALTER TABLE kpi_aggregate ADD CONSTRAINT fk_kpi_aggregate_code FOREIGN KEY (kpi_code) REFERENCES kpi_definition(code);
    END IF;
END $$;

-- Cleanup old columns in kpi_aggregate
ALTER TABLE kpi_aggregate DROP COLUMN IF EXISTS kpi_id;
ALTER TABLE kpi_aggregate DROP COLUMN IF EXISTS period;
ALTER TABLE kpi_aggregate DROP COLUMN IF EXISTS recorded_at;
