"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Banknote } from "lucide-react";
import { formatPct, formatUsd } from "./data";
import { ACCENT_FILL, ACCENT_TINT_TEXT, CAPTION, DISPLAY, MUTED_TEXT, ON_ACCENT_TEXT } from "./tokens";
import { useMounted } from "./useMounted";

interface CreditStackProps {
  price: number;
  credit: number;
  conditionLabel: string;
  multiplier: number;
  liveRegionId: string;
}

const UNIT = 20; // each icon in the pictogram represents $20
const MAX_ICONS = 18; // caps the row at the slider's ceiling ($360 / $20) so it never overflows

/**
 * The proof device: an icon-array (isotype) pictogram, not a bar/dumbbell chart, not a radial
 * gauge, not a receipt line-item list and not a rung ladder. Two rows of discrete bill icons —
 * one ghost row sized to the original price, one filled row sized to the live credit — sit
 * beside a tabular-nums number readout that is the real accessible content. The icon count is
 * aria-hidden decoration; every number it illustrates is also printed in text right next to it,
 * so color/shape is never the only signal and nothing here depends on counting icons.
 */
export function CreditStack({ price, credit, conditionLabel, multiplier, liveRegionId }: CreditStackProps) {
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();
  const shouldAnimate = mounted && !reduceMotion;

  const priceIcons = Math.min(MAX_ICONS, Math.max(1, Math.round(price / UNIT)));
  const creditIcons = Math.min(MAX_ICONS, Math.max(1, Math.round(credit / UNIT)));

  return (
    <div className="rounded-2xl border border-white/10 bg-[#15151C] p-5 sm:p-6">
      <div className="flex flex-col gap-4">
        <IconRow
          label="What you paid"
          value={formatUsd(price)}
          count={priceIcons}
          tone="ghost"
          shouldAnimate={shouldAnimate}
        />
        <IconRow
          label="Your repick credit now"
          value={formatUsd(credit)}
          count={creditIcons}
          tone="accent"
          shouldAnimate={shouldAnimate}
        />

        <div className="mt-1 flex flex-wrap items-end justify-between gap-3 border-t border-dashed border-white/10 pt-4">
          <div>
            <p className={`${CAPTION} ${MUTED_TEXT}`}>At {conditionLabel} condition</p>
            <p id={liveRegionId} aria-live="polite" className="mt-1 flex items-baseline gap-2">
              <motion.span
                key={credit}
                initial={shouldAnimate ? { opacity: 0, y: 6 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className={`${DISPLAY} text-[clamp(2rem,4.5vw,2.75rem)] font-extrabold leading-none tabular-nums text-[#F5F5F7]`}
              >
                {formatUsd(credit)}
              </motion.span>
              <span className={`text-sm font-semibold tabular-nums ${ACCENT_TINT_TEXT}`}>
                {formatPct(multiplier)} back
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconRow({
  label,
  value,
  count,
  tone,
  shouldAnimate,
}: {
  label: string;
  value: string;
  count: number;
  tone: "ghost" | "accent";
  shouldAnimate: boolean;
}) {
  const icons = Array.from({ length: count }, (_, i) => i);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className={`${CAPTION} ${MUTED_TEXT}`}>{label}</span>
        <span className="text-sm font-semibold tabular-nums text-[#F5F5F7]">{value}</span>
      </div>
      <div aria-hidden="true" className="flex flex-wrap gap-1">
        {icons.map((i) => (
          <motion.span
            key={i}
            layout={shouldAnimate}
            initial={shouldAnimate ? { opacity: 0, scale: 0.6 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.18, delay: shouldAnimate ? i * 0.012 : 0 }}
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${
              tone === "accent" ? ACCENT_FILL : "border border-white/20"
            }`}
          >
            <Banknote
              className={`h-3 w-3 ${tone === "accent" ? ON_ACCENT_TEXT : "text-white/40"}`}
              strokeWidth={2.25}
            />
          </motion.span>
        ))}
      </div>
    </div>
  );
}
