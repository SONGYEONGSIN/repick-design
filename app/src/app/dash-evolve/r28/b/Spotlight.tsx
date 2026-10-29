"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, PinOff, Sparkles } from "lucide-react";
import {
  ACCOUNTS,
  CATEGORY_META,
  formatDate,
  formatSignedThousands,
  formatThousands,
  type CategoryId,
} from "./data";
import { Card, Pill, cn, FOCUS_RING } from "./ui";

/** Independently-scoped reaction to the pinned bridge step: rather than
 * mirroring the accounts table's row-filter, this panel ranks movers
 * within the category and keeps its own "which mover is shown" cursor —
 * a control the table has no equivalent of, and one that resets on a
 * new pin but is otherwise untouched by anything the table does. */
export function Spotlight({
  focusId,
  onClearPin,
}: {
  focusId: CategoryId | null;
  onClearPin: () => void;
}) {
  const [cursor, setCursor] = useState(0);

  // Resets the mover cursor whenever the pinned category changes.
  // Adjusted during render (React's documented pattern for state that
  // tracks a prop) rather than in an effect, so there's no extra render
  // tick and no synchronous setState-in-effect.
  const [prevFocusId, setPrevFocusId] = useState(focusId);
  if (focusId !== prevFocusId) {
    setPrevFocusId(focusId);
    setCursor(0);
  }

  const movers = useMemo(() => {
    if (!focusId) return [];
    return ACCOUNTS.filter((a) => a.category === focusId).sort(
      (a, b) => Math.abs(b.arrImpact) - Math.abs(a.arrImpact),
    );
  }, [focusId]);

  if (!focusId || movers.length === 0) {
    return (
      <Card className="flex h-full flex-col items-start justify-center gap-2 text-center sm:text-left">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-400">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </span>
        <h2 className="text-base font-semibold text-zinc-900">Category spotlight</h2>
        <p className="text-sm text-zinc-500">
          Click a bridge step in the chart — or press <kbd className="rounded border border-zinc-200 px-1 py-0.5 font-sans text-[11px]">⌘K</kbd> and pin one — to
          surface its top movers here.
        </p>
      </Card>
    );
  }

  const meta = CATEGORY_META[focusId];
  const CategoryIcon = meta.icon;
  const account = movers[cursor];
  const categoryTotal = movers.reduce((sum, a) => sum + a.arrImpact, 0);

  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
            Pinned bridge step
          </p>
          <h2 className="mt-1 flex items-center gap-1.5 text-base font-semibold text-zinc-900">
            <CategoryIcon className="h-4 w-4 text-zinc-400" aria-hidden="true" />
            {meta.label}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClearPin}
          className={cn(
            "inline-flex h-8 items-center gap-1 rounded-md border border-zinc-200 px-2 text-xs font-medium text-zinc-500 hover:text-zinc-900",
            FOCUS_RING,
          )}
        >
          <PinOff className="h-3 w-3" aria-hidden="true" />
          Unpin
        </button>
      </div>

      <p className="mt-1 text-sm text-zinc-500">
        {movers.length} account{movers.length === 1 ? "" : "s"} · category total{" "}
        <span className="font-medium text-zinc-700">{formatSignedThousands(categoryTotal)}</span>
      </p>

      <div className="mt-5 flex-1 rounded-xl border border-zinc-100 bg-zinc-50/60 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-900">{account.name}</p>
            <p className="text-xs text-zinc-500">
              {account.segment} · {account.owner}
            </p>
          </div>
          <Pill tone={meta.direction === "up" ? "up" : "down"}>
            {formatSignedThousands(account.arrImpact)}
          </Pill>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div>
            <dt className="text-zinc-500">Share of step</dt>
            <dd className="mt-0.5 font-medium tabular-nums text-zinc-900">
              {formatPercentOfCategory(account.arrImpact, categoryTotal)}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">Last activity</dt>
            <dd className="mt-0.5 font-medium tabular-nums text-zinc-900">
              {formatDate(account.lastActivity)}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-zinc-500">Impact magnitude</dt>
            <dd className="mt-0.5 font-medium tabular-nums text-zinc-900">
              {formatThousands(account.arrImpact)} ARR
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-zinc-500">
          Mover {cursor + 1} of {movers.length}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={movers.length < 2}
            onClick={() => setCursor((c) => (c - 1 + movers.length) % movers.length)}
            aria-label="Previous mover"
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 hover:text-zinc-900 disabled:pointer-events-none disabled:opacity-40",
              FOCUS_RING,
            )}
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            disabled={movers.length < 2}
            onClick={() => setCursor((c) => (c + 1) % movers.length)}
            aria-label="Next mover"
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 hover:text-zinc-900 disabled:pointer-events-none disabled:opacity-40",
              FOCUS_RING,
            )}
          >
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </Card>
  );
}

function formatPercentOfCategory(value: number, categoryTotal: number): string {
  if (categoryTotal === 0) return "—";
  const pct = (Math.abs(value) / Math.abs(categoryTotal)) * 100;
  return `${pct.toFixed(0)}%`;
}
