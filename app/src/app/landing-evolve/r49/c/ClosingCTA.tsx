"use client";

import { ArrowRight, MapPin } from "lucide-react";
import { coverageSentence, type Category, type CoverageResult } from "./data";
import { ACCENT_FILL, ACCENT_TEXT, FOCUS_RING, HEADLINE_FONT, MUTED_TEXT, ON_ACCENT_FILL_TEXT } from "./tokens";

/**
 * The live value selected in the Hero's pin field stays alive all the way down here: the
 * headline below cites `coverage`/`categoryFilter` exactly as currently selected, not a fixed
 * string. Changing the pin (or the category filter) up in the Hero and scrolling back down
 * changes this sentence too.
 */
export function ClosingCTA({ coverage, categoryFilter }: { coverage: CoverageResult; categoryFilter: Category | null }) {
  return (
    <section className="border-t border-[#E7E3E3] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[720px] rounded-2xl border border-[#E7E3E3] bg-white p-8 text-center sm:p-12">
        <MapPin className={`mx-auto h-5 w-5 ${ACCENT_TEXT}`} aria-hidden="true" />
        <h2 style={HEADLINE_FONT} className="mt-4 text-2xl font-extrabold leading-[1.15] tracking-[-0.02em] text-[#171717] sm:text-3xl">
          {coverageSentence(coverage, categoryFilter)}
        </h2>
        <p className={`mx-auto mt-3 max-w-[420px] text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>
          That&rsquo;s the exact point you left selected above -- scroll back up and pick another
          pin, and this line changes with it. The closed sale in social proof is historical and
          doesn&rsquo;t.
        </p>
        <a
          href="#locations"
          className={`mt-7 inline-flex min-h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors duration-200 ${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT} hover:opacity-90 ${FOCUS_RING}`}
        >
          Pick your drop-off point
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
