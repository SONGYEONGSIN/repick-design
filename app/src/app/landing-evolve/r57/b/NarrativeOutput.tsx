import { Sparkles } from "lucide-react";
import type { RankResult } from "./lib";
import { ACCENT_TINT } from "./ui";

/**
 * The one-paragraph deterministic explanation — a pure function of the
 * current rank order (see getRankResult in ./lib). `aria-live="polite"`
 * so screen-reader users hear the updated reasoning after any reorder,
 * without needing to re-find the paragraph.
 */
export default function NarrativeOutput({ result }: { result: RankResult }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4" aria-live="polite">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
        <Sparkles className="h-3 w-3" style={{ color: ACCENT_TINT }} aria-hidden="true" />
        Live reasoning, recomputed from your order
      </p>
      <p className="mt-2 text-sm leading-[1.6] text-zinc-200">{result.narrative}</p>
    </div>
  );
}
