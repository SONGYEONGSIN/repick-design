import { ShieldCheck, Sparkles, Swords } from "lucide-react";
import { Reveal } from "./Reveal";

const STATS = [
  { icon: Sparkles, value: "118,000+", label: "listings scored this month" },
  { icon: Swords, value: "41", label: "data points compared in every duel" },
  { icon: ShieldCheck, value: "100%", label: "of sellers identity-verified before listing" },
] as const;

const QUOTES = [
  {
    quote:
      "I put the two jackets I was torn on side by side and the trust score ended up being the tiebreaker.",
    name: "Jordan M.",
    role: "Frequent buyer",
  },
  {
    quote:
      "The condition grade matched exactly what I saw once the watch actually arrived at my door.",
    name: "Priya S.",
    role: "Verified buyer",
  },
  {
    quote:
      "Seeing both listings scored the same way made the decision almost boring — which is what I wanted.",
    name: "Devon K.",
    role: "Repeat seller",
  },
] as const;

export function SocialProof() {
  return (
    <section id="proof" className="scroll-mt-24 border-b border-white/10 py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-rose-500">
            Trusted by resale regulars
          </p>
          <h2
            className="mt-3 font-extrabold tracking-[-0.02em] text-white"
            style={{ fontSize: "clamp(1.6rem, 1.3rem + 1.6vw, 2.4rem)" }}
          >
            The same four criteria, every single time
          </h2>
        </Reveal>

        <Reveal delay={0.06}>
          <dl className="mt-10 grid grid-cols-1 gap-6 border-y border-white/10 py-8 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="min-w-0">
                <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  <stat.icon className="h-4 w-4 text-rose-500" aria-hidden="true" />
                  {stat.label}
                </dt>
                <dd className="mt-2 text-3xl font-extrabold tabular-nums tracking-[-0.02em] text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {QUOTES.map((q, i) => (
            <Reveal key={q.name} delay={i * 0.08} className="min-w-0">
              <figure className="h-full rounded-2xl border border-white/10 bg-white/[2%] p-6">
                <blockquote
                  className="text-[17px] leading-[1.6] text-zinc-200"
                  style={{ maxWidth: "32.7rem" }}
                >
                  &ldquo;{q.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-[13px] font-semibold text-zinc-400">
                  <span className="text-white">{q.name}</span> — {q.role}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
