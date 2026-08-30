"use client";

import { ArrowRight } from "lucide-react";
import { CATEGORIES, type CategoryId, type MatchPair } from "./data";
import { COLOR } from "./theme";
import { Eyebrow, Folio, FOCUS_RING } from "./ui";
import MatchingBoard from "./MatchingBoard";

export default function Hero({
  categoryId,
  onCategoryChange,
  matches,
  categoryLabel,
}: {
  categoryId: CategoryId;
  onCategoryChange: (id: CategoryId) => void;
  matches: MatchPair[];
  categoryLabel: string;
}) {
  return (
    <section
      className="relative overflow-hidden border-b px-6 pb-16 pt-24 md:px-12 md:pb-24 md:pt-32"
      style={{ borderColor: COLOR.border, background: COLOR.bg }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-start justify-between">
          <Eyebrow>Live matching board</Eyebrow>
          <Folio index={1} total={5} label="The board" />
        </div>

        <h1
          className="mt-6 max-w-[16ch] font-extrabold"
          style={{
            fontFamily: "var(--font-display-mono)",
            color: COLOR.fg,
            letterSpacing: "-0.02em",
            fontSize: "clamp(2.5rem, 1.6rem + 4.2vw, 5.25rem)",
            lineHeight: 1.02,
          }}
        >
          The listing that fits your request is already live.
        </h1>

        <p
          className="mt-6 text-[16px] font-normal"
          style={{ color: COLOR.muted, lineHeight: 1.6, maxWidth: "500px" }}
        >
          Repick reads condition, price, and location on both sides of the
          market — and shows its reasoning before you ever click through.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#preview"
            className={`inline-flex items-center gap-2 rounded-md px-5 py-3 text-[14px] font-semibold transition-transform hover:-translate-y-0.5 ${FOCUS_RING}`}
            style={{ background: COLOR.accent, color: COLOR.inkOnAccent }}
          >
            Browse live matches
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <p className="text-[12px] font-normal" style={{ color: COLOR.mutedDim }}>
            No account needed to see how a match is scored.
          </p>
        </div>

        <div
          className="mt-12 rounded-lg border p-5 md:p-8"
          style={{ borderColor: COLOR.border, background: COLOR.bgElevated }}
        >
          <div
            role="group"
            aria-label="Filter matches by category"
            className="flex flex-wrap gap-2"
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = cat.id === categoryId;
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onCategoryChange(cat.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors ${FOCUS_RING}`}
                  style={{
                    borderColor: active ? COLOR.accent : COLOR.border,
                    background: active ? COLOR.accent : "transparent",
                    color: active ? COLOR.inkOnAccent : COLOR.muted,
                  }}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <MatchingBoard matches={matches} categoryLabel={categoryLabel} />
          </div>
        </div>
      </div>
    </section>
  );
}
