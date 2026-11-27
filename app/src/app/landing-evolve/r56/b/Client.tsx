"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import Hero from "./Hero";
import ValueSplit from "./ValueSplit";
import SocialProof from "./SocialProof";
import ClosingCta from "./ClosingCta";
import { DEFAULT_ZONE_ID } from "./zones";
import { FOCUS_RING, DISPLAY_FONT_STYLE } from "./ui";

export default function Client() {
  // The one piece of lifted state the whole route shares. It always holds a
  // real zone id — it is never reset to an empty/zero value, including on
  // re-render, because there is no secondary control that could clear it.
  const [selectedZoneId, setSelectedZoneId] = useState<string>(DEFAULT_ZONE_ID);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      <header className="border-b border-zinc-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a
            href="#hero"
            style={DISPLAY_FONT_STYLE}
            className={`flex items-center gap-2 text-sm font-extrabold tracking-[-0.02em] text-white ${FOCUS_RING}`}
          >
            <MapPin className="h-4 w-4 text-indigo-300" aria-hidden="true" />
            GRIDLINE
          </a>
          <nav aria-label="Primary" className="hidden items-center gap-6 sm:flex">
            <a
              href="#live-zones"
              className={`text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400 hover:text-white ${FOCUS_RING}`}
            >
              Live zones
            </a>
            <a
              href="#social-proof"
              className={`text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400 hover:text-white ${FOCUS_RING}`}
            >
              Traders
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
        <Hero selectedZoneId={selectedZoneId} onSelectZone={setSelectedZoneId} />
        <ValueSplit selectedZoneId={selectedZoneId} />
        <SocialProof />
        <ClosingCta selectedZoneId={selectedZoneId} />
      </main>

      <footer className="border-t border-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p
            style={DISPLAY_FONT_STYLE}
            className="text-sm font-extrabold tracking-[-0.02em] text-white"
          >
            GRIDLINE
          </p>
          <p className="mt-2 max-w-[500px] text-xs leading-[1.6] text-zinc-400">
            Peer-to-peer sneaker and streetwear resale, matched to the
            neighborhood pickup zone that works for you. Dummy preview
            catalog — figures above are illustrative.
          </p>
          <p className="mt-4 text-xs text-zinc-400">
            &copy; GRIDLINE. All listings shown are sample data.
          </p>
        </div>
      </footer>
    </div>
  );
}
