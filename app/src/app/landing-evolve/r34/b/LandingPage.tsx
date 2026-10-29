"use client";

import { useCallback, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import Hero from "./Hero";
import ProductPreview from "./ProductPreview";
import ValueSection from "./ValueSection";
import SocialProof from "./SocialProof";
import ClosingCTA from "./ClosingCTA";
import { COLOR } from "./data";
import { computeWaterfall, DEFAULT_TOGGLES, type ToggleId, type ToggleState } from "./savings-math";

export default function LandingPage() {
  const [toggles, setToggles] = useState<ToggleState>(DEFAULT_TOGGLES);

  const handleToggle = useCallback((id: ToggleId) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Single source of truth for every live number on this page. Toggles flow down from here,
  // the derived waterfall (segments, final price, total savings) flows down alongside them,
  // all the way to the hero's own proof card and the closing CTA.
  const waterfall = useMemo(() => computeWaterfall(toggles), [toggles]);

  return (
    <div className="min-h-screen text-zinc-900" style={{ backgroundColor: COLOR.bg }}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ outlineColor: COLOR.accentDark }}
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <span
            className="text-lg text-zinc-900"
            style={{ fontFamily: "var(--font-display-wide)", fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            repick
          </span>
          <nav aria-label="Primary" className="hidden items-center gap-6 sm:flex">
            <a
              href="#conditions"
              className="rounded-sm text-sm font-semibold text-zinc-600 hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ outlineColor: COLOR.accentDark }}
            >
              Conditions
            </a>
            <a
              href="#proof"
              className="rounded-sm text-sm font-semibold text-zinc-600 hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ outlineColor: COLOR.accentDark }}
            >
              Social proof
            </a>
          </nav>
          <a
            href="#conditions"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: COLOR.accentDark, outlineColor: COLOR.accentDark }}
          >
            Try the switches
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </header>

      {/* Announces the live price to screen reader users whenever a toggle changes, without
          moving focus or interrupting whatever the visitor is doing. */}
      <p aria-live="polite" className="sr-only">
        {`Your price is now $${waterfall.finalPrice}, saving $${waterfall.totalSavings} from ${waterfall.enabledCount} condition${waterfall.enabledCount === 1 ? "" : "s"}.`}
      </p>

      <main id="main">
        <Hero waterfall={waterfall} />
        <ProductPreview toggles={toggles} onToggle={handleToggle} waterfall={waterfall} />
        <ValueSection waterfall={waterfall} />
        <SocialProof />
        <ClosingCTA toggles={toggles} waterfall={waterfall} />
      </main>

      <footer className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span className="text-sm font-semibold text-zinc-900">repick</span>
          <p className="max-w-[26rem] text-sm" style={{ color: COLOR.muted }}>
            {"Every listing shows exactly which condition earned which dollar — nothing stacks silently."}
          </p>
        </div>
      </footer>
    </div>
  );
}
