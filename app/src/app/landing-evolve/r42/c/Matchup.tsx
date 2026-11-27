import type { MatchResult } from "./data";
import MatchCard from "./MatchCard";

/**
 * One pairing: two listing cards stacked with a fixed 152px total height
 * (72px card + 8px gap + 72px card) so the desktop bracket's connector
 * lines — drawn separately with fixed pixel geometry — always meet the
 * right spot regardless of which listings occupy the slot.
 */
export default function Matchup({ match, showScore }: { match: MatchResult; showScore: boolean }) {
  return (
    <div className="flex h-[152px] w-full flex-col gap-2">
      <MatchCard
        listing={match.a}
        score={match.scoreA}
        isWinner={match.winner.id === match.a.id}
        showScore={showScore}
      />
      <MatchCard
        listing={match.b}
        score={match.scoreB}
        isWinner={match.winner.id === match.b.id}
        showScore={showScore}
      />
    </div>
  );
}
