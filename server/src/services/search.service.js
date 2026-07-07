import * as tasksRepo from "../repositories/tasks.repository.js";
import { query as dbQuery } from "../config/db.js";
import { mapRows } from "../utils/mapRow.js";
import { parsePagination } from "../utils/pagination.js";

export async function search(userId, term, pagination) {
  const { limit, offset } = parsePagination(pagination);

  const { rows: projectRows } = await dbQuery(
    "select * from projects where owner_id = $1 and name ilike $2 order by created_at desc limit $3 offset $4",
    [userId, `%${term}%`, limit, offset]
  );
  const tasks = await tasksRepo.searchByOwner(userId, term, limit, offset);

  return { data: { projects: mapRows(projectRows), tasks } };
}
