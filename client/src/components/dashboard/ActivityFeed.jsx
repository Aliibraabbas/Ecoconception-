import { useActivities } from "@/hooks/useActivities.js";
import { Skeleton } from "@/components/common/Skeleton.jsx";
import { formatRelativeDate } from "@/utils/formatters.js";

const VERB_LABELS = { created: "a créé", updated: "a modifié", completed: "a terminé", deleted: "a supprimé" };
const ENTITY_LABELS = { project: "le projet", task: "la tâche", category: "la catégorie" };

export function ActivityFeed() {
  const { data, isLoading } = useActivities({ limit: 8 });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  const activities = data?.data ?? [];

  if (activities.length === 0) {
    return <p className="text-sm text-text-secondary">Aucune activité récente.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {activities.map((activity) => (
        <li key={activity.id} className="text-sm text-text">
          <span className="text-text-secondary">Vous {VERB_LABELS[activity.verb]} {ENTITY_LABELS[activity.entityType]}</span>{" "}
          {activity.metadata?.name || activity.metadata?.title || ""}
          <span className="block text-xs text-text-secondary">{formatRelativeDate(activity.createdAt)}</span>
        </li>
      ))}
    </ul>
  );
}
