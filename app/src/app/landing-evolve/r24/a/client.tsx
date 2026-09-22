"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  Check,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Mail,
  Quote,
  ShieldCheck,
  Star,
  UserCheck,
} from "lucide-react";
import BridgeChart from "./bridge-chart";
import {
  AI_MATCH_TAGS,
  CONDITION_RUBRIC,
  computeBridge,
  DEFAULT_ACTIVE,
  FACTORS,
  ITEM,
  LIST_PRICE,
  money,
  moneySigned,
  TESTIMONIALS,
  TRUST_STATS,
  type FactorId,
} from "./data";

// ---------------------------------------------------------------------------------------------
// Accent: sky-700 family (#0369A1), chosen instead of the catalog-overused violet — see
// candidates/a.md for the full contrast math. Both pairings below are computed with the WCAG
// relative-luminance formula, not eyeballed:
//   white text on #0369A1 fill        -> 5.93:1  (passes AA at every size)
//   slate-950 (#020617) on #0369A1    -> 3.40:1  (passes only the large-text / non-text floor)
// Because white clears AA at every size, this file uses white on every accent-filled surface and
// reserves slate-950 for large/bold figures and non-text fills only, per design-principles.
// ---------------------------------------------------------------------------------------------

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369A1]";
const EYEBROW = "text-[11px] font-semibold tracking-[0.28em] text-[#0369A1]";
const CAPTION = "text-[11px] font-normal tracking-[0.16em] text-slate-600";
const STAT_LABEL = "text-[10px] font-semibold tracking-[0.12em] text-slate-600";
const STAR_POSITIONS = [0, 1, 2, 3, 4];
const SKIP_LINK =
  "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-slate-950 focus-visible:px-4 focus-visible:py-2 focus-visible:text-[13px] focus-visible:font-semibold focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369A1]";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DISPLAY = { fontFamily: "var(--font-display-grotesk)" };
const NUMERIC = { fontFamily: "var(--font-mono)" };

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0, margin: "220px 0px 220px 0px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionNumber({ n }: { n: string }) {
  return (
    <span
      aria-hidden="true"
      className="select-none text-[clamp(2rem,3.2vw,2.5rem)] font-semibold leading-[0.9] tracking-[0.12em] text-slate-500"
      style={NUMERIC}
    >
      {n}
    </span>
  );
}

function ProductPhoto({ small = false }: { small?: boolean }) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl bg-slate-100 ${
        small ? "h-16 w-16 sm:h-20 sm:w-20" : "aspect-[4/3] w-full"
      }`}
    >
      {!failed ? (
        <Image
          src={`https://images.unsplash.com/photo-${ITEM.photoId}?q=80&w=900&auto=format&fit=crop`}
          alt={ITEM.alt}
          fill
          priority={!small}
          sizes={small ? "80px" : "(min-width: 1024px) 560px, 100vw"}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-slate-100 text-slate-400">
          <Camera className={small ? "h-5 w-5" : "h-8 w-8"} aria-hidden="true" />
          <span className="sr-only">{ITEM.alt}</span>
        </div>
      )}
    </div>
  );
}

