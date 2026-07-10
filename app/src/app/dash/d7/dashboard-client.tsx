"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { JetBrains_Mono } from "next/font/google";
import {
  CheckCircle2,
  ChevronsUpDown,
  Clock3,
  Gauge,
  History,
  LayoutGrid,
  ListChecks,
  Menu,
  Target,
  TrendingDown,
  TrendingUp,
  Waves,
  X,
  XCircle,
} from "lucide-react";
import "./d7.css";

const mono = JetBrains_Mono({
  variable: "--d7-font-mono",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

/* ----------------------------------------------------------------------- *
 * Utilities
 * ----------------------------------------------------------------------- */

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** T-minus countdown from a fixed hour offset — no Date.now(), fully
 * deterministic so server and client render identical markup. */
function formatCountdown(hours: number): string {
  const days = Math.floor(hours / 24);
  const rem = Math.round(hours % 24);
  return `T-${String(days).padStart(2, "0")}D ${String(rem).padStart(2, "0")}H`;
}

/** Deterministic synthetic probability trace (sine/cosine composite, no
 * Math.random) — same seed always produces the same series. */
function buildWave(n: number, seed: number, end: number, amplitude: number): number[] {
  const start = clamp(end - Math.sin(seed * 0.7) * amplitude * 1.6, 4, 96);
  const points: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const base = start + (end - start) * t;
    const noise = Math.sin(i * 1.3 + seed) * amplitude * (1 - t * 0.5) + Math.cos(i * 0.6 + seed * 1.8) * amplitude * 0.5;
    points.push(clamp(base + noise, 3, 97));
  }
  points[points.length - 1] = end;
  return points;
}

type PathBox = { w: number; h: number; padX: number; padY: number };

function pointToXY(points: number[], i: number, box: PathBox) {
  const { w, h, padX, padY } = box;
  const x = padX + (i * (w - 2 * padX)) / (points.length - 1);
  const y = padY + ((100 - points[i]) / 100) * (h - 2 * padY);
  return { x, y };
}

function toLinePath(points: number[], box: PathBox): string {
  return points
    .map((_, i) => {
      const { x, y } = pointToXY(points, i, box);
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

function toBandPath(upper: number[], lower: number[], box: PathBox): string {
  const upperPts = upper.map((_, i) => {
    const { x, y } = pointToXY(upper, i, box);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  const lowerPts = lower
    .map((_, i) => {
      const { x, y } = pointToXY(lower, i, box);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .reverse();
  return `M${upperPts.join(" L")} L${lowerPts.join(" L")} Z`;
}

/* ----------------------------------------------------------------------- *
 * Reduced motion — matchMedia + useSyncExternalStore directly, since the
 * framer-motion hook can miss live OS-level changes mid-session.
 * ----------------------------------------------------------------------- */

function subscribeReducedMotion(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getReducedMotionServerSnapshot() {
  return false;
}
function useReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);
}

/* ----------------------------------------------------------------------- *
 * Domain data
 * ----------------------------------------------------------------------- */

type Domain = "PRODUCT" | "MARKET" | "OPS" | "PERSONAL";

const DOMAIN_META: Record<Domain, { label: string; color: string }> = {
  PRODUCT: { label: "PRODUCT", color: "#63d9e6" },
  MARKET: { label: "MARKET", color: "#ffb454" },
  OPS: { label: "OPS", color: "#4dffa0" },
  PERSONAL: { label: "PERSONAL", color: "#ff5fae" },
};

const DOMAIN_ORDER: Domain[] = ["PRODUCT", "MARKET", "OPS", "PERSONAL"];

type Prophecy = {
  id: string;
  title: string;
  domain: Domain;
  probability: number;
  deltaPp: number;
  resolvesHours: number;
  forecasters: number;
  seed: number;
};

const PROPHECIES: Prophecy[] = [
  {
    id: "p1",
    title: "Series C term sheet signed before Q4 close",
    domain: "MARKET",
    probability: 72,
    deltaPp: 4.2,
    resolvesHours: 41 * 24,
    forecasters: 212,
    seed: 11,
  },
  {
    id: "p2",
    title: "Monthly churn falls under 3.5%",
    domain: "PRODUCT",
    probability: 58,
    deltaPp: -2.1,
    resolvesHours: 12 * 24,
    forecasters: 164,
    seed: 23,
  },
  {
    id: "p3",
    title: "EU data-residency region ships on schedule",
    domain: "OPS",
    probability: 34,
    deltaPp: -9.6,
    resolvesHours: 6 * 24,
    forecasters: 98,
    seed: 37,
  },
  {
    id: "p4",
    title: "Founder finishes the Boston Marathon under 3:30:00",
    domain: "PERSONAL",
    probability: 61,
    deltaPp: 3.0,
    resolvesHours: 210 * 24,
    forecasters: 41,
    seed: 5,
  },
  {
    id: "p5",
    title: "Nearest competitor closes a round before we do",
    domain: "MARKET",
    probability: 45,
    deltaPp: 0.4,
    resolvesHours: 30 * 24,
    forecasters: 176,
    seed: 19,
  },
  {
    id: "p6",
    title: "Net Promoter Score crosses 50",
    domain: "PRODUCT",
    probability: 77,
    deltaPp: 5.8,
    resolvesHours: 55 * 24,
    forecasters: 133,
    seed: 29,
  },
  {
    id: "p7",
    title: "On-call pages drop 40% after the reliability refactor",
    domain: "OPS",
    probability: 82,
    deltaPp: 6.1,
    resolvesHours: 18 * 24,
    forecasters: 87,
    seed: 44,
  },
  {
    id: "p8",
    title: "Headcount reaches 100 before contract renewal",
    domain: "OPS",
    probability: 29,
    deltaPp: -4.4,
    resolvesHours: 70 * 24,
    forecasters: 65,
    seed: 8,
  },
  {
    id: "p9",
    title: "Sleep-protocol trial adds 1.2 years to projected lifespan",
    domain: "PERSONAL",
    probability: 66,
    deltaPp: 1.7,
    resolvesHours: 365 * 24,
    forecasters: 52,
    seed: 52,
  },
  {
    id: "p10",
    title: "Central bank cuts rates before the next earnings call",
    domain: "MARKET",
    probability: 53,
    deltaPp: -0.6,
    resolvesHours: 25 * 24,
    forecasters: 201,
    seed: 15,
  },
];

type ResolvedEntry = {
  id: string;
  title: string;
  domain: Domain;
  outcome: "HIT" | "MISS";
  wasConfidence: number;
  resolvedDaysAgo: number;
};

const FIELD_LOG: ResolvedEntry[] = [
  { id: "r1", title: "Pricing v3 lifts ARPU by 8%+", domain: "MARKET", outcome: "HIT", wasConfidence: 71, resolvedDaysAgo: 9 },
  { id: "r2", title: "Q2 closes above $2.1M ARR", domain: "MARKET", outcome: "HIT", wasConfidence: 64, resolvedDaysAgo: 14 },
  { id: "r3", title: "Mobile app ships in Q1", domain: "PRODUCT", outcome: "MISS", wasConfidence: 58, resolvedDaysAgo: 22 },
  { id: "r4", title: "Support first-response SLA stays under 2h", domain: "OPS", outcome: "HIT", wasConfidence: 80, resolvedDaysAgo: 30 },
  { id: "r5", title: "Founder ships 30 essays in 90 days", domain: "PERSONAL", outcome: "MISS", wasConfidence: 45, resolvedDaysAgo: 33 },
  { id: "r6", title: "Vendor migration completes without downtime", domain: "OPS", outcome: "HIT", wasConfidence: 69, resolvedDaysAgo: 47 },
];

const RANGE_CONFIG = {
  "7D": { n: 14, amplitude: 4 },
  "30D": { n: 20, amplitude: 7 },
  "90D": { n: 26, amplitude: 10 },
  ALL: { n: 32, amplitude: 14 },
} as const;

type RangeKey = keyof typeof RANGE_CONFIG;
const RANGE_KEYS = Object.keys(RANGE_CONFIG) as RangeKey[];

type DomainFilter = "ALL" | Domain;

const NAV_ITEMS: Array<{ id: string; label: string; href: string; icon: typeof LayoutGrid }> = [
  { id: "overview", label: "OVERVIEW", href: "#main", icon: LayoutGrid },
  { id: "readouts", label: "READOUTS", href: "#readouts", icon: Gauge },
  { id: "scope", label: "SCOPE", href: "#scope", icon: Waves },
  { id: "ledger", label: "LEDGER", href: "#ledger", icon: ListChecks },
  { id: "log", label: "FIELD LOG", href: "#log", icon: History },
];

/* ----------------------------------------------------------------------- *
 * Small presentational pieces
 * ----------------------------------------------------------------------- */

function DomainTag({ domain }: { domain: Domain }) {
  const meta = DOMAIN_META[domain];
  return (
    <span
      className="d7-mono inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em]"
      style={{ borderColor: `${meta.color}55`, color: meta.color, backgroundColor: `${meta.color}14` }}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
      {meta.label}
    </span>
  );
}

function OddsBar({ value }: { value: number }) {
  return (
    <div className="flex min-w-[132px] items-center gap-2">
      <div className="h-2 w-20 overflow-hidden rounded-full bg-white/10 sm:w-24" role="presentation">
        <div
          className="h-full rounded-full bg-[var(--d7-green)]"
          style={{ width: `${value}%`, boxShadow: "0 0 8px rgba(77,255,160,0.6)" }}
        />
      </div>
      <span className="d7-mono text-sm font-semibold text-[var(--d7-text)]">{value}%</span>
    </div>
  );
}

function TrendChip({ delta }: { delta: number }) {
  const up = delta >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={cx(
        "d7-mono inline-flex items-center gap-1 text-xs font-semibold",
        up ? "text-[var(--d7-green)]" : "text-[var(--d7-magenta)]"
      )}
    >
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      {up ? "+" : ""}
      {delta.toFixed(1)}pp
    </span>
  );
}

function Sparkline({ points, color }: { points: number[]; color: string }) {
  const box: PathBox = { w: 120, h: 36, padX: 2, padY: 4 };
  const d = toLinePath(points, box);
  return (
    <svg viewBox={`0 0 ${box.w} ${box.h}`} className="h-9 w-[120px]" aria-hidden="true" focusable="false">
      <path d={d} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <dl className="d7-glow-border rounded-xl border border-[var(--d7-border)] bg-[var(--d7-panel-alt)] p-4">
      <div className="flex items-center justify-between">
        <dt className="d7-mono text-[10px] font-semibold tracking-[0.14em] text-[var(--d7-text-faint)]">{label}</dt>
        <Icon aria-hidden="true" className="h-4 w-4" style={{ color: accent }} />
      </div>
      <dd className="d7-mono mt-2 text-2xl font-bold text-[var(--d7-text)] sm:text-3xl">{value}</dd>
      <dd className="mt-1 truncate text-xs text-[var(--d7-text-muted)]">{sub}</dd>
    </dl>
  );
}

/* ----------------------------------------------------------------------- *
 * Dashboard
 * ----------------------------------------------------------------------- */

export default function DashboardClient() {
  const reducedMotion = useReducedMotion();
  const [domainFilter, setDomainFilter] = useState<DomainFilter>("ALL");
  const [range, setRange] = useState<RangeKey>("30D");
  const [selectedId, setSelectedId] = useState<string>(PROPHECIES[0].id);
  const [navOpen, setNavOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!navOpen) return;
    closeButtonRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNavOpen(false);
        hamburgerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [navOpen]);

  const selected = PROPHECIES.find((p) => p.id === selectedId) ?? PROPHECIES[0];
  const filtered = domainFilter === "ALL" ? PROPHECIES : PROPHECIES.filter((p) => p.domain === domainFilter);

  const avgProbability = useMemo(
    () => PROPHECIES.reduce((sum, p) => sum + p.probability, 0) / PROPHECIES.length,
    []
  );
  const soonest = useMemo(() => PROPHECIES.reduce((a, b) => (a.resolvesHours < b.resolvesHours ? a : b)), []);

  const { n, amplitude } = RANGE_CONFIG[range];
  const wave = useMemo(() => buildWave(n, selected.seed, selected.probability, amplitude), [n, selected.seed, selected.probability, amplitude]);
  const band = useMemo(() => {
    const upper: number[] = [];
    const lower: number[] = [];
    wave.forEach((v, i) => {
      const t = i / (wave.length - 1);
      const width = amplitude * 1.1 * (1 - t * 0.6) + 2.5;
      upper.push(clamp(v + width, 0, 100));
      lower.push(clamp(v - width, 0, 100));
    });
    return { upper, lower };
  }, [wave, amplitude]);

  const scopeBox: PathBox = { w: 640, h: 240, padX: 36, padY: 18 };
  const linePath = toLinePath(wave, scopeBox);
  const bandPath = toBandPath(band.upper, band.lower, scopeBox);
  const thresholdY = scopeBox.padY + 0.5 * (scopeBox.h - 2 * scopeBox.padY);

  const calibrationPct = 84;
  const gaugeR = 78;
  const gaugeCirc = 2 * Math.PI * gaugeR;
  const gaugeOffset = gaugeCirc * (1 - calibrationPct / 100);

  return (
    <div lang="en" className={cx(mono.variable, "d7-root d7-grid-bg d7-scanlines d7-vignette relative min-h-dvh font-sans text-[var(--d7-text)]")}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-[var(--d7-green)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
      >
        Skip to main content
      </a>

      <div className="relative z-10 flex min-h-dvh">
        {navOpen && (
          <button type="button" onClick={() => setNavOpen(false)} className="fixed inset-0 z-40 bg-black/70 lg:hidden">
            <span className="sr-only">Close navigation</span>
          </button>
        )}

        <aside
          id="d7-nav"
          className={cx(
            "d7-drawer fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--d7-border)] bg-[var(--d7-panel)] lg:static lg:z-auto lg:translate-x-0",
            navOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-[var(--d7-border)] px-5 py-5">
            <div className="flex items-center gap-2.5">
              <span aria-hidden="true" className="d7-mono flex h-9 w-9 items-center justify-center rounded-md border border-[var(--d7-border-strong)] bg-[var(--d7-green-soft)] text-sm font-bold text-[var(--d7-green)]">
                IX
              </span>
              <div>
                <p className="d7-mono d7-glow-text text-sm font-bold tracking-[0.08em] text-[var(--d7-green)]">CASSANDRA</p>
                <p className="d7-mono text-[10px] tracking-wide text-[var(--d7-text-faint)]">PROPHECY ENGINE</p>
              </div>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setNavOpen(false)}
              className="d7-focus flex h-11 w-11 items-center justify-center rounded-md text-[var(--d7-text-muted)] hover:text-[var(--d7-text)] lg:hidden"
            >
              <X aria-hidden="true" className="h-5 w-5" />
              <span className="sr-only">Close navigation</span>
            </button>
          </div>

          <nav aria-label="Stations" className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={() => setNavOpen(false)}
                      className={cx(
                        "d7-focus flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-[var(--d7-text-muted)] transition-colors hover:bg-white/5 hover:text-[var(--d7-text)]"
                      )}
                    >
                      <Icon aria-hidden="true" focusable="false" className="h-5 w-5 shrink-0" />
                      <span className="d7-mono flex-1 text-left tracking-[0.04em]">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-[var(--d7-border)] px-5 py-4">
            <p className="d7-mono text-[10px] text-[var(--d7-text-faint)]">MODEL IX · SNAPSHOT BUILD</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-[var(--d7-border)] bg-[var(--d7-panel)]/95 px-4 py-3 backdrop-blur sm:px-6">
            <button
              ref={hamburgerRef}
              type="button"
              onClick={() => setNavOpen(true)}
              aria-expanded={navOpen}
              aria-controls="d7-nav"
              className="d7-focus flex h-11 w-11 items-center justify-center rounded-md text-[var(--d7-text-muted)] hover:text-[var(--d7-text)] lg:hidden"
            >
              <Menu aria-hidden="true" className="h-5 w-5" />
              <span className="sr-only">Open navigation</span>
            </button>

            <div className="flex items-center gap-1.5 text-[11px] text-[var(--d7-text-muted)]">
              <span aria-hidden="true" className="d7-led h-1.5 w-1.5 rounded-full bg-[var(--d7-green)]" />
              <span className="d7-mono hidden sm:inline">SYNCED 2026-07-11 05:12 UTC</span>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <span className="d7-mono hidden text-[11px] text-[var(--d7-text-muted)] sm:inline">STATION NORTH-9</span>
              <span
                role="img"
                aria-label="Signed in as Y. Song, forecaster"
                className="d7-mono flex h-9 w-9 items-center justify-center rounded-full border border-[var(--d7-border-strong)] bg-[var(--d7-panel-alt)] text-xs font-bold text-[var(--d7-green)]"
              >
                YS
              </span>
            </div>
          </header>

          <main
            id="main"
            tabIndex={-1}
            className="flex-1 space-y-8 px-4 py-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--d7-green)] sm:px-6 lg:px-8 lg:py-8"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="d7-mono d7-glow-text text-2xl font-bold tracking-[0.02em] text-[var(--d7-green)] sm:text-3xl">
                  PROPHECY DECK
                </h1>
                <p className="mt-1.5 max-w-prose text-sm text-[var(--d7-text-muted)]">
                  Every open forecast, priced. Track odds, trends and calibration for the futures your team has staked a
                  claim on.
                </p>
              </div>
              <p className="d7-mono text-[11px] text-[var(--d7-text-faint)]">SNAPSHOT · NOT LIVE-TICKING</p>
            </div>

            {/* Readouts */}
            <section aria-labelledby="readouts-heading" id="readouts">
              <h2 id="readouts-heading" className="sr-only">
                Readouts
              </h2>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatCard icon={Waves} label="OPEN PROPHECIES" value="128" sub="10 pinned to this workspace" accent="#4dffa0" />
                <StatCard
                  icon={Gauge}
                  label="AGG. CONFIDENCE"
                  value={`${avgProbability.toFixed(1)}%`}
                  sub="weighted mean, pinned set"
                  accent="#63d9e6"
                />
                <StatCard icon={Target} label="CALIBRATION" value={`${calibrationPct}%`} sub="Brier-derived · 120 resolved" accent="#4dffa0" />
                <StatCard
                  icon={Clock3}
                  label="NEXT RESOLUTION"
                  value={formatCountdown(soonest.resolvesHours)}
                  sub={soonest.title}
                  accent="#ffb454"
                />
              </div>
            </section>

            {/* Oscilloscope + Calibration gauge */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <section aria-labelledby="scope-heading" id="scope" className="d7-glow-border rounded-xl border border-[var(--d7-border)] bg-[var(--d7-panel-alt)] p-4 sm:p-5 lg:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 id="scope-heading" className="d7-mono text-sm font-bold tracking-[0.1em] text-[var(--d7-text)]">
                      OSCILLOSCOPE
                    </h2>
                    <p className="mt-0.5 max-w-[46ch] truncate text-xs text-[var(--d7-text-muted)]">{selected.title}</p>
                  </div>
                  <div role="group" aria-label="Trace range" className="d7-mono inline-flex rounded-lg border border-[var(--d7-border)] p-0.5 text-[11px]">
                    {RANGE_KEYS.map((key) => (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={range === key}
                        onClick={() => setRange(key)}
                        className={cx(
                          "d7-focus min-h-11 min-w-11 rounded-md px-2.5 font-semibold transition-colors",
                          range === key ? "bg-[var(--d7-green-soft)] text-[var(--d7-green)]" : "text-[var(--d7-text-faint)] hover:text-[var(--d7-text)]"
                        )}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative mt-4 overflow-hidden rounded-lg border border-[var(--d7-border)] bg-black/30">
                  <svg
                    viewBox={`0 0 ${scopeBox.w} ${scopeBox.h}`}
                    className="h-56 w-full sm:h-64"
                    role="img"
                    aria-label={`Probability trace for ${selected.title}: currently ${selected.probability}%, ${
                      selected.deltaPp >= 0 ? "up" : "down"
                    } ${Math.abs(selected.deltaPp).toFixed(1)} points over ${range}.`}
                  >
                    <defs>
                      <filter id="d7-glow" x="-40%" y="-40%" width="180%" height="180%">
                        <feGaussianBlur stdDeviation="3.2" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {[0, 25, 50, 75, 100].map((tick) => {
                      const y = scopeBox.padY + ((100 - tick) / 100) * (scopeBox.h - 2 * scopeBox.padY);
                      return (
                        <g key={tick}>
                          <line x1={scopeBox.padX} x2={scopeBox.w - scopeBox.padX} y1={y} y2={y} stroke="rgba(77,255,160,0.09)" strokeWidth={1} />
                          <text x={8} y={y + 3} fontSize={9} fill="var(--d7-text-faint)" className="d7-mono">
                            {tick}
                          </text>
                        </g>
                      );
                    })}

                    <line
                      x1={scopeBox.padX}
                      x2={scopeBox.w - scopeBox.padX}
                      y1={thresholdY}
                      y2={thresholdY}
                      stroke="var(--d7-amber)"
                      strokeOpacity={0.4}
                      strokeDasharray="4 4"
                      strokeWidth={1}
                    />

                    <path d={bandPath} fill="var(--d7-green)" fillOpacity={0.08} stroke="none" />
                    <path d={linePath} fill="none" stroke="var(--d7-green)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" filter="url(#d7-glow)" />

                    {(() => {
                      const last = pointToXY(wave, wave.length - 1, scopeBox);
                      return <circle cx={last.x} cy={last.y} r={3.5} fill="var(--d7-green)" filter="url(#d7-glow)" />;
                    })()}
                  </svg>

                  {!reducedMotion && (
                    <div
                      aria-hidden="true"
                      className="d7-sweep pointer-events-none absolute inset-y-0 left-0 w-px bg-[var(--d7-green)]"
                      style={{ boxShadow: "0 0 10px 2px rgba(77,255,160,0.8)" }}
                    />
                  )}
                </div>

                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[11px] text-[var(--d7-text-muted)]">
                  <li className="flex items-center gap-1.5">
                    <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[var(--d7-green)]" /> Trace — current odds
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span aria-hidden="true" className="h-2 w-3 rounded-sm bg-[var(--d7-green)] opacity-30" /> Band — forecaster spread
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span aria-hidden="true" className="h-0.5 w-3 bg-[var(--d7-amber)] opacity-60" /> Line — coin-flip threshold
                  </li>
                </ul>
              </section>

              <section
                aria-labelledby="calibration-heading"
                id="calibration"
                className="d7-glow-border flex flex-col items-center rounded-xl border border-[var(--d7-border)] bg-[var(--d7-panel-alt)] p-4 sm:p-5"
              >
                <h2 id="calibration-heading" className="d7-mono self-start text-sm font-bold tracking-[0.1em] text-[var(--d7-text)]">
                  CALIBRATION
                </h2>
                <svg
                  viewBox="0 0 200 200"
                  className="mt-2 h-44 w-44"
                  role="img"
                  aria-label={`Calibration score ${calibrationPct}%, derived from Brier score across 120 resolved prophecies.`}
                >
                  <circle cx={100} cy={100} r={gaugeR} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={14} />
                  <circle
                    cx={100}
                    cy={100}
                    r={gaugeR}
                    fill="none"
                    stroke="var(--d7-green)"
                    strokeWidth={14}
                    strokeLinecap="round"
                    strokeDasharray={gaugeCirc}
                    strokeDashoffset={gaugeOffset}
                    transform="rotate(-90 100 100)"
                    style={{ filter: "drop-shadow(0 0 6px rgba(77,255,160,0.7))" }}
                  />
                  <text x={100} y={96} textAnchor="middle" fontSize={34} fontWeight={700} fill="var(--d7-text)" className="d7-mono">
                    {calibrationPct}%
                  </text>
                  <text x={100} y={120} textAnchor="middle" fontSize={10} fill="var(--d7-text-faint)" className="d7-mono">
                    ACCURACY
                  </text>
                </svg>
                <p className="mt-2 text-center text-xs text-[var(--d7-text-muted)]">
                  Reliability across the last <span className="text-[var(--d7-text)]">120</span> resolved prophecies —
                  higher means stated odds matched real outcomes.
                </p>
              </section>
            </div>

            {/* Ledger */}
            <section aria-labelledby="ledger-heading" id="ledger" className="d7-glow-border rounded-xl border border-[var(--d7-border)] bg-[var(--d7-panel-alt)] p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 id="ledger-heading" className="d7-mono text-sm font-bold tracking-[0.1em] text-[var(--d7-text)]">
                    LEDGER — WATCHLIST
                  </h2>
                  <p className="mt-0.5 text-xs text-[var(--d7-text-muted)]">Select an event to trace it on the oscilloscope.</p>
                </div>
                <div role="group" aria-label="Filter by domain" className="d7-mono flex flex-wrap gap-1.5 text-[11px]">
                  {(["ALL", ...DOMAIN_ORDER] as DomainFilter[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      aria-pressed={domainFilter === d}
                      onClick={() => setDomainFilter(d)}
                      className={cx(
                        "d7-focus min-h-11 rounded-full border px-3 font-semibold transition-colors",
                        domainFilter === d
                          ? "border-[var(--d7-border-strong)] bg-[var(--d7-green-soft)] text-[var(--d7-green)]"
                          : "border-[var(--d7-border)] text-[var(--d7-text-faint)] hover:text-[var(--d7-text)]"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <caption className="sr-only">Open prophecies with current odds, trend, forecaster count and time to resolution</caption>
                  <thead>
                    <tr className="border-b border-[var(--d7-border)] text-[10px] tracking-[0.1em] text-[var(--d7-text-faint)]">
                      <th scope="col" className="d7-mono py-2 pr-3 font-semibold">
                        EVENT
                      </th>
                      <th scope="col" className="d7-mono py-2 pr-3 font-semibold">
                        DOMAIN
                      </th>
                      <th scope="col" className="d7-mono py-2 pr-3 font-semibold">
                        ODDS
                      </th>
                      <th scope="col" className="d7-mono py-2 pr-3 font-semibold">
                        TREND
                      </th>
                      <th scope="col" className="d7-mono py-2 pr-3 font-semibold">
                        FORECASTERS
                      </th>
                      <th scope="col" className="d7-mono py-2 pr-3 font-semibold">
                        RESOLVES
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => {
                      const isSelected = selected.id === p.id;
                      const spark = buildWave(12, p.seed, p.probability, 8);
                      return (
                        <tr
                          key={p.id}
                          className={cx(
                            "border-b border-[var(--d7-border)]/60 align-middle transition-colors last:border-b-0",
                            isSelected && "bg-[var(--d7-green-soft)]"
                          )}
                        >
                          <th scope="row" className="max-w-[260px] py-2.5 pr-3 font-normal">
                            <button
                              type="button"
                              onClick={() => setSelectedId(p.id)}
                              aria-pressed={isSelected}
                              className="d7-focus flex min-h-11 items-center text-left text-[var(--d7-text)] hover:text-[var(--d7-green)]"
                            >
                              {p.title}
                            </button>
                          </th>
                          <td className="py-2.5 pr-3">
                            <DomainTag domain={p.domain} />
                          </td>
                          <td className="py-2.5 pr-3">
                            <OddsBar value={p.probability} />
                          </td>
                          <td className="py-2.5 pr-3">
                            <div className="flex items-center gap-2">
                              <Sparkline points={spark} color={p.deltaPp >= 0 ? "#4dffa0" : "#ff5fae"} />
                              <TrendChip delta={p.deltaPp} />
                            </div>
                          </td>
                          <td className="d7-mono py-2.5 pr-3 text-[var(--d7-text-muted)]">{p.forecasters}</td>
                          <td className="d7-mono py-2.5 pr-3 text-[var(--d7-text-muted)]">{formatCountdown(p.resolvesHours)}</td>
                        </tr>
                      );
                    })}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-sm text-[var(--d7-text-muted)]">
                          No open prophecies in this domain right now.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Field log */}
            <section aria-labelledby="log-heading" id="log" className="d7-glow-border rounded-xl border border-[var(--d7-border)] bg-[var(--d7-panel-alt)] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 id="log-heading" className="d7-mono text-sm font-bold tracking-[0.1em] text-[var(--d7-text)]">
                  FIELD LOG — RESOLVED
                </h2>
                <ChevronsUpDown aria-hidden="true" className="h-4 w-4 text-[var(--d7-text-faint)]" />
              </div>
              <ul className="mt-3 divide-y divide-[var(--d7-border)]">
                {FIELD_LOG.map((item) => (
                  <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="d7-mono text-[10px] tracking-[0.06em] text-[var(--d7-text-faint)]">
                        {DOMAIN_META[item.domain].label} · {item.resolvedDaysAgo}D AGO · WAS {item.wasConfidence}%
                      </p>
                      <p className="truncate text-sm text-[var(--d7-text)]">{item.title}</p>
                    </div>
                    <span
                      className={cx(
                        "d7-mono inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold",
                        item.outcome === "HIT"
                          ? "border-[var(--d7-green)]/40 bg-[var(--d7-green-soft)] text-[var(--d7-green)]"
                          : "border-[var(--d7-magenta)]/40 bg-[var(--d7-magenta-soft)] text-[var(--d7-magenta)]"
                      )}
                    >
                      {item.outcome === "HIT" ? (
                        <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
                      ) : (
                        <XCircle aria-hidden="true" className="h-3.5 w-3.5" />
                      )}
                      {item.outcome}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <p className="d7-mono pb-2 text-center text-[10px] text-[var(--d7-text-faint)]">
              CASSANDRA MODEL IX · DATA IS A STATIC SNAPSHOT, NOT LIVE · ODDS ARE ILLUSTRATIVE
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}
