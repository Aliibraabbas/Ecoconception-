import { query } from "../config/db.js";
import { mapRows } from "../utils/mapRow.js";

export async function getStats(ownerId) {
  const { rows } = await query(
    `select
       (select count(*) from projects where owner_id = $1 and status = 'active') as active_projects,
       (select count(*) from tasks t join projects p on p.id = t.project_id
          where p.owner_id = $1 and t.status != 'done') as active_tasks,
       (select count(*) from tasks t join projects p on p.id = t.project_id
          where p.owner_id = $1 and t.status != 'done' and t.due_date < current_date) as overdue_tasks,
       (select count(*) from tasks t join projects p on p.id = t.project_id
          where p.owner_id = $1 and t.status = 'done'
          and t.completed_at >= date_trunc('week', now())) as completed_this_week`,
    [ownerId]
  );
  const row = rows[0];
  return {
    activeProjects: parseInt(row.active_projects, 10),
    activeTasks: parseInt(row.active_tasks, 10),
    overdueTasks: parseInt(row.overdue_tasks, 10),
    completedThisWeek: parseInt(row.completed_this_week, 10),
  };
}

export async function getStatusBreakdown(ownerId) {
  const { rows } = await query(
    `select t.status, count(*) as count
       from tasks t join projects p on p.id = t.project_id
      where p.owner_id = $1
      group by t.status`,
    [ownerId]
  );
  return rows.map((r) => ({ status: r.status, count: parseInt(r.count, 10) }));
}

export async function getPriorityBreakdown(ownerId) {
  const { rows } = await query(
    `select t.priority, count(*) as count
       from tasks t join projects p on p.id = t.project_id
      where p.owner_id = $1 and t.status != 'done'
      group by t.priority`,
    [ownerId]
  );
  return rows.map((r) => ({ priority: r.priority, count: parseInt(r.count, 10) }));
}

export async function getCompletionSeries(ownerId, days) {
  const { rows } = await query(
    `select date_trunc('day', t.completed_at)::date as day, count(*) as count
       from tasks t join projects p on p.id = t.project_id
      where p.owner_id = $1 and t.status = 'done'
        and t.completed_at >= current_date - $2::int
      group by day
      order by day asc`,
    [ownerId, days]
  );
  return rows.map((r) => ({ date: r.day, count: parseInt(r.count, 10) }));
}

export async function getRecentProjects(ownerId, limit) {
  const { rows } = await query(
    `select p.*,
            coalesce(t.total, 0) as task_count,
            case when coalesce(t.total, 0) = 0 then 0 else round(t.done::numeric / t.total, 4) end as progress
       from projects p
       left join (
         select project_id, count(*) as total, count(*) filter (where status = 'done') as done
           from tasks group by project_id
       ) t on t.project_id = p.id
      where p.owner_id = $1
      order by p.updated_at desc nulls last, p.created_at desc
      limit $2`,
    [ownerId, limit]
  );
  return mapRows(rows);
}
