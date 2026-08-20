"use client";

/**
 * Backhaul — the recovery funnel. This is the page's dominant visualisation and it fills the main
 * region: six sequential stages, each drawn as a proportional band whose width tapers by exactly
 * the share of units that survive to the next stage, with the loss between every pair drawn as a
 * hatched wedge.
 *
 * Every number is printed as ALWAYS-VISIBLE HTML text — nothing here is hover-only. The SVG is
 * `aria-hidden` and carries no text at all: the geometry stretches with `preserveAspectRatio="none"`
 * (which would scale SVG type unevenly and shrink it to 8px at 1280), while the figures live in a
 * real HTML grid layered over it at 11–20px, tabular and pixel-crisp at every width.
 *
 * Below `xl` the horizontal band would compress each of the six columns under the intrinsic width
 * of its own label, so the same data switches to a vertical stack of proportional bars rather than
 * being squeezed — the r16 lesson that a fixed-column layout can pass an overflow sweep and still
 * be unreadable.
 */

import { ArrowDown } from "lucide-react";
import type { KeyboardEvent } from "react";
import { useRef } from "react";
import type { Stage, StageId } from "./data";
import { fmtInt, fmtPct } from "./data";
import { ACCENT_BRIGHT_HEX, BORDER, EYEBROW, FOCUS, NUM, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";

const VB_W = 1200;
const VB_H = 200;
const BASE = 190;
const MAX_H = 168;
const COL = 200;
const BODY_W = 120;
const PAD = 40;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * The band sits on a common baseline rather than being centred on an axis. A centred funnel splits
 * every loss into two half-height slivers above and below the flow, which at these ratios is a
 * two-pixel sliver; baselining it lets the whole drop peel off upward as one wedge of the full
 * height difference — twice as legible — and gives the six stages a shared floor to read against.
 */
function geometry(stages: Stage[]) {
  return stages.map((s, i) => {
    const h = round2((s.shareOfIntakePct / 100) * MAX_H);
    const x = PAD + i * COL;
    return { x, right: x + BODY_W, h, top: round2(BASE - h), bottom: BASE };
  });
}

function useRoving(stages: Stage[], onSelect: (id: StageId) => void) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const last = stages.length - 1;
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next < 0) return;
    e.preventDefault();
    onSelect(stages[next].id);
    refs.current[next]?.focus();
  }
  return { refs, onKeyDown };
}

/* ------------------------------------------------------- Wide funnel (xl+) */

