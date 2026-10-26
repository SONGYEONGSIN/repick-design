import { ChevronDown } from "lucide-react";
import type { Bracket } from "./data";
import Matchup from "./Matchup";
import ChampionCard from "./ChampionCard";
import { MUTED_ON_TINT } from "./tokens";

function Divider() {
  return (
    <div className="flex justify-center py-1" aria-hidden="true">
      <ChevronDown className="h-4 w-4 text-zinc-400" />
    </div>
  );
}

function RoundLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
      {children}
    </p>
  );
}

/**
 * Mobile/tablet fallback (below the `lg` breakpoint): the same four rounds,
 * same live data, as a plain vertically-stacked list instead of the wide
 * horizontal tree. No horizontal scroll anywhere — every card is `w-full`
 * inside a single column, so the page can never overflow at 390px.
 */
export default function BracketStacked({
  bracket,
  showScore,
}: {
  bracket: Bracket;
  showScore: boolean;
}) {
  return (
    <div className="block lg:hidden">
      <RoundLabel>Round of 8</RoundLabel>
      <div className="flex flex-col gap-3">
        {bracket.round1.map((m) => (
          <Matchup key={m.a.id + m.b.id} match={m} showScore={showScore} />
        ))}
      </div>

      <Divider />

      <RoundLabel>Semifinals</RoundLabel>
      <div className="flex flex-col gap-3">
        {bracket.semis.map((m) => (
          <Matchup key={m.a.id + m.b.id} match={m} showScore={showScore} />
        ))}
      </div>

      <Divider />

      <RoundLabel>Final</RoundLabel>
      <Matchup match={bracket.final} showScore={showScore} />

      <Divider />

      <RoundLabel>Champion</RoundLabel>
      <ChampionCard
        listing={bracket.champion}
        score={bracket.final.winner.id === bracket.final.a.id ? bracket.final.scoreA : bracket.final.scoreB}
      />
      <p className={`mt-2 text-[11px] font-normal ${MUTED_ON_TINT}`}>
        Round pairings stay fixed — only which listing advances through each
        slot changes with the priority mode above.
      </p>
    </div>
  );
}
