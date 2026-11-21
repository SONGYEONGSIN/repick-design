import Reveal from "./Reveal";
import { MUTED_TEXT } from "./tokens";

const QUOTES = [
  {
    quote:
      "I used to overspend in month one and have nothing left for month four. Drawing the curve up front fixed that completely.",
    name: "Priya N.",
    role: "Camera collector, repick buyer since 2024",
  },
  {
    quote:
      "The match percentage actually moves when I change my budget shape — it isn't a static number pretending to react.",
    name: "Marcus T.",
    role: "Furniture reseller",
  },
  {
    quote:
      "Verification badges on every listing I can actually afford made the condition grade feel worth trusting.",
    name: "Alina R.",
    role: "Watch & audio buyer",
  },
];

// Fixed, historical, aggregate figures across repick's full buyer base -- deliberately
// independent of the live curve above (unlike the hero/plan/closing-CTA numbers, these never
// move when a point is dragged, and the caption says so explicitly).
const STATS = [
  { label: "Buyer plans started", value: "12,400+" },
  { label: "Average buyer rating", value: "4.8 / 5" },
  { label: "Average saved vs. retail", value: "38%" },
];

export default function SocialProof() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
      <Reveal>
        <h2 className="text-[clamp(1.6rem,2.4vw+1rem,2.4rem)] font-extrabold tracking-[-0.02em] text-white">
          Buyers who plan ahead, buy differently
        </h2>
      </Reveal>

      <Reveal delay={0.05} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {QUOTES.map((q) => (
          <figure key={q.name} className="flex h-full flex-col gap-3 rounded-2xl border border-[#23232C] bg-[#13131A] p-5">
            <blockquote className="text-sm font-normal leading-[1.6] text-white">&ldquo;{q.quote}&rdquo;</blockquote>
            <figcaption className={`mt-auto text-xs font-semibold ${MUTED_TEXT}`}>
              {q.name} <span className="font-normal">— {q.role}</span>
            </figcaption>
          </figure>
        ))}
      </Reveal>

      <Reveal delay={0.1} className="mt-10 grid grid-cols-1 gap-4 border-t border-[#23232C] pt-8 sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label}>
            <p className="text-2xl font-extrabold tabular-nums text-white">{s.value}</p>
            <p className={`text-xs font-normal ${MUTED_TEXT}`}>{s.label}</p>
          </div>
        ))}
      </Reveal>
      <p className={`mt-4 max-w-[339px] text-[11px] font-normal leading-[1.5] ${MUTED_TEXT}`}>
        Historical figures across repick&rsquo;s full buyer base — not tied to the budget curve
        above, which only reflects your own plan.
      </p>
    </section>
  );
}
