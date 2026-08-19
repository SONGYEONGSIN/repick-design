"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import CertificateCard from "./CertificateCard";
import { LISTINGS, CAPTION, cx, FOCUS } from "./data";

/**
 * Photo + certificate side by side, with a tab strip that swaps which
 * listing is under appraisal. Switching tabs re-renders both the product
 * photo and the entire `CertificateCard` (keyed by listing id) so every
 * number on the page — grade, match tags, discount — is a real recalculation
 * for the new item, not a decorative skin change. This is the "manipulation
 * updates real proof data live" interaction the brief requires, distinct
 * from the certificate's own stamp-reveal animation.
 */
export default function HeroSwitcher() {
  const [activeId, setActiveId] = useState(LISTINGS[0].id);
  const reduced = useReducedMotion();
  const active = LISTINGS.find((l) => l.id === activeId) ?? LISTINGS[0];

  return (
    <div>
      {/* tab strip — real buttons, aria-pressed announces state; not a
          roving-tabindex widget, so no extra keyboard pattern to maintain */}
      <div role="group" aria-label="Choose a listing to appraise" className="flex flex-wrap gap-2">
        {LISTINGS.map((l) => {
          const isActive = l.id === activeId;
          return (
            <button
              key={l.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveId(l.id)}
              className={cx(
                "rounded-full border px-3.5 py-1.5 text-[0.78rem] font-semibold transition-colors duration-150",
                isActive
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-950",
                FOCUS,
              )}
            >
              {l.tabLabel}
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        Now appraising: {active.title}, grade {active.grade}, {active.discount}% off.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.15fr] lg:items-stretch">
        {/* product photo — fixed aspect-ratio + reserved background so a
            slow/failed load never collapses the layout. No badge, grade, or
            discount is ever placed on top of it (design-principles §Landing
            구조 기본형 2) — the caption below is plain identification text,
            not proof, and sits in normal flow so it cannot collide with a
            broken-image alt string. */}
        <div className="flex min-w-0 flex-col gap-3">
          <motion.div
            key={`photo-${active.id}`}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100"
          >
            <Image
              src={active.image}
              alt={active.alt}
              fill
              priority
              sizes="(min-width: 1024px) 420px, 100vw"
              className="object-cover"
            />
          </motion.div>
          <div>
            <p className="text-sm font-semibold text-zinc-950">{active.title}</p>
            <p className={cx(CAPTION, "mt-0.5 text-zinc-600")}>{active.brand}</p>
          </div>
        </div>

        <CertificateCard key={active.id} listing={active} />
      </div>
    </div>
  );
}
