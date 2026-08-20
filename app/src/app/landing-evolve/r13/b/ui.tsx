"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import SpecCard from "./SpecCard";
import {
  BODY_MAX,
  BUDGET_DEFAULT,
  BUDGET_MAX,
  BUDGET_MIN,
  BUDGET_STEP,
  CAPTION,
  EASE,
  EYEBROW,
  FOCUS,
  ITEMS,
  LEDE_MAX,
  MONO,
  NUM,
  PRIORITIES,
  PROOF_STATS,
  SORTS,
  TESTIMONIAL,
  VALUE_BLOCKS,
  VIEWPORT,
  comma,
  cx,
  rankItems,
  type Priority,
  type SortKey,
} from "./data";

const CTA_PRIMARY = cx(
  "inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-emerald-800",
  FOCUS,
);

const NAV_LINK = cx(
  "rounded text-sm font-normal text-zinc-600 transition-colors duration-150 hover:text-zinc-950",
  FOCUS,
);

/** Segmented single-select (priority + sort). Buttons carry aria-pressed. */
function Segmented<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="group" aria-label={legend} className="flex w-full rounded-full bg-zinc-100 p-1 sm:inline-flex sm:w-auto">
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <button
            key={opt.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.key)}
            className={cx(
              "flex-1 whitespace-nowrap rounded-full px-3 py-1.5 text-center text-[0.75rem] font-semibold transition-colors duration-150 sm:flex-none",
              active ? "bg-emerald-700 text-white" : "text-zinc-600 hover:text-zinc-950",
              FOCUS,
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function LandingClient() {
  const reduced = useReducedMotion();
  const [budget, setBudget] = useState(BUDGET_DEFAULT);
  const [priority, setPriority] = useState<Priority>("match");
  const [sort, setSort] = useState<SortKey>("match");

  const ranked = useMemo(
    () => rankItems(ITEMS, budget, priority, sort),
    [budget, priority, sort],
  );
  const fitCount = ranked.filter((r) => r.fits).length;

  return (
    <main className="min-h-screen bg-white text-zinc-950 antialiased">
      <a
        href="#grid"
        className={cx(
          "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-emerald-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white",
          FOCUS,
        )}
      >
        Skip to the listings
      </a>

      {/* nav */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/85 backdrop-blur-md">
        <nav className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-5 py-4 sm:px-8">
          <a href="#top" className={cx("rounded text-base font-extrabold text-zinc-950", FOCUS)} style={MONO}>
            repick
          </a>
          <div className="hidden items-center gap-7 md:flex">
            <a href="#grid" className={NAV_LINK}>
              Listings
            </a>
            <a href="#how" className={NAV_LINK}>
              How it reads
            </a>
            <a href="#proof" className={NAV_LINK}>
              Proof
            </a>
          </div>
          <a href="#cta" className={CTA_PRIMARY}>
            Set your budget
          </a>
        </nav>
      </header>

      {/* HERO + CONTROLS + GRID — the grid is the spine, hero sits compact above it */}
      <section id="top" className="border-b border-zinc-200">
        <div className="mx-auto w-full max-w-[1200px] px-5 pb-16 pt-12 sm:px-8 sm:pt-14">
          {/* compact editorial hero */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="max-w-[760px]"
          >
            <p className={cx(EYEBROW, "inline-flex items-center gap-2 text-emerald-700")}>
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
              Price-verified pre-owned
            </p>
            <h1
              className="mt-4 text-[clamp(2.1rem,7vw,2.8rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-zinc-950 lg:text-[clamp(2.6rem,4vw,3.6rem)]"
              style={MONO}
            >
              Set a budget. Watch every price
              <br className="hidden sm:block" /> drop <span className="text-emerald-700">line up.</span>
            </h1>
            <p className={cx("mt-5 text-base font-normal leading-[1.6] text-zinc-600 sm:text-lg", LEDE_MAX)}>
              Each listing shows its price falling from market rate to the
              repick-verified figure as a line — with your budget, its condition
              grade, and a live match score already on the card.
            </p>
          </motion.div>

          {/* control bar — the input vocabulary, above the grid */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : 0.08 }}
            className="mt-9 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              {/* budget slider */}
              <div className="w-full max-w-[420px]">
                <div className="flex items-baseline justify-between">
                  <label htmlFor="budget" className="text-sm font-semibold text-zinc-950">
                    Your budget
                  </label>
                  <output htmlFor="budget" className={cx("text-lg font-extrabold text-emerald-700", NUM)} style={MONO}>
                    ${comma(budget)}
                  </output>
                </div>
                <input
                  id="budget"
                  type="range"
                  min={BUDGET_MIN}
                  max={BUDGET_MAX}
                  step={BUDGET_STEP}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  aria-describedby="budget-readout"
                  className={cx("mt-3 h-6 w-full cursor-pointer accent-emerald-600", FOCUS)}
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className={cx("text-[0.7rem] font-normal text-zinc-500", NUM)}>${comma(BUDGET_MIN)}</span>
                  <span id="budget-readout" className={cx("text-[0.72rem] font-semibold text-zinc-600", NUM)}>
                    {fitCount} of {ITEMS.length} listings fit
                  </span>
                  <span className={cx("text-[0.7rem] font-normal text-zinc-500", NUM)}>${comma(BUDGET_MAX)}</span>
                </div>
              </div>

              {/* priority + sort */}
              <div className="flex flex-col gap-4 md:flex-row md:gap-8">
                <div>
                  <p className={cx(CAPTION, "mb-2 text-zinc-600")}>What matters most</p>
                  <Segmented legend="What matters most" options={PRIORITIES} value={priority} onChange={setPriority} />
                </div>
                <div>
                  <p className={cx(CAPTION, "mb-2 text-zinc-600")}>Sort by</p>
                  <Segmented legend="Sort listings by" options={SORTS} value={sort} onChange={setSort} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* the spec grid */}
          <motion.div
            id="grid"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : 0.05 }}
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {ranked.map((r, i) => (
              <SpecCard
                key={r.item.id}
                item={r.item}
                budget={budget}
                match={r.match}
                fits={r.fits}
                rank={i + 1}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* VALUE IN 3 — tied to the trajectory / verification mechanic */}
      <section id="how" className="border-b border-zinc-200">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE }}
            className={cx(EYEBROW, "block text-emerald-700")}
          >
            How a spec card reads
          </motion.p>
          <motion.h2
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : 0.05 }}
            className="mt-4 max-w-[720px] text-[clamp(1.8rem,4.6vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-zinc-950"
            style={MONO}
          >
            Three proofs, one card, no hover required.
          </motion.h2>

          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
            {VALUE_BLOCKS.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.index}
                  initial={reduced ? false : { opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : i * 0.1 }}
                  className="relative"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-6 right-0 select-none text-6xl font-extrabold leading-none tracking-[-0.02em] text-zinc-100"
                    style={MONO}
                  >
                    {v.index}
                  </span>
                  <Icon className="h-6 w-6 text-emerald-700" strokeWidth={2} aria-hidden />
                  <h3 className="relative mt-5 text-lg font-semibold leading-snug tracking-[-0.01em] text-zinc-950">
                    {v.title}
                  </h3>
                  {/* 3-col grid column (~340px at 1200px max) is the binding width:
                      340 / (0.44*14) ≈ 55 chars, well under 70. */}
                  <p className="mt-3 text-sm font-normal leading-[1.6] text-zinc-600">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section id="proof" className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE }}
            className="grid grid-cols-1 gap-8 border-b border-zinc-200 pb-16 sm:grid-cols-3"
          >
            {PROOF_STATS.map((s) => (
              <div key={s.label}>
                <div className={cx("text-4xl font-extrabold text-zinc-950 sm:text-5xl", NUM)} style={MONO}>
                  {s.value}
                </div>
                <div className="mt-2 text-sm font-normal text-zinc-600">{s.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.figure
            initial={reduced ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : 0.05 }}
            className="mt-16 max-w-[760px]"
          >
            <blockquote className="text-2xl font-semibold leading-[1.4] tracking-[-0.02em] text-zinc-950 sm:text-[1.7rem]">
              &ldquo;{TESTIMONIAL.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-sm font-normal text-zinc-600">
              <span className="font-semibold text-zinc-950">{TESTIMONIAL.name}</span> · {TESTIMONIAL.role}
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* CLOSING CTA — asymmetric split, not a centered generic band */}
      <section id="cta">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.5, ease: EASE }}
              className="lg:col-span-7"
            >
              <h2
                className="text-[clamp(2rem,6vw,3.2rem)] font-extrabold leading-[1.06] tracking-[-0.02em] text-zinc-950"
                style={MONO}
              >
                Name a number.
                <br />
                See what lines up.
              </h2>
              <p className={cx("mt-6 text-base font-normal leading-[1.6] text-zinc-600", BODY_MAX)}>
                No account, no email gate. Set a budget and repick surfaces the
                pre-owned listings that fit — each one already graded, matched,
                and price-verified.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href="#top" className={cx(CTA_PRIMARY, "px-7 py-3.5 text-base")}>
                  Set your budget
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                </a>
                <span className="text-xs font-normal text-zinc-500">Live match, updated as you drag</span>
              </div>
            </motion.div>

            {/* right: a compact echo of a spec row, so the CTA carries proof too */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : 0.08 }}
              className="lg:col-span-5"
            >
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                <p className={cx(CAPTION, "text-zinc-600")}>At your ${comma(budget)} budget</p>
                <p className={cx("mt-2 text-3xl font-extrabold text-zinc-950", NUM)} style={MONO}>
                  {fitCount}<span className="text-zinc-500">/{ITEMS.length}</span>
                </p>
                <p className="mt-1 text-sm font-normal text-zinc-600">
                  listings fit right now, sorted by {SORTS.find((s) => s.key === sort)?.label.toLowerCase()}.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {ranked.slice(0, 3).map((r) => (
                    <span
                      key={r.item.id}
                      className={cx(
                        "rounded-full bg-white px-2.5 py-1 text-[0.72rem] font-semibold text-zinc-600 ring-1 ring-inset ring-zinc-200",
                        NUM,
                      )}
                    >
                      {r.item.title.split(" ").slice(-1)} · {r.match}%
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-zinc-200">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-2 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span className="text-base font-extrabold text-zinc-950" style={MONO}>
            repick
          </span>
          <span className="text-xs font-normal text-zinc-500">Price-verified secondhand · 2026 REPICK</span>
        </div>
      </footer>
    </main>
  );
}
