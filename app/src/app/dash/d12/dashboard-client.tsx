"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  AlertOctagon,
  AlertTriangle,
  BellRing,
  Coins,
  Crosshair,
  Gauge,
  Info,
  Menu,
  Server as ServerIcon,
  ShieldAlert,
  Swords,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import "./quarterdeck.css";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type PeriodKey = "7d" | "30d" | "90d";
type ServerKey = "na" | "eu" | "apac";
type FactionKey = "ember" | "volt" | "toxin" | "contested";
type Severity = "critical" | "warning" | "info";

interface EconomySeries {
  faucet: number[];
  sink: number[];
  health: { label: string; tone: "amber" | "magenta" };
}

interface ServerSnapshot {
  label: string;
  short: string;
  population: number;
  trend: number[];
  queueSec: number;
  uptime: number;
  ping: number;
  status: string;
  tone: "lime" | "amber";
}

/* ------------------------------------------------------------------ */
/* Static data — a single honest snapshot, no fake live ticking.       */
/* ------------------------------------------------------------------ */

const SNAPSHOT_LABEL = "SNAPSHOT · JUL 11 2026 · 09:00 UTC";

const PERIOD_OPTIONS: { id: PeriodKey; label: string }[] = [
  { id: "7d", label: "7D" },
  { id: "30d", label: "30D" },
  { id: "90d", label: "90D" },
];

const PERIOD_FULL_LABEL: Record<PeriodKey, string> = {
  "7d": "last 7 days",
  "30d": "last 30 days",
  "90d": "last 90 days",
};

const ECONOMY: Record<PeriodKey, EconomySeries> = {
  "7d": {
    faucet: [412, 398, 435, 460, 447, 470, 452],
    sink: [380, 365, 390, 402, 415, 430, 408],
    health: { label: "Elevated — faucet outpacing sink", tone: "amber" },
  },
  "30d": {
    faucet: [389, 405, 398, 422, 440, 455, 470, 462, 478, 489],
    sink: [370, 368, 372, 385, 390, 405, 410, 415, 420, 398],
    health: { label: "Inflating — sink event recommended", tone: "amber" },
  },
  "90d": {
    faucet: [350, 362, 371, 380, 395, 405, 415, 422, 430, 445, 460, 489],
    sink: [340, 345, 350, 358, 365, 372, 380, 388, 395, 402, 410, 398],
    health: { label: "Critical drift — 90-day surplus trend", tone: "magenta" },
  },
};

const SERVER_OPTIONS: { id: ServerKey; short: string }[] = [
  { id: "na", short: "NA" },
  { id: "eu", short: "EU" },
  { id: "apac", short: "APAC" },
];

const SERVERS: Record<ServerKey, ServerSnapshot> = {
  na: {
    label: "North America",
    short: "NA",
    population: 184320,
    trend: [176200, 178900, 179800, 181200, 182600, 183100, 184320],
    queueSec: 4,
    uptime: 0.99982,
    ping: 28,
    status: "Nominal",
    tone: "lime",
  },
  eu: {
    label: "Europe",
    short: "EU",
    population: 221560,
    trend: [205300, 208900, 211200, 214800, 217300, 219600, 221560],
    queueSec: 11,
    uptime: 0.99941,
    ping: 34,
    status: "Nominal",
    tone: "lime",
  },
  apac: {
    label: "Asia-Pacific",
    short: "APAC",
    population: 297840,
    trend: [268900, 274200, 279800, 284100, 288700, 293200, 297840],
    queueSec: 47,
    uptime: 0.99512,
    ping: 61,
    status: "Queue Spike",
    tone: "amber",
  },
};

const FACTIONS: Record<FactionKey, { label: string; color: string }> = {
  ember: { label: "Ember Syndicate", color: "var(--qd-magenta-strong)" },
  volt: { label: "Voltline", color: "var(--qd-cyan-strong)" },
  toxin: { label: "Toxic Void", color: "var(--qd-lime-strong)" },
  contested: { label: "Contested", color: "rgba(255,255,255,0.22)" },
};

// 32 sectors, row-major, 8 columns x 4 rows.
const TERRITORY: FactionKey[] = [
  "ember", "ember", "ember", "ember", "volt", "volt", "volt", "contested",
  "ember", "ember", "ember", "volt", "volt", "volt", "volt", "contested",
  "ember", "ember", "toxin", "toxin", "toxin", "volt", "volt", "volt",
  "ember", "ember", "toxin", "toxin", "toxin", "toxin", "volt", "contested",
];

const RETENTION: { label: string; value: number }[] = [
  { label: "D1", value: 0.61 },
  { label: "D7", value: 0.38 },
  { label: "D14", value: 0.29 },
  { label: "D30", value: 0.21 },
  { label: "D60", value: 0.15 },
  { label: "D90", value: 0.11 },
];

