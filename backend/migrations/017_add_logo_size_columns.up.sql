ALTER TABLE site_branding
    ADD COLUMN IF NOT EXISTS main_logo_size INT DEFAULT 40,
    ADD COLUMN IF NOT EXISTS header_logo_rounded BOOLEAN DEFAULT TRUE;

ALTER TABLE business_line_logos
    ADD COLUMN IF NOT EXISTS display_width INT DEFAULT 150,
    ADD COLUMN IF NOT EXISTS display_height INT DEFAULT 64;

UPDATE site_branding
SET main_logo_size = COALESCE(main_logo_size, 40),
    header_logo_rounded = COALESCE(header_logo_rounded, TRUE)
WHERE deleted_at IS NULL;

UPDATE business_line_logos
SET display_width = COALESCE(display_width, 150),
    display_height = COALESCE(display_height, 64)
WHERE deleted_at IS NULL;