"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Handshake,
  Quote,
  ShieldCheck,
  Sparkles,
  Tag,
} from "lucide-react";
import {
  BASE_PRICE,
  MILESTONE_DEFS,
  PRODUCTS,
  STAGES,
  STAGE_ANCHORS,
  STATS,
  TESTIMONIALS,
  TICKER_ITEMS,
  type MilestoneKey,
} from "./data";

// ---------------------------------------------------------------------------
// Design tokens for this candidate. Picked deliberately away from violet/amber
// (the two most overrepresented catalogue accents) — see candidates/b.md for
// the full contrast arithmetic behind these exact hex values.
// ---------------------------------------------------------------------------
const INK = "#0B0B0F"; // page background / dark ink
const ACCENT = "#05DF72"; // full-saturation signal green — borders, fills, large text
const ACCENT_TINT = "#8CF0BE"; // lightened tint — small text, icons, focus rings
const MUTED = "#A1A1AA"; // reference muted foreground

const MILESTONE_ICONS: Record<MilestoneKey, typeof Tag> = {
  listed: Tag,
  graded: Sparkles,
  accepted: Handshake,
  shipped: ShieldCheck,
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Pure function of the scrubber position (0-100) into every derived surface. */
function deriveFromProgress(progress: number) {
  let idx = 0;
  for (let i = STAGE_ANCHORS.length - 1; i >= 0; i -= 1) {
    if (progress >= STAGE_ANCHORS[i]) {
      idx = i;
      break;
    }
  }
  const nextIdx = Math.min(idx + 1, STAGES.length - 1);
  const segStart = STAGE_ANCHORS[idx];
  const segEnd = STAGE_ANCHORS[nextIdx];
  const t = segEnd > segStart ? (progress - segStart) / (segEnd - segStart) : 0;
  const price = Math.round(lerp(STAGES[idx].price, STAGES[nextIdx].price, t));
  const discountPct = Math.round(((BASE_PRICE - price) / BASE_PRICE) * 100);
  const saved = BASE_PRICE - price;
  return {
    stageIndex: idx,
    stage: STAGES[idx],
    price,
    discountPct,
    saved,
  };
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
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
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

function StatusChip({ stageIndex }: { stageIndex: number }) {
  const stage = STAGES[stageIndex];
  const isFinal = stageIndex === STAGES.length - 1;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.12em] ${
        isFinal
          ? "border-transparent"
          : "border-white/15 bg-white/[0.04] text-zinc-100"
      }`}
      style={isFinal ? { background: ACCENT, color: INK } : undefined}
    >
      {isFinal ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> : null}
      {stage.label.toUpperCase()}
    </span>
  );
}

function Scrubber({
  progress,
  onChange,
}: {
  progress: number;
  onChange: (v: number) => void;
}) {
  const sliderId = useId();
  const derived = useMemo(() => deriveFromProgress(progress), [progress]);
  const trackBackground = `linear-gradient(to right, ${ACCENT} 0%, ${ACCENT} ${progress}%, rgba(255,255,255,0.12) ${progress}%, rgba(255,255,255,0.12) 100%)`;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label
          htmlFor={sliderId}
          className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400"
        >
          Drag through the sale
        </label>
        <span className="font-mono text-[11px] font-semibold tabular-nums text-zinc-400">
          {derived.stage.day}
        </span>
      </div>

      <input
        id={sliderId}
        type="range"
        min={0}
        max={100}
        step={1}
        value={progress}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`${derived.stage.label}, ${derived.stage.day}, ${derived.price} dollars`}
        style={{ background: trackBackground }}
        className="range-input mt-3 h-2 w-full cursor-pointer appearance-none rounded-full outline-offset-4 focus-visible:outline focus-visible:outline-2 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-[#0B0B0F] [&::-webkit-slider-thumb]:shadow-[0_0_0_3px_rgba(5,223,114,0.4)] [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-[#0B0B0F] [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-white/10"
      />
      <style>{`
        .range-input {
          outline-color: ${ACCENT_TINT};
        }
        .range-input::-webkit-slider-thumb {
          background: ${ACCENT};
        }
        .range-input::-moz-range-thumb {
          background: ${ACCENT};
        }
      `}</style>

      <div className="relative mt-3 h-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-400">
        {STAGES.map((stage, i) => {
          const anchor = STAGE_ANCHORS[i];
          const positional =
            i === 0
              ? { left: 0 }
              : i === STAGES.length - 1
                ? { right: 0 }
                : { left: `${anchor}%`, transform: "translateX(-50%)" };
          const reached = progress >= anchor;
          return (
            <span
              key={stage.id}
              style={positional}
              className={`absolute whitespace-nowrap ${reached ? "text-zinc-300" : "text-zinc-400"}`}
            >
              {stage.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function MilestoneChecklist({ stageIndex }: { stageIndex: number }) {
  const unlocked = new Set(STAGES[stageIndex].verified);
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-4">
      {MILESTONE_DEFS.map((m) => {
        const Icon = MILESTONE_ICONS[m.key];
        const done = unlocked.has(m.key);
        return (
          <li key={m.key} className="flex items-center gap-2 text-[13px]">
            <Icon
              className="h-4 w-4 shrink-0"
              style={{ color: done ? ACCENT_TINT : MUTED }}
              aria-hidden="true"
            />
            <span className={done ? "font-semibold text-zinc-100" : "text-zinc-400"}>
              {m.label}
              <span className="sr-only">{done ? " — complete" : " — not yet reached"}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function ProductCard({ product, index }: { product: (typeof PRODUCTS)[number]; index: number }) {
  const discountPct = Math.round(((product.before - product.after) / product.before) * 100);
  return (
    <Reveal delay={index * 0.08} className="min-w-0">
      <motion.article
        whileHover={{ y: -4 }}
        whileFocus={{ y: -4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
      >
        <div className="relative aspect-[4/5] w-full bg-zinc-800">
          <Image
            src={`https://images.unsplash.com/photo-${product.photoId}?auto=format&fit=crop&w=800&q=80`}
            alt={product.alt}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <h3 className="text-[15px] font-bold tracking-[-0.02em] text-white">{product.title}</h3>

          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1 text-[11px] font-semibold text-zinc-300">
            <Sparkles className="h-3 w-3" style={{ color: ACCENT_TINT }} aria-hidden="true" />
            {product.matchTag}
          </span>

          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/10 pt-3">
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-zinc-300">
              <BadgeCheck className="h-3.5 w-3.5" style={{ color: ACCENT_TINT }} aria-hidden="true" />
              Seller Verified
            </span>
            <span className="rounded border border-white/15 px-1.5 py-0.5 text-[11px] font-semibold text-zinc-300">
              Grade {product.grade}
            </span>
            <span className="text-[11px] font-semibold text-zinc-400">{product.matchPercent}% match</span>
          </div>

          <div className="flex items-baseline gap-2 font-mono tabular-nums">
            <span className="text-[13px] text-zinc-400 line-through">${product.before}</span>
            <span className="text-lg font-bold text-white">${product.after}</span>
            <span
              className="ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{ background: "rgba(5,223,114,0.16)", color: ACCENT_TINT }}
            >
              −{discountPct}%
            </span>
          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}

export default function Page() {
  const [progress, setProgress] = useState(100); // default: fully verified sale, proof-complete
  const derived = useMemo(() => deriveFromProgress(progress), [progress]);
  const reduceMotion = useReducedMotion();

  return (
    <div style={{ background: INK }} className="min-h-screen text-white">
      {/* Ticker strip -------------------------------------------------- */}
      <div className="ticker-wrap relative overflow-hidden border-b border-white/10 bg-black/40 py-2">
        <span className="sr-only">Live feed of recently verified sales on repick</span>
        <div
          className={`ticker-track flex w-max gap-10 whitespace-nowrap font-mono text-[11px] font-semibold tracking-[0.08em] text-zinc-400 ${reduceMotion ? "" : "ticker-animate"}`}
          aria-hidden="true"
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="tabular-nums">
              {item}
            </span>
          ))}
        </div>
        <style>{`
          .ticker-animate {
            animation: ticker-scroll 26s linear infinite;
          }
          .ticker-wrap:hover .ticker-animate,
          .ticker-wrap:focus-within .ticker-animate {
            animation-play-state: paused;
          }
          @keyframes ticker-scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </div>

      {/* Header ---------------------------------------------------------- */}
      <header className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 sm:px-10">
        <span className="text-[15px] font-bold tracking-[-0.02em] text-white">repick</span>
        <nav aria-label="Primary" className="hidden gap-8 text-[13px] font-semibold text-zinc-300 sm:flex">
          <a href="#how-it-works" className="rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4" style={{ outlineColor: ACCENT_TINT }}>
            How it works
          </a>
          <a href="#matches" className="rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4" style={{ outlineColor: ACCENT_TINT }}>
            Matches
          </a>
        </nav>
      </header>

      {/* Hero — headline + proof + scrubber, one component ---------------- */}
      <main>
        <section className="mx-auto max-w-[1400px] px-6 pb-16 pt-6 sm:px-10 md:pb-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left: headline + sub + CTA */}
            <div className="min-w-0 lg:col-span-6">
              <p
                className="text-[11px] font-semibold text-zinc-400"
                style={{ letterSpacing: "0.28em" }}
              >
                VERIFIED RESALE, PRICED BY EVIDENCE
              </p>

              <h1
                className="mt-5 font-bold tracking-[-0.02em] text-white"
                style={{
                  fontFamily: "var(--font-display-grotesk)",
                  fontSize: "clamp(2.5rem, 2rem + 3vw, 4.5rem)",
                  lineHeight: 1.02,
                }}
              >
                Scrub the sale.
                <br />
                <span style={{ color: ACCENT }}>Watch the price</span> prove itself.
              </h1>

              <p
                className="mt-6 font-normal leading-[1.6] text-zinc-300"
                style={{ maxWidth: "555px", fontSize: "18px" }}
              >
                repick&apos;s AI grades condition, matches offers against comparable
                sales, and locks every step behind independent verification. Drag
                the timeline on the right to watch one listing move from asking
                price to a closed, verified sale.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#cta"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold outline-offset-4 focus-visible:outline focus-visible:outline-2"
                  style={{ background: ACCENT, color: INK, outlineColor: ACCENT_TINT }}
                >
                  Start your AI valuation
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <span className="text-[13px] font-normal text-zinc-400">
                  No listing fee until it sells
                </span>
              </div>

              <dl className="mt-12 grid max-w-sm grid-cols-3 gap-6 border-t border-white/10 pt-6">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="font-mono text-xl font-bold tabular-nums text-white">{s.value}</dd>
                    <dd
                      className="mt-1 text-[10px] font-semibold text-zinc-400"
                      style={{ letterSpacing: "0.12em" }}
                    >
                      {s.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Right: the flagship listing proof card + scrubber — same hero block */}
            <div className="min-w-0 lg:col-span-6">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                      Flagship listing
                    </p>
                    <h2 className="mt-1 text-lg font-bold tracking-[-0.02em] text-white">
                      Sony a7 III — 24-70mm Kit
                    </h2>
                  </div>
                  <StatusChip stageIndex={derived.stageIndex} />
                </div>

                <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-800">
                  <Image
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80"
                    alt="Black mirrorless camera body with a zoom lens resting on a wooden surface"
                    fill
                    sizes="(min-width: 1024px) 620px, 90vw"
                    className="object-cover"
                    preload
                  />
                </div>

                {/* Proof row: AI match %, grade, verification, before/after — always visible */}
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-semibold text-zinc-300">
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" style={{ color: ACCENT_TINT }} aria-hidden="true" />
                    96% match to buyer intent
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    Grade{" "}
                    <span className="rounded border border-white/15 px-1.5 py-0.5">
                      {derived.stage.grade ?? "Pending"}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <BadgeCheck className="h-3.5 w-3.5" style={{ color: ACCENT_TINT }} aria-hidden="true" />
                    Seller Verified
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-2 font-mono tabular-nums">
                  <span className="text-[15px] text-zinc-400 line-through">${BASE_PRICE}</span>
                  <span className="text-2xl font-bold text-white">${derived.price}</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{ background: "rgba(5,223,114,0.16)", color: ACCENT_TINT }}
                  >
                    −{derived.discountPct}% vs. asking
                  </span>
                </div>

                <p className="mt-3 min-h-[3.2em] text-[13px] font-normal leading-[1.6] text-zinc-300">
                  {derived.stage.caption}
                </p>

                <div className="mt-5 border-t border-white/10 pt-5">
                  <Scrubber progress={progress} onChange={setProgress} />
                </div>

                <div className="mt-5">
                  <MilestoneChecklist stageIndex={derived.stageIndex} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Verification ledger — second surface reacting to the same scrubber */}
        <section id="how-it-works" className="border-t border-white/10 py-24">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
            <Reveal>
              <p className="text-[11px] font-semibold text-zinc-400" style={{ letterSpacing: "0.28em" }}>
                HOW THE PRICE WAS EARNED
              </p>
              <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
                As of{" "}
                <span style={{ color: ACCENT }}>{derived.stage.label}</span>
                {" · "}
                {derived.stage.day}, this listing sat at{" "}
                <span className="font-mono tabular-nums" style={{ color: ACCENT }}>
                  ${derived.price}
                </span>
                .
              </h2>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {STAGES.map((stage, i) => {
                const active = i === derived.stageIndex;
                const reached = i <= derived.stageIndex;
                const Icon = MILESTONE_ICONS[stage.id];
                return (
                  <Reveal key={stage.id} delay={i * 0.06} className="min-w-0">
                    <div
                      className="h-full rounded-2xl border p-5"
                      style={{
                        borderColor: active ? ACCENT : "rgba(255,255,255,0.1)",
                        background: active ? "rgba(5,223,114,0.08)" : "rgba(255,255,255,0.03)",
                      }}
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{ color: reached ? ACCENT_TINT : MUTED }}
                        aria-hidden="true"
                      />
                      <p className="mt-3 text-[13px] font-bold tracking-[-0.02em] text-white">
                        {stage.label}
                      </p>
                      <p className="mt-1 text-[11px] font-semibold text-zinc-400">{stage.day}</p>
                      <p className="mt-3 font-mono text-lg font-bold tabular-nums text-white">
                        ${stage.price}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Product preview cards ------------------------------------------ */}
        <section id="matches" className="border-t border-white/10 py-24">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
            <Reveal>
              <p className="text-[11px] font-semibold text-zinc-400" style={{ letterSpacing: "0.28em" }}>
                MORE AI MATCHES
              </p>
              <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
                Every listing carries the same paper trail.
              </h2>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PRODUCTS.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Social proof ----------------------------------------------------- */}
        <section className="border-t border-white/10 py-24">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={t.name} delay={i * 0.08} className="min-w-0">
                  <figure className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-7">
                    <Quote className="h-5 w-5" style={{ color: ACCENT }} aria-hidden="true" />
                    <blockquote
                      className="mt-4 font-normal leading-[1.6] text-zinc-200"
                      style={{ maxWidth: "500px", fontSize: "16px" }}
                    >
                      {t.quote}
                    </blockquote>
                    <figcaption className="mt-4 text-[13px] font-semibold text-zinc-400">
                      {t.name} <span className="font-normal text-zinc-400">— {t.role}</span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA — echoes the live derived state ---------------------- */}
        <section id="cta" className="border-t border-white/10 py-24">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
            <Reveal>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-14">
                <p className="text-[11px] font-semibold text-zinc-400" style={{ letterSpacing: "0.28em" }}>
                  YOUR NEXT SALE
                </p>
                <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
                  Sales like this one are closing around{" "}
                  <span className="font-mono tabular-nums" style={{ color: ACCENT }}>
                    ${derived.price}
                  </span>
                  , {derived.discountPct}% below asking.
                </h2>
                <p
                  className="mt-5 font-normal leading-[1.6] text-zinc-300"
                  style={{ maxWidth: "500px", fontSize: "16px" }}
                >
                  That number moves with the timeline above — drag it and this line
                  updates with it. Start a valuation and let repick&apos;s AI find
                  the fair number for what you own.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#cta"
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold outline-offset-4 focus-visible:outline focus-visible:outline-2"
                    style={{ background: ACCENT, color: INK, outlineColor: ACCENT_TINT }}
                  >
                    Start your AI valuation
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <span className="font-mono text-[13px] font-semibold tabular-nums text-zinc-400">
                    Saved so far: ${derived.saved}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <span className="text-[13px] font-bold tracking-[-0.02em] text-white">repick</span>
          <p className="text-[12px] font-normal text-zinc-400">
            Verified secondhand, matched by AI. © 2026 repick.
          </p>
        </div>
      </footer>
    </div>
  );
}
