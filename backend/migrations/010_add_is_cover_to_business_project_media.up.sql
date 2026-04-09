ALTER TABLE business_project_media
ADD COLUMN IF NOT EXISTS is_cover BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_business_project_media_is_cover ON business_project_media(project_id, is_cover);
