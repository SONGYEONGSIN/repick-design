/**
 * Threadline — Integration Leaderboard
 *
 * All figures below are fixed literals. Rank is never hand-authored: every rank in this file is
 * derived by sorting the one `values` matrix (active workspace connections per integration per
 * week), so a rank shown anywhere on the page can never disagree with the value it was computed
 * from — there is exactly one source of truth and every delta/leader/mover stat is a pure
 * function of it.
 */

export interface Period {
  key: string;
  label: string;
}

// 8 consecutive weekly snapshots. Plain string literals — never `new Date()` / `Date.now()`.
export const PERIODS: Period[] = [
  { key: "p1", label: "Aug 3" },
  { key: "p2", label: "Aug 10" },
  { key: "p3", label: "Aug 17" },
  { key: "p4", label: "Aug 24" },
  { key: "p5", label: "Aug 31" },
  { key: "p6", label: "Sep 7" },
  { key: "p7", label: "Sep 14" },
  { key: "p8", label: "Sep 21" },
];

export const LATEST_INDEX = PERIODS.length - 1; // 7
export const PREVIOUS_INDEX = LATEST_INDEX - 1; // 6

export type CategoryId = "workspace" | "revenue" | "engineering" | "support";

export const CATEGORY_ORDER: CategoryId[] = ["workspace", "revenue", "engineering", "support"];

export const CATEGORY_META: Record<CategoryId, { label: string }> = {
  workspace: { label: "Workspace & Docs" },
  revenue: { label: "Revenue & CRM" },
  engineering: { label: "Engineering" },
  support: { label: "Customer Support" },
};

export interface Entity {
  id: string;
  name: string;
  shortName: string;
  category: CategoryId;
  /** Active workspace connections for this integration, one entry per PERIODS index. */
  values: number[];
}

export const ENTITIES: Entity[] = [
  { id: "slack", name: "Slack", shortName: "Slack", category: "workspace", values: [980, 950, 905, 880, 840, 790, 760, 740] },
  { id: "sheets", name: "Google Sheets", shortName: "Sheets", category: "workspace", values: [860, 880, 895, 900, 895, 900, 905, 900] },
  { id: "hubspot", name: "HubSpot", shortName: "HubSpot", category: "revenue", values: [790, 770, 760, 730, 710, 700, 690, 670] },
  { id: "stripe", name: "Stripe", shortName: "Stripe", category: "revenue", values: [640, 700, 765, 820, 870, 910, 930, 945] },
  { id: "notion", name: "Notion", shortName: "Notion", category: "workspace", values: [560, 580, 575, 590, 585, 595, 600, 610] },
  { id: "github", name: "GitHub", shortName: "GitHub", category: "engineering", values: [500, 505, 498, 502, 500, 497, 503, 500] },
  { id: "salesforce", name: "Salesforce", shortName: "Salesforce", category: "revenue", values: [430, 420, 415, 405, 400, 390, 380, 370] },
  { id: "zendesk", name: "Zendesk", shortName: "Zendesk", category: "support", values: [300, 340, 400, 460, 540, 630, 770, 920] },
];

export function entityById(id: string): Entity {
  const found = ENTITIES.find((e) => e.id === id);
  if (!found) throw new Error(`Unknown integration id: ${id}`);
  return found;
}

function ranksAtPeriod(periodIdx: number): Record<string, number> {
  const sorted = [...ENTITIES].sort((a, b) => b.values[periodIdx] - a.values[periodIdx]);
  const ranks: Record<string, number> = {};
  sorted.forEach((entity, i) => {
    ranks[entity.id] = i + 1;
  });
  return ranks;
}

// One sort pass per period, computed once at module load — every rank read on this page comes
// from this table, never re-derived ad hoc at the call site.
const RANKS_BY_PERIOD: Record<string, number>[] = PERIODS.map((_, i) => ranksAtPeriod(i));

export function rankAt(entityId: string, periodIdx: number): number {
  return RANKS_BY_PERIOD[periodIdx][entityId];
}

export function valueAt(entityId: string, periodIdx: number): number {
  return entityById(entityId).values[periodIdx];
}

/** Positive = moved UP the leaderboard (toward rank 1, i.e. improved) between `fromIdx` and `toIdx`. */
export function rankDelta(entityId: string, fromIdx: number, toIdx: number): number {
  return rankAt(entityId, fromIdx) - rankAt(entityId, toIdx);
}

export function currentLeaderId(): string {
  const ranks = RANKS_BY_PERIOD[LATEST_INDEX];
  const leader = Object.keys(ranks).find((id) => ranks[id] === 1);
  if (!leader) throw new Error("No rank-1 integration found for the latest period.");
  return leader;
}

export function biggestMover(fromIdx: number, toIdx: number): { id: string; delta: number } {
  let best = { id: ENTITIES[0].id, delta: rankDelta(ENTITIES[0].id, fromIdx, toIdx) };
  for (const entity of ENTITIES.slice(1)) {
    const delta = rankDelta(entity.id, fromIdx, toIdx);
    if (Math.abs(delta) > Math.abs(best.delta)) best = { id: entity.id, delta };
  }
  return best;
}

export type RangeMode = "last4" | "all8";

export function visibleRange(mode: RangeMode): { startIdx: number; endIdx: number } {
  return mode === "last4" ? { startIdx: PERIODS.length - 4, endIdx: PERIODS.length - 1 } : { startIdx: 0, endIdx: PERIODS.length - 1 };
}

export function totalActiveConnections(periodIdx: number): number {
  return ENTITIES.reduce((sum, e) => sum + e.values[periodIdx], 0);
}

export function rankChangeCount(fromIdx: number, toIdx: number): number {
  return ENTITIES.filter((e) => rankAt(e.id, fromIdx) !== rankAt(e.id, toIdx)).length;
}
