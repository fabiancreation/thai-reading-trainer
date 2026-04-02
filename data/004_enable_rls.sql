-- Thai Reading Trainer: Enable Row Level Security
-- Run this in Supabase SQL Editor AFTER migrating to Supabase Auth

-- Enable RLS on user_progress
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own data
CREATE POLICY "Users read own progress"
  ON user_progress FOR SELECT
  USING (auth.uid()::text = user_id);

-- Policy: Users can insert their own data
CREATE POLICY "Users insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Policy: Users can update their own data
CREATE POLICY "Users update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Note: The old app_users table and verify_user/create_user functions
-- are no longer needed. You can drop them:
--
-- DROP FUNCTION IF EXISTS verify_user(text, text);
-- DROP FUNCTION IF EXISTS create_user(text, text, text);
-- DROP TABLE IF EXISTS app_users;
