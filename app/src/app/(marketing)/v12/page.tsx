import type { Metadata } from "next";

import HeroSection from "./HeroSection";
import EditorialBlocks from "./EditorialBlocks";
import FaqAccordion from "./FaqAccordion";
import PullQuote from "./PullQuote";
import ClosingCta from "./ClosingCta";

export const metadata: Metadata = {
  title: "repick — Layer Inspector",
  description:
    "Toggle condition, authenticity and price-fairness inspection layers on a real listing and watch the verdict, the confidence bar and the highlighted region recompute live.",
};

export default function Page() {
  return (
    <main className="w-full bg-[#0B0B0F] text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[#6E56CF] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>
      <div id="main-content">
        <HeroSection />
        <EditorialBlocks />
        <FaqAccordion />
        <PullQuote />
        <ClosingCta />
      </div>
    </main>
  );
}
