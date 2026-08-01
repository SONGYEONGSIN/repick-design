"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Focus } from "lucide-react";
import ApertureField from "./ApertureField";
import Mark from "./Mark";
import ShutterLoader from "./ShutterLoader";
import { CharRise, LineRise } from "./Reveal";
import { CLOSING, EASE, FOOTER_LINKS, FRAMES, HERO, MANIFESTO, PROOF, TECHNIQUE } from "./data";
import { useIntro } from "./intro";
import { BODY, DISPLAY, FOCUS, HEADER_H, HEADER_ROW, HEAD_SHADOW, MARK, PILL, SHADOW, SHELL, STATEMENT } from "./tokens";

/**
 * Reframe — a `scene` page. One fixed particle layer is the spine of the whole document and the copy
 * is a caption track running over it: iris → orbit rings → camera → wordmark, interpolated
 * continuously against document scroll progress.
 *
 * No pinned sections and no scroll hijacking. Every band below is ordinary document flow; the only
 * thing reading the scroll position is the canvas, which keeps the scene a pure function of an offset
 * the browser already owns.
 *
 * Text never rides a scroll-linked opacity ramp. Reveals fire once on enter and settle at full
 * opacity, because contrast is audited at scroll 0 and a faded text layer there fails it.
 */

const NAV = [
  { href: "#manifesto", label: "Manifesto" },
  { href: "#frames", label: "Frames" },
];

