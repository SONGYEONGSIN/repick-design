import type { Bracket } from "./data";
import Matchup from "./Matchup";
import ChampionCard from "./ChampionCard";
import {
  ConnectorRoundToSemi,
  ConnectorSemiToFinal,
  ConnectorFinalToChampion,
  TOTAL_H,
} from "./Connectors";

const LABEL_H = 28;

function RoundLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-end" style={{ height: LABEL_H }}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
        {children}
      </p>
    </div>
  );
}

function championScore(bracket: Bracket): number {
  const f = bracket.final;
  return f.winner.id === f.a.id ? f.scoreA : f.scoreB;
}

/**
 * The full desktop single-elimination tree: Round of 8 → Semifinals →
 * Final → Champion, four real rounds wide, connected by fixed-geometry
 * SVG lines. Every column's matchup area starts at the same y=0 baseline
 * (below a fixed-height label row), which is what lets the connector
 * SVGs below use plain constants instead of measuring the DOM. Hidden
 * below the `lg` breakpoint in favor of BracketStacked.
 */
export default function BracketTree({
  bracket,
  showScore,
}: {
  bracket: Bracket;
  showScore: boolean;
}) {
  return (
    <div className="hidden lg:block" style={{ width: "fit-content" }}>
      <div className="flex items-start">
        <div className="w-[170px] flex-shrink-0">
          <RoundLabel>Round of 8</RoundLabel>
          <div className="flex flex-col gap-6">
            {bracket.round1.map((m) => (
              <Matchup key={m.a.id + m.b.id} match={m} showScore={showScore} />
            ))}
          </div>
        </div>

        <div style={{ paddingTop: LABEL_H }}>
          <ConnectorRoundToSemi />
        </div>

        <div className="w-[170px] flex-shrink-0">
          <RoundLabel>Semifinals</RoundLabel>
          <div className="flex flex-col gap-6" style={{ height: TOTAL_H }}>
            <div className="flex h-[328px] items-center justify-center">
              <Matchup match={bracket.semis[0]} showScore={showScore} />
            </div>
            <div className="flex h-[328px] items-center justify-center">
              <Matchup match={bracket.semis[1]} showScore={showScore} />
            </div>
          </div>
        </div>

        <div style={{ paddingTop: LABEL_H }}>
          <ConnectorSemiToFinal />
        </div>

        <div className="w-[170px] flex-shrink-0">
          <RoundLabel>Final</RoundLabel>
          <div className="flex items-center justify-center" style={{ height: TOTAL_H }}>
            <Matchup match={bracket.final} showScore={showScore} />
          </div>
        </div>

        <div style={{ paddingTop: LABEL_H }}>
          <ConnectorFinalToChampion />
        </div>

        <div className="w-[280px] flex-shrink-0">
          <RoundLabel>Champion</RoundLabel>
          <div className="flex items-center justify-center" style={{ height: TOTAL_H }}>
            <ChampionCard listing={bracket.champion} score={championScore(bracket)} />
          </div>
        </div>
      </div>
    </div>
  );
}
