"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Quote } from "lucide-react";
import { TESTIMONIALS, TRUST_STATS } from "./data";
import { ACCENT_BRIGHT_HEX, cx, NUM, PARA_WIDTH_14, TRACK_EYEBROW } from "./tokens";

export default function SocialProof() {
  const reduceMotion = useReducedMotion();

  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <section className="border-t border-[#1C1C22] bg-[#0B0B0F] px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1280px]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          <p className={cx("text-[11px] font-semibold uppercase", TRACK_EYEBROW)} style={{ color: ACCENT_BRIGHT_HEX }}>
            Fig. 04 — from the compare table
          </p>
          <h2 className="mt-3 text-[clamp(1.75rem,1.6vw+1.3rem,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-white">
            People who built their own table.
          </h2>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <ul className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-3 lg:col-span-8">
            {TESTIMONIALS.map((t, i) => (
              <motion.li
                key={t.name}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                transition={{ duration: 0.45, delay: reduceMotion ? 0 : i * 0.08 }}
                className="min-w-0 rounded-2xl border border-[#1C1C22] bg-[#111116] p-5"
              >
                <Quote className="h-5 w-5" style={{ color: ACCENT_BRIGHT_HEX }} aria-hidden="true" />
                <p className={cx("mt-3 text-[14px] font-normal leading-[1.6] text-zinc-300", PARA_WIDTH_14)}>
                  {t.quote}
                </p>
                <p className="mt-4 text-[12.5px] font-semibold text-white">{t.name}</p>
                <p className="mt-0.5 text-[11.5px] font-normal text-zinc-400">{t.role}</p>
              </motion.li>
            ))}
          </ul>

          <div className="min-w-0 lg:col-span-4">
            <dl className="flex flex-col gap-6">
              {TRUST_STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                    {stat.label}
                  </dt>
                  <dd className={cx(NUM, "mt-1 text-3xl font-extrabold tracking-[-0.02em] text-white")}>
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
