"use client";

import { Archive, CheckCircle2, Clock, Inbox, UserCheck, UserX, AlertTriangle } from "lucide-react";
import type { QueueId } from "../lib/data";
import { QUEUE_DEFS } from "../lib/data";
import { EyebrowLabel } from "./ui";
import { cn } from "../lib/format";

const QUEUE_ICON: Record<QueueId, typeof Inbox> = {
  inbox: Inbox,
  mine: UserCheck,
  unassigned: UserX,
  urgent: AlertTriangle,
  pending: Clock,
  resolved: CheckCircle2,
  archived: Archive,
};

/**
 * Inbox-section sub-nav (queues/folders). Deliberately styled differently
 * from AppSidebar: tinted zinc-50 surface, no brand/workspace chrome, plain
 * list rows with a left accent bar instead of a filled pill — so it reads as
 * "inside the Inbox feature" rather than a second global nav.
 */
export default function QueueRail({
  counts,
  active,
  onSelect,
  className = "",
}: {
  counts: Record<QueueId, { total: number; unread: number }>;
  active: QueueId;
  onSelect: (id: QueueId) => void;
  className?: string;
}) {
  return (
    <nav
      aria-label="Inbox queues"
      className={cn("flex h-full w-56 shrink-0 flex-col overflow-y-auto border-r border-zinc-200 bg-zinc-50/70 py-4", className)}
    >
      <div className="px-4 pb-2">
        <EyebrowLabel>Queues</EyebrowLabel>
      </div>
      <ul className="flex flex-col gap-0.5 px-2">
        {QUEUE_DEFS.map((q) => {
          const Icon = QUEUE_ICON[q.id];
          const isActive = q.id === active;
          const c = counts[q.id];
          return (
            <li key={q.id}>
              <button
                type="button"
                onClick={() => onSelect(q.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative flex w-full min-h-10 items-center gap-2.5 rounded-lg py-2 pl-3 pr-2 text-left text-sm outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
                  isActive ? "bg-white font-medium text-zinc-900 shadow-sm" : "text-zinc-600 hover:bg-white/70 hover:text-zinc-900",
                )}
              >
                {isActive ? (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-indigo-600" aria-hidden="true" />
                ) : null}
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-indigo-600" : "text-zinc-400")} aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate">{q.label}</span>
                {c.unread > 0 ? (
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
                      isActive ? "bg-indigo-100 text-indigo-700" : "bg-zinc-200 text-zinc-700",
                    )}
                  >
                    {c.unread}
                  </span>
                ) : (
                  <span className="shrink-0 text-[11px] tabular-nums text-zinc-500">{c.total}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
