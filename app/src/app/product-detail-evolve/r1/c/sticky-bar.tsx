import { Check, FileText } from "lucide-react";
import { formatUsd, type Variant } from "./data";

/**
 * A condensed order bar that only appears once the full summary (price + primary CTA) has scrolled
 * out of view — it reinforces the same information rather than gating it, so the core proposition
 * is never hidden behind this interaction (page-brief-core / curation-criteria completeness rule).
 */
export default function StickyBar({
  visible,
  variant,
  quoteAdded,
  onAddToQuote,
}: {
  visible: boolean;
  variant: Variant;
  quoteAdded: boolean;
  onAddToQuote: () => void;
}) {
  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur transition-[transform,opacity] duration-200 motion-reduce:transition-none dark:border-zinc-800 dark:bg-zinc-950/95 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
          <FileText className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1 truncate font-mono text-xs font-normal text-zinc-600 dark:text-zinc-400">
          {variant.sku}
        </span>
        <span className="flex-none text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
          {formatUsd(variant.priceUsd)}
        </span>
        <button
          type="button"
          tabIndex={visible ? 0 : -1}
          onClick={onAddToQuote}
          className="inline-flex flex-none items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-offset-zinc-950"
        >
          {quoteAdded ? (
            <>
              <Check className="h-4 w-4 flex-none" aria-hidden="true" />
              Added
            </>
          ) : (
            "Add to quote"
          )}
        </button>
      </div>
    </div>
  );
}
