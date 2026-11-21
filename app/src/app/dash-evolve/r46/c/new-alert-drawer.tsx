"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { AlertDirection } from "./data";
import { CHANNELS } from "./data";
import { FOCUS_RING } from "./ui";

export default function NewAlertDrawer({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (channelId: string, thresholdPct: number, direction: AlertDirection) => void;
}) {
  const [channelId, setChannelId] = useState(CHANNELS[0].id);
  const [threshold, setThreshold] = useState(10);
  const [direction, setDirection] = useState<AlertDirection>("below");
  const firstFieldRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (open) firstFieldRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function submit() {
    onCreate(channelId, threshold, direction);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-zinc-950/70" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Create a revenue alert"
        className="relative flex h-full w-full max-w-sm flex-col bg-zinc-900 motion-safe:animate-[rise_200ms_ease-out]"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <p className="font-semibold text-sm text-zinc-50">New alert</p>
          <button type="button" aria-label="Close" onClick={onClose} className={`flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 ${FOCUS_RING}`}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <p className="font-normal text-sm text-zinc-400">
            Get notified in the panel above when a channel&apos;s deviation from its 28-day baseline crosses a threshold you set.
          </p>

          <label className="mt-4 block">
            <span className="font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-400">Channel</span>
            <select
              ref={firstFieldRef}
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              className={`mt-1.5 h-11 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 font-normal text-sm text-zinc-50 ${FOCUS_RING}`}
            >
              {CHANNELS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-4 block">
            <span className="font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-400">Direction</span>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value as AlertDirection)}
              className={`mt-1.5 h-11 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 font-normal text-sm text-zinc-50 ${FOCUS_RING}`}
            >
              <option value="below">Falls below</option>
              <option value="above">Rises above</option>
            </select>
          </label>

          <label className="mt-4 block">
            <span className="font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-400">Threshold (% deviation)</span>
            <input
              type="number"
              min={1}
              max={40}
              step={1}
              value={threshold}
              onChange={(e) => setThreshold(Math.max(1, Math.min(40, Number(e.target.value) || 1)))}
              className={`mt-1.5 h-11 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 font-normal tabular-nums text-sm text-zinc-50 ${FOCUS_RING}`}
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-white/10 px-4 py-3">
          <button type="button" onClick={onClose} className={`flex h-10 items-center rounded-lg px-3.5 font-medium text-sm text-zinc-300 hover:bg-white/5 ${FOCUS_RING}`}>
            Cancel
          </button>
          <button type="button" onClick={submit} className={`flex h-10 items-center rounded-lg bg-violet-600 px-3.5 font-medium text-sm text-zinc-50 hover:bg-violet-700 ${FOCUS_RING}`}>
            Create alert
          </button>
        </div>
      </div>
    </div>
  );
}
