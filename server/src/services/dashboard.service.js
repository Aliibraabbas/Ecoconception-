import * as dashboardRepo from "../repositories/dashboard.repository.js";
import * as tasksRepo from "../repositories/tasks.repository.js";

export async function getDashboard(userId) {
  const [stats, statusBreakdown, priorityBreakdown, completion30d, upcoming, recentProjects] =
    await Promise.all([
      dashboardRepo.getStats(userId),
      dashboardRepo.getStatusBreakdown(userId),
      dashboardRepo.getPriorityBreakdown(userId),
      dashboardRepo.getCompletionSeries(userId, 30),
      tasksRepo.findUpcoming(userId, 5),
      dashboardRepo.getRecentProjects(userId, 5),
    ]);

  return {
    stats,
    charts: { statusBreakdown, priorityBreakdown, completion30d },
    upcoming,
    recentProjects,
  };
}
