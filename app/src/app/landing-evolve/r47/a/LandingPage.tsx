"use client";

import { useMemo, useState } from "react";
import { COLORS, FOCUS_RING } from "./tokens";
import { DEFAULT_SPEED, deriveSpeed, findSpeed, type SpeedId } from "./data";
import Hero from "./Hero";
import ProductPreview from "./ProductPreview";
import ValueSection from "./ValueSection";
import SocialProof from "./SocialProof";
import ClosingCTA from "./ClosingCTA";

export default function LandingPage() {
  const [speedId, setSpeedId] = useState<SpeedId>(DEFAULT_SPEED);
  const derived = useMemo(() => deriveSpeed(findSpeed(speedId)), [speedId]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg, color: COLORS.fg }}>
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:px-4 focus:py-2 focus:text-[14px] focus:font-semibold focus:text-white ${FOCUS_RING}`}
        style={{ backgroundColor: COLORS.accent }}
      >
        Skip to main content
      </a>

      <header className="border-b" style={{ borderColor: COLORS.line, backgroundColor: COLORS.bg }}>
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <span
            className="text-[18px] font-extrabold tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-display-grotesk)", color: COLORS.fg }}
          >
            repick
          </span>
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            <a
              href="#value"
              className={`text-[14px] font-semibold ${FOCUS_RING}`}
              style={{ color: COLORS.mutedOnTint }}
            >
              Why it holds up
            </a>
            <a
              href="#preview"
              className={`text-[14px] font-semibold ${FOCUS_RING}`}
              style={{ color: COLORS.mutedOnTint }}
            >
              Listings
            </a>
          </nav>
          <a
            href="#preview"
            className={`inline-flex items-center rounded-full px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 ${FOCUS_RING}`}
            style={{ backgroundColor: COLORS.accent }}
          >
            Start selling
          </a>
        </div>
      </header>

      <main id="main-content">
        <Hero speedId={speedId} derived={derived} onChangeSpeed={setSpeedId} />
        <ProductPreview />
        <ValueSection speedId={speedId} />
        <SocialProof />
        <ClosingCTA derived={derived} />
      </main>

      <footer className="border-t" style={{ borderColor: COLORS.line }}>
        <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-[13px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
            repick — the route from seller to buyer, verified at every stop.
          </p>
        </div>
      </footer>
    </div>
  );
}
