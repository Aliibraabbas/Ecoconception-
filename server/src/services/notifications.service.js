import * as notificationsRepo from "../repositories/notifications.repository.js";
import * as tasksRepo from "../repositories/tasks.repository.js";
import { NotFoundError, ForbiddenError } from "../utils/errors.js";
import { parsePagination, buildPaginationMeta } from "../utils/pagination.js";

// Génère (sans doublon) les notifications d'échéance proche/dépassée pour les 7 prochains jours.
async function generateDueDateNotifications(userId) {
  const today = new Date();
  const in7Days = new Date(today);
  in7Days.setDate(in7Days.getDate() + 7);
  const from = today.toISOString().slice(0, 10);
  const to = in7Days.toISOString().slice(0, 10);

  const tasks = await tasksRepo.findByDueDateRange(userId, "1970-01-01", to);
  for (const task of tasks) {
    if (task.status === "done") continue;
    const overdue = task.dueDate < from;
    const type = overdue ? "task_overdue" : "task_due_soon";
    if (await notificationsRepo.existsForTask(userId, type, task.id)) continue;
    await notificationsRepo.create(userId, {
      type,
      title: overdue ? "Tâche en retard" : "Échéance proche",
      body: task.title,
      data: { taskId: task.id },
    });
  }
}

export async function listNotifications(userId, query) {
  const { page, limit, offset } = parsePagination(query);
  const read = query.read === "true" ? true : query.read === "false" ? false : undefined;
  const { data, total, unreadCount } = await notificationsRepo.list(userId, { read, limit, offset });
  return { data, unreadCount, pagination: buildPaginationMeta(page, limit, total) };
}

export async function markAsRead(id, userId) {
  const notification = await notificationsRepo.findById(id);
  if (!notification) throw new NotFoundError("Notification introuvable");
  if (notification.userId !== userId) throw new ForbiddenError();
  return notificationsRepo.markRead(id);
}

export async function markAllAsRead(userId) {
  const updated = await notificationsRepo.markAllRead(userId);
  return updated;
}

export { generateDueDateNotifications };
