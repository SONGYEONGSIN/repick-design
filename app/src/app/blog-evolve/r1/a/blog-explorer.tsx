"use client";

// app/src/app/blog-evolve/r1/a/blog-explorer.tsx
//
// The interactive half of the page: category filter, live search, sort control and load-more, all
// operating over the same derived list so "Showing N of M articles" always reflects exactly what's
// on screen. All four are information-bearing (page-brief-core round note: manipulating a control
// must change real, visible page state, not just its own widget).
import { useMemo, useState } from "react";
import { Search, Clock, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import CoverArt from "./cover-art";
import Avatar from "./avatar";
import { CATEGORIES, GRID_POSTS, categoryOf, authorOf, type CategoryId, type Post } from "./data";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8F3A21] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF7F1]";

const INITIAL_COUNT = 6;
const LOAD_STEP = 5;

type SortMode = "newest" | "popular";
type CategoryFilter = CategoryId | "all";

function matchesQuery(post: Post, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q);
}

function formatReads(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function BlogExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [sortBy, setSortBy] = useState<SortMode>("newest");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const filtered = useMemo(
    () => GRID_POSTS.filter((p) => (category === "all" || p.categoryId === category) && matchesQuery(p, query)),
    [category, query],
  );

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sortBy === "newest") list.sort((a, b) => (a.dateKey < b.dateKey ? 1 : -1));
    else list.sort((a, b) => b.reads - a.reads);
    return list;
  }, [filtered, sortBy]);

  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;
  const isFiltered = category !== "all" || query.trim().length > 0;

  function handleCategory(id: CategoryFilter) {
    setCategory(id);
    setVisibleCount(INITIAL_COUNT);
  }

  function handleQuery(value: string) {
    setQuery(value);
    setVisibleCount(INITIAL_COUNT);
  }

  function clearFilters() {
    setCategory("all");
    setQuery("");
    setVisibleCount(INITIAL_COUNT);
  }

  return (
    <section aria-labelledby="latest-heading" className="mt-16 sm:mt-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="latest-heading" className="text-2xl font-bold text-[#221D18]" style={{ fontFamily: "var(--font-display-wide)" }}>
          Latest articles
        </h2>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#E6D9C4] bg-[#EFE4D3] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="relative min-w-0 flex-1">
            <label htmlFor="post-search" className="sr-only">
              Search articles by title or excerpt
            </label>
            <Search
              aria-hidden="true"
              strokeWidth={2}
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#5B4F41]"
            />
            <input
              id="post-search"
              type="text"
              value={query}
              onChange={(e) => handleQuery(e.target.value)}
              placeholder="Search articles by title or excerpt…"
              className={`w-full rounded-lg border border-[#E6D9C4] bg-[#FBF7F1] py-2.5 pr-3 pl-10 text-sm font-normal text-[#221D18] placeholder:text-[#5B4F41] ${FOCUS}`}
            />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <label htmlFor="post-sort" className="text-sm font-medium whitespace-nowrap text-[#5B4F41]">
              Sort by
            </label>
            <div className="relative">
              <select
                id="post-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortMode)}
                className={`appearance-none rounded-lg border border-[#E6D9C4] bg-[#FBF7F1] py-2.5 pr-9 pl-3 text-sm font-medium text-[#221D18] ${FOCUS}`}
              >
                <option value="newest">Newest first</option>
                <option value="popular">Most read</option>
              </select>
              <ChevronDown
                aria-hidden="true"
                strokeWidth={2}
                className="pointer-events-none absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2 text-[#5B4F41]"
              />
            </div>
          </div>
        </div>

        <div role="group" aria-label="Filter by category" className="flex flex-wrap items-center gap-2">
          <span className="hidden items-center gap-1.5 text-sm font-medium text-[#5B4F41] sm:inline-flex">
            <SlidersHorizontal aria-hidden="true" strokeWidth={2} className="h-3.5 w-3.5" />
          </span>
          <button
            type="button"
            aria-pressed={category === "all"}
            onClick={() => handleCategory("all")}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${FOCUS} ${
              category === "all" ? "bg-[#AE4526] text-[#FBF7F1]" : "bg-[#FBF7F1] text-[#221D18] hover:bg-white"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={category === c.id}
              onClick={() => handleCategory(c.id)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${FOCUS} ${
                category === c.id ? "bg-[#AE4526] text-[#FBF7F1]" : "bg-[#FBF7F1] text-[#221D18] hover:bg-white"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live count */}
      <p aria-live="polite" className="mt-5 text-sm font-normal text-[#5B4F41]">
        Showing <span className="font-medium text-[#221D18] tabular-nums">{visible.length}</span> of{" "}
        <span className="font-medium text-[#221D18] tabular-nums">{sorted.length}</span>{" "}
        {sorted.length === 1 ? "article" : "articles"}
        {isFiltered ? " matching your filters" : ""}
      </p>

      {sorted.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#E6D9C4] px-6 py-16 text-center">
          <p className="text-base font-medium text-[#221D18]">No articles match those filters.</p>
          <p className="max-w-sm text-sm font-normal text-[#5B4F41]">
            Try a different search term, or clear the category filter to see everything again.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className={`mt-2 inline-flex items-center gap-1.5 rounded-lg border border-[#E6D9C4] bg-[#FBF7F1] px-4 py-2 text-sm font-medium text-[#221D18] transition-colors hover:bg-[#EFE4D3] ${FOCUS}`}
          >
            <X aria-hidden="true" strokeWidth={2} className="h-4 w-4" />
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <ul role="list" className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </ul>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => Math.min(c + LOAD_STEP, sorted.length))}
                className={`rounded-lg border border-[#221D18] bg-transparent px-5 py-2.5 text-sm font-medium text-[#221D18] transition-colors hover:bg-[#221D18] hover:text-[#FBF7F1] ${FOCUS}`}
              >
                Load {Math.min(LOAD_STEP, sorted.length - visibleCount)} more article
                {Math.min(LOAD_STEP, sorted.length - visibleCount) === 1 ? "" : "s"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function PostCard({ post }: { post: Post }) {
  const category = categoryOf(post.categoryId);
  const author = authorOf(post.authorId);
  const Icon = category.icon;

  return (
    <li className="min-w-0">
      <article className="flex h-full flex-col">
        <CoverArt seed={post.id} hue={category.hue} icon={Icon} title={post.title} className="aspect-[16/10]" />

        <div className="flex flex-1 flex-col gap-2.5 pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5B4F41]">
            <span
              className="flex h-4.5 w-4.5 items-center justify-center rounded-full"
              style={{ backgroundColor: `hsl(${category.hue} 46% 32%)` }}
            >
              <Icon aria-hidden="true" strokeWidth={2.2} className="h-2.5 w-2.5 text-white" />
            </span>
            {category.label}
          </span>

          <h3 className="text-base leading-snug font-bold text-[#221D18]">
            <a href="#" className={`rounded ${FOCUS}`}>
              {post.title}
            </a>
          </h3>

          <p className="line-clamp-2 text-sm font-normal text-[#5B4F41]">{post.excerpt}</p>

          <div className="mt-auto flex items-center gap-2.5 pt-3">
            <Avatar initials={author.initials} hue={author.hue} name={author.name} size={26} />
            <div className="min-w-0 text-xs leading-tight font-normal text-[#5B4F41]">
              <p className="truncate font-medium text-[#221D18]">{author.name}</p>
              <p className="flex items-center gap-1.5">
                <span>{post.dateLabel}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock aria-hidden="true" strokeWidth={2} className="h-3 w-3" />
                  <span className="tabular-nums">{post.readMinutes} min</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{formatReads(post.reads)} reads</span>
              </p>
            </div>
          </div>
        </div>
      </article>
    </li>
  );
}
