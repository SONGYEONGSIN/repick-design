"use client";

import { useMemo, useState } from "react";
import { OPEN_TICKETS } from "./data";
import { BORDER, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, cx } from "./tokens";

export type Period = "today" | "7d" | "30d";
const WINDOW_HOURS: Record<Period, number> = { today: 24, "7d": 168, "30d": 720 };

const PRIORITIES = ["P1", "P2", "P3", "P4"] as const;
const BUCKETS = [
  { id: "b0", label: "0–1h", test: (h: number) => h <= 1 },
  { id: "b1", label: "1–4h", test: (h: number) => h > 1 && h <= 4 },
  { id: "b2", label: "4–24h", test: (h: number) => h > 4 && h <= 24 },
  { id: "b3", label: "24h+", test: (h: number) => h > 24 },
];

// Fill intensity by count share — always paired with dark zinc-900 text, never color alone
// (page-brief-core "색만으로 전달 금지"), and every cell prints its exact count as standing text
// regardless of hover state (charts.catalog Heatmap fallback: "hover 수치 오버레이" as a *floor*,
// not a substitute for always-visible values).
function fillClass(count: number, max: number): string {
  if (count === 0) return "bg-zinc-50";
  const share = count / Math.max(1, max);
  if (share > 0.66) return "bg-cyan-300";
  if (share > 0.33) return "bg-cyan-200";
  return "bg-cyan-100";
}

export default function SlaHeatGrid({ period }: { period: Period }) {
  const [active, setActive] = useState<{ priority: string; bucket: string; count: number; pct: number } | null>(null);

  const { cells, max, total } = useMemo(() => {
    const windowHours = WINDOW_HOURS[period];
    const inWindow = OPEN_TICKETS.filter((t) => t.ageHours <= windowHours);
    const grid: Record<string, Record<string, number>> = {};
    for (const p of PRIORITIES) {
      grid[p] = {};
      for (const b of BUCKETS) grid[p][b.id] = 0;
    }
    for (const t of inWindow) {
      const bucket = BUCKETS.find((b) => b.test(t.ageHours));
      if (bucket) grid[t.priority][bucket.id] += 1;
    }
    let m = 0;
    for (const p of PRIORITIES) for (const b of BUCKETS) m = Math.max(m, grid[p][b.id]);
    return { cells: grid, max: m, total: inWindow.length };
  }, [period]);

  return (
    <div>
      <table className="w-full border-separate border-spacing-1">
        <caption className="sr-only">Open tickets by priority and age, current window</caption>
        <thead>
          <tr>
            <th scope="col" className="sr-only font-medium">
              Priority
            </th>
            {BUCKETS.map((b) => (
              <th key={b.id} scope="col" className={cx("pb-1 text-center text-[10px] font-medium", TEXT_AUX)}>
                {b.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PRIORITIES.map((p) => (
            <tr key={p}>
              <th scope="row" className={cx("w-8 pr-1 text-left text-[11px] font-semibold", TEXT_PRIMARY)}>
                {p}
              </th>
              {BUCKETS.map((b) => {
                const count = cells[p][b.id];
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <td key={b.id} className="p-0 text-center">
                    <button
                      type="button"
                      onMouseEnter={() => setActive({ priority: p, bucket: b.label, count, pct })}
                      onFocus={() => setActive({ priority: p, bucket: b.label, count, pct })}
                      onMouseLeave={() => setActive(null)}
                      onBlur={() => setActive(null)}
                      className={cx(
                        "grid h-11 w-full place-items-center rounded-lg border text-[13px] font-semibold tabular-nums text-zinc-900",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700",
                        BORDER,
                        fillClass(count, max),
                      )}
                      aria-label={`Priority ${p}, ${b.label}: ${count} open ticket${count === 1 ? "" : "s"}, ${pct}% of the window`}
                    >
                      {count}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div aria-live="polite" className={cx("mt-2 min-h-[2.25rem] rounded-lg border px-2.5 py-1.5 text-[11px] font-normal", BORDER, TEXT_MUTED, "bg-zinc-50")}>
        {active ? `${active.priority} · ${active.bucket}: ${active.count} open ticket${active.count === 1 ? "" : "s"} (${active.pct}% of ${total} in this window)` : `Hover or focus a cell for its exact count — ${total} open tickets in this window.`}
      </div>
    </div>
  );
}
