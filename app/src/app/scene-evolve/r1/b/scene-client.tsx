"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, MousePointer2 } from "lucide-react";
import BrandMark from "./BrandMark";
import Curtain from "./Curtain";
import ParticleScene from "./ParticleScene";
import { SplitChars, SplitLines } from "./SplitText";
import { CLOSING, EASE, FOOTER_NAV, FOOTER_NOTE, HERO, MANIFESTO, PROOF, STAGES } from "./data";
import { useIntro } from "./intro";
import { BODY, COLUMN, DISPLAY, HEADER_H, HEADER_ROW, MARK, MONO, PILL, RING, SHADOW, SHELL, STATEMENT } from "./tokens";

/**
 * Second — one persistent scene for the whole document, with ordinary content flowing over it.
 *
 * The canvas is a single fixed layer at the page root and the *document's* scroll progress drives
 * it. There are no pinned sections and nothing swaps content under a sticky viewport: every band
 * below is normal flow, which is what keeps the frame a pure function of scroll offset.
 *
 * Text never rides a scroll-linked opacity ramp. Lighthouse audits contrast at scroll 0, so a faded
 * text layer there reads as a contrast failure and takes the accessibility gate down with it.
 * Reveals here are one-shot on enter and settle at full opacity.
 */

const NAV = [
  { href: "#manifesto", label: "Manifesto" },
  { href: "#states", label: "States" },
];

/**
 * Is the page scrolled at all? Used only to arm the header's backdrop blur.
 *
 * The blur is not free — a full-width `backdrop-filter` over a canvas that repaints on every scroll
 * event is the difference between a perf score in the high nineties and one in the seventies. Gating
 * it on scroll keeps the cost off the load path entirely, and the header reads as a bare row at rest
 * either way.
 */
function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrolled;
}

