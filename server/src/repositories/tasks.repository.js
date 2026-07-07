import { query } from "../config/db.js";
import { mapRow, mapRows } from "../utils/mapRow.js";

const SORTABLE_COLUMNS = ["due_date", "priority", "position", "created_at"];

export function isSortable(column) {
  return SORTABLE_COLUMNS.includes(column);
}

export async function list(projectId, { status, priority, categoryId, sort, offset, limit }) {
  const conditions = ["project_id = $1"];
  const params = [projectId];

  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }
  if (priority) {
    params.push(priority);
    conditions.push(`priority = $${params.length}`);
  }
  if (categoryId) {
    params.push(categoryId);
    conditions.push(`category_id = $${params.length}`);
  }

  const orderColumn = sort && isSortable(sort.column) ? sort.column : "position";
  const orderDirection = sort ? sort.direction : "asc";

  params.push(limit, offset);
  const { rows } = await query(
    `select * from tasks
      where ${conditions.join(" and ")}
      order by ${orderColumn} ${orderDirection}
      limit $${params.length - 1} offset $${params.length}`,
    params
  );

  const { rows: countRows } = await query(
    `select count(*) from tasks where ${conditions.join(" and ")}`,
    params.slice(0, params.length - 2)
  );

  return { data: mapRows(rows), total: parseInt(countRows[0].count, 10) };
}

export async function findById(id) {
  const { rows } = await query("select * from tasks where id = $1", [id]);
  return mapRow(rows[0]);
}

export async function findByIdWithOwner(id) {
  const { rows } = await query(
    `select t.*, p.owner_id
       from tasks t join projects p on p.id = t.project_id
      where t.id = $1`,
    [id]
  );
  return mapRow(rows[0]);
}

export async function nextPosition(projectId, status) {
  const { rows } = await query(
    "select coalesce(max(position), -1) + 1 as next from tasks where project_id = $1 and status = $2",
    [projectId, status]
  );
  return rows[0].next;
}

export async function create(projectId, { title, description, priority, status, dueDate, categoryId, position }) {
  const { rows } = await query(
    `insert into tasks (project_id, category_id, title, description, priority, status, due_date, position, completed_at)
     values ($1, $2, $3, $4, coalesce($5, 'medium'), coalesce($6, 'todo'), $7, $8,
             case when coalesce($6, 'todo') = 'done' then now() else null end)
     returning *`,
    [projectId, categoryId ?? null, title, description ?? null, priority ?? null, status ?? null, dueDate ?? null, position]
  );
  return mapRow(rows[0]);
}

export async function update(id, { title, description, priority, status, dueDate, categoryId, position }) {
  const { rows } = await query(
    `update tasks
        set title        = coalesce($2, title),
            description  = coalesce($3, description),
            priority     = coalesce($4, priority),
            status       = coalesce($5, status),
            due_date     = coalesce($6, due_date),
            category_id  = case when $7 then null else coalesce($8, category_id) end,
            position     = coalesce($9, position),
            completed_at = case
                              when coalesce($5, status) = 'done' and completed_at is null then now()
                              when coalesce($5, status) != 'done' then null
                              else completed_at
                            end,
            updated_at   = now()
      where id = $1
      returning *`,
    [
      id,
      title ?? null,
      description ?? null,
      priority ?? null,
      status ?? null,
      dueDate ?? null,
      categoryId === null,
      categoryId ?? null,
      position ?? null,
    ]
  );
  return mapRow(rows[0]);
}

export async function remove(id) {
  const { rows } = await query("delete from tasks where id = $1 returning id", [id]);
  return mapRow(rows[0]);
}

export async function findByDueDateRange(ownerId, from, to) {
  const { rows } = await query(
    `select t.* from tasks t
       join projects p on p.id = t.project_id
      where p.owner_id = $1 and t.due_date between $2 and $3
      order by t.due_date asc`,
    [ownerId, from, to]
  );
  return mapRows(rows);
}

export async function findUpcoming(ownerId, limit) {
  const { rows } = await query(
    `select t.* from tasks t
       join projects p on p.id = t.project_id
      where p.owner_id = $1 and t.status != 'done' and t.due_date is not null and t.due_date >= current_date
      order by t.due_date asc
      limit $2`,
    [ownerId, limit]
  );
  return mapRows(rows);
}

export async function searchByOwner(ownerId, term, limit, offset) {
  const { rows } = await query(
    `select t.* from tasks t
       join projects p on p.id = t.project_id
      where p.owner_id = $1 and t.title ilike $2
      order by t.created_at desc
      limit $3 offset $4`,
    [ownerId, `%${term}%`, limit, offset]
  );
  return mapRows(rows);
}
