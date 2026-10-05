import { Reveal } from "./reveal";
import { Eyebrow } from "./ui";

const STATS = [
  { value: "38,412", label: "match breakdowns opened in the last 90 days" },
  { value: "61%", label: "of buyers move at least one dial before they buy" },
] as const;

const QUOTES = [
  {
    quote:
      "I dragged condition all the way up before buying anything. The price number actually dropped a little — that told me more than any trust badge could.",
    name: "Mina R.",
    role: "Buyer, first order",
  },
  {
    quote:
      "We get asked “why is this the match” far more than “is this real.” This is the first page that answers the question we actually get.",
    name: "Devon K.",
    role: "Seller operations",
  },
  {
    quote:
      "Watching the price bar grow while I nudged one dial was the first time a resale score felt like it was showing its work, not asking for my trust.",
    name: "Priyanka S.",
    role: "Buyer",
  },
] as const;

export function SocialProof() {
  return (
    <section id="proof" className="border-t border-white/10 py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <Eyebrow>PEOPLE ACTUALLY OPEN THE BREAKDOWN</Eyebrow>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 sm:max-w-xl">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-bold tabular-nums tracking-[0.12em] text-white">
                {stat.value}
              </p>
              <p className="mt-1 max-w-[280px] text-sm text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {QUOTES.map((q, i) => (
            <Reveal key={q.name} delay={i * 0.08} className="min-w-0">
              <blockquote className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <p className="max-w-[431px] flex-1 text-[14px] leading-[1.6] text-zinc-300">
                  “{q.quote}”
                </p>
                <footer className="mt-4 text-[13px] text-zinc-400">
                  <cite className="font-semibold text-zinc-300">{q.name}</cite> — {q.role}
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
