import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api.js";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/api/categories"),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.post("/api/categories", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/api/categories/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}
