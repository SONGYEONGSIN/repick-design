"use client";

import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Award, BadgeCheck } from "lucide-react";
import {
  PREFERENCES,
  GRAPH_PRODUCTS,
  EDGE_STRENGTH,
  REASONING,
  type PrefId,
  cx,
  CAPTION,
  NUM,
  FOCUS,
  EASE,
} from "./data";

const GRAPH_HEIGHT = "h-[420px] sm:h-[480px] lg:h-[540px]";

// smooth left-to-right connector between two fixed vertical percentages,
// authored in a 0-100 x 0-100 coordinate space (see viewBox below).
function edgePath(y1: number, y2: number) {
  return `M0,${y1} C50,${y1} 50,${y2} 100,${y2}`;
}

/**
 * Preference → Product Graph — the hero mechanism. Left cluster: five
 * preference-signal nodes (Style, Size, Budget, Condition, Trend) as a
 * roving-tabindex ARIA tablist. Right cluster: four live matched listings,
 * each permanently showing match %, condition grade, verified-seller badge,
 * and before/after discount — never gated behind hover or selection. A
 * fixed-coordinate SVG overlay draws the twenty preference→product wires;
 * edge opacity and stroke-width encode real match strength (EDGE_STRENGTH),
 * not decoration. On mount every wire draws in once via a deterministic,
 * index-driven stagger (no Math.random/Date.now/new Date anywhere) gated
 * behind prefers-reduced-motion. Selecting a preference node (click, Enter,
 * or arrow-key roving focus) re-weights which wires are emphasized and
 * rewrites the evidence panel below with that dimension's real reasoning
 * sentence plus a live per-product strength breakdown — a genuine
 * recomputation of visible proof, not a decorative replay.
 */
