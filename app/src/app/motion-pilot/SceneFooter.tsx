"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CLOSING, EASE, FOOTER_NAV, FOOTER_NOTE } from "./data";
import { MARK, SHADOW, SHELL } from "./tokens";

/**
 * Closing band, built to the reference's measured footer rather than to a generic one.
 *
 * What the measurement gave: a full-viewport section (exactly 100vh at the reference's 730px
 * viewport), split into a centred head — the closing statement plus a single call to action — and a
 * bar along the bottom carrying wordmark, copyright, and links. No surface of its own: the scene
 * runs behind it like it does behind every other band, which is why this is a `min-h-dvh` band with
 * a transparent background rather than the slab of dark grey a footer usually gets.
 *
 * The statement repeats the loading curtain's, which is the point — see `CLOSING` in ./data.
 */
export default function SceneFooter() {
  const reduced = useReducedMotion();

  return (
    <footer className={`relative border-t border-white/10 ${SHELL}`}>
      <div className="flex min-h-dvh flex-col">
        <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
          <motion.h2
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.7, ease: EASE }}
            className={`text-[clamp(1.9rem,4.6vw,3.6rem)] font-normal leading-[1.15] tracking-[-0.03em] ${SHADOW}`}
          >
            {CLOSING.map((line, i) => (
              <span key={line} className={`block ${i === 1 ? "text-[#a894f7]" : ""}`}>
                {line}
              </span>
            ))}
          </motion.h2>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : 0.12 }}
            className="mt-12"
          >
            <Link
              href="/gallery"
              className={`${MARK} inline-flex rounded-full bg-[#6E56CF] px-6 py-3.5 text-white transition-colors hover:bg-[#7d67d6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a894f7] focus-visible:ring-offset-4 focus-visible:ring-offset-black`}
            >
              See the specimen
            </Link>
          </motion.div>
        </div>

        {/* Bar — hairline-divided from the head, the same rule the proof and technique grids use. */}
        <div className="flex flex-col gap-8 border-t border-white/10 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <span className="text-[1.35rem] font-bold leading-none tracking-[-0.01em]">Attune</span>
            <p className="text-[0.8rem] font-extralight leading-[1.5] text-[#9A9A9A]">
              {FOOTER_NOTE.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {FOOTER_NAV.map((n) =>
              n.href.startsWith("#") ? (
                <a
                  key={n.href}
                  href={n.href}
                  className={`${MARK} rounded text-[#9A9A9A] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a894f7] focus-visible:ring-offset-4 focus-visible:ring-offset-black`}
                >
                  {n.label}
                </a>
              ) : (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`${MARK} rounded text-[#9A9A9A] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a894f7] focus-visible:ring-offset-4 focus-visible:ring-offset-black`}
                >
                  {n.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      </div>
    </footer>
  );
}
