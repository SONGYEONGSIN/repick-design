"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, MousePointer2 } from "lucide-react";
import BrandMark from "./BrandMark";
import ParticleField from "./ParticleField";
import SceneFooter from "./SceneFooter";
import SiteLoader from "./SiteLoader";
import { SplitChars, SplitLines } from "./SplitText";
import { EASE, HERO, MANIFESTO, PROOF, STAGES } from "./data";
import { useIntro } from "./intro";
import { BODY, DISPLAY, HEAD_SHADOW, HEADER_H, HEADER_ROW, MARK, PILL, SHADOW, SHELL, STATEMENT } from "./tokens";

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

const NAV = [
  { href: "#manifesto", label: "Manifesto" },
  { href: "#technique", label: "Technique" },
];

/**
 * Is the page scrolled at all? Used only to arm the header's backdrop blur.
 *
 * The blur is not free: a full-width `backdrop-filter` sitting over a canvas that repaints every
 * frame took the measured perf score from 97 to 73. The reference does not pay it at rest either —
 * its `header__bg` is collapsed at scroll 0 and expands once you move — so gating on scroll matches
 * the behaviour *and* keeps the cost off the load path Lighthouse measures.
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

export default function PilotClient() {
  const reduced = useReducedMotion();
  const scrolled = useScrolled();
  const phase = useIntro();
  // Reduced motion outranks the curtain: `open` gates the entrance choreography, but under reduced
  // motion the hero must be settled from the first frame rather than animate when the curtain lifts.
  // See the note in ./SplitText — holding these on `open` alone made reduced-motion captures
  // time-dependent, and they diverged in 2 of 4 runs.
  const open = phase === "reveal" || Boolean(reduced);
  const enter = (delay: number) =>
    reduced ? { duration: 0 } : { duration: 0.7, ease: EASE, delay: open ? delay : 0 };

  return (
    <div className="relative min-h-dvh text-white">
      {/* Page backdrop lives on its own layer *behind* the scene — putting the background on this
          wrapper instead paints over the canvas, which silently blanks the whole field. */}
      {/* Pure black rather than the house #0B0B0F canvas: the reference measures #010101 (luminance
          0.6) against our 9.5, and on an additively-blended field a grey backdrop lifts the darkest
          channel of every faint particle, flattening colour as well as contrast. */}
      <div aria-hidden className="fixed inset-0 -z-20 bg-black" />
      {/* The same black again, but `absolute` so it spans the whole document rather than the
          viewport — and at -z-30, behind both the canvas and the fixed backdrop, so it changes
          nothing visually.

          It exists for the contrast audit. `globals.css` sets `body { background: #ffffff }` on the
          light scheme, which is what Lighthouse's desktop preset runs; the page only looks black
          because of the fixed layer above. axe resolves an element's background from what actually
          overlaps its rect, so in-viewport copy resolves to that fixed layer and passes, while
          anything below the fold — the footer bar — falls through to the white body and fails.
          Measured: without this layer the footer's five nodes reported #9a9a9a on #ffffff (2.81:1)
          and took the page from a11y 100 to 95, one point off the hard gate. */}
      <div aria-hidden className="absolute inset-0 -z-30 bg-black" />
      <ParticleField />

      {/* Header scrim. Measured problem: with a transparent header over ordinary flowing content,
          body copy and particles both pass straight through the nav — a sweep of 40 scroll positions
          found 41 frames where real text sat inside the 0-80px band, and at several of them a
          particle landed on top of a nav label.

          A gradient rather than a bar: the reference's header never acquires a surface, and giving
          ours one was the loudest structural difference between the two pages. This keeps the "no
          bar" reading — there is no edge to see — while still occluding whatever runs beneath it.
          z-20 puts it above the flowing content and below the header itself (z-30). */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-x-0 top-0 z-20 h-[clamp(7rem,8.5vw,10rem)] bg-gradient-to-b from-black via-black/85 to-transparent [mask-image:linear-gradient(to_bottom,black_55%,transparent)] ${scrolled ? "[backdrop-filter:blur(20px)]" : ""}`}
      />

      {/* Fixed and fully transparent at every scroll position — no bar, no blur, no rule. The
          reference's header never acquires a surface, and giving ours one was the loudest structural
          difference between the two pages. */}
      <header className={`fixed inset-x-0 top-0 z-30 ${HEADER_H}`}>
        <div className={`${SHELL} ${HEADER_H} ${HEADER_ROW} justify-between`}>
          <span className="inline-flex items-center gap-[0.55em] text-[clamp(1.25rem,1.35vw,1.75rem)] font-bold leading-none tracking-[-0.01em]">
            {/* Sized against the pill, not the wordmark. The row is bottom-aligned, so two items of
                different heights end up with different centres: at 1.1em the mark made the lockup
                29px against the pill's 49px and sat 10px low. The reference's mark is 43px to the
                pill's 48px — near enough that bottom-aligning lands both centres together. */}
            <BrandMark className="h-[1.68em] w-[1.68em] shrink-0 text-white" />
            Attune
          </span>
          {/* Measured at 390px before this: wordmark 80px + nav 333px against a 342px content box,
              so the nav ran 47px past the viewport and its first label sat under the wordmark. The
              header is `fixed`, so that overflow never reaches the document and the gate's width
              sweep reported zero — it has to be caught by looking.

              The two section links drop below `sm`. They are in-page anchors to bands the reader
              scrolls through anyway, so nothing becomes unreachable; the one destination that is not
              reachable by scrolling — Specimen — keeps its place at every width. */}
          <nav aria-label="Sections" className="flex items-center gap-5 sm:gap-8">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={`${MARK} hidden rounded text-[#9A9A9A] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a894f7] focus-visible:ring-offset-4 focus-visible:ring-offset-black sm:inline-block`}
              >
                {n.label}
              </a>
            ))}
            <Link
              href="/gallery"
              className={`${MARK} ${PILL} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a894f7] focus-visible:ring-offset-4 focus-visible:ring-offset-black`}
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
            {/* Hero reveals are held until the curtain lifts (`open`), so the entrance is seen
                rather than spent behind a black sheet. Every one of them settles at opacity 1 —
                a hero that rests faded is the measured a11y failure recorded above. */}
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={enter(0)}
              className={`${MARK} mb-6 inline-flex items-center gap-2 text-[#a894f7]`}
            >
              <MousePointer2 className="h-4 w-4" aria-hidden />
              {HERO.eyebrow}
            </motion.p>
            {/* Weight 400 and tracking -0.04em are the reference's, but the size is not: its face is a
                condensed grotesque whose characters run 0.37 of the font size against Pretendard's
                0.6, so setting our display at its 120px would make the headline column 786px where
                the reference's is 415px — nearly twice as wide, and straight through the scene.
                What is matched here is the *proportion* the reference actually composes with: a
                headline column around a third of the viewport, clear of the object beside it. */}
            <h1
              className={`w-fit ${DISPLAY} ${HEAD_SHADOW}`}
            >
              {HERO.headline.map((line, i) => (
                <span key={line} className={`block ${i === HERO.accentLine ? "text-[#a894f7]" : ""}`}>
                  <SplitChars text={line} delay={0.15 + i * 0.12} start={open} />
                </span>
              ))}
            </h1>
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={enter(0.5)}
              className={`mt-8 max-w-[30ch] ${BODY} ${SHADOW}`}
            >
              {HERO.sub}
            </motion.p>
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={enter(0.65)}
              className={`${MARK} mt-10 inline-flex items-center gap-2 text-[#9A9A9A]`}
            >
              <ArrowDown className="h-4 w-4" aria-hidden />
              Scroll — the field takes four forms
            </motion.p>
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
                  className={`max-w-[min(38vw,46rem)] ${STATEMENT} ${HEAD_SHADOW} ${i === 1 || i === 2 ? "ml-auto text-right" : ""}`}
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
          {/* Bottom padding so the final scroll positions land with the technique cards already
              scrolled away and the payoff shape in a clear viewport. It used to be 60dvh, when this
              was the last band on the page; the footer that now follows is itself a min-h-dvh band
              with a centred head, so it supplies that clearance and 60dvh here would only add a
              viewport and a half of empty scroll between the two. */}
          <div className={`${SHELL} pb-[24dvh] pt-24`}>
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

      <SceneFooter />

      {/* Last in the tree so it paints over everything without needing a z-index race; it removes
          itself entirely once the phase flips, and never mounts at all under capture or reduced
          motion (see ./intro). */}
      <SiteLoader phase={phase} />
    </div>
  );
}
