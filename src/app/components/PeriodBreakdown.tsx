"use client";

import { useState } from "react";
import type { EntryStats } from "@/hooks/useEntryStats";
import { formatMonth, formatWeek } from "@/lib/dates";

type Mode = "weekly" | "monthly";

interface TrackInfo {
  _id: string;
  name: string;
  color: string;
}

export default function PeriodBreakdown({
  stats,
  tracks,
}: {
  stats: EntryStats;
  tracks: TrackInfo[];
}) {
  const [mode, setMode] = useState<Mode>("weekly");

  const periods = mode === "weekly" ? stats.weeks : stats.months;
  const labelFor = (key: string) => (mode === "weekly" ? formatWeek(key) : formatMonth(key));
  const trackById = new Map(tracks.map((t) => [t._id, t]));
  // One shared scale, so bars can be compared across periods.
  const maxCount = Math.max(1, ...periods.flatMap((p) => p.byTrack.map((t) => t.count)));

  return (
    <section aria-label="Breakdown" className="mb-8">
      <div className="mb-3 flex items-center gap-3">
        <h2 className="text-sm text-gray-400">Breakdown</h2>
        <div className="flex gap-1">
          {(["weekly", "monthly"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={`rounded px-3 py-1 text-sm ${
                mode === m ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {m === "weekly" ? "Weekly" : "Monthly"}
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-3">
        {periods.map((period) => (
          <li key={period.key} className="rounded-lg border border-gray-800 bg-gray-900 p-4">
            <div className="mb-2 flex items-baseline justify-between">
              <h3 className="font-medium">{labelFor(period.key)}</h3>
              <span className="text-xs text-gray-400">
                {period.total} {period.total === 1 ? "entry" : "entries"}
              </span>
            </div>

            {period.byTrack.length === 0 ? (
              <p className="text-sm text-gray-400">No entries</p>
            ) : (
              <ul className="space-y-2">
                {period.byTrack.map(({ track, count }) => {
                  const info = trackById.get(track);
                  const color = info?.color ?? "#888";
                  return (
                    <li key={track} className="flex items-center gap-3 text-sm">
                      <span className="w-28 shrink-0 truncate" style={{ color }}>
                        {info?.name ?? "unknown"}
                      </span>
                      <div aria-hidden="true" className="h-2 flex-1 rounded-full bg-gray-800">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${(count / maxCount) * 100}%`, backgroundColor: color }}
                        />
                      </div>
                      <span className="w-6 text-right tabular-nums">{count}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}