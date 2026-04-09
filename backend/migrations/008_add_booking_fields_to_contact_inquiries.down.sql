ALTER TABLE contact_inquiries
    DROP COLUMN IF EXISTS source,
    DROP COLUMN IF EXISTS notes,
    DROP COLUMN IF EXISTS budget_range,
    DROP COLUMN IF EXISTS guest_count,
    DROP COLUMN IF EXISTS location,
    DROP COLUMN IF EXISTS event_date,
    DROP COLUMN IF EXISTS event_type;
