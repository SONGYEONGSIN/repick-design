"use client";

import { ArrowRight, CheckCircle2, FileSearch, ShieldCheck, TriangleAlert } from "lucide-react";
import { ChairGlyph } from "./Glyphs";
import { Eyebrow, FigCaption, Pill, Segmented, StatBlock } from "./ui";
import { COLOR, FOCUS_RING, TRACK, W } from "./tokens";
import {
  RIGOR_LEVELS,
  WINDOWS,
  SUBJECT,
  type RigorId,
  type WindowId,
  type Verdict,
} from "./data";

export default function Hero({
  rigorId,
  windowId,
  onRigor,
  onWindow,
  verdict,
}: {
  rigorId: RigorId;
  windowId: WindowId;
  onRigor: (id: RigorId) => void;
  onWindow: (id: WindowId) => void;
  verdict: Verdict;
}) {
  return (
    <section id="hero" className="mx-auto max-w-[1600px] px-5 sm:px-8 pt-10 sm:pt-14 pb-16 sm:pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-start">
        {/* Left: headline column — 7 of 12 */}
        <div className="lg:col-span-7 min-w-0">
          <Eyebrow>
            <FileSearch className="size-3.5 shrink-0" aria-hidden="true" />
            Case File {SUBJECT.caseFile.split("-").pop()} — opened {SUBJECT.opened}
          </Eyebrow>

          <h1
            className={`${W.heavy} mt-5 text-[clamp(2.75rem,2rem+4vw,5.75rem)] leading-[0.98]`}
            style={{ color: COLOR.ink, letterSpacing: "-0.02em", fontFamily: "var(--font-display-wide), var(--font-sans)" }}
          >
            Before it&apos;s a listing, it&apos;s a case file.
          </h1>

          <p
            className={`${W.body} mt-6 text-base leading-[1.6] max-w-[480px]`}
            style={{ color: COLOR.ink }}
          >
            repick&apos;s AI reviews condition, provenance and recent comparable sales before a
            single price appears — then hands you the same evidence it used, not just the
            conclusion.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#listings"
              className={`${W.label} ${FOCUS_RING} inline-flex items-center gap-2 rounded-md px-5 py-3 text-[14px]`}
              style={{ background: COLOR.accent, color: COLOR.white }}
            >
              Open the full dossier
              <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
            </a>
            <p className={`${W.body} text-[13px] leading-snug max-w-[280px]`} style={{ color: COLOR.mutedOnBg }}>
              Every number on this page is reproducible — adjust the assumptions on the right and
              watch it re-derive.
            </p>
          </div>

          {/* A quiet, empty grid cell reserved for the case-file numeral. Kept off to the side
              of the headline (not layered behind its glyphs) so there is never a collision to
              worry about between the two contrast floors. Weight 400 + wide tracking + the same
              muted ink used for captions — it recedes as a label, not a second headline. */}
          <div className="hidden lg:block mt-14" aria-hidden="true">
            <span
              className={`${W.body} block leading-none`}
              style={{
                color: COLOR.mutedOnBg,
                fontSize: "4.5rem",
                letterSpacing: TRACK.stat,
                fontFamily: "var(--font-display-wide), var(--font-sans)",
              }}
            >
              2291
            </span>
          </div>
        </div>

        {/* Right: the dossier card — the mandated proof, in the hero's own grid. */}
        <div className="lg:col-span-5 min-w-0">
          <div
            className="rounded-lg p-4 sm:p-5"
            style={{ background: COLOR.surface, border: `1px solid ${COLOR.ink}26` }}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span
                className={`${W.label} text-[11px] uppercase`}
                style={{ color: COLOR.mutedOnSurf, letterSpacing: TRACK.caption }}
              >
                Exhibit A — Subject
              </span>
              <span
                className={`${W.label} text-[11px] tabular-nums`}
                style={{ color: COLOR.mutedOnSurf, letterSpacing: TRACK.caption }}
              >
                {SUBJECT.caseFile}
              </span>
            </div>

            {/* Fixed aspect-ratio image container with a reserved background — resilient to
                slow/failed loads by construction; the generative SVG is the actual artwork. */}
            <div
              className="relative mt-3 w-full overflow-hidden rounded-md"
              style={{ aspectRatio: "4 / 3", background: COLOR.bg }}
            >
              <ChairGlyph className="absolute inset-0 h-full w-full" />
            </div>
            <div className="mt-2">
              <FigCaption tone="surface">
                Fig. 1 — {SUBJECT.title}, {SUBJECT.detail}.
              </FigCaption>
            </div>

            <p className={`${W.label} mt-4 text-[15px]`} style={{ color: COLOR.ink }}>
              {SUBJECT.title}
            </p>
            <p className={`${W.body} text-[13px]`} style={{ color: COLOR.mutedOnSurf }}>
              {SUBJECT.sellerNote}
            </p>

            {/* Badge row — separate from the photo, never an overlay on it. */}
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill icon={CheckCircle2} variant="accent">
                {verdict.confidence}% match
              </Pill>
              <Pill icon={ShieldCheck} variant="outline">
                Grade {SUBJECT.grade} · {SUBJECT.gradeNote.split("—")[0].trim()}
              </Pill>
              <Pill icon={ShieldCheck} variant="outline">
                Seller verified
              </Pill>
              <Pill icon={CheckCircle2} variant="outline">
                {verdict.discountPercent}% below replacement
              </Pill>
            </div>

            <div className="mt-5 pt-4" style={{ borderTop: `1px solid ${COLOR.ink}26` }}>
              <p
                className={`${W.label} text-[11px] uppercase mb-2.5`}
                style={{ color: COLOR.mutedOnSurf, letterSpacing: TRACK.caption }}
              >
                Adjust assumptions
              </p>
              <div className="flex flex-col gap-3">
                <div>
                  <p className={`${W.body} text-[12px] mb-1.5`} style={{ color: COLOR.mutedOnSurf }}>
                    Inspection rigor
                  </p>
                  <Segmented
                    legend="Inspection rigor"
                    value={rigorId}
                    onChange={onRigor}
                    options={RIGOR_LEVELS.map((r) => ({ id: r.id, label: r.short }))}
                  />
                </div>
                <div>
                  <p className={`${W.body} text-[12px] mb-1.5`} style={{ color: COLOR.mutedOnSurf }}>
                    Comparables window
                  </p>
                  <Segmented
                    legend="Comparables window"
                    value={windowId}
                    onChange={onWindow}
                    options={WINDOWS.map((w) => ({ id: w.id, label: w.short }))}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
              <StatBlock label="Confidence" value={`${verdict.confidence}%`} />
              <StatBlock label="Recommended price" value={`$${verdict.recommendedPrice.toLocaleString("en-US")}`} />
              <StatBlock label="Comparables reviewed" value={String(verdict.compsCount)} />
              <StatBlock label="Turnaround" value={`${verdict.turnaroundDays}d`} />
            </div>

            <div
              className={`${W.label} mt-5 flex items-center gap-2 rounded-md px-3 py-2.5 text-[13px]`}
              style={{
                background: COLOR.bg,
                color: COLOR.ink,
                border: `1px solid ${COLOR.accentDark}4D`,
              }}
            >
              {verdict.clean ? (
                <CheckCircle2 className="size-4 shrink-0" style={{ color: COLOR.accentDark }} aria-hidden="true" />
              ) : (
                <TriangleAlert className="size-4 shrink-0" style={{ color: COLOR.accentDark }} aria-hidden="true" />
              )}
              <span className="tabular-nums">
                {verdict.checksPassed}/{verdict.checksTotal} checks passed —{" "}
                {verdict.clean ? "clear to buy" : "clear, low-data flag"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
