"use client";

import { Eye, Handshake, ScanLine } from "lucide-react";
import { ACCENT_DEEP, ACCENT_TINT_BG, BORDER, CHECKLIST, INK, MUTED, PRODUCT_NAME, STAGES } from "./data";
import { Caption, Eyebrow, FOCUS_RING, Reveal } from "./ui";

/**
 * The three columns don't just describe value in the abstract — every number in them is read
 * straight off `STAGES[stage].metrics`, the same state the hero scrubber writes to. Moving the
 * compact stage control below recomputes all three cards live, so "manipulation" and "felt value"
 * are the same action rather than a slider next to static copy.
 */
export function ValueSplit({ stage, onStageChange }: { stage: number; onStageChange: (next: number) => void }) {
  const current = STAGES[stage];

  return (
    <section className="border-b" style={{ borderColor: BORDER }}>
      <div className="mx-auto max-w-[1240px] px-6 py-20 sm:px-10">
        <Reveal>
          <Eyebrow>Same state, three vantage points</Eyebrow>
          <h2
            className="mt-4 max-w-[620px] font-extrabold"
            style={{
              fontFamily: "var(--font-display-wide)",
              letterSpacing: "-0.02em",
              lineHeight: 1.02,
              fontSize: "clamp(1.9rem, 1.6vw + 1.4rem, 3rem)",
              color: INK,
            }}
          >
            One inspection record, read three ways.
          </h2>
        </Reveal>

        <Reveal delay={0.05} className="mt-6 max-w-[480px]">
          <p className="text-[14px] leading-[1.6]" style={{ color: MUTED }}>
            Move the {PRODUCT_NAME.split("—")[0].trim()} through its pipeline again — a buyer, a
            seller and the matching engine are all looking at the exact same record.
          </p>
        </Reveal>

        {/* Compact, synced stage control — same lifted state as the hero slider. */}
        <Reveal delay={0.08} className="mt-6 flex flex-wrap items-center gap-2">
          {STAGES.map((s, i) => (
            <button
              key={s.key}
              type="button"
              aria-pressed={i === stage}
              aria-label={`View value at ${s.label} stage`}
              onClick={() => onStageChange(i)}
              className={`rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${FOCUS_RING}`}
              style={{
                borderColor: i === stage ? ACCENT_DEEP : BORDER,
                backgroundColor: i === stage ? ACCENT_TINT_BG : "transparent",
                color: i === stage ? ACCENT_DEEP : MUTED,
              }}
            >
              {s.label}
            </button>
          ))}
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Reveal delay={0.1}>
            <ValueCard
              icon={Eye}
              title="For buyers"
              statLabel="Buyer confidence at this stage"
              statValue={`${current.metrics.trustScore}%`}
              body={
                current.metrics.price
                  ? `Priced at $${current.metrics.price}, ${current.metrics.discountPercent}% below new-equivalent — with the sub-scores that produced it.`
                  : "No price yet — nothing is listed until the grade behind it exists."
              }
            />
          </Reveal>
          <Reveal delay={0.16}>
            <ValueCard
              icon={Handshake}
              title="For sellers"
              statLabel="Estimated payout at this stage"
              statValue={current.metrics.price ? `$${current.metrics.price}` : "Pending grade"}
              body="Payout is derived from the same four sub-scores a buyer sees, not negotiated case by case."
            />
          </Reveal>
          <Reveal delay={0.22}>
            <ValueCard
              icon={ScanLine}
              title="For the matching engine"
              statLabel="Buyers matched at this stage"
              statValue={`${current.metrics.matchedBuyers}`}
              body={`${current.checklistDone} of ${CHECKLIST.length} authenticity checks complete — matching widens as confidence rises.`}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ValueCard({
  icon: Icon,
  title,
  statLabel,
  statValue,
  body,
}: {
  icon: typeof Eye;
  title: string;
  statLabel: string;
  statValue: string;
  body: string;
}) {
  return (
    <div className="rounded-md border p-6" style={{ borderColor: BORDER }}>
      <Icon size={18} aria-hidden="true" style={{ color: ACCENT_DEEP }} />
      <h3 className="mt-3 text-[16px] font-semibold" style={{ color: INK }}>
        {title}
      </h3>
      <Caption className="mt-4 block">{statLabel}</Caption>
      <p className="mt-1 text-[26px] font-extrabold" style={{ color: INK, fontVariantNumeric: "tabular-nums" }}>
        {statValue}
      </p>
      <p className="mt-3 max-w-[320px] text-[13px] leading-[1.6]" style={{ color: MUTED }}>
        {body}
      </p>
    </div>
  );
}
