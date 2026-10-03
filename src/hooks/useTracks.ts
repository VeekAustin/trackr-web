import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Track {
  _id: string;
  name: string;
  color: string;
}

export function useTracks() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const tracksQuery = useQuery<Track[]>({
    queryKey: ["tracks", token],
    queryFn: () => apiFetch("/tracks", {}, token as string),
    enabled: !!token,
  });

  const createTrack = useMutation({
    mutationFn: (data: { name: string; color: string }) =>
      apiFetch("/tracks", { method: "POST", body: JSON.stringify(data) }, token as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks", token] });
    },
  });

  const deleteTrack = useMutation({
    mutationFn: (id: string) =>
      apiFetch("/tracks/" + id, { method: "DELETE" }, token as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks", token] });
      queryClient.invalidateQueries({ queryKey: ["entries", token] }); // cascade deleted entries too
    },
  });

  return { tracksQuery, createTrack, deleteTrack };
}