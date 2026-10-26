"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { TRACK_TEMPLATES } from "@/lib/templates";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400";

const SAMPLE_ENTRIES = [
  {
    track: "teaching",
    color: "#fbbf24",
    when: "Today",
    title: "Ran a revision class on quadratic equations",
    notes: "Most of the class got the factorising method. Repeat it Thursday.",
  },
  {
    track: "building",
    color: "#38bdf8",
    when: "Yesterday",
    title: "Added cursor pagination to the entries API",
    notes: "",
  },
  {
    track: "journaling",
    color: "#818cf8",
    when: "3 days ago",
    title: "Reviewed the week's trades",
    notes: "Two entries taken too early. Wait for the close.",
  },
  {
    track: "learning",
    color: "#2dd4bf",
    when: "4 days ago",
    title: "Finished the Redis basics module",
    notes: "",
  },
];

const STEPS = [
  {
    title: "Make a track for each kind of work",
    body: "Name it, pick a color. Teaching, coding, trading, a course: whatever you spend time on.",
  },
  {
    title: "Log what you did",
    body: "Add a title and optional notes. Forgot yesterday? Pick any past date and fill it in.",
  },
  {
    title: "Look back at your history",
    body: "Every entry stays in your log, newest first, so you can see the effort you've put in.",
  },
];

function TrackChip({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="rounded-full px-3 py-1 text-sm"
      style={{ backgroundColor: color + "22", color }}
    >
      {name}
    </span>
  );
}

export default function Home() {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && token) router.replace("/dashboard");
  }, [loading, token, router]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="text-lg font-semibold tracking-tight">Trackr</span>
        <nav className="flex items-center gap-5 text-sm">
          <Link
            href="/login"
            className={`text-gray-300 hover:text-white ${focusRing}`}
          >
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
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-24">
          <div>
            <h1 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Keep a record of what you&apos;ve actually done.
            </h1>
            <p className="mt-6 max-w-md text-lg text-gray-300">
              Trackr is a progress log, not a to-do list. Add a track for each
              kind of work, log what you did, and build a history of your
              effort.
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

          <div>
            <p className="mb-3 text-sm text-gray-400">
              An example log (sample entries)
            </p>
            <div className="space-y-2">
              {SAMPLE_ENTRIES.map((entry) => (
                <div
                  key={entry.title}
                  className="rounded-lg border border-gray-800 bg-gray-900 p-3"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className="rounded px-2 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: entry.color + "22",
                        color: entry.color,
                      }}
                    >
                      {entry.track}
                    </span>
                    <span className="text-xs text-gray-400">{entry.when}</span>
                  </div>
                  <p className="text-sm font-medium">{entry.title}</p>
                  {entry.notes && (
                    <p className="mt-1 text-xs text-gray-400">{entry.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            How it works
          </h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <p className="text-3xl font-semibold text-emerald-400">
                  {i + 1}
                </p>
                <h3 className="mt-2 font-medium">{step.title}</h3>
                <p className="mt-2 max-w-xs text-sm text-gray-300">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm text-gray-400">
            Your log is private to your account.
          </p>
        </section>

        {/* Templates */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            Tracks for any kind of work
          </h2>
          <p className="mt-3 max-w-md text-gray-300">
            You name your own tracks. Here are some ideas to start from.
          </p>
          <ul className="mt-8 divide-y divide-gray-800 border-y border-gray-800">
            {TRACK_TEMPLATES.map((template) => (
              <li
                key={template.id}
                className="grid gap-3 py-5 md:grid-cols-[220px_1fr] md:items-center"
              >
                <div>
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="mt-1 text-sm text-gray-400">{template.blurb}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {template.tracks.map((track) => (
                    <TrackChip
                      key={track.name}
                      name={track.name}
                      color={track.color}
                    />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Final call to action */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-tight">
            Start your log today.
          </h2>
          <Link
            href="/signup"
            className={`mt-6 inline-block rounded bg-emerald-700 px-5 py-2.5 font-medium text-white hover:bg-emerald-600 ${focusRing}`}
          >
            Create an account
          </Link>
        </section>
      </main>

      <footer className="border-t border-gray-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-gray-400">
          <span>Built by Veek</span>
          <a
            href="https://github.com/VeekAustin"
            className={`hover:text-white ${focusRing}`}
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}