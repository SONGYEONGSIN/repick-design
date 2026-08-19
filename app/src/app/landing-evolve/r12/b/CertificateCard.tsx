"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ShieldCheck, Award, Target, BadgeCheck } from "lucide-react";
import type { Listing } from "./data";
import { CAPTION, NUM, STAMP_STEP, comma, cx } from "./data";

/**
 * The "appraisal certificate" itself — four findings (authenticity, grade,
 * AI-match reasoning, price) plus a closing seal, each its own row (never an
 * overlay on the photo — design-principles §Landing 구조 기본형 2). Mounting a
 * fresh `<CertificateCard key={listing.id} .../>` on every tab switch is what
 * replays the stamp sequence: React tears down the old instance and the new
 * one runs `initial="hidden" -> animate="show"` from scratch, so the reveal
 * fires both on first paint (the certificate is already inside the hero fold,
 * so this reads as the scroll-triggered reveal the brief asks for) and again
 * every time the visitor re-certifies a different listing.
 *
 * Every row is real content at rest, not something a screen reader or
 * no-JS visitor would miss — the animation only supplies the entrance
 * offset; `motion-reduce` (via useReducedMotion) skips straight to the
 * settled state, never leaving anything at opacity:0.
 */
export default function CertificateCard({ listing }: { listing: Listing }) {
  const reduced = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduced ? 0 : STAMP_STEP, delayChildren: 0.05 },
    },
  };
  const row: Variants = {
    hidden: reduced ? { opacity: 1 } : { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  };
  // Fixed (not random) rotation per stamp so the "ink" looks hand-applied
  // without breaking determinism — fixed as module-level SEAL constants below
  // rather than computed, matching the SVG-rotation rounding rule in spirit.
  const stamp = (deg: number): Variants => ({
    hidden: reduced ? { opacity: 1, scale: 1, rotate: deg } : { opacity: 0, scale: 0.5, rotate: deg - 10 },
    show: {
      opacity: 1,
      scale: 1,
      rotate: deg,
      transition: { duration: 0.35, ease: "easeOut", delay: reduced ? 0 : 0.08 },
    },
  });

  return (
    <div className="flex h-full min-w-0 flex-col rounded-2xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-3 border-b border-zinc-200 px-5 pt-5 pb-4 sm:px-6">
        <div>
          <p className={cx(CAPTION, "text-zinc-600")}>Certificate of condition</p>
          <p className={cx("mt-1 text-xs font-normal text-zinc-600", NUM)}>No. {listing.certNo}</p>
        </div>
        <span
          className={cx(
            "shrink-0 rounded-full border border-emerald-700 bg-emerald-700 px-2.5 py-1 text-xs font-semibold text-white",
            NUM,
          )}
        >
          Grade {listing.grade} · {listing.score}
        </span>
      </div>

      <motion.ul
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-1 flex-col divide-y divide-zinc-100 px-5 sm:px-6"
      >
        {/* 1 — authenticity */}
        <motion.li variants={row} className="flex items-start gap-3 py-4">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className={cx(CAPTION, "text-zinc-600")}>Authenticity</p>
            <p className="mt-1 text-sm font-semibold text-zinc-950">Verified authentic</p>
            <p className="mt-1 text-[0.8rem] font-normal leading-[1.6] text-zinc-600">
              {listing.authenticityDetail}
            </p>
          </div>
          <motion.span
            variants={stamp(-6)}
            className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded border border-emerald-700 px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-emerald-700"
          >
            Pass
          </motion.span>
        </motion.li>

        {/* 2 — condition grade */}
        <motion.li variants={row} className="flex items-start gap-3 py-4">
          <Award className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className={cx(CAPTION, "text-zinc-600")}>Condition grade</p>
            <p className="mt-1 text-sm font-semibold text-zinc-950">{listing.gradeLabel}</p>
          </div>
          <motion.span
            variants={stamp(4)}
            className={cx(
              "mt-0.5 inline-flex shrink-0 items-center gap-1 rounded border border-emerald-700 px-1.5 py-0.5 text-[0.65rem] font-semibold text-emerald-700",
              NUM,
            )}
          >
            {listing.score}/100
          </motion.span>
        </motion.li>

        {/* 3 — AI match reasoning */}
        <motion.li variants={row} className="flex items-start gap-3 py-4">
          <Target className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className={cx(CAPTION, "text-zinc-600")}>AI match reasoning</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {listing.matchTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[0.72rem] font-normal text-zinc-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <motion.span
            variants={stamp(-3)}
            className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded border border-emerald-700 px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-emerald-700"
          >
            Pass
          </motion.span>
        </motion.li>

        {/* 4 — price / discount */}
        <motion.li variants={row} className="flex items-start justify-between gap-3 py-4">
          <div className="min-w-0 flex-1">
            <p className={cx(CAPTION, "text-zinc-600")}>Price</p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className={cx("text-lg font-extrabold text-zinc-950", NUM)}>
                ${comma(listing.price)}
              </span>
              <span className={cx("text-xs font-normal text-zinc-600 line-through", NUM)}>
                ${comma(listing.original)}
              </span>
            </p>
          </div>
          <motion.span
            variants={stamp(5)}
            className={cx(
              "mt-0.5 shrink-0 rounded bg-emerald-700 px-2 py-1 text-xs font-semibold text-white",
              NUM,
            )}
          >
            -{listing.discount}%
          </motion.span>
        </motion.li>

        {/* closing seal */}
        <motion.li variants={row} className="flex items-center justify-center gap-2 py-4">
          <motion.span
            variants={stamp(-4)}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-emerald-700 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-emerald-700"
          >
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
            Certified by repick AI
          </motion.span>
        </motion.li>
      </motion.ul>
    </div>
  );
}
