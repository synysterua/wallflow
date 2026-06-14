-- Wallflow schema — paste into Supabase SQL editor and run

-- ─── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists pgcrypto;

-- ─── Tables ───────────────────────────────────────────────────────────────────
create table if not exists workspaces (
  id                uuid primary key default gen_random_uuid(),
  owner_id          uuid references auth.users(id) on delete cascade,
  name              text not null,
  public_token      text unique not null default encode(gen_random_bytes(16), 'hex'),
  plan              text not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id text,
  settings          jsonb not null default '{"layout":"grid","accent":"#4f46e5","watermark":true}',
  created_at        timestamptz not null default now()
);

create table if not exists testimonials (
  id               uuid primary key default gen_random_uuid(),
  workspace_id     uuid not null references workspaces(id) on delete cascade,
  author_name      text not null,
  author_title     text,
  author_avatar_url text,
  content          text not null,
  rating           int check (rating between 1 and 5),
  source           text not null default 'form',
  status           text not null default 'pending' check (status in ('pending', 'approved', 'hidden')),
  created_at       timestamptz not null default now()
);

create table if not exists rate_limits (
  key          text primary key,
  window_start timestamptz not null,
  count        int not null default 0
);

-- ─── Workflows ────────────────────────────────────────────────────────────────
create table if not exists workflows (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users(id) on delete cascade,
  name        text not null default 'Untitled Workflow',
  status      text not null default 'draft' check (status in ('draft', 'active', 'paused')),
  nodes       jsonb not null default '[]',
  edges       jsonb not null default '[]',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── Executions ───────────────────────────────────────────────────────────────
create table if not exists executions (
  id           uuid primary key default gen_random_uuid(),
  workflow_id  uuid not null references workflows(id) on delete cascade,
  owner_id     uuid not null references auth.users(id) on delete cascade,
  status       text not null default 'running' check (status in ('running', 'success', 'error')),
  trigger_payload jsonb,
  steps        jsonb not null default '[]',
  started_at   timestamptz not null default now(),
  finished_at  timestamptz
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
create index if not exists testimonials_workspace_status_idx
  on testimonials(workspace_id, status);

create index if not exists workspaces_public_token_idx
  on workspaces(public_token);

create index if not exists workflows_owner_idx
  on workflows(owner_id, created_at desc);

create index if not exists executions_workflow_idx
  on executions(workflow_id, started_at desc);

create index if not exists executions_owner_idx
  on executions(owner_id, started_at desc);

-- ─── Row-Level Security ───────────────────────────────────────────────────────
alter table workspaces enable row level security;
alter table testimonials enable row level security;
alter table workflows enable row level security;
alter table executions enable row level security;

-- workspaces: owner can do anything to their own rows
create policy "owner_all" on workspaces
  for all using (owner_id = auth.uid());

-- testimonials: owner of the workspace can manage testimonials
create policy "owner_all" on testimonials
  for all using (
    exists (
      select 1 from workspaces w
      where w.id = testimonials.workspace_id
        and w.owner_id = auth.uid()
    )
  );

-- workflows: owner can do anything
create policy "owner_all" on workflows
  for all using (owner_id = auth.uid());

-- executions: owner can do anything
create policy "owner_all" on executions
  for all using (owner_id = auth.uid());

-- Note: public collect API and widget page use the service-role client
-- and bypass RLS intentionally, scoped strictly by validated public_token.

-- NOTE (2026-06-14): The `workflows` and `executions` tables are orphaned
-- (no longer referenced by application code after the Nexus → Wallflow pivot).
-- Their RLS policies are active and harmless. Do NOT drop them here —
-- the new owner should handle DB cleanup after acquisition.

-- ─── Auto-update updated_at ───────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger workflows_updated_at
  before update on workflows
  for each row execute procedure set_updated_at();

-- ─── Atomic rate-limit increment (no TOCTOU race under concurrency) ────────────
-- Returns true if the request is allowed, false if the limit is exceeded.
create or replace function increment_rate_limit(p_key text, p_window_ms int, p_max int)
returns boolean
language plpgsql as $$
declare
  v_now timestamptz := now();
  v_window_start timestamptz := v_now - (p_window_ms * interval '1 millisecond');
  v_count int;
begin
  insert into rate_limits(key, window_start, count)
  values (p_key, v_now, 1)
  on conflict (key) do update
    set count = case when rate_limits.window_start < v_window_start then 1
                     else rate_limits.count + 1 end,
        window_start = case when rate_limits.window_start < v_window_start then v_now
                            else rate_limits.window_start end
  returning count into v_count;
  return v_count <= p_max;
end;
$$;

-- Partial unique index : one workspace per authenticated owner (anti-doublon)
create unique index if not exists workspaces_owner_unique
  on workspaces(owner_id) where owner_id is not null;
