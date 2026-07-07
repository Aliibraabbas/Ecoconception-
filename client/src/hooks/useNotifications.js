import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/services/api.js";
import { useAuth } from "@/contexts/AuthContext.jsx";

export function useNotifications(params = {}) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["notifications", params],
    queryFn: () => api.get("/api/notifications", params),
    enabled: Boolean(user),
    refetchInterval: 60 * 1000,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["notifications"] });

  const markReadMutation = useMutation({
    mutationFn: (id) => api.put(`/api/notifications/${id}/read`),
    onSuccess: invalidate,
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => api.put("/api/notifications/read-all"),
    onSuccess: invalidate,
  });

  return {
    ...query,
    markRead: markReadMutation.mutate,
    markAllRead: markAllReadMutation.mutate,
  };
}
