import Reveal from "./Reveal";
import { Eyebrow } from "./ui";
import { SELLER_QUOTES, SELLER_STATS } from "./data";

export default function SocialProof() {
  return (
    <section id="proof" className="border-b border-white/10 py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <Eyebrow>SELLERS WHO ALREADY RAN THEIR OWN NUMBERS</Eyebrow>
        <h2 className="mt-4 text-[clamp(1.9rem,1.3rem+2.1vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] text-white">
          They moved the counters first. Then they listed.
        </h2>

        <div className="mt-8 grid gap-6 sm:max-w-xl sm:grid-cols-2">
          {SELLER_STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-extrabold tabular-nums tracking-[0.12em] text-white">{stat.value}</p>
              <p className="mt-1 max-w-[280px] text-sm leading-[1.6] text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {SELLER_QUOTES.map((q, i) => (
            <Reveal key={q.name} delay={i * 0.08} className="min-w-0">
              <blockquote className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <p className="flex-1 text-sm leading-[1.6] text-zinc-300" style={{ maxWidth: "420px" }}>
                  &ldquo;{q.quote}&rdquo;
                </p>
                <footer className="mt-4 text-[13px] text-zinc-400">
                  <cite className="font-semibold text-zinc-300">{q.name}</cite> &mdash; {q.role}
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
