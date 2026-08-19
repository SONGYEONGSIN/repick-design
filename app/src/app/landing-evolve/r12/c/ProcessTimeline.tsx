"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  STAGES,
  TRACE_ITEM,
  AI_VERDICT,
  OFFER,
  OFFER_AMOUNT,
  SETTLEMENT,
  SERVICE_FEE,
  PROCESSING_FEE,
  NET_PAYOUT,
  cx,
  money,
  EYEBROW,
  STAT,
  NUM,
  FOCUS,
  ROSE,
  CYAN,
  type StageId,
} from "./data";

/**
 * The vertical process timeline. Scroll position drives two things at once: the connecting SVG line
 * literally draws itself down the spine (`pathLength` tied to `useScroll`'s `scrollYProgress`), and
 * the stage that is currently in view lights up its node dot (`onViewportEnter`, one fixed index per
 * stage — no IntersectionObserver polling). This is not a stepper: nothing here is a set of parallel
 * tabs a visitor picks between. It is one listing's timeline, read top to bottom, where scrolling
 * *reveals progress* rather than *switching a panel* — see candidates/c.md for the full contrast with
 * `auto-landing-r10/b`'s horizontal `tablist` stepper.
 *
 * `prefers-reduced-motion`: the line renders fully drawn and every stage reads as already reached —
 * a static, fully legible list instead of a scroll-linked reveal, exactly as the brief requires. That
 * swap is done with `motion-reduce:`/`motion-safe:` CSS, not by branching the JSX on the
 * `useReducedMotion()` return value: that hook resolves to `null` during SSR and only settles
 * client-side after mount, so branching element types on it produced a real hydration mismatch in
 * testing (the animated path's `pathLength` got stuck at 0). CSS media queries are identical on
 * server and client and need no mount timing, so the static/animated choice lives there instead —
 * see the comment above the line's `<svg>` pair. Nothing here is ever painted at `opacity: 0` waiting
 * on a viewport callback; the reduced-motion version simply never animates, it does not hide content.
 */
