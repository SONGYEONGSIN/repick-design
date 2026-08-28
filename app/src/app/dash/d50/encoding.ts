import type { LineId, ProductionLine } from "./data";
import { LINES } from "./data";

export type LineEmphasis = "focused" | "neutral";

export type LineRow = { line: ProductionLine; rank: number; emphasis: LineEmphasis };

/**
 * The ONLY consumer of `focusLineId` inside the schedule. It recomputes the timeline's OWN
 * encoding — which row sorts first and which row is highlighted — instead of handing the raw id
 * to sibling widgets. `CadenceClient` never threads `focusLineId` itself into the KPI strip or the
 * command palette: they receive `deriveSummary(focusLineId)`, an already-computed value object, so
 * nothing downstream has to know a line-selection model exists at all. The order ledger table is
 * independent again — its own status/search filters, untouched by line focus — so no widget in the
 * tree reads this module's output except the Gantt that produced the selection in the first place.
 */
export function buildLineRows(focusLineId: LineId | null): LineRow[] {
  if (!focusLineId) {
    return LINES.map((line, i) => ({ line, rank: i, emphasis: "neutral" }));
  }
  const focused = LINES.filter((l) => l.id === focusLineId);
  const rest = LINES.filter((l) => l.id !== focusLineId);
  return [...focused, ...rest].map((line, i) => ({
    line,
    rank: i,
    emphasis: line.id === focusLineId ? "focused" : "neutral",
  }));
}
