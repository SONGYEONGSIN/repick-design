import { CircleCheckBig, ShieldCheck, Swords, Tag } from "lucide-react";
import type { Listing } from "./data";
import { winCount, overallWinner } from "./data";
import { Reveal } from "./Reveal";

const COLUMNS = [
  {
    icon: CircleCheckBig,
    title: "Condition, graded the same way every time",
    body: "Every listing gets a letter grade from its photos and the seller's own wear notes, not a marketing adjective.",
  },
  {
    icon: ShieldCheck,
    title: "Seller trust, tracked across every sale",
    body: "A trust score follows the seller: response time, past dispute history, and identity verification combined.",
  },
  {
    icon: Tag,
    title: "Price, benchmarked against recent sales",
    body: "Price value compares the ask to what similar items actually sold for recently, not the original retail tag.",
  },
] as const;

export function ValueSplit({ a, b }: { a: Listing; b: Listing }) {
  const { winner, loser, winnerScore, loserScore } = overallWinner(a, b);
  const counts = winCount(a, b);

  return (
    <section id="scoring" className="scroll-mt-24 border-b border-white/10 py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-rose-500">
            How scoring works
          </p>
          <h2
            className="mt-3 font-extrabold tracking-[-0.02em] text-white"
            style={{ fontSize: "clamp(1.6rem, 1.3rem + 1.6vw, 2.4rem)" }}
          >
            What the duel is actually scoring
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {COLUMNS.map((col, i) => (
            <Reveal key={col.title} delay={i * 0.08} className="min-w-0">
              <col.icon className="h-5 w-5 text-rose-500" aria-hidden="true" />
              <h3 className="mt-3 text-base font-semibold tracking-[-0.02em] text-white">
                {col.title}
              </h3>
              <p
                className="mt-2 text-[16px] leading-[1.6] text-zinc-300"
                style={{ maxWidth: "30.75rem" }}
              >
                {col.body}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-12">
          <div className="rounded-2xl border border-white/10 bg-white/[2%] p-6">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
              <Swords className="h-3.5 w-3.5 text-rose-500" aria-hidden="true" />
              Live from the duel above
            </p>
            <p
              className="mt-3 text-[16px] leading-[1.6] text-zinc-200"
              style={{ maxWidth: "30.75rem" }}
            >
              Right now, <span className="font-extrabold text-white">{winner.name}</span>{" "}
              is ahead of <span className="font-extrabold text-white">{loser.name}</span>,{" "}
              <span className="tabular-nums text-rose-500">
                {winner.id === a.id ? counts.a : counts.b}
              </span>{" "}
              criteria to{" "}
              <span className="tabular-nums">{winner.id === a.id ? counts.b : counts.a}</span>.
              Overall verdict:{" "}
              <span className="tabular-nums text-rose-500">{winnerScore}</span> to{" "}
              <span className="tabular-nums">{loserScore}</span>.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