export default function SceneClient() {
  const reduced = useReducedMotion();
  const scrolled = useScrolled();
  const phase = useIntro();
  // Reduced motion outranks the curtain: `open` gates the entrance choreography, but under reduced
  // motion the hero has to be settled from the first frame rather than animate when the sheet lifts.
  const open = phase === "open" || Boolean(reduced);
  const enter = (delay: number) =>
    reduced ? { duration: 0 } : { duration: 0.7, ease: EASE, delay: open ? delay : 0 };

  return (
    <div className="relative min-h-dvh text-white">
      {/* The backdrop lives on its own layer *behind* the scene. Putting a background on this
          wrapper instead paints straight over the canvas and blanks the field with no error, no
          warning and no gate failure anywhere. */}
      {/* Near-black rather than the house #0B0B0F canvas token: on an additively blended field a
          grey backdrop lifts the darkest channel of every faint particle and flattens contrast and
          colour at the same time. */}
      <div aria-hidden className="fixed inset-0 -z-20 bg-[#010102]" />
      {/* The same near-black again, `absolute` so it spans the whole *document* rather than the
          viewport, and behind everything so it changes nothing visually. It exists for the contrast
          audit: `globals.css` sets a white body under the light scheme, which is what Lighthouse's
          desktop preset runs, and axe resolves an element's background from what overlaps its rect —
          so copy below the fold (the footer) would otherwise be audited as grey on white and fail. */}
      <div aria-hidden className="absolute inset-0 -z-30 bg-[#010102]" />
      <ParticleScene />

      {/* Header scrim — a gradient, never a bar. With a transparent header over flowing content the
          body copy and the particles both run straight through the nav labels; a hard bar fixes that
          and costs the bare-header reading, so this is an edgeless fade instead, above the content
          and below the header. */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-x-0 top-0 z-20 h-[clamp(6.5rem,8vw,9.5rem)] bg-gradient-to-b from-[#010102] via-[#010102]/85 to-transparent [mask-image:linear-gradient(to_bottom,black_55%,transparent)] ${scrolled ? "[backdrop-filter:blur(18px)]" : ""}`}
      />

      <header className={`fixed inset-x-0 top-0 z-30 ${HEADER_H}`}>
        <div className={`${SHELL} ${HEADER_H} ${HEADER_ROW} justify-between`}>
          <span
            className="inline-flex items-center gap-[0.5em] text-[clamp(1.1rem,1.25vw,1.6rem)] font-normal leading-none tracking-[0.02em]"
            style={MONO}
          >
            <BrandMark className="h-[1.5em] w-[1.5em] shrink-0 text-white" />
            Second
          </span>
          {/* The two section links drop below `sm`: they are anchors to bands the reader scrolls
              through anyway, so nothing becomes unreachable, while the one destination that is not
              reachable by scrolling keeps its place at every width. */}
          <nav aria-label="Sections" className="flex items-center gap-5 sm:gap-8">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                style={MONO}
                className={`${MARK} ${RING} hidden rounded text-[#9A9A9A] transition-colors hover:text-white sm:inline-block`}
              >
                {n.label}
              </a>
            ))}
            <Link href="/gallery" style={MONO} className={`${MARK} ${PILL} ${RING}`}>
              Specimen
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero — the field is dust here, parked to the right of the copy on wide viewports. */}
        <section className="relative">
          <div className={`${SHELL} flex min-h-dvh flex-col justify-center pb-24 pt-32`}>
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={enter(0)}
              style={MONO}
              className={`${MARK} ${SHADOW} mb-7 inline-flex items-center gap-2 text-[#FF6A93]`}
            >
              <MousePointer2 className="h-4 w-4" aria-hidden />
              {HERO.eyebrow}
            </motion.p>
            {/* The headline column is sized as a share of the viewport rather than at a borrowed
                pixel size: a monospace face sets far wider per character than a proportional one, so
                a px value tuned elsewhere would run this column straight through the scene. */}
            <h1 className={`w-fit max-w-[16ch] ${DISPLAY}`} style={MONO}>
              {HERO.headline.map((line, i) => (
                <span key={line} className={`block ${i === HERO.accentLine ? "text-[#FF6A93]" : ""}`}>
                  <SplitChars text={line} delay={0.12 + i * 0.1} start={open} />
                </span>
              ))}
            </h1>
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={enter(0.45)}
              className={`mt-9 max-w-[36ch] ${BODY} ${SHADOW}`}
            >
              {HERO.sub}
            </motion.p>
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={enter(0.6)}
              style={MONO}
              className={`${MARK} ${SHADOW} mt-12 inline-flex items-center gap-2 text-[#9A9A9A]`}
            >
              <ArrowDown className="h-4 w-4" aria-hidden />
              {HERO.cue}
            </motion.p>
          </div>
        </section>

        {/* Manifesto — the field is at its orbit state through this whole band, so the sentences
            pass between the tracks rather than over a mass. */}
        <section id="manifesto" className="relative scroll-mt-24">
          <div className={SHELL}>
            <h2 className={`${MARK} ${SHADOW} pt-10 text-[#9A9A9A]`} style={MONO}>
              Manifesto
            </h2>
            {MANIFESTO.map((para, i) => (
              <div key={para.slice(0, 24)} className="flex min-h-dvh items-center">
                <motion.p
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-25%" }}
                  transition={reduced ? { duration: 0 } : { duration: 0.7, ease: EASE }}
                  className={`max-w-[min(46vw,44rem)] ${STATEMENT} ${i === 0 ? "" : "ml-auto text-right"}`}
                >
                  {para}
                </motion.p>
              </div>
            ))}
          </div>
        </section>

        {/* From here down the copy runs in a left column and the right half of the frame belongs to
            the scene — the dial gathers there and the wordmark lands there. Composing the bands
            around where the mass is parked is the difference between text over a sculpture and text
            beside one; a full-width grid here put the third cell straight under the case. */}
        <section className="relative border-y border-white/10">
          <div className={SHELL}>
            <div className={COLUMN}>
              <h2 className={`${MARK} ${SHADOW} pt-14 text-[#9A9A9A]`} style={MONO}>
                The movement
              </h2>
              <dl className="divide-y divide-white/10">
                {PROOF.map((p, i) => (
                  <motion.div
                    key={p.label}
                    initial={reduced ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={reduced ? { duration: 0 } : { duration: 0.55, ease: EASE, delay: i * 0.1 }}
                    className="flex flex-col gap-4 py-10 sm:flex-row sm:items-baseline sm:gap-10"
                  >
                    <dt className="min-w-0 sm:w-[38%]">
                      <span
                        className="block text-[clamp(2rem,3vw,3rem)] font-normal leading-none tabular-nums tracking-[-0.04em]"
                        style={MONO}
                      >
                        {p.k}
                      </span>
                      <span className={`${MARK} ${SHADOW} mt-4 block text-[#FF6A93]`} style={MONO}>
                        {p.label}
                      </span>
                    </dt>
                    <dd className={`min-w-0 text-[0.98rem] font-light leading-[1.6] text-[#C9C9C9] sm:flex-1 ${SHADOW}`}>
                      {p.note}
                    </dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* The four states, named. */}
        <section id="states" className="relative scroll-mt-24">
          <div className={SHELL}>
            <div className={COLUMN}>
              <h2 className={`${MARK} ${SHADOW} pt-14 text-[#9A9A9A]`} style={MONO}>
                Four states, one field
              </h2>
              <div className="grid divide-y divide-white/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:[&>*:nth-child(n+3)]:border-t sm:[&>*:nth-child(n+3)]:border-white/10">
                {STAGES.map((s, i) => (
                  <motion.article
                    key={s.tag}
                    initial={reduced ? false : { opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={reduced ? { duration: 0 } : { duration: 0.55, ease: EASE, delay: i * 0.08 }}
                    className="min-w-0 px-0 py-12 sm:px-8 sm:[&:nth-child(odd)]:pl-0 sm:[&:nth-child(even)]:pr-0"
                  >
                    <p className={`${MARK} ${SHADOW} text-[#FF6A93]`} style={MONO}>
                      {s.tag}
                    </p>
                    <h3 className="mt-5 text-[1.45rem] font-normal leading-[1.15] tracking-[-0.02em]" style={MONO}>
                      {s.title}
                    </h3>
                    <p className={`mt-5 text-[0.98rem] font-light leading-[1.6] text-[#C9C9C9] ${SHADOW}`}>{s.body}</p>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Close — the field is on its way to the wordmark from here down. */}
        <section className="relative">
          <div className={`${SHELL} pb-[20dvh] pt-24`}>
            <p className={`max-w-[34ch] text-[clamp(1.25rem,2.4vw,2rem)] font-light leading-[1.35] tracking-[-0.02em]`} style={MONO}>
              <SplitLines
                lines={[
                  "A second owner is not a discount.",
                  "It is the same object, asked again,",
                  "at the moment someone is looking.",
                ]}
              />
            </p>
          </div>
        </section>
      </main>

      {/* Closing band. A full viewport of it, so the last scroll positions belong to the wordmark
          state rather than to content sitting on top of it. Left-aligned on purpose: the field is
          parked to the right through this band. */}
      <footer className={`relative border-t border-white/10 ${SHELL}`}>
        <div className="flex min-h-dvh flex-col">
          <div className="flex flex-1 flex-col justify-center py-24">
            <motion.h2
              initial={reduced ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={reduced ? { duration: 0 } : { duration: 0.7, ease: EASE }}
              className="max-w-[13ch] text-[clamp(1.8rem,3.6vw,3rem)] font-light leading-[1.15] tracking-[-0.035em]"
              style={MONO}
            >
              {CLOSING.map((line, i) => (
                <span key={line} className={`block ${i === 1 ? "text-[#FF6A93]" : ""}`}>
                  {line}
                </span>
              ))}
            </motion.h2>
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={reduced ? { duration: 0 } : { duration: 0.6, ease: EASE, delay: 0.12 }}
              className="mt-12"
            >
              <Link href="/gallery" style={MONO} className={`${MARK} ${PILL} ${RING}`}>
                See the specimen
              </Link>
            </motion.div>
          </div>

          {/* The bar carries the shadow: the wordmark state lands right behind this strip at the end
              of the document, and it is the particles the halo is for, not the backdrop. */}
          <div className={`flex flex-col gap-8 border-t border-white/10 py-10 md:flex-row md:items-center md:justify-between ${SHADOW}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <span className="inline-flex items-center gap-[0.5em] text-[1.15rem] font-normal leading-none tracking-[0.02em]" style={MONO}>
                <BrandMark className="h-[1.35em] w-[1.35em] shrink-0 text-white" />
                Second
              </span>
              <p className="text-[0.82rem] font-light leading-[1.5] text-[#9A9A9A]">
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
                    style={MONO}
                    className={`${MARK} ${RING} rounded text-[#9A9A9A] transition-colors hover:text-white`}
                  >
                    {n.label}
                  </a>
                ) : (
                  <Link
                    key={n.href}
                    href={n.href}
                    style={MONO}
                    className={`${MARK} ${RING} rounded text-[#9A9A9A] transition-colors hover:text-white`}
                  >
                    {n.label}
                  </Link>
                ),
              )}
            </nav>
          </div>
        </div>
      </footer>

      {/* Last in the tree so it paints over everything without a z-index race, and absent — not
          hidden — the moment the phase flips. Never mounted at all under capture or reduced motion. */}
      <Curtain phase={phase} />
    </div>
  );
}
