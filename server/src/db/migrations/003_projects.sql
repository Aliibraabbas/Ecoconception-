create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  name text not null check (char_length(name) >= 1),
  description text,
  color text not null default '#6366F1',
  cover_image_url text,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create trigger trg_projects_updated_at
  before update on projects
  for each row execute function set_updated_at();

create index if not exists idx_projects_owner_id on projects(owner_id);

alter table projects enable row level security;

create policy "projects_all_own" on projects
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
