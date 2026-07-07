create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  verb text not null check (verb in ('created', 'updated', 'completed', 'deleted')),
  entity_type text not null check (entity_type in ('project', 'task', 'category')),
  entity_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_activities_user_created on activities(user_id, created_at desc);

alter table activities enable row level security;

create policy "activities_all_own" on activities
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