export default function PriceBridgeLanding() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<Set<FactorId>>(new Set(DEFAULT_ACTIVE));
  const [rubricOpen, setRubricOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState<"idle" | "ok" | "error">("idle");

  const result = useMemo(() => computeBridge(active), [active]);
  const { steps, finalPrice, totalAdjustment, pctOff } = result;
  const offLabel = pctOff >= 0 ? `${pctOff}% off list` : `${Math.abs(pctOff)}% above list`;

  function toggle(id: FactorId) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEmailState(EMAIL_RE.test(email) ? "ok" : "error");
  }

  const heroIn = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
      };

  const statCards = useMemo(
    () => [
      {
        idx: "01",
        title: "Total adjustment",
        value: money(totalAdjustment),
        copy:
          totalAdjustment <= 0
            ? `The active adjustments bring the price down ${money(Math.abs(totalAdjustment))} from list.`
            : `The active adjustments add ${money(totalAdjustment)} above list — remove one to see it fall.`,
      },
      {
        idx: "02",
        title: "Active factors",
        value: `${steps.length} / ${FACTORS.length}`,
        copy:
          steps.length === 0
            ? "Every adjustment is off — the price bridge is just the naive list price right now."
            : `${steps.map((s) => s.label).join(", ")}.`,
      },
      {
        idx: "03",
        title: "Vs. list price",
        value: offLabel,
        copy: `List price ${money(LIST_PRICE)} to your price ${money(finalPrice)} — this line moves the moment you toggle a factor.`,
      },
    ],
    [totalAdjustment, steps, offLabel, finalPrice],
  );

  return (
    <div className="min-h-dvh overflow-x-clip bg-white font-normal text-slate-950 antialiased">
      <a href="#main" className={SKIP_LINK}>
        Skip to main content
      </a>

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-6">
          <span className="flex items-center gap-2 text-[15px] font-extrabold tracking-[-0.02em] text-slate-950">
            <span className="h-2 w-2 rounded-full bg-[#0369A1]" aria-hidden="true" />
            repick
          </span>
          <nav aria-label="Sections" className="hidden items-center gap-6 sm:flex">
            <a href="#listing" className={`px-1 py-2 text-[13px] font-normal text-slate-600 transition-colors hover:text-slate-950 ${FOCUS}`}>
              The listing
            </a>
            <a href="#bridge" className={`px-1 py-2 text-[13px] font-normal text-slate-600 transition-colors hover:text-slate-950 ${FOCUS}`}>
              The bridge
            </a>
            <a href="#sellers" className={`px-1 py-2 text-[13px] font-normal text-slate-600 transition-colors hover:text-slate-950 ${FOCUS}`}>
              Sellers
            </a>
          </nav>
          <a
            href="#start"
            className={`rounded-full bg-[#0369A1] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#075985] ${FOCUS}`}
          >
            Start selling
          </a>
        </div>
      </header>

      <main id="main">
        {/* ---------------------------------------------------------------- HERO */}
        <section className="border-b border-slate-200 px-5 pt-10 pb-12 sm:px-8 lg:px-12 lg:pt-14 lg:pb-16">
          <div className="mx-auto w-full max-w-[1240px]">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10">
              <motion.div className="min-w-0 lg:col-span-5" {...heroIn}>
                <p className={EYEBROW}>TRANSPARENT AI PRICING</p>
                <h1
                  className="mt-4 text-[clamp(2rem,5.6vw,3.1rem)] font-extrabold leading-[1.05] tracking-[-0.01em] text-slate-950"
                  style={DISPLAY}
                >
                  Watch the price
                  <span className="block text-[#0369A1]">get honest.</span>
                </h1>
                <p className="mt-5 max-w-[479px] text-[16px] font-normal leading-[1.6] text-slate-600">
                  Repick doesn&rsquo;t hand sellers a number &mdash; it shows the bridge from list
                  price to your price, one named adjustment at a time. Toggle any adjustment on the
                  right and watch every bar, and the running total, recompute in place.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <a
                    href="#start"
                    className={`inline-flex items-center gap-2 rounded-full bg-[#0369A1] px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#075985] ${FOCUS}`}
                  >
                    Start selling
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <span className={STAT_LABEL}>{FACTORS.length} PRICING FACTORS, FULLY TRANSPARENT</span>
                </div>
              </motion.div>

              {/* ---- product + proof, inside the Hero itself ---- */}
              <motion.div className="min-w-0 lg:col-span-7" {...heroIn}>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6">
                  <div className="flex items-center gap-4">
                    <ProductPhoto small />
                    <div className="min-w-0">
                      <p className={STAT_LABEL}>{ITEM.category.toUpperCase()}</p>
                      <h2 className="mt-0.5 truncate text-[16px] font-extrabold tracking-[-0.01em] text-slate-950">
                        {ITEM.name}
                      </h2>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-[#0369A1]">
                          <CircleCheck className="h-3 w-3" aria-hidden="true" />
                          {ITEM.matchPct}% match
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                          Grade {ITEM.conditionGrade}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                          <ShieldCheck className="h-3 w-3 text-[#0369A1]" aria-hidden="true" />
                          Verified seller
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 border-t border-slate-200 pt-4">
                    <p className="text-[13px] font-normal text-slate-600">
                      List{" "}
                      <span className="tabular-nums line-through" style={NUMERIC}>
                        {money(LIST_PRICE)}
                      </span>{" "}
                      &rarr; your price
                    </p>
                    <p
                      className="text-[clamp(1.5rem,3vw,1.9rem)] font-semibold tabular-nums text-[#0369A1]"
                      style={NUMERIC}
                      aria-live="polite"
                    >
                      {money(finalPrice)}
                    </p>
                  </div>

                  <div className="mt-4" role="group" aria-label="Bridge adjustments — toggle any combination">
                    <p className={STAT_LABEL}>ADJUSTMENTS &mdash; TOGGLE ANY COMBINATION</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {FACTORS.map((f) => {
                        const on = active.has(f.id);
                        return (
                          <button
                            key={f.id}
                            type="button"
                            aria-pressed={on}
                            onClick={() => toggle(f.id)}
                            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-left text-[12px] font-semibold transition-colors ${FOCUS} ${
                              on
                                ? "border-[#0369A1] bg-sky-50 text-slate-950"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                            }`}
                          >
                            <span
                              aria-hidden="true"
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                on ? "border-[#0369A1] bg-[#0369A1]" : "border-slate-300 bg-white"
                              }`}
                            >
                              {on && <Check className="h-3 w-3 text-white" />}
                            </span>
                            <span className="max-w-[132px] truncate sm:max-w-[160px]">{f.label}</span>
                            <span className="tabular-nums text-slate-600" style={NUMERIC}>
                              {moneySigned(f.delta)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <BridgeChart steps={steps} finalPrice={finalPrice} />
                    <p className={`mt-3 ${CAPTION}`} aria-live="polite">
                      Fig. 01 &mdash; {steps.length} of {FACTORS.length} adjustments applied, live.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- PRODUCT PREVIEW */}
        <section id="listing" className="border-b border-slate-200 bg-slate-50 px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <div className="flex items-end gap-5">
                <SectionNumber n="02" />
                <div>
                  <p className={EYEBROW}>THE LISTING</p>
                  <h2
                    className="mt-3 max-w-[720px] text-[clamp(1.6rem,4vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.01em] text-slate-950"
                    style={DISPLAY}
                  >
                    Everything a buyer sees, none of it painted over the photo.
                  </h2>
                </div>
              </div>
              <p className="mt-5 max-w-[479px] text-[16px] font-normal leading-[1.6] text-slate-600">
                The AI match reasoning and the condition rubric sit in their own cards below the
                photo &mdash; so a slow connection never leaves a badge floating over a broken image.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
              <Reveal className="min-w-0 lg:col-span-4">
                <ProductPhoto />
                <p className={`mt-3 ${CAPTION}`}>Fig. 02 &mdash; Current listing photo</p>
              </Reveal>

              <Reveal className="min-w-0 lg:col-span-4" delay={0.05}>
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                  <p className={STAT_LABEL}>AI MATCH REASONING</p>
                  <ul className="mt-3 flex flex-col gap-2">
                    {AI_MATCH_TAGS.map((tag) => (
                      <li
                        key={tag}
                        className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] font-normal leading-[1.5] text-slate-600"
                      >
                        <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#0369A1]" aria-hidden="true" />
                        <span className="text-slate-950">{tag}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[12px] font-semibold text-slate-700">
                      <UserCheck className="h-3.5 w-3.5 text-[#0369A1]" aria-hidden="true" />
                      {ITEM.sellerTrades} trades &middot; {ITEM.sellerRating.toFixed(1)} / 5
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[12px] font-semibold text-slate-700">
                      <BadgeCheck className="h-3.5 w-3.5 text-[#0369A1]" aria-hidden="true" />
                      ID &amp; address confirmed
                    </span>
                  </div>
                </div>
              </Reveal>

              <Reveal className="min-w-0 lg:col-span-4" delay={0.1}>
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                  <p className={STAT_LABEL}>CONDITION GRADE {ITEM.conditionGrade}</p>
                  <p className="mt-2 text-[14px] font-normal leading-[1.6] text-slate-600">
                    {CONDITION_RUBRIC.filter((c) => c.pass).length} of {CONDITION_RUBRIC.length} points
                    passed on the public rubric behind this grade.
                  </p>
                  <button
                    type="button"
                    aria-expanded={rubricOpen}
                    aria-controls="condition-rubric-list"
                    onClick={() => setRubricOpen((v) => !v)}
                    className={`mt-4 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-950 transition-colors hover:border-[#0369A1]/60 ${FOCUS}`}
                  >
                    {rubricOpen ? "Hide" : "View"} full rubric
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${rubricOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {rubricOpen && (
                      <motion.ul
                        id="condition-rubric-list"
                        initial={reduce ? false : { opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                        transition={{ duration: reduce ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4"
                      >
                        {CONDITION_RUBRIC.map((point) => (
                          <li key={point.label} className="flex items-start gap-2">
                            {point.pass ? (
                              <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#0369A1]" aria-hidden="true" />
                            ) : (
                              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
                            )}
                            <span className="text-[13px] font-normal leading-[1.5] text-slate-600">
                              <span className="text-slate-950">{point.label}</span>
                              {point.note && <span className="block text-slate-600">{point.note}</span>}
                            </span>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                  <p className="mt-4 border-t border-slate-200 pt-4 text-[13px] font-normal leading-[1.6] text-slate-600" aria-live="polite">
                    List <span className="tabular-nums line-through">{money(LIST_PRICE)}</span> &rarr;{" "}
                    <span className="font-semibold tabular-nums text-[#0369A1]">{money(finalPrice)}</span> right
                    now &mdash; adjust the bridge above and this updates too.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- BRIDGE EXPLAINED */}
        <section id="bridge" className="border-b border-slate-200 px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <div className="flex items-end gap-5">
                <SectionNumber n="03" />
                <div>
                  <p className={EYEBROW}>THE BRIDGE, EXPLAINED</p>
                  <h2
                    className="mt-3 max-w-[720px] text-[clamp(1.6rem,4vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.01em] text-slate-950"
                    style={DISPLAY}
                  >
                    Six factors. Any combination. Real arithmetic.
                  </h2>
                </div>
              </div>
              <p className="mt-5 max-w-[479px] text-[16px] font-normal leading-[1.6] text-slate-600">
                Every factor carries a fixed dollar amount. Switch one off and the running total,
                and every bar after it, recomputes from scratch &mdash; nothing here is a
                placeholder that just fades in and out.
              </p>
            </Reveal>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {statCards.map((card, i) => (
                <Reveal key={card.idx} delay={i * 0.06}>
                  <div className="h-full rounded-2xl border border-slate-200 bg-white p-6">
                    <span aria-hidden="true" className="select-none text-[1.75rem] font-semibold leading-none tracking-[0.12em] text-slate-500" style={NUMERIC}>
                      {card.idx}
                    </span>
                    <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.01em] text-slate-950">{card.title}</h3>
                    <p
                      className="mt-3 text-[clamp(1.3rem,2.6vw,1.7rem)] font-semibold leading-tight tracking-[-0.01em] tabular-nums text-[#0369A1]"
                      style={NUMERIC}
                    >
                      {card.value}
                    </p>
                    <p className="mt-4 max-w-[419px] text-[14px] font-normal leading-[1.6] text-slate-600">{card.copy}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- SOCIAL PROOF */}
        <section id="sellers" className="border-b border-slate-200 bg-slate-50 px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <p className={EYEBROW}>SELLERS</p>
              <h2
                className="mt-4 max-w-[720px] text-[clamp(1.6rem,3.8vw,2.4rem)] font-extrabold leading-[1.08] tracking-[-0.01em] text-slate-950"
                style={DISPLAY}
              >
                They let buyers see the bridge, not just the badge.
              </h2>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
              <ul className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-8">
                {TESTIMONIALS.map((t, i) => (
                  <motion.li
                    key={t.name}
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={reduce ? undefined : { y: -4 }}
                    viewport={{ once: true, amount: 0, margin: "220px 0px 220px 0px" }}
                    transition={{ duration: 0.45, delay: reduce ? 0 : i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <Quote className="h-5 w-5 text-[#0369A1]" aria-hidden="true" />
                    <p className="mt-3 max-w-[280px] text-[14px] font-normal leading-[1.6] text-slate-700">{t.quote}</p>
                    <div role="img" aria-label={`Rated ${t.rating} out of 5`} className="mt-4 flex items-center gap-1">
                      {STAR_POSITIONS.map((s) => (
                        <Star
                          key={s}
                          aria-hidden="true"
                          className={`h-3.5 w-3.5 ${s < t.rating ? "fill-[#0369A1] text-[#0369A1]" : "text-slate-300"}`}
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-[13px] font-semibold text-slate-950">{t.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[12px] font-normal text-slate-600">
                      <BadgeCheck className="h-3 w-3 shrink-0 text-[#0369A1]" aria-hidden="true" />
                      {t.context}
                    </p>
                  </motion.li>
                ))}
              </ul>

              <Reveal className="min-w-0 lg:col-span-4">
                <dl className="flex flex-col gap-6">
                  {TRUST_STATS.map((stat) => (
                    <div key={stat.label}>
                      <dt className={STAT_LABEL}>{stat.label}</dt>
                      <dd
                        className="mt-1 text-[clamp(1.6rem,3.2vw,2rem)] font-semibold tabular-nums tracking-[-0.01em] text-slate-950"
                        style={NUMERIC}
                      >
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- CLOSING CTA */}
        <section id="start" className="px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <p className={EYEBROW}>WHAT YOUR BRIDGE SAYS RIGHT NOW</p>
              <h2
                className="mt-5 max-w-[860px] text-[clamp(1.8rem,5.6vw,3.1rem)] font-extrabold leading-[1.06] tracking-[-0.01em] text-slate-950"
                style={DISPLAY}
              >
                Sell at the price you can actually see arrive.
              </h2>
              <p className="mt-6 max-w-[479px] text-[16px] font-normal leading-[1.6] text-slate-600" aria-live="polite">
                Right now: {steps.length} of {FACTORS.length} adjustments are active, taking the{" "}
                <span className="font-semibold tabular-nums text-slate-950">{money(LIST_PRICE)}</span> list
                price to a{" "}
                <span className="font-semibold tabular-nums text-[#0369A1]">{money(finalPrice)}</span> price
                for you &mdash; {offLabel}. Toggle a factor above and this line moves with it.
              </p>

              <form onSubmit={handleSubmit} className="mt-9 max-w-[420px]" noValidate>
                <label htmlFor="notify-email" className="block text-[12px] font-semibold text-slate-700">
                  Get your own price bridge by email
                </label>
                <div className="mt-2 flex flex-wrap gap-3 sm:flex-nowrap">
                  <div className="relative min-w-0 flex-1">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                    <input
                      id="notify-email"
                      type="email"
                      inputMode="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailState !== "idle") setEmailState("idle");
                      }}
                      placeholder="you@example.com"
                      aria-invalid={emailState === "error"}
                      aria-describedby="notify-email-msg"
                      className={`w-full min-w-0 rounded-full border border-slate-200 bg-white py-3 pl-10 pr-4 text-[14px] font-normal text-slate-950 placeholder:text-slate-500 ${FOCUS}`}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#0369A1] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#075985] ${FOCUS}`}
                  >
                    Send my bridge
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <p id="notify-email-msg" className="mt-2 flex items-center gap-1.5 text-[12px] font-normal text-slate-600" aria-live="polite">
                  {emailState === "ok" && (
                    <>
                      <CircleCheck className="h-3.5 w-3.5 shrink-0 text-[#0369A1]" aria-hidden="true" />
                      Sent &mdash; we mailed today&rsquo;s bridge for {ITEM.name} to your inbox.
                    </>
                  )}
                  {emailState === "error" && (
                    <>
                      <CircleAlert className="h-3.5 w-3.5 shrink-0 text-slate-950" aria-hidden="true" />
                      Enter a full email address, like you@example.com.
                    </>
                  )}
                  {emailState === "idle" && "No account needed. We only email you once."}
                </p>
              </form>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-6">
          <span className="text-[13px] font-semibold tracking-[-0.01em] text-slate-950">repick</span>
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="#listing" className={`px-1 py-2 text-[13px] font-normal text-slate-600 transition-colors hover:text-slate-950 ${FOCUS}`}>
              The listing
            </a>
            <a href="#bridge" className={`px-1 py-2 text-[13px] font-normal text-slate-600 transition-colors hover:text-slate-950 ${FOCUS}`}>
              The bridge
            </a>
            <a href="#sellers" className={`px-1 py-2 text-[13px] font-normal text-slate-600 transition-colors hover:text-slate-950 ${FOCUS}`}>
              Sellers
            </a>
          </nav>
          <span className={CAPTION}>TRANSPARENT AI PRICING</span>
        </div>
      </footer>
    </div>
  );
}
