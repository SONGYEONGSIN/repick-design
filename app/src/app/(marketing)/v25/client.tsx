"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  CircleAlert,
  CircleCheck,
  ClipboardCheck,
  Fingerprint,
  Quote,
  Scale,
  ShieldCheck,
  Star,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import ExplodedStack from "./exploded-stack";
import ConditionAccordion from "./condition-accordion";
import {
  AI_MATCH_TAGS,
  computePrice,
  computeTrust,
  discountPct,
  ITEM,
  LAYERS,
  money,
  TESTIMONIALS,
  TRUST_STATS,
  trustTier,
  type LayerId,
} from "./data";

const LAYER_ICON: Record<LayerId, LucideIcon> = {
  photos: Camera,
  inspection: ClipboardCheck,
  authenticity: Fingerprint,
  benchmark: Scale,
  seller: UserCheck,
};

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDA4AF]";
const EYEBROW = "text-[11px] font-semibold tracking-[0.28em] text-[#FDA4AF]";
const CAPTION = "text-[11px] font-normal tracking-[0.16em] text-zinc-400";
const STAT_LABEL = "text-[10px] font-semibold tracking-[0.12em] text-zinc-400";
const STAR_POSITIONS = [0, 1, 2, 3, 4];
const SKIP_LINK =
  "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-white focus-visible:px-4 focus-visible:py-2 focus-visible:text-[13px] focus-visible:font-semibold focus-visible:text-[#0B0B0F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDA4AF]";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      viewport={{ once: true, amount: 0, margin: "220px 0px 220px 0px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function InspectionStackLanding() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<Set<LayerId>>(new Set());
  const [previewId, setPreviewId] = useState<LayerId | null>(null);
  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState<"idle" | "ok" | "error">("idle");

  const trust = computeTrust(active);
  const price = computePrice(trust);
  const discount = discountPct(price);
  const tier = trustTier(trust);

  function toggleLayer(id: LayerId) {
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

  const valueCards = useMemo(
    () => [
      {
        idx: "01",
        title: "Trust Score",
        value: `${trust}/100`,
        copy: `${active.size} of ${LAYERS.length} layers on right now. Every one you add moves this number, not a hidden average.`,
      },
      {
        idx: "02",
        title: "Resale Price",
        value: money(price),
        copy: `The AI widens the price toward ${money(ITEM.ceilPrice)} as evidence stacks up, and holds near ${money(
          ITEM.floorPrice,
        )} when it can't.`,
      },
      {
        idx: "03",
        title: "Discount vs Retail",
        value: `${discount}%`,
        copy: `Off the ${money(ITEM.retail)} retail price. A fully audited listing still discounts — buyers just trust the number more.`,
      },
    ],
    [active.size, trust, price, discount],
  );

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#0B0B0F] font-normal text-white antialiased">
      <a href="#main" className={SKIP_LINK}>
        Skip to main content
      </a>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0B0F]/95 px-5 py-4 backdrop-blur sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-6">
          <span className="flex items-center gap-2 text-[15px] font-extrabold tracking-[-0.02em]">
            <span className="h-2 w-2 rounded-full bg-[#E11D48]" aria-hidden="true" />
            repick
          </span>
          <nav aria-label="Sections" className="hidden items-center gap-6 sm:flex">
            <a href="#preview" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              The listing
            </a>
            <a href="#value" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              What moves
            </a>
            <a href="#proof" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              Sellers
            </a>
          </nav>
          <a
            href="#start"
            className={`rounded-full bg-[#E11D48] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#BE123C] ${FOCUS}`}
          >
            List an item
          </a>
        </div>
      </header>

      <main id="main">
        {/* ---------------------------------------------------------------- HERO */}
        <section className="border-b border-white/10 px-5 pt-16 pb-16 sm:px-8 lg:px-12 lg:pt-20 lg:pb-24">
          <div className="mx-auto w-full max-w-[1240px]">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
              <motion.div className="min-w-0 lg:col-span-5" {...heroIn}>
                <p className={EYEBROW}>PROOF, LAYER BY LAYER</p>
                <h1
                  className="mt-5 text-[clamp(2.3rem,7vw,3.6rem)] font-extrabold leading-[1.02] tracking-[-0.02em]"
                  style={{ fontFamily: "var(--font-display-wide)" }}
                >
                  Stack the proof.
                  <span className="block">Watch the price catch up.</span>
                </h1>
                <p className="mt-6 max-w-[493px] text-[16px] font-normal leading-[1.6] text-zinc-400">
                  Repick&rsquo;s AI matches buyers to items in seconds, but trust isn&rsquo;t a
                  checkbox. Switch on any of the five inspection layers on this real listing, in
                  any order, and watch the trust score and resale price recompute in place.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#start"
                    className={`inline-flex items-center gap-2 rounded-full bg-[#E11D48] px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#BE123C] ${FOCUS}`}
                  >
                    List with full inspection
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <span className={STAT_LABEL}>NO LAYER IS REQUIRED TO LIST</span>
                </div>
              </motion.div>

              <motion.div className="min-w-0 lg:col-span-7" {...heroIn}>
                <ExplodedStack
                  active={active}
                  previewId={previewId}
                  onToggle={toggleLayer}
                  onPreviewStart={setPreviewId}
                  onPreviewEnd={() => setPreviewId(null)}
                  reduce={!!reduce}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- PRODUCT PREVIEW */}
        <section id="preview" className="border-b border-white/10 px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <div className="flex items-end gap-5">
                <span
                  aria-hidden="true"
                  className="select-none text-[clamp(2rem,3.2vw,2.5rem)] font-semibold leading-[0.9] tracking-[0.12em] text-[#6B6B78]"
                  style={{ fontFamily: "var(--font-display-wide)" }}
                >
                  02
                </span>
                <div>
                  <p className={EYEBROW}>THE LISTING</p>
                  <h2
                    className="mt-3 max-w-[720px] text-[clamp(1.7rem,4.2vw,2.7rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
                    style={{ fontFamily: "var(--font-display-wide)" }}
                  >
                    Everything a buyer sees, none of it painted over the photo.
                  </h2>
                </div>
              </div>
              <p className="mt-5 max-w-[493px] text-[16px] font-normal leading-[1.6] text-zinc-400">
                The AI match, the condition grade, and the seller badge all sit in their own row
                below the photo &mdash; so a slow connection never leaves a badge floating over a
                broken image.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
              <Reveal className="min-w-0 lg:col-span-7">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                  <p className={STAT_LABEL}>AI MATCH REASONING</p>
                  <ul className="mt-3 flex flex-col gap-2">
                    {AI_MATCH_TAGS.map((tag) => (
                      <li
                        key={tag}
                        className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-[13px] font-normal leading-[1.5] text-zinc-400"
                      >
                        <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#FDA4AF]" aria-hidden="true" />
                        <span className="text-white">{tag}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[12px] font-semibold text-white">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#FDA4AF]" aria-hidden="true" />
                      Seller Verified — ID &amp; address confirmed
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-white/10 pt-4 tabular-nums">
                    <span className="text-[13px] font-normal text-zinc-400 line-through">
                      {money(ITEM.retail)} retail
                    </span>
                    <span
                      className="text-[clamp(1.4rem,3vw,1.8rem)] font-extrabold tracking-[-0.02em]"
                      style={{ fontFamily: "var(--font-display-wide)" }}
                    >
                      {money(price)}
                    </span>
                    <span className="text-[13px] font-semibold tabular-nums text-[#FDA4AF]">{discount}% off</span>
                  </div>
                </div>
              </Reveal>

              <Reveal className="min-w-0 lg:col-span-5" delay={0.06}>
                <ConditionAccordion />
                <p className={`mt-4 ${CAPTION}`}>Fig. 02 — Public condition rubric, updated at inspection</p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ VALUE SPLIT */}
        <section id="value" className="border-b border-white/10 px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <div className="flex items-end gap-5">
                <span
                  aria-hidden="true"
                  className="select-none text-[clamp(2rem,3.2vw,2.5rem)] font-semibold leading-[0.9] tracking-[0.12em] text-[#6B6B78]"
                  style={{ fontFamily: "var(--font-display-wide)" }}
                >
                  03
                </span>
                <div>
                  <p className={EYEBROW}>WHAT MOVES</p>
                  <h2
                    className="mt-3 max-w-[720px] text-[clamp(1.7rem,4.2vw,2.7rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
                    style={{ fontFamily: "var(--font-display-wide)" }}
                  >
                    Three numbers, one shared set of switches.
                  </h2>
                </div>
              </div>
              <p className="mt-5 max-w-[493px] text-[16px] font-normal leading-[1.6] text-zinc-400">
                These are the same layers from above &mdash; still {active.size} of {LAYERS.length}{" "}
                on. Flip one back on the hero and every card below updates with it, all the way to
                the close.
              </p>
            </Reveal>

            <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Inspection layers, recap">
              {LAYERS.map((layer) => {
                const Icon = LAYER_ICON[layer.id];
                const on = active.has(layer.id);
                return (
                  <button
                    key={layer.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleLayer(layer.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[12px] font-semibold transition-colors ${FOCUS} ${
                      on
                        ? "border-[#E11D48] bg-[#E11D48] text-white"
                        : "border-white/15 bg-white/[0.02] text-white hover:border-[#FDA4AF]/60 hover:bg-white/[0.06]"
                    }`}
                  >
                    <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                    {layer.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {valueCards.map((card, i) => (
                <Reveal key={card.idx} delay={i * 0.06}>
                  <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <span
                      aria-hidden="true"
                      className="block select-none text-[1.75rem] font-semibold leading-none tracking-[0.12em] text-[#6B6B78]"
                      style={{ fontFamily: "var(--font-display-wide)" }}
                    >
                      {card.idx}
                    </span>
                    <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.02em]">{card.title}</h3>
                    <p
                      className="mt-3 text-[clamp(1.4rem,3vw,1.8rem)] font-extrabold leading-tight tracking-[-0.02em] tabular-nums"
                      style={{ fontFamily: "var(--font-display-wide)" }}
                    >
                      {card.value}
                    </p>
                    <p className="mt-4 max-w-[431px] text-[14px] font-normal leading-[1.6] text-zinc-400">
                      {card.copy}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- SOCIAL PROOF */}
        <section id="proof" className="border-b border-white/10 px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <p className={EYEBROW}>SELLERS</p>
              <h2
                className="mt-4 max-w-[720px] text-[clamp(1.7rem,4.2vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-display-wide)" }}
              >
                They let buyers see the layers, not just the badge.
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
                    className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <Quote className="h-5 w-5 text-[#FDA4AF]" aria-hidden="true" />
                    <p className="mt-3 max-w-[280px] text-[14px] font-normal leading-[1.6] text-zinc-300">
                      {t.quote}
                    </p>
                    <div role="img" aria-label={`Rated ${t.rating} out of 5`} className="mt-4 flex items-center gap-1">
                      {STAR_POSITIONS.map((s) => (
                        <Star
                          key={s}
                          aria-hidden="true"
                          className={`h-3.5 w-3.5 ${s < t.rating ? "fill-[#FDA4AF] text-[#FDA4AF]" : "text-zinc-400"}`}
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-[13px] font-semibold text-white">{t.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[12px] font-normal text-zinc-400">
                      <BadgeCheck className="h-3 w-3 shrink-0 text-[#FDA4AF]" aria-hidden="true" />
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
                        className="mt-1 text-[clamp(1.6rem,3.2vw,2rem)] font-extrabold tabular-nums tracking-[-0.02em]"
                        style={{ fontFamily: "var(--font-display-wide)" }}
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
        <section id="start" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <p className={EYEBROW}>BRING THE ITEM</p>
              <h2
                className="mt-5 max-w-[860px] text-[clamp(1.9rem,6vw,3.4rem)] font-extrabold leading-[1.04] tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-display-wide)" }}
              >
                Choose how many layers prove it&rsquo;s real.
              </h2>
              <p className="mt-6 max-w-[493px] text-[16px] font-normal leading-[1.6] text-zinc-400" aria-live="polite">
                Right now: a Trust Score of{" "}
                <span className="font-semibold tabular-nums text-white">{trust}/100</span> (
                <span className="font-semibold text-[#FDA4AF]">{tier.label}</span>), a resale
                price of <span className="font-semibold tabular-nums text-white">{money(price)}</span>,
                and <span className="font-semibold tabular-nums text-white">{discount}%</span> off
                the {money(ITEM.retail)} retail. Switch on more layers above and this line moves
                with it.
              </p>

              <form onSubmit={handleSubmit} className="mt-9 max-w-[420px]" noValidate>
                <label htmlFor="notify-email" className="block text-[12px] font-semibold text-zinc-400">
                  Get notified when a buyer opens this listing
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
                    className={`min-w-0 flex-1 rounded-full border border-white/15 bg-white/[0.03] px-4 py-3 text-[14px] font-normal text-white placeholder:text-zinc-400 ${FOCUS}`}
                  />
                  <button
                    type="submit"
                    className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#E11D48] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#BE123C] ${FOCUS}`}
                  >
                    Notify me
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <p id="notify-email-msg" className="mt-2 flex items-center gap-1.5 text-[12px] font-normal text-zinc-400" aria-live="polite">
                  {emailState === "ok" && (
                    <>
                      <CircleCheck className="h-3.5 w-3.5 shrink-0 text-[#FDA4AF]" aria-hidden="true" />
                      You&rsquo;re on the list &mdash; we&rsquo;ll email you the moment this sells.
                    </>
                  )}
                  {emailState === "error" && (
                    <>
                      <CircleAlert className="h-3.5 w-3.5 shrink-0 text-white" aria-hidden="true" />
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

      <footer className="border-t border-white/10 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-6">
          <span className="text-[13px] font-semibold tracking-[-0.02em]">repick</span>
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="#preview" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              The listing
            </a>
            <a href="#value" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              What moves
            </a>
            <a href="#proof" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              Sellers
            </a>
          </nav>
          <span className={CAPTION}>PROOF, LAYER BY LAYER</span>
        </div>
      </footer>
    </div>
  );
}
