import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { BadgePop, GradeBadge, InspectedChip, MatchBadge, SelfReportChip, VerifiedBadge } from "./Badges";
import { discountPct, ITEM } from "./data";
import { ACCENT_TEXT, cx, MUTED, NUM } from "./tokens";

/**
 * The rich product preview — required to live inside the hero itself, never a section below it.
 * Every badge here is gated on the SAME `activeIndex` the scrubber and the history log share, and
 * gated on EXISTENCE, not on a changing label: the grade badge is not present-but-"pending" before
 * stage 2, it simply is not in the DOM yet, because grading hadn't happened. That is the literal
 * point this candidate is testing — see candidates/a.md.
 */
export default function ProductCard({ activeIndex }: { activeIndex: number }) {
  const inspected = activeIndex >= 1;
  const graded = activeIndex >= 2;
  const authenticated = activeIndex >= 3;
  const priced = activeIndex >= 4;
  const pct = discountPct(ITEM.originalPrice, ITEM.finalPrice);

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <div className="relative aspect-[4/3] w-full bg-zinc-100">
        <Image
          src={ITEM.image}
          alt={ITEM.imageAlt}
          fill
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 92vw"
          className="object-cover"
        />
      </div>

      {/* Badge row lives below the photo, in its own flow — never an overlay on the image itself, so
          a slow or failed image load never leaves broken-image alt text fighting a badge for space. */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-100 px-4 pt-3 pb-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {!graded && <BadgePop key="self-report"><SelfReportChip condition={ITEM.conditionSelfReport} /></BadgePop>}
          {inspected && <BadgePop key="inspected"><InspectedChip /></BadgePop>}
          {graded && <BadgePop key="grade"><GradeBadge grade={ITEM.grade} score={ITEM.gradeScore} /></BadgePop>}
          {authenticated && <BadgePop key="verified"><VerifiedBadge /></BadgePop>}
          {authenticated && <BadgePop key="match"><MatchBadge pct={ITEM.matchPct} /></BadgePop>}
        </AnimatePresence>
      </div>

      <div className="px-4 pt-3 pb-4">
        <p className="truncate text-sm font-semibold text-zinc-900">{ITEM.title}</p>
        <p className="mt-0.5 text-xs font-normal text-zinc-600">{ITEM.spec}</p>
        <p className={cx(NUM, "mt-1 text-[11px] font-normal", MUTED)}>
          Ref #{ITEM.refId} · seller ask <span className={NUM}>${ITEM.sellerAsk}</span>
        </p>

        <div className="mt-3 border-t border-zinc-100 pt-3">
          {priced ? (
            <div className="flex items-baseline gap-2">
              <span className={cx(NUM, "text-lg font-extrabold tracking-[-0.02em]", ACCENT_TEXT)}>${ITEM.finalPrice}</span>
              <span className={cx(NUM, "text-xs font-normal line-through", MUTED)}>${ITEM.originalPrice}</span>
              <span className={cx(NUM, "text-[11px] font-semibold", ACCENT_TEXT)}>&minus;{pct}%</span>
            </div>
          ) : (
            <p className={cx("text-xs font-normal italic", MUTED)}>Final price — pending authentication</p>
          )}
        </div>
      </div>
    </div>
  );
}
