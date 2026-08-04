"use client";

import { useMemo, useState } from "react";
import { Flame } from "lucide-react";
import { MOST_READ_MONTH, MOST_READ_WEEK, POSTS } from "./data";

const DISPLAY_FONT = { fontFamily: "var(--font-display-wide)" } as const;

type Scope = "week" | "month";

const SCOPES: { id: Scope; label: string }[] = [
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
];

function formatReads(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : `${n}`;
}

/**
 * "Most read" sidebar module — independently scoped (week / month), always rendered with real
 * ranked entries at rest. Switching scope swaps the ranked list in place; it never hides content
 * behind the toggle.
 */
export default function MostRead() {
  const [scope, setScope] = useState<Scope>("week");

  const entries = useMemo(() => {
    const source = scope === "week" ? MOST_READ_WEEK : MOST_READ_MONTH;
    return source
      .map((entry) => {
        const post = POSTS.find((p) => p.id === entry.postId);
        return post ? { ...entry, title: post.title, minutes: post.minutes } : null;
      })
      .filter((e): e is NonNullable<typeof e> => e !== null);
  }, [scope]);

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 style={DISPLAY_FONT} className="flex items-center gap-1.5 text-base font-semibold text-stone-900">
          <Flame className="h-4 w-4 text-orange-700" aria-hidden="true" />
          Most read
        </h2>
        <div role="group" aria-label="Most-read time range" className="flex gap-1 rounded-full bg-stone-100 p-1">
          {SCOPES.map((s) => {
            const active = scope === s.id;
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={active}
                onClick={() => setScope(s.id)}
                className={
                  "rounded-full px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white " +
                  (active ? "bg-stone-900 text-stone-50" : "text-stone-600 hover:text-stone-900")
                }
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <ol className="mt-4 space-y-4">
        {entries.map((entry) => (
          <li key={entry.postId} className="flex min-w-0 gap-3">
            <span
              aria-hidden="true"
              style={DISPLAY_FONT}
              className="w-5 shrink-0 text-lg font-semibold text-stone-300"
            >
              {entry.rank}
            </span>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm leading-snug font-medium text-stone-900">{entry.title}</p>
              <p className="mt-1 text-xs font-normal text-stone-600">
                <span className="tabular-nums">{formatReads(entry.reads)}</span> reads &middot;{" "}
                <span className="tabular-nums">{entry.minutes}</span> min read
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
