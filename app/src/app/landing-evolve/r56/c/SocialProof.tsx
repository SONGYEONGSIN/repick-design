import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Priya N.",
    handle: "@priyaresells",
    quote:
      "I passed on the first four sneakers and the rail already knew I wanted mid-tier streetwear, not premium minimal. Felt less like filters and more like it was paying attention.",
  },
  {
    name: "Owen T.",
    handle: "@owen_thrifts",
    quote:
      "The arrow-key swiping is what sold me — I went through the whole deck on my phone during a commute without once having to tap precisely on a tiny button.",
  },
  {
    name: "Mariana K.",
    handle: "@marianak",
    quote:
      "Every card still shows condition, a verified-seller badge and the real discount before I decide. I never felt like I was swiping blind just to train an algorithm.",
  },
];

const displayFace = { fontFamily: "var(--font-display-wide)" };

export default function SocialProof() {
  return (
    <section className="border-b border-zinc-200 px-4 py-14 sm:px-8 lg:px-14 lg:py-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2
            className="text-[clamp(1.5rem,2.6vw+0.8rem,2.1rem)] font-extrabold tracking-[-0.02em] text-zinc-900"
            style={displayFace}
          >
            Shoppers who built a profile this way
          </h2>
          <p className="text-[13px] font-normal tabular-nums text-zinc-500">
            4.8 avg. rating · 1,240 decks completed
          </p>
        </div>
        {/* Fixed snapshot: these three quotes and the rating above are not wired to this session's
            live profile — they are the same text for every visitor, unlike the deck and rail above. */}
        <p className="mt-1 text-[12.5px] font-normal text-zinc-500">
          A fixed snapshot from last quarter&apos;s reviews — not affected by the deck above.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.handle}
              className="flex flex-col rounded-2xl border border-zinc-200 bg-zinc-50 p-5"
            >
              <Quote className="h-5 w-5 text-lime-700" aria-hidden="true" />
              <blockquote className="mt-3 flex-1 text-[14.5px] font-normal leading-[1.6] text-zinc-700">
                {t.quote}
              </blockquote>
              <figcaption className="mt-4 text-[13px] font-semibold text-zinc-900">
                {t.name}
                <span className="ml-1.5 font-normal text-zinc-500">{t.handle}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
