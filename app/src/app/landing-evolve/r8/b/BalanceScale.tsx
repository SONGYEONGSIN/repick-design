"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Award, BadgeCheck } from "lucide-react";
import {
  CRITERIA,
  DEFAULT_LEVELS,
  GENERIC_LISTING,
  REPICK_PICK,
  computeAngle,
  computeMatch,
  cx,
  CAPTION,
  NUM,
  EASE,
  type CriterionId,
  type LevelState,
} from "./data";

// Stylized, not literal physics: how many percentage-points of the stage's
// own height each pan drifts per radian of beam tilt. Pure Math.sin — no
// randomness, no wall-clock — so a given angle always yields the same drift.
const DY_SCALE = 50;

/**
 * "Counterweight" — a horizontal balance beam that tips toward whichever
 * pan carries more evidence. The left pan is a generic secondhand listing
 * (a price, nothing else). The right pan is repick's AI match for the same
 * item: match%, condition grade, verified-seller badge, and the real
 * before/after discount, all visible at rest. Three keyboard-operable
 * priority toggles beneath the scale let the visitor re-weigh style,
 * budget, and condition — every change recomputes both the match% and the
 * beam's tilt from the same deterministic formula (see data.ts), so the
 * beam is never a decorative animation, only ever a readout of real numbers.
 *
 * The tip-in itself only plays once the stage has scrolled into view
 * (onViewportEnter, not on mount) and animates rotate/opacity only, gated
 * behind prefers-reduced-motion.
 */
