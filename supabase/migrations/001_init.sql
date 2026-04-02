-- Thai Reading Trainer: Initial schema
-- Run this in Supabase SQL Editor

create table if not exists user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id text not null default 'default',
  completed_lessons integer[] default '{}',
  srs_cards jsonb default '{}',
  preferences jsonb default '{"dark": false}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- One row per user
create unique index if not exists user_progress_user_id_idx on user_progress(user_id);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger user_progress_updated_at
  before update on user_progress
  for each row
  execute function update_updated_at();

-- RLS (enable later when adding auth)
-- alter table user_progress enable row level security;
