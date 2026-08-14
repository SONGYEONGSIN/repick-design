import type { Metadata } from "next";

import FilterRailHero from "./FilterRailHero";
import HowItWorksStepper from "./HowItWorksStepper";
import CaseStudy from "./CaseStudy";
import ClosingCta from "./ClosingCta";

export const metadata: Metadata = {
  title: "repick — filter three things, the shelf answers",
  description:
    "Set a budget band, a category and a condition floor and repick's shelf, its savings total, and its match score all recompute together — live, above the fold.",
};

export default function Page() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[#0B0B0F] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
      >
        Skip to main content
      </a>
      <main id="main-content" className="w-full bg-white">
        <FilterRailHero />
        <HowItWorksStepper />
        <CaseStudy />
        <ClosingCta />
      </main>
    </>
  );
}
