"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import ClosingCta from "./ClosingCta";
import Hero from "./Hero";
import ProductPreview from "./ProductPreview";
import SocialProof from "./SocialProof";
import ValueSplit from "./ValueSplit";
import { DEFAULT_PERSONA, personaById, type PersonaId } from "./data";
import { ACCENT_BRIGHT, DISPLAY, SKIP_LINK, useMounted } from "./ui";

/**
 * Top-level orchestrator. One piece of state -- the selected seller persona -- is lifted here and
 * passed down to every section that cites persona-derived numbers (Hero, ValueSplit, ClosingCta),
 * so a single selection in the Hero's segmented control recomputes all of them from the same
 * source of truth in data.ts. The thin top progress bar is the scroll-linked connective tissue
 * between sections; it is purely decorative (no content depends on it) and is skipped entirely
 * under prefers-reduced-motion rather than rendered inert.
 */
export default function Client() {
  const [personaId, setPersonaId] = useState<PersonaId>(DEFAULT_PERSONA);
  const containerRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0B0B0F] text-zinc-100">
      <a href="#main" className={SKIP_LINK}>
        Skip to content
      </a>

      {mounted && !reduceMotion && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left"
          style={{ backgroundColor: ACCENT_BRIGHT, scaleX: scrollYProgress }}
        />
      )}

      <SiteHeader personaId={personaId} />

      <main id="main">
        <Hero personaId={personaId} onChangePersona={setPersonaId} />
        <ProductPreview />
        <ValueSplit personaId={personaId} />
        <SocialProof />
        <ClosingCta personaId={personaId} />
      </main>

      <SiteFooter />
    </div>
  );
}

function SiteHeader({ personaId }: { personaId: PersonaId }) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-[#0B0B0F]/90 px-5 py-3.5 backdrop-blur sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4">
        <span className="text-[16px] font-bold tracking-[-0.02em] text-zinc-50" style={DISPLAY}>
          repick
        </span>
        <p className="hidden truncate text-[12px] font-semibold uppercase tracking-[0.12em] text-zinc-400 sm:block">
          Viewing as: <span className="text-zinc-200">{personaById(personaId).label}</span>
        </p>
        <a
          href="#hero-persona"
          className="rounded-full border border-zinc-700 px-4 py-2 text-[13px] font-semibold text-zinc-200 transition-colors hover:border-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60A5FA]"
        >
          Start selling
        </a>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3">
        <span className="text-[14px] font-bold tracking-[-0.02em] text-zinc-50" style={DISPLAY}>
          repick
        </span>
        <p className="text-[12.5px] font-normal text-zinc-400">
          Stage durations are a fixed modeled dataset for this demo, keyed by seller persona —
          not a live feed.
        </p>
      </div>
    </footer>
  );
}
