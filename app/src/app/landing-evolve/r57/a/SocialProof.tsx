import { Quote } from "lucide-react";
import { ACCENT, BORDER, CAPTION, FG, MUTED, PROSE_WIDTH_CARD, SURFACE } from "./tokens";

const displayFace = { fontFamily: "var(--font-display-grotesk)" };

const TESTIMONIALS = [
  {
    name: "Dana R.",
    handle: "@danareshops",
    quote:
      "Moving both handles and watching four checks flip in real time told me more in ten seconds than a filter sidebar ever did. I knew exactly why a listing didn't qualify.",
  },
  {
    name: "Mateo S.",
    handle: "@mateo_sells",
    quote:
      "The jacket that failed on shipping, not price, saved me from assuming budget was the only reason something wasn't a fit. Small detail, big trust boost.",
  },
  {
    name: "Elena V.",
    handle: "@elenavresale",
    quote:
      "I like that the checklist told me straight away which two listings would never qualify no matter how wide I set my range. No guessing games.",
  },
];

/**
 * Chapter 04 — fixed snapshot. These three quotes and the rating line are the SAME text for
 * every visitor and are never recomputed from the price range above, unlike every other number
 * on this page. Said explicitly below too, so it never reads as "everything here is live."
 */
export function SocialProof() {
  return (
    <section id="proof" className="px-4 py-14 sm:px-8 lg:px-12 lg:py-20">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className={CAPTION} style={{ color: MUTED }}>
            Chapter 04 — Who&apos;s tried it
          </p>
          <h2
            className="mt-2 text-[clamp(1.6rem,2.8vw+0.8rem,2.3rem)] font-extrabold tracking-[-0.02em]"
            style={{ ...displayFace, color: FG }}
          >
            Shoppers who ran the checklist
          </h2>
        </div>
        <p className="text-[13px] font-normal tabular-nums" style={{ color: MUTED }}>
          4.7 avg. rating · 2,310 ranges set
        </p>
      </div>
      <p className="mt-1 text-[12.5px] font-normal" style={{ color: MUTED }}>
        A fixed snapshot from last quarter&apos;s reviews — not affected by the range you set above.
      </p>

      <div className="mt-8 grid min-w-0 gap-5 sm:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.handle}
            className={`flex min-w-0 flex-col rounded-2xl p-5 ${PROSE_WIDTH_CARD} sm:max-w-none`}
            style={{ border: `1px solid ${BORDER}`, backgroundColor: SURFACE }}
          >
            <Quote className="h-5 w-5" style={{ color: ACCENT }} aria-hidden="true" />
            <blockquote className="mt-3 flex-1 text-[14.5px] font-normal leading-[1.6]" style={{ color: MUTED }}>
              {t.quote}
            </blockquote>
            <figcaption className="mt-4 text-[13px] font-semibold" style={{ color: FG }}>
              {t.name}
              <span className="ml-1.5 font-normal" style={{ color: MUTED }}>
                {t.handle}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
