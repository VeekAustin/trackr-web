import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { localDateString } from "@/lib/dates";

export interface EntryStats {
  total: number;
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
  heatmap: { date: string; count: number }[];
}

export function useEntryStats() {
  const { token } = useAuth();
  const today = localDateString();

  // The key starts with ["entries", token], so creating or deleting an entry
  // (which invalidates that prefix) also refreshes these stats.
  const statsQuery = useQuery<EntryStats>({
    queryKey: ["entries", token, "stats", today],
    queryFn: () => apiFetch(`/entries/stats?today=${today}`, {}, token as string),
    enabled: !!token,
  });

  return { statsQuery, today };
}