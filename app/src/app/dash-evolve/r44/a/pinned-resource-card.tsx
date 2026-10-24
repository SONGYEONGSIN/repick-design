import { Pin } from "lucide-react";
import type { Period } from "./data";
import { CATEGORY_META, TEAM_META, categoryAverageUtilization, resourceById, resourceCost } from "./data";
import { formatCurrency } from "./format";
import { Card, Delta, ProgressBar, StatusBadge } from "./ui";

/**
 * Independent selection consumer #2: reads only the resources table's pinned resource id, which is
 * global (not scoped to whichever team is currently active in the master list or to the treemap's
 * drill path), so pinning survives switching teams. It never reads or resets the treemap's drill
 * state. `pinnedResourceId` always points at a real resource on first paint — never null — so this
 * card never renders an empty "select something" placeholder.
 */
export function PinnedResourceCard({ pinnedResourceId, period }: { pinnedResourceId: string; period: Period }) {
  const resource = resourceById(pinnedResourceId);
  if (!resource) {
    return (
      <Card as="section" ariaLabelledBy="pinned-heading" className="min-w-0 p-4">
        <h2 id="pinned-heading" className="font-semibold text-sm text-zinc-50">
          Pinned resource
        </h2>
        <p className="mt-2 font-normal text-sm text-zinc-400">Pin a row in the resources table to compare it here.</p>
      </Card>
    );
  }

  const team = TEAM_META[resource.teamId];
  const category = CATEGORY_META[resource.categoryId];
  const costThis = resourceCost(resource, "this-month");
  const costLast = resourceCost(resource, "last-month");
  const costDeltaPct = costLast > 0 ? ((costThis - costLast) / costLast) * 100 : 0;
  const avgUtilization = categoryAverageUtilization(resource.teamId, resource.categoryId);
  const utilizationDelta = resource.utilizationPct - avgUtilization;
  const displayedCost = resourceCost(resource, period);

  return (
    <Card as="section" ariaLabelledBy="pinned-heading" className="min-w-0 p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 id="pinned-heading" className="font-semibold text-sm text-zinc-50">
          Pinned resource
        </h2>
        <Pin className="h-3.5 w-3.5 shrink-0 text-amber-400" aria-hidden="true" />
      </div>

      <p className="mt-2 truncate font-semibold text-sm text-zinc-50">{resource.name}</p>
      <p className="truncate font-normal text-xs text-zinc-400">
        {team.name} · {category.label}
      </p>

      <p className="mt-3 font-semibold text-2xl tabular-nums text-zinc-50 [font-family:var(--font-display-grotesk)]">{formatCurrency(displayedCost)}</p>

      <dl className="mt-3 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <dt className="font-normal text-xs text-zinc-400">Vs. last month</dt>
          <dd>
            <Delta value={costDeltaPct} />
          </dd>
        </div>
        <div>
          <dt className="font-normal text-xs text-zinc-400">Utilization vs. {category.label.toLowerCase()} avg.</dt>
          <dd className="mt-1">
            <span className="font-medium text-xs tabular-nums text-zinc-50">
              {resource.utilizationPct}% ({utilizationDelta >= 0 ? "+" : ""}
              {utilizationDelta.toFixed(0)}pp)
            </span>
            <ProgressBar pct={resource.utilizationPct} className="mt-1.5" />
          </dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="font-normal text-xs text-zinc-400">Status</dt>
          <dd>
            <StatusBadge status={resource.status} />
          </dd>
        </div>
      </dl>
    </Card>
  );
}