const SCOUTS: {
  rank: number;
  handle: string;
  role: string;
  region: string;
  rating: number;
  trend: number;
}[] = [
  { rank: 1, handle: "VXN.Kairo", role: "Duelist", region: "APAC", rating: 94.2, trend: 3.1 },
  { rank: 2, handle: "NullPulse", role: "Strategist", region: "EU", rating: 91.8, trend: 1.4 },
  { rank: 3, handle: "GhostWatt", role: "Duelist", region: "NA", rating: 90.5, trend: -0.6 },
  { rank: 4, handle: "Sable.exe", role: "Support", region: "EU", rating: 88.7, trend: 2.2 },
  { rank: 5, handle: "RiotFang", role: "Strategist", region: "APAC", rating: 87.1, trend: 0.9 },
  { rank: 6, handle: "ZeroDrift", role: "Support", region: "NA", rating: 85.4, trend: -1.8 },
];

const ALERTS: {
  id: number;
  severity: Severity;
  server: ServerKey | "global";
  time: string;
  message: string;
}[] = [
  { id: 1, severity: "critical", server: "apac", time: "12m ago", message: "Matchmaking queue spike — avg 47s (+340% vs baseline)." },
  { id: 2, severity: "warning", server: "global", time: "38m ago", message: "Glimmer faucet/sink ratio drifting positive for 12 days running." },
  { id: 3, severity: "warning", server: "eu", time: "1h ago", message: "Guild EMBER SYNDICATE captured Sector 19 — territory shift." },
  { id: 4, severity: "critical", server: "global", time: "2h ago", message: "Duplication exploit signature flagged in trade log, Sector 7." },
  { id: 5, severity: "info", server: "na", time: "3h ago", message: "Season 4 battle pass conversion up 6.2% week-over-week." },
  { id: 6, severity: "info", server: "apac", time: "5h ago", message: "Build 4.12.0 deployed to the APAC shard cluster." },
];

const TICKER_ITEMS: string[] = [
  "[DEPLOY] Build 4.12.0 rolled out to APAC shard cluster",
  "[GUILD] VOLTLINE opens siege on Sector 22",
  "[ECON] Glimmer net flow positive 12-day streak running",
  "[SCOUT] VXN.Kairo climbs to Rank 1 — rating 94.2",
  "[ALERT] Trade-log anomaly flagged in Sector 7",
  "[MILESTONE] 703,720 concurrent players — new weekly peak",
];

const NAV_ITEMS: { id: string; label: string; href: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Ops Deck", href: "#main", icon: Gauge },
  { id: "economy", label: "Economy Pulse", href: "#economy-pulse", icon: Coins },
  { id: "servers", label: "Server Ops", href: "#server-ops", icon: ServerIcon },
  { id: "guilds", label: "Guild Territory", href: "#guild-territory", icon: Swords },
  { id: "scouting", label: "Scouting Radar", href: "#scouting", icon: Crosshair },
  { id: "alerts", label: "Live Alerts", href: "#alerts", icon: BellRing },
];

const SEVERITY_META: Record<Severity, { label: string; icon: LucideIcon; color: string; soft: string }> = {
  critical: { label: "CRITICAL", icon: AlertOctagon, color: "var(--qd-danger-strong)", soft: "var(--qd-danger-soft)" },
  warning: { label: "WARNING", icon: AlertTriangle, color: "var(--qd-amber-strong)", soft: "var(--qd-amber-soft)" },
  info: { label: "INFO", icon: Info, color: "var(--qd-cyan-strong)", soft: "var(--qd-cyan-soft)" },
};

const SERVER_TAG_LABEL: Record<ServerKey | "global", string> = {
  na: "NA",
  eu: "EU",
  apac: "APAC",
  global: "GLOBAL",
};

const CHART_W = 640;
const CHART_H = 220;
const CHART_PAD = 16;

/* ------------------------------------------------------------------ */
/* Formatters                                                          */
/* ------------------------------------------------------------------ */

const numberFormatter = new Intl.NumberFormat("en-US");
const compactFormatter = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const signedCompactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
});
const pctFormatter = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 });
const uptimeFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const signedPctFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1, signDisplay: "exceptZero" });
const ratingFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function average(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function pctChange(series: number[]): number {
  const first = series[0];
  const last = series[series.length - 1];
  return ((last - first) / first) * 100;
}

function scalePoints(values: number[], width: number, height: number, pad: number, min: number, max: number) {
  const range = max - min || 1;
  const stepX = values.length > 1 ? (width - pad * 2) / (values.length - 1) : 0;
  return values.map((v, i) => ({
    x: pad + i * stepX,
    y: pad + (height - pad * 2) * (1 - (v - min) / range),
  }));
}

function toLine(points: { x: number; y: number }[]): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
}

function toArea(points: { x: number; y: number }[], height: number, pad: number): string {
  const last = points[points.length - 1];
  const first = points[0];
  return `${toLine(points)} L${last.x.toFixed(2)},${(height - pad).toFixed(2)} L${first.x.toFixed(2)},${(height - pad).toFixed(2)} Z`;
}

/* ------------------------------------------------------------------ */
/* Reduced motion — matchMedia + useSyncExternalStore directly, since   *
 * some environments don't reliably surface OS-level motion prefs to   *
 * framer-motion's own hook. CSS prefers-reduced-motion in              *
 * quarterdeck.css is a second line of defense.                        */
/* ------------------------------------------------------------------ */

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

function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);
}

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                         */
/* ------------------------------------------------------------------ */

