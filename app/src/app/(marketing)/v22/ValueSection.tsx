"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DollarSign, ShieldCheck, Zap } from "lucide-react";
import { offers } from "./data";
import { leaderByAxis } from "./scoring";
import { cx, MUTED, NUM, TRACK_STAT } from "./tokens";

const PARTS = [
  {
    key: "price" as const,
    icon: DollarSign,
    title: "Price",
    body: "Sellers undercut each other automatically. Every offer is checked against the category's live price floor before it ever reaches the board.",
    stat: "Median 42% below original retail across active listings.",
  },
  {
    key: "speed" as const,
    icon: Zap,
    title: "Speed",
    body: "Same-day and next-day shippers rank higher the moment speed matters more to you than a lower price.",
    stat: "68% of matched items ship within 24 hours.",
  },
  {
    key: "trust" as const,
    icon: ShieldCheck,
    title: "Trust",
    body: "Every score blends ID verification, dispute history, and AI-audited listing photos — never a self-reported rating.",
    stat: "97.3 average trust score among active sellers.",
  },
];

export default function ValueSection() {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <section className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-zinc-900 sm:text-3xl">Value in three parts</h2>
          <span className={cx("hidden font-mono text-[11px] uppercase text-zinc-600 sm:inline", TRACK_STAT)}>03 — Methodology</span>
        </div>
        <p className={cx("mt-2 max-w-[480px] text-base leading-relaxed", MUTED)}>
          These are the three axes behind the sliders in the ledger above. Here is what the board would look like if each ran alone.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PARTS.map((part, i) => {
            const leader = leaderByAxis(offers, part.key);
            const leadValue = part.key === "price" ? `$${leader.price.toLocaleString("en-US")}` : part.key === "speed" ? `${leader.shipDays}d` : `${leader.trust}/100`;
            const Icon = part.icon;
            return (
              <motion.div
                key={part.key}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: reduceMotion ? 0 : i * 0.08, ease: "easeOut" }}
                className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-5"
              >
                <Icon size={18} className="text-[#92400E]" aria-hidden="true" />
                <h3 className="mt-3 text-base font-semibold tracking-[-0.02em] text-zinc-900">{part.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{part.body}</p>
                <p className={cx(NUM, "mt-3 text-xs font-semibold text-zinc-900")}>{part.stat}</p>
                <p className="mt-3 border-t border-zinc-200 pt-3 text-xs text-zinc-600">
                  Leading on {part.title.toLowerCase()} alone: <span className="font-semibold text-zinc-900">{leader.seller}</span> at{" "}
                  <span className={cx(NUM, "font-semibold text-zinc-900")}>{leadValue}</span>
                </p>
              </motion.div>
            );
          })}
        </div>
        <p className={cx("mt-6 text-[11px] uppercase text-zinc-600", TRACK_STAT)}>
          Fig. 02 — computed from the same six active offers shown in the ledger above
        </p>
      </div>
    </section>
  );
}
