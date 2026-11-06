"use client";

import { FILTER_CATEGORIES, type Category } from "./data";
import { ACCENT_FILL, FOCUS_RING, INK, MUTED_TEXT, ON_ACCENT_FILL_TEXT, SURFACE_BORDER } from "./tokens";

/**
 * Fourth distinct interaction type on this page (alongside pin selection, scroll reveal, and the
 * product-card disclosure): filtering by accepted category dims pins that don't take that
 * category and recomputes the aggregate line to "`X of Y` points near `name` take `category`" --
 * a real coverage question, not a decorative toggle. Selection state is independent of which pin
 * is focused/selected, so choosing a filter never silently changes the active point.
 */
export default function CategoryFilter({
  active,
  onChange,
}: {
  active: Category | null;
  onChange: (next: Category | null) => void;
}) {
  return (
    <div role="group" aria-label="Filter drop-off points by accepted category" className="flex flex-wrap gap-1.5">
      <button
        type="button"
        aria-pressed={active === null}
        onClick={() => onChange(null)}
        className={`inline-flex min-h-7 items-center rounded-full border px-3 text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors duration-200 ${FOCUS_RING} ${
          active === null ? `${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT} border-transparent` : `${SURFACE_BORDER} bg-white ${INK} hover:border-[#F43F5E]`
        }`}
      >
        All
      </button>
      {FILTER_CATEGORIES.map((c) => (
        <button
          key={c}
          type="button"
          aria-pressed={active === c}
          onClick={() => onChange(active === c ? null : c)}
          className={`inline-flex min-h-7 items-center rounded-full border px-3 text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors duration-200 ${FOCUS_RING} ${
            active === c ? `${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT} border-transparent` : `${SURFACE_BORDER} bg-white ${INK} hover:border-[#F43F5E]`
          }`}
        >
          {c}
        </button>
      ))}
      <span className={`ml-1 self-center text-[11px] font-normal ${MUTED_TEXT}`}>accepted category</span>
    </div>
  );
}
