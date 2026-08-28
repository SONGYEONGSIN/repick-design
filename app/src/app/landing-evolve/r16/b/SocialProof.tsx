"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, Users, Target, TrendingDown } from "lucide-react";

const STATS = [
  { icon: Users, value: "14,200+", label: "Verified sellers on repick" },
  { icon: Target, value: "92%", label: "Average match accuracy" },
  { icon: TrendingDown, value: "38%", label: "Average savings vs. retail" },
];

const TESTIMONIALS = [
  {
    quote:
      "I compared four listings within six blocks before I bought. The price band showed me I was not overpaying.",
    name: "Dana R.",
    place: "Elm Hollow",
    initials: "DR",
  },
  {
    quote:
      "The condition grade matched the photos the seller posted, exactly. No surprises at pickup.",
    name: "Marcus T.",
    place: "Birchfield",
    initials: "MT",
  },
  {
    quote:
      "I widened the radius once and found a better match two miles further out. It was worth it.",
    name: "Priya K.",
    place: "Elm Hollow",
    initials: "PK",
  },
];

export default function SocialProof() {
  const reduce = useReducedMotion();

  return (
    <section aria-labelledby="proof-heading" className="border-b border-zinc-900 px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <h2 id="proof-heading" className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-[-0.02em] text-white">
          What nearby buyers say.
        </h2>

        <motion.ul
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reduce ? 0 : 0.5, ease: "easeOut" }}
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3"
        >
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <li key={stat.label} className="min-w-0 rounded-lg border border-zinc-800 p-4">
                <Icon aria-hidden="true" className="h-4 w-4 text-lime-400" />
                <p className="mt-2 tabular-nums text-[1.75rem] font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-[13px] text-zinc-400">{stat.label}</p>
              </li>
            );
          })}
        </motion.ul>

        <motion.ul
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.1, ease: "easeOut" }}
          className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3"
        >
          {TESTIMONIALS.map((item) => (
            <li key={item.name} className="min-w-0 rounded-lg border border-zinc-800 p-5">
              <blockquote className="text-[14px] leading-[1.6] text-zinc-200">
                <p>&ldquo;{item.quote}&rdquo;</p>
              </blockquote>
              <footer className="mt-4 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-[11px] font-bold text-zinc-200"
                >
                  {item.initials}
                </span>
                <div className="min-w-0">
                  <cite className="block truncate text-[13px] font-medium not-italic text-white">
                    {item.name} &middot; {item.place}
                  </cite>
                  <p className="flex items-center gap-1 text-[11px] text-zinc-400">
                    <ShieldCheck aria-hidden="true" className="h-3 w-3 text-lime-400" />
                    Verified buyer
                  </p>
                </div>
              </footer>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
