"use client";

import { ChevronDown, Inbox } from "lucide-react";
import { useId, useState } from "react";
import type { RivetEvent } from "../lib/data";
import { NOW } from "../lib/data";
import { formatDateTime, formatLatency, formatRelative } from "../lib/format";
import { Avatar, CategoryBadge, CategoryIcon, SOURCE_META } from "./ui";

function FeedItem({ event }: { event: RivetEvent }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const source = SOURCE_META[event.source];
  const slow = event.latencyMs >= 1000;

  return (
    <li className="transition-colors hover:bg-zinc-50/80">
      <div className="flex gap-3 px-4 py-3.5 sm:px-5">
        <CategoryIcon category={event.category} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <Avatar name={event.user} className="size-5" />
              <p className="min-w-0 text-sm text-zinc-800">
                {event.user ? (
                  <>
                    <span className="font-semibold text-zinc-900">{event.user}</span>
                    <span className="text-zinc-500"> 님이 </span>
                    {event.action}
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-zinc-900">시스템</span>
                    <span className="text-zinc-500"> · </span>
                    {event.action}
                  </>
                )}
              </p>
            </div>
            <time
              dateTime={event.at.toISOString()}
              title={formatDateTime(event.at)}
              className="shrink-0 whitespace-nowrap pt-0.5 text-xs tabular-nums text-zinc-400"
            >
              {formatRelative(event.at, NOW)}
            </time>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-zinc-500">
            <CategoryBadge category={event.category} />
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-600">
              {event.eventName}
            </code>
            <span className="inline-flex items-center gap-1">
              <source.Icon className="size-3.5 text-zinc-400" aria-hidden="true" />
              {source.label}
            </span>
            <span className="inline-flex items-center gap-1 tabular-nums">
              지연
              <span className={slow ? "font-medium text-rose-600" : "text-zinc-600"}>
                {formatLatency(event.latencyMs)}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={panelId}
              className="ml-auto inline-flex min-h-[28px] items-center gap-1 rounded-md px-1.5 font-medium text-zinc-500 transition-colors hover:text-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
            >
              속성 {event.props.length}
              <ChevronDown
                className={`size-3.5 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
          </div>

          {open && (
            <div id={panelId} className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50/70 p-3">
              <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                {event.props.map((prop) => (
                  <div key={prop.label} className="flex items-baseline justify-between gap-3 border-b border-zinc-200/70 pb-1.5 last:border-0 sm:last:border-b sm:[&:nth-last-child(2)]:border-0">
                    <dt className="shrink-0 text-xs text-zinc-500">{prop.label}</dt>
                    <dd className="min-w-0 truncate text-right text-xs font-medium text-zinc-800 tabular-nums">
                      {prop.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2.5 border-t border-zinc-200 pt-2 text-[11px] text-zinc-400">
                이벤트 ID <code className="font-mono text-zinc-500">{event.id}</code> · 수집{" "}
                <span className="tabular-nums">{formatDateTime(event.at)}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export default function EventFeed({ events }: { events: RivetEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
          <Inbox className="size-5" aria-hidden="true" />
        </span>
        <p className="mt-3 text-sm font-medium text-zinc-700">조건에 맞는 이벤트가 없습니다</p>
        <p className="mt-1 text-xs text-zinc-500">필터를 조정하면 더 많은 이벤트를 볼 수 있습니다.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-zinc-100">
      {events.map((event) => (
        <FeedItem key={event.id} event={event} />
      ))}
    </ul>
  );
}
