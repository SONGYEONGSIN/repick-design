"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { type MatchPair, discountPct } from "./data";
import { COLOR } from "./theme";
import { ConditionChip, VerifiedChip, DiscountChip, Reveal, Folio, Eyebrow, FOCUS_RING } from "./ui";

function PreviewCard({ match, index }: { match: MatchPair; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  const pct = discountPct(match.listing.price, match.listing.priceBefore);
  const extraReasons = match.rationale.slice(1);

  return (
    <Reveal delay={index * 0.08}>
      <div
        className="rounded-lg border p-4"
        style={{ borderColor: COLOR.border, background: COLOR.bgCard }}
      >
        <div
          className="relative aspect-[4/3] w-full overflow-hidden rounded-md"
          style={{ background: COLOR.bgElevated }}
        >
          <Image
            src={match.listing.image}
            alt={match.listing.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <ConditionChip grade={match.listing.conditionGrade} />
          <VerifiedChip label={match.listing.verification} />
          <DiscountChip pct={pct} />
        </div>

        <h3 className="mt-3 text-[15px] font-semibold leading-snug" style={{ color: COLOR.fg }}>
          {match.listing.title}
        </h3>

        <p className="mt-2 flex items-baseline gap-2" style={{ fontFamily: "var(--font-display-mono)" }}>
          <span className="text-lg font-extrabold" style={{ color: COLOR.fg }}>
            ${match.listing.price}
          </span>
          <span className="text-[13px] font-normal line-through" style={{ color: COLOR.mutedDim }}>
            ${match.listing.priceBefore}
          </span>
        </p>

        <p className="mt-3 text-[12px] font-normal" style={{ color: COLOR.muted }}>
          Matched to: <span style={{ color: COLOR.fg }}>&ldquo;{match.buyer.title}&rdquo;</span>
        </p>

        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((v) => !v)}
          className={`mt-3 inline-flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-[12px] font-semibold ${FOCUS_RING}`}
          style={{ borderColor: COLOR.border, color: COLOR.accentBright }}
        >
          <span>
            Top reason: {match.rationale[0]}
          </span>
          <ChevronDown
            className="h-3.5 w-3.5 shrink-0 transition-transform"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
            aria-hidden="true"
          />
        </button>

        <div id={panelId} hidden={!expanded}>
          <ul className="mt-2 space-y-1 border-t pt-2 text-[12px] font-normal" style={{ borderColor: COLOR.border, color: COLOR.muted }}>
            {extraReasons.map((reason) => (
              <li key={reason} className="flex items-start gap-1.5">
                <span aria-hidden="true" style={{ color: COLOR.accentBright }}>+</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}

export default function ProductPreview({
  matches,
  categoryLabel,
}: {
  matches: MatchPair[];
  categoryLabel: string;
}) {
  return (
    <section id="preview" className="border-b px-6 py-16 md:px-12 md:py-24" style={{ borderColor: COLOR.border }}>
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-start justify-between">
          <div>
            <Eyebrow>Product preview</Eyebrow>
            <h2
              className="mt-3 max-w-[20ch] font-extrabold"
              style={{
                fontFamily: "var(--font-display-mono)",
                color: COLOR.fg,
                letterSpacing: "-0.02em",
                fontSize: "clamp(1.5rem, 1.1rem + 1.6vw, 2.5rem)",
              }}
            >
              Every card carries its own evidence.
            </h2>
          </div>
          <Folio index={2} total={5} label="Fig. 02" />
        </div>

        <p className="mt-4 text-[16px] font-normal" style={{ color: COLOR.muted, lineHeight: 1.6, maxWidth: "500px" }}>
          Currently showing {categoryLabel.toLowerCase()} — condition grade, seller
          verification, and the discount from list price, on every listing.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {matches.map((match, i) => (
            <PreviewCard key={match.id} match={match} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
