"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, ChevronsUpDown, Circle, ShieldAlert } from "lucide-react";

import {
  BASE_MAX,
  BASE_MIN,
  C_MAX,
  C_MIN,
  CAPTION,
  DEFAULT_BASE,
  DEFAULT_TOP,
  EYEBROW,
  FOCUS,
  GRID_CONDITIONS,
  GRID_PRICES,
  HERO,
  LISTINGS,
  MIN_GAP,
  NUM,
  PAD,
  PAGE_STEP,
  PRESETS,
  STAT_LABEL,
  STEP,
  TOP_MAX,
  TOP_MIN,
  byCost,
  byMatch,
  clamp,
  cx,
  gradeFor,
  judge,
  mean,
  median,
  money,
  priceFromYPct,
  snap,
  tradeoffSentence,
  xPct,
  yPct,
  type Judged,
} from "./data";

type HandleId = "base" | "top";

/* ------------------------------------------------------------------ threshold handle */

type HandleProps = {
  id: HandleId;
  label: string;
  value: number;
  min: number;
  max: number;
  left: number;
  top: number;
  dragging: boolean;
  onStart: (id: HandleId) => void;
  onMove: (id: HandleId, clientY: number) => void;
  onEnd: () => void;
  onSet: (id: HandleId, value: number) => void;
};

/**
 * A draggable end of the threshold line. Plain HTML positioned in percent over the plot rather than
 * an SVG node, so its hit area (~56x30px) and its label stay the same physical size at 390px as at
 * 1920px — an SVG child would shrink with the viewBox and fall under the 24x24 pointer-target floor.
 */
