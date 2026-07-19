export type RoundInfo = { winner: string | null; noWinner: boolean; date?: string };
export type CandidateStatus = "winner" | "dropped" | "pending";

export function parseLedger(text: string): Map<string, RoundInfo> {
  const map = new Map<string, RoundInfo>();
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    let e: { round?: unknown; winner?: unknown; no_winner?: unknown; date?: unknown };
    try {
      e = JSON.parse(t);
    } catch {
      continue;
    }
    if (!e || typeof e.round !== "string") continue;
    map.set(e.round, {
      winner: typeof e.winner === "string" ? e.winner : null,
      noWinner: e.no_winner === true,
      date: typeof e.date === "string" ? e.date : undefined,
    });
  }
  return map;
}

export function candidateStatus(round: string, variant: string, map: Map<string, RoundInfo>): CandidateStatus {
  const info = map.get(round);
  if (!info || info.noWinner) return "pending";
  return info.winner === variant ? "winner" : "dropped";
}
