import { ChevronRight } from "lucide-react";
import type { CategoryId, Period, TeamId } from "./data";
import { CATEGORY_META, teamTotal } from "./data";
import { drillSubtotal } from "./cost-treemap";
import { formatCurrency, formatPercent } from "./format";
import { Card } from "./ui";

/**
 * Independent selection consumer #1: reads only the treemap's own drill state. It never reads or
 * resets the resources table's pinned row, and nothing about it changes when a different row gets
 * pinned — the two selections share this page but never touch each other's state. There is always
 * real content here, even before any tile is ever clicked (drill defaults to the team's top level).
 */
export function BreadcrumbCard({
  teamName,
  teamId,
  period,
  drillCategoryId,
}: {
  teamName: string;
  teamId: TeamId;
  period: Period;
  drillCategoryId: CategoryId | null;
}) {
  const subtotal = drillSubtotal(teamId, period, drillCategoryId);
  const total = teamTotal(teamId, period);
  const share = total > 0 ? (subtotal / total) * 100 : 0;

  return (
    <Card as="section" ariaLabelledBy="breadcrumb-heading" className="min-w-0 p-4">
      <h2 id="breadcrumb-heading" className="font-semibold text-sm text-zinc-50">
        Treemap selection
      </h2>

      <nav aria-label="Treemap breadcrumb" className="mt-2 flex min-w-0 items-center gap-1 font-medium text-xs text-zinc-400">
        <span className="min-w-0 truncate">{teamName}</span>
        {drillCategoryId !== null ? (
          <>
            <ChevronRight className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="min-w-0 truncate text-zinc-50">{CATEGORY_META[drillCategoryId].label}</span>
          </>
        ) : null}
      </nav>

      <p className="mt-3 font-semibold text-2xl tabular-nums text-zinc-50 [font-family:var(--font-display-grotesk)]">{formatCurrency(subtotal)}</p>
      <p className="mt-1 font-normal text-xs text-zinc-400">
        {drillCategoryId === null ? "Full team total — " : `${formatPercent(share)} of ${teamName} — `}
        this period.
      </p>
    </Card>
  );
}
