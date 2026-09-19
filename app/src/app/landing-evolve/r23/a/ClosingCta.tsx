"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, CircleAlert, CircleCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  EYEBROW,
  FOCUS,
  STAGES,
  discountPct,
  gradeForStage,
  money,
  priceLabel,
  rangeWidth,
} from "./data";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function ClosingCta({ stageIndex }: { stageIndex: number }) {
  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState<"idle" | "ok" | "error">("idle");

  const baseline = STAGES[0];
  const live = STAGES[stageIndex];
  const grade = gradeForStage(live);
  const confidenceDelta = live.confidence - baseline.confidence;
  const widthDelta = rangeWidth(baseline) - rangeWidth(live);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEmailState(EMAIL_RE.test(email) ? "ok" : "error");
  }

  return (
    <section id="start" className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto w-full max-w-[1240px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="min-w-0 lg:col-span-6">
            <p className={EYEBROW}>YOUR TURN</p>
            <h2
              className="mt-4 text-[clamp(1.9rem,4.4vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.01em] text-white"
              style={{ fontFamily: "var(--font-display-grotesk)" }}
            >
              Every listing can run this pipeline.
            </h2>
            <p className="mt-5 max-w-[493px] text-[15px] font-normal leading-[1.6] text-zinc-400">
              You&rsquo;re currently viewing stage{" "}
              <span className="tabular-nums">
                {live.index + 1} of {STAGES.length}
              </span>{" "}
              &mdash; {live.fullLabel}. At this point the overcoat sits at{" "}
              <span className="font-semibold text-white tabular-nums">{live.confidence}% confidence</span>,
              graded <span className="font-semibold text-white">{grade}</span>, priced{" "}
              <span className="font-semibold text-white tabular-nums">{priceLabel(live)}</span> (
              <span className="tabular-nums">{discountPct(live)}%</span> off retail).
            </p>
            <p className="mt-3 max-w-[493px] text-[13px] font-normal leading-[1.6] text-zinc-400" aria-live="polite">
              {stageIndex === 0 ? (
                "This is where every listing starts. Scrub the pipeline above to watch the numbers move."
              ) : (
                <>
                  That&rsquo;s <span className="tabular-nums">+{confidenceDelta}pp</span> more confidence
                  and a <span className="tabular-nums">{money(widthDelta)}</span> tighter price band than
                  an ungraded, self-reported listing.
                </>
              )}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#hero"
                className={`inline-flex items-center gap-2 rounded-full bg-[#7A5F28] px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#63491E] ${FOCUS}`}
              >
                Rewatch the pipeline
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </Reveal>

          <Reveal className="min-w-0 lg:col-span-6">
            <div className="rounded-2xl border border-white/10 bg-[#111116] p-6 sm:p-8">
              <p className="text-[13px] font-semibold text-white">Start your own listing</p>
              <p className="mt-1.5 max-w-[431px] text-[13px] font-normal leading-[1.55] text-zinc-400">
                No account is required to see your item&rsquo;s intake estimate.
              </p>
              <form onSubmit={handleSubmit} className="mt-5" noValidate>
                <label htmlFor="notify-email" className="text-[12px] font-normal text-zinc-400">
                  Work email
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
                    className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#7A5F28] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#63491E] ${FOCUS}`}
                  >
                    List an item
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <p id="notify-email-msg" className="mt-2 flex items-center gap-1.5 text-[12px] font-normal text-zinc-400" aria-live="polite">
                  {emailState === "ok" && (
                    <>
                      <CircleCheck className="h-3.5 w-3.5 shrink-0 text-[#D9BE84]" aria-hidden="true" />
                      You&rsquo;re in &mdash; check your inbox to start the intake step.
                    </>
                  )}
                  {emailState === "error" && (
                    <>
                      <CircleAlert className="h-3.5 w-3.5 shrink-0 text-white" aria-hidden="true" />
                      Enter a full email address, like you@example.com.
                    </>
                  )}
                  {emailState === "idle" && "We only email you about this listing's pipeline."}
                </p>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
