import * as activitiesService from "../services/activities.service.js";
import { parsePagination, buildPaginationMeta } from "../utils/pagination.js";

export async function list(req, res, next) {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const { data, total } = await activitiesService.listActivities(req.user.id, { limit, offset });
    res.set("Cache-Control", "private, no-cache");
    res.json({ data, pagination: buildPaginationMeta(page, limit, total) });
  } catch (err) {
    next(err);
  }
}
