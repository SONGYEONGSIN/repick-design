import { ArrowRight, ShieldCheck } from "lucide-react";
import { categoryById, formatDelta, type CategoryId, type SlopeRow } from "./data";
import { Reveal } from "./reveal";
import { ACCENT_FILL, ACCENT_ON_FILL_TEXT, EYEBROW, FOCUS_RING } from "./tokens";

interface ClosingCTAProps {
  categoryId: CategoryId;
  selectedRow: SlopeRow;
  ctaLabel: string;
}

/**
 * Quotes the same `selectedRow` the hero computed, and its button carries the same `ctaLabel` --
 * neither is a hardcoded literal that stays put when the controls above move.
 */
export function ClosingCTA({ categoryId, selectedRow, ctaLabel }: ClosingCTAProps) {
  const category = categoryById(categoryId);
  const verb = selectedRow.direction === "up" ? "underpriced" : selectedRow.direction === "down" ? "overpriced" : "fairly priced";

  return (
    <section id="start" className="relative overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <Reveal className="rounded-3xl border border-zinc-200 bg-zinc-50/60 p-8 sm:p-12">
          <p className={`${EYEBROW} text-teal-700`}>{category.label}, at {selectedRow.grade.label.toLowerCase()} grade</p>
          <h2 className="mt-3 max-w-[720px] font-[var(--font-display-wide)] text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-zinc-950">
            As configured above, this listing is{" "}
            <span className="text-teal-700">{verb}, by {formatDelta(selectedRow.delta)}</span>.
          </h2>
          <p className="mt-4 max-w-[500px] text-base font-normal leading-[1.6] text-zinc-600">
            That number came from the same grade and category you set in the device above &mdash;
            not a separate claim made down here. Every listing on repick carries the same two
            prices, side by side, before you commit to either one.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#listings"
              className={`inline-flex min-h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold ${ACCENT_FILL} ${ACCENT_ON_FILL_TEXT} transition-opacity hover:opacity-90 ${FOCUS_RING}`}
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500">
              <ShieldCheck className="h-4 w-4 text-teal-700" aria-hidden="true" strokeWidth={2} />
              Grading sources are shown on every listing, before you ask
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
