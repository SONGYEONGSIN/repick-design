import { Swords } from "lucide-react";
import type { Listing } from "./data";
import { overallWinner, winCount } from "./data";
import { Reveal } from "./Reveal";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400";

export function ClosingCta({ a, b }: { a: Listing; b: Listing }) {
  const { winner, loser, winnerScore, loserScore } = overallWinner(a, b);
  const counts = winCount(a, b);
  const winnerWinCount = winner.id === a.id ? counts.a : counts.b;

  return (
    <section id="start" className="scroll-mt-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <Reveal className="py-16 sm:py-20">
          <div className="rounded-2xl border border-white/10 bg-white/[2%] p-8 sm:p-12">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-rose-500">
              <Swords className="h-3.5 w-3.5" aria-hidden="true" />
              Ready when you are
            </p>
            <h2
              className="mt-3 font-extrabold tracking-[-0.02em] text-white"
              style={{ fontSize: "clamp(1.8rem, 1.4rem + 2vw, 2.9rem)" }}
            >
              Run your own duel before you buy.
            </h2>
            <p
              className="mt-4 text-[16px] leading-[1.6] text-zinc-300"
              style={{ maxWidth: "30.75rem" }}
            >
              {winner.name} just beat {loser.name} on {winnerWinCount} of 4 measures —
              condition, trust, price, and delivery speed, scored the same way for
              every listing on Repick.
            </p>

            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#listings"
                className={`inline-flex items-center justify-center gap-2 rounded-md bg-rose-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-rose-500 ${FOCUS}`}
              >
                Browse {winner.name} on Repick
              </a>
              <p className="text-[13px] font-semibold text-zinc-400">
                Verdict: <span className="tabular-nums text-rose-500">{winnerScore}</span> to{" "}
                <span className="tabular-nums">{loserScore}</span>
              </p>
            </div>
          </div>
        </Reveal>

        <footer className="flex flex-col items-start justify-between gap-3 border-t border-white/10 py-8 text-[13px] text-zinc-400 sm:flex-row sm:items-center">
          <span className="flex items-center gap-2 font-semibold text-zinc-300">
            <Swords className="h-3.5 w-3.5 text-rose-500" aria-hidden="true" />
            repick
          </span>
          <span>© 2026 Repick. Every listing, measured against its rival.</span>
        </footer>
      </div>
    </section>
  );
}
