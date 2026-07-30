"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, MousePointer2, Waypoints } from "lucide-react";
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
 */
export default function PilotClient() {
  const reduced = useReducedMotion();

  return (
    <div className="relative min-h-dvh text-white">
      {/* Page backdrop lives on its own layer *behind* the scene — putting the background on this
          wrapper instead paints over the canvas, which silently blanks the whole field. */}
      <div aria-hidden className="fixed inset-0 -z-20 bg-[#0B0B0F]" />
      <ParticleField />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0B0F]/70 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-5">
          <span className="text-sm font-extrabold tracking-[-0.02em]">Attune</span>
          <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#A1A1AA]">
            <Waypoints className="h-3.5 w-3.5" aria-hidden />
            Motion pilot
          </span>
        </div>
      </header>

      <main>
        {/* Hero — the scene is gathered here */}
        <section className="relative">
          <div className="mx-auto flex min-h-[86dvh] max-w-[1120px] flex-col justify-center px-5 py-24">
            <p className="mb-6 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#a894f7]">
              <MousePointer2 className="h-3.5 w-3.5" aria-hidden />
              {HERO.eyebrow}
            </p>
            <h1 className="max-w-2xl text-[clamp(2.1rem,7vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.02em] lg:text-[clamp(3rem,4.4vw,4.2rem)]">
              {HERO.headline.map((line, i) => (
                <span key={line} className={`block ${i === HERO.accentLine ? "text-[#6E56CF]" : ""}`}>
                  <SplitChars text={line} delay={i * 0.12} />
                </span>
              ))}
            </h1>
            <p className="mt-7 max-w-lg text-base leading-[1.65] text-[#A1A1AA]">{HERO.sub}</p>
            <p className="mt-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#A1A1AA]">
              <ArrowDown className="h-3.5 w-3.5" aria-hidden />
              Scroll — the field disperses, then re-gathers
            </p>
          </div>
        </section>

        {/* Manifesto — the scene is dispersed here; copy passes through the field */}
        <section className="relative">
          <div className="mx-auto max-w-[1120px] px-5">
            {MANIFESTO.map((para, i) => (
              <div key={para.slice(0, 24)} className="flex min-h-[72dvh] items-center">
                <motion.p
                  initial={reduced ? false : { opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-25%" }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className={`max-w-2xl text-[clamp(1.35rem,3.4vw,2.1rem)] font-extrabold leading-[1.32] tracking-[-0.02em] ${i % 2 ? "ml-auto text-right" : ""}`}
                >
                  {para}
                </motion.p>
              </div>
            ))}
          </div>
        </section>

        {/* Proof band — scene re-gathering behind it */}
        <section className="relative border-y border-white/10 bg-[#0B0B0F]/70 backdrop-blur-sm">
          <div className="mx-auto grid max-w-[1120px] gap-8 px-5 py-20 sm:grid-cols-3">
            {PROOF.map((p, i) => (
              <motion.div
                key={p.label}
                initial={reduced ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, ease: EASE, delay: reduced ? 0 : i * 0.1 }}
              >
                <p className="text-4xl font-extrabold tabular-nums tracking-[-0.02em]">{p.k}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#a894f7]">{p.label}</p>
                <p className="mt-2.5 text-sm leading-relaxed text-[#A1A1AA]">{p.note}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Technique notes */}
        <section className="relative">
          <div className="mx-auto grid max-w-[1120px] gap-5 px-5 py-24 sm:grid-cols-3">
            {STAGES.map((s, i) => (
              <motion.article
                key={s.tag}
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, ease: EASE, delay: reduced ? 0 : i * 0.08 }}
                className="min-w-0 rounded-2xl border border-white/10 bg-[#15151B]/85 p-6 backdrop-blur-sm sm:p-7"
              >
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#a894f7]">{s.tag}</p>
                <h2 className="mt-3 text-lg font-extrabold tracking-[-0.02em]">{s.title}</h2>
                <p className="mt-3 text-sm leading-[1.7] text-[#A1A1AA]">{s.body}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Close */}
        <section className="relative">
          {/* Deep bottom padding so the final scroll position lands on the wordmark stage with the
              technique cards already scrolled away — the payoff shape gets a clear viewport. */}
          <div className="mx-auto max-w-[1120px] px-5 pb-[48dvh] pt-8">
            <p className="max-w-3xl text-[clamp(1.25rem,3vw,1.9rem)] font-extrabold leading-[1.35] tracking-[-0.02em]">
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
