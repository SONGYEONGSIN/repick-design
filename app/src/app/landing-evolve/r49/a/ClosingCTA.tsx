import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import type { SearchStats } from "./search-math";
import { ACCENT_BG, ACCENT_TEXT_ON_FILL, FOCUS, HEADLINE_FONT, MUTED_TEXT, PANEL_BORDER } from "./tokens";

interface ClosingCTAProps {
  query: string;
  stats: SearchStats | null;
}

/**
 * Section 5: closing CTA. The headline cites `stats`, the exact same object
 * ValueSplit reads — computed once in LandingClient from the live query, never a
 * hardcoded literal — so this can never drift out of sync with whatever the
 * visitor last typed or tapped above. Honest in both directions: a real query with
 * results cites its count and top match; a query with zero results says so instead
 * of inventing a number.
 *
 * Lead line container width: 16px -> 0.44 * 16 = 7.04px/char -> max-w-[480px] ->
 * 480 / 7.04 ≈ 68.2 chars/line.
 */
export default function ClosingCTA({ query, stats }: ClosingCTAProps) {
  const trimmedQuery = query.trim() || "all listings";

  return (
    <section id="closing-cta" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <Reveal>
        <div className={`flex flex-col items-start gap-5 rounded-2xl border ${PANEL_BORDER} bg-[#15141C] p-8 sm:p-12`}>
          <h2
            className="max-w-[600px] text-[26px] font-extrabold leading-[1.2] tracking-[-0.01em] text-white sm:text-[32px]"
            style={HEADLINE_FONT}
          >
            {stats ? (
              <>
                Your search for “{trimmedQuery}” found{" "}
                <span className="tabular-nums">{stats.count}</span> match
                {stats.count === 1 ? "" : "es"}, topping out at{" "}
                <span className="tabular-nums">{stats.topMatchPercent}%</span>.
              </>
            ) : (
              <>Your search for “{trimmedQuery}” found no matches — broaden it, or list yours first.</>
            )}
          </h2>
          <p className={`max-w-[480px] text-[16px] font-normal leading-[1.55] ${MUTED_TEXT}`}>
            That number updates live with the search panel above. Create a listing and
            your item joins this exact comp set, badges and all.
          </p>
          <a
            href="#hero-search-device"
            className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold ${ACCENT_TEXT_ON_FILL} ${ACCENT_BG} ${FOCUS}`}
          >
            List your item today
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
