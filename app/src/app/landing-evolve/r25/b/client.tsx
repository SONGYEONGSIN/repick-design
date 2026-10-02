"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Eye,
  Hash,
  History,
  Percent,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import ConfidenceRing from "./ring";
import {
  DEFAULT_ACTIVE,
  HERO_ITEM,
  METHODS,
  PREVIEW_LISTINGS,
  TESTIMONIALS,
  TRUST_STATS,
  confidenceOf,
  discountPct,
  money,
  nextBest,
  strongestActive,
  type MethodId,
} from "./data";

// ACCENT — sky. Contrast computed against this route's white (#FFFFFF) and near-ink (#131316)
// bases; full arithmetic and the light-theme "darker tint = higher contrast" adaptation are in
// candidates/b.md.
//   #0284C7 (raw accent) — large text (>=24px/19px bold), borders, the ring's active arc fill.
//     vs white bg: 4.09:1 (clears the 3:1 large-text/non-text floor, not full small-text AA).
//   #0369A1 (accent-strong) — small text, icons, focus rings, and any accent-filled surface that
//     carries text (buttons/chips use this, with white text on top, never the raw #0284C7).
//     vs white bg: 5.93:1. White text on this fill: 5.93:1 (passes 4.5:1 AA).
//   #131316 (ink) vs white: 18.54:1. #52525B (muted body/caption) vs white: 7.74:1, vs the
//   #F5F5F4 tint section bg: 7.10:1 — one muted token, safe on both backgrounds, so hierarchy
//   comes from size/weight/tracking rather than a second, riskier grey. #71717A is used only for
//   large (>=32px) decorative ghost numbers, where the 3:1 floor applies (4.83:1 on white /
//   4.43:1 on tint — both clear it).
const GHOST = "#71717A";
const ACCENT = "#0284C7";
const TRACK = "#E4E4E7";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369A1]";
const EYEBROW = "text-[11px] font-semibold tracking-[0.28em] text-[#0369A1]";
const CAPTION = "text-[11px] font-normal tracking-[0.16em] text-[#52525B]";
const STAT_LABEL = "text-[10px] font-semibold tracking-[0.12em] text-[#52525B]";
const STAR_POSITIONS = [0, 1, 2, 3, 4];
const SKIP_LINK =
  "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-[#131316] focus-visible:px-4 focus-visible:py-2 focus-visible:text-[13px] focus-visible:font-semibold focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369A1]";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const METHOD_ICON: Record<MethodId, LucideIcon> = {
  visual: Eye,
  serial: Hash,
  expert: UserCheck,
  provenance: History,
};

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0, margin: "200px 0px 200px 0px" }}
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
      className="select-none text-[clamp(2rem,3.2vw,2.5rem)] font-extrabold leading-[0.9] tracking-[0.12em]"
      style={{ fontFamily: "var(--font-display-grotesk)", color: GHOST }}
    >
      {n}
    </span>
  );
}

