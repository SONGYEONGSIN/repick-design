import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { FOCUS, cx } from "./data";
import HeroNegotiation from "./HeroNegotiation";
import ValueTabs from "./ValueTabs";
import TrustMarquee from "./TrustMarquee";
import CompareTable from "./CompareTable";

export const metadata: Metadata = {
  title: "repick — set the tone, the offer writes itself",
  description:
    "repick drafts your offer to the seller live. Drag the tone slider from polite to assertive and watch the message, the estimated savings and the seller's accept odds recompute together.",
};

export default function Page() {
  return (
    <main className="w-full bg-[#0B0B0F] text-white">
      <HeroNegotiation />
      <ValueTabs />
      <TrustMarquee />
      <CompareTable />

      <section aria-labelledby="cta-title" className="bg-[#0B0B0F]">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8 md:py-24">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-7">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#B6A6F0]">
                Start here
              </p>
              <h2
                id="cta-title"
                className="mt-4 text-[clamp(2.1rem,5vw,3.75rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-white"
                style={{ fontFamily: "var(--font-display-grotesk)" }}
              >
                Stop guessing the first price.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="max-w-[46ch] text-base font-normal leading-[1.6] text-[#A1A1AA]">
                Every listing on repick ships with the same console you just tried — grade,
                verification and a live offer draft, all before you message a seller.
              </p>
              <a
                href="#hero-title"
                className={cx(
                  "mt-6 inline-flex items-center gap-2 rounded-full bg-[#6E56CF] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#7d67d6]",
                  FOCUS,
                )}
              >
                Start negotiating smarter
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
              <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#A1A1AA]">
                Free to browse — no account needed
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-sm font-normal text-[#A1A1AA]">
            repick — negotiate smarter on secondhand.
          </p>
          <nav aria-label="Footer" className="flex gap-5 text-sm font-normal text-[#A1A1AA]">
            <a href="#hero-title" className={cx("transition-colors duration-150 hover:text-white", FOCUS)}>
              Privacy
            </a>
            <a href="#hero-title" className={cx("transition-colors duration-150 hover:text-white", FOCUS)}>
              Terms
            </a>
            <a href="#hero-title" className={cx("transition-colors duration-150 hover:text-white", FOCUS)}>
              Contact
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
