"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, MousePointer2 } from "lucide-react";
import ParticleField from "./ParticleField";
import { SplitChars, SplitLines } from "./SplitText";
import { EASE, HERO, MANIFESTO, PROOF, STAGES } from "./data";

/**
 * v3 — the reference architecture: one persistent scene layer for the whole document, with ordinary
 * content flowing over it. No pinned sections; scroll position drives the scene, not the DOM.
 *
 * Text never rides a scroll-linked opacity ramp. Lighthouse audits contrast at scroll 0, so a faded
 * text layer there reads as a contrast failure and takes down the a11y hard gate (measured earlier:
 * fade floor 0.35 → a11y 95, floor 0.85 → 100). Reveals are one-shot on enter and settle at full
 * opacity instead.
 *
 * Layout and type are set from measurements of the reference rather than by eye — see
 * `vault/00-principles/brief-scene.md` §1-3. The numbers that mattered: a 1280px content column
 * (128px gutters at 1536), a fixed header that never gains a bar, and a type scale built on light
 * weights at large sizes (display 120/200, statements 38.4/400, body 19.2/200) where ours had been
 * uniformly extra-bold.
 */

/**
 * One shell for every band. `max-w` binds from 1280 up, so at the reference's 1536 viewport the
 * column lands at exactly x=128 with no padding of its own; below that the padding takes over as the
 * gutter. Two nested wrappers would put the text 40px further in than the reference.
 */
const SHELL = "mx-auto w-full max-w-[1280px] px-6 md:px-10 xl:px-0";

/** 14px / 600 / uppercase — the reference's one small-type style, used for nav, eyebrow and caption. */
const MARK = "text-[0.875rem] font-semibold uppercase tracking-[0.025em]";

const SHADOW = "[text-shadow:0_2px_22px_rgba(1,1,2,0.94)]";

const NAV = [
  { href: "#manifesto", label: "Manifesto" },
  { href: "#technique", label: "Technique" },
];

