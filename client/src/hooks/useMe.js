import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api.js";
import { useAuth } from "@/contexts/AuthContext.jsx";

export function useMe() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/api/me"),
    enabled: Boolean(user),
  });

  const updateMutation = useMutation({
    mutationFn: (updates) => api.put("/api/me", updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });

  return { ...query, updateProfile: updateMutation.mutateAsync, isUpdating: updateMutation.isPending };
}
