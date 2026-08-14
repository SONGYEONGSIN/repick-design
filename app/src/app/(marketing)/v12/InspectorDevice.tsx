"use client";

import Image from "next/image";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  CAPTION,
  cx,
  FOCUS_RING,
  HERO_IMAGE,
  LAYERS,
  NUM,
  confidenceFor,
  verdictFor,
  type LayerId,
} from "./data";

/**
 * Hero device — the "Layer Inspector" toggles, photo and verdict/confidence readout. Toggling any
 * layer recomputes three independent, always-visible proof surfaces at once: the verdict badge, the
 * confidence meter, and the highlighted region(s) on the photo for the layers that have one. State
 * lives one level up (`HeroFold`) so the finding-text panel below can share it without duplicating
 * the toggle logic.
 */
export default function InspectorDevice({
  active,
  onToggle,
}: {
  active: LayerId[];
  onToggle: (id: LayerId) => void;
}) {
  const reduced = useReducedMotion();
  const verdict = verdictFor(active.length);
  const confidence = confidenceFor(active);
  const VerdictIcon = verdict.icon;

  return (
    <div className="flex flex-col gap-2.5 sm:gap-4">
      {/* toggle chips — real buttons, full keyboard reachability, state conveyed by icon + text */}
      <div role="group" aria-label="Inspection layers" className="flex flex-wrap gap-1.5 sm:gap-2">
        {LAYERS.map((layer) => {
          const isOn = active.includes(layer.id);
          const Icon = layer.icon;
          return (
            <button
              key={layer.id}
              type="button"
              aria-pressed={isOn}
              onClick={() => onToggle(layer.id)}
              className={cx(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold transition-colors duration-150 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs",
                isOn
                  ? "border-transparent bg-[#6E56CF] text-white"
                  : "border-white/15 bg-white/[0.02] text-[#A1A1AA] hover:text-white",
                FOCUS_RING,
              )}
            >
              <Icon aria-hidden="true" className={cx("size-3", isOn ? "text-white" : "text-[#B6A6F0]")} />
              {layer.short}
              <span className="sr-only">{isOn ? ", layer on" : ", layer off"}</span>
            </button>
          );
        })}
      </div>

      {/* photo — fixed aspect + reserved background so a slow/failed load never collapses layout.
          Shorter on phones (keeps the fold's mandatory cards reachable without a scroll), the usual
          16:9 device frame from `sm` up. */}
      <div className="relative aspect-[2.2/1] w-full overflow-hidden rounded-lg border border-white/10 bg-[#111116] sm:aspect-video">
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          priority
          sizes="(min-width: 1024px) 620px, 100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0B0F]/55 via-transparent to-transparent"
        />

        <AnimatePresence initial={false}>
          {LAYERS.filter((l) => l.region && active.includes(l.id)).map((layer) => (
            <motion.div
              key={layer.id}
              initial={reduced ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
              transition={{ duration: reduced ? 0 : 0.25, ease: "easeOut" }}
              style={{
                top: `${layer.region!.top}%`,
                left: `${layer.region!.left}%`,
                width: `${layer.region!.width}%`,
                height: `${layer.region!.height}%`,
              }}
              className="pointer-events-none absolute rounded-md border-2 border-[#B6A6F0]"
            >
              <span className="absolute -top-5 left-0 whitespace-nowrap rounded border border-[#B6A6F0]/60 bg-[#0B0B0F]/90 px-1 py-0.5 text-[0.6rem] font-semibold text-[#B6A6F0] sm:-top-6 sm:px-1.5 sm:text-[0.65rem]">
                {layer.short}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* verdict + confidence meter — always visible, both driven by the same toggle state */}
      <div className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-2.5 sm:gap-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          <span
            className={cx(
              "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.7rem] font-semibold sm:px-2.5 sm:py-1 sm:text-xs",
              verdict.filled ? "bg-[#6E56CF] text-white" : "border border-white/20 text-white",
            )}
          >
            <VerdictIcon aria-hidden="true" className={cx("size-3.5", verdict.filled ? "text-white" : "text-[#B6A6F0]")} />
            {verdict.label}
          </span>
          <span className={cx(CAPTION, "text-[#A1A1AA]")}>
            {active.length} of {LAYERS.length} layers on
          </span>
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-2">
            <span className={cx(CAPTION, "text-[#A1A1AA]")}>Confidence</span>
            <span className={cx("text-sm font-semibold text-white", NUM)}>{confidence}%</span>
          </div>
          <div
            role="img"
            aria-label={`Inspection confidence: ${confidence} percent, from ${active.length} of ${LAYERS.length} layers`}
            className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10 sm:mt-1.5 sm:h-2"
          >
            <motion.div
              className="h-full rounded-full bg-[#6E56CF]"
              animate={{ width: `${confidence}%` }}
              transition={{ duration: reduced ? 0 : 0.35, ease: "easeOut" }}
            />
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          {verdict.label}. Inspection confidence {confidence} percent, {active.length} of{" "}
          {LAYERS.length} layers active.
        </p>
      </div>
    </div>
  );
}
