"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <h1 className="text-white text-lg font-semibold mb-2">Dashboard failed to load</h1>
        <p className="text-gray-400 text-sm mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="bg-emerald-600 text-white px-4 py-2 rounded text-sm"
        >
          Reload dashboard
        </button>
      </div>
    </div>
  );
}