"use client";

import { AlertTriangle, CalendarClock, HeartPulse } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AccountDetailPanel from "./AccountDetailPanel";
import AccountsTable from "./AccountsTable";
import CommandPalette from "./CommandPalette";
import HealthScatter from "./HealthScatter";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import {
  RANGES,
  TODAY_ISO,
  daysBetween,
  formatUsd,
  heroSeries,
  snapshotFor,
  type RangeId,
} from "./data";
import { BORDER, TEXT_CAPTION, TEXT_PRIMARY, cx, type QuadrantId } from "./tokens";
import { Card, EyebrowLabel, SegmentedControl, Sparkline } from "./ui";

const RENEWAL_WINDOW_DAYS = 60;
const DEFAULT_SELECTED_ID = "locksley";

export default function QuorumClient() {
  const [range, setRange] = useState<RangeId>("quarter");
  const [selectedId, setSelectedId] = useState<string | null>(DEFAULT_SELECTED_ID);
  const [quadrantFilter, setQuadrantFilter] = useState<QuadrantId | null>(null);
  const [focusToken, setFocusToken] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const accounts = useMemo(() => snapshotFor(range), [range]);
  const selectedAccount = useMemo(() => accounts.find((a) => a.id === selectedId) ?? null, [accounts, selectedId]);

  const atRiskAccounts = useMemo(() => accounts.filter((a) => a.quadrant === "at_risk"), [accounts]);
  const atRiskArr = useMemo(() => atRiskAccounts.reduce((sum, a) => sum + a.arr, 0), [atRiskAccounts]);
  const totalArr = useMemo(() => accounts.reduce((sum, a) => sum + a.arr, 0), [accounts]);
  const avgHealth = useMemo(() => accounts.reduce((sum, a) => sum + a.health, 0) / accounts.length, [accounts]);
  const renewalsSoon = useMemo(
    () => accounts.filter((a) => {
      const d = daysBetween(TODAY_ISO, a.renewalIso);
      return d >= 0 && d <= RENEWAL_WINDOW_DAYS;
    }).length,
    [accounts],
  );

  const heroTrend = useMemo(() => heroSeries(range, atRiskArr), [range, atRiskArr]);
  const rangeLabel = RANGES.find((r) => r.id === range)!.label;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function selectAccount(id: string) {
    setSelectedId(id);
  }

  function selectFromPalette(id: string) {
    setSelectedId(id);
    setFocusToken((v) => v + 1);
  }

  function toggleQuadrant(q: QuadrantId) {
    setQuadrantFilter((cur) => (cur === q ? null : q));
  }

  return (
    <div className={cx("flex h-dvh min-h-dvh overflow-hidden", "bg-zinc-50", TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="mx-auto flex max-w-[1680px] flex-col gap-4 p-4 sm:p-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className={cx("text-xl font-semibold tracking-tight sm:text-2xl", TEXT_PRIMARY)}>Renewal Health Console</h1>
                <p className={cx("mt-0.5 text-sm", TEXT_CAPTION)}>Enterprise Pod · {accounts.length} accounts · {formatUsd(totalArr)} total ARR</p>
              </div>
            </header>

            <HeroCard
              atRiskArr={atRiskArr}
              totalArr={totalArr}
              avgHealth={avgHealth}
              atRiskCount={atRiskAccounts.length}
              renewalsSoon={renewalsSoon}
              trendValues={heroTrend.map((p) => p.value)}
              range={range}
              onRangeChange={setRange}
              rangeLabel={rangeLabel}
            />

            <Card className="min-w-0" padded={false}>
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
                <div className="min-w-0">
                  <h2 id="scatter-heading" className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>
                    Health score × ARR quadrant map
                  </h2>
                  <p className={cx("mt-0.5 text-xs", TEXT_CAPTION)}>
                    Each point is an account · hover or focus for detail · click a point to inspect it below · click a quadrant label to filter the account
                    table
                  </p>
                </div>
              </div>
              <div className={cx("border-t p-3 sm:p-4", BORDER)} aria-labelledby="scatter-heading">
                <HealthScatter
                  accounts={accounts}
                  selectedId={selectedId}
                  onSelect={selectAccount}
                  quadrantFilter={quadrantFilter}
                  onToggleQuadrant={toggleQuadrant}
                  focusToken={focusToken}
                  rangeLabel={rangeLabel}
                />
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 xl:items-stretch">
              <div className="min-w-0 xl:col-span-7 xl:h-[620px]">
                <AccountsTable
                  accounts={accounts}
                  selectedId={selectedId}
                  onSelect={selectAccount}
                  quadrantFilter={quadrantFilter}
                  onClearQuadrant={() => setQuadrantFilter(null)}
                />
              </div>
              <div className="min-w-0 xl:col-span-5 xl:h-[620px]">
                <AccountDetailPanel account={selectedAccount} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette accounts={accounts} onClose={() => setPaletteOpen(false)} onSelectAccount={selectFromPalette} /> : null}
    </div>
  );
}

/* ------------------------------------------------------------- Hero zone */

function HeroCard({
  atRiskArr,
  totalArr,
  avgHealth,
  atRiskCount,
  renewalsSoon,
  trendValues,
  range,
  onRangeChange,
  rangeLabel,
}: {
  atRiskArr: number;
  totalArr: number;
  avgHealth: number;
  atRiskCount: number;
  renewalsSoon: number;
  trendValues: number[];
  range: RangeId;
  onRangeChange: (r: RangeId) => void;
  rangeLabel: string;
}) {
  const atRiskSharePct = totalArr > 0 ? (atRiskArr / totalArr) * 100 : 0;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-wrap items-end gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <HeartPulse size={13} aria-hidden="true" className="text-rose-600" />
              <EyebrowLabel>At-risk ARR · {rangeLabel}</EyebrowLabel>
            </div>
            <div className="mt-1 flex items-baseline gap-2.5">
              <span className={cx("text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl", TEXT_PRIMARY)}>{formatUsd(atRiskArr)}</span>
              <span className={cx("text-sm tabular-nums", TEXT_CAPTION)}>{atRiskSharePct.toFixed(1)}% of {formatUsd(totalArr)} total ARR</span>
            </div>
          </div>
          <div className="h-11 w-32 shrink-0 sm:w-40" aria-hidden="true">
            <Sparkline values={trendValues} stroke="stroke-rose-600" fill="fill-rose-500" />
          </div>
        </div>

        <SegmentedControl ariaLabel="Time range" options={RANGES} value={range} onChange={onRangeChange} />
      </div>

      <div className={cx("mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 border-t pt-4", BORDER)}>
        <SubStat icon={AlertTriangle} label="Accounts at risk" value={String(atRiskCount)} valueClass="text-rose-700" />
        <Divider />
        <SubStat icon={CalendarClock} label={`Renewals ≤ ${RENEWAL_WINDOW_DAYS}d`} value={String(renewalsSoon)} />
        <Divider />
        <SubStat icon={HeartPulse} label="Avg. health score" value={avgHealth.toFixed(0)} />
      </div>
    </Card>
  );
}

function Divider() {
  return <span aria-hidden="true" className="hidden h-8 w-px bg-zinc-200 sm:block" />;
}

function SubStat({
  icon: Icon,
  label,
  value,
  valueClass,
}: {
  icon: typeof AlertTriangle;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <Icon size={12} aria-hidden="true" className={TEXT_CAPTION} />
        <EyebrowLabel>{label}</EyebrowLabel>
      </div>
      <p className={cx("mt-0.5 truncate text-xl font-semibold tabular-nums", valueClass ?? TEXT_PRIMARY)}>{value}</p>
    </div>
  );
}
