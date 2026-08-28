"use client";

import { AlertTriangle, Inbox, Star, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import CommandPalette from "./CommandPalette";
import SlaHeatGrid, { type Period } from "./SlaHeatGrid";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import TicketTable from "./TicketTable";
import TriageBoard from "./TriageBoard";
import { AVG_CSAT, AVG_RESOLUTION_HOURS, BREACHING_COUNT, OPEN_COUNT, OPEN_TREND, formatHours, formatInt, formatPct } from "./data";
import { APP_BG, BORDER, NUM, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, type Priority, cx } from "./tokens";
import { Card, CardHead, Eyebrow, Segmented, Sparkline } from "./ui";

const PERIOD_OPTIONS: { id: Period; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "7d", label: "7D" },
  { id: "30d", label: "30D" },
];

export default function MeridianClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("7d");
  const [query, setQuery] = useState("");
  const [activePriorities, setActivePriorities] = useState<Priority[]>([]);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function togglePriority(p: Priority) {
    setActivePriorities((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));
  }

  return (
    <div className={cx("flex min-h-dvh overflow-x-hidden", APP_BG, TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <Eyebrow>{`Support ops · ${formatInt(OPEN_COUNT)} open tickets`}</Eyebrow>
              <h1 className={cx("mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]", TEXT_PRIMARY)}>Triage board</h1>
              <p className={cx("mt-1.5 max-w-2xl text-sm font-normal leading-relaxed", TEXT_AUX)}>
                The board on the left is the desk&rsquo;s live queue; the SLA heat grid on the right is scoped only by its own time window — filtering the board never touches it.
              </p>
            </div>
          </div>

          <h2 className="sr-only font-medium">Operations summary</h2>
          <dl className="mt-4 grid grid-cols-12 gap-3">
            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Open tickets</dt>
              <dd className="mt-1.5">
                <span className="flex items-end justify-between gap-2">
                  <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                    <Inbox size={17} aria-hidden="true" className={TEXT_AUX} />
                    {formatInt(OPEN_COUNT)}
                  </span>
                  <Sparkline values={OPEN_TREND} />
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_MUTED)}>7-day trend, right-most is today</span>
              </dd>
            </div>

            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BREACHING_COUNT > 0 ? "border-rose-200 bg-rose-50" : cx(BORDER, SURFACE_INSET))}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", BREACHING_COUNT > 0 ? "text-rose-700" : TEXT_MUTED)}>Breaching SLA</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <AlertTriangle size={17} aria-hidden="true" className={BREACHING_COUNT > 0 ? "text-rose-600" : TEXT_AUX} />
                  {formatInt(BREACHING_COUNT)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", BREACHING_COUNT > 0 ? "text-rose-700" : TEXT_MUTED)}>at or above 90% of budget</span>
              </dd>
            </div>

            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Avg resolution</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <Timer size={17} aria-hidden="true" className={TEXT_AUX} />
                  {formatHours(AVG_RESOLUTION_HOURS)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_MUTED)}>across the last 6 closed tickets</span>
              </dd>
            </div>

            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Avg CSAT</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <Star size={17} aria-hidden="true" className={TEXT_AUX} />
                  {formatPct(AVG_CSAT)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_MUTED)}>post-resolution survey</span>
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-start">
            <div className="min-w-0 flex-1">
              <TriageBoard query={query} onQueryChange={setQuery} activePriorities={activePriorities} onTogglePriority={togglePriority} highlightedId={highlightedId} />
            </div>

            <div className="xl:w-[300px] xl:shrink-0">
              <Card>
                <CardHead
                  title="SLA heat"
                  hint="Open tickets by priority and age — every cell prints its own count."
                  action={<Segmented options={PERIOD_OPTIONS} value={period} onChange={setPeriod} ariaLabel="SLA window" />}
                />
                <div className="mt-3">
                  <SlaHeatGrid period={period} />
                </div>
              </Card>
            </div>
          </div>

          <div className="mt-4">
            <Card>
              <TicketTable />
            </Card>
          </div>
        </main>
      </div>

      {paletteOpen ? (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onSelectTicket={(id) => {
            setHighlightedId(id);
            setQuery("");
            setActivePriorities([]);
          }}
        />
      ) : null}
    </div>
  );
}
