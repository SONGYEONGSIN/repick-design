"use client";

import { useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Channel, Period, Scheme } from "./data";
import { HISTORY_DAYS, SERIES, currentValue, dayAgoLabel, periodAvg, round2, windowSeries } from "./data";
import { formatPctSigned } from "./format";
import { FOCUS_RING, TrendBadge, valueTextClass } from "./ui";

// ---------------------------------------------------------------------------
// Horizon-band geometry — the compact strip. Values divide into BAND_COUNT equal
// bands of BAND_PCT percentage points each; each band is drawn as its own set of
// 1-unit-wide bars (one per day), anchored to the zero midline and "folded" so a
// higher band only ever paints where the value actually reaches it. Stacking the
// bands this way — rather than a single bar scaled to the full value — is what
// turns a thin strip into a horizon chart: three bands of increasing color
// intensity cover the same vertical space a single un-banded bar chart would need
// three times the height for.
// ---------------------------------------------------------------------------

const BAND_COUNT = 3;
const BAND_PCT = 15;
const POS_BAND_FILL = ["fill-violet-300", "fill-violet-500", "fill-violet-700"];
const NEG_BAND_FILL_DIVERGING = ["fill-rose-300", "fill-rose-500", "fill-rose-700"];

type BandRect = { key: string; x: number; y: number; width: number; height: number; className: string };

function buildBandRects(values: number[], scheme: Scheme, rowHeightPx: number): BandRect[] {
  const mid = rowHeightPx / 2;
  const bandPx = mid / BAND_COUNT;
  const rects: BandRect[] = [];
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    for (let k = 0; k < BAND_COUNT; k++) {
      const lower = k * BAND_PCT;
      const upper = (k + 1) * BAND_PCT;
      if (v >= 0) {
        const contribution = Math.max(0, Math.min(v, upper) - lower);
        if (contribution <= 0) continue;
        const h = round2((contribution / BAND_PCT) * bandPx);
        rects.push({ key: `${i}-p${k}`, x: i, y: round2(mid - h), width: 1, height: h, className: POS_BAND_FILL[k] });
      } else {
        const av = Math.abs(v);
        const contribution = Math.max(0, Math.min(av, upper) - lower);
        if (contribution <= 0) continue;
        const h = round2((contribution / BAND_PCT) * bandPx);
        const fillClass = scheme === "diverging" ? NEG_BAND_FILL_DIVERGING[k] : POS_BAND_FILL[k];
        rects.push({ key: `${i}-n${k}`, x: i, y: round2(mid), width: 1, height: h, className: fillClass });
      }
    }
  }
  return rects;
}

// ---------------------------------------------------------------------------
// Full-resolution line chart for the expanded panel — a genuine line+area chart,
// deliberately a different rendering (not more horizon bands), so expanding a row
// trades the dense banded overview for the ordinary continuous shape of the same
// numbers. Always the full HISTORY_DAYS window, independent of the period toggle.
// ---------------------------------------------------------------------------

const LINE_VB_W = HISTORY_DAYS - 1;
const LINE_VB_H = 64;
const LINE_MID = LINE_VB_H / 2;
const LINE_SCALE = 28 / 42;

function lineY(v: number): number {
  return round2(LINE_MID - v * LINE_SCALE);
}

function buildLineGeometry(values: number[]) {
  const last = values.length - 1;
  const linePoints = values.map((v, t) => `${t},${lineY(v)}`).join(" ");
  const posPoints = [`0,${LINE_MID}`, ...values.map((v, t) => `${t},${v >= 0 ? lineY(v) : LINE_MID}`), `${last},${LINE_MID}`].join(" ");
  const negPoints = [`0,${LINE_MID}`, ...values.map((v, t) => `${t},${v < 0 ? lineY(v) : LINE_MID}`), `${last},${LINE_MID}`].join(" ");
  return { linePoints, posPoints, negPoints, last };
}

function StatChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-0">
      <p className="truncate font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-400">{label}</p>
      <TrendBadge value={value} className="mt-0.5" />
    </div>
  );
}