export default function BalanceScale() {
  const reduced = useReducedMotion();
  const [levels, setLevels] = useState<LevelState>(DEFAULT_LEVELS);
  const [entered, setEntered] = useState(false);

  const match = useMemo(() => computeMatch(levels), [levels]);
  const angle = useMemo(() => computeAngle(match), [match]);
  const dyPercent = useMemo(
    () => DY_SCALE * Math.sin((angle * Math.PI) / 180),
    [angle],
  );

  const showTip = reduced || entered;
  const beamAngle = showTip ? angle : 0;
  const armDy = showTip ? dyPercent : 0;

  const setLevel = (id: CriterionId, idx: number) =>
    setLevels((prev) => ({ ...prev, [id]: idx }));

  return (
    <div className="flex flex-col gap-7">
      {/* stage */}
      <motion.div
        onViewportEnter={() => setEntered(true)}
        viewport={{ once: true, margin: "-100px" }}
        className="relative aspect-[10/7] w-full select-none"
      >
        {/* fulcrum */}
        <div
          aria-hidden
          className="absolute left-1/2 top-[36%] h-0 w-0 -translate-x-1/2 border-x-[10px] border-t-[16px] border-x-transparent border-t-white/20"
        />
        <div
          aria-hidden
          className="absolute left-1/2 top-[calc(36%+15px)] h-px w-16 -translate-x-1/2 bg-white/15"
        />

        {/* beam — rotate + opacity only, plays once on scroll-into-view,
            then re-plays purely from state changes below */}
        <motion.div
          aria-hidden
          initial={{ rotate: 0, opacity: reduced ? 1 : 0.4 }}
          animate={{ rotate: beamAngle, opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.9, ease: EASE }}
          style={{ transformOrigin: "50% 50%" }}
          className="absolute left-[8%] top-[36%] h-[2px] w-[84%] -translate-y-1/2 rounded-full bg-gradient-to-r from-white/10 via-white/45 to-white/10"
        />

        {/* left pan — generic listing: sparse, plain, deliberately small */}
        <div
          className="absolute w-[36%] -translate-x-1/2 transition-[top] duration-500 ease-out"
          style={{ left: "15%", top: `${36 - armDy}%` }}
        >
          <div className="mx-auto flex flex-col items-center">
            <span aria-hidden className="h-6 w-px bg-white/15" />
            <div className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-3 text-center">
              <p className={cx(CAPTION, "text-[#71717a]")}>{GENERIC_LISTING.label}</p>
              <p className="mt-2 text-lg font-extrabold text-white/60">
                ${GENERIC_LISTING.price}
              </p>
              <p className="mt-1.5 text-[0.65rem] font-normal leading-snug text-[#71717a]">
                {GENERIC_LISTING.meta}
              </p>
            </div>
          </div>
        </div>

        {/* right pan — repick AI match: match%, grade, verified badge,
            before/after discount, all present regardless of toggle state */}
        <div
          className="absolute left-[74%] w-[46%] -translate-x-1/2 transition-[top] duration-500 ease-out sm:left-[85%]"
          style={{ top: `${36 + armDy}%` }}
        >
          <div className="mx-auto flex flex-col items-center">
            <span aria-hidden className="h-6 w-px bg-[#6E56CF]/50" />
            <div className="w-full rounded-lg border border-[#6E56CF]/40 bg-[#6E56CF]/[0.09] p-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className={cx(CAPTION, "text-[#a894f7]")}>{REPICK_PICK.label}</span>
                <span className={cx("text-base font-extrabold text-white", NUM)}>
                  {match}%
                </span>
              </div>
              <p className="mt-1.5 truncate text-[0.8rem] font-semibold text-white">
                {REPICK_PICK.title}
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-[#0B0B0F]/50 px-1.5 py-0.5 text-[0.62rem] font-semibold text-white">
                  <Award className="h-3 w-3" aria-hidden />
                  {REPICK_PICK.grade} grade
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-[#0B0B0F]/50 px-1.5 py-0.5 text-[0.62rem] font-semibold text-white">
                  <BadgeCheck className="h-3 w-3 text-[#6E56CF]" aria-hidden />
                  Verified
                </span>
              </div>
              <div className="mt-2.5 flex items-baseline gap-1.5 border-t border-white/10 pt-2.5">
                <span className={cx("text-base font-extrabold text-white", NUM)}>
                  ${REPICK_PICK.price}
                </span>
                <span
                  className={cx(
                    "text-[0.65rem] font-normal text-[#A1A1AA] line-through",
                    NUM,
                  )}
                >
                  ${REPICK_PICK.original}
                </span>
                <span
                  className={cx(
                    "ml-auto rounded bg-[#6E56CF] px-1.5 py-0.5 text-[0.62rem] font-semibold text-white",
                    NUM,
                  )}
                >
                  -{REPICK_PICK.discount}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* screen-reader readout of the live recompute (visual number is
          decorative to AT since it's already inside the labelled pan) */}
      <p className="sr-only" aria-live="polite">
        Current match {match} percent. Beam tips {angle} degrees toward the
        repick pick.
      </p>

      {/* weighted priority controls — native radios, fully keyboard operable */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        <p className={cx(CAPTION, "text-[#A1A1AA]")}>Weigh what matters to you</p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CRITERIA.map((c) => (
            <fieldset key={c.id} className="min-w-0">
              <legend className="text-xs font-semibold text-white">{c.label}</legend>
              <div
                className="mt-2 flex gap-1.5"
                role="radiogroup"
                aria-label={`${c.label} priority`}
              >
                {c.levels.map((lvl, idx) => {
                  const checked = levels[c.id] === idx;
                  return (
                    <label
                      key={lvl.id}
                      className={cx(
                        "relative flex-1 cursor-pointer rounded-md border px-1.5 py-1.5 text-center text-[0.64rem] font-semibold transition-colors duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#6E56CF] has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-[#0B0B0F]",
                        checked
                          ? "border-[#6E56CF] bg-[#6E56CF] text-white"
                          : "border-white/15 text-[#A1A1AA] hover:border-white/30 hover:text-white",
                      )}
                    >
                      <input
                        type="radio"
                        name={c.id}
                        value={lvl.id}
                        checked={checked}
                        onChange={() => setLevel(c.id, idx)}
                        className="sr-only"
                      />
                      {lvl.label.replace(" priority", "")}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
      </div>
    </div>
  );
}
