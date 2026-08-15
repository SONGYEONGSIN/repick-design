"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, ArrowUpDown, CalendarClock, MapPin, Phone, Video } from "lucide-react";

import {
  LOCATION_LABEL,
  MEMBER_STATUS_LABEL,
  STATUS_LABEL,
  TEAM_MEMBERS,
  UPCOMING_MEETINGS,
  eventTypeById,
  formatDateLong,
  memberById,
  trendForPeriod,
  type EventTypeId,
  type Period,
  type UpcomingMeeting,
} from "./data";
import { cn } from "./cn";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { KpiRow } from "./kpi-row";
import { PeriodToggle } from "./period-toggle";
import { BookingTrendChart } from "./booking-trend-chart";
import { EventTypePanel } from "./event-type-panel";
import { WeekHeatmap } from "./week-heatmap";
import { CommandPalette } from "./command-palette";

/* ---------------------------------------------------------------- */
/* Shared card                                                       */
/* ---------------------------------------------------------------- */

function Card({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "min-w-0 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6",
        className,
      )}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
          {description ? <p className="mt-0.5 text-sm text-zinc-500">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Team availability                                                  */
/* ---------------------------------------------------------------- */

const MEMBER_DOT: Record<string, string> = {
  available: "bg-emerald-500",
  in_meeting: "bg-amber-500",
  offline: "bg-zinc-300",
};

function TeamAvailability() {
  return (
    <ul className="flex flex-col divide-y divide-zinc-100">
      {TEAM_MEMBERS.map((m) => {
        const ratio = Math.min(1, m.bookedToday / m.capacityToday);
        return (
          <li key={m.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <Image
              src={m.avatarUrl}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-zinc-900">{m.name}</p>
                <span className="flex shrink-0 items-center gap-1.5 text-xs text-zinc-500">
                  <span className={cn("h-1.5 w-1.5 rounded-full", MEMBER_DOT[m.status])} aria-hidden="true" />
                  {MEMBER_STATUS_LABEL[m.status]}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <div
                  className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100"
                  role="img"
                  aria-label={`${m.bookedToday} of ${m.capacityToday} booked today`}
                >
                  <div
                    className={cn("h-full rounded-full", ratio >= 1 ? "bg-amber-500" : "bg-indigo-500")}
                    style={{ width: `${Math.round(ratio * 100)}%` }}
                  />
                </div>
                <span className="shrink-0 text-xs text-zinc-500 tabular-nums">
                  {m.bookedToday}/{m.capacityToday}
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------------------------------------------------------------- */
/* Upcoming meetings table (sortable + wired to event type filter)   */
/* ---------------------------------------------------------------- */

type SortKey = "time" | "guest" | "event" | "status";
type SortDir = "asc" | "desc";

const STATUS_BADGE: Record<UpcomingMeeting["status"], string> = {
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  rescheduled: "bg-zinc-100 text-zinc-600 ring-zinc-500/20",
};

const LOCATION_ICON: Record<UpcomingMeeting["location"], typeof Video> = {
  video: Video,
  phone: Phone,
  in_person: MapPin,
};

function sortValue(m: UpcomingMeeting, key: SortKey): string {
  switch (key) {
    case "time":
      return `${m.dateISO} ${m.time}`;
    case "guest":
      return m.guestName;
    case "event":
      return eventTypeById(m.eventTypeId).name;
    case "status":
      return STATUS_LABEL[m.status];
  }
}

function UpcomingMeetings({ selectedType }: { selectedType: EventTypeId | "all" }) {
  const [sortKey, setSortKey] = useState<SortKey>("time");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const rows = useMemo(() => {
    const filtered =
      selectedType === "all"
        ? UPCOMING_MEETINGS
        : UPCOMING_MEETINGS.filter((m) => m.eventTypeId === selectedType);
    return [...filtered].sort((a, b) => {
      const cmp = sortValue(a, sortKey).localeCompare(sortValue(b, sortKey), "en");
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [selectedType, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const headers: { key: SortKey; label: string; className?: string }[] = [
    { key: "time", label: "Date & time" },
    { key: "guest", label: "Guest" },
    { key: "event", label: "Event type" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="min-w-0 overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <caption className="sr-only">List of upcoming meetings — click a column header to sort</caption>
        <thead>
          <tr className="border-b border-zinc-200">
            {headers.map((h) => {
              const active = h.key === sortKey;
              const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
              return (
                <th
                  key={h.key}
                  scope="col"
                  aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : undefined}
                  className={cn("px-3 py-2.5 font-medium text-zinc-500", h.className)}
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(h.key)}
                    className="inline-flex min-h-8 items-center gap-1 rounded-md px-1 -mx-1 hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    {h.label}
                    <Icon size={13} aria-hidden="true" className={active ? "text-zinc-700" : "text-zinc-300"} />
                  </button>
                </th>
              );
            })}
            <th scope="col" className="px-3 py-2.5 font-medium text-zinc-500">
              Host · Format
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {rows.map((m) => {
            const et = eventTypeById(m.eventTypeId);
            const host = memberById(m.hostId);
            const LocIcon = LOCATION_ICON[m.location];
            return (
              <tr key={m.id} className="transition-colors hover:bg-zinc-50">
                <td className="whitespace-nowrap px-3 py-3 text-zinc-900 tabular-nums">
                  {formatDateLong(m.dateISO)} <span className="font-medium">{m.time}</span>
                  <span className="ml-1 text-xs text-zinc-500">· {m.durationMin} min</span>
                </td>
                <td className="px-3 py-3">
                  <p className="font-medium text-zinc-900">{m.guestName}</p>
                  <p className="text-xs text-zinc-500">{m.guestEmail}</p>
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-zinc-600">{et.name}</td>
                <td className="whitespace-nowrap px-3 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                      STATUS_BADGE[m.status],
                    )}
                  >
                    {STATUS_LABEL[m.status]}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-zinc-600">
                  <span className="inline-flex items-center gap-1.5">
                    <LocIcon size={14} aria-hidden="true" className="text-zinc-500" />
                    {host?.name} · {LOCATION_LABEL[m.location]}
                  </span>
                </td>
              </tr>
            );
          })}
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-3 py-10 text-center text-sm text-zinc-500">
                No upcoming meetings for the selected event type.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Main dashboard                                                     */
/* ---------------------------------------------------------------- */

export function DashboardClient() {
  const [period, setPeriod] = useState<Period>("week");
  const [selectedType, setSelectedType] = useState<EventTypeId | "all">("all");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  // ⌘K / Ctrl+K command palette
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const trend = useMemo(() => trendForPeriod(period), [period]);
  const selectedLabel =
    selectedType === "all" ? "All events" : eventTypeById(selectedType).name;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="flex w-full">
        <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

        <div className="min-w-0 flex-1">
          <Topbar
            onOpenMobileNav={() => setMobileNavOpen(true)}
            onOpenCommand={() => setCommandOpen(true)}
          />

          <main id="main-content" className="mx-auto w-full max-w-[1760px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {/* Page header */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-500">Monday, January 12, 2026</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
                  Bookings
                </h1>
              </div>
              <PeriodToggle value={period} onChange={setPeriod} />
            </div>

            {/* KPI */}
            <div className="mt-6">
              <KpiRow period={period} />
            </div>

            {/* Trend + event type */}
            <div className="mt-6 grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-12">
              <Card
                title="Booking trend"
                description="Daily bookings and conversion rate"
                className="lg:col-span-8"
              >
                <BookingTrendChart data={trend} />
              </Card>
              <Card
                title="Event types"
                description="Share of bookings by type — select one to filter the heatmap and meeting list"
                className="lg:col-span-4"
              >
                <EventTypePanel period={period} selected={selectedType} onSelect={setSelectedType} />
              </Card>
            </div>

            {/* Heatmap + team availability */}
            <div className="mt-6 grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-12">
              <Card
                title="Weekly booking density"
                description={`Day × hour heatmap · ${selectedLabel}`}
                className="lg:col-span-8"
              >
                <WeekHeatmap eventTypeId={selectedType} eventTypeLabel={selectedLabel} />
              </Card>
              <Card
                title="Team availability"
                description="Today's booking load"
                className="lg:col-span-4"
              >
                <TeamAvailability />
              </Card>
            </div>

            {/* Upcoming meetings */}
            <div className="mt-6">
              <Card
                title="Upcoming meetings"
                description={selectedType === "all" ? "All event types" : `Showing ${selectedLabel} only`}
                action={
                  <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                    <CalendarClock size={14} aria-hidden="true" />
                    This week
                  </span>
                }
              >
                <UpcomingMeetings selectedType={selectedType} />
              </Card>
            </div>

            <footer className="mt-10 border-t border-zinc-200 pt-5 pb-2 text-xs text-zinc-500">
              Data is a static demo snapshot · as of 2026-01-12
            </footer>
          </main>
        </div>
      </div>

      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onSelectEventType={(id) => {
          setSelectedType(id);
          setCommandOpen(false);
        }}
      />
    </div>
  );
}
