"use client";

import { useId, useMemo, useState } from "react";
import {
  CalendarDays,
  FileText,
  Users,
  Settings,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";

const BG = "#0F172A"; // colors.catalog dark bank
const CARD = "#192134";
const BORDER = "rgba(255,255,255,0.08)";
const FG = "#F8FAFC";
const MUTED = "text-zinc-400"; // 6.97:1 on #0F172A
const ACCENT = "#60A5FA"; // blue-400 — 7.02:1 on #0F172A (text use)
const ACCENT_FILL = "#2563EB"; // blue-600 — paired with white text, 5.17:1

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60A5FA]";

/* ───────── deterministic data ───────── */

type MonthKey = "oct" | "nov";

const MONTH_LABEL: Record<MonthKey, string> = { oct: "October 2026", nov: "November 2026" };
const MONTH_DAYS: Record<MonthKey, number> = { oct: 31, nov: 30 };
const MONTH_START_OFFSET: Record<MonthKey, number> = { oct: 3, nov: 6 }; // Thu, Sun (fixed, deterministic)

// Deterministic per-day published-post counts, generated once by a fixed formula (no Math.random).
function countsFor(month: MonthKey): number[] {
  const days = MONTH_DAYS[month];
  const base = month === "oct" ? 1 : 2;
  const out: number[] = [];
  for (let d = 1; d <= days; d++) {
    const v = (d * 7 + base * 11) % 6; // 0..5, fixed formula
    out.push(v);
  }
  return out;
}

type Post = { id: string; title: string; day: number; month: MonthKey; channel: string };

const POSTS: Post[] = [
  { id: "p1", title: "Q4 pricing update walkthrough", day: 3, month: "oct", channel: "Blog" },
  { id: "p2", title: "Seller onboarding checklist v2", day: 3, month: "oct", channel: "Help Center" },
  { id: "p3", title: "October trust & safety digest", day: 9, month: "oct", channel: "Newsletter" },
  { id: "p4", title: "Grading rubric clarification", day: 14, month: "oct", channel: "Blog" },
  { id: "p5", title: "Verified seller spotlight: Mara K.", day: 14, month: "oct", channel: "Social" },
  { id: "p6", title: "Payout timing FAQ refresh", day: 21, month: "oct", channel: "Help Center" },
  { id: "p7", title: "November roadmap preview", day: 2, month: "nov", channel: "Blog" },
  { id: "p8", title: "Holiday shipping cutoffs", day: 8, month: "nov", channel: "Newsletter" },
];

function fmtDate(day: number, month: MonthKey) {
  const names: Record<MonthKey, string> = { oct: "Oct", nov: "Nov" };
  return `${names[month]} ${day}`;
}

function intensityColor(count: number) {
  // Decorative-only (aria-hidden bottom bar) — opacity encodes intensity, text contrast is
  // unaffected since the card background behind the actual digits never changes.
  if (count === 0) return "rgba(255,255,255,0.08)";
  if (count === 1) return "rgba(96,165,250,0.3)";
  if (count === 2) return "rgba(96,165,250,0.5)";
  if (count === 3) return "rgba(96,165,250,0.7)";
  return "rgba(96,165,250,0.9)";
}

/* ───────── small building blocks ───────── */