function LineHandle({
  id,
  label,
  value,
  min,
  max,
  left,
  top,
  dragging,
  onStart,
  onMove,
  onEnd,
  onSet,
}: HandleProps) {
  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-orientation="vertical"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${money(value)} ceiling`}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        onStart(id);
      }}
      onPointerMove={(event) => {
        if (dragging) onMove(id, event.clientY);
      }}
      onPointerUp={onEnd}
      onPointerCancel={onEnd}
      onKeyDown={(event) => {
        const key = event.key;
        if (key === "ArrowUp" || key === "ArrowRight") onSet(id, value + STEP);
        else if (key === "ArrowDown" || key === "ArrowLeft") onSet(id, value - STEP);
        else if (key === "PageUp") onSet(id, value + PAGE_STEP);
        else if (key === "PageDown") onSet(id, value - PAGE_STEP);
        else if (key === "Home") onSet(id, min);
        else if (key === "End") onSet(id, max);
        else return;
        event.preventDefault();
      }}
      style={{ left: `${left}%`, top: `${top}%`, touchAction: "none" }}
      className={cx(
        "absolute z-30 flex -translate-x-1/2 -translate-y-1/2 select-none items-center gap-1 rounded-full border-2 border-lime-700 bg-white px-2.5 py-1.5 text-[0.6875rem] font-semibold text-lime-800",
        dragging ? "cursor-grabbing" : "cursor-grab",
        NUM,
        FOCUS,
      )}
    >
      <ChevronsUpDown aria-hidden="true" className="size-3 text-lime-700" />
      {money(value)}
    </div>
  );
}

/* ------------------------------------------------------------------ hero */

export default function ThresholdHero() {
  const reduced = useReducedMotion();
  const fieldRef = useRef<HTMLDivElement>(null);

  const [base, setBase] = useState(DEFAULT_BASE);
  const [top, setTop] = useState(DEFAULT_TOP);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [dragging, setDragging] = useState<HandleId | null>(null);

  const baseMax = Math.min(BASE_MAX, top - MIN_GAP);
  const topMin = Math.max(TOP_MIN, base + MIN_GAP);

  const setHandle = useCallback(
    (id: HandleId, raw: number) => {
      if (id === "base") setBase(clamp(snap(raw), BASE_MIN, Math.min(BASE_MAX, top - MIN_GAP)));
      else setTop(clamp(snap(raw), Math.max(TOP_MIN, base + MIN_GAP), TOP_MAX));
    },
    [base, top],
  );

  const dragTo = useCallback(
    (id: HandleId, clientY: number) => {
      const el = fieldRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.height === 0) return;
      setHandle(id, priceFromYPct(((clientY - rect.top) / rect.height) * 100));
    },
    [setHandle],
  );

  const judged = useMemo(() => judge(base, top, verifiedOnly), [base, top, verifiedOnly]);
  const kept = useMemo(() => judged.filter((l) => l.clears).sort(byMatch), [judged]);
  const cutList = useMemo(() => judged.filter((l) => !l.clears).sort(byCost), [judged]);

  const shortlist = kept.slice(0, 4);
  const ledger = cutList.slice(0, 3);
  const summary = tradeoffSentence(kept, cutList);

  const medianPrice = median(kept.map((l) => l.price));
  const avgCondition = Math.round(mean(kept.map((l) => l.condition)));
  const avgDiscount = Math.round(mean(kept.map((l) => l.discount)));
  const keptGrade = gradeFor(avgCondition).grade;

  /** At rest the field explains itself: the closest miss carries a label even before anyone drags. */
  const labelledId = hovered ?? cutList[0]?.id ?? null;
  const labelled: Judged | undefined = judged.find((l) => l.id === labelledId);

  const yBase = yPct(base);
  const yTop = yPct(top);
  const xLeft = PAD.left;
  const xRight = 100 - PAD.right;
  const activePreset = PRESETS.find((p) => p.base === base && p.top === top);

  const fade = reduced ? false : { opacity: 0, y: 14 };

  return (
    <section className="border-b border-zinc-200 bg-white">
      <div className="mx-auto w-full max-w-[1180px] px-4 pb-12 pt-6 sm:px-6 lg:px-10 lg:pb-16 lg:pt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* ---------------------------------------------------------- argument column */}
          <motion.div
            initial={fade}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.45, ease: "easeOut" }}
            className="lg:col-span-5"
          >
            <p className={cx(EYEBROW, "text-lime-800")}>{HERO.eyebrow}</p>
            <h1
              style={{ fontFamily: "var(--font-display-wide)" }}
              className="mt-3 text-[clamp(2.5rem,5.6vw,4rem)] font-extrabold leading-[0.94] tracking-[-0.02em] text-zinc-950"
            >
              {HERO.headline[0]}
              <span className="block text-lime-800">{HERO.headline[1]}</span>
            </h1>
            <p className="mt-4 max-w-[32rem] text-[0.9375rem] leading-[1.6] text-zinc-600">
              {HERO.sub}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href="#shortlist"
                className={cx(
                  "inline-flex items-center gap-1.5 rounded-full bg-lime-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-lime-800",
                  FOCUS,
                )}
              >
                {HERO.primary}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </a>
              <a
                href="#how"
                className={cx(
                  "rounded-full px-2 py-1 text-sm font-semibold text-zinc-900 underline decoration-lime-700 decoration-2 underline-offset-4",
                  FOCUS,
                )}
              >
                {HERO.secondary}
              </a>
            </div>

            {/* --------------------------------------------------- controls */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <div role="group" aria-label="Line presets" className="flex flex-wrap gap-1.5">
                {PRESETS.map((preset) => {
                  const on = activePreset?.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        setBase(preset.base);
                        setTop(preset.top);
                      }}
                      className={cx(
                        "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-150",
                        on
                          ? "border-lime-700 bg-lime-700 text-white"
                          : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400",
                        FOCUS,
                      )}
                    >
                      {preset.label}
                      <span className="sr-only">
                        {on ? ", selected preset" : ", set line to this preset"}
                      </span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                aria-pressed={verifiedOnly}
                onClick={() => setVerifiedOnly((v) => !v)}
                className={cx(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-150",
                  verifiedOnly
                    ? "border-lime-700 bg-lime-700 text-white"
                    : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400",
                  FOCUS,
                )}
              >
                <BadgeCheck
                  aria-hidden="true"
                  className={cx("size-3.5", verifiedOnly ? "text-white" : "text-lime-700")}
                />
                Verified sellers only
                <span className="sr-only">{verifiedOnly ? ", on" : ", off"}</span>
              </button>
            </div>

            <p className="mt-4 text-sm leading-[1.6] text-zinc-600">
              Your line pays up to{" "}
              <span className={cx("font-semibold text-lime-800", NUM)}>{money(base)}</span> for a
              condition score of {C_MIN}, rising to{" "}
              <span className={cx("font-semibold text-lime-800", NUM)}>{money(top)}</span> at{" "}
              {C_MAX}.
            </p>

            {/* --------------------------------------------------- readout */}
            <div className="mt-5 flex items-end gap-3 border-t border-zinc-200 pt-5">
              <span
                style={{ fontFamily: "var(--font-display-wide)" }}
                className={cx(
                  "text-[3.25rem] font-extrabold leading-[0.85] tracking-[-0.02em] text-lime-800",
                  NUM,
                )}
              >
                {kept.length}
              </span>
              <span className="pb-1 text-sm leading-[1.35] text-zinc-600">
                of {LISTINGS.length} listings
                <span className="block font-semibold text-zinc-900">clear your line</span>
              </span>
            </div>

            <dl className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5">
                <dt className={cx(STAT_LABEL, "text-zinc-600")}>Median</dt>
                <dd className={cx("mt-1 text-lg font-semibold text-zinc-950", NUM)}>
                  {money(medianPrice)}
                </dd>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5">
                <dt className={cx(STAT_LABEL, "text-zinc-600")}>Grade</dt>
                <dd className={cx("mt-1 text-lg font-semibold text-zinc-950", NUM)}>
                  {keptGrade} <span className="text-sm text-zinc-600">/ {avgCondition}</span>
                </dd>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5">
                <dt className={cx(STAT_LABEL, "text-zinc-600")}>Saving</dt>
                <dd className={cx("mt-1 text-lg font-semibold text-zinc-950", NUM)}>
                  {avgDiscount}%
                </dd>
              </div>
            </dl>
          </motion.div>

          {/* ---------------------------------------------------------- the field */}
          <motion.div
            initial={fade}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.08, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <figure className="rounded-2xl border border-zinc-200 bg-white p-3 sm:p-4">
              <figcaption className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className={cx(CAPTION, "text-zinc-600")}>
                  Fig. 01 — Asking price against condition score
                </span>
                <span className="text-xs text-zinc-600">
                  Drag either end of the line, or use the arrow keys
                </span>
              </figcaption>

              <div
                ref={fieldRef}
                className="relative aspect-[5/4] w-full sm:aspect-[16/9] lg:aspect-[2/1]"
              >
                {/* painted layer — clipped, so the wash never bleeds past the rounded corner.
                    Handles and dots sit outside it so their focus outlines are never cut off. */}
                <div className="absolute inset-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    focusable="false"
                    role="presentation"
                    className="h-full w-full"
                  >
                    <rect
                      x={xLeft}
                      y={PAD.top}
                      width={xRight - xLeft}
                      height={100 - PAD.bottom - PAD.top}
                      fill="#FFFFFF"
                    />
                    {GRID_PRICES.map((p) => (
                      <line
                        key={`p${p}`}
                        x1={xLeft}
                        x2={xRight}
                        y1={yPct(p)}
                        y2={yPct(p)}
                        stroke="#E4E4E7"
                        strokeWidth={1}
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}
                    {GRID_CONDITIONS.map((c) => (
                      <line
                        key={`c${c}`}
                        x1={xPct(c)}
                        x2={xPct(c)}
                        y1={PAD.top}
                        y2={100 - PAD.bottom}
                        stroke="#E4E4E7"
                        strokeWidth={1}
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}
                    {/* the keep zone — everything under your ceiling */}
                    <polygon
                      points={`${xLeft},${yBase} ${xRight},${yTop} ${xRight},${100 - PAD.bottom} ${xLeft},${100 - PAD.bottom}`}
                      fill="#ECFCCB"
                      fillOpacity="0.85"
                    />
                    <line
                      x1={xLeft}
                      x2={xRight}
                      y1={yBase}
                      y2={yTop}
                      stroke="#4D7C0F"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                    <line
                      x1={xLeft}
                      x2={xRight}
                      y1={100 - PAD.bottom}
                      y2={100 - PAD.bottom}
                      stroke="#D4D4D8"
                      strokeWidth={1}
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>

                {/* axis labels — HTML, so type size is fixed rather than scaled by the viewBox */}
                <span className="pointer-events-none absolute left-[1%] top-[1%] text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-zinc-600">
                  Price
                </span>
                {GRID_PRICES.map((p) => (
                  <span
                    key={`pl${p}`}
                    style={{ top: `${yPct(p)}%` }}
                    className={cx(
                      "pointer-events-none absolute left-[1%] -translate-y-1/2 text-[0.625rem] font-semibold text-zinc-600",
                      NUM,
                    )}
                  >
                    {money(p)}
                  </span>
                ))}
                {GRID_CONDITIONS.map((c) => (
                  <span
                    key={`cl${c}`}
                    style={{ left: `${xPct(c)}%` }}
                    className={cx(
                      "pointer-events-none absolute bottom-[1%] -translate-x-1/2 text-[0.625rem] font-semibold text-zinc-600",
                      NUM,
                    )}
                  >
                    {c}
                  </span>
                ))}
                <span className="pointer-events-none absolute bottom-[1%] right-[1%] text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-zinc-600">
                  Condition
                </span>

                {/* the listings — decorative marks; every value they carry is also in the lists
                    below, so nothing here is the sole source of anything. */}
                <div aria-hidden="true" className="absolute inset-0">
                  {judged.map((l) => {
                    const isLabelled = labelledId === l.id;
                    return (
                      <span
                        key={l.id}
                        style={{
                          left: `${xPct(l.condition)}%`,
                          top: `${yPct(l.price)}%`,
                          transform: `translate(-50%, -50%) scale(${isLabelled ? 1.55 : 1})`,
                        }}
                        className={cx(
                          "absolute block size-3 rounded-full transition-[background-color,border-color,opacity,transform] duration-200 motion-reduce:transition-none sm:size-3.5",
                          l.clears
                            ? "border border-lime-700 bg-lime-700 opacity-100"
                            : "border-2 border-zinc-500 bg-white opacity-70",
                          isLabelled && "z-10 border-lime-800",
                        )}
                      />
                    );
                  })}
                </div>

                {/* label for whichever listing is under inspection, and at rest for the closest
                    miss — the field states its own argument before anyone touches it */}
                {labelled ? (
                  <span
                    aria-hidden="true"
                    style={{
                      left: `${xPct(labelled.condition)}%`,
                      top: `${yPct(labelled.price)}%`,
                      transform: `translate(${
                        xPct(labelled.condition) > 66 ? "-88%" : xPct(labelled.condition) < 30 ? "-12%" : "-50%"
                      }, -175%)`,
                    }}
                    className="pointer-events-none absolute z-20 hidden whitespace-nowrap rounded-md border border-zinc-300 bg-white px-2 py-1 text-[0.6875rem] font-semibold text-zinc-900 sm:block"
                  >
                    {labelled.name}
                    <span className={cx("ml-1.5 text-zinc-600", NUM)}>
                      {money(labelled.price)} ·{" "}
                      {labelled.clears
                        ? `${money(labelled.headroom)} under`
                        : labelled.cutReason === "over"
                          ? `${money(labelled.over)} over`
                          : "unverified"}
                    </span>
                  </span>
                ) : null}

                <LineHandle
                  id="base"
                  label={`Ceiling for a condition score of ${C_MIN}`}
                  value={base}
                  min={BASE_MIN}
                  max={baseMax}
                  left={xLeft}
                  top={yBase}
                  dragging={dragging === "base"}
                  onStart={setDragging}
                  onMove={dragTo}
                  onEnd={() => setDragging(null)}
                  onSet={setHandle}
                />
                <LineHandle
                  id="top"
                  label={`Ceiling for a condition score of ${C_MAX}`}
                  value={top}
                  min={topMin}
                  max={TOP_MAX}
                  left={xRight}
                  top={yTop}
                  dragging={dragging === "top"}
                  onStart={setDragging}
                  onMove={dragTo}
                  onEnd={() => setDragging(null)}
                  onSet={setHandle}
                />
              </div>

              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="inline-block size-2.5 rounded-full bg-lime-700"
                  />
                  Under your line
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="inline-block size-2.5 rounded-full border-2 border-zinc-500 bg-white"
                  />
                  Above it, and still on the field
                </span>
              </p>
            </figure>

            {/* --------------------------------------------------- sacrifice ledger */}
            <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 sm:p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className={cx(CAPTION, "text-zinc-900")}>What your line is cutting</h2>
                <span className={cx("text-xs font-semibold text-zinc-600", NUM)}>
                  {cutList.length} of {LISTINGS.length}
                </span>
              </div>

              {ledger.length === 0 ? (
                <p className="mt-3 rounded-lg border border-dashed border-zinc-300 bg-white px-3 py-4 text-sm text-zinc-600">
                  Nothing is above your line. Pull either end down to see what a stricter rule would
                  cost you.
                </p>
              ) : (
                <ul className="mt-3 flex flex-col gap-2">
                  {ledger.map((l) => (
                    <li key={l.id}>
                      <button
                        type="button"
                        onMouseEnter={() => setHovered(l.id)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setHovered(l.id)}
                        onBlur={() => setHovered(null)}
                        className={cx(
                          "flex w-full items-center justify-between gap-3 rounded-lg border bg-white px-3 py-2 text-left transition-colors duration-150",
                          hovered === l.id
                            ? "border-lime-700 bg-lime-50"
                            : "border-zinc-200 hover:border-zinc-300",
                          FOCUS,
                        )}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <Circle aria-hidden="true" className="size-3 shrink-0 text-zinc-500" />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-zinc-950">
                              {l.name}
                            </span>
                            <span className={cx("block text-xs text-zinc-600", NUM)}>
                              {l.match}% match · Grade {l.grade} · {money(l.price)}
                            </span>
                          </span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className={cx("block text-sm font-semibold text-zinc-950", NUM)}>
                            {l.cutReason === "over" ? `${money(l.over)} over` : "Unverified"}
                          </span>
                          <span className={cx("block text-[0.6875rem] text-zinc-600", NUM)}>
                            ceiling {money(l.ceiling)}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {cutList.length > ledger.length ? (
                <p className={cx("mt-2 text-xs text-zinc-600", NUM)}>
                  and {cutList.length - ledger.length} more above your line, still plotted, still
                  costed
                </p>
              ) : null}
            </div>
          </motion.div>
        </div>

        {/* ------------------------------------------------------------ shortlist */}
        <div id="shortlist" className="mt-10 scroll-mt-24 lg:mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-zinc-950">
              Your shortlist
            </h2>
            <p className="text-sm text-zinc-600">
              The four strongest matches under your line right now, recomputed every time it moves
            </p>
          </div>

          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {shortlist.map((l, index) => {
              const headroomPct = clamp(Math.round((l.headroom / l.ceiling) * 100), 3, 100);
              return (
                <li key={l.id}>
                  <article
                    onMouseEnter={() => setHovered(l.id)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(l.id)}
                    onBlur={() => setHovered(null)}
                    className={cx(
                      "flex h-full min-w-0 flex-col rounded-2xl border bg-white p-4 transition-colors duration-150",
                      hovered === l.id ? "border-lime-700" : "border-zinc-200 hover:border-zinc-300",
                    )}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        aria-hidden="true"
                        style={{ fontFamily: "var(--font-display-wide)" }}
                        className={cx(
                          "text-base font-extrabold leading-none tracking-[0.12em] text-zinc-500",
                          NUM,
                        )}
                      >
                        {`0${index + 1}`}
                      </span>
                      <span
                        className={cx(
                          "rounded-full bg-lime-100 px-2 py-0.5 text-[0.6875rem] font-semibold text-lime-800",
                          NUM,
                        )}
                      >
                        {l.match}% match
                      </span>
                    </div>

                    <h3 className="mt-2 text-base font-semibold leading-snug tracking-[-0.01em] text-zinc-950">
                      {l.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-zinc-600">
                      {l.brand} · {l.reason}
                    </p>

                    <dl className="mt-3 flex flex-col gap-2 border-t border-zinc-200 pt-3 text-xs">
                      <div className="flex items-baseline justify-between gap-2">
                        <dt className={cx(STAT_LABEL, "text-zinc-600")}>Condition</dt>
                        <dd className={cx("font-semibold text-zinc-950", NUM)}>
                          Grade {l.grade} · {l.condition}/100
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-2">
                        <dt className={cx(STAT_LABEL, "text-zinc-600")}>Seller</dt>
                        <dd className="flex items-center gap-1 font-semibold text-zinc-950">
                          {l.verified ? (
                            <BadgeCheck aria-hidden="true" className="size-3.5 text-lime-700" />
                          ) : (
                            <ShieldAlert aria-hidden="true" className="size-3.5 text-zinc-500" />
                          )}
                          <span className={NUM}>
                            {l.verified ? "Verified" : "Unverified"} · {l.trades} trades
                          </span>
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-2">
                        <dt className={cx(STAT_LABEL, "text-zinc-600")}>Price</dt>
                        <dd className="flex items-baseline gap-1.5">
                          <span
                            style={{ fontFamily: "var(--font-display-wide)" }}
                            className={cx(
                              "text-lg font-extrabold tracking-[-0.02em] text-zinc-950",
                              NUM,
                            )}
                          >
                            {money(l.price)}
                          </span>
                          <span className={cx("text-zinc-600 line-through", NUM)}>
                            <span className="sr-only">retail </span>
                            {money(l.retail)}
                          </span>
                          <span className={cx("font-semibold text-lime-800", NUM)}>
                            {l.discount}% off
                          </span>
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-2">
                        <dt className={cx(STAT_LABEL, "text-zinc-600")}>Your line</dt>
                        <dd className={cx("font-semibold text-lime-800", NUM)}>
                          {money(l.headroom)} under
                        </dd>
                      </div>
                    </dl>

                    <div
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200"
                    >
                      <div
                        style={{ width: `${headroomPct}%` }}
                        className="h-full rounded-full bg-lime-700 transition-[width] duration-200 motion-reduce:transition-none"
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        className={cx(
                          "inline-flex items-center gap-1 rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-900 transition-colors duration-150 hover:border-zinc-900",
                          FOCUS,
                        )}
                      >
                        Open listing
                        <span className="sr-only">for {l.name}</span>
                        <ArrowUpRight aria-hidden="true" className="size-3.5" />
                      </button>
                      <span className={cx("text-[0.6875rem] text-zinc-600", NUM)}>
                        ceiling {money(l.ceiling)}
                      </span>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>

          <p className="mt-3 max-w-[32rem] text-sm leading-[1.6] text-zinc-600">{summary}</p>
          <p aria-live="polite" className="sr-only">
            {kept.length} of {LISTINGS.length} listings clear your line. {summary}
          </p>
        </div>
      </div>
    </section>
  );
}
