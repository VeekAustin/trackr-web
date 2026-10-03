import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Entry {
  _id: string;
  track: string;
  title: string;
  notes: string;
  date: string;
}

export function useEntries() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const entriesQuery = useQuery<Entry[]>({
    queryKey: ["entries", token],
    queryFn: () => apiFetch("/entries", {}, token as string),
    enabled: !!token,
  });

  const createEntry = useMutation({
    mutationFn: (data: { track: string; title: string; notes: string; date: string }) =>
      apiFetch("/entries", { method: "POST", body: JSON.stringify(data) }, token as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries", token] });
    },
  });

  const deleteEntry = useMutation({
    mutationFn: (id: string) =>
      apiFetch("/entries/" + id, { method: "DELETE" }, token as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries", token] });
    },
  });

  return { entriesQuery, createEntry, deleteEntry };
}