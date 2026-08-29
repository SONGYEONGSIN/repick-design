"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import {
  Radar as RadarIcon,
  Tag,
  BadgeCheck,
  ShieldCheck,
  Truck,
  Fingerprint,
  ArrowRight,
  ArrowUpRight,
  Camera,
  Armchair,
  Watch,
  Shirt,
  Footprints,
  Backpack,
  Disc3,
  ShoppingBag,
  Percent,
  Star,
  Users,
  Clock3,
  TrendingUp,
  Quote,
} from "lucide-react";

/**
 * Tailwind v4's `ring-*` + `ring-offset-*` combination paints as fully transparent — the class
 * matches and `:focus-visible` fires, but nothing is drawn (confirmed against a real render, not
 * just source). `outline` utilities still paint normally in v4, so every focusable control in this
 * file uses this string instead of `ring`.
 */
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300";

/* ---------------------------------------------------------------------------------------------
 * Radar geometry — five axes, deterministic trig, every coordinate rounded to 2 decimals so the
 * server-rendered markup and the client's first paint are byte-identical (no hydration mismatch).
 * ------------------------------------------------------------------------------------------- */

const AXIS_KEYS = ["price", "condition", "trust", "speed", "authenticity"] as const;
type AxisKey = (typeof AXIS_KEYS)[number];
type Weights = Record<AxisKey, number>;

const AXES: { key: AxisKey; label: string; short: string; icon: typeof Tag }[] = [
  { key: "price", label: "Price fit", short: "Price", icon: Tag },
  { key: "condition", label: "Condition", short: "Condition", icon: BadgeCheck },
  { key: "trust", label: "Seller trust", short: "Trust", icon: ShieldCheck },
  { key: "speed", label: "Ship speed", short: "Speed", icon: Truck },
  { key: "authenticity", label: "Authenticity", short: "Auth.", icon: Fingerprint },
];

const CX = 120;
const CY = 120;
const MAX_R = 92;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function axisAngle(i: number): number {
  return -Math.PI / 2 + i * ((2 * Math.PI) / AXIS_KEYS.length);
}

/** A pentagon at a fixed radius fraction — used for the three static grid rings. */
function ringPath(fraction: number): string {
  return AXIS_KEYS.map((_, i) => {
    const a = axisAngle(i);
    const r = MAX_R * fraction;
    const x = round2(CX + r * Math.cos(a));
    const y = round2(CY + r * Math.sin(a));
    return `${x},${y}`;
  }).join(" ");
}

/** The live weight polygon — one vertex per axis, radius proportional to that axis's weight. */
function weightPath(weights: Weights): string {
  return AXIS_KEYS.map((key, i) => {
    const a = axisAngle(i);
    const r = (Math.max(0, Math.min(100, weights[key])) / 100) * MAX_R;
    const x = round2(CX + r * Math.cos(a));
    const y = round2(CY + r * Math.sin(a));
    return `${x},${y}`;
  }).join(" ");
}

function axisLabelPos(i: number) {
  const a = axisAngle(i);
  const r = MAX_R + 26;
  return { x: round2(CX + r * Math.cos(a)), y: round2(CY + r * Math.sin(a)) };
}

const RING_FRACTIONS = [0.25, 0.5, 0.75, 1];

/* ---------------------------------------------------------------------------------------------
 * Listings — deterministic per-axis scores (0–100). Match% is a live, weighted average, never a
 * hardcoded number: computeMatch reduces over AXIS_KEYS every render, so a copy edit to the score
 * table changes the percentage automatically instead of drifting out of sync.
 * ------------------------------------------------------------------------------------------- */

type Listing = {
  id: string;
  name: string;
  category: string;
  icon: typeof Camera;
  grade: string;
  priceBefore: number;
  priceAfter: number;
  scores: Weights;
};

const RANKED_LISTINGS: Listing[] = [
  {
    id: "leica-m6",
    name: "Leica M6 Rangefinder, Chrome",
    category: "Camera",
    icon: Camera,
    grade: "A−",
    priceBefore: 2400,
    priceAfter: 1970,
    scores: { price: 55, condition: 96, trust: 93, speed: 68, authenticity: 99 },
  },
  {
    id: "aeron-b",
    name: "Herman Miller Aeron, Size B",
    category: "Office chair",
    icon: Armchair,
    grade: "B+",
    priceBefore: 950,
    priceAfter: 720,
    scores: { price: 84, condition: 82, trust: 88, speed: 74, authenticity: 90 },
  },
  {
    id: "cartier-tank",
    name: "Cartier Tank Must, Steel",
    category: "Watch",
    icon: Watch,
    grade: "A",
    priceBefore: 3200,
    priceAfter: 2810,
    scores: { price: 46, condition: 91, trust: 96, speed: 52, authenticity: 97 },
  },
  {
    id: "retro-x",
    name: "Patagonia Retro-X Fleece, M",
    category: "Outerwear",
    icon: Shirt,
    grade: "B",
    priceBefore: 180,
    priceAfter: 128,
    scores: { price: 92, condition: 78, trust: 81, speed: 90, authenticity: 84 },
  },
];

