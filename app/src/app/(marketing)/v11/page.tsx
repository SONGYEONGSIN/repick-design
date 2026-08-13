import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import RankingBoard from "./ranking-board";
import { GhostNumber, QuoteMark } from "./parts";

export const metadata: Metadata = {
  title: "repick — you set the order, the picks re-rank",
  description:
    "repick scores secondhand listings against five criteria. Put the criteria in the order you care about and the ranking, the point breakdown and the reasoning all re-compute in front of you.",
};

const QUOTES = [
  {
    body:
      "I moved shipping distance to the top and the whole first page changed. It is the first marketplace that let me argue with its own ranking.",
    who: "Studio owner · Rotterdam",
  },
  {
    body:
      "The breakdown is the product. I can see the exact points a listing earned per criterion, not a star rating somebody typed in.",
    who: "Vintage audio collector · Seoul",
  },
];

const STATS = [
  { label: "Listings scored every day", value: "1.2M" },
  { label: "Criteria, ordered by you", value: "5" },
  { label: "Picks that keep their stated grade", value: "94%" },
];

export default function Page() {
  return (
    <main className="w-full bg-white text-[#0B0B0F]">
      <RankingBoard />

      <section aria-labelledby="proof-title" className="border-t border-zinc-200">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 md:px-8 md:py-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <GhostNumber value="04" />
              <p className="mt-2 text-xs font-normal uppercase tracking-[0.16em] text-zinc-600">
                Fig. 04 — In use
              </p>
              <h2
                id="proof-title"
                className="mt-3 text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold leading-[1.03] tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-display-grotesk)" }}
              >
                People re-order first, then buy.
              </h2>
              <p className="mt-4 max-w-[46ch] text-base font-normal leading-[1.6] text-zinc-600">
                A ranking you can rearrange is a ranking you can trust. Buyers who reorder the
                criteria at least once are the ones who keep the item.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-8">
              {QUOTES.map((quote) => (
                <figure
                  key={quote.who}
                  className="flex min-w-0 flex-col border border-zinc-200 bg-zinc-50 p-6"
                >
                  <QuoteMark />
                  <blockquote className="mt-2 text-base font-normal leading-[1.6] text-[#0B0B0F]">
                    <p className="max-w-[46ch]">{quote.body}</p>
                  </blockquote>
                  <figcaption className="mt-5 text-xs font-normal uppercase tracking-[0.16em] text-zinc-600">
                    {quote.who}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <dl className="mt-12 grid gap-8 border-t border-zinc-200 pt-8 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="min-w-0">
                <dt className="text-xs font-normal uppercase tracking-[0.12em] text-zinc-600">
                  {stat.label}
                </dt>
                <dd
                  className="mt-2 text-[clamp(2.25rem,4vw,3.25rem)] font-extrabold leading-none tracking-[-0.02em] tabular-nums"
                  style={{ fontFamily: "var(--font-display-grotesk)" }}
                >
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="cta-title" className="bg-[#0B0B0F] text-white">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-16 md:px-8 md:py-24">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-7">
              <p className="text-xs font-normal uppercase tracking-[0.28em] text-zinc-300">
                Start here
              </p>
              <h2
                id="cta-title"
                className="mt-4 text-[clamp(2.1rem,5vw,3.75rem)] font-extrabold leading-[1.02] tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-display-grotesk)" }}
              >
                Set the order once. Keep it for every search.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="max-w-[52ch] text-base font-normal leading-[1.6] text-zinc-300">
                Your order travels with you — the same five criteria, the same visible points,
                applied to every listing repick scores tonight.
              </p>
              <a
                href="#picks"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#6E56CF] px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 ease-out hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] motion-reduce:transition-none"
              >
                Browse tonight&rsquo;s ranked picks
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
              <p className="mt-3 text-xs font-normal uppercase tracking-[0.16em] text-zinc-300">
                Free to browse — no account needed
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
