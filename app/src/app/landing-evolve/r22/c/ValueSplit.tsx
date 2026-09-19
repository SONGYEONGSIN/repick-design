"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Award, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { VALUE_PILLARS } from "./data";
import { ACCENT_BRIGHT_HEX, cx, MUTED, PARA_WIDTH_16, TRACK_EYEBROW } from "./tokens";

const ICONS: LucideIcon[] = [Sparkles, Award, ShieldCheck];

/**
 * Section 3 — the three pillars behind every row of the compare table above. Deliberately static:
 * the "manipulation moves live proof" principle is already satisfied by the hero's compare console
 * (and its sort control), so this section's job is explaining *why* the table's numbers can be
 * trusted, not adding a second interactive widget competing for the same job.
 */
export default function ValueSplit() {
  const reduceMotion = useReducedMotion();

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
        >
          <p className={cx("text-[11px] font-semibold uppercase", TRACK_EYEBROW)} style={{ color: ACCENT_BRIGHT_HEX }}>
            Fig. 03 — how the table stays honest
          </p>
          <h2 className="mt-3 text-[clamp(1.75rem,1.6vw+1.3rem,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-white">
            Three checks behind every cell.
          </h2>
          <p className={cx("mt-4 text-[16px] font-normal leading-[1.6]", MUTED, PARA_WIDTH_16)}>
            A grade or a match score is only useful if it means the same thing every time. Here is
            what actually sits behind the numbers in the table above.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {VALUE_PILLARS.map((pillar, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={pillar.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                transition={{ duration: 0.45, delay: reduceMotion ? 0 : i * 0.08 }}
                className="min-w-0 rounded-2xl border border-[#1C1C22] bg-[#0B0B0F] p-6"
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "rgba(204,22,65,0.16)" }}
                >
                  <Icon className="h-[18px] w-[18px]" style={{ color: ACCENT_BRIGHT_HEX }} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[15px] font-semibold text-white">{pillar.title}</h3>
                <p className="mt-2 text-[13.5px] font-normal leading-[1.6] text-zinc-400">
                  {pillar.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
