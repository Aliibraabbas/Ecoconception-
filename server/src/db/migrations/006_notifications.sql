create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  data jsonb not null default '{}',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user_read on notifications(user_id, read);

alter table notifications enable row level security;

create policy "notifications_all_own" on notifications
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
