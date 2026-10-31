import { useInfiniteQuery, useMutation, useQueryClient,} from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export interface Entry {
  _id: string;
  track: string;
  title: string;
  notes: string;
  date: string;
}

interface EntriesPage {
  data: Entry[];
  nextCursor: string | null;
}

export function useEntries() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const entriesQuery = useInfiniteQuery({
    queryKey: ["entries", token],
    queryFn: ({ pageParam }): Promise<EntriesPage> => {
      const qs = pageParam ? `?cursor=${encodeURIComponent(pageParam)}` : "";
      return apiFetch(`/entries${qs}`, {}, token as string);
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    // Keeps the old shape: entriesQuery.data is a flat Entry[]
    select: (result) => result.pages.flatMap((page) => page.data),
    enabled: !!token,
  });

  const createEntry = useMutation({
    mutationFn: (data: {track: string; title: string; notes: string; date: string;}) =>
      apiFetch(
        "/entries",
        { method: "POST", body: JSON.stringify(data) },
        token as string,
      ),
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