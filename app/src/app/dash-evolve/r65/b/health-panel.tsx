"use client";

import { useMemo, useState } from "react";
import { Inbox, AlertTriangle, Timer } from "lucide-react";
import { CATEGORY_LABEL, CATEGORY_ORDER, CATEGORY_SHORT, formatMinutes, SLA_TARGET_MINUTES, type Category, type FeedItem } from "./data";
import { FOCUS_RING } from "./ui";

interface HealthPanelProps {
  items: FeedItem[];
  headingId: string;
}

const CHART_HEIGHT = 96;

export function HealthPanel({ items, headingId }: HealthPanelProps) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const pendingCount = useMemo(() => items.filter((i) => i.status === "pending").length, [items]);

  const breachCount = useMemo(() => {
    return items.filter((i) => {
      if (i.status !== "pending") return false;
      return i.queueMinutes > SLA_TARGET_MINUTES[i.severity];
    }).length;
  }, [items]);

  const avgDecisionMinutes = useMemo(() => {
    const resolved = items.filter((i) => i.status !== "pending");
    if (resolved.length === 0) return 0;
    const total = resolved.reduce((sum, i) => sum + i.queueMinutes, 0);
    return Math.round(total / resolved.length);
  }, [items]);

  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = { counterfeit: 0, harassment: 0, prohibited: 0, fraud: 0, hate: 0, scam: 0 };
    for (const item of items) counts[item.category] += 1;
    return counts;
  }, [items]);

  const totalFlags = items.length;
  const maxCount = Math.max(...CATEGORY_ORDER.map((c) => categoryCounts[c]));

  const inspected = activeCategory ?? CATEGORY_ORDER.reduce((best, c) => (categoryCounts[c] > categoryCounts[best] ? c : best), CATEGORY_ORDER[0]);
  const inspectedPct = totalFlags === 0 ? 0 : Math.round((categoryCounts[inspected] / totalFlags) * 100);

  return (
    <section aria-labelledby={headingId} className="min-w-0 space-y-5">
      <h2 id={headingId} className="text-lg font-bold text-zinc-900">
        Queue health
      </h2>

      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <dl className="space-y-0">
          <div className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
              <Inbox className="h-3.5 w-3.5" aria-hidden="true" />
              Pending today
            </dt>
            <dd
              className="font-bold tabular-nums text-zinc-900"
              style={{ fontFamily: "var(--font-display-mono)", fontSize: "2rem", lineHeight: 1 }}
            >
              {pendingCount}
            </dd>
          </div>
        </dl>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-3.5">
          <dl>
            <div>
              <dt className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-orange-700" aria-hidden="true" />
                SLA breaches
              </dt>
              <dd className="mt-1 text-xl font-bold tabular-nums text-zinc-900">{breachCount}</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-3.5">
          <dl>
            <div>
              <dt className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                <Timer className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
                Avg time to decide
              </dt>
              <dd className="mt-1 text-xl font-bold tabular-nums text-zinc-900">{formatMinutes(avgDecisionMinutes)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <h3 className="text-sm font-bold text-zinc-900">Flags by category</h3>
        <p className="mt-0.5 text-xs text-zinc-500">Hover or focus a bar for exact counts.</p>

        <div className="mt-4 flex items-end gap-2" style={{ height: CHART_HEIGHT }}>
          {CATEGORY_ORDER.map((cat) => {
            const count = categoryCounts[cat];
            const height = maxCount === 0 ? 0 : Math.round((count / maxCount) * CHART_HEIGHT);
            const isActive = inspected === cat;
            return (
              <button
                key={cat}
                type="button"
                onMouseEnter={() => setActiveCategory(cat)}
                onFocus={() => setActiveCategory(cat)}
                onMouseLeave={() => setActiveCategory(null)}
                onBlur={() => setActiveCategory(null)}
                className={`group flex h-full flex-1 flex-col items-center justify-end rounded ${FOCUS_RING}`}
              >
                <span
                  className={`w-full rounded-t transition-colors motion-reduce:transition-none ${
                    isActive ? "bg-orange-700" : "bg-zinc-200 group-hover:bg-orange-300"
                  }`}
                  style={{ height: Math.max(height, 3) }}
                />
                <span className="sr-only">
                  {CATEGORY_LABEL[cat]}: {count} flags
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-1 flex gap-2 text-[10px] leading-tight text-zinc-500" aria-hidden="true">
          {CATEGORY_ORDER.map((cat) => (
            <span key={cat} className="flex-1 break-words text-center">
              {CATEGORY_SHORT[cat]}
            </span>
          ))}
        </div>

        <p className="mt-3 rounded-md bg-zinc-50 px-3 py-2 text-sm text-zinc-700" aria-live="polite">
          <span className="font-medium text-zinc-900">{CATEGORY_LABEL[inspected]}</span>:{" "}
          <span className="tabular-nums">{categoryCounts[inspected]}</span> flag
          {categoryCounts[inspected] === 1 ? "" : "s"} ·{" "}
          <span className="tabular-nums">{inspectedPct}%</span> of all flagged items this shift
        </p>
      </div>
    </section>
  );
}
