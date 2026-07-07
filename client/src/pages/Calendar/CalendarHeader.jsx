import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button.jsx";

const MONTH_FORMATTER = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });

export function CalendarHeader({ month, onPrev, onNext, onToday }) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-bold capitalize text-text">{MONTH_FORMATTER.format(month)}</h1>
      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={onToday}>
          Aujourd’hui
        </Button>
        <button onClick={onPrev} className="rounded-md p-2 text-text-secondary hover:bg-text-secondary/10" aria-label="Mois précédent">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button onClick={onNext} className="rounded-md p-2 text-text-secondary hover:bg-text-secondary/10" aria-label="Mois suivant">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
