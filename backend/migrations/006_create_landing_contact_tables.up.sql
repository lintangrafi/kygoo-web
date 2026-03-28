-- Create coffee landing table
CREATE TABLE IF NOT EXISTS coffee_landing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    cta_text VARCHAR(100),
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create digital landing table
CREATE TABLE IF NOT EXISTS digital_landing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    cta_text VARCHAR(100),
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create contact inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    business_line VARCHAR(50), -- 'studio', 'photobooth', 'digital', 'coffee'
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new', -- 'new', 'responded'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_email ON contact_inquiries(email);

-- Seed landing page defaults
INSERT INTO coffee_landing (id, title, subtitle, description, cta_text, status)
VALUES (
    gen_random_uuid(),
    'Kygoo Coffee',
    'Premium Coffee Experience',
    'Coming Soon - Experience our premium coffee services and specialty beverages.',
    'Notify Me',
    'draft'
) ON CONFLICT DO NOTHING;

INSERT INTO digital_landing (id, title, subtitle, description, cta_text, status)
VALUES (
    gen_random_uuid(),
    'Kygoo Digital',
    'Digital Transformation Solutions',
    'Coming Soon - Discover our comprehensive digital transformation and development services.',
    'Notify Me',
    'draft'
) ON CONFLICT DO NOTHING;
