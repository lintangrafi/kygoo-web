-- Create studio themes table
CREATE TABLE IF NOT EXISTS studio_themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    background_image_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create studio templates table
CREATE TABLE IF NOT EXISTS studio_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    theme_id UUID NOT NULL REFERENCES studio_themes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    template_image_url TEXT NOT NULL,
    result_image_url TEXT NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_studio_themes_deleted_at ON studio_themes(deleted_at);
CREATE INDEX IF NOT EXISTS idx_studio_themes_display_order ON studio_themes(display_order);
CREATE INDEX IF NOT EXISTS idx_studio_templates_theme_id ON studio_templates(theme_id);
CREATE INDEX IF NOT EXISTS idx_studio_templates_deleted_at ON studio_templates(deleted_at);
