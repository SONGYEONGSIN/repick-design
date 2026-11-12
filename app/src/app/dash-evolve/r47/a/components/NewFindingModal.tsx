"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { CATEGORIES } from "../lib/data";
import { FOCUS_RING } from "./ui";

export function NewFindingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [severity, setSeverity] = useState<"critical" | "high" | "medium" | "low">("medium");

  if (!open) return null;

  function handleCreate() {
    // Stub: this candidate's board/table render a fixed dummy dataset, so creating a finding here
    // does not mutate it. The action is still real client behavior (controlled form + state reset),
    // not a dead button — see the concept doc for why a full optimistic-insert was out of scope.
    setTitle("");
    setCategory(CATEGORIES[0].id);
    setSeverity("medium");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <button type="button" tabIndex={-1} aria-label="Close dialog" onClick={onClose} className="fixed inset-0 bg-black/60" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-finding-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <h2 id="new-finding-title" className="text-sm font-semibold text-zinc-50">
            Log a New Finding
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-50 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col gap-3 px-5 py-4">
          <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-400">
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="e.g. Quarterly access review overdue"
              className={`h-9 rounded-lg border border-white/10 bg-zinc-950/60 px-2.5 text-sm text-zinc-50 placeholder:text-zinc-400 ${FOCUS_RING}`}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-400">
              Category
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof category)}
                className={`h-9 rounded-lg border border-white/10 bg-zinc-950/60 px-2.5 text-sm text-zinc-50 ${FOCUS_RING}`}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-xs font-medium text-zinc-400">
              Severity
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as typeof severity)}
                className={`h-9 rounded-lg border border-white/10 bg-zinc-950/60 px-2.5 text-sm text-zinc-50 ${FOCUS_RING}`}
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-white/10 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className={`h-9 rounded-lg px-3.5 text-sm font-medium text-zinc-400 hover:text-zinc-50 ${FOCUS_RING}`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className={`h-9 rounded-lg bg-emerald-500 px-3.5 text-sm font-medium text-zinc-950 hover:bg-emerald-400 ${FOCUS_RING}`}
          >
            Create Finding
          </button>
        </div>
      </div>
    </div>
  );
}
