DROP INDEX IF EXISTS idx_business_project_media_is_cover;
ALTER TABLE business_project_media DROP COLUMN IF EXISTS is_cover;
