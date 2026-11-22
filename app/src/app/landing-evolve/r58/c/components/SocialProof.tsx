"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Star, Truck } from "lucide-react";

const STATS = [
  { icon: ShieldCheck, label: "Verified deliveries", value: "18,402" },
  { icon: Star, label: "Average seller rating", value: "4.8 / 5" },
  { icon: Truck, label: "Average match score", value: "93%" },
];

const QUOTES = [
  {
    text: "I could see the condition grade and the seller's rating before I picked a shipping speed. Nothing felt like a guess.",
    name: "Priya N.",
    role: "Buyer, 14 orders",
  },
  {
    text: "The grid made the shipping decision obvious — I saw exactly what Full Coverage cost me over Basic before clicking.",
    name: "Daniel O.",
    role: "Buyer, 6 orders",
  },
  {
    text: "Every listing I sold carried the same proof a buyer sees. No disputes about condition since switching over.",
    name: "Marisol T.",
    role: "Seller, 312 sales",
  },
];

/** Stats as a proper dl (icon lives inside dt, dt/dd stay direct children of the dl's row div). */
export default function SocialProof() {
  return (
    <section id="proof" className="border-t border-zinc-800/80 py-14 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10">
        <h2 className="max-w-[28rem] text-2xl font-extrabold tracking-[-0.02em] text-white sm:text-3xl">
          Trusted by careful buyers.
        </h2>

        <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <dt className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                  <Icon aria-hidden="true" className="h-4 w-4 text-violet-300" />
                  {stat.label}
                </dt>
                <dd className="mt-1 text-2xl font-extrabold tabular-nums tracking-[-0.02em] text-white">
                  {stat.value}
                </dd>
              </div>
            );
          })}
        </dl>

        <ul role="list" className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {QUOTES.map((q, i) => (
            <motion.li
              key={q.name}
              className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.05 }}
            >
              <p className="text-sm leading-[1.6] text-zinc-300">&ldquo;{q.text}&rdquo;</p>
              <p className="mt-3 text-xs font-semibold text-zinc-400">
                {q.name} · {q.role}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
