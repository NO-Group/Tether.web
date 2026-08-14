-- ============================================================================
-- FLOW — database schema
-- A self-hosted social network. Stream posts, follow people, thread replies,
-- message privately, and share every kind of media.
--
-- Run this in the Supabase SQL editor (Dashboard > SQL > New query), then run
-- realtime.sql to turn on live updates.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- EXTENSIONS
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";          -- gen_random_uuid()
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- PROFILES  (one per auth user; handle = username + '.no.flw')
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  username      text unique not null,
  display_name  text,
  bio           text,
  avatar_url    text,
  banner_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint profiles_username_format check (
    username ~ '^[a-z0-9]([a-z0-9._-]{0,28}[a-z0-9])?$'
  )
);

-- helper: full handle string
create or replace function public.handle_of(u text)
returns text language sql immutable as $$
  select u || '.no.flw'
$$;

-- ---------------------------------------------------------------------------
-- POSTS  (threads via parent_id, reposts via repost_of, media is jsonb[])
-- ---------------------------------------------------------------------------
create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references public.profiles (id) on delete cascade,
  content     text,
  parent_id   uuid references public.posts (id) on delete set null,   -- reply/thread
  repost_of   uuid references public.posts (id) on delete cascade,    -- repost wrapper
  media       jsonb default '[]'::jsonb,  -- [{type,url,width,height,duration,alt}]
  views       bigint not null default 0,  -- denormalized view counter
  created_at  timestamptz not null default now(),
  constraint posts_content_or_media check (
    (content is not null and length(trim(content)) > 0)
    or (coalesce(jsonb_array_length(media), 0) > 0)
    or (repost_of is not null)
  )
);

create index if not exists posts_author_id_idx   on public.posts (author_id);
create index if not exists posts_parent_id_idx   on public.posts (parent_id);
create index if not exists posts_repost_of_idx   on public.posts (repost_of);
create index if not exists posts_created_at_idx  on public.posts (created_at desc);

-- ---------------------------------------------------------------------------
-- LIKES
-- ---------------------------------------------------------------------------
create table if not exists public.likes (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);
create index if not exists likes_post_idx on public.likes (post_id);
create index if not exists likes_user_idx on public.likes (user_id);

