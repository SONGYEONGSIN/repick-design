import type { Metadata } from "next";

import RedlineHero from "./redline-hero";
import Sections from "./sections";

export const metadata: Metadata = {
  title: "repick - Redline",
  description:
    "The seller's own listing description with the inspection marked straight onto it: struck claims, verified replacements, and the price each correction is worth.",
};

/**
 * Redline - auto-landing r11, candidate a.
 *
 * The hero is a document, not a chart. A seller's description sits on the page in their own words
 * and the inspection is laid over it as editorial marks, the way a lawyer redlines a contract.
 * The claim the page makes is that the deletion and the replacement only mean something together:
 * the struck phrase says what you were promised, the inserted one says what is true, and the
 * difference between them is a number in the ledger beside it.
 */
export default function Page() {
  return (
    <main className="min-h-dvh w-full bg-[#FAF9F6] text-[#141317]">
      <a
        href="#hero-title"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[#BE123C] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <header className="border-b border-[#E4E1DA]">
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4 px-5 py-3.5 sm:px-6 md:px-8">
          <p
            style={{ fontFamily: "var(--font-display-wide)" }}
            className="text-[1.05rem] font-bold tracking-[-0.02em] text-[#141317]"
          >
            repick
          </p>
          <nav aria-label="Primary">
            <ul role="list" className="flex items-center gap-1 sm:gap-2">
              <li>
                <a
                  href="#method-title"
                  className="inline-block rounded px-2.5 py-2 text-[0.8125rem] text-[#5B5862] transition-colors duration-150 hover:text-[#141317] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BE123C] motion-reduce:transition-none"
                >
                  Method
                </a>
              </li>
              <li>
                <a
                  href="#picks"
                  className="inline-block rounded px-2.5 py-2 text-[0.8125rem] text-[#5B5862] transition-colors duration-150 hover:text-[#141317] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BE123C] motion-reduce:transition-none"
                >
                  Picks
                </a>
              </li>
              <li>
                <a
                  href="#cta-title"
                  className="inline-block rounded bg-[#BE123C] px-3.5 py-2 text-[0.8125rem] font-semibold text-white transition-transform duration-200 ease-out hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BE123C] motion-reduce:transition-none"
                >
                  Get started
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <RedlineHero />
      <Sections />

      <footer className="border-t border-[#E4E1DA] bg-white">
        <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-8 sm:px-6 md:px-8">
          <p className="text-[0.8125rem] text-[#5B5862]">
            repick - listing inspection for secondhand goods
          </p>
          <p className="text-[0.8125rem] text-[#5B5862]">
            Every figure on this page is a fixed sample, not live inventory.
          </p>
        </div>
      </footer>
    </main>
  );
}
