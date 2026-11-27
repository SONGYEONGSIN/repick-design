"use client";

import { motion } from "framer-motion";
import { ScanSearch, LineChart, PackageCheck } from "lucide-react";

const COLUMNS = [
  {
    icon: ScanSearch,
    title: "Verified before it ships",
    body: "Every photo is checked against the listing. Condition grades come from a seller scan, not a seller's own guess.",
  },
  {
    icon: LineChart,
    title: "Priced by real sales data",
    body: "Match scores and before/after discounts are pulled from comparable resale prices, updated as the market moves.",
  },
  {
    icon: PackageCheck,
    title: "Insured the way you choose",
    body: "The Delivery Grid Pick above sets your own balance of speed and coverage — one click, no bundled defaults.",
  },
];

/** Static 3-up section. The only interaction here is the scroll-triggered reveal itself. */
export default function ValueSplit() {
  return (
    <section id="value" className="border-t border-zinc-800/80 py-14 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10">
        <h2 className="max-w-[28rem] text-2xl font-extrabold tracking-[-0.02em] text-white sm:text-3xl">
          Value, three ways.
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
          {COLUMNS.map((col, i) => {
            const Icon = col.icon;
            return (
              <motion.div
                key={col.title}
                className="min-w-0"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.06 }}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
                  <Icon aria-hidden="true" className="h-4 w-4 text-violet-300" />
                </span>
                <h3 className="mt-3 text-base font-extrabold tracking-[-0.02em] text-zinc-100">
                  {col.title}
                </h3>
                <p className="mt-2 max-w-[30rem] text-base leading-[1.6] text-zinc-400">{col.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
