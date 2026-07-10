"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import {
  Archive,
  BookMarked,
  FileText,
  Languages as LanguagesIcon,
  Mic,
  TriangleAlert,
} from "lucide-react";
import "./stele.css";
import {
  attentionItems,
  contributors,
  deltaByRange,
  languageFamilies,
  languages,
  medianDaysToArchive,
  pipelineStages,
  queue,
  stageLabel,
  statusBreakdown,
  statusLabel,
  submissionsByRange,
  totalHoursArchived,
  asOfLabel,
  type EndangermentStatus,
  type QueueItem,
  type StageKey,
  type TimeRange,
} from "./data";

const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

const MONO = "font-[family-name:var(--font-plex-mono)]";

const nf = new Intl.NumberFormat("en-US");
const hoursFmt = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);

const languageByCode = Object.fromEntries(languages.map((l) => [l.code, l]));

const STAGE_ICON: Record<StageKey, typeof Mic> = {
  capture: Mic,
  transcription: FileText,
  review: BookMarked,
  translation: LanguagesIcon,
  archived: Archive,
};

const STATUS_SWATCH: Record<EndangermentStatus, string> = {
  vulnerable: "bg-[rgba(21,20,15,0.25)]",
  definitely_endangered: "bg-[rgba(21,20,15,0.45)]",
  severely_endangered: "bg-[rgba(21,20,15,0.7)]",
  critically_endangered: "bg-[var(--accent)]",
  dormant: "bg-[var(--ink)]",
};

