import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Track } from "@/types/models";

export function useTracks() {
  const { token, user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  const tracksQuery = useQuery<Track[]>({
    queryKey: ["tracks", userId],
    queryFn: () => apiFetch("/tracks", {}, token),
    enabled: !!token && !!userId,
  });

  const createTrack = useMutation({
    mutationFn: (data: { name: string; color: string }) =>
      apiFetch("/tracks", { method: "POST", body: JSON.stringify(data) }, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks", userId] });
    },
  });

  const deleteTrack = useMutation({
    mutationFn: (id: string) => apiFetch("/tracks/" + id, { method: "DELETE" }, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks", userId] });
      queryClient.invalidateQueries({ queryKey: ["entries", userId] }); // entries and stats follow the cascade
    },
  });

  return { tracksQuery, createTrack, deleteTrack };
}