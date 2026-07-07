import { query } from "../config/db.js";
import { mapRow, mapRows } from "../utils/mapRow.js";

export async function list(userId, { read, limit, offset }) {
  const conditions = ["user_id = $1"];
  const params = [userId];
  if (typeof read === "boolean") {
    params.push(read);
    conditions.push(`read = $${params.length}`);
  }
  params.push(limit, offset);
  const { rows } = await query(
    `select * from notifications where ${conditions.join(" and ")}
      order by created_at desc
      limit $${params.length - 1} offset $${params.length}`,
    params
  );
  const { rows: countRows } = await query(
    `select count(*) from notifications where ${conditions.join(" and ")}`,
    params.slice(0, params.length - 2)
  );
  const { rows: unreadRows } = await query(
    "select count(*) from notifications where user_id = $1 and read = false",
    [userId]
  );
  return {
    data: mapRows(rows),
    total: parseInt(countRows[0].count, 10),
    unreadCount: parseInt(unreadRows[0].count, 10),
  };
}

export async function findById(id) {
  const { rows } = await query("select * from notifications where id = $1", [id]);
  return mapRow(rows[0]);
}

export async function existsForTask(userId, type, taskId) {
  const { rows } = await query(
    "select 1 from notifications where user_id = $1 and type = $2 and data->>'taskId' = $3 limit 1",
    [userId, type, taskId]
  );
  return rows.length > 0;
}

export async function create(userId, { type, title, body, data }) {
  const { rows } = await query(
    `insert into notifications (user_id, type, title, body, data)
     values ($1, $2, $3, $4, coalesce($5::jsonb, '{}'))
     returning *`,
    [userId, type, title, body ?? null, data ? JSON.stringify(data) : null]
  );
  return mapRow(rows[0]);
}

export async function markRead(id) {
  const { rows } = await query(
    "update notifications set read = true where id = $1 returning *",
    [id]
  );
  return mapRow(rows[0]);
}

export async function markAllRead(userId) {
  const { rowCount } = await query(
    "update notifications set read = true where user_id = $1 and read = false",
    [userId]
  );
  return rowCount;
}
