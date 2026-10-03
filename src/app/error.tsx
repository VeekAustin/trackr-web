"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="text-center max-w-sm">
        <h1 className="text-white text-lg font-semibold mb-2">Something went wrong</h1>
        <p className="text-gray-400 text-sm mb-4">{error.message || "An unexpected error occurred."}</p>
        <button
          onClick={reset}
          className="bg-emerald-600 text-white px-4 py-2 rounded text-sm"
        >
          Try again
        </button>
      </div>
    </div>
  );
}