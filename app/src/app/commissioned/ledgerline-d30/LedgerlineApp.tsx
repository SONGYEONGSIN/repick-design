"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowDownLeft, ArrowLeftRight, ArrowUp, ArrowUpRight, Wallet } from "lucide-react";

import {
  BASELINE,
  UI,
  accountOf,
  bucketsOf,
  formatDelta,
  formatMoney,
  formatNet,
  periodOf,
  totalsOf,
  txnsFor,
  type AccountId,
  type Lang,
  type PeriodId,
  type StreamFilter,
} from "./data";
import { Panel, SHELL, Segmented, cn, scheduledFor, sumCents } from "./ui";
import { Sidebar } from "./sidebar";
import { CommandPalette, Topbar } from "./topbar";
import { FlowChart } from "./flow-chart";
import { BreakdownPanel } from "./accounts-panel";
import { StreamFeed } from "./StreamFeed";

/* --------------------------------------------------------------- kpi card */

function KpiCard({
  label,
  value,
  chip,
  chipDirection,
  chipTone,
  note,
  icon: Icon,
}: {
  label: string;
  value: string;
  chip: string;
  chipDirection: "up" | "down";
  chipTone: "calm" | "alert";
  note: string;
  icon: typeof Wallet;
}) {
  const ChipIcon = chipDirection === "down" ? ArrowDown : ArrowUp;
  return (
    <article className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-zinc-200 bg-white p-4">
      <div className="flex min-w-0 items-center justify-between gap-2">
        <p className="min-w-0 truncate text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-600">
          {label}
        </p>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p
        className="truncate text-[26px] font-semibold leading-none tracking-tight text-zinc-900 tabular-nums"
        style={{ fontFamily: "var(--font-display-mono)" }}
      >
        {value}
      </p>
      <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums",
            chipTone === "alert" ? "bg-rose-50 text-rose-700" : "bg-zinc-100 text-zinc-700",
          )}
        >
          <ChipIcon className="h-3 w-3" aria-hidden="true" />
          {chip}
        </span>
        <span className="min-w-0 truncate text-[11px] text-zinc-600">{note}</span>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------- dashboard */

