-- Drop photobooth tables (down migration)
DROP INDEX IF EXISTS idx_photobooth_event_images_deleted_at;
DROP INDEX IF EXISTS idx_photobooth_event_images_event_id;
DROP INDEX IF EXISTS idx_photobooth_events_deleted_at;
DROP INDEX IF EXISTS idx_photobooth_events_status;
DROP INDEX IF EXISTS idx_photobooth_packages_deleted_at;
DROP TABLE IF EXISTS photobooth_event_images;
DROP TABLE IF EXISTS photobooth_events;
DROP TABLE IF EXISTS photobooth_packages;
