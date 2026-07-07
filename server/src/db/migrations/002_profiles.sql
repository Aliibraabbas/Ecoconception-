create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  locale text not null default 'fr',
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

alter table profiles enable row level security;

create policy "profiles_select_own" on profiles
  for select using (id = auth.uid());
create policy "profiles_update_own" on profiles
  for update using (id = auth.uid());
create policy "profiles_insert_own" on profiles
  for insert with check (id = auth.uid());
