"use client";

import { AlertTriangle, PieChart, Receipt, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import CommandPalette from "./CommandPalette";
import LedgerFeed from "./LedgerFeed";
import { PinnedAccountRollup, PlatformHealthCard } from "./LeftRail";
import RevenueBreakdown from "./RevenueBreakdown";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { EVENTS, formatPct, formatUSD, PERIOD_KPI, PERIOD_OPTIONS, type PeriodId } from "./data";
import { APP_BG, BORDER, NUM, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, cx } from "./tokens";
import { Card, CardHead, Eyebrow, Segmented } from "./ui";

export default function LedgerlineClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [period, setPeriod] = useState<PeriodId>("7d");
  // Selection→multi-widget sync, scoped narrowly: pinning a ledger row updates only
  // PinnedAccountRollup in the left rail. It is a *different* mechanism from the
  // sunburst's own hover/click split below, and from this period toggle here — three
  // independent pieces of state on this page, each with a deliberately narrow reach,
  // rather than one shared "selectedId" threaded through every widget.
  const [pinnedAccountId, setPinnedAccountId] = useState<string | null>(null);

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

  const kpi = PERIOD_KPI[period];
  const openDisputeCount = EVENTS.filter((e) => e.type === "dispute" && e.status === "opened").length;

  return (
    <div className={cx("flex min-h-dvh overflow-x-hidden", APP_BG, TEXT_PRIMARY)}>
      <a
        href="#main-content"
        className="sr-only rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Skip to main content
      </a>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 xl:px-10 lg:py-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <Eyebrow>Ledgerline Platform</Eyebrow>
              <h1 className={cx("mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]", TEXT_PRIMARY)} style={{ fontFamily: "var(--font-display-wide)" }}>
                Ledger
              </h1>
            </div>
            <Segmented options={PERIOD_OPTIONS} value={period} onChange={setPeriod} ariaLabel="KPI period" />
          </div>

          {/* Hero KPI row — scoped to the period toggle above, and to nothing else on the
              page. It does not read the pinned account, the feed's own filter, or the
              revenue-mix drill-down. */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className={cx("rounded-xl border px-4 py-3", BORDER, "bg-white")}>
              <p className={cx("text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Net volume processed</p>
              <p className={cx("mt-1 flex items-baseline gap-1 text-2xl font-semibold leading-none tracking-tight", NUM, TEXT_PRIMARY)}>{formatUSD(kpi.netVolume)}</p>
            </div>
            <div className={cx("rounded-xl border px-4 py-3", BORDER, "bg-white")}>
              <p className={cx("text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Take rate</p>
              <p className={cx("mt-1 flex items-center gap-1 text-2xl font-semibold leading-none tracking-tight", NUM, TEXT_PRIMARY)}>
                {formatPct(kpi.takeRatePct)}
                <TrendingUp size={16} aria-hidden="true" className="text-emerald-600" />
              </p>
            </div>
            <div className={cx("rounded-xl border px-4 py-3", BORDER, "bg-white")}>
              <p className={cx("text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Refund rate</p>
              <p className={cx("mt-1 flex items-center gap-1 text-2xl font-semibold leading-none tracking-tight", NUM, TEXT_PRIMARY)}>
                {formatPct(kpi.refundRatePct)}
                <TrendingDown size={16} aria-hidden="true" className="text-zinc-400" />
              </p>
            </div>
          </div>

          {/* Feed-centric skeleton: one central activity stream flanked by two auxiliary
              panels. Explicit 12-col grid; each pane is min-w-0 so its own content (table
              cells, chart, list rows) governs wrapping instead of forcing the row wider. */}
          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
            <aside className="order-2 flex min-w-0 flex-col gap-4 xl:order-1 xl:col-span-3">
              <PinnedAccountRollup accountId={pinnedAccountId} onClear={() => setPinnedAccountId(null)} />
              <PlatformHealthCard />
            </aside>

            <div className="order-1 min-w-0 xl:order-2 xl:col-span-6">
              <Card>
                <CardHead
                  title="Ledger"
                  Icon={Receipt}
                  hint={
                    <>
                      {`Every event across all ${new Set(EVENTS.map((e) => e.accountId)).size} accounts`}
                      {openDisputeCount > 0 ? (
                        <span className="ml-1 inline-flex items-center gap-1 text-amber-700">
                          <AlertTriangle size={11} aria-hidden="true" />
                          {`${openDisputeCount} dispute${openDisputeCount === 1 ? "" : "s"} need attention`}
                        </span>
                      ) : null}
                      {" — this feed is intentionally independent of the revenue-mix panel's drill-down (see the comment in RevenueBreakdown.tsx)."}
                    </>
                  }
                />
                <div className="mt-3">
                  <LedgerFeed pinnedAccountId={pinnedAccountId} onPin={setPinnedAccountId} />
                </div>
              </Card>
            </div>

            <aside className="order-3 min-w-0 xl:col-span-3">
              <Card>
                <CardHead
                  title="Revenue mix"
                  Icon={PieChart}
                  hint={
                    <>
                      {"Region "}
                      <span aria-hidden="true">→</span>
                      <span className="sr-only">then</span>
                      {" channel "}
                      <span aria-hidden="true">→</span>
                      <span className="sr-only">then</span>
                      {" plan tier. Deliberately not linked to the ledger feed on the left — "}
                      {"drilling in here never filters it."}
                    </>
                  }
                />
                <div className="mt-3">
                  <RevenueBreakdown />
                </div>
              </Card>
            </aside>
          </div>

          <p className={cx("mt-6 text-center text-[11px] font-normal", TEXT_MUTED)}>
            Demo data for illustration only. Amounts are deterministic and don&apos;t reflect a live account.
          </p>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectAccount={(id) => setPinnedAccountId(id)} /> : null}
    </div>
  );
}
