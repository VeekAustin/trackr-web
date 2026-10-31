import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ActivityHeatmap, { buildHeatmapCells, HEATMAP_DAYS } from "./ActivityHeatmap";

const today = "2026-10-30";

describe("buildHeatmapCells", () => {
  it("ends on today, covers 90 days, and pads to the right weekday", () => {
    const cells = buildHeatmapCells(today, []);
    const real = cells.filter((c) => c !== null);

    expect(real).toHaveLength(HEATMAP_DAYS);
    expect(real[real.length - 1]?.date).toBe(today);

    const firstDate = real[0]!.date;
    const weekday = new Date(`${firstDate}T00:00:00Z`).getUTCDay();
    expect(cells.length - real.length).toBe(weekday);
  });

  it("fills zero for days without entries", () => {
    const cells = buildHeatmapCells(today, [{ date: "2026-10-29", count: 2 }]);
    const byDate = Object.fromEntries(cells.filter((c) => c !== null).map((c) => [c!.date, c!.count]));
    expect(byDate["2026-10-29"]).toBe(2);
    expect(byDate["2026-10-28"]).toBe(0);
  });
});

describe("ActivityHeatmap", () => {
  const stats = {
    total: 12,
    activeDays: 5,
    currentStreak: 3,
    longestStreak: 4,
    heatmap: [
      { date: "2026-10-30", count: 2 },
      { date: "2026-10-29", count: 1 },
    ],
    weeks: [],
    months: [],
  };

  it("shows the stat tiles and one cell per day", () => {
    const { container } = render(<ActivityHeatmap stats={stats} today={today} />);

    expect(screen.getByText("12")).not.toBeNull();
    expect(screen.getByText("Current streak (days)")).not.toBeNull();
    expect(screen.getByRole("img", { name: /last 90 days: 2 active days/i })).not.toBeNull();
    expect(container.querySelectorAll("[title]")).toHaveLength(HEATMAP_DAYS);
    expect(screen.getByTitle("2026-10-30: 2 entries")).not.toBeNull();
    expect(screen.getByTitle("2026-10-29: 1 entry")).not.toBeNull();
  });
});