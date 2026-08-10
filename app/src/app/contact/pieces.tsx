"use client";

import { Activity, FileText, Check, Clock, Mail, MessageSquare, TriangleAlert } from "lucide-react";
import {
  DAY_SHORT,
  FOCUS_RING,
  coverageSpans,
  estimateReply,
  formatClock,
  formatDuration,
  type Desk,
  type Route,
} from "./data";

/* --------------------------------------------------------------------- */

const ROUTE_META: Record<Route, { label: string; note: string; tone: string }> = {
  status: {
    label: "Open incident",
    note: "We already know. Writing in will not make it move faster.",
    tone: "border-rose-300 bg-rose-50 text-rose-900",
  },
  docs: {
    label: "Documented",
    note: "Written down, with the exact steps below.",
    tone: "border-zinc-300 bg-zinc-100 text-zinc-900",
  },
  answered: {
    label: "Asked before",
    note: "A real answer a person on the desk wrote and still stands behind.",
    tone: "border-zinc-300 bg-zinc-100 text-zinc-900",
  },
  human: {
    label: "Needs a person",
    note: "Nothing on file covers this. Straight to a desk.",
    tone: "border-rose-300 bg-rose-50 text-rose-900",
  },
};

export function RouteBadge({ route }: { route: Route }) {
  const meta = ROUTE_META[route];
  const Icon = route === "status" ? Activity : route === "docs" ? FileText : route === "answered" ? MessageSquare : Mail;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${meta.tone}`}>
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      {meta.label}
    </span>
  );
}

export function routeNote(route: Route): string {
  return ROUTE_META[route].note;
}

/* --------------------------------------------------------------------- */

/**
 * Seven 24-hour tracks, one per weekday, with the chosen send hour drawn as a marker. Purely
 * decorative for assistive tech — the same information is printed as text in `hoursLabel` right
 * above it, so the bars are hidden rather than described twice.
 */
export function CoverageStrip({ desk, sendDay, sendHour }: { desk: Desk; sendDay: number; sendHour: number }) {
  const markerLeft = Math.round((sendHour / 24) * 10000) / 100;
  return (
    <div aria-hidden="true" className="grid grid-cols-[2rem_1fr] items-center gap-x-2 gap-y-1">
      {DAY_SHORT.map((label, day) => {
        const spans = coverageSpans(desk, day);
        const isSendDay = day === sendDay;
        return (
          <div key={label} className="contents">
            <span className={`text-xs tabular-nums ${isSendDay ? "font-semibold text-zinc-900" : "font-normal text-zinc-600"}`}>
              {label}
            </span>
            <div className="relative h-2 min-w-0 rounded-full bg-zinc-200">
              {spans.map((span) => (
                <span
                  key={`${label}-${span.left}`}
                  className="absolute inset-y-0 rounded-full bg-rose-400"
                  style={{ left: `${span.left}%`, width: `${span.width}%` }}
                />
              ))}
              {isSendDay && (
                <span
                  className="absolute -top-1 h-4 w-0.5 rounded-full bg-zinc-900"
                  style={{ left: `${markerLeft}%` }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------------------------- */

export function DeskCard({
  desk,
  sendDay,
  sendHour,
  routed,
}: {
  desk: Desk;
  sendDay: number;
  sendHour: number;
  routed: boolean;
}) {
  const estimate = estimateReply(desk, sendDay, sendHour);
  const dayWord = estimate.dayOffset === 0 ? "same day" : estimate.dayOffset === 1 ? "next day" : `in ${estimate.dayOffset} days`;

  return (
    <article
      className={`flex min-w-0 flex-col rounded-2xl border bg-white p-5 sm:p-6 ${
        routed ? "border-rose-300 ring-1 ring-rose-200" : "border-zinc-200"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-lg font-semibold tracking-tight text-zinc-900">{desk.name}</h3>
        {routed && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-900">
            <Check aria-hidden="true" className="h-3.5 w-3.5" />
            Where your message goes
          </span>
        )}
      </div>

      <p className="mt-2 text-sm font-normal leading-relaxed text-zinc-700">{desk.purpose}</p>

      <a
        href={`mailto:${desk.email}`}
        className={`mt-4 inline-flex w-fit max-w-full items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-900 hover:border-rose-400 hover:text-rose-800 ${FOCUS_RING}`}
      >
        <Mail aria-hidden="true" className="h-4 w-4 flex-none" />
        <span className="min-w-0 break-all">{desk.email}</span>
      </a>

      <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-zinc-200 pt-4">
        <div className="min-w-0">
          <dt className="text-xs font-normal uppercase tracking-wide text-zinc-600">Median first reply</dt>
          <dd className="mt-1 text-xl font-bold tabular-nums text-zinc-900">{formatDuration(desk.medianMinutes)}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs font-normal uppercase tracking-wide text-zinc-600">Slowest 1 in 10</dt>
          <dd className="mt-1 text-xl font-bold tabular-nums text-zinc-900">{formatDuration(desk.p90Minutes)}</dd>
        </div>
        <div className="col-span-2 min-w-0">
          <dt className="text-xs font-normal uppercase tracking-wide text-zinc-600">Answered by</dt>
          <dd className="mt-1 text-sm font-normal text-zinc-800">
            <span className="font-semibold text-zinc-900">{desk.owner.name}</span>, {desk.owner.role}
          </dd>
        </div>
      </dl>

      <div className="mt-5 border-t border-zinc-200 pt-4">
        <p className="text-xs font-normal uppercase tracking-wide text-zinc-600">Staffed</p>
        <p className="mt-1 text-sm font-normal text-zinc-800">{desk.hoursLabel}</p>
        <div className="mt-3">
          <CoverageStrip desk={desk} sendDay={sendDay} sendHour={sendHour} />
        </div>
        <p className="mt-3 flex items-start gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-normal leading-relaxed text-zinc-800">
          <Clock aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-rose-800" />
          <span className="min-w-0">
            {estimate.staffedNow ? "Staffed at that hour. " : "Nobody on the desk at that hour. "}
            <span className="font-semibold text-zinc-900">
              First reply {dayWord} around {formatClock(estimate.replyMinuteOfDay)} UTC
            </span>{" "}
            <span className="tabular-nums">({formatDuration(estimate.waitMinutes)} from sending)</span>.
          </span>
        </p>
      </div>

      <div className="mt-5 border-t border-zinc-200 pt-4">
        <p className="text-xs font-normal uppercase tracking-wide text-zinc-600">Handles</p>
        <ul className="mt-2 space-y-1.5">
          {desk.covers.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm font-normal leading-relaxed text-zinc-800">
              <Check aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-rose-800" />
              <span className="min-w-0">{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex items-start gap-2 text-sm font-normal leading-relaxed text-zinc-700">
          <TriangleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-zinc-600" />
          <span className="min-w-0">{desk.notFor}</span>
        </p>
      </div>

      <p className="mt-4 text-sm font-normal leading-relaxed text-zinc-700">
        <span className="font-semibold text-zinc-900">{desk.altChannel.label}:</span> {desk.altChannel.value}
      </p>
    </article>
  );
}
