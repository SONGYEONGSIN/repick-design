"use client";

// app/src/app/blog-evolve/r2/a/series-explorer.tsx
//
// The page's structural device: series membership. A reader picks a series from the tablist, sees
// its parts as an ordered stepper (not a card grid), can preview any part inline without leaving the
// page, and can move to the neighbouring part with dedicated buttons instead of re-scanning the list
// — "navigate within a series as easily as across posts" from the round brief. Standalone essays that
// belong to no series live in a second, separately-filterable section below.
import { useId, useMemo, useRef, useState } from "react";
import {
  Route,
  Database,
  Activity,
  CircleCheck,
  Circle,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Clock,
  Search,
  Layers,
  Newspaper,
  BookOpenCheck,
} from "lucide-react";
import CoverTile from "./cover-tile";
import { FOCUS } from "./site-chrome";
import type { Series, Part, Essay } from "./data";
import { TOTAL_SERIES, TOTAL_PUBLISHED_PARTS, TOTAL_PARTS, TOTAL_ESSAYS } from "./data";

const SERIES_ICONS = { consensus: Route, "query-planning": Database, observability: Activity } as const;

function StatusChip({ status }: { status: Part["status"] }) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
        <CircleCheck aria-hidden="true" className="h-3.5 w-3.5" />
        Published
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
      <Clock aria-hidden="true" className="h-3.5 w-3.5" />
      Upcoming
    </span>
  );
}

