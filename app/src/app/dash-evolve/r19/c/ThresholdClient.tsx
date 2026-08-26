"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CommandPalette from "./CommandPalette";
import ComplianceChart from "./ComplianceChart";
import QueueBreakdown from "./QueueBreakdown";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import TicketsTable from "./TicketsTable";
import type { PeriodDays, QueueId } from "./data";
import { PERIODS, QUEUES, buildDashboardView, formatHours, formatInt, formatMinutes, formatPct, formatSignedPts, periodStats } from "./data";
import { APP_BG, BAD_TEXT, BORDER, GOOD_TEXT, NUM, TEXT_AUX, TEXT_AUX_MUTED, TEXT_PRIMARY, cx } from "./tokens";
import { Bullet, Card, CardHead, Eyebrow, Segmented, TrendMark } from "./ui";

const PERIOD_OPTIONS = PERIODS.map((p) => ({ id: p.id, label: p.label }));

function periodCovering(daysAgo: number): PeriodDays {
  if (daysAgo < 7) return 7;
  if (daysAgo < 30) return 30;
  return 90;
}

function StatRow({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone?: "good" | "bad";
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
      <dt className="min-w-0">
        <span className={cx("block text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>{label}</span>
        <span className={cx("mt-0.5 block text-xs font-normal", TEXT_AUX_MUTED)}>{sub}</span>
      </dt>
      <dd className={cx("shrink-0 text-lg font-semibold", NUM, tone === "bad" ? BAD_TEXT : tone === "good" ? GOOD_TEXT : TEXT_PRIMARY)}>{value}</dd>
    </div>
  );
}

export default function ThresholdClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [queueId, setQueueId] = useState<QueueId>("all");
  const [period, setPeriod] = useState<PeriodDays>(30);
  const [chartIndex, setChartIndex] = useState<number>(29);

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

  const changePeriod = useCallback((next: PeriodDays) => {
    setPeriod(next);
    setChartIndex(next - 1);
  }, []);

  const pickTicket = useCallback((queue: Exclude<QueueId, "all">, daysAgo: number) => {
    const nextPeriod = periodCovering(daysAgo);
    setQueueId(queue);
    setPeriod(nextPeriod);
    setChartIndex(nextPeriod - 1 - daysAgo);
    document.getElementById("tickets-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const view = useMemo(() => buildDashboardView(queueId, period), [queueId, period]);
  const clampedChartIndex = Math.min(view.points.length - 1, Math.max(0, chartIndex));

  const breakdownRows = useMemo(() => QUEUES.map((q) => ({ queue: q, stats: periodStats(q.id, period) })), [period]);

  const breachShare = view.stats.resolved > 0 ? (view.stats.breaches / view.stats.resolved) * 100 : 0;
  const periodLabel = PERIODS.find((p) => p.id === period)?.full ?? `${period} days`;

  return (
    <div className={cx("flex min-h-dvh", APP_BG, TEXT_PRIMARY)}>
      {/* The host document's own background follows the OS colour scheme; this route is
          committed to a genuine light surface, so a fixed ground behind the shell keeps
          overscroll and any sub-viewport gap from flashing dark. */}
      <div aria-hidden="true" className={cx("pointer-events-none fixed inset-0 -z-10", APP_BG)} />
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          {/* -------------------------------------------------------------------- page header */}
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <Eyebrow>{`Support SLA · ${view.queue.full} · ${periodLabel.toLowerCase()}`}</Eyebrow>
              <h1 className={cx("mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]", TEXT_PRIMARY)}>Support SLA</h1>
              <p className={cx("mt-1.5 max-w-2xl text-sm font-normal leading-relaxed", TEXT_AUX_MUTED)}>
                Every resolved ticket counts toward one number: closed inside its SLA window, or not. Focus a tier in the breakdown to recompute this entire page for it.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Segmented options={PERIOD_OPTIONS} value={period} onChange={changePeriod} ariaLabel="Reporting window" />
            </div>
          </div>

          {/* ---------------------------------------------------------------------- hero row */}
          <div className="mt-4 grid grid-cols-12 gap-4">
            <div className="col-span-12 min-w-0 xl:col-span-8">
              <Card id="hero-card" className="flex min-w-0 flex-col">
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div className="min-w-0">
                    <Eyebrow>{`SLA compliance · ${view.queue.full}`}</Eyebrow>
                    <p
                      className={cx("mt-1 leading-[0.95] font-semibold tracking-tight", NUM, TEXT_PRIMARY)}
                      style={{ fontFamily: "var(--font-display-wide)", fontSize: "clamp(2.75rem, 5vw + 1rem, 4.5rem)" }}
                    >
                      {formatPct(view.stats.rate)}
                    </p>
                    <p className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                      <span className={cx("inline-flex items-center gap-1 font-semibold", NUM, TEXT_PRIMARY)}>
                        <TrendMark pts={view.stats.deltaPts} size={13} />
                        {formatSignedPts(view.stats.deltaPts)}
                      </span>
                      <span className={cx("font-normal", TEXT_AUX_MUTED)}>{`vs the prior ${period}-day window (${formatPct(view.stats.prevRate)})`}</span>
                    </p>
                  </div>

                  <div className="w-full max-w-[15rem] shrink-0 sm:w-56">
                    <Eyebrow>vs target</Eyebrow>
                    <div className="mt-1.5">
                      <Bullet value={view.stats.rate} target={view.stats.target} good={view.stats.aboveTarget} label={`${view.queue.full} compliance`} />
                    </div>
                  </div>
                </div>

                <div className={cx("mt-5 border-t pt-4", BORDER)}>
                  <ComplianceChart points={view.points} target={view.stats.target} activeIndex={clampedChartIndex} onActiveIndexChange={setChartIndex} queueLabel={view.queue.full} />
                </div>
              </Card>
            </div>

            <div className="col-span-12 min-w-0 xl:col-span-4">
              <Card className="flex h-full min-w-0 flex-col">
                <CardHead title="At a glance" hint={`Every figure below is drawn from the same ${period}-day window as the headline number.`} />
                <dl className="mt-1 flex flex-1 flex-col divide-y divide-zinc-100">
                  <StatRow label="Tickets resolved" value={formatInt(view.stats.resolved)} sub={`${formatInt(view.stats.met)} met their SLA`} />
                  <StatRow
                    label="SLA breaches"
                    value={formatInt(view.stats.breaches)}
                    sub={`${formatPct(breachShare)} of resolved tickets`}
                    tone={view.stats.breaches > 0 ? "bad" : "good"}
                  />
                  <StatRow label="Median first response" value={formatMinutes(view.times.firstResponseMin)} sub="time to first agent reply" />
                  <StatRow label="Median resolution" value={formatHours(view.times.resolutionHrs)} sub="time to ticket close" />
                </dl>
              </Card>
            </div>
          </div>

          {/* --------------------------------------------------------------- breakdown + tickets */}
          <div className="mt-4 grid grid-cols-12 gap-4">
            <div className="col-span-12 min-w-0 xl:col-span-5">
              <QueueBreakdown rows={breakdownRows} selectedId={queueId} onSelect={setQueueId} />
            </div>
            <div className="col-span-12 min-w-0 xl:col-span-7">
              <TicketsTable tickets={view.tickets} ticketsTotal={view.ticketsTotal} queueLabel={view.queue.full} />
            </div>
          </div>

          <p aria-live="polite" className="sr-only">
            {`Now focused on ${view.queue.full}, ${periodLabel.toLowerCase()}. ${formatPct(view.stats.rate)} SLA compliance, ${formatInt(view.stats.breaches)} breaches.`}
          </p>
        </main>
      </div>

      {paletteOpen ? (
        <CommandPalette onClose={() => setPaletteOpen(false)} onQueue={setQueueId} onPeriod={changePeriod} onTicket={pickTicket} />
      ) : null}
    </div>
  );
}