export default function HorizonRow({
  channel,
  period,
  scheme,
  isWorstNow,
  isBestNow,
  defaultExpanded,
}: {
  channel: Channel;
  period: Period;
  scheme: Scheme;
  isWorstNow: boolean;
  isBestNow: boolean;
  defaultExpanded: boolean;
}) {
  const periodDays = period === "30d" ? 30 : 90;
  const values = windowSeries(channel.id, periodDays);
  const current = currentValue(channel.id);
  const [expanded, setExpanded] = useState(defaultExpanded);
  // Crosshair cursor: entirely local to THIS row, independent of `expanded` and of
  // every other row's cursor — hovering or keyboard-stepping one row's strip never
  // touches any other component on the page.
  const [cursor, setCursor] = useState<number | null>(null);
  const isFocusedRef = useRef(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const hintId = `horizon-hint-${reactId}`;
  const panelId = `row-panel-${channel.id}`;
  const toggleId = `row-toggle-${channel.id}`;

  const bandHeightPx = 48;
  const rects = buildBandRects(values, scheme, bandHeightPx);

  function moveCursorFromClientX(clientX: number) {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const relX = clientX - rect.left;
    const idx = Math.max(0, Math.min(periodDays - 1, Math.floor((relX / rect.width) * periodDays)));
    setCursor(idx);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setCursor((c) => Math.max(0, (c ?? periodDays - 1) - 1));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setCursor((c) => Math.min(periodDays - 1, (c ?? periodDays - 1) + 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setCursor(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setCursor(periodDays - 1);
    }
  }

  const cursorPct = cursor === null ? 0 : Math.max(6, Math.min(94, ((cursor + 0.5) / periodDays) * 100));
  const lineGeometry = expanded ? buildLineGeometry(SERIES[channel.id]) : null;

  return (
    <div id={`row-${channel.id}`} className="border-b border-white/10 py-3 last:border-b-0">
      <div className="flex items-center gap-3 px-1">
        <button
          id={toggleId}
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((v) => !v)}
          className={`flex min-w-0 flex-1 items-center gap-2 rounded-md py-1 text-left motion-safe:transition-colors ${FOCUS_RING}`}
        >
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-zinc-400 motion-safe:transition-transform motion-safe:duration-150 ${expanded ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold text-sm text-zinc-50">{channel.name}</span>
            <span className="block truncate font-normal text-[11px] text-zinc-400">
              {channel.category}
              {isWorstNow ? " · Steepest decline right now" : isBestNow ? " · Strongest gain right now" : ""}
            </span>
          </span>
        </button>

        <span className="shrink-0 text-right">
          <span className={`block tabular-nums text-xl font-semibold ${valueTextClass(current)}`}>{formatPctSigned(current)}</span>
          <span className="block font-normal text-[11px] text-zinc-400">vs 28-day baseline</span>
        </span>
      </div>

      <div
        ref={wrapRef}
        tabIndex={0}
        aria-label={`${channel.name}, ${periodDays}-day horizon chart. Current value ${formatPctSigned(current)}.`}
        aria-describedby={hintId}
        onMouseMove={(e) => moveCursorFromClientX(e.clientX)}
        onMouseLeave={() => {
          if (!isFocusedRef.current) setCursor(null);
        }}
        onFocus={() => {
          isFocusedRef.current = true;
          setCursor((c) => c ?? periodDays - 1);
        }}
        onBlur={() => {
          isFocusedRef.current = false;
          setCursor(null);
        }}
        onKeyDown={onKeyDown}
        className={`relative mt-2 rounded-md px-1 py-1 ${FOCUS_RING}`}
      >
        <svg viewBox={`0 0 ${periodDays} ${bandHeightPx}`} preserveAspectRatio="none" className="h-12 w-full" aria-hidden="true">
          <line x1={0} x2={periodDays} y1={bandHeightPx / 2} y2={bandHeightPx / 2} className="stroke-white/10" strokeWidth={0.5} />
          {rects.map((r) => (
            <rect key={r.key} x={r.x} y={r.y} width={r.width} height={r.height} className={r.className} />
          ))}
          {cursor !== null ? (
            <line x1={cursor + 0.5} x2={cursor + 0.5} y1={0} y2={bandHeightPx} className="stroke-zinc-50/70" strokeWidth={0.6} />
          ) : null}
        </svg>

        {cursor !== null ? (
          <div
            aria-hidden="true"
            style={{ left: `${cursorPct}%` }}
            className="pointer-events-none absolute -top-1 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-white/10 bg-zinc-800 px-2 py-1 shadow-lg"
          >
            <p className="font-medium text-[11px] text-zinc-50">{dayAgoLabel(cursor, periodDays)}</p>
            <p className="font-normal tabular-nums text-[11px] text-zinc-300">{formatPctSigned(values[cursor])}</p>
          </div>
        ) : null}

        <span id={hintId} className="sr-only">
          Focus this chart, then use the left and right arrow keys to inspect a specific day. The value for that day announces below.
        </span>
        <span aria-live="polite" className="sr-only">
          {cursor !== null ? `${dayAgoLabel(cursor, periodDays)}: ${formatPctSigned(values[cursor])}` : ""}
        </span>
      </div>

      {expanded && lineGeometry ? (
        <div id={panelId} role="region" aria-label={`${channel.name} full-resolution detail`} className="mt-3 rounded-lg border border-white/10 bg-zinc-950 p-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatChip label="Current" value={current} />
            <StatChip label="7-day avg" value={periodAvg(channel.id, 7)} />
            <StatChip label="30-day avg" value={periodAvg(channel.id, 30)} />
            <StatChip label="90-day avg" value={periodAvg(channel.id, 90)} />
          </div>
          <div className="mt-3">
            <svg viewBox={`0 0 ${LINE_VB_W} ${LINE_VB_H}`} preserveAspectRatio="none" className="h-16 w-full" aria-hidden="true">
              <line x1={0} x2={LINE_VB_W} y1={LINE_MID} y2={LINE_MID} className="stroke-white/15" strokeWidth={0.5} strokeDasharray="2 2" />
              <polygon points={lineGeometry.posPoints} className="fill-violet-400/20" />
              <polygon points={lineGeometry.negPoints} className="fill-rose-400/20" />
              <polyline points={lineGeometry.linePoints} className="fill-none stroke-zinc-100" strokeWidth={1} strokeLinejoin="round" />
            </svg>
            <p className="mt-1 font-normal text-[11px] text-zinc-400">
              Full {HISTORY_DAYS}-day history, independent of the period toggle above — oldest day on the left, today on the right.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
