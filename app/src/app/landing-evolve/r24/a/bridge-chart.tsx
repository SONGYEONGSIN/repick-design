"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { ReactNode } from "react";
import { DOMAIN, LIST_PRICE, money, moneySigned, type BridgeStep } from "./data";

// Accent hex is inlined as a Tailwind arbitrary value (not interpolated from a JS constant) so
// Tailwind's static class scanner can see it — see candidates/a.md for the contrast math behind
// #0369A1 (sky-700 family, chosen over violet per this round's diversity brief).
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369A1]";

// One fixed pixel height for every bar track — used both as the track's own inline `height` and
// as the scale's output range, so a bar's inline `top`/`height` can never drift out of the track.
const CHART_HEIGHT = 140;

// DOMAIN comes from data.ts, which enumerates all 2^6 factor combinations once at module load —
// this padding just adds headroom above/below that real min/max so no bar ever touches the edge.
const PAD = Math.round((DOMAIN.max - DOMAIN.min) * 0.14);
const SCALE_MIN = DOMAIN.min - PAD;
const SCALE_MAX = DOMAIN.max + PAD;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Dollar value -> pixels from the top of a CHART_HEIGHT-tall track. Pure, deterministic. */
function scaleY(value: number): number {
  const frac = (value - SCALE_MIN) / (SCALE_MAX - SCALE_MIN);
  return round2(CHART_HEIGHT - frac * CHART_HEIGHT);
}

type Column =
  | { kind: "start"; key: string; value: number }
  | { kind: "end"; key: string; value: number }
  | { kind: "step"; key: string; step: BridgeStep };

/** A short dashed tick repeated inside every column's own track, at the list-price height — reads
 *  as one continuous reference line across the row without any cross-column absolute positioning. */
function Baseline() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 border-t border-dashed border-slate-300"
      style={{ top: scaleY(LIST_PRICE) }}
    />
  );
}

function BarColumn({ column, reduce }: { column: Column; reduce: boolean }) {
  let top: number;
  let height: number;
  let fillClass: string;
  let valueLabel: string;
  let caption: ReactNode;

  if (column.kind === "start") {
    top = scaleY(column.value);
    height = CHART_HEIGHT - top;
    fillClass = "bg-slate-900";
    valueLabel = money(column.value);
    caption = <span className="font-semibold text-slate-950">List price</span>;
  } else if (column.kind === "end") {
    top = scaleY(column.value);
    height = CHART_HEIGHT - top;
    fillClass = "bg-[#0369A1]";
    valueLabel = money(column.value);
    caption = <span className="font-semibold text-[#0369A1]">Your price</span>;
  } else {
    const { step } = column;
    const yFrom = scaleY(step.from);
    const yTo = scaleY(step.to);
    top = Math.min(yFrom, yTo);
    height = Math.max(3, Math.abs(yFrom - yTo));
    const isDown = step.delta < 0;
    fillClass = isDown ? "bg-slate-600" : "bg-slate-100 border border-slate-400";
    valueLabel = money(step.to);
    caption = (
      <>
        <span className="flex items-center justify-center gap-1 font-semibold tabular-nums text-slate-950">
          {isDown ? (
            <ArrowDown className="h-3 w-3 shrink-0 text-slate-500" aria-hidden="true" />
          ) : (
            <ArrowUp className="h-3 w-3 shrink-0 text-slate-500" aria-hidden="true" />
          )}
          {moneySigned(step.delta)}
        </span>
        <span className="mt-0.5 line-clamp-2 text-slate-600">{step.label}</span>
      </>
    );
  }

  return (
    <motion.div
      layout
      initial={reduce ? false : { opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
      transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex w-[80px] shrink-0 flex-col items-center sm:w-[92px]"
    >
      <div className="h-5 text-[13px] font-semibold tabular-nums text-slate-950" style={{ fontFamily: "var(--font-mono)" }}>
        {valueLabel}
      </div>
      <div className="relative mt-1 w-full" style={{ height: CHART_HEIGHT }}>
        <Baseline />
        <motion.div layout className={`absolute inset-x-1 rounded-md ${fillClass}`} style={{ top, height }} />
      </div>
      <div className="mt-2 flex min-h-[34px] flex-col items-center text-center text-[10.5px] leading-[1.4]">
        {caption}
      </div>
    </motion.div>
  );
}

export default function BridgeChart({ steps, finalPrice }: { steps: BridgeStep[]; finalPrice: number }) {
  const reduce = !!useReducedMotion();

  const columns: Column[] = [
    { kind: "start", key: "start", value: LIST_PRICE },
    ...steps.map((step) => ({ kind: "step" as const, key: step.id, step })),
    { kind: "end", key: "end", value: finalPrice },
  ];

  return (
    <div
      tabIndex={0}
      role="group"
      aria-label={`Price bridge chart. List price ${money(LIST_PRICE)}, ${steps.length} active adjustment${
        steps.length === 1 ? "" : "s"
      }, your price ${money(finalPrice)}.`}
      className={`overflow-x-auto rounded-xl ${FOCUS}`}
    >
      <div className="flex items-start gap-2 py-1 sm:gap-3">
        <AnimatePresence initial={false} mode="popLayout">
          {columns.map((column) => (
            <BarColumn key={column.key} column={column} reduce={reduce} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
