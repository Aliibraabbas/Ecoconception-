import * as dashboardService from "../services/dashboard.service.js";

export async function getDashboard(req, res, next) {
  try {
    const result = await dashboardService.getDashboard(req.user.id);
    res.set("Cache-Control", "private, max-age=30");
    res.json(result);
  } catch (err) {
    next(err);
  }
}