export default function LedgerlineApp() {
  const [lang, setLang] = useState<Lang>("en");
  const [accountId, setAccountId] = useState<AccountId>("operating");
  const [periodId, setPeriodId] = useState<PeriodId>("30d");
  const [flow, setFlow] = useState<StreamFilter>("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((value) => !value);
        return;
      }
      if (event.key === "Escape") {
        setPaletteOpen(false);
        setMenuOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const account = accountOf(accountId);
  const period = periodOf(periodId);
  const rows = useMemo(() => txnsFor(accountId, periodId), [accountId, periodId]);
  const buckets = useMemo(() => bucketsOf(rows, periodId), [rows, periodId]);
  const visible = useMemo(
    () => (flow === "all" ? rows : rows.filter((row) => row.dir === flow)),
    [rows, flow],
  );

  const totals = totalsOf(rows);
  const baseline = BASELINE[accountId][periodId];
  const previousNet = baseline.in - baseline.out;
  const netChange = totals.netCents - previousNet;
  const upcomingTotal = sumCents(scheduledFor(accountId));

  const versusNote = `${UI.versus[lang]} · ${period.label[lang]}`;
  const flowOptions: readonly { id: StreamFilter; label: string }[] = [
    { id: "all", label: UI.filterAll[lang] },
    { id: "in", label: UI.filterIn[lang] },
    { id: "out", label: UI.filterOut[lang] },
  ];
  const flowLabel = flowOptions.find((option) => option.id === flow)?.label ?? UI.filterAll[lang];

  return (
    <div lang={lang} className="min-h-dvh bg-zinc-50 text-zinc-900">
      <div className="flex min-h-dvh w-full items-start">
        <Sidebar
          lang={lang}
          account={accountId}
          onAccount={setAccountId}
          mobileOpen={menuOpen}
          onCloseMobile={() => setMenuOpen(false)}
        />

        <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
          <Topbar
            lang={lang}
            onLang={setLang}
            period={periodId}
            onPeriod={setPeriodId}
            accountLabel={`${account.name[lang]} ${account.last4}`}
            onOpenMenu={() => setMenuOpen(true)}
            onOpenSearch={() => setPaletteOpen(true)}
          />

          <main className="relative min-w-0 flex-1 px-4 py-5 sm:px-5 sm:py-6 lg:px-6">
            <div className="flex min-w-0 flex-wrap items-end justify-between gap-x-4 gap-y-2">
              <div className="min-w-0">
                <h1
                  className="text-2xl font-semibold tracking-tight text-zinc-900"
                  style={{ fontFamily: "var(--font-display-mono)" }}
                >
                  {UI.pageTitle[lang]}
                </h1>
                <p className="mt-1 min-w-0 text-[13px] text-zinc-600">
                  {account.name[lang]} · {account.kind[lang]} {account.last4} · {period.label[lang]}
                </p>
              </div>
              <p className="shrink-0 text-[11px] text-zinc-600 tabular-nums">{SHELL.asOf[lang]}</p>
            </div>

            <section className="mt-5 min-w-0">
              <h2 className="sr-only font-medium">{SHELL.keyFigures[lang]}</h2>
              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard
                  label={UI.moneyIn[lang]}
                  value={formatMoney(totals.inCents)}
                  chip={formatDelta(totals.inCents, baseline.in, lang)}
                  chipDirection={totals.inCents >= baseline.in ? "up" : "down"}
                  chipTone={totals.inCents >= baseline.in ? "calm" : "alert"}
                  note={versusNote}
                  icon={ArrowDownLeft}
                />
                <KpiCard
                  label={UI.moneyOut[lang]}
                  value={formatMoney(totals.outCents)}
                  chip={formatDelta(totals.outCents, baseline.out, lang)}
                  chipDirection={totals.outCents >= baseline.out ? "up" : "down"}
                  chipTone={totals.outCents > baseline.out ? "alert" : "calm"}
                  note={versusNote}
                  icon={ArrowUpRight}
                />
                <KpiCard
                  label={UI.net[lang]}
                  value={formatNet(totals.netCents)}
                  chip={formatNet(netChange)}
                  chipDirection={netChange >= 0 ? "up" : "down"}
                  chipTone={totals.netCents < 0 ? "alert" : "calm"}
                  note={SHELL.netNote[lang]}
                  icon={ArrowLeftRight}
                />
                <KpiCard
                  label={UI.balance[lang]}
                  value={formatMoney(account.balance)}
                  chip={`-${formatMoney(upcomingTotal)}`}
                  chipDirection="down"
                  chipTone="calm"
                  note={SHELL.balanceNote[lang]}
                  icon={Wallet}
                />
              </div>
            </section>

            <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-12">
              <Panel
                title={UI.chartTitle[lang]}
                meta={`${account.name[lang]} · ${period.label[lang]}`}
                className="lg:col-span-8"
              >
                <FlowChart buckets={buckets} lang={lang} flow={flow} />
              </Panel>
              <Panel
                title={flow === "in" ? UI.cameFrom[lang] : UI.wentTo[lang]}
                meta={`${flowLabel} · ${period.label[lang]}`}
                className="lg:col-span-4"
              >
                <BreakdownPanel rows={rows} flow={flow} lang={lang} accountId={accountId} />
              </Panel>
            </div>

            <div className="mt-4 min-w-0">
              <Panel
                title={UI.streamTitle[lang]}
                meta={`${SHELL.showing[lang]} ${visible.length} ${UI.count[lang]} · ${UI.streamNote[lang]}`}
                bodyClassName="p-0 sm:p-0"
                action={
                  <Segmented
                    label={UI.filterGroup[lang]}
                    value={flow}
                    options={flowOptions}
                    onChange={setFlow}
                    size="sm"
                  />
                }
              >
                <StreamFeed
                  rows={visible}
                  lang={lang}
                  caption={`${SHELL.tableCaption[lang]} ${account.name[lang]} · ${period.label[lang]} · ${flowLabel}`}
                />
              </Panel>
            </div>

            <p className="mt-6 border-t border-zinc-200 pt-4 text-[11px] text-zinc-600">
              {SHELL.footer[lang]}
            </p>
          </main>
        </div>
      </div>

      {paletteOpen ? (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          lang={lang}
          onAccount={setAccountId}
          onPeriod={setPeriodId}
          onLang={setLang}
        />
      ) : null}
    </div>
  );
}
