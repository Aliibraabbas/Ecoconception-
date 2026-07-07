import * as searchService from "../services/search.service.js";

export async function search(req, res, next) {
  try {
    const q = req.query.q || "";
    const result = await searchService.search(req.user.id, q, req.query);
    res.set("Cache-Control", "private, no-cache");
    res.json(result);
  } catch (err) {
    next(err);
  }
}