/**
 * Is the page scrolled at all? Used only to arm the header's backdrop blur.
 *
 * A full-width `backdrop-filter` over a canvas that repaints every frame is expensive enough to move
 * a measured performance score by twenty-odd points. Gating it on scroll keeps the cost off the load
 * path and matches the behaviour anyway — at rest there is nothing under the header to separate from.
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
  // Reduced motion outranks the curtain. `open` gates the entrance choreography, but under reduced
  // motion the hero has to be settled from the very first frame rather than animate when the curtain
  // lifts — otherwise a setting that asks for no motion still gets a transition, and the landing time
  // depends on when hydration happens to finish.
  const open = phase === "open" || Boolean(reduced);
  const enter = (delay: number) => (reduced ? { duration: 0 } : { duration: 0.7, ease: EASE, delay: open ? delay : 0 });
  const rise = (delay = 0) =>
    reduced ? { duration: 0 } : { duration: 0.6, ease: EASE, delay };

  return (
    <div className="relative min-h-dvh text-white">
      {/* The page backdrop lives on its own layers *behind* the scene. Putting a background on this
          wrapper instead paints straight over the canvas and blanks the entire field with no error,
          no warning and no failing check anywhere.

          Near-black rather than the house #0B0B0F canvas token: under additive blending a grey
          backdrop lifts the darkest channel of every faint particle and flattens contrast and colour
          at the same time. Text contrast only improves. */}
      <div aria-hidden className="fixed inset-0 -z-30 bg-[#010102]" />
      {/* The same ink again, `absolute` so it spans the whole document rather than the viewport.
          Visually it changes nothing — it exists for the contrast audit. The global stylesheet paints
          `body` white in the light scheme, and an accessibility checker resolves an element's
          background from what actually overlaps its rect, so anything below the fold (the footer)
          would otherwise be audited as grey type on white and fail. */}
      <div aria-hidden className="absolute inset-0 -z-30 bg-[#010102]" />

      <ApertureField />

      {/* Header scrim. With a surfaceless header over ordinary flowing content, body copy and
          particles both run straight through the nav. A gradient rather than a bar: the header is
          supposed to have no edge, and a bar is the loudest way to lose that. Above the content
          (z-20), below the header itself (z-30). */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-x-0 top-0 z-20 h-[clamp(6.5rem,8vw,9.5rem)] bg-gradient-to-b from-[#010102] via-[#010102]/85 to-transparent [mask-image:linear-gradient(to_bottom,black_55%,transparent)] ${
          scrolled ? "[backdrop-filter:blur(18px)]" : ""
        }`}
      />

      <header className={`fixed inset-x-0 top-0 z-30 ${HEADER_H}`}>
        <div className={`${SHELL} ${HEADER_H} ${HEADER_ROW} justify-between gap-4`}>
          <span className="inline-flex min-w-0 items-center gap-[0.55em] text-[clamp(1.05rem,1.25vw,1.6rem)] font-semibold leading-none tracking-[0.02em]">
            <Mark className="h-[1.55em] w-[1.55em] shrink-0 text-white" />
            Reframe
          </span>
          <nav aria-label="Sections" className="flex items-center gap-5 sm:gap-8">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={`${MARK} hidden rounded text-[#9AAAB3] transition-colors hover:text-white sm:inline-block ${FOCUS}`}
              >
                {n.label}
              </a>
            ))}
            <Link href="/gallery" className={`${MARK} ${PILL} ${FOCUS}`}>
              Archive
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Frame 01 — the iris. Copy column left, mass parked right. */}
        <section className="relative">
          <div className={`${SHELL} flex min-h-dvh flex-col justify-center pb-24 pt-32`}>
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={enter(0)}
              className={`${MARK} mb-7 inline-flex items-center gap-2 text-[#38BDF8]`}
            >
              <Focus className="h-4 w-4" aria-hidden />
              {HERO.eyebrow}
            </motion.p>

            {/* One h1 on the page. The glyph fragments below are aria-hidden, so the accessible name
                is carried here rather than by a wrapper with an invented role. */}
            <h1 aria-label={HERO.headline.join(" ")} className={`w-fit max-w-[16ch] ${DISPLAY} ${HEAD_SHADOW}`}>
              {HERO.headline.map((line, i) => (
                <span key={line} aria-hidden className={`block ${i === HERO.accentLine ? "text-[#38BDF8]" : ""}`}>
                  <CharRise text={line} delay={0.12 + i * 0.1} start={open} />
                </span>
              ))}
            </h1>

            <motion.p
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={enter(0.45)}
              className={`mt-9 max-w-[42ch] text-[#C8D6DD] ${BODY} ${SHADOW}`}
            >
              {HERO.sub}
            </motion.p>

            <motion.p
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={enter(0.6)}
              className={`${MARK} mt-12 inline-flex items-center gap-2 text-[#9AAAB3]`}
            >
              <ArrowDown className="h-4 w-4" aria-hidden />
              {HERO.cue}
            </motion.p>
          </div>
        </section>

        {/* Frame 02 — the sustained dispersed stage. The statements literally read through the rings,
            alternating sides so the mass and the column never occupy the same half of the frame. */}
        <section id="manifesto" className="relative scroll-mt-24">
          <h2 className="sr-only">Manifesto</h2>
          <div className={SHELL}>
            {MANIFESTO.map((para, i) => (
              <div key={para.slice(0, 20)} className="flex min-h-dvh items-center">
                <motion.p
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-22%" }}
                  transition={rise()}
                  className={`max-w-[min(88vw,34rem)] md:max-w-[min(42vw,44rem)] ${STATEMENT} ${HEAD_SHADOW} ${
                    i === 1 ? "md:ml-auto md:text-right" : ""
                  }`}
                >
                  {para}
                </motion.p>
              </div>
            ))}
          </div>
        </section>

        {/* Frame 03 — the caption track proper: four numbered frames on hairlines, no gaps, so the
            column rhythm survives. This band is where the scene resolves into the camera. */}
        <section id="frames" className="relative scroll-mt-24 border-t border-white/10">
          {/* A viewport-scale run-up before the first row. The camera — the payoff silhouette of the
              whole scene — lands exactly where this band begins, and without the clearance it would
              arrive underneath a three-column grid. */}
          <div className={SHELL}>
            <h2 className={`${MARK} pt-[26dvh] text-[#38BDF8]`}>Four frames</h2>
            <div className="mt-10 divide-y divide-white/10 border-t border-white/10">
              {FRAMES.map((f, i) => (
                <motion.article
                  key={f.n}
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-70px" }}
                  transition={rise(reduced ? 0 : i * 0.06)}
                  className="grid min-w-0 gap-x-8 gap-y-4 py-10 md:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1.1fr)] md:py-12"
                >
                  <p className={`${MARK} tabular-nums text-[#38BDF8]`}>
                    <span className="mr-3">{f.n}</span>
                    <span className="text-[#9AAAB3]">{f.tag}</span>
                  </p>
                  <h3 className="min-w-0 text-[clamp(1.15rem,1.7vw,1.8rem)] font-normal leading-[1.25] tracking-[-0.015em]">
                    {f.title}
                  </h3>
                  <p className={`min-w-0 text-[#B6C4CB] ${BODY} ${SHADOW}`}>{f.body}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Numbers */}
        <section id="proof" className="relative scroll-mt-24 border-t border-white/10">
          <div className={SHELL}>
            <h2 className="sr-only">By the numbers</h2>
            <div className="grid divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {PROOF.map((p, i) => (
                <motion.div
                  key={p.label}
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-70px" }}
                  transition={rise(reduced ? 0 : i * 0.08)}
                  className="min-w-0 py-14 sm:px-9 sm:first:pl-0 sm:last:pr-0"
                >
                  <p className="text-[clamp(2.4rem,3.6vw,3.6rem)] font-normal leading-none tabular-nums tracking-[-0.035em]">
                    {p.k}
                  </p>
                  <p className={`${MARK} mt-5 text-[#38BDF8]`}>{p.label}</p>
                  <p className={`mt-4 max-w-[28rem] text-[#B6C4CB] ${BODY}`}>{p.note}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Frame 04 — the close. The bottom padding is deliberate: the last scroll positions have to
            land with the copy scrolled away and the wordmark alone in a clear viewport, or the payoff
            of the whole scene is delivered underneath a paragraph. */}
        <section className="relative border-t border-white/10">
          <div className={`${SHELL} pb-[34dvh] pt-24`}>
            <p className={`max-w-[54rem] text-[clamp(1.3rem,2.6vw,2.4rem)] font-normal leading-[1.28] ${SHADOW}`}>
              <LineRise lines={CLOSING} />
            </p>
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={rise()}
              className={`mt-12 max-w-[46rem] text-[#9AAAB3] ${BODY} ${SHADOW}`}
            >
              {TECHNIQUE}
            </motion.p>
          </div>
        </section>
      </main>

      <footer className="relative flex min-h-[46dvh] flex-col justify-end border-t border-white/10 pb-12 pt-20">
        <div className={`${SHELL} flex flex-col gap-10 md:flex-row md:items-end md:justify-between`}>
          <div className="min-w-0">
            <span className="inline-flex items-center gap-[0.55em] text-[clamp(1.05rem,1.25vw,1.6rem)] font-semibold leading-none tracking-[0.02em]">
              <Mark className="h-[1.55em] w-[1.55em] shrink-0 text-white" />
              Reframe
            </span>
            <p className={`mt-5 max-w-[34ch] text-[#9AAAB3] ${BODY}`}>
              Resale intelligence for objects that already exist.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {FOOTER_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`${MARK} rounded text-[#9AAAB3] transition-colors hover:text-white ${FOCUS}`}
              >
                {l.label}
              </a>
            ))}
            <Link href="/gallery" className={`${MARK} rounded text-[#9AAAB3] transition-colors hover:text-white ${FOCUS}`}>
              Archive
            </Link>
          </nav>
        </div>
        <div className={`${SHELL} mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8`}>
          <p className={`${MARK} tabular-nums text-[#9AAAB3]`}>Reframe Optics 2026 — all rights reserved</p>
          <p className={`${MARK} text-[#9AAAB3]`}>Fourteen thousand marks, one draw call</p>
        </div>
      </footer>

      {/* Last in the tree so it paints over everything without a z-index race. It removes itself
          entirely once the phase flips, and never mounts at all under capture or reduced motion. */}
      <ShutterLoader phase={phase} />
    </div>
  );
}
