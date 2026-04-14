CREATE TABLE IF NOT EXISTS business_line_logos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_line VARCHAR(50) NOT NULL,
    section VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_business_line_logos_lookup
    ON business_line_logos (business_line, section, display_order);

CREATE INDEX IF NOT EXISTS idx_business_line_logos_deleted_at
    ON business_line_logos (deleted_at);

INSERT INTO business_line_logos (business_line, section, name, image_url, alt_text, display_order, is_active)
VALUES
    ('photobooth', 'partner', 'Partner 1', 'https://placehold.co/220x100/111827/f8fafc?text=Partner+1', 'Photobooth partner logo 1', 1, TRUE),
    ('photobooth', 'partner', 'Partner 2', 'https://placehold.co/220x100/111827/f8fafc?text=Partner+2', 'Photobooth partner logo 2', 2, TRUE),
    ('photobooth', 'partner', 'Partner 3', 'https://placehold.co/220x100/111827/f8fafc?text=Partner+3', 'Photobooth partner logo 3', 3, TRUE),
    ('photobooth', 'client', 'Client 1', 'https://placehold.co/220x100/1f2937/f8fafc?text=Client+1', 'Photobooth client logo 1', 1, TRUE),
    ('photobooth', 'client', 'Client 2', 'https://placehold.co/220x100/1f2937/f8fafc?text=Client+2', 'Photobooth client logo 2', 2, TRUE),
    ('photobooth', 'client', 'Client 3', 'https://placehold.co/220x100/1f2937/f8fafc?text=Client+3', 'Photobooth client logo 3', 3, TRUE)
ON CONFLICT DO NOTHING;