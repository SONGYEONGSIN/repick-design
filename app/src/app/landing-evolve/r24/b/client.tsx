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
  ClipboardCheck,
  History,
  Layers,
  Lock,
  Percent,
  Quote,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Star,
  type LucideIcon,
} from "lucide-react";
import TrustGraph from "./graph";
import {
  AI_MATCH_TAGS,
  BASE_WEIGHT,
  CONDITION_RUBRIC,
  confidenceOf,
  DEFAULT_ACTIVE,
  discountPct,
  ITEM,
  LAYERS,
  isNodeActive,
  money,
  NODES,
  TESTIMONIALS,
  TRUST_STATS,
  type LayerId,
} from "./data";

// Accent hexes are inlined as Tailwind arbitrary-value classes (e.g. bg-[#EA580C]) rather than
// interpolated from a JS constant, because Tailwind's class scanner reads raw source text and
// cannot resolve a template literal — see candidates/b.md for the full contrast calculation.
//   #EA580C (fill)  — large text / borders / filled surfaces. On dark ink (#0B0B0F): 5.52:1.
//   #FDBA74 (tint)  — small text / icons / focus ring, used directly on the dark bg: 11.65:1.
// White text on the #EA580C fill is only 3.56:1 (fails small-text AA) — every filled chip/button/
// badge below therefore uses dark ink (#0B0B0F) text, never white, on top of the fill.

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDBA74]";
const EYEBROW = "text-[11px] font-semibold tracking-[0.28em] text-[#FDBA74]";
const CAPTION = "text-[11px] font-normal tracking-[0.16em] text-zinc-400";
const STAT_LABEL = "text-[10px] font-semibold tracking-[0.12em] text-zinc-400";
const STAR_POSITIONS = [0, 1, 2, 3, 4];
const SKIP_LINK =
  "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-white focus-visible:px-4 focus-visible:py-2 focus-visible:text-[13px] focus-visible:font-semibold focus-visible:text-[#0B0B0F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDBA74]";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LAYER_ICON: Record<LayerId, LucideIcon> = {
  aiScan: ScanSearch,
  inspection: ClipboardCheck,
  sellerHistory: History,
  escrowHold: Lock,
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
      className="select-none text-[clamp(2rem,3.2vw,2.5rem)] font-semibold leading-[0.9] tracking-[0.12em] text-[#6B6B78]"
      style={{ fontFamily: "var(--font-display-mono)" }}
    >
      {n}
    </span>
  );
}

