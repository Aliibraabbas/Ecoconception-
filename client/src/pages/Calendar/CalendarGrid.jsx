import { TaskChip } from "./TaskChip.jsx";
import { toLocalDateKey } from "@/utils/formatters.js";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function buildDays(month) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // lundi = 0
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < startOffset; i += 1) days.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) days.push(new Date(year, monthIndex, d));
  return days;
}

export function CalendarGrid({ month, tasksByDate, onSelectTask }) {
  const days = buildDays(month);
  const today = toLocalDateKey(new Date());

  return (
    <div role="grid" aria-label="Calendrier mensuel" className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-text-secondary/10 bg-text-secondary/10">
      {WEEKDAYS.map((day) => (
        <div key={day} role="columnheader" className="bg-surface p-2 text-center text-xs font-medium text-text-secondary">
          {day}
        </div>
      ))}
      {days.map((date, index) => {
        if (!date) return <div key={`empty-${index}`} className="min-h-24 bg-background" />;
        const key = toLocalDateKey(date);
        const dayTasks = tasksByDate[key] ?? [];
        const isToday = key === today;
        return (
          <div key={key} role="gridcell" aria-label={date.toLocaleDateString("fr-FR")} className="min-h-24 bg-surface p-1.5">
            <span className={`text-xs ${isToday ? "rounded-full bg-primary px-1.5 py-0.5 font-semibold text-white" : "text-text-secondary"}`}>
              {date.getDate()}
            </span>
            <div className="mt-1 flex flex-col gap-1">
              {dayTasks.slice(0, 3).map((task) => (
                <TaskChip key={task.id} task={task} onClick={onSelectTask} />
              ))}
              {dayTasks.length > 3 && <span className="text-[10px] text-text-secondary">+{dayTasks.length - 3} autres</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
