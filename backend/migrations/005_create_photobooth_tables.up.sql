-- Create photobooth packages table
CREATE TABLE IF NOT EXISTS photobooth_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    tos_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create photobooth events table
CREATE TABLE IF NOT EXISTS photobooth_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(50), -- 'wedding', 'organizational', 'other'
    event_date DATE,
    location VARCHAR(255),
    description TEXT,
    featured_image_url TEXT,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create photobooth event images table
CREATE TABLE IF NOT EXISTS photobooth_event_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES photobooth_events(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_photobooth_packages_deleted_at ON photobooth_packages(deleted_at);
CREATE INDEX IF NOT EXISTS idx_photobooth_events_status ON photobooth_events(status);
CREATE INDEX IF NOT EXISTS idx_photobooth_events_deleted_at ON photobooth_events(deleted_at);
CREATE INDEX IF NOT EXISTS idx_photobooth_event_images_event_id ON photobooth_event_images(event_id);
CREATE INDEX IF NOT EXISTS idx_photobooth_event_images_deleted_at ON photobooth_event_images(deleted_at);
