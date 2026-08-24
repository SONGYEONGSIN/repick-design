"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  CATEGORIES,
  LISTINGS,
  discountPct,
  dropPct,
  eventGlyph,
  eventKindLabel,
  fastestMover,
  feedFor,
  filterListings,
  listingOf,
  money,
  mostWatched,
  sortListings,
  withinBudget,
  type CategoryId,
  type SortMode,
} from "./data";

// ---- style tokens -----------------------------------------------------------------------------
// accent: #B45309 (deep amber). Contrast math logged in
// vault/20-generations/2026-08-23-auto-landing-r15/candidates/c.md — reproduced briefly here:
//   accent vs bg #0B0B0F        -> 3.91:1  (fills / borders / >=24px or >=19px-bold text only)
//   accent-tint #F3B457 vs bg   -> 10.74:1 (small text / icons / focus ring)
//   white on accent fill        -> 5.02:1  (small non-bold text on a filled accent surface)
//   dark ink #0B0B0F on accent  -> 3.91:1  (large/bold text or non-text fill only, not body text)
const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3B457]";
const EYEBROW = "text-[11px] font-medium tracking-[0.28em] text-[#F3B457]";
const CAPTION = "text-[11px] font-normal tracking-[0.16em] text-[#A1A1AA]";
const STAT_LABEL = "text-[10px] font-medium tracking-[0.12em] text-[#A1A1AA]";
const MONO = { fontFamily: "var(--font-display-mono)" } as const;

const SORTS: { id: SortMode; label: string }[] = [
  { id: "recent", label: "Latest activity" },
  { id: "drop", label: "Biggest drop" },
  { id: "watched", label: "Most watched" },
];

function Reveal({
  children,
  className,
  delay = 0,
  role,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  role?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce)
    return (
      <div className={className} role={role}>
        {children}
      </div>
    );
  return (
    <motion.div
      className={className}
      role={role}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0, margin: "220px 0px 220px 0px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function DeltaTag({ kind, deltaText }: { kind: "bid" | "drop" | "watch"; deltaText: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[13px] font-medium tabular-nums text-[#F3B457]">
      <span aria-hidden="true">{eventGlyph(kind)}</span>
      {deltaText}
    </span>
  );
}

function KindChip({ kind }: { kind: "bid" | "drop" | "watch" }) {
  return (
    <span className="inline-flex rounded-md border border-white/12 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium tracking-[0.1em] text-[#A1A1AA]">
      {eventKindLabel(kind)}
    </span>
  );
}

function InBudgetTag() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#B45309] px-2 py-0.5 text-[10px] font-medium tracking-[0.1em] text-white">
      <span aria-hidden="true">&#9679;</span>
      IN BUDGET
    </span>
  );
}

