DROP INDEX IF EXISTS idx_business_project_audit_changed_at;
DROP INDEX IF EXISTS idx_business_project_audit_project_id;
DROP TABLE IF EXISTS business_project_audit_logs;

DROP INDEX IF EXISTS uq_business_projects_identity;
DROP INDEX IF EXISTS idx_business_projects_active;
DROP INDEX IF EXISTS idx_business_projects_sort;
DROP INDEX IF EXISTS idx_business_projects_line;
DROP TABLE IF EXISTS business_projects;
