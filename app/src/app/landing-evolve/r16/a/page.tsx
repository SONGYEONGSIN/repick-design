"use client";

import { useState } from "react";
import Hero from "./Hero";
import VerifiedNow from "./VerifiedNow";
import AuditReport from "./AuditReport";
import SocialProof from "./SocialProof";
import ClosingCta from "./ClosingCta";
import { AUDIT_CATEGORIES } from "./data";
import { DISPLAY } from "./theme";

export default function Page() {
  const [activeId, setActiveId] = useState<string>(AUDIT_CATEGORIES[0].id);
  const activeCategory =
    AUDIT_CATEGORIES.find((c) => c.id === activeId) ?? AUDIT_CATEGORIES[0];

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[#C2410C] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <header className="border-b border-zinc-200 bg-white px-6 py-5 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <p
            style={DISPLAY}
            className="shrink-0 text-lg font-extrabold tracking-[-0.02em] text-zinc-900"
          >
            repick
          </p>
          <p className="hidden shrink-0 text-xs font-normal text-zinc-500 tracking-[0.16em] uppercase sm:block">
            Trust &amp; safety desk
          </p>
        </div>
      </header>

      <main id="main-content">
        <Hero />
        <VerifiedNow />
        <AuditReport activeId={activeId} onSelect={setActiveId} />
        <SocialProof />
        <ClosingCta category={activeCategory} />
      </main>

      <footer className="bg-white px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl border-t border-zinc-200 pt-6">
          <p className="text-xs font-normal text-zinc-500">
            repick publishes this disclosure every quarter, in the same
            order it publishes on the site &mdash; the worst-case categories
            first, whether or not they improved.
          </p>
        </div>
      </footer>
    </div>
  );
}
