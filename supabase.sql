-- Run this in your Supabase SQL editor to set up the database.

create table if not exists videos (
  id            uuid default gen_random_uuid() primary key,
  title         text,
  tiktok_url    text unique not null,
  thumbnail_url text,
  description   text,
  published_at  timestamp with time zone,
  created_at    timestamp with time zone default now(),
  tags          text[] default '{}',
  play_count    integer default 0
);

-- Index for tag-based filtering
create index if not exists idx_videos_tags on videos using gin(tags);

-- Index for chronological ordering
create index if not exists idx_videos_published_at on videos(published_at desc);

-- Full-text search index
create index if not exists idx_videos_fts on videos
  using gin(to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, '')));

-- Enable Row Level Security (read-only public access)
alter table videos enable row level security;

create policy "Public read access" on videos
  for select using (true);
