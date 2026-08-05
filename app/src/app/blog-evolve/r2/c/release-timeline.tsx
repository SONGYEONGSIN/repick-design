"use client";

// app/src/app/blog-evolve/r2/c/release-timeline.tsx
//
// The interactive engine for the whole page. Five pieces of state feed one derived list, so every
// control (search, type filter, sort direction, jump nav, per-card expand) reads and writes real
// data rather than decorating a static page:
//
//   1. Search — filters by title, version, or tag substring.
//   2. Release-type filter — narrows to one type (major/minor/patch/security) or all.
//   3. Sort direction — flips the spine between newest-first and oldest-first.
//   4. Jump-to-version nav + scrollspy — clicking a version in the index scrolls the spine to it;
//      scrolling the spine updates which version the index marks active (IntersectionObserver),
//      so the two stay mutually in sync rather than the index being a one-way trigger.
//   5. Per-card "view full changelog" expand — reveals the full bullet list independently per card.
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Search } from "lucide-react";
import { RELEASES, RELEASE_TYPE_ORDER, type ReleaseType } from "./data";
import { TYPE_META } from "./type-meta";
import ReleaseCard from "./release-card";
import VersionIndex from "./version-index";

type SortOrder = "newest" | "oldest";
type TypeFilter = "all" | ReleaseType;

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export default function ReleaseTimeline() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [activeId, setActiveId] = useState<string | null>(RELEASES[0]?.id ?? null);
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RELEASES.filter((r) => {
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (!q) return true;
      const haystack = `${r.title} ${r.version} ${r.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query, typeFilter]);

  const ordered = useMemo(() => {
    return sortOrder === "newest" ? filtered : [...filtered].reverse();
  }, [filtered, sortOrder]);

  // Derived, not stored: if a filter removes the scroll-spied entry from view, fall back to the
  // first still-visible one for render purposes only. Real activeId state changes only from user
  // events (click, IntersectionObserver callback) below, never synchronously inside an effect body.
  const effectiveActiveId = useMemo(() => {
    if (activeId && ordered.some((r) => r.id === activeId)) return activeId;
    return ordered[0]?.id ?? null;
  }, [ordered, activeId]);

  useEffect(() => {
    const nodes = ordered.map((r) => itemRefs.current.get(r.id)).filter((el): el is HTMLLIElement => Boolean(el));
    if (nodes.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const top = visible[0]?.target as HTMLElement | undefined;
        const id = top?.dataset.releaseId;
        if (id) setActiveId(id);
      },
      { rootMargin: "-15% 0px -65% 0px", threshold: 0 },
    );
    nodes.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ordered]);

  function registerRef(id: string) {
    return (el: HTMLLIElement | null) => {
      if (el) itemRefs.current.set(id, el);
      else itemRefs.current.delete(id);
    };
  }

  function handleJump(id: string) {
    const el = itemRefs.current.get(id);
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    setActiveId(id);
  }

  function toggleExpanded(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const resultLabel =
    ordered.length === RELEASES.length
      ? `Showing all ${RELEASES.length} releases`
      : `Showing ${ordered.length} of ${RELEASES.length} releases`;

  return (
    <div>
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1 min-w-0">
            <span className="sr-only">Search releases by title, version, or tag</span>
            <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, version, or tag"
              className={`w-full rounded-lg border border-zinc-300 bg-white py-2 pr-3 pl-9 text-sm font-normal text-zinc-900 placeholder:text-zinc-500 ${FOCUS}`}
            />
          </label>

          <button
            type="button"
            onClick={() => setSortOrder((v) => (v === "newest" ? "oldest" : "newest"))}
            className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 ${FOCUS}`}
          >
            {sortOrder === "newest" ? (
              <ArrowDownNarrowWide aria-hidden="true" className="h-4 w-4" />
            ) : (
              <ArrowUpNarrowWide aria-hidden="true" className="h-4 w-4" />
            )}
            {sortOrder === "newest" ? "Newest first" : "Oldest first"}
          </button>
        </div>

        <div role="group" aria-label="Filter by release type" className="mt-3 flex flex-wrap gap-1.5">
          <button
            type="button"
            aria-pressed={typeFilter === "all"}
            onClick={() => setTypeFilter("all")}
            className={`rounded-full px-3 py-1 text-sm font-semibold transition-colors ${FOCUS} ${
              typeFilter === "all" ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            All types
          </button>
          {RELEASE_TYPE_ORDER.map((type) => {
            const meta = TYPE_META[type];
            const Icon = meta.icon;
            const isActive = typeFilter === type;
            return (
              <button
                key={type}
                type="button"
                aria-pressed={isActive}
                onClick={() => setTypeFilter(isActive ? "all" : type)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold transition-colors ${FOCUS} ${
                  isActive ? `${meta.badgeBg} ${meta.badgeText} ring-1 ring-inset ${meta.ring}` : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                {meta.label}
              </button>
            );
          })}
        </div>

        <p aria-live="polite" className="mt-3 text-xs font-normal text-zinc-600">
          {resultLabel}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[160px_1fr] lg:gap-10">
        <VersionIndex releases={ordered} activeId={effectiveActiveId} onJump={handleJump} />

        <div className="min-w-0">
          {ordered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 px-5 py-14 text-center">
              <p className="text-sm font-semibold text-zinc-700">No releases match your filters.</p>
              <p className="mt-1 text-sm font-normal text-zinc-500">Try a different search term or type filter.</p>
            </div>
          ) : (
            <ol className="relative flex flex-col gap-8">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-2 bottom-2 left-[19px] w-0.5 bg-zinc-200 sm:left-[23px]"
              />
              {ordered.map((release) => (
                <ReleaseCard
                  key={release.id}
                  release={release}
                  expanded={Boolean(expanded[release.id])}
                  onToggleExpanded={() => toggleExpanded(release.id)}
                  registerRef={registerRef(release.id)}
                />
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
