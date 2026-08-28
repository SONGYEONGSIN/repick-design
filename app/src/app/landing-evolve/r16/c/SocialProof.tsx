"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DISPLAY_FONT, QUOTES, SOCIAL_STATS } from "./data";

export default function SocialProof() {
  const shouldReduce = useReducedMotion();

  return (
    <section className="border-y border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <h2
          style={DISPLAY_FONT}
          className="max-w-[560px] text-[clamp(1.75rem,1.4rem+1.6vw,2.75rem)] font-bold tracking-[-0.02em] text-zinc-900"
        >
          Trusted by both sides of the deal
        </h2>

        {/* Plain divs, not a <dl>: these are stat tiles, not term/definition pairs — using <dl>
            here would need a wrapper <div> around each dt/dd pair to lay them out as a grid cell,
            and axe's dlitem/definition-list audits fail on exactly that wrapper pattern. */}
        <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {SOCIAL_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={shouldReduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: shouldReduce ? 0 : 0.4, delay: shouldReduce ? 0 : i * 0.06 }}
              className="min-w-0"
            >
              <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                {stat.label}
              </p>
              <p
                style={DISPLAY_FONT}
                className="mt-1 tabular-nums tracking-[0.12em] text-[clamp(1.5rem,1.2rem+1vw,2.25rem)] font-bold text-zinc-900"
              >
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {QUOTES.map((quote, i) => (
            <motion.figure
              key={quote.name}
              initial={shouldReduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: shouldReduce ? 0 : 0.4, delay: shouldReduce ? 0 : i * 0.08 }}
              className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-6"
            >
              <span aria-hidden="true" className="text-[36px] font-bold leading-none text-zinc-500">
                &ldquo;
              </span>
              <blockquote className="mt-1 max-w-[280px] text-[15px] leading-[1.6] text-zinc-800">
                {quote.text}
              </blockquote>
              <figcaption className="mt-4 text-[13px] text-zinc-500">
                <span className="font-medium text-zinc-700">{quote.name}</span> · {quote.role}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
