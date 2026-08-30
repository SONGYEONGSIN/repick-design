"use client";

import { useState, type ComponentType } from "react";
import { Bot, User, Gavel } from "lucide-react";
import type { TimelineEvent } from "./data";
import { cx, FOCUS_LIGHT } from "./ui";

const ROLE_ICON: Record<string, ComponentType<{ className?: string }>> = {
  Buyer: User,
  Seller: User,
  System: Bot,
  "Trust analyst": Gavel,
};

/**
 * Timeline — Mode B of the selection-propagation split.
 *
 * Row selection in the rail (CaseRail.tsx) is a "pin": clicking sets `selectedCaseId` on the page,
 * which is lifted state that persists until the next click and deliberately drives a partial set of
 * downstream widgets (see DetailPane.tsx). Hovering/focusing the timestamp chip on a timeline row is
 * the opposite mode on purpose: it is a purely ephemeral inspector. `TimestampChip` below holds its
 * own `open` boolean, never lifts it anywhere, and the tooltip vanishes the instant the pointer or
 * focus leaves — it cannot outlive the interaction the way the pin does, and no other widget on the
 * page ever reacts to it.
 */
export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="space-y-0">
      {events.map((ev, i) => {
        const Icon = ROLE_ICON[ev.actorRole] ?? User;
        const isLast = i === events.length - 1;
        return (
          <li key={ev.id} className="relative flex gap-3 pb-6 last:pb-0">
            {!isLast && <span className="absolute left-[13px] top-7 bottom-0 w-px bg-zinc-200" aria-hidden="true" />}
            <span className="relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500">
              <Icon className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="text-[13px] font-medium text-zinc-900">{ev.label}</p>
                <TimestampChip at={ev.at} id={ev.id} />
              </div>
              <p className="mt-0.5 text-[12px] text-zinc-500">
                {ev.actor} · {ev.actorRole}
              </p>
              {ev.detail && <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-700">{ev.detail}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function TimestampChip({ at, id }: { at: string; id: string }) {
  const [open, setOpen] = useState(false);
  const d = new Date(at);
  const short = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(d);
  const precise = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(d);

  return (
    <span className="relative shrink-0">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className={cx(
          "rounded px-1 py-0.5 text-[11px] tabular-nums whitespace-nowrap text-zinc-500 hover:text-zinc-700",
          FOCUS_LIGHT,
        )}
      >
        {short}
      </button>
      {open && (
        <span
          role="tooltip"
          className="pointer-events-none absolute right-0 top-full z-20 mt-1 whitespace-nowrap rounded-md border border-zinc-200 bg-white px-2 py-1 text-[11px] tabular-nums text-zinc-700 shadow-md"
        >
          {precise} · ref {id}
        </span>
      )}
    </span>
  );
}
