import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api.js";

export function useTasks(projectId, query = {}) {
  return useQuery({
    queryKey: ["tasks", projectId, query],
    queryFn: () => api.get(`/api/projects/${projectId}/tasks`, query),
    enabled: Boolean(projectId),
  });
}

export function useCreateTask(projectId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.post(`/api/projects/${projectId}/tasks`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateTask(projectId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => api.put(`/api/tasks/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteTask(projectId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/api/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
