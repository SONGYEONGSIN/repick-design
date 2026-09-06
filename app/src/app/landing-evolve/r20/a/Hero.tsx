"use client";

import type { MouseEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import WizardCard, { type WizardCardProps } from "./WizardCard";
import FeaturedCard from "./FeaturedCard";

const FOCUS_LIGHT =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A5C]";

type HeroProps = WizardCardProps;

function scrollToWizard(e: MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  const el = document.getElementById("estimate-wizard");
  if (!el) return;
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

export default function Hero(props: HeroProps) {
  const { estimate } = props;

  return (
    <section className="relative bg-[#FAFAF8] px-6 pb-24 pt-32 lg:px-10 lg:pb-32 lg:pt-40 xl:px-16">
      <div className="mx-auto max-w-[1280px]">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#1F7A5C]">
          AI-matched resale marketplace
        </p>

        <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-7">
            <h1
              style={{ fontFamily: "var(--font-display-grotesk)" }}
              className="text-[clamp(2.5rem,5.2vw,4.4rem)] font-bold leading-[1.03] tracking-[-0.02em] text-[#121214]"
            >
              Know what it&apos;s worth before you list it.
            </h1>
            <p className="mt-6 max-w-[500px] text-[17px] font-normal leading-[1.6] text-zinc-600">
              repick&apos;s AI reads condition, brand tier and verified comparable sales, then narrows a
              live price range while you answer four quick questions.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a
                href="#estimate-wizard"
                onClick={scrollToWizard}
                className={`inline-flex items-center gap-2 rounded-full bg-[#1F7A5C] px-6 py-3.5 text-[15px] font-medium text-white transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 ${FOCUS_LIGHT}`}
              >
                Start your estimate
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] font-normal text-zinc-600">
                <li className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#1F7A5C]" aria-hidden="true" />
                  No account needed
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#1F7A5C]" aria-hidden="true" />
                  Takes 45 seconds
                </li>
              </ul>
            </div>
          </div>

          <div id="estimate-wizard" className="flex min-w-0 scroll-mt-24 flex-col gap-6 lg:col-span-5">
            <WizardCard {...props} />
            <FeaturedCard estimate={estimate} />
          </div>
        </div>
      </div>
    </section>
  );
}
