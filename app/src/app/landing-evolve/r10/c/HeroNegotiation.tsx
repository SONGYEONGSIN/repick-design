"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MessageSquareText, Percent, TrendingDown } from "lucide-react";

import {
  ASKING_PRICE,
  FOCUS,
  cx,
  likelihoodFor,
  money,
  offerFor,
  savingsFor,
  savingsPctFor,
  toneForValue,
} from "./data";
import ProductStrip from "./ProductStrip";

const DEFAULT_TONE = 45;

/**
 * Hero — a live negotiation console. Moving the tone slider recomputes three proof surfaces at
 * once: the drafted message text, the estimated dollar savings, and the seller's estimated accept
 * odds. The odds fall as the requested savings rise, so the two numbers move in real, legible
 * opposite directions rather than one number nudging alone.
 */
export default function HeroNegotiation() {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(DEFAULT_TONE);
  const sliderId = useId();

  const tone = toneForValue(value);
  const offer = offerFor(value);
  const savings = savingsFor(value);
  const savingsPct = savingsPctFor(value);
  const likelihood = likelihoodFor(value);
  const message = tone.message(offer);

  function jumpToStrip(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    document
      .getElementById("strip")
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }

  return (
    <section aria-labelledby="hero-title" className="border-b border-white/10 bg-[#0B0B0F]">
      <div className="mx-auto w-full max-w-[1120px] px-5 pt-9 pb-8 sm:px-8 sm:pt-12 sm:pb-10 md:pt-16 md:pb-14 lg:pt-20 lg:pb-16">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-10">
          {/* copy column */}
          <div className="flex min-w-0 flex-col lg:col-span-6">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#B6A6F0]">
              repick · AI negotiation console
            </p>
            <h1
              id="hero-title"
              className="mt-3 text-[clamp(1.95rem,5.4vw,3.75rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-white sm:mt-4"
              style={{ fontFamily: "var(--font-display-grotesk)" }}
            >
              Set the tone.
              <br />
              The offer writes itself.
            </h1>
            <p className="mt-3 max-w-[46ch] text-base font-normal leading-[1.6] text-[#A1A1AA] sm:mt-5">
              Drag the slider — repick rewrites your offer to the seller live, with the savings and
              accept odds attached.
            </p>
            <a
              href="#strip"
              onClick={jumpToStrip}
              className={cx(
                "mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#6E56CF] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#7d67d6] sm:mt-7",
                FOCUS,
              )}
            >
              See live matches
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          </div>

          {/* negotiation console */}
          <div className="min-w-0 lg:col-span-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#A1A1AA]">
                  Drafting an offer · {money(ASKING_PRICE)} listing
                </p>
                <MessageSquareText aria-hidden="true" className="size-4 shrink-0 text-[#B6A6F0]" />
              </div>

              <div className="mt-3 min-h-[72px] rounded-xl border border-white/10 bg-[#0B0B0F] p-3 sm:mt-4 sm:min-h-[92px] sm:p-4">
                <motion.p
                  key={tone.id}
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="text-sm font-normal leading-[1.5] text-white sm:leading-[1.6]"
                >
                  {message}
                </motion.p>
              </div>

              <div className="mt-4 sm:mt-5">
                <label
                  htmlFor={sliderId}
                  className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#A1A1AA]"
                >
                  Negotiation tone
                </label>
                <div className="mt-2 flex items-center justify-between text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#A1A1AA]">
                  <span>Polite</span>
                  <span className="text-[#B6A6F0]">{tone.label}</span>
                  <span>Assertive</span>
                </div>
                <input
                  id={sliderId}
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  aria-valuetext={`${tone.label}. Offer ${money(offer)}, estimated savings ${savingsPct} percent, ${likelihood} percent chance the seller accepts.`}
                  className={cx(
                    "mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#6E56CF]",
                    FOCUS,
                  )}
                />
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-3 sm:mt-5 sm:pt-4">
                <div className="min-w-0">
                  <dt className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[#A1A1AA]">
                    <TrendingDown aria-hidden="true" className="size-3.5 shrink-0 text-[#B6A6F0]" />
                    Est. savings
                  </dt>
                  <dd
                    className="mt-1 text-2xl font-extrabold leading-none tabular-nums text-[#6E56CF]"
                    style={{ fontFamily: "var(--font-display-grotesk)" }}
                  >
                    {money(savings)}{" "}
                    <span className="text-sm font-semibold text-[#A1A1AA]">· {savingsPct}%</span>
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[#A1A1AA]">
                    <Percent aria-hidden="true" className="size-3.5 shrink-0 text-[#B6A6F0]" />
                    Accept odds
                  </dt>
                  <dd
                    className="mt-1 text-2xl font-extrabold leading-none tabular-nums text-[#6E56CF]"
                    style={{ fontFamily: "var(--font-display-grotesk)" }}
                  >
                    {likelihood}%
                  </dd>
                </div>
              </dl>

              <p aria-live="polite" className="sr-only">
                {tone.label} tone. Offer {money(offer)}. Estimated savings {savingsPct} percent.{" "}
                {likelihood} percent chance the seller accepts.
              </p>
            </div>
          </div>
        </div>

        <ProductStrip />
      </div>
    </section>
  );
}
