import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCalendar } from "@/hooks/useCalendar.js";
import { api } from "@/services/api.js";
import { toLocalDateKey } from "@/utils/formatters.js";
import { CalendarHeader } from "./CalendarHeader.jsx";
import { CalendarGrid } from "./CalendarGrid.jsx";
import { TaskFormModal } from "@/components/tasks/TaskFormModal.jsx";
import { ErrorState } from "@/components/common/ErrorState.jsx";
import { Skeleton } from "@/components/common/Skeleton.jsx";

function monthRange(month) {
  const from = new Date(month.getFullYear(), month.getMonth(), 1);
  const to = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  return { from: toLocalDateKey(from), to: toLocalDateKey(to) };
}

export default function CalendarPage() {
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedTask, setSelectedTask] = useState(null);
  const { from, to } = monthRange(month);
  const { data, isLoading, isError, refetch } = useCalendar(from, to);
  const queryClient = useQueryClient();

  const updateTask = useMutation({
    mutationFn: ({ id, ...payload }) => api.put(`/api/tasks/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const tasksByDate = useMemo(() => {
    const map = {};
    for (const entry of data?.data ?? []) map[entry.date] = entry.tasks;
    return map;
  }, [data]);

  const changeMonth = (delta) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));

  if (isLoading) return <Skeleton className="h-96" />;
  if (isError) return <ErrorState onRetry={refetch} message="Impossible de charger le calendrier." />;

  return (
    <div className="flex flex-col gap-4">
      <CalendarHeader
        month={month}
        onPrev={() => changeMonth(-1)}
        onNext={() => changeMonth(1)}
        onToday={() => setMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}
      />
      <CalendarGrid month={month} tasksByDate={tasksByDate} onSelectTask={setSelectedTask} />

      {selectedTask && (
        <TaskFormModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSubmit={async (payload) => {
            await updateTask.mutateAsync({ id: selectedTask.id, ...payload });
            setSelectedTask(null);
          }}
          loading={updateTask.isPending}
        />
      )}
    </div>
  );
}
