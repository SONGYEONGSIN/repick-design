"use client";

import { AlertTriangle, GitBranch, Rocket, ShieldAlert, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import CommandPalette from "./CommandPalette";
import DeployFeed from "./DeployFeed";
import SloBulletGrid, { type Period } from "./SloBulletGrid";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { AVG_DURATION, BURNING_COUNT, DEPLOYS_TODAY, FAILED_TODAY, SUCCESS_RATE, formatDuration, formatInt, formatPct } from "./data";
import { APP_BG, BORDER, NUM, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, cx } from "./tokens";
import { Card, CardHead, Eyebrow, Segmented } from "./ui";

const PERIOD_OPTIONS: { id: Period; label: string }[] = [
  { id: "burn7d", label: "7D" },
  { id: "burn30d", label: "30D" },
];

export default function LockstepClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("burn7d");
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

  return (
    <div className={cx("flex min-h-dvh overflow-x-hidden", APP_BG, TEXT_PRIMARY)}>
      <div aria-hidden="true" className={cx("pointer-events-none fixed inset-0 -z-10", APP_BG)} />
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <Eyebrow>{`Platform ops · ${formatInt(DEPLOYS_TODAY)} deploys today`}</Eyebrow>
              <h1 className={cx("mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]", TEXT_PRIMARY)}>Deploy &amp; error-budget console</h1>
              <p className={cx("mt-1.5 max-w-2xl text-sm font-normal leading-relaxed", TEXT_AUX)}>
                The deploy feed on the left is the desk&rsquo;s live stream; the error-budget grid on the right is scoped only by its own 7D/30D toggle — filtering the feed never touches it.
              </p>
            </div>
          </div>

          <h2 className="sr-only font-medium">Operations summary</h2>
          <dl className="mt-4 grid grid-cols-12 gap-3">
            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Deploys today</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <Rocket size={17} aria-hidden="true" className={TEXT_AUX} />
                  {formatInt(DEPLOYS_TODAY)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_MUTED)}>across production and staging</span>
              </dd>
            </div>

            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Success rate</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <GitBranch size={17} aria-hidden="true" className={TEXT_AUX} />
                  {formatPct(SUCCESS_RATE)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_MUTED)}>{`${FAILED_TODAY} failed or rolled back`}</span>
              </dd>
            </div>

            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Avg deploy time</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <Timer size={17} aria-hidden="true" className={TEXT_AUX} />
                  {formatDuration(AVG_DURATION)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_MUTED)}>mean across today&rsquo;s deploys</span>
              </dd>
            </div>

            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BURNING_COUNT > 0 ? "border-rose-800/50 bg-rose-950/30" : cx(BORDER, SURFACE_INSET))}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", BURNING_COUNT > 0 ? "text-rose-300" : TEXT_MUTED)}>Services burning</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <AlertTriangle size={17} aria-hidden="true" className={BURNING_COUNT > 0 ? "text-rose-400" : TEXT_AUX} />
                  {formatInt(BURNING_COUNT)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", BURNING_COUNT > 0 ? "text-rose-300" : TEXT_MUTED)}>7-day error budget ≥ 80%</span>
              </dd>
            </div>
          </dl>

          {/* Both cards share one fixed desktop height with independent internal scroll, so a
              shorter feed never leaves a bare gap beside a taller budget list (grid-craft rule:
              balance card heights instead of letting content length dictate page height). */}
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-stretch">
            <div className="min-w-0 flex-1">
              <Card className="flex flex-col lg:h-[640px]">
                <CardHead title="Deploy feed" Icon={GitBranch} hint="The desk's live stream — filterable by outcome, sortable by duration or recency." />
                <div className="mt-3 min-h-0 flex-1 lg:overflow-y-auto lg:[scrollbar-width:thin]">
                  <DeployFeed />
                </div>
              </Card>
            </div>

            <div className="lg:w-[360px] lg:shrink-0">
              <Card id="slo-card" className="flex flex-col lg:h-[640px]">
                <CardHead
                  title="Error budgets"
                  Icon={ShieldAlert}
                  hint="Every bar prints its own percentage — no hover required. Danger line at 80%."
                  action={<Segmented options={PERIOD_OPTIONS} value={period} onChange={setPeriod} ariaLabel="Error budget window" />}
                />
                <div className="mt-3 min-h-0 flex-1 lg:overflow-y-auto lg:[scrollbar-width:thin]">
                  <SloBulletGrid period={period} highlightedId={highlightedId} />
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onSelectService={(id) => {
            setHighlightedId(id);
            document.getElementById("slo-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />
      ) : null}
    </div>
  );
}
