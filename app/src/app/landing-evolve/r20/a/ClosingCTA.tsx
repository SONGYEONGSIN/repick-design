"use client";

import type { MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import type { Estimate } from "./data";

const FOCUS_DARK =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4FD8A8]";

function scrollToWizard(e: MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  const el = document.getElementById("estimate-wizard");
  if (!el) return;
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

export default function ClosingCTA({ estimate }: { estimate: Estimate }) {
  const headline = estimate.category
    ? `Your ${estimate.category.noun} could be worth $${estimate.low.toLocaleString("en-US")}–$${estimate.high.toLocaleString(
        "en-US",
      )}.`
    : `Items like these are estimated at $${estimate.low.toLocaleString("en-US")}–$${estimate.high.toLocaleString(
        "en-US",
      )}.`;

  return (
    <section className="bg-[#121214] px-6 py-24 lg:px-10 lg:py-32 xl:px-16">
      <div className="mx-auto max-w-[1280px]">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#4FD8A8]">Ready when you are</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.h2
              key={headline}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.32 } }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
              className="mt-4 max-w-[720px] text-[clamp(1.9rem,4vw,3.1rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white tabular-nums"
            >
              {headline}
            </motion.h2>
          </AnimatePresence>
          <p className="mt-5 max-w-[480px] text-[17px] font-normal leading-[1.6] text-zinc-400 tabular-nums">
            Based on {estimate.comps.toLocaleString("en-US")} comparable sales and repick&apos;s {estimate.confidence.toLowerCase()}.
            Answer the rest of the questions above to lock in your number.
          </p>
          <div className="mt-8">
            <a
              href="#estimate-wizard"
              onClick={scrollToWizard}
              className={`inline-flex items-center gap-2 rounded-full bg-[#1F7A5C] px-6 py-3.5 text-[15px] font-medium text-white transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 ${FOCUS_DARK}`}
            >
              Get your free estimate
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