export default function PreferenceGraph() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<PrefId>("style");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const activeIndex = PREFERENCES.findIndex((p) => p.id === active);
  const activePref = PREFERENCES[activeIndex];
  const reasoning = REASONING[active];
  const topProduct = GRAPH_PRODUCTS.find((p) => p.id === reasoning.product)!;

  const focusAndActivate = useCallback((id: PrefId) => {
    setActive(id);
    // move roving focus to the newly active tab so keyboard users track
    // selection the same way pointer users do
    requestAnimationFrame(() => tabRefs.current[id]?.focus());
  }, []);

  const handleKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      nextIndex = (index + 1) % PREFERENCES.length;
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      nextIndex = (index - 1 + PREFERENCES.length) % PREFERENCES.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = PREFERENCES.length - 1;
    }
    if (nextIndex !== null) {
      e.preventDefault();
      focusAndActivate(PREFERENCES[nextIndex].id);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className={cx("relative flex w-full", GRAPH_HEIGHT)}>
        {/* left cluster: preference-signal nodes */}
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label="Your preference signals"
          className="relative w-11 shrink-0 sm:w-[160px] lg:w-[190px]"
        >
          {PREFERENCES.map((p, i) => {
            const isActive = p.id === active;
            const Icon = p.icon;
            return (
              <span
                key={p.id}
                className="absolute right-0"
                style={{ top: `${p.y}%` }}
              >
                <button
                  ref={(el) => {
                    tabRefs.current[p.id] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`pref-tab-${p.id}`}
                  aria-selected={isActive}
                  aria-controls="graph-evidence-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(p.id)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className={cx(
                    "flex h-10 w-10 -translate-y-1/2 items-center justify-center gap-2 rounded-full border text-xs font-semibold transition-colors duration-200 sm:h-auto sm:w-auto sm:justify-start sm:px-3.5 sm:py-2.5 sm:text-sm",
                    isActive
                      ? "border-[#6E56CF] bg-[#6E56CF]/20 text-white"
                      : "border-white/15 bg-white/[0.03] text-[#A1A1AA] hover:border-white/30 hover:text-white",
                    FOCUS,
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span className="hidden sm:inline">{p.label}</span>
                  <span className="sr-only sm:hidden">{p.label}</span>
                </button>
                <span
                  aria-hidden
                  className={cx(
                    "pointer-events-none absolute right-[-3px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full transition-colors duration-200",
                    isActive ? "bg-[#6E56CF]" : "bg-white/20",
                  )}
                />
              </span>
            );
          })}
        </div>

        {/* connective tissue: fixed-coordinate SVG wires, strength-encoded */}
        <div className="relative min-w-[36px] flex-1">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            {PREFERENCES.map((p, pi) =>
              GRAPH_PRODUCTS.map((prod, ci) => {
                const strength = EDGE_STRENGTH[p.id][prod.id];
                const isActiveRow = p.id === active;
                const opacity = isActiveRow
                  ? 0.32 + (strength / 100) * 0.68
                  : 0.05 + (strength / 100) * 0.04;
                const width = isActiveRow ? 1 + (strength / 100) * 2.2 : 0.75;
                const delay = reduced ? 0 : pi * 0.11 + ci * 0.035;
                return (
                  <motion.path
                    key={`${p.id}-${prod.id}`}
                    d={edgePath(p.y, prod.y)}
                    fill="none"
                    stroke={isActiveRow ? "#6E56CF" : "#A1A1AA"}
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity, strokeWidth: width }}
                    transition={{
                      pathLength: { duration: 0.7, delay, ease: EASE },
                      opacity: { duration: 0.35, ease: "easeOut" },
                      strokeWidth: { duration: 0.3, ease: "easeOut" },
                    }}
                  />
                );
              }),
            )}
          </svg>
        </div>

        {/* right cluster: live matched listings — fully tagged at rest */}
        <div className="relative w-[168px] shrink-0 sm:w-[230px] lg:w-[300px]">
          {GRAPH_PRODUCTS.map((prod) => {
            const isTop = prod.id === topProduct.id;
            return (
              <div
                key={prod.id}
                className="absolute left-0 w-full -translate-y-1/2"
                style={{ top: `${prod.y}%` }}
              >
                <span
                  aria-hidden
                  className={cx(
                    "pointer-events-none absolute left-[-3px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full transition-colors duration-200",
                    isTop ? "bg-[#6E56CF]" : "bg-white/20",
                  )}
                />
                <div
                  className={cx(
                    "rounded-lg border p-2.5 transition-colors duration-200 sm:p-3",
                    isTop
                      ? "border-[#6E56CF]/60 bg-[#6E56CF]/[0.08]"
                      : "border-white/10 bg-white/[0.02]",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[0.78rem] font-semibold text-white sm:text-sm">
                      {prod.name}
                    </span>
                    <span
                      className={cx(
                        // accent #6E56CF 는 이 다크면에서 3.45:1 로 소형 텍스트 AA 미달이다.
                        // 정본 §Color Tokens 의 용도 제한대로 밝은 틴트를 쓴다(이 작품이
                        // 이미 쓰던 값). Lighthouse 실측 2026-08-14.
                        "shrink-0 text-[0.72rem] font-extrabold text-[#a894f7] sm:text-xs",
                        NUM,
                      )}
                    >
                      {prod.match}%
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1">
                    <span className="inline-flex items-center gap-0.5 rounded border border-white/15 px-1 py-0.5 text-[0.6rem] font-semibold text-white">
                      <Award className="h-2.5 w-2.5 text-[#6E56CF]" aria-hidden />
                      {prod.grade}
                    </span>
                    <span className="inline-flex items-center gap-0.5 rounded border border-white/15 px-1 py-0.5 text-[0.6rem] font-normal text-[#A1A1AA]">
                      <BadgeCheck
                        className="h-2.5 w-2.5 text-[#6E56CF]"
                        aria-hidden
                      />
                      Verified
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span
                      className={cx(
                        "text-[0.72rem] font-extrabold text-white",
                        NUM,
                      )}
                    >
                      ${prod.price}
                    </span>
                    <span
                      className={cx(
                        "text-[0.6rem] font-normal text-[#A1A1AA] line-through",
                        NUM,
                      )}
                    >
                      ${prod.original}
                    </span>
                    <span
                      className={cx(
                        "ml-auto rounded bg-[#6E56CF] px-1 py-0.5 text-[0.58rem] font-semibold text-white",
                        NUM,
                      )}
                    >
                      -{prod.discount}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* evidence panel — recomputes for real when the active signal changes */}
      <div
        id="graph-evidence-panel"
        role="tabpanel"
        aria-labelledby={`pref-tab-${active}`}
        className="rounded-xl border border-white/10 bg-white/[0.02] p-6 sm:p-7"
      >
        <p className={cx(CAPTION, "text-[#A1A1AA]")} aria-live="polite">
          Why {activePref.label.toLowerCase()} points to {topProduct.name}
        </p>
        <p className="mt-3 text-base font-normal leading-[1.6] text-white sm:text-lg">
          {reasoning.text}
        </p>

        <p className={cx(CAPTION, "mt-6 block text-[#A1A1AA]")}>
          Signal strength across all four matches
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {GRAPH_PRODUCTS.map((prod) => {
            const strength = EDGE_STRENGTH[active][prod.id];
            const isTop = prod.id === topProduct.id;
            return (
              <div key={prod.id} className="flex items-center gap-3">
                <span className="w-28 shrink-0 truncate text-xs font-normal text-[#A1A1AA] sm:w-32">
                  {prod.name}
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <span
                    className={cx(
                      "block h-full rounded-full transition-[width] duration-500 ease-out",
                      isTop ? "bg-[#6E56CF]" : "bg-white/30",
                    )}
                    style={{ width: `${strength}%` }}
                  />
                </span>
                <span
                  className={cx(
                    "w-9 shrink-0 text-right text-xs font-semibold text-white",
                    NUM,
                  )}
                >
                  {strength}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
