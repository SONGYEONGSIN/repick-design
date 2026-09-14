"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Listing } from "./data";
import { ACCENT_BRIGHT_HEX, ACCENT_HEX, cx, FOCUS, NUM } from "./tokens";

interface ClosingCtaProps {
  selectedListings: Listing[];
  topMatch: number;
}

/**
 * The manipulation-to-value thread closes here: `topMatch` and the listing that earns it are read
 * straight from the same selection state the hero's chips and table use — never a number frozen at
 * mount. Changing the comparison above changes this section too.
 */
export default function ClosingCta({ selectedListings, topMatch }: ClosingCtaProps) {
  const reduceMotion = useReducedMotion();
  const count = selectedListings.length;
  const leader = selectedListings.find((l) => l.matchPct === topMatch) ?? selectedListings[0];

  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <section className="border-t border-[#1C1C22] bg-[#111116] px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1280px]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end"
        >
          <div className="min-w-0 lg:col-span-8">
            <h2 className="text-[clamp(1.9rem,2vw+1.3rem,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-white">
              Ready when your table is.
            </h2>
            <p className="mt-4 max-w-[493px] text-[16px] font-normal leading-[1.6] text-zinc-400">
              Right now you&rsquo;re comparing{" "}
              <span className={cx(NUM, "font-semibold text-white")}>{count}</span> listing
              {count === 1 ? "" : "s"} &mdash;{" "}
              <span className="font-semibold text-white">{leader.title}</span> leads at{" "}
              <span className={cx(NUM, "font-semibold")} style={{ color: ACCENT_BRIGHT_HEX }}>
                {topMatch}%
              </span>{" "}
              match. Add a third listing or swap one out above and this line updates with it.
            </p>
          </div>
          <div className="min-w-0 lg:col-span-4 lg:text-right">
            <a
              href="#preview"
              className={cx(
                "inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5",
                FOCUS,
              )}
              style={{ backgroundColor: ACCENT_HEX }}
            >
              Get the {topMatch}% match
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
