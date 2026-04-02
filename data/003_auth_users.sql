-- Thai Reading Trainer: Auth system
-- Run this in Supabase SQL Editor

-- Users table for simple username/password auth
create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  display_name text,
  created_at timestamptz default now()
);

-- Update user_progress to reference app_users
-- (existing rows with user_id='fabian' will keep working)

-- Create the first user manually:
-- INSERT INTO app_users (username, password_hash, display_name)
-- VALUES ('fabian', crypt('your-password-here', gen_salt('bf')), 'Fabian');
--
-- Make sure pgcrypto extension is enabled:
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Login verification function
create or replace function verify_user(p_username text, p_password text)
returns table(id uuid, username text, display_name text) as $$
begin
  return query
    select u.id, u.username, u.display_name
    from app_users u
    where u.username = p_username
      and u.password_hash = crypt(p_password, u.password_hash);
end;
$$ language plpgsql security definer;

-- Create user function
create or replace function create_user(p_username text, p_password text, p_display_name text default null)
returns table(id uuid, username text, display_name text) as $$
begin
  return query
    insert into app_users (username, password_hash, display_name)
    values (p_username, crypt(p_password, gen_salt('bf')), coalesce(p_display_name, p_username))
    returning app_users.id, app_users.username, app_users.display_name;
end;
$$ language plpgsql security definer;
