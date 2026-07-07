import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api.js";

export function useProjects(query = {}) {
  return useQuery({
    queryKey: ["projects", query],
    queryFn: () => api.get("/api/projects", query),
  });
}

export function useProject(id) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => api.get(`/api/projects/${id}`),
    enabled: Boolean(id),
  });
}

export function useProjectStats(id) {
  return useQuery({
    queryKey: ["projects", id, "stats"],
    queryFn: () => api.get(`/api/projects/${id}/stats`),
    enabled: Boolean(id),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.post("/api/projects", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => api.put(`/api/projects/${id}`, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.id] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/api/projects/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
}
