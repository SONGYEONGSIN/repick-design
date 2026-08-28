"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Quote } from "lucide-react";
import { QUOTES } from "./data";
import { ACCENT_TEXT } from "./theme";

const AVERAGE_RESOLUTION = Math.round(
  (100 + 82 + 91 + 74 + 63) / 5,
);

export default function SocialProof() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="proof"
      aria-labelledby="proof-heading"
      className="border-b border-zinc-200 bg-zinc-50 px-6 py-16 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2
            id="proof-heading"
            className="text-2xl font-extrabold tracking-[-0.02em] text-zinc-900 sm:text-3xl"
          >
            What people are saying now
          </h2>
          <p className="text-sm font-normal text-zinc-600">
            <span
              className="font-semibold tabular-nums"
              style={{ color: ACCENT_TEXT }}
            >
              {AVERAGE_RESOLUTION}%
            </span>{" "}
            average resolution rate across this report&apos;s five categories.
          </p>
        </div>

        <ul role="list" className="mt-8 grid gap-5 sm:grid-cols-3">
          {QUOTES.map((q, i) => (
            <motion.li
              key={q.id}
              className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-6"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            >
              <blockquote>
                <Quote
                  aria-hidden="true"
                  className="h-7 w-7 text-zinc-500"
                  strokeWidth={1.5}
                />
                <p className="mt-3 text-sm leading-[1.6] text-zinc-700">
                  {q.quote}
                </p>
                <footer className="mt-4 text-xs font-normal text-zinc-500 tracking-[0.16em] uppercase">
                  {q.name} &middot; {q.role}
                </footer>
              </blockquote>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
