import { query } from "../config/db.js";
import { mapRow, mapRows } from "../utils/mapRow.js";

export async function list(ownerId) {
  const { rows } = await query(
    "select * from categories where owner_id = $1 order by name asc",
    [ownerId]
  );
  return mapRows(rows);
}

export async function findById(id) {
  const { rows } = await query("select * from categories where id = $1", [id]);
  return mapRow(rows[0]);
}

export async function create(ownerId, { name, color }) {
  const { rows } = await query(
    `insert into categories (owner_id, name, color)
     values ($1, $2, coalesce($3, '#10B981'))
     returning *`,
    [ownerId, name, color ?? null]
  );
  return mapRow(rows[0]);
}

export async function update(id, { name, color }) {
  const { rows } = await query(
    `update categories set name = coalesce($2, name), color = coalesce($3, color)
      where id = $1
      returning *`,
    [id, name ?? null, color ?? null]
  );
  return mapRow(rows[0]);
}

export async function remove(id) {
  const { rows } = await query("delete from categories where id = $1 returning id", [id]);
  return mapRow(rows[0]);
}
