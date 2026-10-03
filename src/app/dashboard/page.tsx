"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTracks } from "@/hooks/useTracks";
import { useEntries } from "@/hooks/useEntries";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import ErrorMessage from "../components/ui/ErrorMessage";
import ProtectedRoute from "../components/ProtectedRoute";

interface Track {
  _id: string;
  name: string;
  color: string;
}
interface Entry {
  _id: string;
  track: string;
  title: string;
  notes: string;
  date: string;
}
function DashboardContent() {
  const { user, logout } = useAuth();
  const { tracksQuery, createTrack, deleteTrack } = useTracks();
  const { entriesQuery, createEntry, deleteEntry } = useEntries();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  
  const [newTrackName, setNewTrackName] = useState("");
  const [newTrackColor, setNewTrackColor] = useState("#4d9de0");

  const [entryTrack, setEntryTrack] = useState("");
  const [entryTitle, setEntryTitle] = useState("");
  const [entryNotes, setEntryNotes] = useState("");
  const [entryDate, setEntryDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );

  function handleAddTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!newTrackName.trim()) return;
    createTrack.mutate(
      { name: newTrackName, color: newTrackColor },
      { onSuccess: () => setNewTrackName("") }
    );
  }

  function handleAddEntry(e: React.FormEvent) {
    e.preventDefault();
    const track = entryTrack || tracks[0]?._id;
    if (!entryTitle.trim() || !track) return;
    createEntry.mutate(
      { track, title: entryTitle, notes: entryNotes, date: entryDate },
      { onSuccess: () => { setEntryTitle(""); setEntryNotes(""); } }
    );
  }

  function trackName(id: string) {
    return tracks.find((t) => t._id === id)?.name || "unknown";
  }
  function trackColor(id: string) {
    return tracks.find((t) => t._id === id)?.color || "#888";
  }
  if (tracksQuery.isLoading || entriesQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Spinner label="Loading your dashboard..." />
      </div>
    );
  }
  if (tracksQuery.isError || entriesQuery.isError) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <ErrorMessage
        message="Couldn't load your data. Check your connection and try again."
        onRetry={() => {
          tracksQuery.refetch();
          entriesQuery.refetch();
        }}
      />
    </div>
  );
}
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-semibold">progress.log</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{user?.name}</span>
          <button onClick={logout} className="text-sm text-red-400">
            Log out
          </button>
        </div>
      </div>
      {/* Tracks */}
      <section className="mb-8">
        <h2 className="text-sm uppercase text-gray-500 mb-3">Tracks</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {tracks.length === 0 ? (
            <EmptyState title="No tracks yet" hint="Add your first one below" />
          ) : (
            tracks.map((t) => (
              <span
                key={t._id}
                className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                style={{ backgroundColor: t.color + "22", color: t.color }}
              >
                {t.name}
                <button onClick={() => deleteTrack.mutate(t._id)} className="opacity-60">
                  ×
                </button>
              </span>
            ))
          )}
        </div>
        <form onSubmit={handleAddTrack} className="flex gap-2">
          <input
            type="text"
            placeholder="New track name"
            value={newTrackName}
            onChange={(e) => setNewTrackName(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded px-3 py-1.5 text-sm flex-1"
          />
          <input
            type="color"
            value={newTrackColor}
            onChange={(e) => setNewTrackColor(e.target.value)}
            className="w-10 h-9 bg-gray-900 border border-gray-800 rounded"
          />
          <button
            type="submit"
            disabled={createTrack.isPending}
            className="bg-gray-800 px-4 rounded text-sm disabled:opacity-50"
          >
            {createTrack.isPending ? "Adding..." : "+ Add"}
          </button>
        </form>
      </section>
      {/* New entry */}
      <section className="mb-8 bg-gray-900 border border-gray-800 rounded-lg p-4">
        <h2 className="text-sm uppercase text-gray-500 mb-3">Log an entry</h2>
        <form onSubmit={handleAddEntry} className="space-y-2">
          <select
            value={entryTrack}
            onChange={(e) => setEntryTrack(e.target.value)}
            className="w-full bg-gray-800 rounded px-3 py-2 text-sm"
          >
            {tracks.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="What did you do?"
            value={entryTitle}
            onChange={(e) => setEntryTitle(e.target.value)}
            className="w-full bg-gray-800 rounded px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Notes (optional)"
            value={entryNotes}
            onChange={(e) => setEntryNotes(e.target.value)}
            className="w-full bg-gray-800 rounded px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              className="bg-gray-800 rounded px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={tracks.length === 0 || createEntry.isPending}
              className="flex-1 bg-emerald-600 rounded text-sm font-medium disabled:opacity-40"
            >
              {createEntry.isPending ? "Logging..." : "+ Log entry"}
            </button>
          </div>
          {tracks.length === 0 && (
            <p className="text-xs text-gray-500">
              Add a track first before logging entries.
            </p>
          )}
        </form>
      </section>

      {/* Feed */}
      <section>
        <h2 className="text-sm uppercase text-gray-500 mb-3">Log</h2>
        <div className="space-y-2">
          {entries.length === 0 ? (
            <EmptyState
              title="No entries yet"
              hint="Log your first one above"
            />
          ) : (
            entries.map((e) => (
              <div
                key={e._id}
                className="bg-gray-900 border border-gray-800 rounded-lg p-3 flex justify-between items-start"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs px-2 py-0.5 rounded font-medium"
                      style={{
                        backgroundColor: trackColor(e.track) + "22",
                        color: trackColor(e.track),
                      }}
                    >
                      {trackName(e.track)}
                    </span>
                    <span className="text-xs text-gray-500">{e.date}</span>
                  </div>
                  <p className="text-sm font-medium">{e.title}</p>
                  {e.notes && (
                    <p className="text-xs text-gray-400 mt-1">{e.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => deleteEntry.mutate(e._id)}
                  className="text-gray-500 hover:text-red-400 text-sm"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
