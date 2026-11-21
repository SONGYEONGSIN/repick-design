"use client";

import { useState } from "react";
import { ArrowDownRight, Flame, Minus, RefreshCw, TrendingUp, TriangleAlert } from "lucide-react";
import { getInstrument, SIGNAL_TYPE_LABEL, SIGNALS, type Signal, type SignalType } from "./data";
import { cx, FOCUS, NUM, TEXT_AUX, TEXT_PRIMARY, TRANSITION } from "./tokens";
import { ChangeBadge, SeverityBadge } from "./ui";

const TYPE_ICON: Record<SignalType, typeof TrendingUp> = {
  spike: TrendingUp,
  threshold: TriangleAlert,
  undercut: ArrowDownRight,
  stabilized: Minus,
  repriced: RefreshCw,
  demand: Flame,
};

const FILTER_OPTIONS: { value: SignalType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "spike", label: "Spike" },
  { value: "threshold", label: "Threshold" },
  { value: "undercut", label: "Undercut" },
  { value: "stabilized", label: "Stabilized" },
  { value: "repriced", label: "Repriced" },
  { value: "demand", label: "Demand" },
];

/**
 * The page's structural spine: a continuous, time-stamped activity stream, not a list of static
 * entities. Clicking a row "pins" its instrument into the detail panel + the risk panel's one
 * reactive KPI (see fluxgate-client.tsx) — that is the only thing a click here does. The filter
 * below is a real client-side predicate over SIGNALS, not decorative.
 */
export function SignalFeed({ pinnedSignalId, onPin }: { pinnedSignalId: string | null; onPin: (signal: Signal) => void }) {
  const [filter, setFilter] = useState<SignalType | "all">("all");
  const filtered = filter === "all" ? SIGNALS : SIGNALS.filter((s) => s.type === filter);

  return (
    <section aria-labelledby="feed-title" className="flex h-full flex-col rounded-2xl border border-white/10 bg-zinc-900/60 shadow-sm shadow-black/20">
      <div className="px-5 pt-5">
        <h2 id="feed-title" className={cx("text-sm font-semibold", TEXT_PRIMARY)}>
          Signal feed
        </h2>
        <p className={cx("mt-0.5 text-xs", TEXT_AUX)}>Live pricing events across every tracked instrument</p>
      </div>

      <div role="group" aria-label="Filter signals by type" className="flex flex-wrap gap-1.5 px-5 pt-3">
        {FILTER_OPTIONS.map((opt) => {
          const active = opt.value === filter;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(opt.value)}
              className={cx(
                "rounded-full border px-2.5 py-1 text-[11.5px] font-medium",
                TRANSITION,
                FOCUS,
                active ? "border-violet-500/40 bg-violet-500/15 text-violet-300" : cx("border-white/10", TEXT_AUX, "hover:text-zinc-200"),
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <ul className="mt-3 flex-1 overflow-y-auto px-2 pb-2" style={{ maxHeight: 640 }}>
        {filtered.length === 0 ? (
          <li className={cx("px-3 py-10 text-center text-sm", TEXT_AUX)}>No signals match this filter.</li>
        ) : (
          filtered.map((signal) => {
            const instrument = getInstrument(signal.instrumentId);
            const Icon = TYPE_ICON[signal.type];
            const isPinned = signal.id === pinnedSignalId;
            return (
              <li key={signal.id}>
                <button
                  type="button"
                  onClick={() => onPin(signal)}
                  aria-current={isPinned ? "true" : undefined}
                  className={cx(
                    "flex w-full flex-col gap-1.5 rounded-xl px-3 py-3 text-left",
                    TRANSITION,
                    FOCUS,
                    isPinned ? "border border-violet-500/30 bg-violet-500/10" : "border border-transparent hover:bg-white/[0.04]",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={cx("flex items-center gap-1.5 text-[11.5px] font-medium", TEXT_AUX, NUM)}>
                      <time>{signal.time}</time>
                      <span aria-hidden="true">&middot;</span>
                      <Icon aria-hidden="true" className="size-3" />
                      {SIGNAL_TYPE_LABEL[signal.type]}
                    </span>
                    <SeverityBadge severity={signal.severity} />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className={cx("truncate text-[13.5px] font-medium", TEXT_PRIMARY)}>{signal.headline}</p>
                    <ChangeBadge value={signal.deltaPct} size="sm" />
                  </div>

                  <p className={cx("line-clamp-2 text-[12.5px] leading-relaxed", TEXT_AUX)}>{signal.detail}</p>

                  {instrument ? (
                    <p className={cx("text-[11.5px]", TEXT_AUX)}>
                      {instrument.name} &middot; {instrument.ticker}
                    </p>
                  ) : null}
                </button>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}
