"use client";

import { useMemo, useState } from "react";
import { changePct, formatPrice, INSTRUMENTS, type InstrumentRow } from "./data";
import { BORDER, DOWN_TEXT, FOCUS, NUM, TEXT_AUX, TEXT_PRIMARY, TRANSITION, UP_TEXT, cx } from "./tokens";
import { r2 } from "./ui";

type Filter = "all" | "gainers" | "losers";

function Sparkline({ row }: { row: InstrumentRow }) {
  const w = 64;
  const h = 22;
  const closes = row.candles.map((c) => c.c);
  const lo = Math.min(...closes);
  const hi = Math.max(...closes);
  const span = hi - lo || 1;
  const pts = closes.map((c, i) => `${r2((i / (closes.length - 1)) * w)},${r2(h - ((c - lo) / span) * h)}`).join(" ");
  const up = changePct(row) >= 0;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true" className="shrink-0">
      <polyline points={pts} fill="none" stroke={up ? "#10b981" : "#f43f5e"} strokeWidth={1.4} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function WatchlistRail({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(() => {
    return INSTRUMENTS.filter((row) => {
      const c = changePct(row);
      if (filter === "gainers") return c >= 0;
      if (filter === "losers") return c < 0;
      return true;
    });
  }, [filter]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 p-3">
        <p className={cx("text-xs font-semibold uppercase tracking-[0.06em]", TEXT_AUX)}>Watchlist</p>
        <div role="group" aria-label="Filter watchlist" className="inline-flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/[0.04] p-0.5">
          {([
            { id: "all", label: "All" },
            { id: "gainers", label: "Up" },
            { id: "losers", label: "Down" },
          ] as { id: Filter; label: string }[]).map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cx("h-7 rounded-md px-2 text-[11px]", TRANSITION, FOCUS, filter === f.id ? "bg-blue-700 font-semibold text-white" : cx("font-medium", TEXT_AUX, "hover:bg-white/[0.06] hover:text-zinc-50"))}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto p-1.5 [scrollbar-width:thin]" aria-label="Instruments">
        {rows.map((row) => {
          const c = changePct(row);
          const up = c >= 0;
          const selected = row.id === selectedId;
          const last = row.candles[row.candles.length - 1].c;
          return (
            <li key={row.id}>
              <button
                type="button"
                onClick={() => onSelect(row.id)}
                aria-pressed={selected}
                className={cx(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left",
                  TRANSITION,
                  FOCUS,
                  selected ? "border border-blue-800/60 bg-blue-950/40" : cx("border border-transparent", "hover:bg-white/[0.05]"),
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className={cx("truncate text-sm font-medium", selected ? "text-blue-300" : TEXT_PRIMARY)}>{row.symbol}</p>
                  <p className={cx("truncate text-[11px] font-normal", NUM, TEXT_AUX)}>{formatPrice(last, row.decimals)}</p>
                </div>
                <Sparkline row={row} />
                <span className={cx("w-14 shrink-0 text-right text-[11px] font-semibold", NUM, up ? UP_TEXT : DOWN_TEXT)}>
                  {up ? "+" : ""}
                  {c.toFixed(2)}%
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className={cx("border-t p-2.5 text-center text-[11px] font-normal", BORDER, TEXT_AUX)}>{`${rows.length} of ${INSTRUMENTS.length} instruments shown`}</div>
    </div>
  );
}
