"use client";

import { ArrowDownUp, ChevronDown, Inbox, LayoutGrid, List, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ArticleCard, ArticleRow } from "./article-card";
import {
  ARTICLES,
  FORMATS,
  SORTS,
  TOPICS,
  cardVariant,
  filterArticles,
  sortArticles,
  type Access,
  type Format,
  type SortKey,
  type Topic,
} from "./data";

const RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

const PAGE_SIZE = 8;

function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  const className = "mb-1 block text-xs font-medium uppercase tracking-[0.08em] text-zinc-400";
  if (htmlFor) {
    return (
      <label htmlFor={htmlFor} className={className}>
        {children}
      </label>
    );
  }
  return <span className={className}>{children}</span>;
}

export function CatalogClient() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [access, setAccess] = useState<Access | "all">("all");
  const [format, setFormat] = useState<Format | "all">("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = useMemo(
    () => filterArticles(ARTICLES, { topics, access, format }),
    [topics, access, format],
  );
  const sorted = useMemo(() => sortArticles(filtered, sort), [filtered, sort]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [topics, access, format, sort]);

  const visible = sorted.slice(0, visibleCount);

  function toggleTopic(t: Topic) {
    setTopics((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function clearAll() {
    setTopics([]);
    setAccess("all");
    setFormat("all");
  }

  const applied: { key: string; label: string; onRemove: () => void }[] = [
    ...topics.map((t) => ({ key: `topic-${t}`, label: t, onRemove: () => toggleTopic(t) })),
    ...(access !== "all"
      ? [{ key: "access", label: access === "free" ? "Free access" : "Members only", onRemove: () => setAccess("all") }]
      : []),
    ...(format !== "all" ? [{ key: "format", label: format, onRemove: () => setFormat("all") }] : []),
  ];

  return (
    <section aria-labelledby="archive-heading" className="mx-auto w-full max-w-[1400px] px-4 pb-16 sm:px-6 lg:px-8">
      <div
        className={`sticky top-0 z-20 -mx-4 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur transition-[padding,box-shadow] duration-200 motion-reduce:transition-none sm:-mx-6 lg:-mx-8 ${
          scrolled ? "py-3 shadow-xl shadow-black/50" : "py-4"
        }`}
      >
        <div className="flex flex-col gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <h2 id="archive-heading" className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-400">
              Browse the archive
            </h2>
            <p aria-live="polite" className="text-sm font-normal text-zinc-400">
              <span className="tabular-nums font-semibold text-zinc-50">{sorted.length}</span>{" "}
              {sorted.length === 1 ? "dispatch" : "dispatches"}
            </p>
          </div>

          <div role="group" aria-label="Filter by topic" className="flex flex-wrap gap-2">
            {TOPICS.map((t) => {
              const active = topics.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleTopic(t)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${RING} ${
                    active
                      ? "border-amber-400 bg-amber-400 text-zinc-950"
                      : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <FieldLabel>Access</FieldLabel>
                <div role="group" aria-label="Filter by access" className="inline-flex rounded-full border border-zinc-700 bg-zinc-900 p-1">
                  {(["all", "free", "members"] as const).map((v) => {
                    const active = access === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setAccess(v)}
                        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${RING} ${
                          active ? "bg-amber-400 text-zinc-950" : "text-zinc-300 hover:text-zinc-100"
                        }`}
                      >
                        {v === "all" ? "All" : v === "free" ? "Free" : "Members"}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="format-select">Format</FieldLabel>
                <div className="relative">
                  <select
                    id="format-select"
                    value={format}
                    onChange={(e) => setFormat(e.target.value as Format | "all")}
                    className={`appearance-none rounded-lg border border-zinc-700 bg-zinc-900 py-1.5 pl-3 pr-8 text-sm font-medium text-zinc-100 ${RING}`}
                  >
                    <option value="all">All formats</option>
                    {FORMATS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="sort-select">Sort</FieldLabel>
                <div className="relative">
                  <ArrowDownUp className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
                  <select
                    id="sort-select"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className={`appearance-none rounded-lg border border-zinc-700 bg-zinc-900 py-1.5 pl-8 pr-8 text-sm font-medium text-zinc-100 ${RING}`}
                  >
                    {SORTS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div>
              <FieldLabel>View</FieldLabel>
              <div role="group" aria-label="Switch layout" className="inline-flex rounded-full border border-zinc-700 bg-zinc-900 p-1">
                <button
                  type="button"
                  aria-pressed={view === "grid"}
                  aria-label="Magazine grid view"
                  onClick={() => setView("grid")}
                  className={`inline-flex size-8 items-center justify-center rounded-full transition-colors ${RING} ${
                    view === "grid" ? "bg-amber-400 text-zinc-950" : "text-zinc-300 hover:text-zinc-100"
                  }`}
                >
                  <LayoutGrid className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-pressed={view === "list"}
                  aria-label="List view"
                  onClick={() => setView("list")}
                  className={`inline-flex size-8 items-center justify-center rounded-full transition-colors ${RING} ${
                    view === "list" ? "bg-amber-400 text-zinc-950" : "text-zinc-300 hover:text-zinc-100"
                  }`}
                >
                  <List className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex min-h-8 flex-wrap items-center gap-2">
            {applied.length > 0 ? (
              <>
                {applied.map((f) => (
                  <span
                    key={f.key}
                    className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 py-1 pl-3 pr-1.5 text-xs font-medium text-zinc-200"
                  >
                    {f.label}
                    <button
                      type="button"
                      aria-label={`Remove filter ${f.label}`}
                      onClick={f.onRemove}
                      className={`inline-flex size-5 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 ${RING}`}
                    >
                      <X className="size-3.5" aria-hidden="true" />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={clearAll}
                  className={`text-xs font-medium text-amber-300 hover:text-amber-200 ${RING} rounded px-1`}
                >
                  Clear all
                </button>
              </>
            ) : (
              <p className="text-xs font-normal text-zinc-400">No filters applied</p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-6">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 px-6 py-16 text-center">
            <Inbox className="size-10 text-zinc-600" aria-hidden="true" />
            <div>
              <p className="text-base font-semibold text-zinc-100">No dispatches match your filters</p>
              <p className="mt-1 text-sm font-normal text-zinc-400">Try removing a topic, or reset access and format back to All.</p>
            </div>
            <button
              type="button"
              onClick={clearAll}
              className={`inline-flex items-center gap-2 rounded-full border border-amber-400 bg-amber-400 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-amber-300 ${RING}`}
            >
              <X className="size-4" aria-hidden="true" />
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            {view === "grid" ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                {visible.map((article, i) => (
                  <ArticleCard key={article.id} article={article} variant={cardVariant(i)} index={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {visible.map((article, i) => (
                  <ArticleRow key={article.id} article={article} index={i} />
                ))}
              </div>
            )}

            <div className="mt-10 flex flex-col items-center gap-3">
              <p className="text-sm font-normal text-zinc-400">
                Showing <span className="tabular-nums font-medium text-zinc-200">{visible.length}</span> of{" "}
                <span className="tabular-nums font-medium text-zinc-200">{sorted.length}</span>
              </p>
              {visibleCount < sorted.length ? (
                <button
                  type="button"
                  onClick={() => setVisibleCount((v) => Math.min(v + PAGE_SIZE, sorted.length))}
                  className={`rounded-full border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-100 hover:border-amber-400 hover:text-amber-300 ${RING}`}
                >
                  Load more dispatches
                </button>
              ) : (
                <p className="text-xs font-normal text-zinc-400">You&rsquo;ve reached the end of the archive.</p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