export default function ConfidenceRingLanding() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<Set<MethodId>>(new Set(DEFAULT_ACTIVE));
  const [hoveredMethod, setHoveredMethod] = useState<MethodId | null>(null);
  const [openListings, setOpenListings] = useState<Set<string>>(new Set());
  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState<"idle" | "ok" | "error">("idle");

  const confidence = useMemo(() => confidenceOf(active), [active]);
  const activeCount = active.size;
  const inactiveMethods = useMemo(
    () => METHODS.filter((m) => !active.has(m.id)),
    [active],
  );
  const next = useMemo(() => nextBest(active), [active]);
  const strongest = useMemo(() => strongestActive(active), [active]);
  const previewMethod = hoveredMethod ? METHODS.find((m) => m.id === hoveredMethod) ?? null : null;
  const discount = discountPct(HERO_ITEM.askPrice, HERO_ITEM.marketValue);

  function toggleMethod(id: MethodId) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearHover(id: MethodId) {
    setHoveredMethod((h) => (h === id ? null : h));
  }

  function toggleListing(id: string) {
    setOpenListings((prev) => {
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

  return (
    <div className="min-h-dvh overflow-x-clip bg-white font-normal text-[#131316] antialiased">
      <a href="#main" className={SKIP_LINK}>
        Skip to main content
      </a>

      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-6">
          <span className="flex items-center gap-2 text-[15px] font-extrabold tracking-[-0.02em]">
            <span className="h-2 w-2 rounded-full bg-[#0369A1]" aria-hidden="true" />
            repick
          </span>
          <nav aria-label="Sections" className="hidden items-center gap-6 sm:flex">
            <a
              href="#preview"
              className={`px-1 py-2 text-[13px] font-normal text-[#52525B] transition-colors hover:text-[#131316] ${FOCUS}`}
            >
              Verified gear
            </a>
            <a
              href="#ring"
              className={`px-1 py-2 text-[13px] font-normal text-[#52525B] transition-colors hover:text-[#131316] ${FOCUS}`}
            >
              The ring
            </a>
            <a
              href="#proof"
              className={`px-1 py-2 text-[13px] font-normal text-[#52525B] transition-colors hover:text-[#131316] ${FOCUS}`}
            >
              Sellers
            </a>
          </nav>
          <a
            href="#preview"
            className={`rounded-full bg-[#0369A1] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#075985] ${FOCUS}`}
          >
            Browse verified gear
          </a>
        </div>
      </header>

      <main id="main">
        {/* ---------------------------------------------------------------- HERO */}
        <section className="border-b border-zinc-200 px-5 pt-12 pb-12 sm:px-8 lg:px-12 lg:pt-16 lg:pb-16">
          <div className="mx-auto w-full max-w-[1240px]">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10">
              {/* Text + product proof — kept in DOM before the ring so the h1 reads first for
                  assistive tech, visually placed left on desktop per the asymmetric hero rule. */}
              <motion.div className="min-w-0 lg:col-span-7" {...heroIn}>
                <p className={EYEBROW}>THE CONFIDENCE RING</p>
                <h1
                  className="mt-5 text-[clamp(2.1rem,5.8vw,3.4rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
                  style={{ fontFamily: "var(--font-display-grotesk)" }}
                >
                  How sure should you be
                  <span className="block text-[#0369A1]">before you buy secondhand gear?</span>
                </h1>
                <p className="mt-6 max-w-[490px] text-[16px] font-normal leading-[1.6] text-[#52525B]">
                  Every repick listing carries a confidence ring built from four independent
                  checks. Switch any of them off and watch the number move &mdash; nothing is
                  claimed here that isn&rsquo;t shown.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <a
                    href="#preview"
                    className={`inline-flex items-center gap-2 rounded-full bg-[#0369A1] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#075985] ${FOCUS}`}
                  >
                    Browse verified gear
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <span className={STAT_LABEL}>{TRUST_STATS[0].value} VERIFIED LISTINGS</span>
                </div>

                {/* Product + proof — inside the hero component itself, not a section below it. */}
                <div className="mt-6 flex items-center gap-4 rounded-2xl border border-zinc-200 bg-[#F5F5F4] p-4">
                  <div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-200 sm:w-24">
                    <Image
                      src={`https://images.unsplash.com/photo-${HERO_ITEM.photoId}?q=80&w=300&auto=format&fit=crop`}
                      alt={HERO_ITEM.alt}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={STAT_LABEL}>{HERO_ITEM.category.toUpperCase()}</p>
                    <h2 className="mt-0.5 truncate text-[15px] font-extrabold tracking-[-0.01em]">
                      {HERO_ITEM.name}
                    </h2>
                    <p className="mt-0.5 truncate text-[12px] font-normal text-[#52525B]">
                      {HERO_ITEM.detail}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#0369A1]/40 bg-white px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[#0369A1]">
                        <CircleCheck className="h-3 w-3" aria-hidden="true" />
                        {HERO_ITEM.match}% match
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-zinc-300 bg-white px-2 py-0.5 text-[11px] font-semibold text-[#131316]">
                        Grade {HERO_ITEM.conditionGrade}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-zinc-300 bg-white px-2 py-0.5 text-[11px] font-semibold text-[#131316]">
                        <ShieldCheck className="h-3 w-3 text-[#0369A1]" aria-hidden="true" />
                        Verified
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 tabular-nums">
                      <span className="text-[12px] font-normal text-[#52525B] line-through">
                        {money(HERO_ITEM.marketValue)}
                      </span>
                      <span
                        className="text-[17px] font-extrabold tracking-[-0.01em]"
                        style={{ fontFamily: "var(--font-display-grotesk)" }}
                      >
                        {money(HERO_ITEM.askPrice)}
                      </span>
                      <span className="rounded-full bg-[#0369A1] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-white">
                        {discount}% off
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Ring device — the hero's dominant, interactive centerpiece. */}
              <motion.div className="min-w-0 lg:col-span-5" {...heroIn}>
                <div className="rounded-2xl border border-zinc-200 bg-[#F5F5F4] p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className={STAT_LABEL}>VERIFICATION METHODS</p>
                    <span className="text-[11px] font-semibold tabular-nums text-[#0369A1]">
                      {activeCount} / {METHODS.length} included
                    </span>
                  </div>

                  <div
                    role="group"
                    aria-label="Verification methods included in this ring"
                    className="mt-3 flex flex-wrap items-center gap-2"
                  >
                    {METHODS.map((method) => {
                      const Icon = METHOD_ICON[method.id];
                      const on = active.has(method.id);
                      return (
                        <button
                          key={method.id}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggleMethod(method.id)}
                          onMouseEnter={() => setHoveredMethod(method.id)}
                          onFocus={() => setHoveredMethod(method.id)}
                          onMouseLeave={() => clearHover(method.id)}
                          onBlur={() => clearHover(method.id)}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[12px] font-semibold transition-colors ${FOCUS} ${
                            on
                              ? "border-[#0369A1] bg-[#0369A1] text-white"
                              : "border-zinc-300 bg-white text-[#131316] hover:border-[#0369A1]/50 hover:bg-zinc-50"
                          }`}
                        >
                          <Icon
                            className="h-3 w-3 shrink-0"
                            style={{ color: on ? "#ffffff" : "#0369A1" }}
                            aria-hidden="true"
                          />
                          {method.short}
                          <span
                            className="tabular-nums"
                            style={{ color: on ? "rgba(255,255,255,0.85)" : "#52525B" }}
                          >
                            +{method.weight}%
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative mx-auto mt-6 aspect-square w-full max-w-[272px]">
                    <ConfidenceRing methods={METHODS} active={active} accent={ACCENT} track={TRACK} />
                    <div
                      aria-live="polite"
                      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
                    >
                      <p className="text-[10px] font-semibold tracking-[0.16em] text-[#0369A1]">
                        CONFIDENCE
                      </p>
                      <p
                        className="mt-1 text-[clamp(2.3rem,7.4vw,3.1rem)] font-extrabold leading-none tabular-nums tracking-[-0.01em]"
                        style={{ fontFamily: "var(--font-display-grotesk)" }}
                      >
                        {confidence}%
                      </p>
                      <p className="mt-1 text-[11px] font-normal text-[#52525B]">
                        {activeCount} of {METHODS.length} checks
                      </p>
                    </div>
                  </div>

                  <p className={`mt-5 text-center ${CAPTION}`} aria-live="polite">
                    {previewMethod
                      ? `${previewMethod.label.toUpperCase()} — ${previewMethod.description}`
                      : `Fig. 01 — ${activeCount} of ${METHODS.length} methods included, ${confidence}% authentication confidence.`}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- PRODUCT PREVIEW */}
        <section id="preview" className="border-b border-zinc-200 bg-[#F5F5F4] px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <div className="flex items-end gap-5">
                <SectionNumber n="02" />
                <div>
                  <p className={EYEBROW}>VERIFIED GEAR</p>
                  <h2
                    className="mt-3 max-w-[720px] text-[clamp(1.6rem,4vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em]"
                    style={{ fontFamily: "var(--font-display-grotesk)" }}
                  >
                    Every check leaves a trace in the price.
                  </h2>
                </div>
              </div>
              <p className="mt-5 max-w-[490px] text-[16px] font-normal leading-[1.6] text-[#52525B]">
                Each listing runs its own subset of the four methods. Open the breakdown on
                any card to see exactly which ones cleared it &mdash; and which didn&rsquo;t run.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {PREVIEW_LISTINGS.map((listing, i) => {
                const listingDiscount = discountPct(listing.askPrice, listing.marketValue);
                const open = openListings.has(listing.id);
                const usedCount = listing.methodsUsed.length;
                return (
                  <Reveal key={listing.id} delay={i * 0.06} className="h-full">
                    <div className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-4">
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-200">
                        <Image
                          src={`https://images.unsplash.com/photo-${listing.photoId}?q=80&w=640&auto=format&fit=crop`}
                          alt={listing.alt}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover"
                        />
                      </div>

                      {/* Badges live in their own row below the image frame, never overlaid on
                          top of the <img> — so failed-load alt text never collides with them. */}
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#0369A1]/40 bg-[#F5F5F4] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[#0369A1]">
                          <CircleCheck className="h-3 w-3" aria-hidden="true" />
                          {listing.match}% match
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-300 px-2 py-0.5 text-[11px] font-semibold text-[#131316]">
                          Grade {listing.grade}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-300 px-2 py-0.5 text-[11px] font-semibold text-[#131316]">
                          <ShieldCheck className="h-3 w-3 text-[#0369A1]" aria-hidden="true" />
                          {usedCount}/{METHODS.length} checks
                        </span>
                      </div>

                      <h3 className="mt-3 text-[15px] font-extrabold tracking-[-0.01em]">
                        {listing.name}
                      </h3>
                      <p className="mt-0.5 text-[12px] font-normal text-[#52525B]">{listing.detail}</p>

                      <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 tabular-nums">
                        <span className="text-[12px] font-normal text-[#52525B] line-through">
                          {money(listing.marketValue)}
                        </span>
                        <span
                          className="text-[16px] font-extrabold tracking-[-0.01em]"
                          style={{ fontFamily: "var(--font-display-grotesk)" }}
                        >
                          {money(listing.askPrice)}
                        </span>
                        <span className="rounded-full bg-[#0369A1] px-2 py-0.5 text-[11px] font-semibold text-white">
                          {listingDiscount}% off
                        </span>
                      </div>

                      <ul className="mt-3 flex flex-col gap-1.5">
                        {listing.tags.slice(0, 2).map((tag) => (
                          <li
                            key={tag}
                            className="flex items-start gap-1.5 text-[12px] font-normal leading-[1.5] text-[#52525B]"
                          >
                            <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-[#0369A1]" aria-hidden="true" />
                            {tag}
                          </li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={`breakdown-${listing.id}`}
                        onClick={() => toggleListing(listing.id)}
                        className={`mt-4 inline-flex items-center gap-1.5 self-start rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-[12px] font-semibold text-[#131316] transition-colors hover:border-[#0369A1]/60 ${FOCUS}`}
                      >
                        {open ? "Hide" : "View"} verification breakdown
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                          aria-hidden="true"
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.ul
                            id={`breakdown-${listing.id}`}
                            initial={reduce ? false : { opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                            transition={{ duration: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
                            className="mt-3 flex flex-col gap-2 border-t border-zinc-200 pt-3"
                          >
                            {METHODS.map((method) => {
                              const ran = listing.methodsUsed.includes(method.id);
                              return (
                                <li key={method.id} className="flex items-start gap-2">
                                  {ran ? (
                                    <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#0369A1]" aria-hidden="true" />
                                  ) : (
                                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#71717A]" aria-hidden="true" />
                                  )}
                                  <span className="text-[12px] font-normal leading-[1.5] text-[#52525B]">
                                    <span className="font-semibold text-[#131316]">{method.label}</span>
                                    {ran ? " — ran on this listing" : " — not run on this listing"}
                                  </span>
                                </li>
                              );
                            })}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- THE RING */}
        <section id="ring" className="border-b border-zinc-200 px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <div className="flex items-end gap-5">
                <SectionNumber n="03" />
                <div>
                  <p className={EYEBROW}>WHAT THE RING IS DOING</p>
                  <h2
                    className="mt-3 max-w-[720px] text-[clamp(1.6rem,4vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em]"
                    style={{ fontFamily: "var(--font-display-grotesk)" }}
                  >
                    Four fixed segments, recomputed the instant you toggle.
                  </h2>
                </div>
              </div>
              <p className="mt-5 max-w-[490px] text-[16px] font-normal leading-[1.6] text-[#52525B]">
                Each method owns a fixed slice of the circle. Switch one off and its slice
                turns gray &mdash; nothing else moves, because nothing else is being guessed at.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
              <Reveal>
                <div className="h-full rounded-2xl border border-zinc-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <span
                      aria-hidden="true"
                      className="select-none text-[1.75rem] font-extrabold leading-none tracking-[0.12em]"
                      style={{ fontFamily: "var(--font-display-grotesk)", color: GHOST }}
                    >
                      01
                    </span>
                    <Percent className="h-4 w-4 text-[#0369A1]" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-[15px] font-extrabold tracking-[-0.01em]">Methods included</h3>
                  <p
                    className="mt-3 text-[clamp(1.4rem,3vw,1.8rem)] font-extrabold leading-tight tabular-nums tracking-[-0.01em]"
                    style={{ fontFamily: "var(--font-display-grotesk)" }}
                  >
                    {activeCount} / {METHODS.length}
                  </p>
                  <p className="mt-4 max-w-[300px] text-[14px] font-normal leading-[1.6] text-[#52525B]">
                    {activeCount === 0
                      ? "No method is switched on yet — the ring is entirely track color."
                      : `Currently on: ${METHODS.filter((m) => active.has(m.id)).map((m) => m.short).join(", ")}.`}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.06}>
                <div className="h-full rounded-2xl border border-zinc-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <span
                      aria-hidden="true"
                      className="select-none text-[1.75rem] font-extrabold leading-none tracking-[0.12em]"
                      style={{ fontFamily: "var(--font-display-grotesk)", color: GHOST }}
                    >
                      02
                    </span>
                    <ShieldCheck className="h-4 w-4 text-[#0369A1]" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-[15px] font-extrabold tracking-[-0.01em]">Confidence now</h3>
                  <p
                    className="mt-3 text-[clamp(1.4rem,3vw,1.8rem)] font-extrabold leading-tight tabular-nums tracking-[-0.01em]"
                    style={{ fontFamily: "var(--font-display-grotesk)" }}
                  >
                    {confidence}%
                  </p>
                  <p className="mt-4 max-w-[300px] text-[14px] font-normal leading-[1.6] text-[#52525B]">
                    {strongest
                      ? `Its biggest single contributor right now is ${strongest.label.toLowerCase()}, at ${strongest.weight} points.`
                      : "No method active — the center reads zero until you switch one on."}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="h-full rounded-2xl border border-zinc-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <span
                      aria-hidden="true"
                      className="select-none text-[1.75rem] font-extrabold leading-none tracking-[0.12em]"
                      style={{ fontFamily: "var(--font-display-grotesk)", color: GHOST }}
                    >
                      03
                    </span>
                    {next ? (
                      <ArrowUpRight className="h-4 w-4 text-[#0369A1]" aria-hidden="true" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-[#0369A1]" aria-hidden="true" />
                    )}
                  </div>
                  <h3 className="mt-5 text-[15px] font-extrabold tracking-[-0.01em]">Next biggest lift</h3>
                  <p
                    className="mt-3 text-[clamp(1.4rem,3vw,1.8rem)] font-extrabold leading-tight tabular-nums tracking-[-0.01em]"
                    style={{ fontFamily: "var(--font-display-grotesk)" }}
                  >
                    {next ? `+${next.weight}%` : "Fully verified"}
                  </p>
                  <p className="mt-4 max-w-[300px] text-[14px] font-normal leading-[1.6] text-[#52525B]">
                    {next
                      ? `Switching on "${next.label}" would take confidence to ${confidence + next.weight}%.`
                      : "Every method is already on — this is the highest confidence the ring can show."}
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.1} className="mt-10">
              <div className="rounded-2xl border border-zinc-200 bg-[#F5F5F4] p-5 sm:p-6">
                <p className={STAT_LABEL}>METHOD BY METHOD</p>
                <ol className="mt-3 flex flex-col gap-2">
                  {METHODS.map((method, i) => {
                    const on = active.has(method.id);
                    const Icon = METHOD_ICON[method.id];
                    return (
                      <li
                        key={method.id}
                        className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 sm:flex-nowrap"
                      >
                        <span
                          aria-hidden="true"
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums"
                          style={{
                            background: on ? "#0369A1" : "transparent",
                            border: on ? "none" : "1px solid #D4D4D8",
                            color: on ? "#ffffff" : "#71717A",
                          }}
                        >
                          {i + 1}
                        </span>
                        <Icon className="h-4 w-4 shrink-0 text-[#0369A1]" aria-hidden="true" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-semibold text-[#131316]">{method.label}</p>
                          <p className="mt-0.5 text-[12px] font-normal leading-[1.5] text-[#52525B]">
                            {on
                              ? `Included — contributing ${method.weight} of your ${confidence}%.`
                              : `Not included — would add ${method.weight}%, bringing you to ${confidence + method.weight}%.`}
                          </p>
                        </div>
                        <span
                          className="inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em]"
                          style={{
                            borderColor: on ? "rgba(3,105,161,0.4)" : "#D4D4D8",
                            color: on ? "#0369A1" : "#71717A",
                          }}
                        >
                          {on ? (
                            <CircleCheck className="h-3 w-3" aria-hidden="true" />
                          ) : (
                            <CircleAlert className="h-3 w-3" aria-hidden="true" />
                          )}
                          {on ? "ACTIVE" : "OFF"}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </Reveal>
          </div>
        </section>

        {/* -------------------------------------------------------------- SOCIAL PROOF */}
        <section id="proof" className="border-b border-zinc-200 bg-[#F5F5F4] px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <p className={EYEBROW}>SELLERS &amp; BUYERS</p>
              <h2
                className="mt-4 max-w-[720px] text-[clamp(1.6rem,3.8vw,2.4rem)] font-extrabold leading-[1.08] tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-display-grotesk)" }}
              >
                They watched the ring move too.
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
                    viewport={{ once: true, amount: 0, margin: "200px 0px 200px 0px" }}
                    transition={{ duration: 0.45, delay: reduce ? 0 : i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-2xl border border-zinc-200 bg-white p-5"
                  >
                    <Quote className="h-5 w-5 text-[#0369A1]" aria-hidden="true" />
                    <p className="mt-3 max-w-[280px] text-[14px] font-normal leading-[1.6] text-[#131316]">
                      {t.quote}
                    </p>
                    <div role="img" aria-label={`Rated ${t.rating} out of 5`} className="mt-4 flex items-center gap-1">
                      {STAR_POSITIONS.map((s) => (
                        <Star
                          key={s}
                          aria-hidden="true"
                          className={`h-3.5 w-3.5 ${s < t.rating ? "fill-[#0369A1] text-[#0369A1]" : "text-zinc-300"}`}
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-[13px] font-semibold text-[#131316]">{t.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[12px] font-normal text-[#52525B]">
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
                        className="mt-1 text-[clamp(1.6rem,3.2vw,2rem)] font-extrabold tabular-nums tracking-[-0.01em]"
                        style={{ fontFamily: "var(--font-display-grotesk)" }}
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

        {/* ---------------------------------------------------------------- CLOSING CTA */}
        <section id="start" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <p className={EYEBROW}>WHAT THE RING SAYS</p>
              <h2
                className="mt-5 max-w-[860px] text-[clamp(1.8rem,5.6vw,3.1rem)] font-extrabold leading-[1.06] tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-display-grotesk)" }}
              >
                This listing is sitting at {confidence}% right now.
              </h2>
              <p className="mt-6 max-w-[490px] text-[16px] font-normal leading-[1.6] text-[#52525B]" aria-live="polite">
                That number comes from {activeCount} of {METHODS.length} verification methods
                you&rsquo;ve switched on above
                {inactiveMethods.length > 0 && (
                  <>
                    {" "}
                    &mdash; add{" "}
                    <span className="font-semibold text-[#131316]">
                      {inactiveMethods.map((m) => m.label).join(", ")}
                    </span>{" "}
                    to raise it further
                  </>
                )}
                . It isn&rsquo;t fixed: it moves the moment you toggle a segment.
              </p>

              <form onSubmit={handleSubmit} className="mt-9 max-w-[420px]" noValidate>
                <label htmlFor="notify-email" className="block text-[12px] font-semibold text-[#52525B]">
                  Get notified when a listing clears every method
                </label>
                <div className="mt-2 flex flex-wrap gap-3 sm:flex-nowrap">
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
                    className={`min-w-0 flex-1 rounded-full border border-zinc-300 bg-white px-4 py-3 text-[14px] font-normal text-[#131316] placeholder:text-[#71717A] ${FOCUS}`}
                  />
                  <button
                    type="submit"
                    className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#0369A1] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#075985] ${FOCUS}`}
                  >
                    Notify me
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <p
                  id="notify-email-msg"
                  className="mt-2 flex items-center gap-1.5 text-[12px] font-normal text-[#52525B]"
                  aria-live="polite"
                >
                  {emailState === "ok" && (
                    <>
                      <CircleCheck className="h-3.5 w-3.5 shrink-0 text-[#0369A1]" aria-hidden="true" />
                      You&rsquo;re on the list &mdash; we&rsquo;ll email you the moment one clears.
                    </>
                  )}
                  {emailState === "error" && (
                    <>
                      <CircleAlert className="h-3.5 w-3.5 shrink-0 text-[#B91C1C]" aria-hidden="true" />
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

      <footer className="border-t border-zinc-200 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-6">
          <span className="text-[13px] font-semibold tracking-[-0.01em]">repick</span>
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="#preview" className={`px-1 py-2 text-[13px] font-normal text-[#52525B] transition-colors hover:text-[#131316] ${FOCUS}`}>
              Verified gear
            </a>
            <a href="#ring" className={`px-1 py-2 text-[13px] font-normal text-[#52525B] transition-colors hover:text-[#131316] ${FOCUS}`}>
              The ring
            </a>
            <a href="#proof" className={`px-1 py-2 text-[13px] font-normal text-[#52525B] transition-colors hover:text-[#131316] ${FOCUS}`}>
              Sellers
            </a>
          </nav>
          <span className={CAPTION}>VERIFIED BEFORE IT SHIPS</span>
        </div>
      </footer>
    </div>
  );
}
