ALTER TABLE contact_inquiries
    DROP COLUMN IF EXISTS package_price_label,
    DROP COLUMN IF EXISTS package_name,
    DROP COLUMN IF EXISTS package_id;