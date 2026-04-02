-- Add active_groups column for Phase 1 group activation
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS active_groups text[] DEFAULT '{}';
