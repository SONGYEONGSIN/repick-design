"use client";

import { useState } from "react";
import { Aperture } from "lucide-react";
import Hero from "./Hero";
import ProofWall from "./ProofWall";
import ValueSplit from "./ValueSplit";
import SocialProof from "./SocialProof";
import ClosingCta from "./ClosingCta";
import { DEFAULT_RANK_ORDER, type CriterionId } from "./lib";
import { FOCUS_RING, DISPLAY_FONT_STYLE, ACCENT_TINT } from "./ui";

export default function Client() {
  // The one piece of lifted state the whole route shares. Always a full,
  // real permutation of the four criteria — never emptied or zeroed, since
  // there is no secondary control that could clear it, only reorder it.
  const [order, setOrder] = useState<CriterionId[]>(DEFAULT_RANK_ORDER);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      <header className="border-b border-zinc-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a
            href="#hero"
            style={DISPLAY_FONT_STYLE}
            className={`flex items-center gap-2 text-sm font-extrabold tracking-[-0.02em] text-white ${FOCUS_RING} rounded`}
          >
            <Aperture className="h-4 w-4" style={{ color: ACCENT_TINT }} aria-hidden="true" />
            FOCAL
          </a>
          <nav aria-label="Primary" className="hidden items-center gap-6 sm:flex">
            <a
              href="#proof"
              className={`text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400 hover:text-white ${FOCUS_RING} rounded`}
            >
              Proof wall
            </a>
            <a
              href="#social-proof"
              className={`text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400 hover:text-white ${FOCUS_RING} rounded`}
            >
              Buyers
            </a>
            <a
              href="#cta"
              className={`rounded-full border border-zinc-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:border-zinc-500 ${FOCUS_RING}`}
            >
              Get started
            </a>
          </nav>
        </div>
      </header>

      <main>
        <Hero order={order} onReorder={setOrder} />
        <ProofWall order={order} />
        <ValueSplit order={order} />
        <SocialProof />
        <ClosingCta order={order} />
      </main>

      <footer className="border-t border-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p
            style={DISPLAY_FONT_STYLE}
            className="text-sm font-extrabold tracking-[-0.02em] text-white"
          >
            FOCAL
          </p>
          <p className="mt-2 max-w-[360px] text-xs leading-[1.6] text-zinc-400">
            Verified camera and lens resale, ranked by the priorities you
            set — not a fixed house order. Dummy preview catalog; figures
            above are illustrative.
          </p>
          <p className="mt-4 text-xs text-zinc-400">
            &copy; FOCAL. All listings shown are sample data.
          </p>
        </div>
      </footer>
    </div>
  );
}
