-- ============================================
-- temporaries.email — Supabase SQL Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================

-- 1. User profiles with assigned email address
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email_address text unique not null,
  created_at timestamptz default now()
);

-- 2. Incoming emails
create table public.emails (
  id uuid default gen_random_uuid() primary key,
  to_address text not null,
  from_address text not null,
  subject text,
  body text,
  html_body text,
  received_at timestamptz default now()
);

-- 3. API keys
create table public.api_keys (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  key_hash text unique not null,  -- store full key (prod: hash it with bcrypt)
  key_prefix text not null,       -- first 10 chars + "..." for display
  last_used_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================
-- Indexes
-- ============================================
create index emails_to_address_idx on public.emails (to_address);
create index emails_received_at_idx on public.emails (received_at desc);
create index api_keys_user_id_idx on public.api_keys (user_id);
create index api_keys_key_hash_idx on public.api_keys (key_hash);

-- ============================================
-- Row Level Security
-- ============================================
alter table public.profiles enable row level security;
alter table public.emails enable row level security;
alter table public.api_keys enable row level security;

-- Profiles: users can only see their own
create policy "users see own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "users insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Emails: users see emails sent to their address
create policy "users see own emails"
  on public.emails for select
  using (
    to_address = (
      select email_address from public.profiles where id = auth.uid()
    )
  );

-- Emails: service role can insert (for Cloudflare Worker)
create policy "service can insert emails"
  on public.emails for insert
  with check (true);

-- API Keys: users manage their own keys
create policy "users see own api keys"
  on public.api_keys for select
  using (auth.uid() = user_id);

create policy "users create own api keys"
  on public.api_keys for insert
  with check (auth.uid() = user_id);

create policy "users delete own api keys"
  on public.api_keys for delete
  using (auth.uid() = user_id);

create policy "users update own api keys"
  on public.api_keys for update
  using (auth.uid() = user_id);

-- Service role can update last_used_at
create policy "service update api keys"
  on public.api_keys for update
  with check (true);
