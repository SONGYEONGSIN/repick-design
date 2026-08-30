"use client";

import Link from "next/link";
import { ArrowRight, Check, Gauge, PackageCheck, Rocket, ScanSearch, ShieldCheck } from "lucide-react";
import {
  ACCENT,
  ACCENT_DEEP,
  ACCENT_TINT_BG,
  BORDER,
  CHECKLIST,
  INK,
  MUTED,
  PRODUCT_ID,
  PRODUCT_NAME,
  STAGES,
  SURFACE,
} from "./data";
import { Caption, Eyebrow, FOCUS_RING, Folio } from "./ui";

const STAGE_ICONS = [PackageCheck, ScanSearch, Gauge, ShieldCheck, Rocket];

export function Hero({ stage, onStageChange }: { stage: number; onStageChange: (next: number) => void }) {
  const current = STAGES[stage];
  const Icon = STAGE_ICONS[stage];

  return (
    <section className="relative border-b" style={{ borderColor: BORDER }}>
      <div className="mx-auto max-w-[1240px] px-6 pb-16 pt-20 sm:px-10 sm:pt-24">
        {/* 12-col asymmetric grid: headline block gets 7, evidence proof gets 5. The scrub control
            sits inside this same grid, in the same component as the h1 — not a sibling section. */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Eyebrow>Repick · Grading Pipeline</Eyebrow>
            <h1
              className="mt-5 font-extrabold text-[#111114]"
              style={{
                fontFamily: "var(--font-display-wide)",
                letterSpacing: "-0.02em",
                lineHeight: 0.98,
                fontSize: "clamp(2.75rem, 3.4vw + 1.6rem, 5.5rem)",
                color: INK,
              }}
            >
              Every grade
              <br />
              is a paper trail.
            </h1>
            <p className="mt-6 max-w-[480px] text-base leading-[1.6]" style={{ color: MUTED }}>
              Scrub through the five stages one Repick item actually passed through. Nothing here is a
              mock-up of a process — it&apos;s the real inspection record for the camera on the right, at
              whichever stage you land on.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="#closing-cta"
                className={`inline-flex items-center gap-2 rounded-sm px-5 py-3 text-sm font-semibold transition-colors ${FOCUS_RING}`}
                style={{ backgroundColor: ACCENT, color: INK }}
              >
                See what&apos;s listed right now
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="#product-preview"
                className={`inline-flex items-center gap-2 rounded-sm border px-5 py-3 text-sm font-semibold transition-colors ${FOCUS_RING}`}
                style={{ borderColor: BORDER, color: INK }}
              >
                Browse graded items
              </Link>
            </div>

            {/* --- The scrub device: input-manipulation, not decoration. Moving it changes the
                headline, notes, marker set, checklist count and every metric on the right. --- */}
            <div className="mt-12 max-w-[520px]">
              <div className="flex items-center justify-between">
                <Caption>Grading pipeline</Caption>
                <Folio>
                  {String(stage + 1).padStart(2, "0")} / {String(STAGES.length).padStart(2, "0")}
                </Folio>
              </div>
              <input
                type="range"
                min={0}
                max={STAGES.length - 1}
                step={1}
                value={stage}
                onChange={(event) => onStageChange(Number(event.target.value))}
                aria-label="Grading pipeline stage"
                aria-valuetext={`${current.label}: ${current.headline}`}
                className={`mt-3 h-2 w-full cursor-pointer appearance-none rounded-full ${FOCUS_RING}`}
                style={{ accentColor: ACCENT_DEEP, backgroundColor: SURFACE }}
              />
              <div className="mt-3 grid grid-cols-5 gap-1.5">
                {STAGES.map((s, i) => {
                  const StepIcon = STAGE_ICONS[i];
                  const isCurrent = i === stage;
                  const isDone = i < stage;
                  return (
                    <button
                      key={s.key}
                      type="button"
                      aria-pressed={isCurrent}
                      aria-label={`Jump to ${s.label} stage`}
                      onClick={() => onStageChange(i)}
                      className={`flex flex-col items-center gap-1.5 rounded-sm border px-1 py-2 text-center transition-colors ${FOCUS_RING}`}
                      style={{
                        borderColor: isCurrent ? ACCENT_DEEP : BORDER,
                        backgroundColor: isCurrent ? ACCENT_TINT_BG : "transparent",
                      }}
                    >
                      {isDone ? (
                        <Check size={14} aria-hidden="true" style={{ color: ACCENT_DEEP }} />
                      ) : (
                        <StepIcon
                          size={14}
                          aria-hidden="true"
                          style={{ color: isCurrent ? ACCENT_DEEP : MUTED }}
                        />
                      )}
                      <span
                        className={`text-[10px] leading-none ${isCurrent ? "font-semibold" : "font-normal"}`}
                        style={{ color: isCurrent ? INK : MUTED }}
                      >
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* --- Evidence panel: the proof itself, live at rest on "Graded" (index 2). --- */}
          <div className="lg:col-span-5">
            <div className="rounded-md border p-5 sm:p-6" style={{ borderColor: BORDER, backgroundColor: SURFACE }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Caption>{PRODUCT_ID}</Caption>
                  <p className="mt-1 text-[15px] font-semibold" style={{ color: INK }}>
                    {PRODUCT_NAME}
                  </p>
                </div>
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
                  style={{ borderColor: ACCENT_DEEP }}
                  aria-hidden="true"
                >
                  <Icon size={16} style={{ color: ACCENT_DEEP }} />
                </div>
              </div>

              <p className="mt-4 font-mono text-[11px]" style={{ color: MUTED }}>
                {current.timestamp}
              </p>
              <p className="mt-1 text-[17px] font-semibold" style={{ color: INK, letterSpacing: "-0.01em" }}>
                {current.headline}
              </p>

              <EvidenceDiagram markers={current.markers} />
              <p className="mt-2 text-[11px] font-semibold uppercase" style={{ color: MUTED, letterSpacing: "0.16em" }}>
                {current.evidenceCaption}
              </p>

              <p className="mt-4 max-w-[420px] text-[13.5px] leading-[1.6]" style={{ color: MUTED }}>
                {current.notes}
              </p>

              {current.markers.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {current.markers.map((m) => (
                    <li key={m.label} className="flex items-start gap-2 text-[12.5px]" style={{ color: INK }}>
                      <span
                        className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: ACCENT }}
                        aria-hidden="true"
                      />
                      {m.label}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-5 grid grid-cols-3 gap-3 border-t pt-4" style={{ borderColor: BORDER }}>
                <MetricCell label="Trust score" value={`${current.metrics.trustScore}`} />
                <MetricCell label="Checks passed" value={`${current.checklistDone}/${CHECKLIST.length}`} />
                <MetricCell
                  label="Matched buyers"
                  value={`${current.metrics.matchedBuyers}`}
                />
              </div>
              {current.metrics.price !== null && (
                <div className="mt-4 flex items-baseline gap-2 border-t pt-4" style={{ borderColor: BORDER }}>
                  <span className="text-[20px] font-extrabold" style={{ color: INK }}>
                    ${current.metrics.price}
                  </span>
                  <span className="text-[13px] line-through" style={{ color: MUTED }}>
                    ${current.metrics.originalPrice}
                  </span>
                  <span
                    className="ml-auto rounded-sm px-2 py-0.5 text-[11px] font-semibold"
                    style={{ backgroundColor: ACCENT_TINT_BG, color: ACCENT_DEEP }}
                  >
                    -{current.metrics.discountPercent}%
                  </span>
                </div>
              )}
              {current.extraStat && (
                <p className="mt-3 text-[12px]" style={{ color: MUTED }}>
                  {current.extraStat}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block text-[10px] font-semibold uppercase" style={{ color: MUTED, letterSpacing: "0.12em" }}>
        {label}
      </span>
      <span className="mt-1 block text-[17px] font-extrabold" style={{ color: INK, fontVariantNumeric: "tabular-nums" }}>
        {value}
      </span>
    </div>
  );
}

/**
 * Generated flat-shape diagram of the camera body — solid fills, not line-art/blueprint outlines
 * (explicitly penalized). No `<text>` nodes inside the SVG: every fact the diagram carries also
 * exists as real DOM text nearby, so the whole graphic can safely be `aria-hidden` without hiding
 * information, and there's no in-SVG text color to contrast-check.
 */
function EvidenceDiagram({ markers }: { markers: { x: number; y: number }[] }) {
  return (
    <svg
      viewBox="0 0 200 140"
      className="mt-3 h-auto w-full"
      aria-hidden="true"
      role="presentation"
    >
      <rect x="0" y="0" width="200" height="140" rx="6" fill="#E7E5DF" />
      <rect x="34" y="46" width="132" height="62" rx="8" fill="#9C9A93" />
      <rect x="34" y="34" width="132" height="16" rx="4" fill="#84837C" />
      <circle cx="100" cy="80" r="26" fill="#6E6D67" />
      <circle cx="100" cy="80" r="17" fill="#4B4A45" />
      <rect x="118" y="36" width="18" height="10" rx="2" fill="#5C5B55" />
      <rect x="46" y="52" width="20" height="10" rx="2" fill="#84837C" />
      {markers.map((m) => (
        <circle key={`${m.x}-${m.y}`} cx={m.x} cy={m.y} r="5" fill={ACCENT} stroke="#FAFAF8" strokeWidth="1.5" />
      ))}
    </svg>
  );
}
