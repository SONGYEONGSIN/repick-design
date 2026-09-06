"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { useRef, useState } from "react";
import { formatUSD } from "./data";
import { FOCUS, NUM, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx, r2 } from "./tokens";

/**
 * Hand-coded bar chart with a keyboard-reachable crosshair — no chart library, no Math.random.
 * Each bar is a real <button> so Tab (sequential) and ArrowLeft/ArrowRight (roving) both reach
 * every point; the tooltip is driven by whichever index is hovered *or* focused, so keyboard users
 * get the same read-out sighted mouse users do, not just an aria-label.
 */
export default function TrendChart({ labels, values }: { labels: string[]; values: number[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [focusIdx, setFocusIdx] = useState<number | null>(null);
  const barRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIdx = hoverIdx ?? focusIdx;

  const maxAbs = Math.max(...values.map((v) => Math.abs(v)));
  const narrowing = Math.abs(values[values.length - 1]) < Math.abs(values[0]);

  function moveFocus(delta: number) {
    if (focusIdx === null) return;
    const next = Math.max(0, Math.min(values.length - 1, focusIdx + delta));
    barRefs.current[next]?.focus();
  }

  return (
    <div className="w-full min-w-0">
      <div
        role="group"
        aria-label="Net unreconciled value trend"
        className="relative flex h-16 w-full min-w-0 items-end gap-[3px]"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            moveFocus(1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            moveFocus(-1);
          }
        }}
      >
        {activeIdx !== null ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 w-px bg-blue-400/40"
            style={{ left: `${r2(((activeIdx + 0.5) / values.length) * 100)}%` }}
          />
        ) : null}

        {activeIdx !== null ? (
          <div
            role="status"
            className={cx(
              "pointer-events-none absolute -top-9 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-zinc-800 px-2 py-1 text-[11px] font-medium shadow-lg shadow-black/40",
              TEXT_PRIMARY,
            )}
            style={{ left: `${r2(((activeIdx + 0.5) / values.length) * 100)}%` }}
          >
            <span className={TEXT_AUX}>{labels[activeIdx]}</span>{" "}
            <span className={cx(NUM, "text-red-400")}>{formatUSD(values[activeIdx])}</span>
          </div>
        ) : null}

        {values.map((v, i) => {
          const heightPct = Math.max(8, r2((Math.abs(v) / maxAbs) * 100));
          const active = activeIdx === i;
          return (
            <button
              key={labels[i]}
              type="button"
              ref={(el) => {
                barRefs.current[i] = el;
              }}
              aria-label={`${labels[i]}: ${formatUSD(v)} net unreconciled`}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              onFocus={() => setFocusIdx(i)}
              onBlur={() => setFocusIdx(null)}
              className={cx("group relative flex h-full flex-1 items-end rounded-[3px]", FOCUS)}
            >
              <span
                aria-hidden="true"
                className={cx(
                  "block w-full rounded-[3px]",
                  TRANSITION,
                  active ? "bg-blue-400" : "bg-blue-500/40 group-hover:bg-blue-400/70",
                )}
                style={{ height: `${heightPct}%` }}
              />
            </button>
          );
        })}
      </div>
      <div className="mt-1.5 flex items-center justify-between">
        <span className={cx("text-[11px] font-normal", TEXT_AUX)}>{labels[0]}</span>
        <span className={cx("flex items-center gap-1 text-[11px] font-normal", TEXT_AUX)}>
          {narrowing ? (
            <TrendingDown size={11} aria-hidden="true" className="text-green-400" />
          ) : (
            <TrendingUp size={11} aria-hidden="true" className="text-red-400" />
          )}
          {narrowing ? "Shortfall narrowing" : "Shortfall widening"}
        </span>
        <span className={cx("text-[11px] font-normal", TEXT_AUX)}>{labels[labels.length - 1]}</span>
      </div>
      <p className="sr-only">
        {labels.map((l, i) => `${l}: ${formatUSD(values[i])}.`).join(" ")}
      </p>
    </div>
  );
}
