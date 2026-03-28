-- Drop landing and contact tables (down migration)
DROP INDEX IF EXISTS idx_contact_inquiries_email;
DROP INDEX IF EXISTS idx_contact_inquiries_created_at;
DROP INDEX IF EXISTS idx_contact_inquiries_status;
DROP TABLE IF EXISTS contact_inquiries;
DROP TABLE IF EXISTS digital_landing;
DROP TABLE IF EXISTS coffee_landing;
