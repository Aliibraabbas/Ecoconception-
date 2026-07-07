import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api.js";
import { useDebounce } from "./useDebounce.js";

export function useSearch(term) {
  const debounced = useDebounce(term, 300);

  return useQuery({
    queryKey: ["search", debounced],
    queryFn: () => api.get("/api/search", { q: debounced }),
    enabled: debounced.trim().length > 1,
  });
}
