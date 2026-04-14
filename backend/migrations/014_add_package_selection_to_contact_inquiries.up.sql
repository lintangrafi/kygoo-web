ALTER TABLE contact_inquiries
    ADD COLUMN IF NOT EXISTS package_id UUID,
    ADD COLUMN IF NOT EXISTS package_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS package_price_label VARCHAR(120);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_package_id ON contact_inquiries(package_id);