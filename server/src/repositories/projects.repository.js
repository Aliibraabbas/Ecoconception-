import { query } from "../config/db.js";
import { mapRow, mapRows } from "../utils/mapRow.js";

const SORTABLE_COLUMNS = ["name", "created_at", "updated_at"];

export function isSortable(column) {
  return SORTABLE_COLUMNS.includes(column);
}

export async function list(ownerId, { status, q, sort, offset, limit }) {
  const conditions = ["p.owner_id = $1"];
  const params = [ownerId];

  if (status) {
    params.push(status);
    conditions.push(`p.status = $${params.length}`);
  }
  if (q) {
    params.push(`%${q}%`);
    conditions.push(`p.name ilike $${params.length}`);
  }

  const orderColumn = sort && isSortable(sort.column) ? sort.column : "created_at";
  const orderDirection = sort ? sort.direction : "desc";

  params.push(limit, offset);
  const { rows } = await query(
    `select p.*,
            coalesce(t.total, 0) as task_count,
            case when coalesce(t.total, 0) = 0 then 0 else round(t.done::numeric / t.total, 4) end as progress
       from projects p
       left join (
         select project_id, count(*) as total, count(*) filter (where status = 'done') as done
           from tasks group by project_id
       ) t on t.project_id = p.id
      where ${conditions.join(" and ")}
      order by p.${orderColumn} ${orderDirection}
      limit $${params.length - 1} offset $${params.length}`,
    params
  );

  const { rows: countRows } = await query(
    `select count(*) from projects p where ${conditions.join(" and ")}`,
    params.slice(0, params.length - 2)
  );

  return { data: mapRows(rows), total: parseInt(countRows[0].count, 10) };
}

export async function findById(id) {
  const { rows } = await query("select * from projects where id = $1", [id]);
  return mapRow(rows[0]);
}

export async function create(ownerId, { name, description, color, coverImageUrl }) {
  const { rows } = await query(
    `insert into projects (owner_id, name, description, color, cover_image_url)
     values ($1, $2, $3, coalesce($4, '#6366F1'), $5)
     returning *`,
    [ownerId, name, description ?? null, color ?? null, coverImageUrl ?? null]
  );
  return mapRow(rows[0]);
}

export async function update(id, { name, description, color, coverImageUrl, status }) {
  const { rows } = await query(
    `update projects
        set name             = coalesce($2, name),
            description      = coalesce($3, description),
            color            = coalesce($4, color),
            cover_image_url  = coalesce($5, cover_image_url),
            status           = coalesce($6, status),
            updated_at       = now()
      where id = $1
      returning *`,
    [id, name ?? null, description ?? null, color ?? null, coverImageUrl ?? null, status ?? null]
  );
  return mapRow(rows[0]);
}

export async function remove(id) {
  const { rows } = await query("delete from projects where id = $1 returning id", [id]);
  return mapRow(rows[0]);
}

export async function stats(id) {
  const { rows } = await query(
    `select count(*) as total, count(*) filter (where status = 'done') as done
       from tasks where project_id = $1`,
    [id]
  );
  const total = parseInt(rows[0].total, 10);
  const done = parseInt(rows[0].done, 10);
  return { total, done, progress: total === 0 ? 0 : Math.round((done / total) * 10000) / 10000 };
}