function Panel({
  children,
  className,
  id,
  hero,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  hero?: boolean;
}) {
  return (
    <div className={cx("qd-cut bg-[var(--qd-border)] p-px", className)}>
      <div
        id={id}
        className={cx(
          "qd-cut h-full bg-[var(--qd-panel)] p-5 sm:p-6",
          hero && "qd-hud-corners"
        )}
      >
        {children}
      </div>
    </div>
  );
}

function Sparkline({ values, tone, width = 112, height = 36 }: { values: number[]; tone: string; width?: number; height?: number }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = scalePoints(values, width, height, 4, min, max);
  const last = points[points.length - 1];
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className="shrink-0 overflow-visible"
      role="img"
      aria-label={`Trend sparkline from ${numberFormatter.format(values[0])} to ${numberFormatter.format(values[values.length - 1])}`}
    >
      <path d={toLine(points)} fill="none" style={{ stroke: tone }} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r={2.6} style={{ fill: tone }} />
    </svg>
  );
}

function TrendLabel({ delta, suffix }: { delta: number; suffix: string }) {
  const up = delta >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <p
      className={cx(
        "qd-hud mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-semibold",
        up ? "text-[var(--qd-lime)]" : "text-[var(--qd-danger)]"
      )}
    >
      <Icon aria-hidden="true" focusable="false" className="h-4 w-4" />
      {signedPctFormatter.format(delta)}% {suffix}
    </p>
  );
}

function HeroStat({ server }: { server: ServerSnapshot }) {
  const delta = pctChange(server.trend);
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <p className="qd-hud text-[11px] font-semibold tracking-[0.16em] text-[var(--qd-text-faint)]">
            ACTIVE PLAYERS · {server.short}
          </p>
          <p className="qd-display qd-glow mt-2 text-3xl font-bold text-[var(--qd-cyan)] sm:text-4xl lg:text-5xl">
            {numberFormatter.format(server.population)}
          </p>
        </div>
        <Sparkline values={server.trend} tone="var(--qd-cyan-strong)" />
      </div>
      <TrendLabel delta={delta} suffix="concurrent, 7-day trend" />
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
  tone: string;
}) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-center justify-between gap-2">
        <p className="qd-hud text-[11px] font-semibold tracking-[0.16em] text-[var(--qd-text-faint)]">{label}</p>
        <Icon aria-hidden="true" focusable="false" className="h-4 w-4" style={{ color: tone }} />
      </div>
      <p className="qd-display mt-3 text-3xl font-bold sm:text-4xl" style={{ color: tone }}>
        {value}
      </p>
      <p className="qd-hud mt-1 text-xs text-[var(--qd-text-muted)]">{sub}</p>
    </div>
  );
}

