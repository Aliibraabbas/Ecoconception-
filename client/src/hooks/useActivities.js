import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api.js";

export function useActivities(params = {}) {
  return useQuery({
    queryKey: ["activities", params],
    queryFn: () => api.get("/api/activities", params),
  });
}
