"use client";

import { useEffect, useState } from "react";
import {
  AudioLines,
  Bell,
  ChevronsUpDown,
  FileBarChart2,
  Gauge,
  Inbox,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Tags,
  Users,
  X,
} from "lucide-react";
import CommandPalette from "./command-palette";
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  CURRENT_USER,
  DEFAULT_PINNED_ID,
  DEFAULT_TERM_ID,
  KPI_GOOD_DIRECTION,
  NAV_SECTIONS,
  OVERALL_TREND,
  PERIODS,
  PERIOD_KPIS,
  WORKSPACES,
  type Period,
} from "./data";
import FeedbackFeed from "./feedback-feed";
import { formatCoveragePct, formatHours, formatSignedScore } from "./format";
import NewTicketDrawer from "./new-ticket-drawer";
import PinnedTicket from "./pinned-ticket";
import TermDetail from "./term-detail";
import ThemeRankList from "./theme-rank-list";
import { Avatar, Card, DeltaIndicator, FOCUS_RING, SegmentedControl, Sparkline } from "./ui";
import WordCloud from "./word-cloud";

const NAV_ICONS = { Gauge, Inbox, Tags, Users, FileBarChart2 } as const;

function BrandLockup() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
        <AudioLines className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="truncate font-semibold text-lg leading-tight text-zinc-900">{BRAND_NAME}</p>
        <p className="truncate font-normal text-xs text-zinc-500">{BRAND_TAGLINE}</p>
      </div>
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <ul className="space-y-1">
      {NAV_SECTIONS.map((item) => {
        const Icon = NAV_ICONS[item.icon];
        return (
          <li key={item.label}>
            <button
              type="button"
              aria-current={item.active ? "page" : undefined}
              onClick={onNavigate}
              className={`flex h-10 w-full items-center gap-2.5 rounded-lg px-3 font-medium text-sm motion-safe:transition-colors ${FOCUS_RING} ${
                item.active ? "bg-rose-50 text-rose-700" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function KpiCard({
  label,
  value,
  delta,
  deltaDigits = 0,
  goodDirection,
}: {
  label: string;
  value: string;
  delta: number;
  deltaDigits?: number;
  goodDirection: "up" | "down";
}) {
  return (
    <Card className="col-span-12 min-w-0 p-4 sm:col-span-6 xl:col-span-3">
      <p className="font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">{label}</p>
      <div className="mt-1.5 flex items-baseline justify-between gap-2">
        <p className="truncate font-semibold tabular-nums text-2xl text-zinc-900">{value}</p>
        <DeltaIndicator delta={delta} goodDirection={goodDirection} digits={deltaDigits} />
      </div>
    </Card>
  );
}

export default function UndertoneConsole() {
  const [selectedTermId, setSelectedTermId] = useState(DEFAULT_TERM_ID);
  const [pinnedId, setPinnedId] = useState(DEFAULT_PINNED_ID);
  const [period, setPeriod] = useState<Period>("30d");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [workspaceIndex, setWorkspaceIndex] = useState(0);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const kpis = PERIOD_KPIS[period];
  const periodLabel = PERIODS.find((p) => p.value === period)?.label ?? period;

  return (
    <div className="flex min-h-screen bg-zinc-50 font-normal text-zinc-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-rose-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-200 bg-white p-4 lg:flex">
        <BrandLockup />
        <button
          type="button"
          onClick={() => setWorkspaceIndex((i) => (i + 1) % WORKSPACES.length)}
          className={`mt-4 flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-zinc-200 px-3 font-medium text-xs text-zinc-600 hover:text-zinc-900 ${FOCUS_RING}`}
        >
          <span className="truncate">{WORKSPACES[workspaceIndex]}</span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        </button>
        <nav aria-label="Primary" className="mt-6 flex-1">
          <NavList />
        </nav>
        <div className="border-t border-zinc-200 pt-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <Avatar initials={CURRENT_USER.initials} className="h-8 w-8 text-xs" />
            <div className="min-w-0">
              <p className="truncate font-medium text-sm text-zinc-900">{CURRENT_USER.name}</p>
              <p className="truncate font-normal text-xs text-zinc-500">{CURRENT_USER.email}</p>
            </div>
          </div>
          <button type="button" className={`mt-1 flex h-9 w-full items-center gap-2.5 rounded-lg px-2 font-normal text-xs text-zinc-500 hover:text-zinc-900 ${FOCUS_RING}`}>
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div aria-hidden="true" onClick={() => setMobileNavOpen(false)} className="absolute inset-0 bg-zinc-900/30" />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-zinc-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <BrandLockup />
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation menu"
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-900 ${FOCUS_RING}`}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Primary" className="mt-6 flex-1">
              <NavList onNavigate={() => setMobileNavOpen(false)} />
            </nav>
            <div className="border-t border-zinc-200 pt-3">
              <p className="truncate px-2 font-medium text-sm text-zinc-900">{CURRENT_USER.name}</p>
              <p className="truncate px-2 font-normal text-xs text-zinc-500">{CURRENT_USER.email}</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-20 items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-900 lg:hidden ${FOCUS_RING}`}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className={`flex h-11 items-center gap-2 rounded-lg border border-zinc-200 px-3 font-normal text-sm text-zinc-500 hover:text-zinc-900 ${FOCUS_RING}`}
            >
              <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Search themes or tickets</span>
              <span className="hidden rounded border border-zinc-200 px-1.5 py-0.5 font-normal text-xs text-zinc-500 sm:inline">&#8984;K</span>
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setNewTicketOpen(true)}
              className={`flex h-11 items-center gap-2 rounded-lg bg-rose-700 px-3 font-medium text-sm text-white hover:bg-rose-800 ${FOCUS_RING}`}
            >
              <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Log ticket</span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                aria-expanded={notifOpen}
                aria-label="Notifications"
                className={`flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-900 ${FOCUS_RING}`}
              >
                <Bell className="h-4 w-4 shrink-0" aria-hidden="true" />
              </button>
              {notifOpen ? (
                <div className="absolute right-0 top-full z-40 mt-2 w-72 rounded-lg border border-zinc-200 bg-white p-2 shadow-xl">
                  <p className="px-2 py-1 font-medium text-xs text-zinc-500">Notifications</p>
                  <p className="rounded-md px-2 py-2 font-normal text-sm text-zinc-700">
                    &ldquo;Shipping delay&rdquo; mentions crossed 180 for the first time this quarter.
                  </p>
                  <p className="rounded-md px-2 py-2 font-normal text-sm text-zinc-700">
                    Ticket tk-1030 was escalated after a second reply with no resolution.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setAvatarMenuOpen((o) => !o)}
                aria-expanded={avatarMenuOpen}
                aria-label={`${CURRENT_USER.initials}, account menu for ${CURRENT_USER.name}`}
                className={`flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 font-medium text-xs text-zinc-700 hover:bg-zinc-200 ${FOCUS_RING}`}
              >
                <span aria-hidden="true">{CURRENT_USER.initials}</span>
              </button>
              {avatarMenuOpen ? (
                <div className="absolute right-0 top-full z-40 mt-2 w-56 rounded-lg border border-zinc-200 bg-white p-2 shadow-xl">
                  <p className="truncate px-2 py-1 font-medium text-sm text-zinc-900">{CURRENT_USER.name}</p>
                  <p className="truncate px-2 pb-2 font-normal text-xs text-zinc-500">{CURRENT_USER.email}</p>
                  <button type="button" className={`flex h-9 w-full items-center gap-2.5 rounded-md px-2 font-normal text-sm text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}>
                    <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Settings
                  </button>
                  <button type="button" className={`flex h-9 w-full items-center gap-2.5 rounded-md px-2 font-normal text-sm text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}>
                    <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main id="main-content" className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="font-semibold text-2xl text-zinc-900">Overview</h1>
              <p className="mt-1 max-w-2xl font-normal text-sm text-zinc-600">
                Every theme stays ranked by exact mention count and sentiment at a glance — the word cloud is a visual
                index into that same list, never the only place the numbers live.
              </p>
            </div>
            <SegmentedControl<Period> label="Reporting period" options={PERIODS} value={period} onChange={setPeriod} />
          </div>

          <div className="mt-6 grid grid-cols-12 gap-4 md:gap-6">
            <KpiCard label="Open tickets" value={kpis.openTickets.toLocaleString("en-US")} delta={kpis.openDelta} goodDirection={KPI_GOOD_DIRECTION.openTickets} />
            <KpiCard label="Net sentiment score" value={formatSignedScore(kpis.netSentiment)} delta={kpis.sentimentDelta} goodDirection={KPI_GOOD_DIRECTION.netSentiment} />
            <KpiCard
              label="Median first response"
              value={formatHours(kpis.firstResponseHrs)}
              delta={kpis.responseDelta}
              deltaDigits={1}
              goodDirection={KPI_GOOD_DIRECTION.firstResponseHrs}
            />
            <KpiCard
              label="Theme coverage"
              value={formatCoveragePct(kpis.themeCoverage)}
              delta={Math.round(kpis.coverageDelta * 100)}
              goodDirection={KPI_GOOD_DIRECTION.themeCoverage}
            />

            <Card className="col-span-12 min-w-0 p-4 sm:p-6 lg:col-span-7" as="section" aria-labelledby="themes-heading">
              <div className="flex items-baseline justify-between gap-3">
                <h2 id="themes-heading" className="font-semibold text-sm text-zinc-900">
                  Theme intelligence
                </h2>
                <span className="font-normal text-xs text-zinc-500">{periodLabel}</span>
              </div>
              <p className="mt-0.5 font-normal text-xs text-zinc-500">
                Hover or focus a term for its exact count — every term is already ranked below with its count, share, and
                sentiment, so nothing here is hover-only.
              </p>
              <div className="mt-3">
                <WordCloud selectedTermId={selectedTermId} onSelectTerm={setSelectedTermId} />
              </div>
              <h3 className="mt-5 font-semibold text-xs uppercase tracking-[0.06em] text-zinc-500">Ranked themes</h3>
              <div className="mt-2">
                <ThemeRankList selectedTermId={selectedTermId} onSelectTerm={setSelectedTermId} />
              </div>
            </Card>

            <div className="col-span-12 flex min-w-0 flex-col gap-4 md:gap-6 lg:col-span-5">
              <Card className="min-w-0 p-4 sm:p-6" as="section" aria-labelledby="term-detail-heading">
                <h2 id="term-detail-heading" className="font-semibold text-sm text-zinc-900">
                  Selected theme detail
                </h2>
                <div className="mt-3">
                  <TermDetail selectedTermId={selectedTermId} period={period} />
                </div>
              </Card>

              <Card className="min-w-0 p-4 sm:p-6" as="section" aria-labelledby="pinned-heading">
                <h2 id="pinned-heading" className="font-semibold text-sm text-zinc-900">
                  Pinned ticket
                </h2>
                <div className="mt-3">
                  <PinnedTicket pinnedId={pinnedId} />
                </div>
              </Card>

              <Card className="min-w-0 p-4 sm:p-6" as="section" aria-labelledby="trend-heading">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 id="trend-heading" className="font-semibold text-sm text-zinc-900">
                    Overall sentiment trend
                  </h2>
                  <span className="font-normal text-xs text-zinc-500">{periodLabel}</span>
                </div>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-semibold tabular-nums text-2xl text-zinc-900">{formatSignedScore(kpis.netSentiment)}</p>
                    <p className="mt-0.5 font-normal text-xs text-zinc-500">across every theme, all tickets</p>
                  </div>
                  <Sparkline values={OVERALL_TREND[period]} stroke="stroke-rose-700" />
                </div>
              </Card>
            </div>

            <Card className="col-span-12 min-w-0 p-4 sm:p-6" as="section" aria-labelledby="feed-heading">
              <div className="flex items-baseline justify-between gap-3">
                <h2 id="feed-heading" className="font-semibold text-sm text-zinc-900">
                  Feedback feed
                </h2>
                <span className="font-normal text-xs text-zinc-500">Pin any ticket to load it into the panel above</span>
              </div>
              <div className="mt-3">
                <FeedbackFeed pinnedId={pinnedId} onPin={setPinnedId} selectedTermId={selectedTermId} />
              </div>
            </Card>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSelectTerm={setSelectedTermId} onPin={setPinnedId} />
      <NewTicketDrawer open={newTicketOpen} onClose={() => setNewTicketOpen(false)} />
    </div>
  );
}
