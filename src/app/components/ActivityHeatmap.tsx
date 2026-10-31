import { shiftDate } from "@/lib/dates";
import type { EntryStats } from "@/hooks/useEntryStats";

export const HEATMAP_DAYS = 90;

export interface HeatmapCell {
  date: string;
  count: number;
}

/**
 * The last `days` days ending today, padded at the start so the first day
 * lands on the right weekday row (rows run Sunday to Saturday).
 */
export function buildHeatmapCells(
  today: string,
  counts: { date: string; count: number }[],
  days: number = HEATMAP_DAYS,
): (HeatmapCell | null)[] {
  const byDate = new Map(counts.map((c) => [c.date, c.count]));
  const start = shiftDate(today, -(days - 1));
  const leading = new Date(`${start}T00:00:00Z`).getUTCDay(); // 0 = Sunday

  const cells: (HeatmapCell | null)[] = Array.from({ length: leading }, () => null);
  for (let i = 0; i < days; i++) {
    const date = shiftDate(start, i);
    cells.push({ date, count: byDate.get(date) ?? 0 });
  }
  return cells;
}

const LEVEL_CLASSES = ["bg-gray-800", "bg-emerald-900", "bg-emerald-700", "bg-emerald-400"];

function levelFor(count: number): number {
  return Math.min(count, 3);
}

/** The squares and the Less/More legend. Used on the dashboard and on the landing page. */
export function HeatmapGrid({
  today,
  counts,
}: {
  today: string;
  counts: { date: string; count: number }[];
}) {
  const cells = buildHeatmapCells(today, counts);
  const activeDays = counts.filter((c) => c.count > 0).length;

  return (
    <div>
      <div
        role="img"
        aria-label={`Activity over the last ${HEATMAP_DAYS} days: ${activeDays} active days`}
        className="grid gap-1"
        style={{
          gridTemplateRows: "repeat(7, 1rem)",
          gridAutoFlow: "column",
          gridAutoColumns: "1rem",
        }}
      >
        {cells.map((cell, i) =>
          cell === null ? (
            <span key={`pad-${i}`} aria-hidden="true" />
          ) : (
            <span
              key={cell.date}
              title={`${cell.date}: ${cell.count} ${cell.count === 1 ? "entry" : "entries"}`}
              className={`rounded-sm ${LEVEL_CLASSES[levelFor(cell.count)]}`}
            />
          ),
        )}
      </div>

      <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
        <span>Less</span>
        {LEVEL_CLASSES.map((cls) => (
          <span key={cls} aria-hidden="true" className={`h-3 w-3 rounded-sm ${cls}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

function StatTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-3">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-gray-400">{label}</p>
    </div>
  );
}

export default function ActivityHeatmap({
  stats,
  today,
}: {
  stats: EntryStats;
  today: string;
}) {
  return (
    <section aria-label="Activity" className="mb-8">
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile value={stats.total} label="Entries" />
        <StatTile value={stats.currentStreak} label="Current streak (days)" />
        <StatTile value={stats.longestStreak} label="Longest streak (days)" />
        <StatTile value={stats.activeDays} label="Active days" />
      </div>

      <div className="w-fit max-w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-4">
        <h2 className="mb-3 text-sm text-gray-400">Last {HEATMAP_DAYS} days</h2>
        <HeatmapGrid today={today} counts={stats.heatmap} />
      </div>
    </section>
  );
}