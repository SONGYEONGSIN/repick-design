"use client";

import { X } from "lucide-react";
import { SERVICES } from "./data";
import { FOCUS_RING } from "./ui";

export default function NewMonitorDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-zinc-900/30" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-monitor-heading"
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-zinc-200 bg-white shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-5 py-4">
          <h2 id="new-monitor-heading" className="font-semibold text-sm text-zinc-900">
            New monitor
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <label className="block" htmlFor="nm-name">
            <span className="font-medium text-xs uppercase tracking-[0.06em] text-zinc-500">Monitor name</span>
            <input
              id="nm-name"
              type="text"
              placeholder="e.g. Refunds API"
              className={`mt-1.5 flex h-10 w-full rounded-md border border-zinc-200 px-3 font-normal text-sm text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING}`}
            />
          </label>

          <label className="mt-4 block" htmlFor="nm-endpoint">
            <span className="font-medium text-xs uppercase tracking-[0.06em] text-zinc-500">Endpoint URL</span>
            <input
              id="nm-endpoint"
              type="text"
              placeholder="https://api.quorum.io/health"
              className={`mt-1.5 flex h-10 w-full rounded-md border border-zinc-200 px-3 font-normal text-sm text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING}`}
            />
          </label>

          <label className="mt-4 block" htmlFor="nm-group">
            <span className="font-medium text-xs uppercase tracking-[0.06em] text-zinc-500">Group with</span>
            <select
              id="nm-group"
              defaultValue={SERVICES[0].id}
              className={`mt-1.5 flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 font-normal text-sm text-zinc-900 ${FOCUS_RING}`}
            >
              {SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-4 block" htmlFor="nm-threshold">
            <span className="font-medium text-xs uppercase tracking-[0.06em] text-zinc-500">p95 alert threshold (ms)</span>
            <input
              id="nm-threshold"
              type="number"
              defaultValue={400}
              min={1}
              className={`mt-1.5 flex h-10 w-full rounded-md border border-zinc-200 px-3 font-normal text-sm tabular-nums text-zinc-900 ${FOCUS_RING}`}
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-zinc-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className={`flex h-10 items-center rounded-md border border-zinc-200 px-3 font-medium text-sm text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`flex h-10 items-center rounded-md bg-violet-600 px-3 font-medium text-sm text-white hover:bg-violet-700 ${FOCUS_RING}`}
          >
            Create monitor
          </button>
        </div>
      </div>
    </div>
  );
}