export default function PilotClient() {
  const reduced = useReducedMotion();

  return (
    <div className="relative min-h-dvh text-white">
      {/* Page backdrop lives on its own layer *behind* the scene — putting the background on this
          wrapper instead paints over the canvas, which silently blanks the whole field. */}
      {/* Pure black rather than the house #0B0B0F canvas: the reference measures #010101 (luminance
          0.6) against our 9.5, and on an additively-blended field a grey backdrop lifts the darkest
          channel of every faint particle, flattening colour as well as contrast. */}
      <div aria-hidden className="fixed inset-0 -z-20 bg-black" />
      <ParticleField />

      {/* Fixed and fully transparent at every scroll position — no bar, no blur, no rule. The
          reference's header never acquires a surface, and giving ours one was the loudest structural
          difference between the two pages. */}
      <header className="fixed inset-x-0 top-0 z-30 h-20">
        <div className={`${SHELL} flex h-20 items-center justify-between`}>
          <span className="text-[1.6rem] font-bold leading-none tracking-[-0.01em]">Attune</span>
          <nav aria-label="Sections" className="flex items-center gap-8">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={`${MARK} rounded text-[#9A9A9A] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a894f7] focus-visible:ring-offset-4 focus-visible:ring-offset-black`}
              >
                {n.label}
              </a>
            ))}
            <Link
              href="/gallery"
              className={`${MARK} rounded-full bg-[#6E56CF] px-4 py-2.5 text-white transition-colors hover:bg-[#7d67d6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a894f7] focus-visible:ring-offset-4 focus-visible:ring-offset-black`}
            >
              Specimen
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero — the scene is gathered here */}
        <section className="relative">
          <div className={`${SHELL} flex min-h-dvh flex-col justify-center pb-24 pt-32`}>
            <p className={`${MARK} mb-6 inline-flex items-center gap-2 text-[#a894f7]`}>
              <MousePointer2 className="h-4 w-4" aria-hidden />
              {HERO.eyebrow}
            </p>
            {/* Weight 400 and tracking -0.04em are the reference's, but the size is not: its face is a
                condensed grotesque whose characters run 0.37 of the font size against Pretendard's
                0.6, so setting our display at its 120px would make the headline column 786px where
                the reference's is 415px — nearly twice as wide, and straight through the scene.
                What is matched here is the *proportion* the reference actually composes with: a
                headline column around a third of the viewport, clear of the object beside it. */}
            <h1
              className={`w-fit text-[clamp(2.5rem,6vw,5.5rem)] font-normal leading-[1.1] tracking-[-0.04em] ${SHADOW}`}
            >
              {HERO.headline.map((line, i) => (
                <span key={line} className={`block ${i === HERO.accentLine ? "text-[#a894f7]" : ""}`}>
                  <SplitChars text={line} delay={i * 0.12} />
                </span>
              ))}
            </h1>
            <p className={`mt-8 max-w-[28rem] text-[1.2rem] font-extralight leading-[1.5] ${SHADOW}`}>
              {HERO.sub}
            </p>
            <p className={`${MARK} mt-10 inline-flex items-center gap-2 text-[#9A9A9A]`}>
              <ArrowDown className="h-4 w-4" aria-hidden />
              Scroll — the field disperses, then re-gathers
            </p>
          </div>
        </section>

        {/* Manifesto — the scene is dispersed here; copy passes through the field */}
        <section id="manifesto" className="relative scroll-mt-20">
          <div className={SHELL}>
            {MANIFESTO.map((para, i) => (
              <div key={para.slice(0, 24)} className="flex min-h-dvh items-center">
                <motion.p
                  initial={reduced ? false : { opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-25%" }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className={`max-w-[46rem] text-[clamp(1.5rem,3.3vw,2.4rem)] font-normal leading-[1.2] ${SHADOW} ${i % 2 ? "ml-auto text-right" : ""}`}
                >
                  {para}
                </motion.p>
              </div>
            ))}
          </div>
        </section>

        {/* Proof band — scene re-gathering behind it. Hairline-divided cells with no gap, which is
            how the reference builds its modular grid; gaps would break the column rhythm. */}
        <section className="relative border-y border-white/10">
          <div className={SHELL}>
            <div className="grid divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {PROOF.map((p, i) => (
                <motion.div
                  key={p.label}
                  initial={reduced ? false : { opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, ease: EASE, delay: reduced ? 0 : i * 0.1 }}
                  className="px-0 py-14 sm:px-10 sm:first:pl-0 sm:last:pr-0"
                >
                  <p className="text-[3.2rem] font-normal leading-none tabular-nums tracking-[-0.04em]">{p.k}</p>
                  <p className={`${MARK} mt-4 text-[#a894f7]`}>{p.label}</p>
                  <p className="mt-4 max-w-[26rem] text-[1.05rem] font-extralight leading-[1.5] text-[#C9C9C9]">
                    {p.note}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technique notes */}
        <section id="technique" className="relative scroll-mt-20">
          <div className={SHELL}>
            <div className="grid divide-y divide-white/10 py-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {STAGES.map((s, i) => (
                <motion.article
                  key={s.tag}
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, ease: EASE, delay: reduced ? 0 : i * 0.08 }}
                  className="min-w-0 px-0 py-16 sm:px-10 sm:first:pl-0 sm:last:pr-0"
                >
                  <p className={`${MARK} text-[#a894f7]`}>{s.tag}</p>
                  <h2 className="mt-5 text-[1.6rem] font-normal leading-[1.2] tracking-[-0.02em]">{s.title}</h2>
                  <p className="mt-5 text-[1.05rem] font-extralight leading-[1.55] text-[#C9C9C9]">{s.body}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Close */}
        <section className="relative">
          {/* Deep bottom padding so the final scroll position lands on the wordmark stage with the
              technique cards already scrolled away — the payoff shape gets a clear viewport. */}
          <div className={`${SHELL} pb-[60dvh] pt-24`}>
            <p className={`max-w-[52rem] text-[clamp(1.4rem,3.1vw,2.4rem)] font-normal leading-[1.25] ${SHADOW}`}>
              <SplitLines
                lines={[
                  "The expensive part of this vocabulary was never the animation.",
                  "It was proving the page still renders the same way twice —",
                  "which is what a gate, and a judge, actually need.",
                ]}
              />
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
