import { Sparkles, BadgeCheck, ShieldCheck, Tag } from "lucide-react";
import { BagGlyph, JacketGlyph, SneakerGlyph, WatchGlyph } from "./ItemGlyphs";
import { LISTINGS, discountPct } from "./products";
import { ACCENT_TINT, CARD_BG } from "./theme";

const GLYPHS = {
  jacket: JacketGlyph,
  bag: BagGlyph,
  watch: WatchGlyph,
  sneaker: SneakerGlyph,
} as const;

/**
 * Four parallel listing cards, not a single anchor item. Each image
 * container is a fixed-aspect-ratio box with a reserved background color
 * (no layout shift while the inline SVG paints), and every badge sits in
 * its own row *below* the image — none are absolutely positioned over
 * the illustration, per the brief's anti-overlay rule.
 */
export default function ProductCards() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {LISTINGS.map((item) => {
        const Glyph = GLYPHS[item.glyph];
        const pct = discountPct(item.priceBefore, item.priceAfter);
        return (
          <article key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:p-4">
            <div className="flex aspect-square items-center justify-center rounded-xl" style={{ backgroundColor: CARD_BG }}>
              <Glyph />
            </div>

            {/* A visual title, not a heading level — this grid sits inside the hero's
                single `h1` and introducing `h3` here (with no `h2` yet in the document)
                would be a heading-level skip. */}
            <p className="mt-3 text-sm font-semibold leading-[1.3] text-white">{item.name}</p>

            <div className="mt-3 flex flex-col gap-1.5 text-xs leading-[1.5] text-zinc-300">
              <div className="flex items-start gap-1.5">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: ACCENT_TINT }} aria-hidden="true" />
                <span>{item.matchReason}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: ACCENT_TINT }} aria-hidden="true" />
                <span>
                  Grade: {item.grade} ({item.gradeScore.toFixed(1)}/10)
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: ACCENT_TINT }} aria-hidden="true" />
                <span className="tabular-nums">Verified seller · {item.verifiedSales} sales</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Tag className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
                <span className="tabular-nums">
                  <span className="text-zinc-400 line-through">${item.priceBefore}</span>{" "}
                  <span className="font-extrabold text-white">${item.priceAfter}</span>{" "}
                  <span className="text-zinc-400">({pct}% off)</span>
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
