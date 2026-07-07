import { query } from "../config/db.js";
import { mapRow } from "../utils/mapRow.js";

export async function findById(id) {
  const { rows } = await query("select * from profiles where id = $1", [id]);
  return mapRow(rows[0]);
}

export async function upsert(id, { fullName, avatarUrl } = {}) {
  const { rows } = await query(
    `insert into profiles (id, full_name, avatar_url)
     values ($1, $2, $3)
     on conflict (id) do update set full_name = coalesce($2, profiles.full_name)
     returning *`,
    [id, fullName ?? null, avatarUrl ?? null]
  );
  return mapRow(rows[0]);
}

export async function update(id, { fullName, avatarUrl, theme, locale }) {
  const { rows } = await query(
    `update profiles
       set full_name  = coalesce($2, full_name),
           avatar_url  = coalesce($3, avatar_url),
           theme       = coalesce($4, theme),
           locale      = coalesce($5, locale),
           updated_at  = now()
     where id = $1
     returning *`,
    [id, fullName ?? null, avatarUrl ?? null, theme ?? null, locale ?? null]
  );
  return mapRow(rows[0]);
}
