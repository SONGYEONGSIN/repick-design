"use client";

import { useRef } from "react";
import type { Bridge, BridgeRow, DriverId } from "./data";
import { formatCompactUSD, formatSignedUSD, formatUSD } from "./data";
import { BORDER, CHART, FOCUS, SURFACE_INSET, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { DirectionMark, r2, useElementWidth } from "./ui";

/**
 * The page's spine: a generated waterfall. Ten columns — opening balance, eight signed driver
 * contributions, closing balance — with dashed connectors carrying the running total from one bar
 * to the next and a square marker printed at every running-total level.
 *
 * Two deliberate structural choices:
 *
 * 1. The SVG carries only marks (bars, connectors, gridlines). Every piece of TEXT and every
 *    direction ARROW lives in an HTML layer positioned on top, which means the labels are real
 *    text nodes at real font sizes, the arrows are real lucide icons rather than hand-rolled
 *    paths, and each driver column is a real <button> with a real focus outline and a hit target
 *    the full height of the plot. Nothing here is hover-only.
 *
 * 2. The value axis does not start at zero. A month-over-month cloud bridge moves ±$390k on a
 *    $4.2M base; anchored at zero the smallest driver would be a 3px sliver. The axis floor is
 *    stated in the caption and the balance columns are marked as truncated, which is the standard
 *    reading convention for a bridge and is disclosed rather than hidden.
 *
 * Below lg the ten-column geometry stops being legible at any font size, so the whole thing is
 * replaced (not shrunk) by a vertical waterfall — same arithmetic, rows instead of columns.
 */

const AXIS_W = 64;
const PAD_R = 12;
const PAD_TOP = 46;
const PAD_BOTTOM = 78;
const HEIGHT = 462;
const GRID_LINES = 5;

type Column = {
  key: string;
  kind: "balance" | "driver";
  row?: BridgeRow;
  label: [string, string];
  /** Level the running total sits at once this column has been applied. */
  level: number;
  /** Level the running total sat at before this column. */
  from: number;
  value: number;
};

function buildColumns(bridge: Bridge): Column[] {
  const cols: Column[] = [
    {
      key: "opening",
      kind: "balance",
      label: [bridge.basis.openingLabel.split(" ")[0], bridge.basis.openingLabel.split(" ").slice(1).join(" ")],
      level: bridge.opening,
      from: bridge.opening,
      value: bridge.opening,
    },
  ];
  for (const row of bridge.rows) {
    cols.push({
      key: row.id,
      kind: "driver",
      row,
      label: row.chartLabel,
      level: row.runningTotal,
      from: row.runningTotal - row.amount,
      value: row.amount,
    });
  }
  cols.push({
    key: "closing",
    kind: "balance",
    label: [bridge.basis.closingLabel.split(" ")[0], bridge.basis.closingLabel.split(" ").slice(1).join(" ")],
    level: bridge.closing,
    from: bridge.closing,
    value: bridge.closing,
  });
  return cols;
}

export default function WaterfallChart({
  bridge,
  selectedId,
  onSelect,
}: {
  bridge: Bridge;
  selectedId: DriverId | null;
  onSelect: (id: DriverId) => void;
}) {
  const { ref, width } = useElementWidth<HTMLDivElement>(1180);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const columns = buildColumns(bridge);
  const levels = columns.map((c) => c.level);
  const lo = Math.min(...levels);
  const hi = Math.max(...levels);
  const pad = hi - lo || 1;
  const yMin = lo - pad * 0.3;
  const yMax = hi + pad * 0.16;

  const plotLeft = AXIS_W;
  const plotRight = Math.max(plotLeft + 120, width - PAD_R);
  const plotTop = PAD_TOP;
  const plotBottom = HEIGHT - PAD_BOTTOM;
  const plotH = plotBottom - plotTop;
  const colW = (plotRight - plotLeft) / columns.length;
  const barW = Math.min(80, Math.max(14, colW * 0.56));
  const compact = colW < 96;

  const yFor = (v: number) => r2(plotBottom - ((v - yMin) / (yMax - yMin)) * plotH);
  const cxFor = (i: number) => r2(plotLeft + colW * (i + 0.5));

  const gridValues = Array.from({ length: GRID_LINES }, (_, i) => yMin + ((yMax - yMin) * i) / (GRID_LINES - 1));

  const driverIds = bridge.rows.map((r) => r.id);

  function moveFocus(current: DriverId, delta: number) {
    const idx = driverIds.indexOf(current);
    const next = driverIds[Math.min(driverIds.length - 1, Math.max(0, idx + delta))];
    onSelect(next);
    buttonRefs.current[next]?.focus();
  }

  return (
    <div ref={ref} className="relative w-full">
      <svg
        width={width}
        height={HEIGHT}
        viewBox={`0 0 ${width} ${HEIGHT}`}
        className="block h-auto w-full"
        role="img"
        aria-label={`Waterfall bridge from ${bridge.basis.openingLabel} at ${formatUSD(bridge.opening)} through eight signed drivers to ${bridge.basis.closingLabel} at ${formatUSD(bridge.closing)}. The running-total ledger below carries the same figures as text.`}
      >
        {gridValues.map((v) => (
          <g key={v}>
            <line x1={plotLeft} y1={yFor(v)} x2={plotRight} y2={yFor(v)} stroke={CHART.grid} strokeWidth="1" />
            <text x={AXIS_W - 12} y={yFor(v) + 3.5} textAnchor="end" fontSize="10" fill={CHART.label}>
              {formatCompactUSD(v)}
            </text>
          </g>
        ))}

        <line x1={plotLeft} y1={plotBottom} x2={plotRight} y2={plotBottom} stroke={CHART.axis} strokeWidth="1" />

        {/* Running-total connectors — the step line, drawn only across the gaps between bars. */}
        {columns.slice(0, -1).map((col, i) => (
          <line
            key={`c-${col.key}`}
            x1={r2(cxFor(i) + barW / 2)}
            y1={yFor(col.level)}
            x2={r2(cxFor(i + 1) - barW / 2)}
            y2={yFor(col.level)}
            stroke={CHART.connector}
            strokeWidth="1"
            strokeDasharray="4 3"
          />
        ))}

        {/* Bars. */}
        {columns.map((col, i) => {
          const x = r2(cxFor(i) - barW / 2);
          if (col.kind === "balance") {
            const y = yFor(col.level);
            return <rect key={col.key} x={x} y={y} width={r2(barW)} height={r2(Math.max(3, plotBottom - y))} rx="2" fill={CHART.balance} />;
          }
          const yA = yFor(col.from);
          const yB = yFor(col.level);
          const top = r2(Math.min(yA, yB));
          const h = r2(Math.max(3, Math.abs(yA - yB)));
          return <rect key={col.key} x={x} y={top} width={r2(barW)} height={h} rx="2" fill={col.value < 0 ? CHART.decrease : CHART.increase} />;
        })}

        {/* Running-total level markers. */}
        {columns.map((col, i) => (
          <rect
            key={`m-${col.key}`}
            x={r2(cxFor(i) + barW / 2 - 2.5)}
            y={r2(yFor(col.level) - 2.5)}
            width="5"
            height="5"
            fill={CHART.labelStrong}
          />
        ))}
      </svg>

      {/* HTML label + hit layer, aligned to the same column geometry as the SVG above. */}
      <div className="absolute inset-y-0 flex" style={{ left: `${plotLeft}px`, right: `${PAD_R}px` }} aria-hidden={false}>
        {columns.map((col) => {
          const isDriver = col.kind === "driver" && col.row;
          const yA = yFor(col.kind === "balance" ? col.level : col.from);
          const yB = yFor(col.level);
          const labelTop = Math.min(yA, yB) - 34;
          const selected = isDriver && col.row?.id === selectedId;

          const valueText = compact
            ? col.kind === "balance"
              ? formatCompactUSD(col.value)
              : `${col.value < 0 ? "−" : "+"}${formatCompactUSD(Math.abs(col.value))}`
            : col.kind === "balance"
              ? formatUSD(col.value)
              : formatSignedUSD(col.value);

          const inner = (
            <>
              <span className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5" style={{ top: `${r2(labelTop)}px` }}>
                {isDriver ? (
                  <span className={cx("flex items-center gap-0.5 whitespace-nowrap text-[11px] font-semibold", TEXT_PRIMARY)}>
                    <DirectionMark amount={col.value} size={11} />
                    <span className="tabular-nums">{valueText}</span>
                  </span>
                ) : (
                  <span className={cx("whitespace-nowrap text-[11px] font-semibold tabular-nums", TEXT_PRIMARY)}>{valueText}</span>
                )}
                {/* Balance columns already print their level as the headline figure — repeating it
                    compactly underneath would just be the same number twice. */}
                {isDriver ? <span className={cx("whitespace-nowrap text-[10px] font-normal tabular-nums", TEXT_AUX)}>{formatCompactUSD(col.level)}</span> : null}
              </span>

              <span className="pointer-events-none absolute left-1/2 flex w-full -translate-x-1/2 flex-col items-center gap-px px-0.5" style={{ top: `${r2(plotBottom + 12)}px` }}>
                <span className={cx("w-full truncate text-center text-[11px] font-medium leading-tight", isDriver ? TEXT_PRIMARY : TEXT_AUX)}>{col.label[0]}</span>
                <span className={cx("w-full truncate text-center text-[11px] font-normal leading-tight", TEXT_AUX)}>{col.label[1]}</span>
                {isDriver ? <span className={cx("mt-1 text-[10px] font-medium tabular-nums", selected ? "text-lime-300" : TEXT_AUX)}>{col.row!.share.toFixed(1)}%</span> : null}
              </span>
            </>
          );

          if (!isDriver) {
            return (
              <div key={col.key} className="relative min-w-0 flex-1">
                {inner}
              </div>
            );
          }

          const row = col.row!;
          return (
            <div key={col.key} className="relative min-w-0 flex-1">
              <button
                ref={(el) => {
                  buttonRefs.current[row.id] = el;
                }}
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(row.id)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    moveFocus(row.id, 1);
                  } else if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    moveFocus(row.id, -1);
                  }
                }}
                className={cx(
                  "absolute inset-x-0.5 rounded-lg border text-left",
                  TRANSITION,
                  FOCUS,
                  selected ? "border-lime-400/50 bg-lime-400/[0.09]" : "border-transparent hover:border-white/15 hover:bg-white/5",
                )}
                style={{ top: `${r2(plotTop - 40)}px`, bottom: `${r2(PAD_BOTTOM - 66)}px` }}
              >
                <span className="sr-only">
                  {`${row.label}. ${row.amount < 0 ? "Decrease" : "Increase"} of ${formatSignedUSD(row.amount)}. Running total ${formatUSD(row.runningTotal)}. ${row.share.toFixed(1)} percent of gross variance. Use left and right arrow keys to move between drivers.`}
                </span>
              </button>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- mobile: rows, not columns */

export function WaterfallRows({
  bridge,
  selectedId,
  onSelect,
}: {
  bridge: Bridge;
  selectedId: DriverId | null;
  onSelect: (id: DriverId) => void;
}) {
  const columns = buildColumns(bridge);
  const levels = columns.map((c) => c.level);
  const lo = Math.min(...levels);
  const hi = Math.max(...levels);
  const span = (hi - lo) * 1.14 || 1;
  const base = lo - (hi - lo) * 0.07;
  const pos = (v: number) => r2(((v - base) / span) * 100);

  return (
    <ul className="flex flex-col gap-1.5">
      {columns.map((col) => {
        const isDriver = col.kind === "driver" && col.row;
        const a = pos(col.from);
        const b = pos(col.level);
        const left = Math.min(a, b);
        /* Balance rows span the whole track on purpose. The value axis is truncated (it starts
           below the lowest running total, as bridges do), so a proportional balance bar would be
           a meaningless 6% sliver; drawn full width it reads as the frame the contribution bars
           step across, which is what an opening and a closing balance actually are here. */
        const w = col.kind === "balance" ? 100 : Math.max(2, Math.abs(b - a));
        const barLeft = col.kind === "balance" ? 0 : left;
        const selected = isDriver && col.row?.id === selectedId;

        const body = (
          <>
            <span className="flex items-baseline justify-between gap-2">
              <span className={cx("min-w-0 truncate text-sm font-medium", isDriver ? TEXT_PRIMARY : TEXT_AUX)}>
                {isDriver ? col.row!.label : `${col.label[0]} ${col.label[1]}`}
              </span>
              <span className={cx("flex shrink-0 items-center gap-1 text-sm font-semibold tabular-nums", TEXT_PRIMARY)}>
                {isDriver ? <DirectionMark amount={col.value} size={12} /> : null}
                {isDriver ? formatSignedUSD(col.value) : formatUSD(col.value)}
              </span>
            </span>
            <span className={cx("mt-1.5 block h-2.5 w-full overflow-hidden rounded-full", SURFACE_INSET)}>
              <span
                className="block h-full rounded-full"
                style={{
                  marginLeft: `${barLeft}%`,
                  width: `${w}%`,
                  backgroundColor: col.kind === "balance" ? CHART.balance : col.value < 0 ? CHART.decrease : CHART.increase,
                }}
              />
            </span>
            <span className={cx("mt-1.5 flex items-baseline justify-between gap-2 whitespace-nowrap text-[11px] font-normal", TEXT_AUX)}>
              <span className="min-w-0 truncate">{isDriver ? `${col.row!.type} · ${col.row!.share.toFixed(1)}%` : "Balance"}</span>
              <span className="shrink-0 tabular-nums">{`Running ${formatUSD(col.level)}`}</span>
            </span>
          </>
        );

        return (
          <li key={col.key}>
            {isDriver ? (
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(col.row!.id)}
                className={cx("w-full rounded-xl border p-3 text-left", TRANSITION, FOCUS, selected ? "border-lime-400/50 bg-lime-400/[0.09]" : cx(BORDER, "bg-white/[0.02] hover:bg-white/[0.05]"))}
              >
                {body}
              </button>
            ) : (
              <div className={cx("rounded-xl border p-3", BORDER, SURFACE_INSET)}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
