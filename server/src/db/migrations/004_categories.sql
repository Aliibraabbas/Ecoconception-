create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  name text not null check (char_length(name) >= 1),
  color text not null default '#10B981',
  created_at timestamptz not null default now(),
  unique (owner_id, name)
);

create index if not exists idx_categories_owner_id on categories(owner_id);

alter table categories enable row level security;

create policy "categories_all_own" on categories
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
