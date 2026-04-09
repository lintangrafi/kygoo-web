CREATE TABLE IF NOT EXISTS business_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_line VARCHAR(50) NOT NULL CHECK (business_line IN ('studio', 'photobooth', 'digital', 'coffee')),
    name VARCHAR(255) NOT NULL,
    year VARCHAR(4) NOT NULL,
    impact TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_business_projects_line ON business_projects(business_line);
CREATE INDEX IF NOT EXISTS idx_business_projects_sort ON business_projects(business_line, sort_order);
CREATE INDEX IF NOT EXISTS idx_business_projects_active ON business_projects(is_active);
CREATE UNIQUE INDEX IF NOT EXISTS uq_business_projects_identity ON business_projects(business_line, name, year) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS business_project_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES business_projects(id),
    action VARCHAR(20) NOT NULL CHECK (action IN ('create', 'update', 'delete')),
    before_data JSONB,
    after_data JSONB,
    changed_by VARCHAR(120) NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_business_project_audit_project_id ON business_project_audit_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_business_project_audit_changed_at ON business_project_audit_logs(changed_at DESC);