export default function ProcessTimeline() {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<StageId | null>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.75", "end 0.4"],
  });

  const toggle = (id: StageId) => setExpanded((cur) => (cur === id ? null : id));

  return (
    <section
      id="how-it-works"
      aria-labelledby="timeline-title"
      className="border-b border-white/10 bg-[#0B0C10] py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-8">
        <header className="max-w-[560px]">
          <p className={cx(EYEBROW, "text-[#fb7185]")}>One listing, followed end to end</p>
          <h2
            id="timeline-title"
            className="mt-3 text-[clamp(1.7rem,3.4vw,2.4rem)] font-extrabold leading-[1.1] tracking-[-0.015em] text-white"
          >
            From upload to payout — nothing happens off screen.
          </h2>
          <p className="mt-4 max-w-[460px] text-[0.95rem] font-normal leading-[1.65] text-[#A1A1AA]">
            This is the {TRACE_ITEM.title.toLowerCase()} Priya listed last
            week. Every figure below is the number repick actually produced
            for it — open a step for the evidence behind it.
          </p>
        </header>

        <div ref={trackRef} className="relative mt-16 md:mt-20">
          {/* connecting line — static track always visible, colored overlay draws with scroll.
              The animated/static choice is made in *CSS* (`motion-reduce:`/`motion-safe:`), not by
              branching on the `reduced` JS flag: `useReducedMotion()` resolves to `null` during SSR
              and only settles client-side after mount, so a JS-branched element type here (plain
              `<path>` vs `<motion.path>`) diverges between the server-rendered markup and the first
              client render whenever the visitor actually has reduced motion on — a hydration
              mismatch that left the animated path's `pathLength` stuck at 0 in testing. Rendering
              both elements unconditionally and letting a CSS media query decide which one paints
              sidesteps the mismatch entirely: the DOM is identical on server and client, and the
              visual choice reacts to `prefers-reduced-motion` live, not to a value snapshotted once. */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[14px] top-4 bottom-4 w-1"
          >
            <div className="absolute inset-0 rounded-full bg-white/10" />
            <svg
              className="absolute inset-0 hidden h-full w-full motion-safe:block"
              viewBox="0 0 4 1000"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="trace-line-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ROSE} />
                  <stop offset="30%" stopColor={ROSE} />
                  <stop offset="55%" stopColor={CYAN} />
                  <stop offset="100%" stopColor={CYAN} />
                </linearGradient>
              </defs>
              <motion.path
                d="M2 0 L2 1000"
                stroke="url(#trace-line-gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                style={{ pathLength: scrollYProgress }}
              />
            </svg>
            <svg
              className="absolute inset-0 hidden h-full w-full motion-reduce:block"
              viewBox="0 0 4 1000"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="trace-line-gradient-static" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ROSE} />
                  <stop offset="30%" stopColor={ROSE} />
                  <stop offset="55%" stopColor={CYAN} />
                  <stop offset="100%" stopColor={CYAN} />
                </linearGradient>
              </defs>
              <path
                d="M2 0 L2 1000"
                stroke="url(#trace-line-gradient-static)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <ol className="flex flex-col gap-12 md:gap-16">
            {STAGES.map((stage, i) => {
              // Same reasoning as the line above: `reached` is derived only from scroll-driven
              // state, identical on server and client at mount (both start at `active === 0`), so
              // there is nothing here for hydration to disagree about. The "every stage already
              // reached" look reduced motion asks for is applied as a `motion-reduce:` class
              // override below, not by folding `reduced` into this boolean.
              const reached = active >= i;
              const isOpen = expanded === stage.id;
              const sideColorText = stage.side === "seller" ? "text-[#fb7185]" : "text-[#22d3ee]";
              const dotClass = cx(
                reached
                  ? stage.side === "seller"
                    ? "border-[#e11d48] bg-[#e11d48] text-white"
                    : "border-[#0e7490] bg-[#0e7490] text-white"
                  : "border-white/15 bg-[#14151C] text-white/40",
                // reduced motion: every stage reads as already reached, regardless of scroll state
                stage.side === "seller"
                  ? "motion-reduce:border-[#e11d48] motion-reduce:bg-[#e11d48] motion-reduce:text-white"
                  : "motion-reduce:border-[#0e7490] motion-reduce:bg-[#0e7490] motion-reduce:text-white",
              );
              const Icon = stage.icon;
              const panelId = `panel-${stage.id}`;
              const buttonId = `button-${stage.id}`;

              return (
                <motion.li
                  key={stage.id}
                  onViewportEnter={reduced ? undefined : () => setActive(i)}
                  viewport={{ margin: "-35% 0px -35% 0px" }}
                  className="relative pl-14 sm:pl-16"
                >
                  <span
                    aria-hidden
                    className={cx(
                      "absolute left-0 top-0.5 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-300 motion-reduce:transition-none",
                      dotClass,
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className={cx(EYEBROW, sideColorText)}>{stage.eyebrow}</p>
                        <h3 className="mt-2 text-xl font-extrabold leading-snug tracking-[-0.01em] text-white sm:text-2xl">
                          <button
                            type="button"
                            id={buttonId}
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            onClick={() => toggle(stage.id)}
                            className={cx(
                              "inline-flex items-center gap-2 rounded text-left transition-colors duration-150 hover:text-[#22d3ee]",
                              FOCUS,
                            )}
                          >
                            <span>{stage.title}</span>
                            <ChevronDown
                              className={cx(
                                "h-5 w-5 shrink-0 text-white/50 transition-transform duration-200 motion-reduce:transition-none",
                                isOpen && "rotate-180",
                              )}
                              aria-hidden
                            />
                          </button>
                        </h3>
                        <p className={cx(NUM, "mt-2 text-sm font-normal text-[#A1A1AA]")}>
                          {stage.oneLiner}
                        </p>
                      </div>
                    </div>

                    {/* always-on core evidence — the reason this card exists */}
                    <div className="mt-5 border-t border-white/10 pt-5">
                      {stage.id === "listed" && (
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                          <div className="w-full shrink-0 sm:w-48">
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#1B1C24]">
                              <Image
                                src={TRACE_ITEM.image.src}
                                alt={TRACE_ITEM.image.alt}
                                fill
                                sizes="(min-width: 640px) 192px, 100vw"
                                className="object-cover"
                              />
                            </div>
                            <p className="mt-2 text-xs font-semibold text-white">
                              {TRACE_ITEM.title} · {TRACE_ITEM.size}
                            </p>
                          </div>
                          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:pt-1">
                            <div>
                              <dt className={cx(STAT, "text-[#A1A1AA]")}>Asking price</dt>
                              <dd className={cx(NUM, "mt-1 text-lg font-extrabold text-white")}>
                                {money(TRACE_ITEM.askingPrice)}
                              </dd>
                            </div>
                            <div>
                              <dt className={cx(STAT, "text-[#A1A1AA]")}>Self-graded</dt>
                              <dd className="mt-1 text-lg font-extrabold text-white">
                                {TRACE_ITEM.selfGrade}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      )}

                      {stage.id === "verdict" && (
                        <div className="flex flex-col gap-3">
                          {AI_VERDICT.subscores.map((s) => (
                            <div key={s.label} className="flex items-center gap-3">
                              <span className="w-28 shrink-0 text-xs font-normal text-[#A1A1AA]">
                                {s.label}
                              </span>
                              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                                <span
                                  className="block h-full rounded-full bg-[#06b6d4]"
                                  style={{ width: `${s.value}%` }}
                                />
                              </span>
                              <span className={cx(NUM, "w-9 shrink-0 text-right text-xs font-semibold text-white")}>
                                {s.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {stage.id === "offer" && (
                        <dl className="grid grid-cols-3 gap-4">
                          <div>
                            <dt className={cx(STAT, "text-[#A1A1AA]")}>Offer</dt>
                            <dd className={cx(NUM, "mt-1 text-2xl font-extrabold text-white")}>
                              {money(OFFER_AMOUNT)}
                            </dd>
                          </div>
                          <div>
                            <dt className={cx(STAT, "text-[#A1A1AA]")}>Comparable range</dt>
                            <dd className={cx(NUM, "mt-1 text-sm font-semibold text-white")}>
                              {money(OFFER.compLow)}–{money(OFFER.compHigh)}
                            </dd>
                          </div>
                          <div>
                            <dt className={cx(STAT, "text-[#A1A1AA]")}>Buyer match</dt>
                            <dd className={cx(NUM, "mt-1 text-sm font-semibold text-white")}>
                              {OFFER.buyerMatch}%
                            </dd>
                          </div>
                        </dl>
                      )}

                      {stage.id === "settlement" && (
                        <dl className="grid grid-cols-3 gap-4">
                          <div>
                            <dt className={cx(STAT, "text-[#A1A1AA]")}>Net payout</dt>
                            <dd className={cx(NUM, "mt-1 text-2xl font-extrabold text-white")}>
                              {money(NET_PAYOUT)}
                            </dd>
                          </div>
                          <div>
                            <dt className={cx(STAT, "text-[#A1A1AA]")}>Speed</dt>
                            <dd className="mt-1 text-sm font-semibold text-white">
                              {SETTLEMENT.payoutSpeed}
                            </dd>
                          </div>
                          <div>
                            <dt className={cx(STAT, "text-[#A1A1AA]")}>Status</dt>
                            <dd className="mt-1 inline-flex items-center rounded-full bg-[#0e7490] px-2 py-0.5 text-xs font-semibold text-white">
                              {SETTLEMENT.status}
                            </dd>
                          </div>
                        </dl>
                      )}
                    </div>
                  </div>

                  {/* expand — additional evidence, not a repeat of the above */}
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={cx(
                      "grid overflow-hidden transition-[grid-template-rows] duration-300 motion-reduce:transition-none",
                      isOpen ? "mt-3 grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.015] p-5 sm:p-6">
                        {stage.id === "listed" && (
                          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
                            <div>
                              <dt className={cx(STAT, "text-[#A1A1AA]")}>Category</dt>
                              <dd className="mt-1 text-sm font-semibold text-white">{TRACE_ITEM.category}</dd>
                            </div>
                            <div>
                              <dt className={cx(STAT, "text-[#A1A1AA]")}>Size</dt>
                              <dd className="mt-1 text-sm font-semibold text-white">{TRACE_ITEM.size}</dd>
                            </div>
                            <div>
                              <dt className={cx(STAT, "text-[#A1A1AA]")}>Photos submitted</dt>
                              <dd className={cx(NUM, "mt-1 text-sm font-semibold text-white")}>
                                {TRACE_ITEM.photosSubmitted}
                              </dd>
                            </div>
                            <div>
                              <dt className={cx(STAT, "text-[#A1A1AA]")}>Seller</dt>
                              <dd className="mt-1 text-sm font-semibold text-white">
                                {TRACE_ITEM.seller} · {TRACE_ITEM.sellerTrades} trades
                              </dd>
                            </div>
                          </dl>
                        )}

                        {stage.id === "verdict" && (
                          <div>
                            <p className={cx(STAT, "text-[#A1A1AA]")}>What the scan found</p>
                            <ul className="mt-3 flex flex-col gap-2">
                              {AI_VERDICT.findings.map((f) => (
                                <li key={f} className="text-sm font-normal leading-[1.6] text-white">
                                  · {f}
                                </li>
                              ))}
                            </ul>
                            <p className="mt-3 text-xs font-normal text-[#A1A1AA]">
                              Matched against {AI_VERDICT.archiveMatches} verified archive pattern for this house.
                            </p>
                          </div>
                        )}

                        {stage.id === "offer" && (
                          <div>
                            <p className={cx(STAT, "text-[#A1A1AA]")}>How the offer was built</p>
                            <dl className="mt-3 divide-y divide-white/10">
                              <div className="flex items-center justify-between py-2">
                                <dt className="text-sm font-normal text-[#A1A1AA]">Comparable high</dt>
                                <dd className={cx(NUM, "text-sm font-semibold text-white")}>
                                  {money(OFFER.compHigh)}
                                </dd>
                              </div>
                              {OFFER.deductions.map((d) => (
                                <div key={d.label} className="flex items-center justify-between py-2">
                                  <dt className="text-sm font-normal text-[#A1A1AA]">{d.label}</dt>
                                  <dd className={cx(NUM, "text-sm font-semibold text-[#fb7185]")}>
                                    -{money(d.amount)}
                                  </dd>
                                </div>
                              ))}
                              <div className="flex items-center justify-between py-2">
                                <dt className="text-sm font-semibold text-white">Offer to seller</dt>
                                <dd className={cx(NUM, "text-sm font-extrabold text-white")}>
                                  {money(OFFER_AMOUNT)}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        )}

                        {stage.id === "settlement" && (
                          <div>
                            <p className={cx(STAT, "text-[#A1A1AA]")}>Payout breakdown</p>
                            <dl className="mt-3 divide-y divide-white/10">
                              <div className="flex items-center justify-between py-2">
                                <dt className="text-sm font-normal text-[#A1A1AA]">Offer accepted</dt>
                                <dd className={cx(NUM, "text-sm font-semibold text-white")}>
                                  {money(OFFER_AMOUNT)}
                                </dd>
                              </div>
                              <div className="flex items-center justify-between py-2">
                                <dt className="text-sm font-normal text-[#A1A1AA]">Service fee (9%)</dt>
                                <dd className={cx(NUM, "text-sm font-semibold text-[#fb7185]")}>
                                  -{money(SERVICE_FEE)}
                                </dd>
                              </div>
                              <div className="flex items-center justify-between py-2">
                                <dt className="text-sm font-normal text-[#A1A1AA]">Processing fee</dt>
                                <dd className={cx(NUM, "text-sm font-semibold text-[#fb7185]")}>
                                  -{money(PROCESSING_FEE)}
                                </dd>
                              </div>
                              <div className="flex items-center justify-between py-2">
                                <dt className="text-sm font-semibold text-white">Net payout</dt>
                                <dd className={cx(NUM, "text-sm font-extrabold text-white")}>
                                  {money(NET_PAYOUT)}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
