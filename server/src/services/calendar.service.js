import * as tasksRepo from "../repositories/tasks.repository.js";
import { ValidationError } from "../utils/errors.js";

export async function getCalendar(userId, from, to) {
  if (!from || !to) {
    throw new ValidationError("Données invalides", [
      { field: "from/to", message: "Les paramètres from et to sont requis (YYYY-MM-DD)" },
    ]);
  }
  const tasks = await tasksRepo.findByDueDateRange(userId, from, to);
  const byDate = new Map();
  for (const task of tasks) {
    const key = task.dueDate;
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key).push(task);
  }
  return [...byDate.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, dayTasks]) => ({ date, tasks: dayTasks }));
}
