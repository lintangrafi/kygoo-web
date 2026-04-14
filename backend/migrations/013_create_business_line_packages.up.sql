CREATE TABLE IF NOT EXISTS business_line_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_line VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_label VARCHAR(120) NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    highlight BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_business_line_packages_line_name
    ON business_line_packages (business_line, name);

CREATE INDEX IF NOT EXISTS idx_business_line_packages_line_order
    ON business_line_packages (business_line, display_order, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_business_line_packages_deleted_at
    ON business_line_packages (deleted_at);

INSERT INTO business_line_packages (business_line, name, description, price_label, features, highlight, display_order, is_active)
VALUES
    ('studio', 'Snow White', 'Backdrop putih bersih untuk portrait yang clean dan lembut.', '50K / 10 menit', '["75K / 15 menit", "Clean white setup", "Soft bright portrait look"]'::jsonb, FALSE, 1, TRUE),
    ('studio', 'Nassau Blue', 'Background biru dengan mood studio yang tegas.', '50K / 10 menit', '["75K / 15 menit", "Blue backdrop style", "Portrait-ready studio look"]'::jsonb, TRUE, 2, TRUE),
    ('studio', 'Grey Curtain', 'Set tirai abu-abu minimal untuk hasil foto yang kalem.', '35K / 5 menit', '["50K / 10 menit", "Curtain-style background", "Minimal and clean mood"]'::jsonb, FALSE, 3, TRUE),
    ('studio', 'Livingroom', 'Nuansa ruang tamu hangat untuk sesi foto lifestyle.', '50K / 10 menit', '["75K / 15 menit", "Cozy indoor living room feel", "Soft lifestyle look"]'::jsonb, FALSE, 4, TRUE),
    ('studio', 'Spotlight Box', 'Sesi dengan kontras spotlight untuk satu subjek.', '50K / 10 menit', '["75K / 15 menit", "Single subject spotlight", "Strong studio contrast"]'::jsonb, FALSE, 5, TRUE),
    ('studio', 'Elevator Vintage', 'Set bergaya vintage elevator untuk visual editorial.', '35K / 1 sesi', '["50K / 2 sesi", "Vintage lift-inspired set", "Retro editorial aesthetic"]'::jsonb, FALSE, 6, TRUE),
    ('studio', 'Window Background', 'Backdrop frame jendela dengan mood natural.', '50K / 10 menit', '["75K / 15 menit", "Window-frame backdrop", "Soft natural portrait style"]'::jsonb, FALSE, 7, TRUE),
    ('studio', 'Beige', 'Tone beige hangat dan elegan untuk portrait minimal.', '50K / 10 menit', '["75K / 15 menit", "Warm beige tone", "Neutral and elegant result"]'::jsonb, FALSE, 8, TRUE),
    ('studio', 'Vintage Box', 'Interior box vintage untuk hasil foto klasik.', '50K / 10 menit', '["75K / 15 menit", "Old-school box interior", "Classic nostalgic composition"]'::jsonb, FALSE, 9, TRUE),
    ('studio', 'Industrial Wall', 'Tekstur industrial concrete dengan karakter urban.', '50K / 10 menit', '["75K / 15 menit", "Concrete industrial texture", "Bold urban portrait look"]'::jsonb, FALSE, 10, TRUE),
    ('photobooth', 'Classic Photobooth', 'Paket dasar photobooth untuk event dengan flow cepat.', 'Mulai 1.800K', '["2 jam unlimited: 1.800K", "3 jam unlimited: 2.200K", "4 jam unlimited: 2.600K", "Include photo print + GIF", "2-3 crew, backdrop, accessories"]'::jsonb, FALSE, 1, TRUE),
    ('photobooth', 'Full Body Photobooth', 'Format full body dengan set layar sentuh dan output print.', 'Mulai 2.350K', '["2 jam unlimited: 2.350K", "3 jam unlimited: 3.000K", "4 jam unlimited: 3.650K", "Include photo print + GIF", "2-3 crew, backdrop, accessories"]'::jsonb, TRUE, 2, TRUE),
    ('photobooth', 'iPad Booth', 'Booth ringan dengan iPad untuk event yang lebih fleksibel.', 'Mulai 1.500K', '["2 jam unlimited: 1.500K", "3 jam unlimited: 1.850K", "4 jam unlimited: 2.200K", "Include photo print + GIF", "2-3 crew, backdrop, accessories"]'::jsonb, FALSE, 3, TRUE),
    ('photobooth', 'Mingle Photo Booth', 'Booth untuk social activation dan experience yang ramai.', 'Mulai 2.250K', '["2 jam unlimited: 2.250K", "3 jam unlimited: 2.750K", "4 jam unlimited: 3.250K", "Custom design by request"]'::jsonb, FALSE, 4, TRUE),
    ('photobooth', 'High Angle Photobooth', 'Setup high angle untuk event yang butuh cakupan lebih lebar.', 'Mulai 3.000K', '["Pricelist day: 1 hari (10 jam) 12.000K", "3 hari 30.000K", "1 minggu 50.000K", "Include staff 2 person, branding box, custom frame"]'::jsonb, FALSE, 5, TRUE),
    ('photobooth', 'Videobooth Pricelist', 'Paket videobooth untuk output video singkat dan social content.', 'Mulai 2.000K', '["3 jam unlimited: 2.000K", "4 jam unlimited: 2.400K", "5 jam unlimited: 2.800K", "Free custom design, request music"]'::jsonb, FALSE, 6, TRUE),
    ('photobooth', 'Wedding Content Creator', 'Paket dokumentasi konten wedding dengan output vertikal.', '799K', '["8 hours standby", "Up to 10-15 Instagram Story", "Up to 5 Story + Reels Instagram", "2 video trend TikTok"]'::jsonb, FALSE, 7, TRUE),
    ('digital', 'Startup', 'Paket awal untuk landing page dan website sederhana.', '5,000,000', '["Landing Page", "Responsive Design", "SEO Basics", "3 Months Support"]'::jsonb, FALSE, 1, TRUE),
    ('digital', 'Growth', 'Paket untuk web app dengan desain dan integrasi penuh.', '15,000,000', '["Full Web App", "Custom Design", "Database Setup", "API Integration", "6 Months Support"]'::jsonb, TRUE, 2, TRUE),
    ('digital', 'Enterprise', 'Paket custom untuk solusi berskala besar.', 'Custom', '["Mobile + Web", "Advanced Features", "Dedicated Team", "Ongoing Support"]'::jsonb, FALSE, 3, TRUE),
    ('coffee', 'Station', 'Paket coffee station untuk event kecil hingga menengah.', '3,500,000', '["2 barista", "Standard menu", "Basic setup", "3 hours service"]'::jsonb, FALSE, 1, TRUE),
    ('coffee', 'Signature', 'Paket signature dengan custom cup branding.', '6,500,000', '["3 barista", "Signature menu", "Custom cup branding", "5 hours service"]'::jsonb, TRUE, 2, TRUE),
    ('coffee', 'Hospitality', 'Paket premium untuk hospitality experience full day.', 'Custom', '["Dedicated crew", "Premium menu", "Brand experience", "Full day coverage"]'::jsonb, FALSE, 3, TRUE)
ON CONFLICT (business_line, name) DO NOTHING;