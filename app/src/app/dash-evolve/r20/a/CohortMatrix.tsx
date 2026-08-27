"use client";

import { Pin, PinOff } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { COHORT_ROWS, MAX_OFFSET, columnMargin, formatInt, formatPct, formatPp, type CohortRow } from "./data";
import { BASELINE_BANDS, BORDER, FOCUS, NUM, PANEL_BG, RETENTION_BANDS, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

export type Metric = "pct" | "revenuePct";

type CellInfo = { rowId: string; rowLabel: string; offset: number; value: number | null; diff: number | null };

function bandFor(value: number, diverging: boolean): { fill: string; label: string } {
  const table = diverging ? BASELINE_BANDS : RETENTION_BANDS;
  for (const band of table) if (value < band.max) return band;
  return table[table.length - 1];
}

export default function CohortMatrix({ metric, baselineId, onSetBaseline }: { metric: Metric; baselineId: string | null; onSetBaseline: (id: string | null) => void }) {
  const [active, setActive] = useState<CellInfo | null>(null);

  const baselineRow = baselineId ? COHORT_ROWS.find((r) => r.id === baselineId) ?? null : null;
  const diverging = baselineRow !== null;
  const margin = useMemo(() => columnMargin(metric), [metric]);

  const togglePin = useCallback(
    (id: string) => {
      onSetBaseline(baselineId === id ? null : id);
    },
    [baselineId, onSetBaseline],
  );

  const setHover = useCallback((info: CellInfo | null) => setActive(info), []);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={cx("text-xs font-normal leading-relaxed", TEXT_AUX)}>
          {diverging
            ? `Every cell now reads as percentage points relative to the ${baselineRow!.label} row — the grid's own color scale and axis label rewrote themselves; no other widget on this page reacts to the pin.`
            : "Every cell reads as retention on its own absolute scale. Pin a cohort row (rose pin icon) to switch the whole grid to a relative baseline."}
        </p>
        {baselineRow ? (
          <button
            type="button"
            onClick={() => onSetBaseline(null)}
            className={cx("inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-rose-800/60 bg-rose-950/40 px-2.5 text-xs font-medium text-rose-300", TRANSITION, FOCUS, "hover:bg-rose-950/70")}
          >
            <PinOff size={12} aria-hidden="true" />
            {`Clear ${baselineRow.label} baseline`}
          </button>
        ) : null}
      </div>

      <div className="mt-3 overflow-x-auto rounded-xl border border-white/10 [scrollbar-width:thin]">
        <table className="text-xs" style={{ width: 132 + (MAX_OFFSET + 1) * 44 + 80 }}>
          <caption className="sr-only">
            {diverging ? `Cohort retention matrix, shown as percentage points relative to the ${baselineRow!.label} baseline cohort` : "Cohort retention matrix, shown as percent of starting accounts retained by month"}
          </caption>
          <thead>
            <tr>
              <th scope="col" className={cx("w-[132px] border-b border-r px-2.5 py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em]", BORDER, PANEL_BG, TEXT_AUX)}>
                Cohort
              </th>
              {Array.from({ length: MAX_OFFSET + 1 }, (_, k) => k).map((k) => (
                <th
                  key={k}
                  scope="col"
                  className={cx(
                    "w-11 border-b px-1 py-2 text-center text-[11px] font-medium",
                    BORDER,
                    active && active.offset === k ? "bg-white/[0.08] text-zinc-50" : TEXT_AUX,
                  )}
                >
                  {`M${k}`}
                </th>
              ))}
              <th scope="col" className={cx("w-20 border-b border-l px-2 py-2 text-right text-[11px] font-medium uppercase tracking-[0.06em]", BORDER, TEXT_AUX)}>
                Now
              </th>
            </tr>
          </thead>
          <tbody>
            {COHORT_ROWS.map((row) => {
              const isBaseline = row.id === baselineId;
              return (
                <tr key={row.id} className={active && active.rowId === row.id ? "bg-white/[0.04]" : undefined}>
                  <th
                    scope="row"
                    className={cx(
                      "border-r px-2 py-1.5 text-left",
                      BORDER,
                      isBaseline ? "bg-rose-950/50" : PANEL_BG,
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => togglePin(row.id)}
                      aria-pressed={isBaseline}
                      className={cx(
                        "flex h-8 w-full items-center gap-1.5 rounded-md px-1.5 text-left text-[12px] font-medium",
                        TRANSITION,
                        FOCUS,
                        isBaseline ? "text-rose-300" : cx(TEXT_PRIMARY, "hover:bg-white/[0.06]"),
                      )}
                    >
                      <Pin size={11} aria-hidden="true" className={cx("shrink-0", isBaseline ? "text-rose-400" : "text-zinc-500")} />
                      <span className="truncate">{row.label}</span>
                      <span className="sr-only">{isBaseline ? "— pinned as baseline, activate to unpin" : "— activate to pin as baseline"}</span>
                    </button>
                  </th>
                  {Array.from({ length: MAX_OFFSET + 1 }, (_, k) => k).map((k) => {
                    const hasData = k <= row.elapsed;
                    const value = hasData ? row[metric][k] : null;
                    const baseVal = hasData && baselineRow && k <= baselineRow.elapsed ? baselineRow[metric][k] : null;
                    const diff = value !== null && baseVal !== null ? Math.round((value - baseVal) * 10) / 10 : null;
                    const shown = diverging ? diff : value;
                    const band = shown !== null ? bandFor(shown, diverging) : null;
                    const showCell = hasData && shown !== null && band !== null;
                    return (
                      <td key={k} className="border-b border-white/5 p-0 text-center">
                        {showCell ? (
                          <button
                            type="button"
                            onMouseEnter={() => setHover({ rowId: row.id, rowLabel: row.label, offset: k, value, diff })}
                            onFocus={() => setHover({ rowId: row.id, rowLabel: row.label, offset: k, value, diff })}
                            onMouseLeave={() => setActive((cur) => (cur?.rowId === row.id && cur.offset === k ? null : cur))}
                            onBlur={() => setActive((cur) => (cur?.rowId === row.id && cur.offset === k ? null : cur))}
                            className={cx("flex h-8 w-11 items-center justify-center text-[11px] font-semibold text-white", FOCUS)}
                            style={{ backgroundColor: band.fill }}
                          >
                            <span className={NUM}>{diverging ? formatPp(shown!) : formatPct(shown!)}</span>
                          </button>
                        ) : (
                          <span aria-hidden="true" className={cx("flex h-8 w-11 items-center justify-center", TEXT_AUX)}>
                            {hasData && diverging ? "n/a" : "·"}
                          </span>
                        )}
                      </td>
                    );
                  })}
                  <td className={cx("border-b border-l px-2 py-1.5 text-right", BORDER)}>
                    <span className={cx("block text-[12px] font-semibold", NUM, TEXT_PRIMARY)}>{formatInt(row.active[row.elapsed])}</span>
                    <span className={cx("block text-[10px] font-normal", TEXT_AUX)}>{`of ${formatInt(row.startCount)}`}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className={cx("border-r border-t px-2.5 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.06em]", BORDER, PANEL_BG, TEXT_AUX)}>
                Column avg
              </th>
              {margin.map((m, k) => (
                <td key={k} className={cx("border-t px-1 py-2 text-center", BORDER)}>
                  <span className={cx("text-[11px] font-medium", NUM, TEXT_AUX)}>{m === null ? "·" : formatPct(m)}</span>
                </td>
              ))}
              <td className={cx("border-l border-t", BORDER)} />
            </tr>
          </tfoot>
        </table>
      </div>

      <div aria-live="polite" className={cx("mt-2.5 min-h-[1.5rem] rounded-lg border px-3 py-1.5 text-[12px] font-normal", BORDER, TEXT_AUX)}>
        {active ? (
          <span className={NUM}>
            {`${active.rowLabel} · Month ${active.offset} · `}
            {active.value !== null ? formatPct(active.value) : "no data yet"}
            {diverging && active.diff !== null ? ` · ${formatPp(active.diff)} vs ${baselineRow!.label}` : ""}
          </span>
        ) : (
          "Hover or focus a cell for its exact reading."
        )}
      </div>
    </div>
  );
}

export function metricLabel(metric: Metric): string {
  return metric === "pct" ? "Logo retention" : "Revenue retention";
}

export type { CohortRow };