export default function Page() {
  const reduce = useReducedMotion();

  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [target, setTarget] = useState(700);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [pulseTick, setPulseTick] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setPulseTick((t) => t + 1), 2400);
    return () => clearInterval(id);
  }, [reduce]);

  const filtered = useMemo(() => filterListings(category), [category]);
  const sorted = useMemo(() => sortListings(filtered, sortMode), [filtered, sortMode]);
  const feed = useMemo(() => feedFor(sorted), [sorted]);
  const budgetList = useMemo(() => withinBudget(sorted, target), [sorted, target]);
  const mover = fastestMover(sorted);
  const watched = mostWatched(sorted);

  const pulseRow = feed.length > 0 && !reduce ? pulseTick % feed.length : -1;

  const summary = `${sorted.length} listing${sorted.length === 1 ? "" : "s"} visible · ${
    budgetList.length
  } of ${sorted.length} within your ${money(target)} target.`;

  function toggleExpand(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <main className="min-h-dvh overflow-x-clip bg-[#0B0B0F] font-normal text-white antialiased">
      {/* ---------------------------------------------------------------------------------- HERO */}
      <section id="feed" className="border-b border-white/10 px-5 pt-20 pb-16 sm:px-8 lg:px-12 lg:pt-28 lg:pb-24">
        <div className="mx-auto w-full max-w-[1240px]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
            {/* left rail */}
            <div className="lg:col-span-5">
              <p className={EYEBROW}>LIVE MARKET FEED</p>
              <h1
                className="mt-5 text-[clamp(2.3rem,7.2vw,3.6rem)] font-extrabold leading-[0.98] tracking-[-0.02em]"
                style={MONO}
              >
                The market
                <span className="block">never sleeps.</span>
              </h1>
              <p className="mt-6 max-w-[520px] text-[17px] font-normal leading-[1.6] text-[#A1A1AA]">
                Every offer, price drop, and new watcher on repick shows up here the instant it
                happens, timestamped, not guessed. Set a target price and watch which listings fall
                inside it as the board moves.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#preview"
                  className={`inline-flex rounded-full bg-[#B45309] px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-[#8F4207] ${FOCUS}`}
                >
                  Browse every live listing
                </a>
                <span className={STAT_LABEL}>NO ACCOUNT NEEDED TO WATCH</span>
              </div>

              <p className={`mt-10 ${CAPTION}`}>
                Fig. 01 &mdash; Live feed, timestamped session, sample data
              </p>
            </div>

            {/* live board */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className={CAPTION}>Fig. 02 &mdash; Live listings, right now</p>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#B45309]/50 bg-[#B45309]/15 px-2.5 py-1 text-[10px] font-medium tracking-[0.12em] text-[#F3B457]">
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full bg-[#F3B457] ${
                        reduce ? "" : "animate-pulse motion-reduce:animate-none"
                      }`}
                    />
                    LIVE
                  </span>
                </div>

                {/* controls */}
                <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
                    {(["all", ...CATEGORIES.map((c) => c.id)] as const).map((id) => {
                      const label = id === "all" ? "All" : CATEGORIES.find((c) => c.id === id)?.label;
                      const on = category === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setCategory(id)}
                          className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${FOCUS} ${
                            on
                              ? "border-[#B45309] bg-[#B45309] text-white"
                              : "border-white/15 bg-white/[0.02] text-[#A1A1AA] hover:border-white/30 hover:text-white"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap gap-2" role="group" aria-label="Sort listings">
                    {SORTS.map((s) => {
                      const on = sortMode === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setSortMode(s.id)}
                          className={`rounded-md border px-2.5 py-1 text-[11px] font-medium tracking-[0.04em] transition-colors ${FOCUS} ${
                            on
                              ? "border-[#F3B457]/60 bg-white/[0.06] text-[#F3B457]"
                              : "border-white/10 bg-transparent text-[#A1A1AA] hover:text-white"
                          }`}
                        >
                          {s.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-[#0B0B0F] p-3">
                    <div className="min-w-[140px] rounded-lg bg-[#B45309] px-3 py-2">
                      <p className="text-[9px] font-medium tracking-[0.12em] text-white">
                        TARGET PRICE
                      </p>
                      <p
                        className="mt-0.5 text-[22px] font-extrabold leading-none tabular-nums text-[#0B0B0F]"
                        style={MONO}
                      >
                        {money(target)}
                      </p>
                    </div>
                    <label className="flex-1 min-w-[160px]">
                      <span className="sr-only">Set your target price</span>
                      <input
                        type="range"
                        min={50}
                        max={2500}
                        step={10}
                        value={target}
                        onChange={(e) => setTarget(Number(e.target.value))}
                        className={`h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#B45309] ${FOCUS}`}
                      />
                      <span className="mt-1 flex justify-between text-[10px] font-normal text-[#A1A1AA]">
                        <span>$50</span>
                        <span>$2,500</span>
                      </span>
                    </label>
                  </div>

                  <p aria-live="polite" className="text-[13px] font-normal text-[#A1A1AA]">
                    {summary}
                  </p>
                </div>

                {/* listings strip */}
                <div role="list" className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
                  <AnimatePresence initial={false}>
                    {sorted.map((l) => {
                      const on = l.price <= target;
                      const itemClass = `rounded-xl border px-3.5 py-2.5 transition-colors ${
                        on
                          ? "border-[#B45309]/70 bg-[#B45309]/[0.08]"
                          : "border-white/10 bg-white/[0.02]"
                      }`;
                      const content = (
                        <>
                          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                            <span className="text-[14px] font-medium tracking-[-0.01em]">
                              {l.name}
                              <span className="ml-2 text-[11px] font-normal text-[#A1A1AA]">
                                {CATEGORIES.find((c) => c.id === l.category)?.label}
                              </span>
                            </span>
                            {on ? <InBudgetTag /> : null}
                          </div>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-normal text-[#A1A1AA]">
                            <span>{l.matchPct}% match</span>
                            <span>Grade {l.grade}</span>
                            <span>&#10003; {l.verifiedLabel}</span>
                          </div>
                          <div className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <span className="text-[13px] font-normal tabular-nums text-[#A1A1AA] line-through">
                              {money(l.retail)}
                            </span>
                            <span className="text-[15px] font-medium tabular-nums" style={MONO}>
                              {money(l.price)}
                            </span>
                            <span className="text-[11px] font-normal tabular-nums text-[#F3B457]">
                              -{discountPct(l)}%
                            </span>
                            <span className="text-[11px] font-normal tabular-nums text-[#A1A1AA]">
                              {l.watchers} watching
                            </span>
                          </div>
                        </>
                      );
                      return reduce ? (
                        <div key={l.id} role="listitem" className={itemClass}>
                          {content}
                        </div>
                      ) : (
                        <motion.div
                          key={l.id}
                          role="listitem"
                          layout
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className={itemClass}
                        >
                          {content}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* ticker event feed */}
                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="sr-only">Live activity feed, most recent first</h2>
                    <p className={STAT_LABEL}>ACTIVITY &middot; NEWEST FIRST</p>
                    <p className={STAT_LABEL}>{feed.length} EVENTS</p>
                  </div>
                  <div
                    role="list"
                    aria-label="Live activity feed, most recent first"
                    className="mt-2 flex max-h-[300px] flex-col gap-1 overflow-y-auto pr-1"
                  >
                    <AnimatePresence initial={false}>
                      {feed.map((e, i) => {
                        const l = listingOf(sorted, e.listingId) ?? LISTINGS.find((x) => x.id === e.listingId);
                        const on = l ? l.price <= target : false;
                        const isPulsing = i === pulseRow;
                        const itemClass = `flex flex-col gap-0.5 rounded-md border-l-2 px-2.5 py-1.5 transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-3 ${
                          on ? "border-l-[#B45309] bg-[#B45309]/[0.06]" : "border-l-white/10"
                        } ${isPulsing ? "bg-white/[0.05]" : ""}`;
                        const content = (
                          <>
                            <div className="flex items-center gap-2 sm:w-[190px] sm:shrink-0">
                              <span
                                className="text-[11px] font-normal tabular-nums text-[#A1A1AA]"
                                style={MONO}
                              >
                                {e.ts}
                              </span>
                              <span className="truncate text-[12px] font-medium">
                                {l?.name ?? e.listingId}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <KindChip kind={e.kind} />
                              <DeltaTag kind={e.kind} deltaText={e.deltaText} />
                              <span
                                className="hidden text-[11px] font-normal tabular-nums text-[#A1A1AA] sm:inline"
                                style={MONO}
                              >
                                {e.value}
                              </span>
                            </div>
                          </>
                        );
                        return reduce ? (
                          <div key={e.id} role="listitem" className={itemClass}>
                            {content}
                          </div>
                        ) : (
                          <motion.div
                            key={e.id}
                            role="listitem"
                            layout
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={itemClass}
                          >
                            {content}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------ PRODUCT PREVIEW */}
      <section id="preview" className="border-b border-white/10 px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto w-full max-w-[1240px]">
          <Reveal>
            <div className="flex items-end gap-5">
              <span
                aria-hidden="true"
                className="select-none text-[clamp(2rem,3.2vw,2.5rem)] font-medium leading-[0.9] tracking-[0.12em] text-[#6B6B78]"
                style={MONO}
              >
                02
              </span>
              <div>
                <p className={EYEBROW}>THE LISTINGS</p>
                <h2
                  className="mt-3 max-w-[720px] text-[clamp(1.7rem,4.4vw,2.9rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
                  style={MONO}
                >
                  Five items, five live windows into demand.
                </h2>
              </div>
            </div>
            <p className="mt-5 max-w-[488px] text-[16px] font-normal leading-[1.6] text-[#A1A1AA]">
              Each card carries the reasoning behind the match, not just the score. Expand any card
              to see what the AI checked before it surfaced this listing to you.
            </p>
          </Reveal>

          <div role="list" className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence initial={false}>
              {sorted.map((l, i) => {
                const on = l.price <= target;
                const open = !!expanded[l.id];
                return (
                  <Reveal
                    key={l.id}
                    role="listitem"
                    delay={Math.min(i, 4) * 0.05}
                    className={`flex h-full flex-col rounded-2xl border p-5 transition-colors ${
                      on
                        ? "border-[#B45309]/70 bg-[#B45309]/[0.06]"
                        : "border-white/10 bg-white/[0.03] hover:border-white/25"
                    }`}
                  >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={CAPTION}>
                            {CATEGORIES.find((c) => c.id === l.category)?.label}
                          </p>
                          <h3 className="mt-1 text-[17px] font-medium tracking-[-0.01em]">
                            {l.name}
                          </h3>
                        </div>
                        {on ? <InBudgetTag /> : null}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="rounded-md border border-white/12 bg-white/[0.04] px-2 py-1 text-[10px] font-normal text-[#F3B457]">
                          {l.matchPct}% MATCH
                        </span>
                        <span className="rounded-md border border-white/12 bg-white/[0.04] px-2 py-1 text-[10px] font-normal text-[#A1A1AA]">
                          GRADE {l.grade}
                        </span>
                        <span className="rounded-md border border-white/12 bg-white/[0.04] px-2 py-1 text-[10px] font-normal text-[#A1A1AA]">
                          &#10003; {l.verifiedLabel.toUpperCase()}
                        </span>
                      </div>

                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-[13px] font-normal tabular-nums text-[#A1A1AA] line-through">
                          {money(l.retail)}
                        </span>
                        <span
                          className="text-[22px] font-extrabold tabular-nums leading-none"
                          style={MONO}
                        >
                          {money(l.price)}
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] font-normal tabular-nums text-[#A1A1AA]">
                        -{discountPct(l)}% vs retail &middot; -{dropPct(l)}% today
                      </p>

                      <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 tabular-nums">
                        <div>
                          <dt className={STAT_LABEL}>WATCHERS</dt>
                          <dd className="mt-0.5 text-[13px] font-medium">{l.watchers}</dd>
                        </div>
                        <div>
                          <dt className={STAT_LABEL}>OFFERS</dt>
                          <dd className="mt-0.5 text-[13px] font-medium">{l.bids}</dd>
                        </div>
                        <div>
                          <dt className={STAT_LABEL}>CLOSES</dt>
                          <dd className="mt-0.5 text-[13px] font-medium">{l.closesIn}</dd>
                        </div>
                      </dl>

                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={`why-${l.id}`}
                        onClick={() => toggleExpand(l.id)}
                        className={`mt-4 inline-flex w-fit items-center gap-1.5 rounded-md text-[12px] font-medium text-[#F3B457] ${FOCUS}`}
                      >
                        Why this match
                        <span aria-hidden="true">{open ? "▴" : "▾"}</span>
                      </button>

                      {reduce ? (
                        open ? (
                          <ul id={`why-${l.id}`} className="mt-2 flex flex-col gap-1.5">
                            {l.reasons.map((r) => (
                              <li
                                key={r}
                                className="text-[12px] font-normal leading-[1.5] text-[#A1A1AA]"
                              >
                                &middot; {r}
                              </li>
                            ))}
                          </ul>
                        ) : null
                      ) : (
                        <motion.div
                          id={`why-${l.id}`}
                          initial={false}
                          animate={open ? "open" : "closed"}
                          variants={{
                            open: { height: "auto", opacity: 1 },
                            closed: { height: 0, opacity: 0 },
                          }}
                          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                          style={{ overflow: "hidden" }}
                        >
                          <ul className="mt-2 flex flex-col gap-1.5">
                            {l.reasons.map((r) => (
                              <li
                                key={r}
                                className="text-[12px] font-normal leading-[1.5] text-[#A1A1AA]"
                              >
                                &middot; {r}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                  </Reveal>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------------- VALUE 3-UP */}
      <section className="border-b border-white/10 px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto w-full max-w-[1240px]">
          <Reveal>
            <p className={EYEBROW}>WHY IT MATTERS</p>
            <h2
              className="mt-4 max-w-[820px] text-[clamp(1.7rem,4.4vw,2.9rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
              style={MONO}
            >
              A board that keeps ticking turns hesitation into action.
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Reveal>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <span
                  aria-hidden="true"
                  className="block select-none text-[1.75rem] font-medium leading-none tracking-[0.12em] text-[#6B6B78]"
                  style={MONO}
                >
                  01
                </span>
                <h3 className="mt-5 text-[15px] font-medium tracking-[-0.02em]">Within budget</h3>
                <p
                  className="mt-3 text-[clamp(1.3rem,3vw,1.7rem)] font-extrabold leading-tight tracking-[-0.02em] tabular-nums"
                  style={MONO}
                >
                  {budgetList.length} of {sorted.length}
                </p>
                <p className="mt-4 max-w-[440px] text-[15px] font-normal leading-[1.6] text-[#A1A1AA]">
                  at your {money(target)} target, recalculated the moment you move the slider above.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <span
                  aria-hidden="true"
                  className="block select-none text-[1.75rem] font-medium leading-none tracking-[0.12em] text-[#6B6B78]"
                  style={MONO}
                >
                  02
                </span>
                <h3 className="mt-5 text-[15px] font-medium tracking-[-0.02em]">Fastest mover</h3>
                <p
                  className="mt-3 text-[clamp(1.3rem,3vw,1.7rem)] font-extrabold leading-tight tracking-[-0.02em] tabular-nums"
                  style={MONO}
                >
                  {mover ? `-${dropPct(mover)}%` : "—"}
                </p>
                <p className="mt-4 max-w-[440px] text-[15px] font-normal leading-[1.6] text-[#A1A1AA]">
                  {mover ? `${mover.name} has dropped the furthest since it went live today.` : "Pick a category to compare movers."}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <span
                  aria-hidden="true"
                  className="block select-none text-[1.75rem] font-medium leading-none tracking-[0.12em] text-[#6B6B78]"
                  style={MONO}
                >
                  03
                </span>
                <h3 className="mt-5 text-[15px] font-medium tracking-[-0.02em]">Most watched</h3>
                <p
                  className="mt-3 text-[clamp(1.3rem,3vw,1.7rem)] font-extrabold leading-tight tracking-[-0.02em] tabular-nums"
                  style={MONO}
                >
                  {watched ? watched.watchers : "—"}
                </p>
                <p className="mt-4 max-w-[440px] text-[15px] font-normal leading-[1.6] text-[#A1A1AA]">
                  {watched ? `${watched.watchers} people are watching ${watched.name} right now.` : "Pick a category to compare demand."}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------------- SOCIAL PROOF */}
      <section className="border-b border-white/10 px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto w-full max-w-[1240px]">
          <Reveal>
            <p className={EYEBROW}>BUYERS &amp; SELLERS</p>
            <h2
              className="mt-4 max-w-[720px] text-[clamp(1.7rem,4.4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
              style={MONO}
            >
              They stopped guessing when to move.
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                q: "I set my number once and just watched it happen. The Ridge dropped into range while I was still deciding, and thirty seconds later two more offers landed.",
                who: "Priya Raman",
                what: "Bought a Ridge 14",
              },
              {
                q: "Watching the offers come in told me more than any price chart could. I knew exactly when to move instead of guessing.",
                who: "Owen Baptiste",
                what: "Bought a Loop Pro",
              },
              {
                q: "As a seller, watching my own watcher count tick up in real time is the closest thing to standing at an open house.",
                who: "Mira Voss",
                what: "Sold a Transit S2",
              },
            ].map((t, i) => (
              <Reveal key={t.who} delay={i * 0.06}>
                <figure className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <span
                    aria-hidden="true"
                    className="block select-none text-[3rem] font-extrabold leading-[0.6] text-[#B45309]"
                    style={MONO}
                  >
                    &ldquo;
                  </span>
                  <blockquote className="mt-4 max-w-[440px] text-[15px] font-normal leading-[1.6]">
                    {t.q}
                  </blockquote>
                  <figcaption className="mt-5 border-t border-white/10 pt-4">
                    <span className="block text-[13px] font-medium">{t.who}</span>
                    <span className="mt-1 block text-[12px] font-normal text-[#A1A1AA]">
                      {t.what}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <dl className="mt-10 grid grid-cols-1 gap-6 border-t border-white/10 pt-8 tabular-nums sm:grid-cols-3">
              {[
                { k: "LISTINGS TRACKED TODAY", v: "1,842", n: "across every category" },
                { k: "MEDIAN TIME TO FIRST OFFER", v: "6 min", n: "after a listing goes live" },
                { k: "MEDIAN MARKDOWN BEFORE SALE", v: "18%", n: "from the opening ask" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className={STAT_LABEL}>{s.k}</dt>
                  <dd
                    className="mt-2 text-[clamp(1.5rem,3.4vw,2rem)] font-extrabold leading-none tracking-[-0.02em]"
                    style={MONO}
                  >
                    {s.v}
                  </dd>
                  <dd className="mt-1 text-[13px] font-normal text-[#A1A1AA]">{s.n}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------------------------------- CLOSING CTA */}
      <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto w-full max-w-[1240px]">
          <Reveal>
            <p className={EYEBROW}>DON&rsquo;T WAIT ON IT</p>
            <h2
              className="mt-5 max-w-[900px] text-[clamp(2rem,6.2vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.02em]"
              style={MONO}
            >
              The board keeps moving whether you&rsquo;re watching or not.
            </h2>
            <p className="mt-6 max-w-[520px] text-[17px] font-normal leading-[1.6] text-[#A1A1AA]">
              Set a target once and every listing that crosses it lights up here first, before it
              shows up anywhere else.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#feed"
                className={`inline-flex rounded-full bg-[#B45309] px-8 py-4 text-[15px] font-medium text-white transition-colors hover:bg-[#8F4207] ${FOCUS}`}
              >
                Open the live feed
              </a>
              <span className="text-[13px] font-normal tabular-nums text-[#A1A1AA]">
                {summary}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-4">
          <span className="text-[13px] font-medium tracking-[-0.02em]">Repick</span>
          <span className={CAPTION}>LIVE MARKET FEED &middot; SAMPLE DATA</span>
        </div>
      </footer>
    </main>
  );
}
