"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { shiftDate } from "@/lib/dates";
import { TRACK_TEMPLATES } from "@/lib/templates";
import { HeatmapGrid } from "./components/ActivityHeatmap";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400";

// A fixed example, so the preview is identical on the server and in the browser.
const EXAMPLE_TODAY = "2026-10-30";

function buildExampleCounts() {
  const counts: { date: string; count: number }[] = [];
  for (let i = 0; i < 90; i++) {
    const date = shiftDate(EXAMPLE_TODAY, -(89 - i));
    const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
    const weekend = weekday === 0 || weekday === 6;
    let count = weekend
      ? i % 3 === 0 ? 1 : 0
      : 1 + (i % 4 === 0 ? 1 : 0) + (i % 9 === 0 ? 2 : 0);
    if (i % 13 === 5) count = 0; // a few quiet days
    if (count > 0) counts.push({ date, count });
  }
  return counts;
}

const EXAMPLE_COUNTS = buildExampleCounts();

export default function Home() {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && token) router.replace("/dashboard");
  }, [loading, token, router]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="text-lg font-semibold tracking-tight">Trackr</span>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/login" className={`text-gray-300 hover:text-white ${focusRing}`}>
            Log in
          </Link>
          <Link
            href="/signup"
            className={`rounded bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-600 ${focusRing}`}
          >
            Sign up
          </Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-5xl gap-12 px-6 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-24">
          <div>
            <h1 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              Keep a record of what you&apos;ve actually done.
            </h1>
            <p className="mt-6 max-w-md text-lg text-gray-300">
              Trackr is a progress log, not a to-do list. Log what you did each
              day and watch your history build up.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className={`rounded bg-emerald-700 px-5 py-2.5 font-medium text-white hover:bg-emerald-600 ${focusRing}`}
              >
                Create an account
              </Link>
              <Link
                href="/login"
                className={`rounded border border-gray-700 px-5 py-2.5 font-medium text-gray-200 hover:border-gray-500 ${focusRing}`}
              >
                Log in
              </Link>
            </div>
          </div>

          <div className="w-fit max-w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-4">
            <p className="mb-3 text-sm text-gray-400">
              Example: 90 days of logging. Each square is a day.
            </p>
            <HeatmapGrid today={EXAMPLE_TODAY} counts={EXAMPLE_COUNTS} />
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-20">
          <h2 className="text-2xl font-semibold tracking-tight">
            Tracks for any kind of work
          </h2>
          <p className="mt-3 max-w-md text-gray-300">
            Name your own tracks, or take an idea from these.
          </p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TRACK_TEMPLATES.map((template) => (
              <li
                key={template.id}
                className="rounded-lg border border-gray-800 bg-gray-900 p-4"
              >
                <h3 className="font-medium">{template.name}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {template.tracks.map((track) => (
                    <span
                      key={track.name}
                      className="rounded-full px-3 py-1 text-sm"
                      style={{ backgroundColor: track.color + "22", color: track.color }}
                    >
                      {track.name}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/signup"
            className={`mt-8 inline-block rounded bg-emerald-700 px-5 py-2.5 font-medium text-white hover:bg-emerald-600 ${focusRing}`}
          >
            Create an account
          </Link>
        </section>
      </main>

      <footer className="border-t border-gray-800">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-gray-400">
          <span>Built by Veek</span>
          <a href="https://github.com/VeekAustin" className={`hover:text-white ${focusRing}`}>
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}