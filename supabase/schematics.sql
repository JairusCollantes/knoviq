--Not Final some changes may occur

--Profile table with demo data
create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    name text not null default 'Raora Panthera',
    handle text not null default '@raoraPanthera',
    initials text not null default 'RP',
    bio text not null default 'Learning Java, C++ and Calculus one quiz at a time.',
    joined_at timestamptz not null default now()
);

-- Topics table with demo data
create table if not exists public.topics (
    id text primary key,
    name text not null,
    color text not null default '#5f9de8',
    icon text not null default 'BookOpen',
    owner_id uuid references auth.users (id) on delete set null,
    created_at timestamptz not null default now()
);
-- Lessons table
create table if not exists public.lessons (
  id text primary key,
  topic_id text not null references public.topics(id) on delete cascade,
  title text not null,
  difficulty text not null default 'beginner' check (difficulty in ('beginner','intermediate','advanced')),
  introduction text not null default '',
  concepts jsonb not null default '[]'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id text not null references public.lessons(id) on delete cascade,
  type text not null default 'multiple_choice' check (type in ('multiple_choice','fill_blank','matching','true_false','multiple_select')),
  question text not null,
  options jsonb,
  answer text,
  accepted_answers jsonb,
  pairs jsonb,
  metadata jsonb not null default '{}'::jsonb,
  explanation text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists questions_lesson_idx on public.questions (lesson_id);

-- Attempts
create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  answers jsonb not null default '[]'::jsonb,
  score_pct integer not null default 0,
  correct_count integer not null default 0,
  total integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists attempts_user_idx on public.attempts (user_id, created_at desc);

create index if not exists attempts_lesson_idx on public.attempts (lesson_id);

-- Generation jobs (also enforces the one-generation-per-day quota)
create table if not exists public.generation_jobs (
    id uuid primary key default gen_random_uuid (),
    user_id uuid not null references auth.users (id) on delete cascade,
    topic_input text not null default '',
    status text not null default 'ok' check (
        status in (
            'pending',
            'ok',
            'mock',
            'error',
            'rate_limited'
        )
    ),
    error text,
    day date default ((now() at time zone 'utc')::date),
    created_at timestamptz not null default now()
);

create index if not exists generation_jobs_user_idx on public.generation_jobs (user_id, created_at desc);

-- Existing databases: add the quota column and the 'pending' status
alter table public.generation_jobs
    add column if not exists day date default ((now() at time zone 'utc')::date);

alter table public.generation_jobs
    drop constraint if exists generation_jobs_status_check;

alter table public.generation_jobs
    add constraint generation_jobs_status_check check (
        status in (
            'pending',
            'ok',
            'mock',
            'error',
            'rate_limited'
        )
    );

-- One generation per user per UTC day. `day` is nullable: setting it to null
-- refunds the slot while keeping the failed job on record (NULLs don't collide).
create unique index if not exists generation_jobs_user_day_uidx on public.generation_jobs (user_id, day);

-- Row Level Security
alter table public.profiles enable row level security;

alter table public.topics enable row level security;

alter table public.lessons enable row level security;

alter table public.questions enable row level security;

alter table public.attempts enable row level security;

alter table public.generation_jobs enable row level security;

-- Profiles: owner read/write
drop policy if exists "profiles owner" on public.profiles;

create policy "profiles owner" on public.profiles for all using (auth.uid () = id)
with
    check (auth.uid () = id);

-- Topics/questions: read public; lessons: onboarding (created_by null) + own rows; writes authenticated
drop policy if exists "topics read" on public.topics;

create policy "topics read" on public.topics for select using (true);

drop policy if exists "topics write auth" on public.topics;

create policy "topics write auth" on public.topics for
insert
with
    check (
        auth.role () = 'authenticated'
    );

drop policy if exists "topics owner update" on public.topics;

create policy "topics owner update" on public.topics for
update using (auth.uid () = owner_id)
with
    check (auth.uid () = owner_id);

drop policy if exists "topics owner delete" on public.topics;

create policy "topics owner delete" on public.topics for delete using (auth.uid () = owner_id);

drop policy if exists "lessons read" on public.lessons;

create policy "lessons read" on public.lessons for
select using (
        created_by is null
        or auth.uid () = created_by
    );

drop policy if exists "lessons write auth" on public.lessons;

create policy "lessons write auth" on public.lessons for
insert
with
    check (
        auth.role () = 'authenticated'
    );

-- Questions are only served through the API (service role) so answer fields
-- never reach the browser. No client-facing select policy.
drop policy if exists "questions read" on public.questions;

drop policy if exists "questions write auth" on public.questions;

create policy "questions write auth" on public.questions for
insert
with
    check (
        auth.role () = 'authenticated'
    );

-- Attempts + jobs: owner only
drop policy if exists "attempts owner" on public.attempts;

create policy "attempts owner" on public.attempts for all using (auth.uid () = user_id)
with
    check (auth.uid () = user_id);

drop policy if exists "jobs owner" on public.generation_jobs;

create policy "jobs owner" on public.generation_jobs for all using (auth.uid () = user_id)
with
    check (auth.uid () = user_id);

-- Create a profile row automatically when a user signs up
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer
set search_path = public as $$
begin
    insert into public.profiles (id) values (new.id) on conflict do nothing;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
    after insert on auth.users for each row execute function public.handle_new_user();