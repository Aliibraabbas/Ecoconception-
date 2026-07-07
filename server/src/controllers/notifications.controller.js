import * as notificationsService from "../services/notifications.service.js";

export async function list(req, res, next) {
  try {
    await notificationsService.generateDueDateNotifications(req.user.id);
    const result = await notificationsService.listNotifications(req.user.id, req.query);
    res.set("Cache-Control", "private, no-cache");
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function markRead(req, res, next) {
  try {
    const notification = await notificationsService.markAsRead(req.params.id, req.user.id);
    res.json({ notification });
  } catch (err) {
    next(err);
  }
}

export async function markAllRead(req, res, next) {
  try {
    const updated = await notificationsService.markAllAsRead(req.user.id);
    res.json({ updated });
  } catch (err) {
    next(err);
  }
}
