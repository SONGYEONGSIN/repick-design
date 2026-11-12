import Reveal from "./Reveal";
import { Eyebrow } from "./ui";
import { CATEGORY_ORDER, totalItemsAnalyzed } from "./categories";

const SELLER_QUOTES = [
  {
    quote:
      "I toggled Outerwear off before I ever listed a jacket. The bubble was the smallest and slowest one on the board, and that told me more than a paragraph would have.",
    name: "Priya N.",
    role: "Seller, sneakers & handbags",
  },
  {
    quote:
      "Watches looked slow until I added Electronics next to it. The cluster repacked and Watches wasn't the problem anymore — my price was.",
    name: "Mateo R.",
    role: "Seller, watches & electronics",
  },
  {
    quote:
      "No tooltip hunting. Every number I needed was already sitting on the bubble before I touched anything.",
    name: "Yuki S.",
    role: "Seller, denim & outerwear",
  },
] as const;

export default function SocialProof() {
  const total = totalItemsAnalyzed(CATEGORY_ORDER);

  return (
    <section id="proof" className="border-b border-zinc-200 py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <Eyebrow>SELLERS WHO CHECKED THE CLUSTER FIRST</Eyebrow>
        <h2 className="mt-4 font-[var(--font-display-wide)] text-[clamp(1.9rem,1.3rem+2.1vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-zinc-950">
          They priced from the data, not a guess.
        </h2>

        <div className="mt-8 grid gap-6 sm:max-w-xl sm:grid-cols-2">
          <div>
            <p className="text-4xl font-extrabold tabular-nums tracking-[0.12em] text-zinc-950">
              {total.toLocaleString("en-US")}
            </p>
            <p className="mt-1 max-w-[280px] text-sm font-normal leading-[1.6] text-zinc-600">
              listings behind every median shown on this page, across all six categories
            </p>
          </div>
          <div>
            <p className="text-4xl font-extrabold tabular-nums tracking-[0.12em] text-zinc-950">6</p>
            <p className="mt-1 max-w-[280px] text-sm font-normal leading-[1.6] text-zinc-600">
              categories tracked today, with more added as volume justifies a new bubble
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {SELLER_QUOTES.map((q, i) => (
            <Reveal key={q.name} delay={i * 0.08} className="min-w-0">
              <blockquote className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <p className="flex-1 text-sm font-normal leading-[1.6] text-zinc-700" style={{ maxWidth: "420px" }}>
                  &ldquo;{q.quote}&rdquo;
                </p>
                <footer className="mt-4 text-[13px] font-normal text-zinc-600">
                  <cite className="font-bold text-zinc-800">{q.name}</cite> &mdash; {q.role}
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
