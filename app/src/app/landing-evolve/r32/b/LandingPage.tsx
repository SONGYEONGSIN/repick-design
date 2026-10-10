"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Hero from "./Hero";
import ProductPreview from "./ProductPreview";
import ValueSection from "./ValueSection";
import SocialProof from "./SocialProof";
import ClosingCTA from "./ClosingCTA";
import { type CategoryId } from "./data";

export default function LandingPage() {
  const [selected, setSelected] = useState<CategoryId>("sneakers");

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <a
        href="#main"
        className={[
          "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50",
          "focus:rounded-full focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm",
          "focus:font-semibold focus:text-white",
          "focus-visible:outline-2 focus-visible:outline-rose-400 focus-visible:outline-offset-2",
        ].join(" ")}
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <span className="text-lg font-extrabold tracking-[-0.02em] text-zinc-900">
            repick
          </span>
          <a
            href="#listings"
            className={[
              "inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-4 py-2",
              "text-sm font-semibold text-white transition-colors hover:bg-rose-700",
              "focus-visible:outline-2 focus-visible:outline-rose-600 focus-visible:outline-offset-2",
            ].join(" ")}
          >
            Start a listing
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </header>

      <main id="main">
        <Hero selected={selected} onSelect={setSelected} />
        <ProductPreview />
        <ValueSection selected={selected} />
        <SocialProof />
        <ClosingCTA selected={selected} />
      </main>

      <footer className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span className="text-sm font-semibold text-zinc-900">repick</span>
          <p className="text-sm text-zinc-500">
            Every listing graded, every seller verified, every price checked against
            real demand.
          </p>
        </div>
      </footer>
    </div>
  );
}
