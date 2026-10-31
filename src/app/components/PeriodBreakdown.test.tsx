import { describe, it, expect, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import PeriodBreakdown from "./PeriodBreakdown";
import { formatMonth, formatWeek } from "@/lib/dates";

afterEach(cleanup);

const tracks = [
  { _id: "dev", name: "building", color: "#38bdf8" },
  { _id: "teach", name: "teaching", color: "#fbbf24" },
];

const stats = {
  total: 6,
  activeDays: 3,
  currentStreak: 2,
  longestStreak: 2,
  heatmap: [],
  weeks: [
    { key: "2026-10-19", total: 4, byTrack: [{ track: "dev", count: 3 }, { track: "teach", count: 1 }] },
    { key: "2026-10-12", total: 0, byTrack: [] },
  ],
  months: [{ key: "2026-10", total: 4, byTrack: [{ track: "dev", count: 4 }] }],
};

describe("PeriodBreakdown", () => {
  it("shows weeks first, with per-track counts and empty weeks", () => {
    render(<PeriodBreakdown stats={stats} tracks={tracks} />);

    expect(screen.getByText("Oct 19 – Oct 25")).not.toBeNull();
    expect(screen.getByText("4 entries")).not.toBeNull();
    expect(screen.getByText("building")).not.toBeNull();
    expect(screen.getByText("teaching")).not.toBeNull();
    expect(screen.getByText("No entries")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Weekly" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("switches to months", () => {
    render(<PeriodBreakdown stats={stats} tracks={tracks} />);
    fireEvent.click(screen.getByRole("button", { name: "Monthly" }));

    expect(screen.getByText("October 2026")).not.toBeNull();
    expect(screen.queryByText("Oct 19 – Oct 25")).toBeNull();
    expect(screen.getByRole("button", { name: "Monthly" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("labels a track that no longer exists as unknown", () => {
    render(<PeriodBreakdown stats={stats} tracks={[]} />);
    expect(screen.getAllByText("unknown").length).toBeGreaterThan(0);
  });
});

describe("date formatting", () => {
  it("formats weeks across a month boundary and months", () => {
    expect(formatWeek("2026-10-26")).toBe("Oct 26 – Nov 1");
    expect(formatMonth("2026-02")).toBe("February 2026");
  });
});