function Avatar({ initials }: { initials: string }) {
  return (
    <span
      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold"
      style={{ backgroundColor: ACCENT_FILL, color: "#FFFFFF" }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

function CalendarGrid({
  month,
  selectedDay,
  onSelectDay,
}: {
  month: MonthKey;
  selectedDay: number | null;
  onSelectDay: (d: number) => void;
}) {
  const counts = useMemo(() => countsFor(month), [month]);
  const offset = MONTH_START_OFFSET[month];
  const cells: Array<{ day: number | null; count: number }> = [];
  for (let i = 0; i < offset; i++) cells.push({ day: null, count: 0 });
  counts.forEach((c, i) => cells.push({ day: i + 1, count: c }));

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <p key={d} className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${MUTED}`}>
            {d}
          </p>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {cells.map((c, i) =>
          c.day === null ? (
            <div key={`empty-${i}`} />
          ) : (
            <button
              key={c.day}
              type="button"
              onClick={() => onSelectDay(c.day as number)}
              aria-pressed={selectedDay === c.day}
              className={`relative flex h-14 flex-col items-center justify-center gap-1 overflow-hidden rounded-lg border text-xs font-semibold transition-colors motion-reduce:transition-none ${FOCUS_RING}`}
              style={{
                borderColor: selectedDay === c.day ? ACCENT : BORDER,
                borderWidth: selectedDay === c.day ? 2 : 1,
                backgroundColor: CARD,
                color: FG,
              }}
            >
              <span aria-hidden="true" className="tabular-nums">
                {c.day}
              </span>
              <span aria-hidden="true" className="text-[10px] font-normal tabular-nums">
                {c.count}
              </span>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1"
                style={{ backgroundColor: intensityColor(c.count) }}
              />
              <span className="sr-only">
                {fmtDate(c.day, month)}: {c.count} post{c.count === 1 ? "" : "s"} published
              </span>
            </button>
          ),
        )}
      </div>
    </div>
  );
}

type SortKey = "day" | "title" | "channel";

function UpcomingTable({ month }: { month: MonthKey }) {
  const [sortKey, setSortKey] = useState<SortKey>("day");
  const [asc, setAsc] = useState(true);

  const rows = useMemo(() => {
    const scoped = POSTS.filter((p) => p.month === month);
    const copy = [...scoped];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "day") cmp = a.day - b.day;
      else if (sortKey === "title") cmp = a.title.localeCompare(b.title);
      else cmp = a.channel.localeCompare(b.channel);
      return asc ? cmp : -cmp;
    });
    return copy;
  }, [sortKey, asc, month]);

  function toggle(key: SortKey) {
    if (key === sortKey) setAsc((a) => !a);
    else {
      setSortKey(key);
      setAsc(true);
    }
  }

  function sortIcon(key: SortKey) {
    if (key !== sortKey) return <ArrowUpDown className={`h-3 w-3 ${MUTED}`} />;
    return asc ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
  }

  function thSort(key: SortKey): "ascending" | "descending" | "none" {
    if (key !== sortKey) return "none";
    return asc ? "ascending" : "descending";
  }

  return (
    <div className="overflow-hidden rounded-xl border" style={{ borderColor: BORDER, backgroundColor: CARD }}>
      <table className="w-full table-fixed border-collapse text-sm">
        <caption className="sr-only">Scheduled posts for {MONTH_LABEL[month]}, sortable</caption>
        <colgroup>
          <col style={{ width: "16%" }} />
          <col style={{ width: "58%" }} />
          <col style={{ width: "26%" }} />
        </colgroup>
        <thead>
          <tr className="border-b" style={{ borderColor: BORDER }}>
            <th scope="col" aria-sort={thSort("day")} className="px-4 py-3 text-left font-normal">
              <button type="button" onClick={() => toggle("day")} className={`flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${MUTED} ${FOCUS_RING}`}>
                Date {sortIcon("day")}
              </button>
            </th>
            <th scope="col" aria-sort={thSort("title")} className="px-4 py-3 text-left font-normal">
              <button type="button" onClick={() => toggle("title")} className={`flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${MUTED} ${FOCUS_RING}`}>
                Title {sortIcon("title")}
              </button>
            </th>
            <th scope="col" aria-sort={thSort("channel")} className="px-4 py-3 text-left font-normal">
              <button type="button" onClick={() => toggle("channel")} className={`flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${MUTED} ${FOCUS_RING}`}>
                Channel {sortIcon("channel")}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className="border-b last:border-0" style={{ borderColor: BORDER }}>
              <td className="whitespace-nowrap px-4 py-3 font-normal tabular-nums" style={{ color: FG }}>
                {fmtDate(p.day, p.month)}
              </td>
              <td className="truncate px-4 py-3 font-normal" style={{ color: FG }}>
                {p.title}
              </td>
              <td className="px-4 py-3">
                <span
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
                  style={{ backgroundColor: "rgba(96,165,250,0.15)", color: ACCENT }}
                >
                  {p.channel}
                </span>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={3} className={`px-4 py-6 text-center text-sm font-normal ${MUTED}`}>
                Nothing scheduled this month.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const NAV = [
  { icon: CalendarDays, label: "Calendar", active: true },
  { icon: FileText, label: "Content", active: false },
  { icon: Users, label: "Contributors", active: false },
  { icon: Settings, label: "Settings", active: false },
];

export default function Page() {
  const [month, setMonth] = useState<MonthKey>("oct");
  const [selectedDay, setSelectedDay] = useState<number | null>(14);

  const dayPosts = useMemo(
    () => POSTS.filter((p) => p.month === month && p.day === selectedDay),
    [month, selectedDay],
  );
  const monthTotal = useMemo(() => countsFor(month).reduce((a, b) => a + b, 0), [month]);
  const sparkId = useId();

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: BG, color: FG }}>
      <aside
        className="hidden w-60 flex-shrink-0 flex-col border-r sm:flex"
        style={{ borderColor: BORDER, backgroundColor: "#0B1120" }}
      >
        <div className="flex items-center gap-2 border-b px-5 py-4" style={{ borderColor: BORDER }}>
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-extrabold"
            style={{ backgroundColor: ACCENT_FILL, color: "#FFFFFF" }}
          >
            R
          </span>
          <div>
            <p className="text-sm font-semibold leading-none">Rundate</p>
            <p className={`mt-1 text-xs font-normal leading-none ${MUTED}`}>Editorial Ops</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((item) => (
            <span
              key={item.label}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold"
              style={item.active ? { backgroundColor: "rgba(96,165,250,0.15)", color: ACCENT } : { color: "#CBD5E1" }}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </span>
          ))}
        </nav>
        <div className="flex items-center gap-2.5 border-t px-4 py-4" style={{ borderColor: BORDER }}>
          <Avatar initials="SR" />
          <div>
            <p className="text-xs font-semibold leading-none">Sam Reyes</p>
            <p className={`mt-1 text-xs font-normal leading-none ${MUTED}`}>Content Lead</p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="flex h-[44px] items-center justify-between border-b px-4 sm:px-6"
          style={{ borderColor: BORDER, backgroundColor: "#0B1120" }}
        >
          <span
            className={`inline-flex items-center gap-2 rounded-lg border px-3 text-xs font-normal ${MUTED}`}
            style={{ borderColor: BORDER, height: 32 }}
          >
            <Search className="h-3.5 w-3.5" />
            Search
            <span className={`ml-2 rounded border px-1 text-[10px] ${MUTED}`} style={{ borderColor: BORDER }}>
              ⌘K
            </span>
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white ${FOCUS_RING}`}
              style={{ backgroundColor: ACCENT_FILL }}
            >
              New post
            </button>
            <Bell className={`h-4 w-4 ${MUTED}`} aria-hidden="true" />
            <Avatar initials="SR" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-[-0.02em]" style={{ fontFamily: "var(--font-display-wide)" }}>
                Publishing calendar
              </h1>
              <p className={`mt-1 text-sm font-normal ${MUTED}`}>{monthTotal} posts published in {MONTH_LABEL[month]}</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border p-1" style={{ borderColor: BORDER }}>
              <button
                type="button"
                disabled={month === "oct"}
                onClick={() => {
                  setMonth("oct");
                  setSelectedDay(null);
                }}
                aria-label="Previous month"
                className={`flex h-7 w-7 items-center justify-center rounded-md disabled:opacity-30 ${FOCUS_RING}`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="w-28 text-center text-xs font-semibold tabular-nums">{MONTH_LABEL[month]}</span>
              <button
                type="button"
                disabled={month === "nov"}
                onClick={() => {
                  setMonth("nov");
                  setSelectedDay(null);
                }}
                aria-label="Next month"
                className={`flex h-7 w-7 items-center justify-center rounded-md disabled:opacity-30 ${FOCUS_RING}`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
            <div className="rounded-xl border p-4" style={{ borderColor: BORDER, backgroundColor: CARD }}>
              <CalendarGrid month={month} selectedDay={selectedDay} onSelectDay={setSelectedDay} />
            </div>
            <div className="rounded-xl border p-4" style={{ borderColor: BORDER, backgroundColor: CARD }} aria-describedby={sparkId}>
              <p className={`text-xs font-semibold uppercase tracking-[0.08em] ${MUTED}`}>Day detail</p>
              <p className="mt-2 text-sm font-semibold">
                {selectedDay ? fmtDate(selectedDay, month) : "No day selected"}
              </p>
              <p id={sparkId} className={`mt-1 text-xs font-normal ${MUTED}`}>
                {dayPosts.length} post{dayPosts.length === 1 ? "" : "s"} scheduled
              </p>
              <ul className="mt-4 space-y-3">
                {dayPosts.length === 0 && (
                  <li className={`text-xs font-normal ${MUTED}`}>Select a day with posts to see it here.</li>
                )}
                {dayPosts.map((p) => (
                  <li key={p.id} className="rounded-lg border p-3" style={{ borderColor: BORDER }}>
                    <p className="text-xs font-semibold leading-snug">{p.title}</p>
                    <span
                      className="mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{ backgroundColor: "rgba(96,165,250,0.15)", color: ACCENT }}
                    >
                      {p.channel}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <h2 className={`text-sm font-semibold uppercase tracking-[0.08em] ${MUTED}`}>
              Scheduled this month
            </h2>
            <div className="mt-3">
              <UpcomingTable month={month} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