-- ---------------------------------------------------------------------------
-- FOLLOWS
-- ---------------------------------------------------------------------------
create table if not exists public.follows (
  follower_id  uuid not null references public.profiles (id) on delete cascade,
  following_id uuid not null references public.profiles (id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (follower_id, following_id),
  constraint follows_no_self check (follower_id <> following_id)
);
create index if not exists follows_following_idx on public.follows (following_id);

-- ---------------------------------------------------------------------------
-- NOTIFICATIONS
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade, -- recipient
  actor_id   uuid references public.profiles (id) on delete cascade,          -- who did it
  type       text not null check (type in ('like','repost','reply','follow','mention','message')),
  post_id    uuid references public.posts (id) on delete cascade,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on public.notifications (user_id, read, created_at desc);

-- ---------------------------------------------------------------------------
-- MESSAGING (direct messages)
-- ---------------------------------------------------------------------------
create table if not exists public.conversations (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversation_participants (
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  user_id         uuid not null references public.profiles (id) on delete cascade,
  primary key (conversation_id, user_id)
);
create index if not exists cpart_user_idx on public.conversation_participants (user_id);

create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id       uuid not null references public.profiles (id) on delete cascade,
  content         text,
  media           jsonb default '[]'::jsonb,
  created_at      timestamptz not null default now(),
  constraint messages_content_or_media check (
    (content is not null and length(trim(content)) > 0)
    or (coalesce(jsonb_array_length(media), 0) > 0)
  )
);
create index if not exists messages_conv_idx on public.messages (conversation_id, created_at);

-- ---------------------------------------------------------------------------
-- VIEWS  (dedup: one view per user per post, feeds a denormalized counter)
-- ---------------------------------------------------------------------------
create table if not exists public.post_views (
  post_id    uuid not null references public.posts (id) on delete cascade,
  user_id    uuid references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

-- record a view; returns current counter
create or replace function public.record_view(p_post_id uuid, p_user_id uuid default null)
returns bigint language plpgsql security definer as $$
declare
  v_views bigint;
begin
  insert into public.post_views (post_id, user_id)
  values (p_post_id, p_user_id)
  on conflict do nothing;

  update public.posts
    set views = (select count(*) from public.post_views where post_id = p_post_id)
  where id = p_post_id;

  select views into v_views from public.posts where id = p_post_id;
  return v_views;
end;
$$;

-- ---------------------------------------------------------------------------
-- TRIGGERS
-- ---------------------------------------------------------------------------
-- auto-set updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists conversations_set_updated_at on public.conversations;
create trigger conversations_set_updated_at before update on public.conversations
  for each row execute function public.set_updated_at();

-- ensure a profile row always exists for an auth user (minimal placeholder;
-- the app fills in username + display name at signup)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  base text := coalesce(split_part(new.email, '@', 1), 'user');
  uname text;
  n int := 0;
begin
  uname := regexp_replace(lower(base), '[^a-z0-9._-]', '', 'g');
  if uname = '' or uname !~ '^[a-z0-9]' then
    uname := 'user';
  end if;
  loop
    begin
      insert into public.profiles (id, username)
      values (new.id, uname) on conflict (id) do nothing;
      exit;
    exception when unique_violation then
      n := n + 1;
      uname := substr(uname, 1, 24) || n::text;
    end;
  end loop;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------
alter table public.profiles                  enable row level security;
alter table public.posts                     enable row level security;
alter table public.likes                     enable row level security;
alter table public.follows                   enable row level security;
alter table public.notifications             enable row level security;
alter table public.conversations             enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages                  enable row level security;
alter table public.post_views                enable row level security;

-- profiles: readable by everyone, editable by self
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select using (true);

drop policy if exists "profiles_insert" on public.profiles;
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- posts: readable by all, insert/update/delete by author (deletes also for the
-- author of a root post when reposting — handled by cascade)
drop policy if exists "posts_select" on public.posts;
create policy "posts_select" on public.posts for select using (true);

drop policy if exists "posts_insert" on public.posts;
create policy "posts_insert" on public.posts for insert with check (auth.uid() = author_id);

drop policy if exists "posts_update" on public.posts;
create policy "posts_update" on public.posts for update using (auth.uid() = author_id);

drop policy if exists "posts_delete" on public.posts;
create policy "posts_delete" on public.posts for delete using (auth.uid() = author_id);

-- likes
drop policy if exists "likes_select" on public.likes;
create policy "likes_select" on public.likes for select using (true);

drop policy if exists "likes_insert" on public.likes;
create policy "likes_insert" on public.likes for insert with check (auth.uid() = user_id);

drop policy if exists "likes_delete" on public.likes;
create policy "likes_delete" on public.likes for delete using (auth.uid() = user_id);

-- follows
drop policy if exists "follows_select" on public.follows;
create policy "follows_select" on public.follows for select using (true);

drop policy if exists "follows_insert" on public.follows;
create policy "follows_insert" on public.follows for insert with check (auth.uid() = follower_id);

drop policy if exists "follows_delete" on public.follows;
create policy "follows_delete" on public.follows for delete using (auth.uid() = follower_id);

-- notifications: recipient can read/update; anyone can create
drop policy if exists "notifications_select" on public.notifications;
create policy "notifications_select" on public.notifications for select using (auth.uid() = user_id);

drop policy if exists "notifications_insert" on public.notifications;
create policy "notifications_insert" on public.notifications for insert with check (auth.uid() = actor_id);

drop policy if exists "notifications_update" on public.notifications;
create policy "notifications_update" on public.notifications for update using (auth.uid() = user_id);

-- conversations: participants
drop policy if exists "conversations_select" on public.conversations;
create policy "conversations_select" on public.conversations for select using (
  exists (select 1 from public.conversation_participants p where p.conversation_id = id and p.user_id = auth.uid())
);

drop policy if exists "conversations_insert" on public.conversations;
create policy "conversations_insert" on public.conversations for insert with check (true);

drop policy if exists "conversations_update" on public.conversations;
create policy "conversations_update" on public.conversations for update using (
  exists (select 1 from public.conversation_participants p where p.conversation_id = id and p.user_id = auth.uid())
);

-- conversation_participants: participants can read; user can add self
drop policy if exists "cpart_select" on public.conversation_participants;
create policy "cpart_select" on public.conversation_participants for select using (
  exists (select 1 from public.conversation_participants p where p.conversation_id = conversation_id and p.user_id = auth.uid())
);

drop policy if exists "cpart_insert" on public.conversation_participants;
create policy "cpart_insert" on public.conversation_participants for insert with check (user_id = auth.uid());

-- messages: participants of the conversation
drop policy if exists "messages_select" on public.messages;
create policy "messages_select" on public.messages for select using (
  exists (select 1 from public.conversation_participants p where p.conversation_id = conversation_id and p.user_id = auth.uid())
);

drop policy if exists "messages_insert" on public.messages;
create policy "messages_insert" on public.messages for insert with check (
  sender_id = auth.uid()
  and exists (select 1 from public.conversation_participants p where p.conversation_id = conversation_id and p.user_id = auth.uid())
);

-- post_views: readable by all, insert by authed user (or the record_view function)
drop policy if exists "post_views_select" on public.post_views;
create policy "post_views_select" on public.post_views for select using (true);

drop policy if exists "post_views_insert" on public.post_views;
create policy "post_views_insert" on public.post_views for insert with check (auth.uid() = user_id);

-- ============================================================================
-- STORAGE buckets (create in Dashboard > Storage, or run below)
-- ============================================================================
insert into storage.buckets (id, name, public, file_size_limit)
values ('media',   'media',   true, 52428800),   -- 50 MB
       ('avatars', 'avatars', true, 5242880)     -- 5 MB
on conflict (id) do nothing;

-- public read on both buckets
insert into storage.policies (name, bucket_id, operation, definition)
select 'media-public-read', 'media', 'SELECT', 'true'
where not exists (select 1 from storage.policies where bucket_id = 'media' and operation = 'SELECT');

insert into storage.policies (name, bucket_id, operation, definition)
select 'media-auth-insert', 'media', 'INSERT', 'auth.role() = ''authenticated'''
where not exists (select 1 from storage.policies where bucket_id = 'media' and operation = 'INSERT');

insert into storage.policies (name, bucket_id, operation, definition)
select 'avatars-public-read', 'avatars', 'SELECT', 'true'
where not exists (select 1 from storage.policies where bucket_id = 'avatars' and operation = 'SELECT');

insert into storage.policies (name, bucket_id, operation, definition)
select 'avatars-auth-insert', 'avatars', 'INSERT', 'auth.role() = ''authenticated'''
where not exists (select 1 from storage.policies where bucket_id = 'avatars' and operation = 'INSERT');
