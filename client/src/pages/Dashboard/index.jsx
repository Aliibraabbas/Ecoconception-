import { lazy, Suspense } from "react";
import { FolderKanban, ListChecks, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard.js";
import { StatCard } from "@/components/dashboard/StatCard.jsx";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed.jsx";
import { UpcomingDeadlines } from "@/components/dashboard/UpcomingDeadlines.jsx";
import { RecentProjects } from "@/components/dashboard/RecentProjects.jsx";
import { Skeleton } from "@/components/common/Skeleton.jsx";
import { ErrorState } from "@/components/common/ErrorState.jsx";

const StatusDonut = lazy(() => import("@/components/dashboard/StatusDonut.jsx"));
const CompletionLine = lazy(() => import("@/components/dashboard/CompletionLine.jsx"));
const PriorityBar = lazy(() => import("@/components/dashboard/PriorityBar.jsx"));

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useDashboard();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={refetch} message="Impossible de charger le tableau de bord." />;
  }

  const { stats, charts, upcoming, recentProjects } = data;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text">Tableau de bord</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Projets actifs" value={stats.activeProjects} Icon={FolderKanban} />
        <StatCard label="Tâches actives" value={stats.activeTasks} Icon={ListChecks} />
        <StatCard label="En retard" value={stats.overdueTasks} Icon={AlertTriangle} />
        <StatCard label="Terminées (semaine)" value={stats.completedThisWeek} Icon={CheckCircle2} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-text-secondary/10 bg-surface p-4">
          <h2 className="mb-3 text-sm font-semibold text-text">Répartition par statut</h2>
          <Suspense fallback={<Skeleton className="h-52" />}>
            <StatusDonut data={charts.statusBreakdown} />
          </Suspense>
        </div>
        <div className="rounded-xl border border-text-secondary/10 bg-surface p-4">
          <h2 className="mb-3 text-sm font-semibold text-text">Complétion (30 jours)</h2>
          <Suspense fallback={<Skeleton className="h-52" />}>
            <CompletionLine data={charts.completion30d} />
          </Suspense>
        </div>
        <div className="rounded-xl border border-text-secondary/10 bg-surface p-4">
          <h2 className="mb-3 text-sm font-semibold text-text">Tâches par priorité</h2>
          <Suspense fallback={<Skeleton className="h-52" />}>
            <PriorityBar data={charts.priorityBreakdown} />
          </Suspense>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-text-secondary/10 bg-surface p-4">
          <h2 className="mb-3 text-sm font-semibold text-text">Activité récente</h2>
          <ActivityFeed />
        </div>
        <div className="rounded-xl border border-text-secondary/10 bg-surface p-4">
          <h2 className="mb-3 text-sm font-semibold text-text">Échéances à venir</h2>
          <UpcomingDeadlines tasks={upcoming} />
        </div>
        <div className="rounded-xl border border-text-secondary/10 bg-surface p-4">
          <h2 className="mb-3 text-sm font-semibold text-text">Projets récents</h2>
          <RecentProjects projects={recentProjects} />
        </div>
      </div>
    </div>
  );
}
