"use client";

import { useMemo, useState } from "react";
import { ScrollText } from "lucide-react";
import Hero from "./Hero";
import SensitivityTable from "./SensitivityTable";
import ProductPreview from "./ProductPreview";
import ValueSection from "./ValueSection";
import SocialProof from "./SocialProof";
import ClosingCta from "./ClosingCta";
import { COLOR, DISPLAY_FONT, TRACK, W } from "./tokens";
import { DEFAULT_RIGOR, DEFAULT_WINDOW, deriveVerdict, type RigorId, type WindowId } from "./data";

export default function DossierLanding() {
  // The single source of truth for the whole page. Hero owns the controls; every other section
  // reads the same `verdict` (or the raw rigor/window ids for their own labels) so the dossier
  // re-derives everywhere at once, and the closing CTA's headline is provably the live value, not
  // a second hardcoded string.
  const [rigorId, setRigorId] = useState<RigorId>(DEFAULT_RIGOR);
  const [windowId, setWindowId] = useState<WindowId>(DEFAULT_WINDOW);
  const verdict = useMemo(() => deriveVerdict(rigorId, windowId), [rigorId, windowId]);

  return (
    <div style={{ background: COLOR.bg, color: COLOR.ink }}>
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:text-[13px]"
        style={{ background: COLOR.ink, color: COLOR.bg }}
      >
        Skip to case file
      </a>

      <header className="mx-auto max-w-[1600px] px-5 sm:px-8 pt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ScrollText className="size-4 shrink-0" style={{ color: COLOR.accentDark }} aria-hidden="true" />
          <span
            className={`${W.heavy} text-[15px]`}
            style={{ color: COLOR.ink, letterSpacing: "-0.01em", fontFamily: DISPLAY_FONT }}
          >
            repick
          </span>
        </div>
        <span
          className={`${W.label} hidden sm:inline text-[11px] uppercase`}
          style={{ color: COLOR.mutedOnBg, letterSpacing: TRACK.caption }}
        >
          Dossier system — Vol. 19
        </span>
      </header>

      <main>
        <Hero
          rigorId={rigorId}
          windowId={windowId}
          onRigor={setRigorId}
          onWindow={setWindowId}
          verdict={verdict}
        />
        <div style={{ borderTop: `1px solid ${COLOR.ink}1A` }}>
          <SensitivityTable rigorId={rigorId} windowId={windowId} />
        </div>
        <div style={{ borderTop: `1px solid ${COLOR.ink}1A` }}>
          <ProductPreview verdict={verdict} />
        </div>
        <div style={{ borderTop: `1px solid ${COLOR.ink}1A` }}>
          <ValueSection rigorId={rigorId} windowId={windowId} verdict={verdict} />
        </div>
        <div style={{ borderTop: `1px solid ${COLOR.ink}1A` }}>
          <SocialProof />
        </div>
        <ClosingCta verdict={verdict} />
      </main>

      <footer className="mx-auto max-w-[1600px] px-5 sm:px-8 py-8" style={{ borderTop: `1px solid ${COLOR.ink}1A` }}>
        <p className={`${W.body} text-[12px]`} style={{ color: COLOR.mutedOnBg }}>
          repick dossier system. Figures on this page are illustrative of the methodology; the
          assumptions are yours to change.
        </p>
      </footer>
    </div>
  );
}