const PREVIEW_LISTINGS: {
  name: string;
  category: string;
  icon: typeof Footprints;
  grade: string;
  match: number;
  priceBefore: number;
  priceAfter: number;
}[] = [
  { name: "Nike Air Max 1 '87, US 10", category: "Sneakers", icon: Footprints, grade: "A−", match: 91, priceBefore: 210, priceAfter: 149 },
  { name: "Patagonia Black Hole 32L", category: "Backpack", icon: Backpack, grade: "B+", match: 88, priceBefore: 140, priceAfter: 99 },
  { name: "Technics SL-1200MK2", category: "Turntable", icon: Disc3, grade: "A", match: 94, priceBefore: 900, priceAfter: 715 },
  { name: "Coach Willow Tote 24", category: "Handbag", icon: ShoppingBag, grade: "B", match: 85, priceBefore: 395, priceAfter: 262 },
];

function pctOff(before: number, after: number): number {
  return Math.round(((before - after) / before) * 100);
}

function computeMatch(weights: Weights, scores: Weights): number {
  let num = 0;
  let den = 0;
  for (const key of AXIS_KEYS) {
    num += weights[key] * scores[key];
    den += weights[key];
  }
  if (den === 0) return 0;
  return Math.round(num / den);
}

function topDriver(weights: Weights, scores: Weights): string {
  let best: AxisKey = AXIS_KEYS[0];
  let bestVal = -1;
  for (const key of AXIS_KEYS) {
    const v = weights[key] * scores[key];
    if (v > bestVal) {
      bestVal = v;
      best = key;
    }
  }
  return AXES.find((a) => a.key === best)!.short;
}

/* ---------------------------------------------------------------------------------------------
 * Weight presets — five fixed vectors. "Recommended" is the page's default state, so the radar
 * shows a meaningful, non-tied shape and ranking before any slider is ever touched.
 * ------------------------------------------------------------------------------------------- */

const PRESETS: { id: string; label: string; weights: Weights }[] = [
  { id: "recommended", label: "Recommended", weights: { price: 55, condition: 85, trust: 90, speed: 40, authenticity: 70 } },
  { id: "trust", label: "Trust first", weights: { price: 30, condition: 70, trust: 100, speed: 30, authenticity: 90 } },
  { id: "price", label: "Best price", weights: { price: 100, condition: 50, trust: 50, speed: 40, authenticity: 40 } },
  { id: "speed", label: "Fast ship", weights: { price: 50, condition: 40, trust: 40, speed: 100, authenticity: 30 } },
  { id: "balanced", label: "Balanced", weights: { price: 60, condition: 60, trust: 60, speed: 60, authenticity: 60 } },
];

const DEFAULT_WEIGHTS: Weights = PRESETS[0].weights;

function weightsEqual(a: Weights, b: Weights): boolean {
  return AXIS_KEYS.every((k) => a[k] === b[k]);
}

/* ---------------------------------------------------------------------------------------------
 * Shared motion variants
 * ------------------------------------------------------------------------------------------- */

const VIEWPORT = { once: true, margin: "-80px" } as const;

