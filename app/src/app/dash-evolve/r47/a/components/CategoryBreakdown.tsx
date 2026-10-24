"use client";

import type { Category, StatusCounts } from "../lib/data";
import { Card, CardHeader, MiniStackedBar, STATUS_META } from "./ui";

/**
 * Pure consumer of the "category pin" — it reads `category` + `counts` and renders, nothing else.
 * It is intentionally NOT wired to the Kanban board or the findings table: selecting a category here
 * never touches `selectedFindingId`, and selecting a finding on the board never touches this card.
 */
export function CategoryBreakdown({
  category,
  counts,
  periodShortLabel,
}: {
  category: Category;
  counts: StatusCounts;
  periodShortLabel: string;
}) {
  const needsAttention = counts.atRisk + counts.nonCompliant;
  const shareOfProgram = Math.round((category.total / 100) * 100);

  return (
    <Card className="flex min-w-0 flex-col">
      <CardHeader
        title="Category Focus"
        subtitle={`Pinned from the waffle chart · ${periodShortLabel}`}
      />
      <div className="flex-1 px-5 py-4">
        <p className="text-sm font-semibold text-zinc-50">{category.name}</p>
        <p className="mt-0.5 text-xs text-zinc-400 tabular-nums">
          {category.total} controls in scope · {shareOfProgram}% of the full program
        </p>

        <div className="mt-4">
          <MiniStackedBar
            segments={[
              { key: "compliant", value: counts.compliant },
              { key: "at-risk", value: counts.atRisk },
              { key: "non-compliant", value: counts.nonCompliant },
              { key: "na", value: counts.na },
            ]}
          />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2">
          {(
            [
              ["compliant", counts.compliant],
              ["at-risk", counts.atRisk],
              ["non-compliant", counts.nonCompliant],
              ["na", counts.na],
            ] as const
          ).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between gap-2 rounded-lg bg-zinc-950/60 px-2.5 py-1.5">
              <dt className="flex items-center gap-1.5 text-xs text-zinc-400">
                <span className={`h-2 w-2 rounded-full ${STATUS_META[key].dot}`} aria-hidden="true" />
                {STATUS_META[key].label}
              </dt>
              <dd className="text-sm font-medium tabular-nums text-zinc-50">{value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-xs text-zinc-400">
          {needsAttention > 0 ? (
            <>
              <span className="font-medium tabular-nums text-amber-400">{needsAttention}</span> control
              {needsAttention === 1 ? "" : "s"} in this category are at-risk or non-compliant and need owner
              attention before the next attestation window.
            </>
          ) : (
            <>No open risk in this category for {periodShortLabel} — all applicable controls are compliant.</>
          )}
        </p>
      </div>
    </Card>
  );
}