function WideFunnel({ stages, selectedId, onSelect }: { stages: Stage[]; selectedId: StageId; onSelect: (id: StageId) => void }) {
  const geo = geometry(stages);
  const selectedIndex = stages.findIndex((s) => s.id === selectedId);
  const { refs, onKeyDown } = useRoving(stages, onSelect);

  return (
    <div className="relative hidden xl:block">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[132px] h-[200px]">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" className="h-full w-full">
          <defs>
            <pattern id="bh-loss-hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(38)">
              <rect width="8" height="8" fill="#18181b" />
              <line x1="0" y1="0" x2="0" y2="8" stroke="#8b8b95" strokeWidth="1.8" />
            </pattern>
          </defs>

          {geo.map((g, i) => {
            if (i === geo.length - 1) return null;
            const n = geo[i + 1];
            return (
              <g key={`flow-${stages[i].id}`}>
                <polygon points={`${g.right},${g.top} ${n.x},${n.top} ${n.x},${g.top}`} fill="url(#bh-loss-hatch)" />
                <polygon
                  points={`${g.right},${g.top} ${n.x},${n.top} ${n.x},${g.top}`}
                  fill="none"
                  stroke="#a1a1aa"
                  strokeOpacity="0.55"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                <polygon points={`${g.right},${g.top} ${n.x},${n.top} ${n.x},${BASE} ${g.right},${BASE}`} fill="#4f46e5" fillOpacity="0.32" />
                <line x1={g.right} y1={g.top} x2={n.x} y2={n.top} stroke={ACCENT_BRIGHT_HEX} strokeOpacity="0.8" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              </g>
            );
          })}

          {geo.map((g, i) => {
            const active = i === selectedIndex;
            return (
              <rect
                key={`body-${stages[i].id}`}
                x={g.x}
                y={g.top}
                width={BODY_W}
                height={g.h}
                rx="3"
                fill={ACCENT_BRIGHT_HEX}
                fillOpacity={active ? 1 : 0.62}
              />
            );
          })}

          <line x1="0" y1={BASE} x2={VB_W} y2={BASE} stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <rect x={geo[selectedIndex].x} y={BASE + 4} width={BODY_W} height="3" rx="1.5" fill={ACCENT_BRIGHT_HEX} />
        </svg>
      </div>

      <div role="radiogroup" aria-label="Pipeline stage — select one to drive the inspector below" className="relative grid grid-cols-6">
        {stages.map((s, i) => {
          const active = s.id === selectedId;
          return (
            <button
              key={s.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onClick={() => onSelect(s.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cx(
                "flex h-[336px] flex-col items-center gap-0.5 rounded-2xl border px-2 pt-3 text-center",
                TRANSITION,
                FOCUS,
                active ? "border-indigo-400/50 bg-indigo-400/[0.07]" : "border-transparent hover:bg-white/5",
              )}
            >
              <span className={cx(EYEBROW, active ? "text-indigo-300" : TEXT_CAPTION)}>Stage {i + 1}</span>
              {/* Fixed height, wrapping name: at 1280 a six-column split leaves ~144px per stage and
                  "Inspection & grade" does not fit on one line — truncating the stage's own name is
                  worse than a second line, and the fixed box keeps the figures below in one row. */}
              <span className={cx("mt-0.5 flex h-9 items-center text-center text-[13px] font-semibold leading-tight 2xl:text-sm", TEXT_PRIMARY)}>{s.name}</span>
              <span className={cx("mt-1.5 text-[20px] font-semibold leading-none", NUM, TEXT_PRIMARY)}>{fmtInt(s.entered)}</span>
              <span className={cx("mt-1 text-[11px] font-normal", TEXT_CAPTION)}>units entered</span>
              <span
                className={cx(
                  "mt-1.5 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
                  active ? "border-indigo-400/40 bg-indigo-400/10 text-indigo-200" : cx(BORDER, TEXT_SECONDARY),
                )}
              >
                {s.dropped === 0 ? "Terminal stage" : `${fmtPct(s.passRatePct)} pass`}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative mt-2 h-12">
        {stages.slice(0, -1).map((s, i) => (
          <div
            key={`loss-${s.id}`}
            style={{ left: `${round2(((i + 1) * COL) / (VB_W / 100))}%` }}
            className="absolute top-0 flex w-36 -translate-x-1/2 flex-col items-center"
          >
            <span className={cx("flex items-center gap-1 text-xs font-semibold whitespace-nowrap", NUM, "text-zinc-200")}>
              <ArrowDown size={12} aria-hidden="true" className="shrink-0 text-zinc-400" />−{fmtInt(s.dropped)}
            </span>
            <span className={cx("mt-0.5 text-[11px] font-normal whitespace-nowrap", TEXT_CAPTION)}>{fmtPct(s.dropRatePct)} drop-off</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------------------- Stacked funnel (below xl) */

function StackedFunnel({ stages, selectedId, onSelect }: { stages: Stage[]; selectedId: StageId; onSelect: (id: StageId) => void }) {
  const { refs, onKeyDown } = useRoving(stages, onSelect);

  return (
    <div role="radiogroup" aria-label="Pipeline stage — select one to drive the inspector below" className="flex flex-col gap-1 xl:hidden">
      {stages.map((s, i) => {
        const active = s.id === selectedId;
        return (
          <div key={s.id}>
            <button
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onClick={() => onSelect(s.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cx(
                "flex w-full flex-col rounded-xl border px-3 py-2.5 text-left",
                TRANSITION,
                FOCUS,
                active ? "border-indigo-400/50 bg-indigo-400/[0.07]" : cx(BORDER, "hover:bg-white/5"),
              )}
            >
              <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className={cx(EYEBROW, active ? "text-indigo-300" : TEXT_CAPTION)}>Stage {i + 1}</span>
                <span className={cx("text-sm font-semibold", TEXT_PRIMARY)}>{s.name}</span>
                <span className={cx("ml-auto text-base font-semibold", NUM, TEXT_PRIMARY)}>{fmtInt(s.entered)}</span>
              </span>
              <span aria-hidden="true" className={cx("mt-2 h-2.5 w-full overflow-hidden rounded-full border", BORDER, "bg-zinc-950/60")}>
                <span
                  className={cx("block h-full rounded-full", active ? "bg-indigo-400" : "bg-indigo-600/70")}
                  style={{ width: `${s.shareOfIntakePct}%` }}
                />
              </span>
              <span className={cx("mt-1.5 text-[11px] font-normal", TEXT_CAPTION)}>
                {fmtPct(s.shareOfIntakePct)} of intake · {s.dropped === 0 ? "terminal stage" : `${fmtPct(s.passRatePct)} pass to next`}
              </span>
            </button>

            {s.dropped === 0 ? null : (
              <div className={cx("flex items-center gap-1.5 py-1 pl-4 text-[11px] font-medium", TEXT_CAPTION)}>
                <ArrowDown size={12} aria-hidden="true" className="shrink-0" />
                <span className={cx("font-semibold", NUM, "text-zinc-200")}>−{fmtInt(s.dropped)}</span>
                <span className="font-normal">dropped here · {fmtPct(s.dropRatePct)}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function FunnelFlow({ stages, selectedId, onSelect }: { stages: Stage[]; selectedId: StageId; onSelect: (id: StageId) => void }) {
  return (
    <>
      <WideFunnel stages={stages} selectedId={selectedId} onSelect={onSelect} />
      <StackedFunnel stages={stages} selectedId={selectedId} onSelect={onSelect} />
    </>
  );
}