function MetricBar({
  label,
  display,
  pct,
  tone,
}: {
  label: string;
  display: string;
  pct: number;
  tone: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="qd-hud tracking-wide text-[var(--qd-text-faint)]">{label}</span>
        <span className="qd-hud font-semibold text-[var(--qd-text-muted)]">{display}</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden bg-white/10" role="presentation">
        <div className="qd-bar-fill h-full" style={{ width: `${clamp(pct, 0, 100)}%`, backgroundColor: tone }} />
      </div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const meta = SEVERITY_META[severity];
  const Icon = meta.icon;
  return (
    <span
      className="qd-cut-xs qd-hud inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold tracking-wide"
      style={{ backgroundColor: meta.soft, color: meta.color }}
    >
      <Icon aria-hidden="true" focusable="false" className="h-3 w-3" />
      {meta.label}
    </span>
  );
}

function Donut({
  data,
}: {
  data: { key: string; label: string; count: number; pct: number; color: string }[];
}) {
  const r = 40;
  const cx0 = 50;
  const cy0 = 50;
  const circumference = 2 * Math.PI * r;
  const summary = data.map((d) => `${d.label} ${d.pct.toFixed(1)}%`).join(", ");
  // Precompute each segment's dash length + cumulative offset without any
  // render-scope mutation (pure derivation per segment).
  const segments = data.map((d, i) => {
    const dash = (d.pct / 100) * circumference;
    const offset = data.slice(0, i).reduce((sum, prev) => sum + (prev.pct / 100) * circumference, 0);
    return { ...d, dash, offset };
  });

  return (
    <svg viewBox="0 0 100 100" width={104} height={104} className="shrink-0" role="img" aria-label={`Sector control share — ${summary}`}>
      <circle cx={cx0} cy={cy0} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={13} />
      {segments.map((seg) => (
        <circle
          key={seg.key}
          cx={cx0}
          cy={cy0}
          r={r}
          fill="none"
          style={{ stroke: seg.color }}
          strokeWidth={13}
          strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
          strokeDashoffset={-seg.offset}
          transform={`rotate(-90 ${cx0} ${cy0})`}
        />
      ))}
      <text x="50" y="46" textAnchor="middle" className="qd-display" style={{ fill: "var(--qd-text)", fontSize: 15, fontWeight: 700 }}>
        32
      </text>
      <text x="50" y="60" textAnchor="middle" style={{ fill: "var(--qd-text-faint)", fontSize: 7 }}>
        SECTORS
      </text>
    </svg>
  );
}

function Ticker({ reducedMotion }: { reducedMotion: boolean }) {
  if (reducedMotion) {
    return (
      <ul aria-label="Live ops updates" className="flex flex-wrap items-center gap-x-8 gap-y-1.5 px-4 py-2.5 text-xs text-[var(--qd-text-muted)] sm:px-6">
        {TICKER_ITEMS.map((item, i) => (
          <li key={i} className="qd-hud whitespace-nowrap">
            {item}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="overflow-hidden py-2.5" aria-label="Live ops updates" role="group">
      <ul className="qd-ticker-track flex w-max items-center gap-8 whitespace-nowrap px-4 text-xs text-[var(--qd-text-muted)] sm:px-6">
        {TICKER_ITEMS.map((item, i) => (
          <li key={`a-${i}`} className="qd-hud">
            {item}
          </li>
        ))}
        {TICKER_ITEMS.map((item, i) => (
          <li key={`b-${i}`} className="qd-hud" aria-hidden="true">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export default function DashboardClient({
  displayFontVariable,
  hudFontVariable,
}: {
  displayFontVariable: string;
  hudFontVariable: string;
}) {
  const reducedMotion = useReducedMotion();
  const [navOpen, setNavOpen] = useState(false);
  const [period, setPeriod] = useState<PeriodKey>("30d");
  const [server, setServer] = useState<ServerKey>("apac");
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

  function onServerTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, currentId: ServerKey) {
    const idx = SERVER_OPTIONS.findIndex((o) => o.id === currentId);
    let nextIdx: number | null = null;
    if (event.key === "ArrowRight") nextIdx = (idx + 1) % SERVER_OPTIONS.length;
    else if (event.key === "ArrowLeft") nextIdx = (idx - 1 + SERVER_OPTIONS.length) % SERVER_OPTIONS.length;
    else if (event.key === "Home") nextIdx = 0;
    else if (event.key === "End") nextIdx = SERVER_OPTIONS.length - 1;
    if (nextIdx !== null) {
      event.preventDefault();
      const next = SERVER_OPTIONS[nextIdx];
      setServer(next.id);
      requestAnimationFrame(() => document.getElementById(`server-tab-${next.id}`)?.focus());
    }
  }

  const economy = ECONOMY[period];
  const avgFaucet = useMemo(() => average(economy.faucet), [economy]);
  const avgSink = useMemo(() => average(economy.sink), [economy]);
  const netPerDay = (avgFaucet - avgSink) * 1000;

  const { faucetLine, faucetArea, sinkLine } = useMemo(() => {
    const all = [...economy.faucet, ...economy.sink];
    const min = Math.min(...all) * 0.94;
    const max = Math.max(...all) * 1.04;
    const faucetPts = scalePoints(economy.faucet, CHART_W, CHART_H, CHART_PAD, min, max);
    const sinkPts = scalePoints(economy.sink, CHART_W, CHART_H, CHART_PAD, min, max);
    return {
      faucetLine: toLine(faucetPts),
      faucetArea: toArea(faucetPts, CHART_H, CHART_PAD),
      sinkLine: toLine(sinkPts),
    };
  }, [economy]);

  const currentServer = SERVERS[server];
  const territoryCounts = useMemo(() => {
    const counts: Record<FactionKey, number> = { ember: 0, volt: 0, toxin: 0, contested: 0 };
    TERRITORY.forEach((f) => {
      counts[f] += 1;
    });
    return (Object.keys(counts) as FactionKey[]).map((key) => ({
      key,
      label: FACTIONS[key].label,
      color: FACTIONS[key].color,
      count: counts[key],
      pct: (counts[key] / TERRITORY.length) * 100,
    }));
  }, []);

  const sortedAlerts = useMemo(() => {
    const relevant = ALERTS.filter((a) => a.server === server || a.server === "global");
    const rest = ALERTS.filter((a) => a.server !== server && a.server !== "global");
    return [...relevant, ...rest];
  }, [server]);

  const criticalCount = useMemo(() => ALERTS.filter((a) => a.severity === "critical").length, []);

  return (
    <div
      lang="en"
      className={cx(
        displayFontVariable,
        hudFontVariable,
        "qd-root qd-dot-bg qd-hud min-h-dvh overflow-x-hidden text-[var(--qd-text)]"
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] qd-cut-sm focus:bg-[var(--qd-cyan-strong)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
      >
        Skip to main content
      </a>

      <div className="relative z-10 flex min-h-dvh lg:flex-row">
        {navOpen && (
          <button type="button" onClick={() => setNavOpen(false)} className="fixed inset-0 z-40 bg-black/70 lg:hidden">
            <span className="sr-only">Close navigation</span>
          </button>
        )}

        <aside
          id="qd-nav"
          className={cx(
            "qd-drawer fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[var(--qd-border)] bg-[var(--qd-panel)] lg:sticky lg:top-0 lg:z-auto lg:h-dvh lg:w-64 lg:translate-x-0",
            navOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-[var(--qd-border)] px-5 py-5">
            <div className="flex items-center gap-2.5">
              <span aria-hidden="true" className="qd-cut-xs flex h-9 w-9 items-center justify-center bg-[var(--qd-magenta-soft)] text-sm font-bold text-[var(--qd-magenta)]">
                QD
              </span>
              <div>
                <p className="qd-display qd-split-text text-sm font-bold tracking-[0.06em] text-[var(--qd-text)]">QUARTERDECK</p>
                <p className="qd-hud text-[10px] tracking-wide text-[var(--qd-text-faint)]">OPS CONSOLE</p>
              </div>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setNavOpen(false)}
              className="qd-focus flex h-11 w-11 items-center justify-center text-[var(--qd-text-muted)] hover:text-[var(--qd-text)] lg:hidden"
            >
              <X aria-hidden="true" className="h-5 w-5" />
              <span className="sr-only">Close navigation</span>
            </button>
          </div>

          <div className="border-b border-[var(--qd-border)] px-5 py-4">
            <p className="qd-hud text-[10px] font-semibold tracking-[0.16em] text-[var(--qd-text-faint)]">WORKSPACE</p>
            <div className="mt-1.5 flex items-center gap-2">
              <span aria-hidden="true" className="qd-pulse h-2 w-2 shrink-0 rounded-full bg-[var(--qd-lime-strong)]" />
              <p className="qd-hud text-sm font-semibold text-[var(--qd-text)]">NEONSPIRE</p>
            </div>
            <p className="qd-hud mt-0.5 text-[11px] text-[var(--qd-text-faint)]">Hollow Coin Games · Live shard</p>
          </div>

          <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item, i) => {
                const Icon = item.icon;
                const isCurrent = i === 0;
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={() => setNavOpen(false)}
                      aria-current={isCurrent ? "page" : undefined}
                      className={cx(
                        "qd-focus flex min-h-11 w-full items-center gap-3 px-3 text-sm font-medium transition-colors",
                        isCurrent
                          ? "qd-cut-sm bg-[var(--qd-cyan-soft)] text-[var(--qd-cyan)]"
                          : "text-[var(--qd-text-muted)] hover:bg-white/5 hover:text-[var(--qd-text)]"
                      )}
                    >
                      <Icon aria-hidden="true" focusable="false" className="h-5 w-5 shrink-0" />
                      <span className="qd-hud flex-1 text-left tracking-[0.02em]">{item.label}</span>
                      {item.id === "alerts" && criticalCount > 0 && (
                        <span
                          className="qd-hud qd-cut-xs inline-flex h-5 min-w-5 items-center justify-center bg-[var(--qd-danger-strong)] px-1 text-[10px] font-bold text-black"
                          aria-label={`${criticalCount} critical alerts`}
                        >
                          {criticalCount}
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-[var(--qd-border)] px-5 py-4">
            <div className="flex items-center gap-2.5">
              <span
                role="img"
                aria-label="Signed in as J. Okafor, Lead Live-Ops Producer"
                className="qd-hud flex h-9 w-9 items-center justify-center rounded-full border border-[var(--qd-border-strong)] bg-[var(--qd-bg-alt)] text-xs font-bold text-[var(--qd-lime)]"
              >
                JO
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-[var(--qd-text)]">J. Okafor</p>
                <p className="qd-hud truncate text-[10px] text-[var(--qd-text-faint)]">Lead Live-Ops Producer</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-[var(--qd-border)] bg-[var(--qd-panel)]/95 backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
              <button
                ref={hamburgerRef}
                type="button"
                onClick={() => setNavOpen(true)}
                aria-expanded={navOpen}
                aria-controls="qd-nav"
                className="qd-focus flex h-11 w-11 items-center justify-center text-[var(--qd-text-muted)] hover:text-[var(--qd-text)] lg:hidden"
              >
                <Menu aria-hidden="true" className="h-5 w-5" />
                <span className="sr-only">Open navigation</span>
              </button>

              <p className="qd-hud text-xs font-semibold tracking-[0.1em] text-[var(--qd-text-muted)]">
                NEONSPIRE <span aria-hidden="true" className="text-[var(--qd-text-faint)]">/</span> Ops Deck
              </p>

              <div className="ml-auto flex items-center gap-3">
                <span className="qd-hud hidden items-center gap-1.5 text-[11px] text-[var(--qd-text-muted)] sm:flex">
                  <span aria-hidden="true" className="qd-pulse h-1.5 w-1.5 rounded-full bg-[var(--qd-lime-strong)]" />
                  {SNAPSHOT_LABEL}
                </span>
                <a
                  href="#alerts"
                  className="qd-focus relative flex h-11 w-11 items-center justify-center text-[var(--qd-text-muted)] hover:text-[var(--qd-text)]"
                >
                  <BellRing aria-hidden="true" className="h-5 w-5" />
                  {criticalCount > 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--qd-danger-strong)]"
                    />
                  )}
                  <span className="sr-only">Jump to live alerts, {criticalCount} critical</span>
                </a>
              </div>
            </div>
            <div className="border-t border-[var(--qd-border)]">
              <Ticker reducedMotion={reducedMotion} />
            </div>
          </header>

          <main
            id="main"
            tabIndex={-1}
            className="flex-1 space-y-8 px-4 py-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--qd-cyan-strong)] sm:px-6 lg:px-8 lg:py-8"
          >
            <div>
              <h1 className="qd-display qd-glow text-2xl font-bold tracking-[0.02em] text-[var(--qd-text)] sm:text-3xl">
                Ops Deck
              </h1>
              <p className="mt-1.5 max-w-prose text-sm text-[var(--qd-text-muted)]">
                NEONSPIRE&rsquo;s live economy, guild territory and esports pipeline, one console. Static snapshot —
                not a live tick.
              </p>
            </div>

            {/* Command row — key metrics */}
            <section aria-labelledby="metrics-heading">
              <h2 id="metrics-heading" className="sr-only">
                Key metrics
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
                <Panel className="sm:col-span-2 lg:col-span-6">
                  <HeroStat server={currentServer} />
                </Panel>
                <Panel className="lg:col-span-3">
                  <StatTile
                    icon={Swords}
                    label="GUILDS AT WAR"
                    value="14"
                    sub="+3 territory conflicts vs last week"
                    tone="var(--qd-magenta)"
                  />
                </Panel>
                <Panel className="lg:col-span-3">
                  <StatTile
                    icon={ShieldAlert}
                    label="OPEN EXPLOIT FLAGS"
                    value={String(criticalCount)}
                    sub="Sectors under active investigation"
                    tone="var(--qd-danger)"
                  />
                </Panel>
              </div>
            </section>

            {/* Economy + Server ops */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <section aria-labelledby="economy-pulse-heading" className="lg:col-span-8">
                <Panel hero id="economy-pulse">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h2 id="economy-pulse-heading" className="qd-display text-base font-bold tracking-[0.02em] text-[var(--qd-text)]">
                        Economy Pulse
                      </h2>
                      <p className="qd-hud mt-1 text-[11px] text-[var(--qd-text-faint)]">
                        Glimmer faucet vs. sink, {PERIOD_FULL_LABEL[period]}
                      </p>
                    </div>
                    <div role="group" aria-label="Select time range" className="inline-flex shrink-0 gap-1 self-start bg-[var(--qd-bg-alt)] p-1">
                      {PERIOD_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          aria-pressed={period === opt.id}
                          onClick={() => setPeriod(opt.id)}
                          className={cx(
                            "qd-focus qd-cut-xs qd-hud min-h-11 min-w-14 px-3 text-xs font-bold tracking-wide transition-colors",
                            period === opt.id
                              ? "bg-[var(--qd-cyan-strong)] text-black"
                              : "text-[var(--qd-text-muted)] hover:text-[var(--qd-text)]"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <p className="qd-display text-3xl font-bold text-[var(--qd-lime)] sm:text-4xl">
                      {signedCompactFormatter.format(netPerDay)} GLM
                    </p>
                    <p className="qd-hud text-xs text-[var(--qd-text-muted)]">net flow / day</p>
                  </div>
                  <p
                    className={cx(
                      "qd-hud mt-1 text-xs font-semibold",
                      economy.health.tone === "amber" ? "text-[var(--qd-amber)]" : "text-[var(--qd-danger)]"
                    )}
                  >
                    {economy.health.label}
                  </p>

                  <svg
                    viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                    className="mt-5 h-auto w-full"
                    role="img"
                    aria-label={`Faucet averaging ${compactFormatter.format(avgFaucet * 1000)} Glimmer per day, sink averaging ${compactFormatter.format(avgSink * 1000)} Glimmer per day, over the ${PERIOD_FULL_LABEL[period]}.`}
                  >
                    <defs>
                      <linearGradient id="qd-faucet-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--qd-cyan-strong)" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="var(--qd-cyan-strong)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[0.25, 0.5, 0.75].map((t) => (
                      <line
                        key={t}
                        x1={CHART_PAD}
                        x2={CHART_W - CHART_PAD}
                        y1={CHART_PAD + (CHART_H - CHART_PAD * 2) * t}
                        y2={CHART_PAD + (CHART_H - CHART_PAD * 2) * t}
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth={1}
                      />
                    ))}
                    <path d={faucetArea} fill="url(#qd-faucet-fill)" />
                    <path d={faucetLine} fill="none" stroke="var(--qd-cyan-strong)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                    <path
                      d={sinkLine}
                      fill="none"
                      stroke="var(--qd-magenta-strong)"
                      strokeWidth={2.5}
                      strokeDasharray="6 5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
                    <span className="qd-hud inline-flex items-center gap-1.5 text-[var(--qd-text-muted)]">
                      <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[1px] bg-[var(--qd-cyan-strong)]" />
                      Faucet — {compactFormatter.format(avgFaucet * 1000)} GLM/day
                    </span>
                    <span className="qd-hud inline-flex items-center gap-1.5 text-[var(--qd-text-muted)]">
                      <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[1px] bg-[var(--qd-magenta-strong)]" />
                      Sink — {compactFormatter.format(avgSink * 1000)} GLM/day
                    </span>
                  </div>
                </Panel>
              </section>

              <section aria-labelledby="server-ops-heading" className="lg:col-span-4">
                <Panel id="server-ops" className="h-full">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 id="server-ops-heading" className="qd-display text-base font-bold tracking-[0.02em] text-[var(--qd-text)]">
                      Server Ops
                    </h2>
                    <span
                      className={cx(
                        "qd-hud inline-flex items-center gap-1.5 text-[11px] font-semibold",
                        currentServer.tone === "lime" ? "text-[var(--qd-lime)]" : "text-[var(--qd-amber)]"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cx("qd-pulse h-1.5 w-1.5 rounded-full", currentServer.tone === "lime" ? "bg-[var(--qd-lime-strong)]" : "bg-[var(--qd-amber-strong)]")}
                      />
                      {currentServer.status}
                    </span>
                  </div>

                  <div role="tablist" aria-label="Select server region" className="mt-4 flex gap-1.5">
                    {SERVER_OPTIONS.map((opt) => {
                      const selected = opt.id === server;
                      return (
                        <button
                          key={opt.id}
                          role="tab"
                          id={`server-tab-${opt.id}`}
                          aria-selected={selected}
                          aria-controls={`server-panel-${opt.id}`}
                          tabIndex={selected ? 0 : -1}
                          onClick={() => setServer(opt.id)}
                          onKeyDown={(event) => onServerTabKeyDown(event, opt.id)}
                          className={cx(
                            "qd-focus qd-cut-xs qd-hud min-h-11 flex-1 px-2 text-xs font-bold tracking-wide transition-colors",
                            selected
                              ? "bg-[var(--qd-magenta-strong)] text-black"
                              : "bg-[var(--qd-bg-alt)] text-[var(--qd-text-muted)] hover:text-[var(--qd-text)]"
                          )}
                        >
                          {opt.short}
                        </button>
                      );
                    })}
                  </div>

                  <div
                    id={`server-panel-${server}`}
                    role="tabpanel"
                    aria-labelledby={`server-tab-${server}`}
                    tabIndex={0}
                    className="qd-focus mt-5 space-y-4"
                  >
                    <div>
                      <p className="qd-hud text-[11px] font-semibold tracking-[0.16em] text-[var(--qd-text-faint)]">
                        {currentServer.label.toUpperCase()} UPTIME
                      </p>
                      <p className="qd-display mt-1 text-2xl font-bold text-[var(--qd-text)]">
                        {uptimeFormatter.format(currentServer.uptime)}
                      </p>
                    </div>
                    <MetricBar
                      label="MATCHMAKING QUEUE"
                      display={`${currentServer.queueSec}s`}
                      pct={(currentServer.queueSec / 60) * 100}
                      tone={currentServer.queueSec > 30 ? "var(--qd-danger-strong)" : currentServer.queueSec > 15 ? "var(--qd-amber-strong)" : "var(--qd-lime-strong)"}
                    />
                    <MetricBar
                      label="AVG PING"
                      display={`${currentServer.ping}ms`}
                      pct={(currentServer.ping / 100) * 100}
                      tone={currentServer.ping > 55 ? "var(--qd-amber-strong)" : "var(--qd-cyan-strong)"}
                    />
                  </div>
                </Panel>
              </section>
            </div>

            {/* Guild territory + Retention */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <section aria-labelledby="guild-territory-heading" className="lg:col-span-7">
                <Panel id="guild-territory" className="h-full">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h2 id="guild-territory-heading" className="qd-display text-base font-bold tracking-[0.02em] text-[var(--qd-text)]">
                        Guild Territory
                      </h2>
                      <p className="qd-hud mt-1 text-[11px] text-[var(--qd-text-faint)]">NEONSPIRE shard · 32 sectors</p>
                    </div>
                    <Donut data={territoryCounts} />
                  </div>

                  <ul className="mt-5 grid grid-cols-8 gap-1.5" aria-label="Sector control map, 32 sectors">
                    {TERRITORY.map((f, i) => (
                      <li
                        key={i}
                        className="qd-cut-xs aspect-square"
                        style={{ backgroundColor: FACTIONS[f].color }}
                        title={`Sector ${i + 1}: ${FACTIONS[f].label}`}
                      >
                        <span className="sr-only">{`Sector ${i + 1}: ${FACTIONS[f].label}`}</span>
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                    {territoryCounts.map((f) => (
                      <li key={f.key} className="qd-hud inline-flex items-center gap-1.5 text-xs text-[var(--qd-text-muted)]">
                        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[1px]" style={{ backgroundColor: f.color }} />
                        {f.label} — {f.count} ({f.pct.toFixed(1)}%)
                      </li>
                    ))}
                  </ul>
                </Panel>
              </section>

              <section aria-labelledby="retention-heading" className="lg:col-span-5">
                <Panel className="h-full">
                  <h2 id="retention-heading" className="qd-display text-base font-bold tracking-[0.02em] text-[var(--qd-text)]">
                    Retention Cohort
                  </h2>
                  <p className="qd-hud mt-1 text-[11px] text-[var(--qd-text-faint)]">Cohort of players who first joined the week of Jun 15, 2026</p>

                  <div className="mt-6 flex h-40 items-end justify-between gap-2 sm:gap-3">
                    {RETENTION.map((r) => {
                      const pct = clamp((r.value / 0.7) * 100, 4, 100);
                      return (
                        <div key={r.label} className="flex h-full flex-1 flex-col items-center gap-2">
                          <span className="qd-hud text-[11px] font-semibold text-[var(--qd-text-muted)]">
                            {pctFormatter.format(r.value)}
                          </span>
                          <div className="flex w-full flex-1 items-end">
                            <div
                              className="qd-bar-fill qd-cut-xs w-full bg-[var(--qd-lime-strong)]"
                              style={{ height: `${pct}%` }}
                            />
                          </div>
                          <span className="qd-hud text-[10px] tracking-wide text-[var(--qd-text-faint)]">{r.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </Panel>
              </section>
            </div>

            {/* Scouting + Alerts */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <section aria-labelledby="scouting-heading" className="lg:col-span-7">
                <Panel id="scouting" className="h-full overflow-x-auto">
                  <h2 id="scouting-heading" className="qd-display text-base font-bold tracking-[0.02em] text-[var(--qd-text)]">
                    Scouting Radar
                  </h2>
                  <p className="qd-hud mt-1 text-[11px] text-[var(--qd-text-faint)]">Top prospects by composite rating, all regions</p>

                  <table className="mt-4 w-full min-w-[420px] text-left text-sm">
                    <caption className="sr-only">Esports scouting leaderboard, ranked by composite rating</caption>
                    <thead>
                      <tr className="qd-hud text-[10px] tracking-[0.1em] text-[var(--qd-text-faint)]">
                        <th scope="col" className="py-2 pr-2 font-semibold">
                          RANK
                        </th>
                        <th scope="col" className="py-2 pr-2 font-semibold">
                          PROSPECT
                        </th>
                        <th scope="col" className="hidden py-2 pr-2 font-semibold sm:table-cell">
                          ROLE
                        </th>
                        <th scope="col" className="hidden py-2 pr-2 font-semibold sm:table-cell">
                          REGION
                        </th>
                        <th scope="col" className="py-2 pr-2 font-semibold">
                          RATING
                        </th>
                        <th scope="col" className="py-2 font-semibold">
                          TREND
                        </th>
                      </tr>
                    </thead>
                    <tbody className="qd-row-divider">
                      {SCOUTS.map((s) => {
                        const rankTone =
                          s.rank === 1 ? "var(--qd-amber-strong)" : s.rank === 2 ? "var(--qd-cyan-strong)" : s.rank === 3 ? "var(--qd-magenta-strong)" : null;
                        const up = s.trend >= 0;
                        const TrendIcon = up ? TrendingUp : TrendingDown;
                        return (
                          <tr key={s.rank}>
                            <td className="py-2.5 pr-2">
                              {rankTone ? (
                                <span
                                  className="qd-cut-xs qd-display inline-flex h-6 w-6 items-center justify-center text-xs font-bold text-black"
                                  style={{ backgroundColor: rankTone }}
                                >
                                  {s.rank}
                                </span>
                              ) : (
                                <span className="qd-hud text-xs text-[var(--qd-text-faint)]">#{s.rank}</span>
                              )}
                            </td>
                            <td className="py-2.5 pr-2 font-semibold text-[var(--qd-text)]">{s.handle}</td>
                            <td className="hidden py-2.5 pr-2 text-[var(--qd-text-muted)] sm:table-cell">{s.role}</td>
                            <td className="hidden py-2.5 pr-2 text-[var(--qd-text-muted)] sm:table-cell">{s.region}</td>
                            <td className="py-2.5 pr-2">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-16 overflow-hidden bg-white/10" role="presentation">
                                  <div
                                    className="qd-bar-fill h-full bg-[var(--qd-cyan-strong)]"
                                    style={{ width: `${s.rating}%` }}
                                  />
                                </div>
                                <span className="qd-hud text-xs font-semibold text-[var(--qd-text)]">{ratingFormatter.format(s.rating)}</span>
                              </div>
                            </td>
                            <td className="py-2.5">
                              <span
                                className={cx(
                                  "qd-hud inline-flex items-center gap-1 text-xs font-semibold",
                                  up ? "text-[var(--qd-lime)]" : "text-[var(--qd-danger)]"
                                )}
                              >
                                <TrendIcon aria-hidden="true" focusable="false" className="h-3.5 w-3.5" />
                                {signedPctFormatter.format(s.trend)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Panel>
              </section>

              <section aria-labelledby="alerts-heading" className="lg:col-span-5">
                <Panel id="alerts" className="h-full">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 id="alerts-heading" className="qd-display text-base font-bold tracking-[0.02em] text-[var(--qd-text)]">
                      Live Alerts
                    </h2>
                    <span className="qd-hud text-[11px] text-[var(--qd-text-faint)]">
                      Sorted for {SERVER_TAG_LABEL[server]}
                    </span>
                  </div>

                  <ul className="mt-4 space-y-3">
                    {sortedAlerts.map((a) => {
                      const meta = SEVERITY_META[a.severity];
                      return (
                        <li
                          key={a.id}
                          className="qd-cut-xs border-l-4 bg-white/[0.03] p-3"
                          style={{ borderLeftColor: meta.color }}
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <SeverityBadge severity={a.severity} />
                            <span className="qd-hud text-[10px] font-semibold tracking-wide text-[var(--qd-text-faint)]">
                              {SERVER_TAG_LABEL[a.server]}
                            </span>
                            <span className="qd-hud ml-auto text-[11px] text-[var(--qd-text-faint)]">{a.time}</span>
                          </div>
                          <p className="mt-1.5 text-sm text-[var(--qd-text)]">{a.message}</p>
                        </li>
                      );
                    })}
                  </ul>
                </Panel>
              </section>
            </div>
          </main>

          <footer className="border-t border-[var(--qd-border)] px-4 py-5 sm:px-6 lg:px-8">
            <p className="qd-hud text-[11px] text-[var(--qd-text-faint)]">
              QUARTERDECK Ops Console · NEONSPIRE shard · {SNAPSHOT_LABEL}
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
