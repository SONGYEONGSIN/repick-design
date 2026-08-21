"use client";

import { useId, useMemo, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import {
  CALC_CATEGORIES,
  CALC_GRADES,
  DEFAULT_CATEGORY,
  DEFAULT_GRADE,
  estimateOffer,
  settle,
  money,
  cx,
  EYEBROW,
  STAT,
  NUM,
  FOCUS,
} from "./data";

/**
 * The closing form: category + condition drive a live payout estimate through the exact same
 * `settle()` function the timeline's settlement stage used, so the number here is arithmetic, not a
 * second, independently-typed guess. Selecting a new option updates the estimate immediately and the
 * change is announced (`aria-live="polite"`) for screen reader users who can't see the panel update.
 */
export default function PayoutCalculator() {
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [grade, setGrade] = useState(DEFAULT_GRADE);
  const [submitted, setSubmitted] = useState(false);
  const formId = useId();

  const point = estimateOffer(category, grade);
  const low = Math.round(point * 0.95);
  const high = Math.round(point * 1.05);
  const { fee, net } = useMemo(() => settle(point), [point]);
  const netLow = useMemo(() => settle(low).net, [low]);
  const netHigh = useMemo(() => settle(high).net, [high]);

  return (
    <section
      id="estimate"
      aria-labelledby="estimate-title"
      className="border-b border-white/10 bg-[#0B0C10] py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className={cx(EYEBROW, "text-[#22d3ee]")}>Estimate your payout</p>
            <h2
              id="estimate-title"
              className="mt-3 text-[clamp(1.6rem,3.2vw,2.2rem)] font-extrabold leading-[1.15] tracking-[-0.015em] text-white"
            >
              See what your own item would settle at.
            </h2>
            <p className="mt-4 max-w-[460px] text-[0.95rem] font-normal leading-[1.65] text-[#A1A1AA]">
              Pick the closest category and condition. This runs the same
              formula the settlement step above just showed you, not a
              separate guess.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`${formId}-category`}
                    className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#A1A1AA]"
                  >
                    Category
                  </label>
                  <select
                    id={`${formId}-category`}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={cx(
                      "mt-2 w-full rounded-lg border border-white/15 bg-[#14151C] px-3 py-2.5 text-sm font-semibold text-white",
                      FOCUS,
                    )}
                  >
                    {CALC_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor={`${formId}-grade`}
                    className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#A1A1AA]"
                  >
                    Condition
                  </label>
                  <select
                    id={`${formId}-grade`}
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className={cx(
                      "mt-2 w-full rounded-lg border border-white/15 bg-[#14151C] px-3 py-2.5 text-sm font-semibold text-white",
                      FOCUS,
                    )}
                  >
                    {CALC_GRADES.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* live estimate — recalculates on every select change */}
              <div
                aria-live="polite"
                className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-white/10 bg-[#14151C] p-5 sm:grid-cols-3"
              >
                <div>
                  <p className={cx(STAT, "text-[#A1A1AA]")}>Estimated offer</p>
                  <p className={cx(NUM, "mt-1 text-lg font-extrabold text-white")}>
                    {money(low)}–{money(high)}
                  </p>
                </div>
                <div>
                  <p className={cx(STAT, "text-[#A1A1AA]")}>Service fee (9%)</p>
                  <p className={cx(NUM, "mt-1 text-lg font-extrabold text-[#fb7185]")}>
                    -{money(fee)}
                  </p>
                </div>
                <div>
                  <p className={cx(STAT, "text-[#A1A1AA]")}>Estimated net payout</p>
                  <p className={cx(NUM, "mt-1 text-lg font-extrabold text-[#22d3ee]")}>
                    {money(netLow)}–{money(netHigh)}
                  </p>
                </div>
              </div>
              <p className="mt-2 max-w-[370px] text-xs font-normal text-[#A1A1AA]">
                Point estimate {money(point)}, net {money(net)} after the flat $2
                processing fee — the range above just widens it ±5% for
                unphotographed wear.
              </p>

              {/* the form / cta itself */}
              {submitted ? (
                <p role="status" className="mt-6 flex items-center gap-2 text-sm font-semibold text-white">
                  <Check className="h-4 w-4 text-[#22d3ee]" aria-hidden />
                  Sent — check your inbox for this estimate.
                </p>
              ) : (
                <form
                  className="mt-6 flex flex-col gap-3 sm:flex-row"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <div className="flex-1">
                    <label htmlFor={`${formId}-email`} className="sr-only">
                      Email address
                    </label>
                    <input
                      id={`${formId}-email`}
                      type="email"
                      required
                      placeholder="you@example.com"
                      className={cx(
                        "w-full rounded-full border border-white/15 bg-[#14151C] px-4 py-2.5 text-sm font-normal text-white placeholder:text-[#71717A]",
                        FOCUS,
                      )}
                    />
                  </div>
                  <button
                    type="submit"
                    className={cx(
                      "inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#0e7490] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#0b5d73]",
                      FOCUS,
                    )}
                  >
                    Send me this estimate
                    <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
