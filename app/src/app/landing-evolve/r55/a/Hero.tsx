import Image from "next/image";
import { ArrowRight, Percent, ShieldCheck, Sparkles } from "lucide-react";
import { GradeStepper } from "./GradeStepper";
import { HERO_ITEM } from "./data";
import { discountPercent, estimatedPrice, gradeAt } from "./model";
import {
  ACCENT_LARGE_HEX,
  ACCENT_TEXT_SMALL,
  CAPTION,
  EYEBROW,
  FG,
  FG_SOFT,
  FOCUS_RING,
  MUTED,
  MUTED_HEX,
  ON_ACCENT_FILL_TEXT,
  PROSE_WIDTH_HERO,
  SURFACE,
  SURFACE_BORDER,
  SURFACE_TINT,
} from "./tokens";

interface HeroProps {
  step: number;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * Hero + product + proof + the assigned interactive device, all inside ONE component's render
 * tree (design-principles §Landing structure item 1 and this round's assignment §7: the stepper's
 * effects must land inside Hero itself, not a sibling section). Mobile fold order matters more
 * than desktop column order here: the proof card is the FIRST element in this component's JSX
 * (`order-1`, no `lg:` prefix needed there) so a narrow single-column stack always shows the
 * graded product — photo, badges, live price, stepper — before the headline requires any
 * scrolling; `lg:order-2`/`lg:order-1` only swap the *visual* position back to the conventional
 * text-left arrangement at the `lg` breakpoint where the two columns sit side by side.
 */
export function Hero({ step, onPrev, onNext }: HeroProps) {
  const grade = gradeAt(step);
  const price = estimatedPrice(HERO_ITEM.basePrice, step);
  const discount = discountPercent(HERO_ITEM.basePrice, step);

  return (
    <section className="px-4 pb-12 pt-10 sm:px-6 sm:pt-16 lg:px-10 lg:pb-20 lg:pt-20" aria-labelledby="hero-heading">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Proof card — first in document order, see note above. */}
        <div className="order-1 min-w-0 lg:order-2 lg:col-span-5">
          <div className="rounded-3xl p-5 sm:p-6" style={{ border: `1px solid ${SURFACE_BORDER}`, backgroundColor: SURFACE }}>
            <div className="flex items-center justify-between gap-2">
              <p className={CAPTION} style={{ color: MUTED_HEX }}>
                Fig. 01 — condition grade walkthrough
              </p>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold ${ACCENT_TEXT_SMALL}`}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                {HERO_ITEM.aiMatchPct}% match
              </span>
            </div>

            <div
              className="relative mt-3 aspect-[4/3] w-full overflow-hidden rounded-2xl"
              style={{ backgroundColor: SURFACE_TINT }}
            >
              <Image
                src={`https://images.unsplash.com/photo-${HERO_ITEM.photoId}?auto=format&fit=crop&w=720&q=80`}
                alt={HERO_ITEM.alt}
                fill
                preload
                sizes="(max-width: 1024px) 90vw, 440px"
                className="object-cover"
              />
            </div>

            {/* Badge row BELOW the photo, never an overlay on it — an image-load failure leaves
                these free to flow instead of colliding with alt text. */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                style={{ backgroundColor: ACCENT_LARGE_HEX }}
              >
                <span className={ON_ACCENT_FILL_TEXT}>Grade: {grade.name}</span>
              </span>
              {HERO_ITEM.verified ? (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${ACCENT_TEXT_SMALL}`}
                  style={{ border: `1px solid ${SURFACE_BORDER}` }}
                >
                  <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                  Verified seller
                </span>
              ) : null}
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                style={{ color: FG, border: `1px solid ${SURFACE_BORDER}`, fontVariantNumeric: "tabular-nums" }}
              >
                <Percent className="h-3 w-3" aria-hidden="true" />
                {discount}% off original
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span
                className="font-extrabold"
                style={{ fontSize: "2rem", color: FG, fontVariantNumeric: "tabular-nums" }}
              >
                ${price.toLocaleString("en-US")}
              </span>
              <span className={`text-[13px] font-normal line-through ${MUTED}`} style={{ fontVariantNumeric: "tabular-nums" }}>
                ${HERO_ITEM.basePrice.toLocaleString("en-US")} new
              </span>
            </div>
            <p className={`mt-1 text-[13px] font-normal leading-[1.6] ${MUTED}`}>{HERO_ITEM.title}</p>

            <p className="mt-3 text-[13px] font-normal leading-[1.6]" style={{ color: FG_SOFT }}>
              {grade.buyerNote}
            </p>

            <div className="mt-5 border-t pt-5" style={{ borderColor: SURFACE_BORDER }}>
              <GradeStepper step={step} onPrev={onPrev} onNext={onNext} />
            </div>
          </div>
        </div>

        {/* Headline column — second in document order, visually first on desktop via lg:order-1. */}
        <div className="order-2 flex min-w-0 flex-col gap-6 lg:order-1 lg:col-span-7">
          <p className={`${EYEBROW} ${ACCENT_TEXT_SMALL}`}>Regrade · condition-graded resale</p>
          <h1
            id="hero-heading"
            className="font-extrabold"
            style={{
              fontFamily: "var(--font-display-wide)",
              letterSpacing: "-0.01em",
              lineHeight: 1.04,
              fontSize: "clamp(2.1rem, 4.4vw + 0.6rem, 3.7rem)",
              color: FG,
            }}
          >
            See exactly what condition is worth before you buy.
          </h1>
          <p className={`${PROSE_WIDTH_HERO} text-[18px] font-normal leading-[1.6]`} style={{ color: FG_SOFT }}>
            Every listing on Regrade carries a four-step condition grade. Step through Good,
            Very Good, Excellent, and Like New on the item to the side — the resale price and
            what it means for you both update as you go.
          </p>
          <div>
            <a
              href="#start-selling"
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold transition-transform active:scale-[0.98] ${FOCUS_RING}`}
              style={{ backgroundColor: ACCENT_LARGE_HEX }}
            >
              <span className={ON_ACCENT_FILL_TEXT}>List your first item</span>
              <ArrowRight className="h-4 w-4" style={{ color: FG }} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
