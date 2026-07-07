import * as calendarService from "../services/calendar.service.js";

export async function getCalendar(req, res, next) {
  try {
    const data = await calendarService.getCalendar(req.user.id, req.query.from, req.query.to);
    res.set("Cache-Control", "private, no-cache");
    res.json({ data });
  } catch (err) {
    next(err);
  }
}
