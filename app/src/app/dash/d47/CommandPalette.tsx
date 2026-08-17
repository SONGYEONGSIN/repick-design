"use client";

import { FlaskConical, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ExperimentId } from "./data";
import { currentCi, currentLift, EXPERIMENTS, formatLift, QUICK_VIEWS, significanceState } from "./data";
import { BORDER, FOCUS_VISIBLE, FOCUS_WITHIN, HOVER_ACTIVE_BG, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { EyebrowLabel, SignificanceBadge } from "./ui";

export default function CommandPalette({ onClose, onSelectExperiment }: { onClose: () => void; onSelectExperiment: (id: ExperimentId) => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();

  const matchedExperiments = useMemo(() => {
    if (q === "") return EXPERIMENTS;
    return EXPERIMENTS.filter((e) => e.name.toLowerCase().includes(q) || e.owner.toLowerCase().includes(q) || e.metricLabel.toLowerCase().includes(q));
  }, [q]);

  const matchedViews = useMemo(() => (q === "" ? QUICK_VIEWS : QUICK_VIEWS.filter((v) => v.label.toLowerCase().includes(q))), [q]);

  function jumpTo(targetId: string) {
    onClose();
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-24" role="presentation" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Command palette" onClick={(e) => e.stopPropagation()} className={cx("w-full max-w-lg overflow-hidden rounded-2xl border shadow-lg shadow-black/40", BORDER, "bg-zinc-900")}>
        <div className={cx("flex items-center gap-2.5 border-b px-4", BORDER, FOCUS_WITHIN)}>
          <FlaskConical size={16} aria-hidden="true" className={TEXT_CAPTION} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Jump to an experiment or view…"
            aria-label="Search experiments or views"
            className={cx("h-12 flex-1 bg-transparent text-sm outline-none", TEXT_PRIMARY, "placeholder:text-zinc-500")}
          />
          <button type="button" onClick={onClose} aria-label="Close command palette" className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-lg", HOVER_ACTIVE_BG, TRANSITION, FOCUS_VISIBLE)}>
            <X size={15} aria-hidden="true" className={TEXT_CAPTION} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 [scrollbar-width:thin]">
          <div className="mb-1">
            <div className="px-2.5 py-1">
              <EyebrowLabel>Experiments</EyebrowLabel>
            </div>
            {matchedExperiments.length === 0 ? (
              <p className={cx("px-2.5 py-2 text-sm", TEXT_CAPTION)}>No matching experiments.</p>
            ) : (
              matchedExperiments.map((e) => {
                const { ciLow, ciHigh } = currentCi(e);
                const sig = significanceState(ciLow, ciHigh);
                return (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => {
                      onSelectExperiment(e.id);
                      onClose();
                    }}
                    className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_VISIBLE)}
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {e.name}
                      <span className={cx("ml-1.5 text-xs", TEXT_CAPTION)}>{e.metricLabel}</span>
                    </span>
                    <span className="shrink-0 text-xs font-medium tabular-nums">{formatLift(currentLift(e))}</span>
                    <SignificanceBadge state={sig} />
                  </button>
                );
              })
            )}
          </div>

          <div>
            <div className="px-2.5 py-1">
              <EyebrowLabel>Views</EyebrowLabel>
            </div>
            {matchedViews.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => jumpTo(v.targetId)}
                className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_VISIBLE)}
              >
                <v.Icon size={14} aria-hidden="true" className={TEXT_CAPTION} />
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
