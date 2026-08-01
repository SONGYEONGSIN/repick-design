"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, MousePointer2 } from "lucide-react";
import SceneField from "./scene-field";
import { SplitChars, SplitLines } from "./split-text";
import { CLOSING, EASE, HERO, MANIFESTO, METHOD, NAV, PROOF, FOOTER_NOTE } from "./data";
import {
  ACCENT,
  BODY,
  COPY,
  DISPLAY,
  DISPLAY_FACE,
  FOCUS,
  HALO,
  HEADER_H,
  HEADER_ROW,
  MARK,
  MUTED,
  PILL,
  SHADOW,
  SHELL,
  STATEMENT,
} from "./tokens";

/**
 * KEPT — a scene page. One fixed canvas layer is the spine of the whole document; the copy below is
 * ordinary flow that passes over it like a caption track. There are no pinned sections and nothing
 * swaps content in place: the scene is a pure function of `scrollY / (scrollHeight - innerHeight)`,
 * which is the only way a page like this can be screenshotted twice and compared.
 *
 * Text never rides a scroll-linked opacity ramp. Contrast is audited at scroll 0, so a text layer
 * that is faded there reads as a contrast failure regardless of how it looks mid-scroll. Reveals are
 * one-shot on enter and settle at full opacity; the strong fades all live on the canvas.
 */

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * The page-wide settled flag, and it gates *above* every other animation decision.
 *
 * Two conditions, one answer: `prefers-reduced-motion`, and the capture pipeline's freeze flag
 * (injected before the first frame). Under either, the page renders as already-arrived rather than
 * animating into place — which is both what a reduced-motion visitor asked for and what makes two
 * captures of the same commit byte-identical. Resolved in a layout effect so the decision lands
 * before paint instead of one frame into a transition.
 */
function useStill(): boolean {
  const reduced = useReducedMotion();
  const [captured, setCaptured] = useState(false);
  useIsoLayoutEffect(() => {
    if ((window as unknown as { __SPECIMEN_FREEZE__?: boolean }).__SPECIMEN_FREEZE__) setCaptured(true);
  }, []);
  return Boolean(reduced) || captured;
}

/**
 * Is the page scrolled at all? Used only to arm the header scrim's blur.
 *
 * The blur is not free: a full-width `backdrop-filter` over a canvas that repaints on every scroll
 * event is the single most expensive thing this page could do, and it is pure decoration at rest.
 * Gating it on scroll keeps the cost off the load path entirely.
 */