const STATUS_STROKE: Record<EndangermentStatus, string> = {
  vulnerable: "stroke-[var(--ink-20)]",
  definitely_endangered: "stroke-[color:rgba(21,20,15,0.45)]",
  severely_endangered: "stroke-[color:rgba(21,20,15,0.7)]",
  critically_endangered: "stroke-[var(--accent)]",
  dormant: "stroke-[var(--ink)]",
};

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "pipeline", label: "Pipeline" },
  { key: "corpus", label: "Corpus" },
  { key: "contributors", label: "Contributors" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const RANGES: TimeRange[] = ["7D", "30D", "90D", "ALL"];

function StatusBadge({ status }: { status: EndangermentStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ink-70)]">
      <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-[1px] ${STATUS_SWATCH[status]}`} />
      {statusLabel[status]}
    </span>
  );
}

function StageBadge({ stage }: { stage: StageKey }) {
  const Icon = STAGE_ICON[stage];
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-[var(--ink-70)]">
      <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
      {stageLabel[stage]}
    </span>
  );
}

/** Horizontal bar built from real SVG geometry (viewBox 0–200 == 0–100%), not inline styles. */
function BarRow({
  label,
  value,
  valueLabel,
  pct,
  emphasize = false,
}: {
  label: string;
  value: string;
  valueLabel: string;
  pct: number;
  emphasize?: boolean;
}) {
  const clamped = Math.max(2, Math.min(100, pct));
  return (
    <li className="flex items-center gap-3 py-2">
      <span className="w-28 shrink-0 truncate text-sm text-[var(--ink-70)] sm:w-36">{label}</span>
      <svg
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        className="h-3 flex-1"
        role="img"
        aria-label={`${label}: ${valueLabel}`}
      >
        <rect x="0" y="0" width="200" height="12" className="fill-[var(--ink-10)]" rx="1" />
        <rect
          x="0"
          y="0"
          width={clamped * 2}
          height="12"
          rx="1"
          className={emphasize ? "fill-[var(--accent)]" : "fill-[var(--ink)]"}
        />
      </svg>
      <span className={`${MONO} w-16 shrink-0 text-right text-sm tabular-nums text-[var(--ink)]`}>{value}</span>
    </li>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const width = 320;
  const height = 96;
  const pad = 6;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const stepX = (width - pad * 2) / (values.length - 1);
  const points = values.map((v, i) => {
    const x = pad + i * stepX;
    const y = pad + (height - pad * 2) * (1 - (v - min) / span);
    return { x, y };
  });
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${height - pad} L${points[0].x.toFixed(1)},${height - pad} Z`;
  const gradientId = useId();

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-24 w-full"
      role="img"
      aria-label={`Submission velocity across ${values.length} periods, from ${nf.format(values[0])} to ${nf.format(values[values.length - 1])}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={pad}
          x2={width - pad}
          y1={pad + (height - pad * 2) * f}
          y2={pad + (height - pad * 2) * f}
          className="stroke-[var(--ink-10)]"
          strokeWidth="1"
        />
      ))}
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path d={linePath} fill="none" className="stroke-[var(--accent)]" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i === points.length - 1 ? 3.5 : 2}
          className={i === points.length - 1 ? "fill-[var(--accent)]" : "fill-[var(--ink)]"}
        />
      ))}
    </svg>
  );
}

function Donut({ segments }: { segments: { status: EndangermentStatus; hours: number }[] }) {
  const total = segments.reduce((s, x) => s + x.hours, 0);
  const radius = 15.9155;
  const arcs = segments.reduce<{ status: EndangermentStatus; pct: number; offset: number }[]>((acc, s) => {
    const pct = (s.hours / total) * 100;
    const priorSum = acc.reduce((sum, a) => sum + a.pct, 0);
    acc.push({ status: s.status, pct, offset: 25 - priorSum });
    return acc;
  }, []);
  return (
    <svg viewBox="0 0 42 42" className="h-40 w-40" role="img" aria-label={`Archived hours by endangerment status, ${hoursFmt(total)} hours total`}>
      <circle cx="21" cy="21" r={radius} className="fill-none stroke-[var(--ink-10)]" strokeWidth="5" />
      {arcs.map((s) => (
        <circle
          key={s.status}
          cx="21"
          cy="21"
          r={radius}
          fill="none"
          strokeWidth="5"
          pathLength={100}
          strokeDasharray={`${s.pct} ${100 - s.pct}`}
          strokeDashoffset={s.offset}
          className={STATUS_STROKE[s.status]}
        />
      ))}
      <text x="21" y="19.5" textAnchor="middle" className={`${MONO} fill-[var(--ink)]`} style={{ fontSize: "5.4px" }}>
        {hoursFmt(total)}
      </text>
      <text x="21" y="25.5" textAnchor="middle" className="fill-[var(--ink-70)]" style={{ fontSize: "3px" }}>
        HRS ARCHIVED
      </text>
    </svg>
  );
}

function FunnelRow({
  index,
  stageKey,
  count,
  maxCount,
  active,
  onSelect,
}: {
  index: number;
  stageKey: StageKey;
  count: number;
  maxCount: number;
  active: boolean;
  onSelect: (stage: StageKey) => void;
}) {
  const pct = Math.max(4, (count / maxCount) * 100);
  const Icon = STAGE_ICON[stageKey];
  const isFinal = stageKey === "archived";
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(stageKey)}
        aria-pressed={active}
        className="group flex w-full items-center gap-3 border-b border-[var(--ink-10)] py-3 text-left last:border-b-0 focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-2"
      >
        <span className={`${MONO} stele-index w-6 shrink-0 text-xs text-[var(--ink-45)]`}>{String(index + 1).padStart(2, "0")}</span>
        <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--ink-70)]" strokeWidth={2} />
        <span className="w-32 shrink-0 text-sm font-medium text-[var(--ink)] sm:w-40">{stageLabel[stageKey]}</span>
        <svg
          viewBox="0 0 200 14"
          preserveAspectRatio="none"
          className="h-3.5 flex-1"
          role="img"
          aria-label={`${stageLabel[stageKey]}: ${nf.format(count)} items`}
        >
          <rect x="0" y="0" width="200" height="14" rx="1" className="fill-[var(--ink-10)]" />
          <rect
            x="0"
            y="0"
            width={pct * 2}
            height="14"
            rx="1"
            className={`transition-[width] duration-300 ease-out ${isFinal ? "fill-[var(--accent)]" : "fill-[var(--ink)]"} ${active ? "opacity-100" : "opacity-80 group-hover:opacity-100"}`}
          />
        </svg>
        <span className={`${MONO} w-14 shrink-0 text-right text-sm tabular-nums text-[var(--ink)]`}>{nf.format(count)}</span>
      </button>
    </li>
  );
}

function QueueTable({ items, caption }: { items: QueueItem[]; caption: string }) {
  return (
    <div className="stele-scroll overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <caption className="mb-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-70)]">
          {caption}
        </caption>
        <thead>
          <tr className="border-b border-[var(--ink)] text-xs uppercase tracking-[0.08em] text-[var(--ink-70)]">
            <th scope="col" className="py-2 pr-4 font-medium">Shelfmark</th>
            <th scope="col" className="py-2 pr-4 font-medium">Language</th>
            <th scope="col" className="py-2 pr-4 font-medium">Dialect</th>
            <th scope="col" className="py-2 pr-4 font-medium">Contributor</th>
            <th scope="col" className="py-2 pr-4 font-medium">Stage</th>
            <th scope="col" className="py-2 pr-4 font-medium">Duration</th>
            <th scope="col" className="py-2 pr-0 text-right font-medium">Days in stage</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const lang = languageByCode[item.languageCode];
            const stalled = item.daysInStage >= 14;
            return (
              <tr key={item.shelfmark} className="border-b border-[var(--ink-10)]">
                <td className={`${MONO} py-2.5 pr-4 tabular-nums text-[var(--ink-70)]`}>{item.shelfmark}</td>
                <td className="py-2.5 pr-4 font-medium text-[var(--ink)]">{lang?.name ?? item.languageCode}</td>
                <td className="py-2.5 pr-4 text-[var(--ink-70)]">{item.dialect}</td>
                <td className="py-2.5 pr-4 text-[var(--ink-70)]">{item.contributor}</td>
                <td className="py-2.5 pr-4"><StageBadge stage={item.stage} /></td>
                <td className={`${MONO} py-2.5 pr-4 tabular-nums text-[var(--ink-70)]`}>{item.duration}</td>
                <td className="py-2.5 pr-0 text-right">
                  <span
                    className={`${MONO} inline-flex items-center gap-1 tabular-nums ${stalled ? "font-semibold text-[var(--accent)]" : "text-[var(--ink-70)]"}`}
                  >
                    {stalled ? <TriangleAlert aria-hidden="true" className="h-3.5 w-3.5" /> : null}
                    {item.daysInStage}d
                  </span>
                </td>
              </tr>
            );
          })}
          {items.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-6 text-center text-sm text-[var(--ink-45)]">
                No documents in this stage right now.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

export default function DashboardClient() {
  const [tab, setTab] = useState<TabKey>("overview");
  const [range, setRange] = useState<TimeRange>("30D");
  const [stageFilter, setStageFilter] = useState<StageKey | "all">("all");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const dir = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + dir + TABS.length) % TABS.length;
    setTab(TABS[next].key);
    tabRefs.current[next]?.focus();
  }

  const maxStageCount = Math.max(...pipelineStages.map((s) => s.count));
  const filteredQueue = stageFilter === "all" ? queue : queue.filter((q) => q.stage === stageFilter);
  const maxFamilyHours = Math.max(...languageFamilies.map((f) => f.hours));
  const maxContributorHours = Math.max(...contributors.map((c) => c.hoursThisQuarter));

  return (
    <div className={`${archivo.variable} ${plexMono.variable} stele font-[family-name:var(--font-archivo)]`}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[var(--ink)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[var(--paper)]"
      >
        Skip to main content
      </a>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <header className="flex flex-col gap-4 border-b-2 border-[var(--ink)] py-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-baseline gap-4">
            <p className={`${MONO} text-2xl font-semibold tracking-[0.04em] text-[var(--ink)] sm:text-3xl`}>STELE</p>
            <p className="hidden text-sm text-[var(--ink-70)] sm:block">
              Workspace — LC-04 · Caucasus &amp; Pacific Corpora
            </p>
          </div>
          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <p className={`${MONO} text-xs text-[var(--ink-45)]`}>{asOfLabel}</p>
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`${MONO} flex h-9 w-9 items-center justify-center rounded-full border border-[var(--ink)] text-xs font-semibold text-[var(--ink)]`}
              >
                MO
              </span>
              <span className="text-sm leading-tight text-[var(--ink)]">
                M. Okonkwo-Reyes
                <span className="block text-xs text-[var(--ink-45)]">Field Archivist · Lead</span>
              </span>
            </div>
          </div>
        </header>

        <nav aria-label="Dashboard sections" className="border-b border-[var(--ink-20)]">
          <div role="tablist" aria-label="Dashboard views" className="stele-scroll -mx-1 flex overflow-x-auto px-1">
            {TABS.map((t, i) => {
              const selected = tab === t.key;
              return (
                <button
                  key={t.key}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`tab-${t.key}`}
                  aria-selected={selected}
                  aria-controls={`panel-${t.key}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setTab(t.key)}
                  onKeyDown={(e) => handleTabKeyDown(e, i)}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-[-2px] ${
                    selected
                      ? "border-[var(--accent)] text-[var(--ink)]"
                      : "border-transparent text-[var(--ink-45)] hover:text-[var(--ink-70)]"
                  }`}
                >
                  <span className={`${MONO} stele-index text-xs`}>{String(i + 1).padStart(2, "0")}</span>
                  {t.label}
                </button>
              );
            })}
          </div>
        </nav>

        <main id="main" className="py-8 sm:py-10">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
            Archive Operations Console
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-70)]">
            Digitization, review, and translation status across the active field corpus — eight languages,
            nine documents in motion.
          </p>

          {tab === "overview" ? (
            <section
              id="panel-overview"
              role="tabpanel"
              aria-labelledby="tab-overview"
              tabIndex={0}
              className="stele-panel mt-8 grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12"
            >
              <div className="lg:col-span-7">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-70)]">
                    Ledger — Documented Audio
                  </h2>
                  <div role="group" aria-label="Select time range" className="flex gap-1">
                    {RANGES.map((r) => (
                      <button
                        key={r}
                        type="button"
                        aria-pressed={range === r}
                        onClick={() => setRange(r)}
                        className={`${MONO} flex min-h-[44px] min-w-[44px] items-center justify-center rounded-sm px-2 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] ${
                          range === r
                            ? "bg-[var(--ink)] text-[var(--paper)]"
                            : "text-[var(--ink-70)] hover:bg-[var(--ink-10)]"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <p className={`${MONO} mt-4 text-6xl font-semibold leading-none text-[var(--accent)] sm:text-7xl`}>
                  {hoursFmt(totalHoursArchived)}
                </p>
                <p className="mt-2 text-sm text-[var(--ink-70)]">
                  Hours of field audio archived to date ·{" "}
                  <span className="font-medium text-[var(--ink)]">{deltaByRange[range]}</span>
                </p>

                <div className="mt-6">
                  <Sparkline values={submissionsByRange[range]} />
                  <p className="mt-1 text-xs text-[var(--ink-45)]">Submissions logged per period, {range} window.</p>
                </div>

                <dl className="mt-8 grid grid-cols-1 gap-4 border-t border-[var(--ink-20)] pt-6 sm:grid-cols-3">
                  <div>
                    <dt className={`${MONO} stele-index text-xs text-[var(--ink-45)]`}>02 — Languages active</dt>
                    <dd className={`${MONO} mt-1 text-2xl font-semibold text-[var(--ink)]`}>{languages.length}</dd>
                  </div>
                  <div>
                    <dt className={`${MONO} stele-index text-xs text-[var(--ink-45)]`}>03 — Contributors this quarter</dt>
                    <dd className={`${MONO} mt-1 text-2xl font-semibold text-[var(--ink)]`}>{contributors.length}</dd>
                  </div>
                  <div>
                    <dt className={`${MONO} stele-index text-xs text-[var(--ink-45)]`}>04 — Median days to archive</dt>
                    <dd className={`${MONO} mt-1 text-2xl font-semibold text-[var(--ink)]`}>{medianDaysToArchive}</dd>
                  </div>
                </dl>

                <p className={`${MONO} mt-6 border-t border-[var(--ink-20)] pt-4 text-xs text-[var(--ink-45)]`}>
                  Pipeline flow — {pipelineStages.map((s) => nf.format(s.count)).join(" → ")}
                </p>
              </div>

              <div className="lg:col-span-5">
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-70)]">
                  Endangerment Distribution
                </h2>
                <div className="mt-4 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                  <Donut segments={statusBreakdown} />
                  <ul className="flex flex-1 flex-col gap-2.5">
                    {statusBreakdown.map((s) => (
                      <li key={s.status} className="flex items-center justify-between gap-3 text-sm">
                        <StatusBadge status={s.status} />
                        <span className={`${MONO} tabular-nums text-[var(--ink)]`}>{hoursFmt(s.hours)}h</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-70)]">
                  Flagged — stalled 14+ days
                </h3>
                {attentionItems.length > 0 ? (
                  <ul className="mt-4 flex flex-col gap-3">
                    {attentionItems.map((item) => {
                      const lang = languageByCode[item.languageCode];
                      return (
                        <li
                          key={item.shelfmark}
                          className="flex items-start gap-3 border-l-2 border-[var(--accent)] bg-[var(--accent-10)] px-3 py-2.5"
                        >
                          <TriangleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[var(--ink)]">
                              {lang?.name} <span className="text-[var(--ink-45)]">— {item.dialect}</span>
                            </p>
                            <p className={`${MONO} text-xs text-[var(--ink-70)]`}>
                              {item.shelfmark} · {stageLabel[item.stage]} · {item.daysInStage} days in stage
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-[var(--ink-45)]">Nothing stalled — every document is moving.</p>
                )}
              </div>
            </section>
          ) : null}

          {tab === "pipeline" ? (
            <section
              id="panel-pipeline"
              role="tabpanel"
              aria-labelledby="tab-pipeline"
              tabIndex={0}
              className="stele-panel mt-8"
            >
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-70)]">
                Digitization Pipeline
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-[var(--ink-70)]">
                Select a stage to filter the active queue below. Values are documents currently sitting in each
                stage.
              </p>
              <ol className="mt-5 border-t border-[var(--ink-20)]">
                {pipelineStages.map((s, i) => (
                  <FunnelRow
                    key={s.key}
                    index={i}
                    stageKey={s.key}
                    count={s.count}
                    maxCount={maxStageCount}
                    active={stageFilter === s.key}
                    onSelect={(stage) => setStageFilter((prev) => (prev === stage ? "all" : stage))}
                  />
                ))}
              </ol>

              <div className="mt-8 flex items-center justify-between gap-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-70)]">
                  Active Queue
                </h2>
                {stageFilter !== "all" ? (
                  <button
                    type="button"
                    onClick={() => setStageFilter("all")}
                    className={`${MONO} flex min-h-[44px] items-center rounded-sm px-2 text-xs font-medium text-[var(--accent)] underline decoration-1 underline-offset-4 hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)]`}
                  >
                    Clear filter — {stageLabel[stageFilter]}
                  </button>
                ) : null}
              </div>
              <div className="mt-4">
                <QueueTable
                  items={filteredQueue}
                  caption={`Table 01 — ${stageFilter === "all" ? "All stages" : stageLabel[stageFilter]} (${filteredQueue.length} documents)`}
                />
              </div>
            </section>
          ) : null}

          {tab === "corpus" ? (
            <section
              id="panel-corpus"
              role="tabpanel"
              aria-labelledby="tab-corpus"
              tabIndex={0}
              className="stele-panel mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12"
            >
              <div className="lg:col-span-5">
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-70)]">
                  Corpus by Family
                </h2>
                <ul className="mt-5 border-t border-[var(--ink-20)]">
                  {languageFamilies.map((f) => (
                    <BarRow
                      key={f.family}
                      label={f.family}
                      value={`${hoursFmt(f.hours)}h`}
                      valueLabel={`${hoursFmt(f.hours)} hours across ${f.languageCount} language${f.languageCount > 1 ? "s" : ""}`}
                      pct={(f.hours / maxFamilyHours) * 100}
                    />
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-7">
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-70)]">
                  Catalog — {languages.length} Languages
                </h2>
                <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {languages.map((l) => (
                    <li key={l.code} className="border border-[var(--ink-20)] p-4">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-[var(--ink)]">{l.name}</p>
                        <p className={`${MONO} text-xs text-[var(--ink-45)]`}>{l.code}</p>
                      </div>
                      <p className="mt-0.5 text-xs text-[var(--ink-70)]">{l.family}</p>
                      <p className="mt-3 text-xs text-[var(--ink-45)]">{l.region}</p>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <StatusBadge status={l.status} />
                        <p className={`${MONO} text-xs text-[var(--ink-70)]`}>{nf.format(l.speakers)} spkrs</p>
                      </div>
                      <p className={`${MONO} mt-3 border-t border-[var(--ink-10)] pt-2 text-xs tabular-nums text-[var(--ink)]`}>
                        {hoursFmt(l.hoursArchived)}h archived
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}

          {tab === "contributors" ? (
            <section
              id="panel-contributors"
              role="tabpanel"
              aria-labelledby="tab-contributors"
              tabIndex={0}
              className="stele-panel mt-8"
            >
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-70)]">
                Colophon — Contributors This Quarter
              </h2>
              <ol className="mt-5 flex flex-col border-t border-[var(--ink-20)]">
                {contributors.map((c, i) => {
                  const isLead = c.name === "M. Okonkwo-Reyes";
                  return (
                    <li
                      key={c.name}
                      className={`flex flex-col gap-2 border-b border-[var(--ink-10)] py-4 sm:flex-row sm:items-center sm:gap-4 ${
                        isLead ? "bg-[var(--accent-10)] px-3" : ""
                      }`}
                    >
                      <span className={`${MONO} stele-index w-6 shrink-0 text-xs text-[var(--ink-45)]`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="w-48 shrink-0">
                        <p className="text-sm font-medium text-[var(--ink)]">
                          {c.name} {isLead ? <span className="text-xs font-normal text-[var(--accent)]">(you)</span> : null}
                        </p>
                        <p className="text-xs text-[var(--ink-70)]">{c.role}</p>
                      </div>
                      <svg
                        viewBox="0 0 200 10"
                        preserveAspectRatio="none"
                        className="h-2.5 flex-1"
                        role="img"
                        aria-label={`${c.name}: ${hoursFmt(c.hoursThisQuarter)} hours across ${c.languageCount} languages`}
                      >
                        <rect x="0" y="0" width="200" height="10" rx="1" className="fill-[var(--ink-10)]" />
                        <rect
                          x="0"
                          y="0"
                          width={(c.hoursThisQuarter / maxContributorHours) * 200}
                          height="10"
                          rx="1"
                          className={isLead ? "fill-[var(--accent)]" : "fill-[var(--ink)]"}
                        />
                      </svg>
                      <span className={`${MONO} w-28 shrink-0 text-right text-sm tabular-nums text-[var(--ink)]`}>
                        {hoursFmt(c.hoursThisQuarter)}h · {c.languageCount} lang.
                      </span>
                    </li>
                  );
                })}
              </ol>
            </section>
          ) : null}
        </main>

        <footer className="border-t border-[var(--ink-20)] py-6">
          <p className={`${MONO} text-xs text-[var(--ink-45)]`}>
            STELE — Language Preservation Infrastructure. Fictional product built for interface demonstration.
          </p>
        </footer>
      </div>
    </div>
  );
}
