"use client";

import { SENTIMENT_META, FOCUS_RING } from "./ui";
import { TERMS, TOTAL_MENTIONS, type Term } from "./data";
import { formatCount, formatSharePct } from "./format";

// Hand-rolled deterministic placement: a fixed-seed phyllotaxis spiral (golden-angle
// increment, radius growing with sqrt(i)) — the same TERMS array always produces the
// exact same layout, never a random-looking bin-packer. All trig output is rounded to
// 2 decimals. Positioned with plain absolute divs (not SVG text) so native <button>
// focus-visible behavior applies without any SVG-specific pseudo-class risk.
const GOLDEN_ANGLE_DEG = 137.50776405;
const MAX_RADIUS = 40;

type PlacedTerm = {
  term: Term;
  left: number;
  top: number;
  fontSize: number;
  zIndex: number;
};

function layoutWordCloud(terms: Term[]): PlacedTerm[] {
  const maxCount = terms[0].count;
  const minCount = terms[terms.length - 1].count;
  const spread = maxCount - minCount || 1;
  const n = terms.length;

  return terms.map((term, i) => {
    const angleRad = ((i * GOLDEN_ANGLE_DEG) % 360) * (Math.PI / 180);
    const radius = i === 0 ? 0 : MAX_RADIUS * Math.sqrt(i / (n - 1));
    const rawX = 50 + radius * Math.cos(angleRad);
    const rawY = 50 + radius * Math.sin(angleRad) * 0.6;
    const scale = (term.count - minCount) / spread;

    return {
      term,
      left: Math.round(Math.min(93, Math.max(7, rawX)) * 100) / 100,
      top: Math.round(Math.min(88, Math.max(12, rawY)) * 100) / 100,
      fontSize: Math.round((13 + scale * 21) * 100) / 100,
      // Later (lower-frequency, visually smaller) terms stack ON TOP of earlier,
      // bigger ones — not the reverse — so a small term's 24×24 hit target can
      // never be occluded by a larger sibling it happens to sit near.
      zIndex: i + 1,
    };
  });
}

const PLACED_TERMS = layoutWordCloud(TERMS);

export default function WordCloud({
  selectedTermId,
  onSelectTerm,
}: {
  selectedTermId: string;
  onSelectTerm: (id: string) => void;
}) {
  return (
    <div>
      <div className="relative h-72 w-full overflow-hidden rounded-lg border border-zinc-100 bg-zinc-50 sm:h-80">
        {PLACED_TERMS.map(({ term, left, top, fontSize, zIndex }) => {
          const meta = SENTIMENT_META[term.sentiment];
          const selected = term.id === selectedTermId;
          const pct = formatSharePct(term.count, TOTAL_MENTIONS);
          return (
            <div
              key={term.id}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${left}%`, top: `${top}%`, zIndex }}
            >
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelectTerm(term.id)}
                style={{ fontSize: `${fontSize}px` }}
                className={`inline-flex min-h-7 min-w-7 items-center justify-center whitespace-nowrap rounded-md px-2 py-1 font-medium leading-tight motion-safe:transition-colors ${FOCUS_RING} ${meta.text} ${
                  selected ? "bg-rose-50 ring-1 ring-rose-700" : "hover:bg-white"
                }`}
              >
                {term.label}
              </button>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-full z-20 mt-1 -translate-x-1/2 scale-95 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-xs font-normal text-white opacity-0 motion-safe:transition motion-reduce:transition-none group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100"
              >
                {term.label} — {formatCount(term.count)} mentions ({pct}) · {meta.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {(Object.keys(SENTIMENT_META) as Array<keyof typeof SENTIMENT_META>).map((key) => {
          const meta = SENTIMENT_META[key];
          const Icon = meta.icon;
          return (
            <span key={key} className={`inline-flex items-center gap-1 font-medium text-xs ${meta.text}`}>
              <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
              {meta.label}
            </span>
          );
        })}
        <span className="font-normal text-xs text-zinc-500">Size = mention frequency · color = sentiment</span>
      </div>
    </div>
  );
}
