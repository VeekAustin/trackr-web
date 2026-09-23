"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import ProtectedRoute from "./components/ProtectedRoute";

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
  const { user, token, logout } = useAuth();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTrackName, setNewTrackName] = useState("");
  const [newTrackColor, setNewTrackColor] = useState("#4d9de0");
  const [entryTrack, setEntryTrack] = useState("");
  const [entryTitle, setEntryTitle] = useState("");
  const [entryNotes, setEntryNotes] = useState("");
  const [entryDate, setEntryDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  async function loadData() {
    if (!token) return;
    const [tracksData, entriesData] = await Promise.all([
      apiFetch("/tracks", {}, token),
      apiFetch("/entries", {}, token),
    ]);
    setTracks(tracksData);
    setEntries(entriesData);
    if (tracksData.length > 0 && !entryTrack) {
      setEntryTrack(tracksData[0]._id);
    }
    setLoading(false);
  }
  useEffect(() => {
    loadData();
  }, [token]);
  async function handleAddTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!newTrackName.trim()) return;
    await apiFetch(
      "/tracks",
      {
        method: "POST",
        body: JSON.stringify({ name: newTrackName, color: newTrackColor }),
      },
      token!,
    );
    setNewTrackName("");
    loadData();
  }
  async function handleDeleteTrack(id: string) {
    await apiFetch("/tracks/" + id, { method: "DELETE" }, token!);
    loadData();
  }
  async function handleAddEntry(e: React.FormEvent) {
    e.preventDefault();
    if (!entryTitle.trim() || !entryTrack) return;
    await apiFetch(
      "/entries",
      {
        method: "POST",
        body: JSON.stringify({
          track: entryTrack,
          title: entryTitle,
          notes: entryNotes,
          date: entryDate,
        }),
      },
      token!,
    );
    setEntryTitle("");
    setEntryNotes("");
    loadData();
  }
  async function handleDeleteEntry(id: string) {
    await apiFetch("/entries/" + id, { method: "DELETE" }, token!);
    loadData();
  }
  function trackName(id: string) {
    return tracks.find((t) => t._id === id)?.name || "unknown";
  }
  function trackColor(id: string) {
    return tracks.find((t) => t._id === id)?.color || "#888";
  }
  if (loading) {
    return <div className="text-gray-400 p-8">Loading dashboard...</div>;
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
          {tracks.map((t) => (
            <span
              key={t._id}
              className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
              style={{ backgroundColor: t.color + "22", color: t.color }}
            >
              {t.name}
              <button
                onClick={() => handleDeleteTrack(t._id)}
                className="opacity-60"
              >
                ×
              </button>
            </span>
          ))}
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
          <button type="submit" className="bg-gray-800 px-4 rounded text-sm">
            + Add
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
              disabled={tracks.length === 0}
              className="flex-1 bg-emerald-600 rounded text-sm font-medium disabled:opacity-40"
            >
              + Log entry
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
          {entries.length === 0 && (
            <p className="text-gray-500 text-sm">No entries yet.</p>
          )}
          {entries.map((e) => (
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
                onClick={() => handleDeleteEntry(e._id)}
                className="text-gray-500 hover:text-red-400 text-sm"
              >
                ×
              </button>
            </div>
          ))}
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
