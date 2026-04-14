ALTER TABLE business_line_logos
    DROP COLUMN IF EXISTS display_height,
    DROP COLUMN IF EXISTS display_width;

ALTER TABLE site_branding
    DROP COLUMN IF EXISTS header_logo_rounded,
    DROP COLUMN IF EXISTS main_logo_size;