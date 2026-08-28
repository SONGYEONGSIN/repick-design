import { PenLine } from "lucide-react";
import SwatchTile from "./SwatchTile";
import ProofRow from "./ProofRow";
import CorrectionText from "./CorrectionText";
import EvidenceList from "./EvidenceList";
import { REDLINE_LISTING, type Category } from "./data";

/**
 * The flagship card: a real seller listing shown as a Google-Docs-style tracked-changes view.
 * Doubles as one of the required first-fold product+proof cards — same ProofRow component as the
 * plain listing cards below it, so it carries the same match/grade/verification/discount stack.
 */
export default function RedlineCard({ active }: { active: ReadonlySet<Category> }) {
  return (
    <article
      id="redline-listing"
      className="max-w-[560px] scroll-mt-24 rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-8"
    >
      <div className="flex items-start gap-3">
        <SwatchTile icon={REDLINE_LISTING.icon} />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
            {REDLINE_LISTING.categoryLabel}
          </p>
          <h3 className="mt-1 text-[17px] font-medium text-zinc-900 sm:text-[19px]">
            {REDLINE_LISTING.title}
          </h3>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#bae6fd] bg-[#f0f9ff] px-2 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[#0369a1]">
          <PenLine className="h-3 w-3" aria-hidden="true" />
          AI redline
        </span>
      </div>

      <div className="mt-5 rounded-xl bg-zinc-50 p-4 sm:p-5">
        <CorrectionText active={active} />
      </div>

      <EvidenceList active={active} />

      <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
        Fig. 1 — seller-submitted listing, AI redline applied
      </p>

      <ProofRow listing={REDLINE_LISTING} />
    </article>
  );
}
