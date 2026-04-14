CREATE TABLE IF NOT EXISTS site_branding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name VARCHAR(255) NOT NULL,
    site_description TEXT,
    main_logo_url TEXT NOT NULL,
    main_logo_alt VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_site_branding_deleted_at ON site_branding(deleted_at);

INSERT INTO site_branding (site_name, site_description, main_logo_url, main_logo_alt, is_active)
VALUES ('Kygoo Group', 'A production-ready platform for photography, coffee, and digital services.', '/logo_icon.png', 'Kygoo Group', TRUE)
ON CONFLICT DO NOTHING;