export default function TrustWebLanding() {
  const reduce = useReducedMotion();
  const [activeLayers, setActiveLayers] = useState<Set<LayerId>>(new Set(DEFAULT_ACTIVE));
  const [hoveredLayer, setHoveredLayer] = useState<LayerId | null>(null);
  const [rubricOpen, setRubricOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState<"idle" | "ok" | "error">("idle");

  const confidence = useMemo(() => confidenceOf(activeLayers), [activeLayers]);
  const activeCount = activeLayers.size;
  const inactiveLayers = useMemo(
    () => LAYERS.filter((l) => !activeLayers.has(l.id)),
    [activeLayers],
  );
  const nextLift = useMemo(
    () => [...inactiveLayers].sort((a, b) => b.weight - a.weight)[0] ?? null,
    [inactiveLayers],
  );
  const previewLayer = hoveredLayer ? LAYERS.find((l) => l.id === hoveredLayer) ?? null : null;
  const discount = discountPct(ITEM.askPrice, ITEM.appraisedValue);

  function toggleLayer(id: LayerId) {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearHover(id: LayerId) {
    setHoveredLayer((h) => (h === id ? null : h));
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
    <div className="min-h-dvh overflow-x-clip bg-[#0B0B0F] font-normal text-white antialiased">
      <a href="#main" className={SKIP_LINK}>
        Skip to main content
      </a>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0B0F]/95 px-5 py-4 backdrop-blur sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-6">
          <span className="flex items-center gap-2 text-[15px] font-extrabold tracking-[-0.02em]">
            <span className="h-2 w-2 rounded-full bg-[#EA580C]" aria-hidden="true" />
            repick
          </span>
          <nav aria-label="Sections" className="hidden items-center gap-6 sm:flex">
            <a href="#verify" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              The chain
            </a>
            <a href="#layers" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              The layers
            </a>
            <a href="#trust" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              Sellers
            </a>
          </nav>
          <a
            href="#start"
            className={`rounded-full bg-[#EA580C] px-4 py-2 text-[13px] font-semibold text-[#0B0B0F] transition-colors hover:bg-[#C2410C] ${FOCUS}`}
          >
            List an item
          </a>
        </div>
      </header>

      <main id="main">
        {/* ---------------------------------------------------------------- HERO */}
        <section className="border-b border-white/10 px-5 pt-12 pb-12 sm:px-8 lg:px-12 lg:pt-16 lg:pb-16">
          <div className="mx-auto w-full max-w-[1240px]">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10">
              {/* Text + confidence readout + product proof — kept in DOM before the graph so the
                  h1 reads first for assistive tech, but visually placed to the right on desktop. */}
              <motion.div className="min-w-0 lg:order-2 lg:col-span-5" {...heroIn}>
                <p className={EYEBROW}>LIVE VERIFICATION GRAPH</p>
                <h1
                  className="mt-5 text-[clamp(2rem,5.6vw,3rem)] font-extrabold leading-[1.06] tracking-[-0.01em]"
                  style={{ fontFamily: "var(--font-display-mono)" }}
                >
                  Every sale runs through a trust web.
                  <span className="block text-[#FDBA74]">Switch a layer, watch it move.</span>
                </h1>
                <p className="mt-6 max-w-[493px] text-[16px] font-normal leading-[1.6] text-zinc-400">
                  Repick doesn&rsquo;t ask you to trust a badge &mdash; it shows the exact chain
                  of checks between this seller and you. Turn any layer on or off and the graph,
                  and the confidence score, recompute in place.
                </p>

                <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className={STAT_LABEL}>TRUST CONFIDENCE RIGHT NOW</p>
                  <p
                    className="mt-1.5 text-[clamp(2.2rem,5vw,2.9rem)] font-extrabold leading-none tabular-nums tracking-[-0.01em]"
                    style={{ fontFamily: "var(--font-display-mono)" }}
                    aria-live="polite"
                  >
                    {confidence}%
                  </p>
                  <p className="mt-2 text-[13px] font-normal text-zinc-400">
                    Base connection ({BASE_WEIGHT}%) + {activeCount} of {LAYERS.length} layers
                    active.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <a
                    href="#verify"
                    className={`inline-flex items-center gap-2 rounded-full bg-[#EA580C] px-6 py-3 text-[14px] font-semibold text-[#0B0B0F] transition-colors hover:bg-[#C2410C] ${FOCUS}`}
                  >
                    Read the full chain
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <span className={STAT_LABEL}>{TRUST_STATS[0].value} VERIFIED SELLERS</span>
                </div>

                {/* Product + proof — inside the hero component itself, not a section below it. */}
                <div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-900 sm:w-24">
                    <Image
                      src={`https://images.unsplash.com/photo-${ITEM.photoId}?q=80&w=300&auto=format&fit=crop`}
                      alt={ITEM.alt}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={STAT_LABEL}>{ITEM.category.toUpperCase()}</p>
                    <h2 className="mt-0.5 truncate text-[15px] font-extrabold tracking-[-0.01em]">
                      {ITEM.name}
                    </h2>
                    <p className="mt-0.5 truncate text-[12px] font-normal text-zinc-400">{ITEM.detail}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#FDBA74]/40 bg-white/[0.02] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[#FDBA74]">
                        <CircleCheck className="h-3 w-3" aria-hidden="true" />
                        {ITEM.match}% match
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.02] px-2 py-0.5 text-[11px] font-semibold text-white">
                        Grade {ITEM.conditionGrade}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.02] px-2 py-0.5 text-[11px] font-semibold text-white">
                        <ShieldCheck className="h-3 w-3 text-[#FDBA74]" aria-hidden="true" />
                        Verified
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 tabular-nums">
                      <span className="text-[12px] font-normal text-zinc-400 line-through">
                        {money(ITEM.appraisedValue)}
                      </span>
                      <span
                        className="text-[17px] font-extrabold tracking-[-0.01em]"
                        style={{ fontFamily: "var(--font-display-mono)" }}
                      >
                        {money(ITEM.askPrice)}
                      </span>
                      <span className="rounded-full bg-[#EA580C] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[#0B0B0F]">
                        {discount}% off
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Graph device — the hero's dominant, interactive centerpiece. */}
              <motion.div className="min-w-0 lg:order-1 lg:col-span-7" {...heroIn}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className={STAT_LABEL}>VERIFICATION LAYERS</p>
                    <span className="text-[11px] font-semibold tabular-nums text-[#FDBA74]">
                      {activeCount} / {LAYERS.length} active
                    </span>
                  </div>

                  <div
                    role="group"
                    aria-label="Verification layer toggles"
                    className="mt-3 flex flex-wrap items-center gap-2"
                  >
                    {LAYERS.map((layer) => {
                      const Icon = LAYER_ICON[layer.id];
                      const on = activeLayers.has(layer.id);
                      return (
                        <button
                          key={layer.id}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggleLayer(layer.id)}
                          onMouseEnter={() => setHoveredLayer(layer.id)}
                          onFocus={() => setHoveredLayer(layer.id)}
                          onMouseLeave={() => clearHover(layer.id)}
                          onBlur={() => clearHover(layer.id)}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[12px] font-semibold transition-colors ${FOCUS} ${
                            on
                              ? "border-[#EA580C] bg-[#EA580C] text-[#0B0B0F]"
                              : "border-white/15 bg-white/[0.02] text-white hover:border-[#FDBA74]/60 hover:bg-white/[0.06]"
                          }`}
                        >
                          <Icon className="h-3 w-3 shrink-0" style={{ color: on ? "#0B0B0F" : "#FDBA74" }} aria-hidden="true" />
                          {layer.label}
                          <span className="tabular-nums" style={{ color: on ? "#0B0B0F" : "#A1A1AA" }}>
                            +{layer.weight}%
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5">
                    <TrustGraph active={activeLayers} reduce={!!reduce} />
                  </div>

                  <p className={`mt-4 ${CAPTION}`} aria-live="polite">
                    {previewLayer
                      ? `${previewLayer.label.toUpperCase()} — ${previewLayer.description}`
                      : `Fig. 01 — ${activeCount} of ${LAYERS.length} layers active, ${confidence}% trust confidence.`}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- PRODUCT PREVIEW / CHAIN */}
        <section id="verify" className="border-b border-white/10 px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <div className="flex items-end gap-5">
                <SectionNumber n="02" />
                <div>
                  <p className={EYEBROW}>THE CHAIN</p>
                  <h2
                    className="mt-3 max-w-[720px] text-[clamp(1.6rem,4vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.01em]"
                    style={{ fontFamily: "var(--font-display-mono)" }}
                  >
                    Seven links. Four of them are yours to switch.
                  </h2>
                </div>
              </div>
              <p className="mt-5 max-w-[493px] text-[16px] font-normal leading-[1.6] text-zinc-400">
                Seller and item and buyer are always in the chain &mdash; the four checks between
                them are the layers you toggled above. This list mirrors the graph exactly, live.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
              <Reveal className="min-w-0 lg:col-span-7">
                <ol className="flex flex-col gap-2">
                  {NODES.map((node, i) => {
                    const on = isNodeActive(node, activeLayers);
                    return (
                      <li
                        key={node.id}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
                      >
                        <span
                          aria-hidden="true"
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums"
                          style={{
                            background: on ? "#EA580C" : "transparent",
                            border: on ? "none" : "1px solid rgba(255,255,255,0.18)",
                            color: on ? "#0B0B0F" : "#A1A1AA",
                          }}
                        >
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-semibold text-white">{node.label}</p>
                          <p className="mt-0.5 truncate text-[12px] font-normal text-zinc-400">
                            {node.detail}
                          </p>
                        </div>
                        <span
                          className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em]"
                          style={{
                            borderColor: on ? "rgba(253,186,116,0.4)" : "rgba(255,255,255,0.15)",
                            color: on ? "#FDBA74" : "#71717A",
                          }}
                        >
                          {node.kind === "anchor" ? "ALWAYS ON" : on ? "ACTIVE" : "OFF"}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </Reveal>

              <div className="flex min-w-0 flex-col gap-6 lg:col-span-5">
                <Reveal>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                    <p className={STAT_LABEL}>AI MATCH REASONING</p>
                    <ul className="mt-3 flex flex-col gap-2">
                      {AI_MATCH_TAGS.map((tag) => (
                        <li
                          key={tag}
                          className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-[13px] font-normal leading-[1.5] text-zinc-400"
                        >
                          <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#FDBA74]" aria-hidden="true" />
                          <span className="text-white">{tag}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[12px] font-semibold text-white">
                        <BadgeCheck className="h-3.5 w-3.5 text-[#FDBA74]" aria-hidden="true" />
                        {ITEM.sellerTrades} trades &middot; {ITEM.sellerRating.toFixed(1)} / 5
                      </span>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={0.06}>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                    <p className={STAT_LABEL}>CONDITION GRADE {ITEM.conditionGrade}</p>
                    <p className="mt-2 max-w-[431px] text-[14px] font-normal leading-[1.6] text-zinc-400">
                      {CONDITION_RUBRIC.filter((c) => c.pass).length} of {CONDITION_RUBRIC.length}{" "}
                      points passed on the public rubric behind this grade.
                    </p>
                    <button
                      type="button"
                      aria-expanded={rubricOpen}
                      aria-controls="condition-rubric-list"
                      onClick={() => setRubricOpen((v) => !v)}
                      className={`mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.02] px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:border-[#FDBA74]/60 ${FOCUS}`}
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
                          className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4"
                        >
                          {CONDITION_RUBRIC.map((point) => (
                            <li key={point.label} className="flex items-start gap-2">
                              {point.pass ? (
                                <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#FDBA74]" aria-hidden="true" />
                              ) : (
                                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                              )}
                              <span className="text-[13px] font-normal leading-[1.5] text-zinc-400">
                                <span className="text-white">{point.label}</span>
                                {point.note && <span className="block text-zinc-400">{point.note}</span>}
                              </span>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- VALUE 3-SPLIT */}
        <section id="layers" className="border-b border-white/10 px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <div className="flex items-end gap-5">
                <SectionNumber n="03" />
                <div>
                  <p className={EYEBROW}>WHAT THE GRAPH IS DOING</p>
                  <h2
                    className="mt-3 max-w-[720px] text-[clamp(1.6rem,4vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.01em]"
                    style={{ fontFamily: "var(--font-display-mono)" }}
                  >
                    Three numbers, recomputed the instant you toggle.
                  </h2>
                </div>
              </div>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
              <Reveal>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <div className="flex items-center justify-between">
                    <span
                      aria-hidden="true"
                      className="select-none text-[1.75rem] font-semibold leading-none tracking-[0.12em] text-[#6B6B78]"
                      style={{ fontFamily: "var(--font-display-mono)" }}
                    >
                      01
                    </span>
                    <Layers className="h-4 w-4 text-[#FDBA74]" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.01em]">Layers active</h3>
                  <p
                    className="mt-3 text-[clamp(1.4rem,3vw,1.8rem)] font-extrabold leading-tight tabular-nums tracking-[-0.01em]"
                    style={{ fontFamily: "var(--font-display-mono)" }}
                  >
                    {activeCount} / {LAYERS.length}
                  </p>
                  <p className="mt-4 max-w-[431px] text-[14px] font-normal leading-[1.6] text-zinc-400">
                    {activeCount === 0
                      ? "No optional layer is on yet — only the base seller-to-buyer connection is live."
                      : `Currently on: ${LAYERS.filter((l) => activeLayers.has(l.id)).map((l) => l.label).join(", ")}.`}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.06}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <div className="flex items-center justify-between">
                    <span
                      aria-hidden="true"
                      className="select-none text-[1.75rem] font-semibold leading-none tracking-[0.12em] text-[#6B6B78]"
                      style={{ fontFamily: "var(--font-display-mono)" }}
                    >
                      02
                    </span>
                    <Percent className="h-4 w-4 text-[#FDBA74]" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.01em]">Trust confidence</h3>
                  <p
                    className="mt-3 text-[clamp(1.4rem,3vw,1.8rem)] font-extrabold leading-tight tabular-nums tracking-[-0.01em]"
                    style={{ fontFamily: "var(--font-display-mono)" }}
                  >
                    {confidence}%
                  </p>
                  <p className="mt-4 max-w-[431px] text-[14px] font-normal leading-[1.6] text-zinc-400">
                    {BASE_WEIGHT}% base connection, plus the fixed weight of every layer you have
                    switched on above.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <div className="flex items-center justify-between">
                    <span
                      aria-hidden="true"
                      className="select-none text-[1.75rem] font-semibold leading-none tracking-[0.12em] text-[#6B6B78]"
                      style={{ fontFamily: "var(--font-display-mono)" }}
                    >
                      03
                    </span>
                    {nextLift ? (
                      <ArrowUpRight className="h-4 w-4 text-[#FDBA74]" aria-hidden="true" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-[#FDBA74]" aria-hidden="true" />
                    )}
                  </div>
                  <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.01em]">Next biggest lift</h3>
                  <p
                    className="mt-3 text-[clamp(1.4rem,3vw,1.8rem)] font-extrabold leading-tight tabular-nums tracking-[-0.01em]"
                    style={{ fontFamily: "var(--font-display-mono)" }}
                  >
                    {nextLift ? `+${nextLift.weight}%` : "Maxed out"}
                  </p>
                  <p className="mt-4 max-w-[431px] text-[14px] font-normal leading-[1.6] text-zinc-400">
                    {nextLift
                      ? `Switching on "${nextLift.label}" would take confidence to ${confidence + nextLift.weight}%.`
                      : "Every layer is already active — this is the highest confidence the graph can show."}
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- SOCIAL PROOF */}
        <section id="trust" className="border-b border-white/10 px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <p className={EYEBROW}>SELLERS</p>
              <h2
                className="mt-4 max-w-[720px] text-[clamp(1.6rem,3.8vw,2.4rem)] font-extrabold leading-[1.08] tracking-[-0.01em]"
                style={{ fontFamily: "var(--font-display-mono)" }}
              >
                They let buyers see the chain, not just a badge.
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
                    className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <Quote className="h-5 w-5 text-[#FDBA74]" aria-hidden="true" />
                    <p className="mt-3 max-w-[280px] text-[14px] font-normal leading-[1.6] text-zinc-300">
                      {t.quote}
                    </p>
                    <div role="img" aria-label={`Rated ${t.rating} out of 5`} className="mt-4 flex items-center gap-1">
                      {STAR_POSITIONS.map((s) => (
                        <Star
                          key={s}
                          aria-hidden="true"
                          className={`h-3.5 w-3.5 ${s < t.rating ? "fill-[#FDBA74] text-[#FDBA74]" : "text-zinc-400"}`}
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-[13px] font-semibold text-white">{t.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[12px] font-normal text-zinc-400">
                      <BadgeCheck className="h-3 w-3 shrink-0 text-[#FDBA74]" aria-hidden="true" />
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
                        style={{ fontFamily: "var(--font-display-mono)" }}
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
              <p className={EYEBROW}>WHAT THE GRAPH SAYS</p>
              <h2
                className="mt-5 max-w-[860px] text-[clamp(1.8rem,5.6vw,3.1rem)] font-extrabold leading-[1.06] tracking-[-0.01em]"
                style={{ fontFamily: "var(--font-display-mono)" }}
              >
                Sell into a chain buyers can see for themselves.
              </h2>
              <p className="mt-6 max-w-[493px] text-[16px] font-normal leading-[1.6] text-zinc-400" aria-live="polite">
                Right now this listing&rsquo;s trust confidence sits at{" "}
                <span className="font-semibold tabular-nums text-white">{confidence}%</span>,
                built from the base connection plus {activeCount} of {LAYERS.length}{" "}
                verification layers you&rsquo;ve switched on
                {inactiveLayers.length > 0 && (
                  <>
                    {" "}
                    &mdash; turn on{" "}
                    <span className="font-semibold text-white">
                      {inactiveLayers.map((l) => l.label).join(", ")}
                    </span>{" "}
                    above to raise it further
                  </>
                )}
                . This number isn&rsquo;t fixed: it moves the moment you toggle a layer.
              </p>

              <form onSubmit={handleSubmit} className="mt-9 max-w-[420px]" noValidate>
                <label htmlFor="notify-email" className="block text-[12px] font-semibold text-zinc-400">
                  Get notified when your item clears every layer
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
                    className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#EA580C] px-6 py-3 text-[14px] font-semibold text-[#0B0B0F] transition-colors hover:bg-[#C2410C] ${FOCUS}`}
                  >
                    Notify me
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <p id="notify-email-msg" className="mt-2 flex items-center gap-1.5 text-[12px] font-normal text-zinc-400" aria-live="polite">
                  {emailState === "ok" && (
                    <>
                      <CircleCheck className="h-3.5 w-3.5 shrink-0 text-[#FDBA74]" aria-hidden="true" />
                      You&rsquo;re on the list &mdash; we&rsquo;ll email you the moment it sells.
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
          <span className="text-[13px] font-semibold tracking-[-0.01em]">repick</span>
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="#verify" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              The chain
            </a>
            <a href="#layers" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              The layers
            </a>
            <a href="#trust" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              Sellers
            </a>
          </nav>
          <span className={CAPTION}>VERIFIED BEFORE IT SHIPS</span>
        </div>
      </footer>
    </div>
  );
}
