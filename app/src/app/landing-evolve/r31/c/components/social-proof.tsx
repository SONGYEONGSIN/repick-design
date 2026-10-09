import { Reveal } from "./reveal";
import { DISPLAY_FONT, Eyebrow } from "./ui";

const STATS = [
  { value: "$2.4M", label: "paid out to sellers across the last twelve months" },
  { value: "94%", label: "of estimates land within 5% of the final sale price" },
] as const;

const QUOTES = [
  {
    quote:
      "I priced a coat I almost gave away. Moving the brand tier up to Premium changed the number more than I expected, and the payout matched what actually hit my account.",
    name: "Renata O.",
    role: "Seller, outerwear",
  },
  {
    quote:
      "The fee math is the first one I have seen that is actually spelled out. Luxury items keep a bigger share, which is the opposite of what most marketplaces do.",
    name: "Devon K.",
    role: "Seller, handbags",
  },
  {
    quote:
      "I listed the same jacket twice with different photo counts to see if it mattered. It did — a few extra photos moved the suggested price up noticeably.",
    name: "Priyanka S.",
    role: "Seller, denim",
  },
] as const;

export function SocialProof() {
  return (
    <section id="proof" className="border-t border-white/10 py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <Eyebrow>SELLERS WHO ALREADY RAN THE NUMBERS</Eyebrow>
        <h2
          className="mt-4 text-[clamp(2rem,1.4rem+2.2vw,3.25rem)] font-bold leading-[1.03] tracking-[-0.02em] text-white"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          Sellers check the math before they list.
        </h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 sm:max-w-xl">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-bold tabular-nums tracking-[0.02em] text-white">{stat.value}</p>
              <p className="mt-1 max-w-[280px] text-sm text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {QUOTES.map((q, i) => (
            <Reveal key={q.name} delay={i * 0.08} className="min-w-0">
              <blockquote className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <p className="max-w-[420px] flex-1 text-[14px] leading-[1.6] text-zinc-300">
                  &ldquo;{q.quote}&rdquo;
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