function useScrolled(): boolean {
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
  const still = useStill();
  const scrolled = useScrolled();
  const enter = (delay: number) => (still ? { duration: 0 } : { duration: 0.7, ease: EASE, delay });
  const rise = (y: number) => (still ? false : { opacity: 0, y });

  return (
    <div className="relative min-h-dvh text-white">
      {/* Backdrop on its own layer *behind* the scene. Putting a background on this wrapper instead
          paints over the canvas and blanks the whole field — with no exception, no warning and no
          gate failure to tell you. */}
      {/* Near-black rather than the house #0B0B0F canvas token: under additive blending a grey
          backdrop lifts the darkest channel of every faint particle, flattening colour and contrast
          at once. Text contrast only improves. */}
      <div aria-hidden className="fixed inset-0 -z-20 bg-[#010102]" />
      {/* The same near-black again, `absolute` so it spans the whole *document* rather than the
          viewport, and behind everything so it changes nothing visually.

          It exists for the contrast audit. `globals.css` sets a white body background on the light
          scheme, which is what the desktop Lighthouse preset runs; this page only looks black
          because of the fixed layer above it. An audit resolves an element's background from what
          overlaps its rect, so in-viewport copy hits the fixed layer and passes while anything below
          the fold — the footer — falls through to white and fails. */}
      <div aria-hidden className="absolute inset-0 -z-30 bg-[#010102]" />
      <SceneField />

      {/* Header scrim. A transparent header over ordinary flowing content means body copy and
          particles pass straight through the nav. A gradient rather than a bar: the header should
          never acquire a surface, and a bar is the loudest way to lose that. Above the flowing
          content (z-20), below the header itself (z-30). */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-x-0 top-0 z-20 h-[clamp(6.5rem,8vw,9.5rem)] bg-gradient-to-b from-[#010102] via-[#010102]/85 to-transparent [mask-image:linear-gradient(to_bottom,black_55%,transparent)] ${
          scrolled ? "[backdrop-filter:blur(18px)]" : ""
        }`}
      />

      <header className={`fixed inset-x-0 top-0 z-30 ${HEADER_H}`}>
        <div className={`${SHELL} ${HEADER_H} ${HEADER_ROW} justify-between gap-4`}>
          <span
            className="text-[clamp(1.15rem,1.4vw,1.75rem)] font-semibold leading-none tracking-[0.02em]"
            style={DISPLAY_FACE}
          >
            KEPT
          </span>
          <nav aria-label="Sections" className="flex items-center gap-5 sm:gap-8">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={`${MARK} ${MUTED} hidden rounded transition-colors hover:text-white sm:inline-block ${FOCUS}`}
              >
                {n.label}
              </a>
            ))}
            {/* The two section links drop below `sm` — they are anchors to bands the reader scrolls
                through anyway, so nothing becomes unreachable. The one destination that is not
                reachable by scrolling keeps its place at every width. */}
            <Link href="/gallery" className={`${MARK} ${PILL} ${FOCUS}`}>
              Specimen
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero — state 01, the dust vortex, held to the right of the copy column */}
        <section className="relative" aria-label="Introduction">
          <div className={`${SHELL} flex min-h-dvh flex-col justify-center pb-24 pt-32`}>
            <motion.p
              initial={rise(12)}
              animate={{ opacity: 1, y: 0 }}
              transition={enter(0)}
              className={`${MARK} ${SHADOW} mb-6 inline-flex items-center gap-2`}
              style={{ color: ACCENT }}
            >
              <MousePointer2 className="h-4 w-4 shrink-0" aria-hidden />
              {HERO.eyebrow}
            </motion.p>
            <h1 className={`w-fit max-w-full ${DISPLAY}`} style={DISPLAY_FACE}>
              {HERO.headline.map((line, i) => (
                <span key={line} className="block" style={i === HERO.accentLine ? { color: ACCENT } : undefined}>
                  <SplitChars text={line} delay={0.12 + i * 0.1} still={still} />
                </span>
              ))}
            </h1>
            <motion.p
              initial={rise(16)}
              animate={{ opacity: 1, y: 0 }}
              transition={enter(0.45)}
              className={`mt-8 max-w-[34ch] ${BODY} ${COPY} ${SHADOW}`}
            >
              {HERO.sub}
            </motion.p>
            <motion.p
              initial={rise(16)}
              animate={{ opacity: 1, y: 0 }}
              transition={enter(0.6)}
              className={`${MARK} ${MUTED} ${SHADOW} mt-10 inline-flex items-center gap-2`}
            >
              <ArrowDown className="h-4 w-4 shrink-0" aria-hidden />
              {HERO.cue}
            </motion.p>
          </div>
        </section>

        {/* Field — state 02, the orbital rings. The copy is read *through* the dispersed field, which
            is the stretch that makes this a scene rather than two pictures with a cut between. */}
        <section id="field" className="relative scroll-mt-24" aria-label="Field">
          <div className={SHELL}>
            {MANIFESTO.map((para, i) => (
              <div key={para.slice(0, 24)} className="flex min-h-dvh items-center">
                <motion.p
                  initial={rise(24)}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-25%" }}
                  transition={still ? { duration: 0 } : { duration: 0.7, ease: EASE }}
                  className={`max-w-[min(100%,40rem)] ${STATEMENT} ${HALO} ${i === 1 ? "ml-auto text-right" : ""}`}
                  style={DISPLAY_FACE}
                >
                  {para}
                </motion.p>
              </div>
            ))}
          </div>
        </section>

        {/* Proof band — hairline-divided cells with no gap, so the column rhythm holds */}
        <section className="relative border-y border-white/10" aria-label="Figures">
          <div className={SHELL}>
            <div className="grid divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {PROOF.map((p, i) => (
                <motion.div
                  key={p.label}
                  initial={rise(20)}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={still ? { duration: 0 } : { duration: 0.55, ease: EASE, delay: i * 0.1 }}
                  className="min-w-0 py-14 sm:px-10 sm:first:pl-0 sm:last:pr-0"
                >
                  <p
                    className="text-[clamp(2.6rem,3.4vw,4rem)] font-extralight leading-none tabular-nums tracking-[-0.04em]"
                    style={DISPLAY_FACE}
                  >
                    {p.k}
                  </p>
                  <p className={`${MARK} mt-4`} style={{ color: ACCENT }}>
                    {p.label}
                  </p>
                  <p className={`mt-4 max-w-[28rem] ${BODY} ${COPY} ${SHADOW}`}>{p.note}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Payoff — state 03, the sneaker. A full viewport band with the copy held to the left half,
            so the silhouette lands in clear space instead of underneath a card. */}
        <section className="relative" aria-labelledby="payoff-title">
          <div className={`${SHELL} flex min-h-dvh items-center`}>
            <motion.div
              initial={rise(24)}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={still ? { duration: 0 } : { duration: 0.7, ease: EASE }}
              className="max-w-[min(100%,34rem)]"
            >
              <p className={MARK} style={{ color: ACCENT }}>
                State 03 — the object
              </p>
              <h2 id="payoff-title" className={`mt-6 ${STATEMENT} ${HALO}`} style={DISPLAY_FACE}>
                One shoe, out of everything listed this week.
              </h2>
              <p className={`mt-6 ${BODY} ${COPY} ${SHADOW}`}>
                This is where the field stops being weather and becomes a thing you could put on your
                foot. The outline is traced from a path and sampled boundary-first, so what arrives is
                a sneaker with a toe spring and a collar — not a shoe-coloured cloud.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Method */}
        <section id="method" className="relative scroll-mt-24" aria-label="Method">
          <div className={SHELL}>
            <div className="grid divide-y divide-white/10 py-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {METHOD.map((s, i) => (
                <motion.article
                  key={s.tag}
                  initial={rise(22)}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={still ? { duration: 0 } : { duration: 0.55, ease: EASE, delay: i * 0.08 }}
                  className="min-w-0 py-20 sm:px-10 sm:first:pl-0 sm:last:pr-0"
                >
                  <p className={MARK} style={{ color: ACCENT }}>
                    {s.tag}
                  </p>
                  <h2 className="mt-5 text-[clamp(1.35rem,1.75vw,1.9rem)] leading-[1.2] tracking-[-0.02em]" style={DISPLAY_FACE}>
                    {s.title}
                  </h2>
                  <p className={`mt-5 ${BODY} ${COPY} ${SHADOW}`}>{s.body}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Close — state 04, the wordmark, centred and lifted. The bottom padding is deliberate: the
            last scroll positions have to land with the copy scrolled away and the payoff shape alone
            in the frame, or the final state of the scene is something the visitor never sees. */}
        <section className="relative" aria-label="Closing">
          <div className={`${SHELL} pb-[95dvh] pt-32`}>
            <p className={`max-w-[min(100%,48rem)] ${STATEMENT} ${HALO}`} style={DISPLAY_FACE}>
              <SplitLines lines={CLOSING} still={still} />
            </p>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-white/10">
        <div className={`${SHELL} flex flex-col gap-8 py-10 sm:flex-row sm:items-end sm:justify-between`}>
          <div className="min-w-0">
            <p
              className="text-[clamp(1.5rem,2vw,2.2rem)] font-semibold leading-none tracking-[0.02em]"
              style={DISPLAY_FACE}
            >
              KEPT
            </p>
            <p className={`${MARK} ${MUTED} mt-3`}>{HERO.eyebrow}</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-7 gap-y-3">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={`${MARK} ${MUTED} rounded transition-colors hover:text-white ${FOCUS}`}
              >
                {n.label}
              </a>
            ))}
            <Link href="/gallery" className={`${MARK} ${MUTED} rounded transition-colors hover:text-white ${FOCUS}`}>
              Specimen
            </Link>
          </nav>
        </div>
        <div className={SHELL}>
          <div className="flex flex-col gap-2 border-t border-white/10 py-6 sm:flex-row sm:justify-between">
            {FOOTER_NOTE.map((line) => (
              <p key={line} className={`${MARK} ${MUTED} min-w-0`}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
