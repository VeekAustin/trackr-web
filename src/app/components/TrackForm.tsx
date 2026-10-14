"use client";

import { useState } from "react";

interface TrackFormProps {
  onSubmit: (name: string, color: string) => void;
  isPending?: boolean;
}

export default function TrackForm({ onSubmit, isPending }: TrackFormProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#4d9de0");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name, color);
    setName("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="New track name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-gray-900 border border-gray-800 rounded px-3 py-1.5 text-sm flex-1"
      />
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-10 h-9 bg-gray-900 border border-gray-800 rounded"
      />
      <button type="submit" disabled={isPending} className="bg-gray-800 px-4 rounded text-sm disabled:opacity-50">
        {isPending ? "Adding..." : "+ Add"}
      </button>
    </form>
  );
}