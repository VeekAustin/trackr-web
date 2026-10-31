import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Entry } from "@/types/models";

interface EntriesPage {
  data: Entry[];
  nextCursor: string | null;
}

export function useEntries() {
  const { token, user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  const entriesQuery = useInfiniteQuery({
    queryKey: ["entries", userId],
    queryFn: ({ pageParam }): Promise<EntriesPage> => {
      const qs = pageParam ? `?cursor=${encodeURIComponent(pageParam)}` : "";
      return apiFetch(`/entries${qs}`, {}, token);
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    // Keeps the dashboard simple: entriesQuery.data is a flat Entry[]
    select: (result) => result.pages.flatMap((page) => page.data),
    enabled: !!token && !!userId,
  });

  const createEntry = useMutation({
    mutationFn: (data: { track: string; title: string; notes: string; date: string }) =>
      apiFetch("/entries", { method: "POST", body: JSON.stringify(data) }, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries", userId] });
    },
  });

  const deleteEntry = useMutation({
    mutationFn: (id: string) => apiFetch("/entries/" + id, { method: "DELETE" }, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries", userId] });
    },
  });

  return { entriesQuery, createEntry, deleteEntry };
}