export default function RadarClient() {
  const prefersReducedMotion = useReducedMotion();
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);

  const ranked = useMemo(
    () =>
      RANKED_LISTINGS.map((l) => ({ ...l, match: computeMatch(weights, l.scores), driver: topDriver(weights, l.scores) })).sort(
        (a, b) => b.match - a.match || a.name.localeCompare(b.name)
      ),
    [weights]
  );
  const topPick = ranked[0];
  const activePreset = PRESETS.find((p) => weightsEqual(p.weights, weights));
  const polygon = useMemo(() => weightPath(weights), [weights]);

  function setAxis(key: AxisKey, value: number) {
    setWeights((w) => ({ ...w, [key]: value }));
  }

  const fadeUp: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: prefersReducedMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] } },
  };
  const stagger = (s = 0.08): Variants => ({
    hidden: {},
    show: { transition: { staggerChildren: prefersReducedMotion ? 0 : s, delayChildren: prefersReducedMotion ? 0 : 0.05 } },
  });

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">
      {/* -------------------------------------------------------------------------------- header -- */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0b0f]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <a href="#top" className={`flex items-center gap-2 rounded-sm ${focusRing}`}>
            <span aria-hidden className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-700 text-white">
              <RadarIcon className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="text-sm font-bold tracking-[-0.01em]">repick</span>
          </a>
          <a
            href="#cta"
            className={`rounded-full px-4 py-2 text-xs font-medium text-zinc-300 transition hover:text-white ${focusRing}`}
          >
            Get matched
          </a>
        </div>
      </header>

      {/* ---------------------------------------------------------------------------------- hero -- */}
      <section id="top" className="mx-auto max-w-7xl px-6 pb-20 pt-14 sm:pt-20">
        <div className="grid gap-12 xl:grid-cols-12 xl:gap-8">
          {/* left: headline + copy + CTA + live summary */}
          <motion.div
            initial={prefersReducedMotion ? undefined : "hidden"}
            whileInView="show"
            viewport={VIEWPORT}
            variants={stagger(0.1)}
            className="xl:col-span-5"
          >
            <motion.p
              variants={fadeUp}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-teal-300"
            >
              <RadarIcon className="h-3.5 w-3.5" aria-hidden />
              Weighted match radar
            </motion.p>
            <motion.h1
              variants={fadeUp}
              style={{ fontFamily: "var(--font-display-mono)" }}
              className="text-[clamp(2.25rem,1.5rem_+_3.2vw,4.5rem)] font-bold leading-[1.03] tracking-[-0.02em]"
            >
              Tell it what
              <br />
              matters. <span className="text-teal-400">Watch it rank.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 max-w-[440px] text-base leading-[1.6] text-zinc-400">
              Five sliders, one shape. Drag your priorities and every verified listing
              re-scores against them in real time — no keyword search, no guessing which
              filter matters most.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#cta"
                className={`inline-flex items-center gap-2 rounded-full bg-teal-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-800 active:scale-[0.97] ${focusRing}`}
              >
                Build your radar
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <span className="text-xs text-zinc-400">No account needed to preview matches</span>
            </motion.div>
            <motion.div
              variants={fadeUp}
              aria-live="polite"
              className="mt-8 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
            >
              <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-400/15 text-teal-300">
                <topPick.icon className="h-4.5 w-4.5" />
              </span>
              <p className="text-sm leading-snug text-zinc-300">
                Top pick right now: <span className="font-bold text-white">{topPick.name}</span> at{" "}
                <span className="font-bold text-teal-300">{topPick.match}%</span> match
              </p>
            </motion.div>
          </motion.div>

          {/* right: radar + presets + sliders */}
          <motion.div
            initial={prefersReducedMotion ? undefined : "hidden"}
            whileInView="show"
            viewport={VIEWPORT}
            variants={fadeUp}
            className="xl:col-span-7"
          >
            <h2 className="sr-only">Weight your priorities</h2>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Weight presets">
                {PRESETS.map((preset) => {
                  const isActive = activePreset?.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setWeights(preset.weights)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${focusRing} ${
                        isActive
                          ? "border-teal-400/40 bg-teal-400/15 text-teal-300"
                          : "border-white/10 bg-transparent text-zinc-400 hover:text-white"
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-6 sm:grid-cols-[minmax(0,220px)_1fr] sm:items-center">
                {/* radar svg */}
                <div className="mx-auto w-full max-w-[240px]">
                  <svg viewBox="0 0 240 240" aria-hidden className="w-full">
                    {RING_FRACTIONS.map((f) => (
                      <polygon
                        key={f}
                        points={ringPath(f)}
                        fill="none"
                        stroke="rgba(255,255,255,0.09)"
                        strokeWidth={1}
                      />
                    ))}
                    {AXES.map((axis, i) => {
                      const a = axisAngle(i);
                      const x2 = round2(CX + MAX_R * Math.cos(a));
                      const y2 = round2(CY + MAX_R * Math.sin(a));
                      return (
                        <line
                          key={axis.key}
                          x1={CX}
                          y1={CY}
                          x2={x2}
                          y2={y2}
                          stroke="rgba(255,255,255,0.09)"
                          strokeWidth={1}
                        />
                      );
                    })}
                    <motion.polygon
                      points={polygon}
                      fill="rgba(45,212,191,0.22)"
                      stroke="#2dd4bf"
                      strokeWidth={2}
                      strokeLinejoin="round"
                      animate={{ points: polygon }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: "easeOut" }}
                    />
                    {AXES.map((axis, i) => {
                      const pos = axisLabelPos(i);
                      return (
                        <text
                          key={axis.key}
                          x={pos.x}
                          y={pos.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="9"
                          fill="rgba(255,255,255,0.55)"
                        >
                          {axis.short}
                        </text>
                      );
                    })}
                  </svg>
                </div>

                {/* sliders */}
                <div className="space-y-4">
                  {AXES.map((axis) => (
                    <div key={axis.key}>
                      <label
                        htmlFor={`w-${axis.key}`}
                        className="mb-1.5 flex items-center justify-between text-xs font-medium text-zinc-300"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <axis.icon className="h-3.5 w-3.5 text-teal-300" aria-hidden />
                          {axis.label}
                        </span>
                        <span className="font-mono tabular-nums text-teal-300">{weights[axis.key]}</span>
                      </label>
                      <input
                        id={`w-${axis.key}`}
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={weights[axis.key]}
                        onChange={(e) => setAxis(axis.key, Number(e.target.value))}
                        className={`h-2 w-full cursor-pointer accent-teal-400 ${focusRing}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ranked listing cards — reorders live with the sliders above */}
            <h2 className="sr-only">Live matches, ranked by your weights</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              <AnimatePresence initial={false}>
                {ranked.map((item, idx) => (
                  <motion.li
                    key={item.id}
                    layout
                    transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex gap-3">
                      <div
                        aria-hidden
                        className="flex aspect-square w-16 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#131318]"
                      >
                        <item.icon className="h-6 w-6 text-teal-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="truncate text-sm font-bold leading-tight">{item.name}</h3>
                          <span className="shrink-0 font-mono text-lg font-bold tabular-nums text-teal-300">
                            {item.match}%
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-zinc-400">
                          #{idx + 1} match · {item.category}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-medium text-zinc-300">
                            <BadgeCheck className="h-3 w-3 text-teal-300" aria-hidden />
                            Grade {item.grade}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-medium text-zinc-300">
                            <ShieldCheck className="h-3 w-3 text-teal-300" aria-hidden />
                            Verified
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full border border-teal-400/30 bg-teal-400/10 px-2 py-0.5 text-[10px] font-bold text-teal-300">
                            <Percent className="h-3 w-3" aria-hidden />
                            {pctOff(item.priceBefore, item.priceAfter)}% off
                          </span>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-sm font-bold">${item.priceAfter.toLocaleString("en-US")}</span>
                          <span className="text-xs text-zinc-400 line-through">
                            ${item.priceBefore.toLocaleString("en-US")}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-zinc-400">{item.driver}-led match</p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------- product preview -- */}
      <section className="border-t border-white/10 bg-[#0d0d12] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div initial="hidden" whileInView="show" viewport={VIEWPORT} variants={fadeUp}>
            <h2 className="text-[clamp(1.5rem,1.2rem_+_1.2vw,2.25rem)] font-bold tracking-[-0.02em]">
              This week&apos;s verified drops
            </h2>
            <p className="mt-3 max-w-[480px] text-base leading-[1.6] text-zinc-400">
              Every listing on repick is inspected, graded, and priced against real
              comparables before it ever reaches your radar.
            </p>
          </motion.div>
          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={stagger(0.08)}
            className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {PREVIEW_LISTINGS.map((item) => (
              <motion.li
                key={item.name}
                variants={fadeUp}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div
                  aria-hidden
                  className="flex aspect-square w-full items-center justify-center rounded-lg border border-white/10 bg-[#131318]"
                >
                  <item.icon className="h-8 w-8 text-teal-300" />
                </div>
                <h3 className="mt-3 truncate text-sm font-bold leading-tight">{item.name}</h3>
                <p className="mt-0.5 text-xs text-zinc-400">{item.category}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-medium text-zinc-300">
                    <BadgeCheck className="h-3 w-3 text-teal-300" aria-hidden />
                    Grade {item.grade}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-teal-400/30 bg-teal-400/10 px-2 py-0.5 text-[10px] font-bold text-teal-300">
                    {item.match}% match
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-sm font-bold">${item.priceAfter.toLocaleString("en-US")}</span>
                  <span className="text-xs text-zinc-400 line-through">
                    ${item.priceBefore.toLocaleString("en-US")}
                  </span>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- value 3-split -- */}
      <section className="border-t border-white/10 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={fadeUp}
            className="text-[clamp(1.5rem,1.2rem_+_1.2vw,2.25rem)] font-bold tracking-[-0.02em]"
          >
            Why weighted matching works
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={stagger(0.1)}
            className="mt-10 grid gap-8 sm:grid-cols-3"
          >
            <motion.div variants={fadeUp}>
              <RadarIcon className="h-6 w-6 text-teal-300" aria-hidden />
              <h3 className="mt-4 text-base font-bold">Your priorities, not a filter list</h3>
              <p className="mt-2 max-w-[280px] text-sm leading-[1.6] text-zinc-400">
                Sliders replace checkboxes. Shift trust above price and the whole
                catalog re-sorts instead of just hiding rows.
              </p>
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-400">
                Right now:{" "}
                <span className="font-bold text-teal-300">{topPick.name}</span> at {topPick.match}%
              </p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <ShieldCheck className="h-6 w-6 text-teal-300" aria-hidden />
              <h3 className="mt-4 text-base font-bold">Every listing inspected twice</h3>
              <p className="mt-2 max-w-[280px] text-sm leading-[1.6] text-zinc-400">
                Condition grade, authenticity check, and a fair-price read all ship
                with the listing — never added after you ask.
              </p>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Truck className="h-6 w-6 text-teal-300" aria-hidden />
              <h3 className="mt-4 text-base font-bold">Verified sellers, tracked delivery</h3>
              <p className="mt-2 max-w-[280px] text-sm leading-[1.6] text-zinc-400">
                Seller trust scores and shipping speed are measured the same way
                price is — as an axis you can weigh, not a promise.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------------ social proof -- */}
      <section className="border-t border-white/10 bg-[#0d0d12] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.h2 initial="hidden" whileInView="show" viewport={VIEWPORT} variants={fadeUp} className="sr-only">
            What members say
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={stagger(0.08)}
            className="grid grid-cols-2 gap-6 sm:grid-cols-4"
          >
            {[
              { icon: TrendingUp, value: "92,400+", label: "items weighted this month" },
              { icon: Users, value: "1 in 4", label: "buyers weigh trust above price" },
              { icon: Star, value: "4.8 / 5", label: "average buyer rating" },
              { icon: Clock3, value: "36 hrs", label: "average verification time" },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeUp}>
                <stat.icon className="h-5 w-5 text-teal-300" aria-hidden />
                <p
                  className="mt-3 text-2xl font-bold tabular-nums"
                  style={{ fontFamily: "var(--font-display-mono)" }}
                >
                  {stat.value}
                </p>
                <p className="mt-1 max-w-[160px] text-xs leading-[1.5] text-zinc-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={stagger(0.1)}
            className="mt-14 grid gap-6 sm:grid-cols-3"
          >
            {[
              { quote: "I pushed trust to max and speed to zero — the list flipped in a second. That's the first time a filter felt honest.", name: "Priya N.", role: "Buyer" },
              { quote: "Grading twice sounds slow until you realize it's why nothing comes back.", name: "Marcus D.", role: "Buyer" },
              { quote: "Listing with a real condition grade sells faster than guessing at adjectives ever did.", name: "Elena R.", role: "Seller" },
            ].map((t) => (
              <motion.figure
                key={t.name}
                variants={fadeUp}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
              >
                <Quote className="h-4 w-4 text-teal-300" aria-hidden />
                <blockquote className="mt-3 max-w-[300px] text-sm leading-[1.6] text-zinc-300">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-4 text-xs text-zinc-400">
                  <span className="font-bold text-zinc-300">{t.name}</span> · {t.role}
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------------- closing CTA -- */}
      <section id="cta" className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={fadeUp}
            className="mx-auto max-w-2xl text-[clamp(1.75rem,1.3rem_+_2vw,3rem)] font-bold leading-[1.08] tracking-[-0.02em]"
          >
            Ready to see your radar live?
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={fadeUp}
            className="mx-auto mt-4 max-w-[460px] text-base leading-[1.6] text-zinc-400"
          >
            Set your weights above and repick keeps ranking every new listing against
            them — no re-search required.
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={fadeUp}
            aria-live="polite"
            className="mx-auto mt-6 inline-flex max-w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left"
          >
            <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-400/15 text-teal-300">
              <topPick.icon className="h-4.5 w-4.5" />
            </span>
            <p className="text-sm leading-snug text-zinc-300">
              Your current top pick: <span className="font-bold text-white">{topPick.name}</span> ·{" "}
              <span className="font-bold text-teal-300">{topPick.match}% match</span> ·{" "}
              {activePreset ? `${activePreset.label} weighting` : "custom weighting"}
            </p>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={VIEWPORT} variants={fadeUp} className="mt-8">
            <a
              href="#top"
              className={`inline-flex items-center gap-2 rounded-full bg-teal-700 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-teal-800 active:scale-[0.97] ${focusRing}`}
            >
              Get matched now
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 text-xs text-zinc-400 sm:flex-row">
          <span>© 2026 repick</span>
          <span>Weighted matching, not keyword search.</span>
        </div>
      </footer>
    </div>
  );
}
