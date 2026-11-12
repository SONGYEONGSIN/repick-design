"use client";

import { ArrowRight } from "lucide-react";
import PriorityLadder from "./PriorityLadder";
import MatchBoard from "./MatchBoard";
import { CRITERION_MAP, type CriterionId, type RankMap, type RankedItem } from "./rank-model";
import type { Listing } from "./data";
import { ACCENT_FILL, ACCENT_LARGE, ACCENT_TEXT, BORDER, INK, MEASURE_16, MUTED, SURFACE } from "./tokens";

/**
 * Hero: headline, subhead, single primary CTA — AND, in the same component
 * tree (not a section rendered below it), the full product-proof pair: the
 * Priority Ladder and the live-resorting Match Board. Nothing here is a
 * static preview; `leadId` and `ranked` are recomputed from the visitor's
 * current rank map on every render.
 */
export default function Hero({
  rankMap,
  onMove,
  onDragReorder,
  ranked,
  leadId,
  onCtaClick,
}: {
  rankMap: RankMap;
  onMove: (id: CriterionId, direction: -1 | 1) => void;
  onDragReorder: (draggedId: CriterionId, targetId: CriterionId) => void;
  ranked: RankedItem<Listing>[];
  leadId: CriterionId;
  onCtaClick: () => void;
}) {
  const leadLabel = CRITERION_MAP[leadId].label;
  const top = ranked[0];

  return (
    <section className="relative px-4 pb-14 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pb-20">
      <div className="mx-auto max-w-6xl">
        <span
          className="text-[12px] font-semibold uppercase"
          style={{ color: ACCENT_TEXT, letterSpacing: "0.26em" }}
        >
          AI-assisted matching
        </span>

        <h1
          className="mt-3 text-[clamp(2rem,8.5vw,2.75rem)] font-extrabold leading-[1.04] lg:text-[clamp(3rem,4.3vw,4.5rem)]"
          style={{ fontFamily: "var(--font-display-wide)", color: INK, letterSpacing: "-0.02em" }}
        >
          Rank what matters.
          <br />
          Watch the matches follow.
        </h1>

        <p className="mt-4 font-normal leading-[1.6]" style={{ color: MUTED, maxWidth: MEASURE_16, fontSize: "16px" }}>
          Drag the five priorities below into your own order and every match score on this page
          recalculates instantly.{" "}
          <span style={{ color: INK, fontWeight: 600 }}>{leadLabel}</span> leads right now, and{" "}
          <span style={{ color: INK, fontWeight: 600 }}>{top.item.title}</span> is the top match at{" "}
          <span className="tabular-nums" style={{ color: ACCENT_TEXT, fontWeight: 600 }}>
            {top.score}%
          </span>
          .
        </p>

        <div className="mt-6">
          <button
            type="button"
            onClick={onCtaClick}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]"
            style={{ backgroundColor: ACCENT_FILL, outlineColor: ACCENT_LARGE }}
          >
            See every listing ranked
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* The hero's own product-proof pair: ladder (left) + mini
            scoreboard (right). Both sit on the same fold as the headline. */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.08fr_1fr] lg:items-start lg:gap-8">
          <div className="min-w-0 rounded-3xl p-4 sm:p-6" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
            <PriorityLadder rankMap={rankMap} onMove={onMove} onDragReorder={onDragReorder} />
          </div>
          <div className="min-w-0 rounded-3xl p-4 sm:p-6" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
            <MatchBoard ranked={ranked} />
          </div>
        </div>
      </div>
    </section>
  );
}
