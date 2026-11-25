"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BellRing, X } from "lucide-react";
import { TEAM_ORDER, teamName, usd, type TeamId } from "./data";
import { ACCENT_SOLID, FOCUS, lockBodyScroll, trapTabKey } from "./ui";

/**
 * Mount/unmount pattern, same as `SearchOverlay`: `<Body>` exists only while `open`, so the form
 * is always a fresh, empty slate with no reset-effect needed.
 */
export function NewAlertModal({
  open,
  onClose,
  defaultTeamId,
  defaultThreshold,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  defaultTeamId: TeamId;
  defaultThreshold: number;
  onCreate: (teamId: TeamId, threshold: number) => void;
}) {
  return (
    <AnimatePresence>
      {open && <Body onClose={onClose} defaultTeamId={defaultTeamId} defaultThreshold={defaultThreshold} onCreate={onCreate} />}
    </AnimatePresence>
  );
}

function Body({
  onClose,
  defaultTeamId,
  defaultThreshold,
  onCreate,
}: {
  onClose: () => void;
  defaultTeamId: TeamId;
  defaultThreshold: number;
  onCreate: (teamId: TeamId, threshold: number) => void;
}) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLSelectElement>(null);
  const [teamId, setTeamId] = useState<TeamId>(defaultTeamId);
  const [threshold, setThreshold] = useState<string>(String(defaultThreshold));

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    firstFieldRef.current?.focus();
    const unlock = lockBodyScroll();
    return () => {
      unlock();
      previouslyFocused?.focus?.();
    };
  }, []);

  const numericThreshold = Number(threshold);
  const canSubmit = Number.isFinite(numericThreshold) && numericThreshold > 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onCreate(teamId, Math.round(numericThreshold));
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <motion.button
        type="button"
        aria-label="Close new alert dialog"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.15 }}
        className="fixed inset-0 bg-black/60"
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-modal-heading"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            onClose();
            return;
          }
          trapTabKey(e, panelRef.current);
        }}
        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.97 }}
        transition={{ duration: reduceMotion ? 0 : 0.18 }}
        className="relative w-full max-w-sm min-w-0 rounded-2xl border border-white/10 bg-zinc-900 p-5 shadow-2xl shadow-black/60"
      >
        <div className="flex min-w-0 items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600/15 text-violet-300">
              <BellRing className="h-4 w-4" aria-hidden="true" />
            </span>
            <h2 id="alert-modal-heading" className="min-w-0 truncate text-base font-semibold text-zinc-50">
              New budget alert
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close new alert dialog" className={`${FOCUS} flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-50`}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex min-w-0 flex-col gap-3.5">
          <label className="flex min-w-0 flex-col gap-1.5">
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">Team</span>
            <select
              ref={firstFieldRef}
              value={teamId}
              onChange={(e) => {
                const id = e.target.value as TeamId;
                setTeamId(id);
              }}
              className={`${FOCUS} h-10 w-full min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-normal text-zinc-50`}
            >
              {TEAM_ORDER.map((id) => (
                <option key={id} value={id} className="bg-zinc-900">
                  {teamName(id)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex min-w-0 flex-col gap-1.5">
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">Monthly threshold (USD)</span>
            <input
              type="number"
              min={1}
              step={1000}
              inputMode="numeric"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className={`${FOCUS} h-10 w-full min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-normal tabular-nums text-zinc-50`}
            />
          </label>

          <p className="text-xs font-normal text-zinc-400">
            Spendmesh will notify you when {teamName(teamId)}&rsquo;s monthly spend crosses {canSubmit ? usd(Math.round(numericThreshold)) : "this amount"}.
          </p>

          <div className="mt-1 flex min-w-0 items-center justify-end gap-2">
            <button type="button" onClick={onClose} className={`${FOCUS} flex h-10 shrink-0 items-center whitespace-nowrap rounded-xl px-3.5 text-sm font-medium text-zinc-300 hover:text-zinc-50`}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className={`${FOCUS} flex h-10 shrink-0 items-center whitespace-nowrap rounded-xl px-4 text-sm font-semibold ${
                canSubmit ? ACCENT_SOLID : "cursor-not-allowed border border-dashed border-white/15 bg-white/5 text-zinc-400"
              }`}
            >
              Create alert
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