function PartRow({
  part,
  seriesLength,
  isExpanded,
  isRead,
  onToggleExpand,
  onToggleRead,
  onJump,
}: {
  part: Part;
  seriesLength: number;
  isExpanded: boolean;
  isRead: boolean;
  onToggleExpand: () => void;
  onToggleRead: () => void;
  onJump: (direction: -1 | 1) => void;
}) {
  const panelId = useId();
  const buttonId = useId();

  return (
    <li className="relative pl-9 sm:pl-11">
      {/* Stepper rail: a connecting line behind the index dot, standard "sequence" affordance. */}
      {part.index < seriesLength && (
        <span aria-hidden="true" className="absolute top-9 left-3.5 h-[calc(100%-1.25rem)] w-px bg-zinc-200 sm:left-4.5" />
      )}
      <span
        aria-hidden="true"
        className={`absolute top-1 left-0 flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold tabular-nums sm:h-9 sm:w-9 ${
          isRead
            ? "border-rose-700 bg-rose-700 text-white"
            : "border-zinc-300 bg-white text-zinc-500"
        }`}
      >
        {part.index}
      </span>

      <div className="rounded-xl border border-zinc-200 bg-white">
        <div className="flex items-start gap-2 p-3 sm:p-4">
          <button
            type="button"
            id={buttonId}
            aria-expanded={isExpanded}
            aria-controls={panelId}
            onClick={onToggleExpand}
            className={`flex min-w-0 flex-1 items-start justify-between gap-3 rounded-md text-left ${FOCUS}`}
          >
            <span className="min-w-0">
              <span className="flex flex-wrap items-center gap-2">
                <span
                  className="text-base font-bold text-zinc-900"
                  style={{ fontFamily: "var(--font-display-grotesk)" }}
                >
                  {part.title}
                </span>
                <StatusChip status={part.status} />
              </span>
              <span className="mt-1 block text-sm font-normal text-zinc-600">{part.dek}</span>
              <span className="mt-1.5 block text-xs font-medium text-zinc-500 tabular-nums">
                {part.readMins} min read
              </span>
            </span>
            <ChevronDown
              aria-hidden="true"
              className={`mt-1 h-5 w-5 shrink-0 text-zinc-400 transition-transform motion-reduce:transition-none ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          <button
            type="button"
            aria-pressed={isRead}
            onClick={onToggleRead}
            className={`flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${FOCUS} ${
              isRead ? "text-rose-700 hover:text-rose-800" : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {isRead ? (
              <CircleCheck aria-hidden="true" className="h-4 w-4" />
            ) : (
              <Circle aria-hidden="true" className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">{isRead ? "Read" : "Mark read"}</span>
          </button>
        </div>

        {isExpanded && (
          <div id={panelId} role="region" aria-label={`${part.title} — details`} className="border-t border-zinc-200 px-3 pt-3 pb-4 sm:px-4">
            <p className="text-sm font-normal text-pretty text-zinc-600">{part.summary}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Topics">
              {part.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between gap-2 border-t border-zinc-100 pt-3">
              <button
                type="button"
                disabled={part.index === 1}
                onClick={() => onJump(-1)}
                className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 disabled:pointer-events-none disabled:opacity-40 ${FOCUS}`}
              >
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                Previous part
              </button>
              <button
                type="button"
                disabled={part.index === seriesLength}
                onClick={() => onJump(1)}
                className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 disabled:pointer-events-none disabled:opacity-40 ${FOCUS}`}
              >
                Next part
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}

export default function SeriesExplorer({ series, essays, tags }: {
  series: Series[];
  essays: Essay[];
  tags: { id: string; label: string; count: number }[];
}) {
  const [activeSeriesId, setActiveSeriesId] = useState(series[0].id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [expandedBySeries, setExpandedBySeries] = useState<Record<string, string | null>>({});
  const [readParts, setReadParts] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const activeSeries = series.find((s) => s.id === activeSeriesId) ?? series[0];
  const expandedPartId = expandedBySeries[activeSeries.id] ?? null;

  const readCountBySeries = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of series) {
      counts[s.id] = s.parts.filter((p) => readParts[p.id]).length;
    }
    return counts;
  }, [series, readParts]);

  const totalRead = useMemo(() => Object.values(readParts).filter(Boolean).length, [readParts]);

  function setExpanded(partId: string | null) {
    setExpandedBySeries((prev) => ({ ...prev, [activeSeries.id]: partId }));
  }

  function toggleRead(partId: string) {
    setReadParts((prev) => ({ ...prev, [partId]: !prev[partId] }));
  }

  function jump(direction: -1 | 1) {
    const current = activeSeries.parts.find((p) => p.id === expandedPartId);
    if (!current) return;
    const next = activeSeries.parts.find((p) => p.index === current.index + direction);
    if (next) setExpanded(next.id);
  }

  const filteredEssays = useMemo(() => {
    const q = query.trim().toLowerCase();
    return essays.filter((e) => {
      const matchesQuery = q === "" || e.title.toLowerCase().includes(q) || e.dek.toLowerCase().includes(q);
      const matchesTags = activeTags.length === 0 || activeTags.every((t) => e.tags.includes(t));
      return matchesQuery && matchesTags;
    });
  }, [essays, query, activeTags]);

  function toggleTag(tagId: string) {
    setActiveTags((prev) => (prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]));
  }

  const searchInputId = useId();

  return (
    <>
      {/* Aggregate stats — computed from static data, not from reading state, so this is stable
          across sessions. `dl > div` groups with the icon inside `dt`, per page-brief-core §3. */}
      <section aria-labelledby="overview-heading" className="mx-auto max-w-6xl px-5 pb-2 sm:px-8">
        <h2 id="overview-heading" className="sr-only">
          Publication overview
        </h2>
        <dl className="grid grid-cols-3 gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:gap-6 sm:p-6">
          <div className="min-w-0">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 sm:text-sm">
              <Layers aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="truncate">Series</span>
            </dt>
            <dd className="mt-1 text-2xl font-bold text-zinc-900 tabular-nums sm:text-3xl">{TOTAL_SERIES}</dd>
          </div>
          <div className="min-w-0">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 sm:text-sm">
              <BookOpenCheck aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="truncate">Parts published</span>
            </dt>
            <dd className="mt-1 text-2xl font-bold text-zinc-900 tabular-nums sm:text-3xl">
              {TOTAL_PUBLISHED_PARTS}
              <span className="text-base font-medium text-zinc-500">/{TOTAL_PARTS}</span>
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 sm:text-sm">
              <Newspaper aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="truncate">Essays</span>
            </dt>
            <dd className="mt-1 text-2xl font-bold text-zinc-900 tabular-nums sm:text-3xl">{TOTAL_ESSAYS}</dd>
          </div>
        </dl>
      </section>

      {/* Series section — the primary structural device. */}
      <section id="series" aria-labelledby="series-heading" className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <h2
          id="series-heading"
          className="text-2xl font-bold text-zinc-900 sm:text-3xl"
          style={{ fontFamily: "var(--font-display-grotesk)" }}
        >
          Series
        </h2>
        <p className="mt-2 max-w-2xl text-base font-normal text-zinc-600">
          Each series is a fixed sequence of parts meant to be read in order. Pick one to see where it
          stands and preview any part without leaving this page.
        </p>

        <div role="tablist" aria-label="Series" className="mt-6 grid gap-3 sm:grid-cols-3">
          {series.map((s) => {
            const Icon = SERIES_ICONS[s.id];
            const selected = s.id === activeSeries.id;
            const readCount = readCountBySeries[s.id] ?? 0;
            const publishedCount = s.parts.filter((p) => p.status === "published").length;
            return (
              <button
                key={s.id}
                ref={(el) => {
                  tabRefs.current[s.id] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${s.id}`}
                aria-selected={selected}
                aria-controls={`panel-${s.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveSeriesId(s.id)}
                onKeyDown={(e) => {
                  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                  e.preventDefault();
                  const idx = series.findIndex((x) => x.id === s.id);
                  const nextIdx = e.key === "ArrowRight" ? (idx + 1) % series.length : (idx - 1 + series.length) % series.length;
                  const nextId = series[nextIdx].id;
                  setActiveSeriesId(nextId);
                  tabRefs.current[nextId]?.focus();
                }}
                className={`flex min-w-0 items-start gap-3 rounded-xl border p-3 text-left transition-colors sm:p-4 ${FOCUS} ${
                  selected ? "border-rose-300 bg-rose-50" : "border-zinc-200 bg-white hover:border-zinc-300"
                }`}
              >
                <CoverTile seed={s.hue} hue={s.hue} icon={Icon} size={40} />
                <span className="min-w-0">
                  <span
                    className={`block text-sm font-bold ${selected ? "text-rose-800" : "text-zinc-900"}`}
                  >
                    {s.title}
                  </span>
                  <span className="mt-1 block text-xs font-normal text-zinc-600">{s.tagline}</span>
                  <span className="mt-1.5 block text-xs font-medium text-zinc-500 tabular-nums">
                    {publishedCount}/{s.parts.length} published · {readCount} read
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${activeSeries.id}`}
          aria-labelledby={`tab-${activeSeries.id}`}
          tabIndex={0}
          className={`mt-6 rounded-2xl ${FOCUS}`}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-lg font-bold text-zinc-900 sm:text-xl" style={{ fontFamily: "var(--font-display-grotesk)" }}>
              {activeSeries.title}
            </h3>
            <p className="text-sm font-medium text-zinc-500 tabular-nums">
              {readCountBySeries[activeSeries.id] ?? 0} of {activeSeries.parts.length} read
            </p>
          </div>
          <p className="mt-1.5 max-w-2xl text-sm font-normal text-zinc-600">{activeSeries.description}</p>

          <ol className="mt-5 flex flex-col gap-3">
            {activeSeries.parts.map((part) => (
              <PartRow
                key={part.id}
                part={part}
                seriesLength={activeSeries.parts.length}
                isExpanded={expandedPartId === part.id}
                isRead={Boolean(readParts[part.id])}
                onToggleExpand={() => setExpanded(expandedPartId === part.id ? null : part.id)}
                onToggleRead={() => toggleRead(part.id)}
                onJump={jump}
              />
            ))}
          </ol>
        </div>

        <p className="mt-6 text-sm font-medium text-zinc-500 tabular-nums">
          {totalRead} of {TOTAL_PARTS} parts read across every series.
        </p>
      </section>

      {/* Standalone essays — secondary content, deliberately a plain filterable list rather than a
          card grid or a sticky rail, so it reads as "the rest," not a second primary structure. */}
      <section id="essays" aria-labelledby="essays-heading" className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          <h2
            id="essays-heading"
            className="text-2xl font-bold text-zinc-900 sm:text-3xl"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            Standalone essays
          </h2>
          <p className="mt-2 max-w-2xl text-base font-normal text-zinc-600">
            Notes that don&apos;t belong to any series — culture, incidents, and the odd essay that
            didn&apos;t fit a sequence.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <label htmlFor={searchInputId} className="sr-only">
                Search standalone essays
              </label>
              <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                id={searchInputId}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search essays"
                className={`w-full rounded-lg border border-zinc-200 bg-white py-2 pr-3 pl-9 text-sm font-normal text-zinc-900 placeholder:text-zinc-500 ${FOCUS}`}
              />
            </div>

            <ul className="flex flex-wrap gap-1.5" aria-label="Filter by topic">
              {tags.map((tag) => {
                const active = activeTags.includes(tag.id);
                return (
                  <li key={tag.id}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleTag(tag.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium tabular-nums transition-colors ${FOCUS} ${
                        active
                          ? "border-rose-300 bg-rose-50 text-rose-700"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                      }`}
                    >
                      {tag.label} ({tag.count})
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <p aria-live="polite" className="mt-4 text-sm font-medium text-zinc-500 tabular-nums">
            Showing {filteredEssays.length} of {essays.length} essays
          </p>

          {filteredEssays.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-3">
              {filteredEssays.map((essay) => (
                <li key={essay.slug} className="min-w-0 rounded-xl border border-zinc-200 bg-white p-3 sm:p-4">
                  <a href="#" className={`flex min-w-0 items-start gap-3 rounded-md ${FOCUS}`}>
                    <CoverTile seed={essay.hue} hue={essay.hue} icon={Newspaper} size={44} className="mt-0.5" />
                    <span className="min-w-0">
                      <span
                        className="block text-base font-bold text-zinc-900"
                        style={{ fontFamily: "var(--font-display-grotesk)" }}
                      >
                        {essay.title}
                      </span>
                      <span className="mt-1 block text-sm font-normal text-zinc-600">{essay.dek}</span>
                      <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-zinc-500">
                        <span className="tabular-nums">{essay.dateLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{essay.readMins} min read</span>
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 rounded-xl border border-dashed border-zinc-300 bg-white p-6 text-center text-sm font-normal text-zinc-600">
              No essays match that search and filter combination. Try clearing a topic filter.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
