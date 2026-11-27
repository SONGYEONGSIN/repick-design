"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, GitBranch, Route } from "lucide-react";
import { STAGES, PATHS, formatCount, type PeriodId, type StageId } from "./data";
import { cx, FOCUS_RING } from "./ui";

interface CommandPaletteProps {
  open: boolean;
  period: PeriodId;
  onClose: () => void;
  onPinStage: (id: StageId) => void;
  onPinPath: (id: string) => void;
}

export default function CommandPalette({ open, period, onClose, onPinStage, onPinPath }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [wasOpen, setWasOpen] = useState(open);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset the query synchronously during render when `open` flips true,
  // rather than from inside an effect (avoids react-hooks/set-state-in-effect).
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setQuery("");
  }

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  const stageResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STAGES.filter((s) => !q || s.label.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  const pathResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PATHS.filter((p) => !q || p.label.toLowerCase().includes(q)).slice(0, 4);
  }, [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/40 px-4 pt-24"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the return flow"
        className="w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-zinc-100 px-4">
          <Search aria-hidden className="h-4 w-4 shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a stage or a top path…"
            aria-label="Search stages and paths"
            className={cx("h-12 flex-1 rounded bg-transparent text-[13px] text-zinc-900 placeholder:text-zinc-500", FOCUS_RING)}
          />
          <button type="button" onClick={onClose} className={cx("flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900", FOCUS_RING)}>
            <X aria-hidden className="h-4 w-4" />
            <span className="sr-only">Close search</span>
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto py-2">
          {stageResults.length > 0 && (
            <div className="px-2">
              <p className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Stages</p>
              <ul>
                {stageResults.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onPinStage(s.id);
                        onClose();
                      }}
                      className={cx("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-zinc-50", FOCUS_RING)}
                    >
                      <GitBranch aria-hidden className="h-4 w-4 shrink-0 text-amber-600" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] text-zinc-900">{s.label}</span>
                        <span className="block truncate text-[11px] text-zinc-500">{s.description}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {pathResults.length > 0 && (
            <div className="mt-1 px-2">
              <p className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Top paths</p>
              <ul>
                {pathResults.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onPinPath(p.id);
                        onClose();
                      }}
                      className={cx("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-zinc-50", FOCUS_RING)}
                    >
                      <Route aria-hidden className="h-4 w-4 shrink-0 text-amber-600" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] text-zinc-900">{p.label}</span>
                        <span className="block truncate text-[11px] text-zinc-500">{p.stages.length} stages</span>
                      </span>
                      <span className="shrink-0 whitespace-nowrap text-[11px] tabular-nums text-zinc-500">{formatCount(p.volume[period])} cases</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {stageResults.length === 0 && pathResults.length === 0 && <p className="px-4 py-6 text-center text-[13px] text-zinc-500">No matches.</p>}
        </div>
      </div>
    </div>
  );
}
