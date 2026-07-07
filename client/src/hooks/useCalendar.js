import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api.js";

export function useCalendar(from, to) {
  return useQuery({
    queryKey: ["calendar", from, to],
    queryFn: () => api.get("/api/calendar", { from, to }),
    enabled: Boolean(from && to),
  });
}
