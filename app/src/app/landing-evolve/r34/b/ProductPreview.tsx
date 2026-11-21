"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import Reveal from "./Reveal";
import ToggleRow from "./ToggleRow";
import WaterfallChart from "./WaterfallChart";
import { LiveProductCard, SimilarCard } from "./ProductCard";
import {
  COLOR,
  FEATURED_PRODUCT,
  SIMILAR_PRODUCTS,
  SORT_OPTIONS,
  sortSimilar,
  type SortKey,
} from "./data";
import { TOGGLES, type ToggleId, type ToggleState, type WaterfallResult } from "./savings-math";

interface ProductPreviewProps {
  toggles: ToggleState;
  onToggle: (id: ToggleId) => void;
  waterfall: WaterfallResult;
}

export default function ProductPreview({ toggles, onToggle, waterfall }: ProductPreviewProps) {
  const [sortKey, setSortKey] = useState<SortKey>("savings");
  const sorted = useMemo(() => sortSimilar(SIMILAR_PRODUCTS, sortKey), [sortKey]);

  return (
    <section id="conditions" className="border-b border-zinc-200" style={{ backgroundColor: COLOR.bg }}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal className="max-w-[31rem]">
          <p
            className="text-xs font-semibold uppercase tracking-[0.28em]"
            style={{ color: COLOR.accentDark }}
          >
            The device
          </p>
          <h2
            className="mt-3 text-zinc-900"
            style={{
              fontFamily: "var(--font-display-wide)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              fontSize: "clamp(1.75rem, 1.5rem + 1vw, 2.5rem)",
            }}
          >
            Flip a switch. Watch a bar fall.
          </h2>
          <p className="mt-3 text-base leading-relaxed" style={{ color: COLOR.muted }}>
            Each condition below is independent. Switch any combination on or
            off and the chart redraws its steps live, ending on the price the
            card actually charges.
          </p>
        </Reveal>

        <Reveal
          delay={0.08}
          className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]"
        >
          <ToggleRow toggles={toggles} onToggle={onToggle} />

          <div className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: COLOR.muted }}>
                Running total
              </p>
              <p className="text-sm" style={{ color: COLOR.muted }}>
                {waterfall.enabledCount} of {TOGGLES.length} conditions active
              </p>
            </div>

            <WaterfallChart segments={waterfall.segments} />

            <details className="mt-2 rounded-xl border border-zinc-200">
              <summary
                className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 [&::-webkit-details-marker]:hidden"
                style={{ outlineColor: COLOR.accentDark }}
              >
                How this price was calculated
                <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
              </summary>
              <div className="border-t border-zinc-100 px-4 py-3">
                <ol className="space-y-1.5 text-sm" style={{ color: COLOR.muted }}>
                  {waterfall.segments.map((s) => (
                    <li key={s.id} className="flex items-center justify-between gap-3">
                      <span className="text-zinc-800">{s.label}</span>
                      <span className="tabular-nums font-semibold text-zinc-900">
                        {s.valueLabel}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </details>

            <div className="mt-5 min-w-0 sm:max-w-sm">
              <LiveProductCard product={FEATURED_PRODUCT} waterfall={waterfall} variant="compact" />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: COLOR.muted }}>
                Similar listings
              </p>
              <h3 className="mt-1.5 text-xl font-semibold text-zinc-900">
                More graded, verified, AI-matched picks
              </h3>
            </div>

            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
              Sort by
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ outlineColor: COLOR.accentDark }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {sorted.map((product) => (
              <SimilarCard key={product.id} product={product} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
