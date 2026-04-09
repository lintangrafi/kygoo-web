CREATE TABLE IF NOT EXISTS business_project_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES business_projects(id),
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_business_project_media_project_id ON business_project_media(project_id);
CREATE INDEX IF NOT EXISTS idx_business_project_media_sort ON business_project_media(project_id, sort_order);
