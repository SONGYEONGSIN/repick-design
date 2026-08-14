"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { DISPLAY, EDITORIAL, NUM, cx } from "./data";

const VIEWPORT = { once: true, margin: "-80px" } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Continuous editorial narrative — alternating image/text blocks, image-left then flipped then
 * repeat. No section numbers, no ghost-number decoration. Each block reveals on scroll via
 * framer-motion `whileInView`; content is present and legible in the DOM either way (initial state
 * never leaves it at opacity:0 when JS/motion is unavailable — `useReducedMotion` disables the
 * animation outright rather than starting from a hidden frame).
 */
export default function EditorialBlocks() {
  const reduced = useReducedMotion();

  return (
    <section aria-label="How the inspection layers work" className="border-t border-white/10">
      {EDITORIAL.map((block, i) => {
        const flipped = i % 2 === 1;
        return (
          <div key={block.id} className={cx(i > 0 && "border-t border-white/10")}>
            <div className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-6 md:px-8 md:py-24">
              <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.5, ease: EASE }}
                  className={cx(
                    "min-w-0 lg:col-span-6",
                    flipped ? "lg:order-2" : "lg:order-1",
                  )}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/10 bg-[#111116]">
                    <Image
                      src={block.image}
                      alt={block.alt}
                      fill
                      sizes="(min-width: 1024px) 560px, 100vw"
                      className="object-cover"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : 0.08 }}
                  className={cx(
                    "min-w-0 lg:col-span-6",
                    flipped ? "lg:order-1" : "lg:order-2",
                  )}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#A1A1AA]">
                    {block.eyebrow}
                  </p>
                  <h2
                    style={DISPLAY}
                    className="mt-3 text-[clamp(1.6rem,3.2vw,2.4rem)] font-bold leading-[1.12] tracking-[-0.01em] text-white"
                  >
                    {block.title}
                  </h2>
                  <p className="mt-4 max-w-[58ch] text-base font-normal leading-[1.6] text-[#A1A1AA]">
                    {block.body}
                  </p>
                  {block.stat ? (
                    <div className="mt-6 inline-flex items-baseline gap-2 border-t border-white/10 pt-4">
                      <span
                        style={DISPLAY}
                        className={cx("text-3xl font-bold text-white", NUM)}
                      >
                        {block.stat.value}
                      </span>
                      <span className="text-xs font-normal uppercase tracking-[0.12em] text-[#A1A1AA]">
                        {block.stat.label}
                      </span>
                    </div>
                  ) : null}
                </motion.div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
