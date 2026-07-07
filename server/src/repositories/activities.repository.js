import { query } from "../config/db.js";
import { mapRows } from "../utils/mapRow.js";

export async function list(userId, { limit, offset }) {
  const { rows } = await query(
    `select * from activities where user_id = $1
      order by created_at desc
      limit $2 offset $3`,
    [userId, limit, offset]
  );
  const { rows: countRows } = await query(
    "select count(*) from activities where user_id = $1",
    [userId]
  );
  return { data: mapRows(rows), total: parseInt(countRows[0].count, 10) };
}

export async function create(userId, { verb, entityType, entityId, metadata }) {
  await query(
    `insert into activities (user_id, verb, entity_type, entity_id, metadata)
     values ($1, $2, $3, $4, coalesce($5::jsonb, '{}'))`,
    [userId, verb, entityType, entityId ?? null, metadata ? JSON.stringify(metadata) : null]
  );
}
