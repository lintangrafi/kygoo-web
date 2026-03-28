-- Drop studio tables (down migration)
DROP INDEX IF EXISTS idx_studio_templates_deleted_at;
DROP INDEX IF EXISTS idx_studio_templates_theme_id;
DROP INDEX IF EXISTS idx_studio_themes_display_order;
DROP INDEX IF EXISTS idx_studio_themes_deleted_at;
DROP TABLE IF EXISTS studio_templates;
DROP TABLE IF EXISTS studio_themes;
