create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  title text not null check (char_length(title) >= 1),
  description text,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  due_date date,
  position integer not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create trigger trg_tasks_updated_at
  before update on tasks
  for each row execute function set_updated_at();

create index if not exists idx_tasks_project_id on tasks(project_id);
create index if not exists idx_tasks_status on tasks(status);
create index if not exists idx_tasks_due_date on tasks(due_date);
create index if not exists idx_tasks_project_position on tasks(project_id, position);

alter table tasks enable row level security;

create policy "tasks_all_own" on tasks
  for all using (
    exists (select 1 from projects p where p.id = tasks.project_id and p.owner_id = auth.uid())
  ) with check (
    exists (select 1 from projects p where p.id = tasks.project_id and p.owner_id = auth.uid())
  );
