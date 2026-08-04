"use client";

import { useId, useMemo, useState } from "react";
import { Clock, Mail, Search, TrendingUp, X } from "lucide-react";
import {
  ARTICLES,
  AUTHORS,
  CATEGORIES,
  CATEGORY_COUNTS,
  TOTAL_ARTICLES,
  TOTAL_AUTHORS,
  type Article,
  type CategoryId,
} from "./data";
import AuthorMark from "./author-mark";

type CategoryFilter = CategoryId | "all";
type SortMode = "newest" | "most-read";

const SORT_LABEL: Record<SortMode, string> = {
  newest: "Newest first",
  "most-read": "Most read",
};

function matchesQuery(article: Article, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  const author = AUTHORS[article.author];
  const category = CATEGORIES.find((c) => c.id === article.category);
  return (
    article.title.toLowerCase().includes(q) ||
    article.dek.toLowerCase().includes(q) ||
    author.name.toLowerCase().includes(q) ||
    (category?.label.toLowerCase().includes(q) ?? false)
  );
}

function sortArticles(items: Article[], sort: SortMode): Article[] {
  const copy = [...items];
  if (sort === "most-read") copy.sort((a, b) => b.reads - a.reads);
  else copy.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return copy;
}

export default function BlogClient() {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("newest");
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [email, setEmail] = useState("");
  const [subscribeState, setSubscribeState] = useState<"idle" | "success" | "error">("idle");

  const searchId = useId();
  const sortId = useId();
  const subscribeEmailId = useId();
  const subscribeStatusId = useId();

  const filtered = useMemo(() => {
    const byCategory = category === "all" ? ARTICLES : ARTICLES.filter((a) => a.category === category);
    const byQuery = byCategory.filter((a) => matchesQuery(a, query));
    return sortArticles(byQuery, sort);
  }, [category, query, sort]);

  const activeCategoryLabel = category === "all" ? "All articles" : CATEGORIES.find((c) => c.id === category)?.label ?? "All articles";

  function toggleExpanded(slug: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setSubscribeState(valid ? "success" : "error");
  }

  function clearFilters() {
    setCategory("all");
    setQuery("");
  }

  return (
    <main id="main-content" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        <p className="text-xs font-medium tracking-[0.14em] text-teal-700 uppercase" style={{ fontFamily: "var(--font-display-mono)" }}>
          Engineering blog
        </p>
        <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl" style={{ fontFamily: "var(--font-display-mono)" }}>
          Notes from the team building Stackrail
        </h1>
        <p className="mt-3 max-w-2xl text-base font-normal leading-relaxed text-zinc-600">
          Architecture decisions, incident writeups, performance work and release notes from the engineers running
          workflow orchestration for {TOTAL_AUTHORS === 1 ? "one team" : "thousands of teams"} in production.
        </p>
        <p className="mt-4 text-sm text-zinc-600">
          <span className="tabular-nums font-medium text-zinc-900">{TOTAL_ARTICLES}</span> articles from{" "}
          <span className="tabular-nums font-medium text-zinc-900">{TOTAL_AUTHORS}</span> authors across{" "}
          <span className="tabular-nums font-medium text-zinc-900">{CATEGORIES.length}</span> categories.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:items-start lg:gap-12">
          {/* ── Category rail + subscribe ─────────────────────────────── */}
          <aside aria-label="Categories and newsletter" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <nav aria-label="Filter articles by category">
              <h2 className="mb-3 text-xs font-medium tracking-wider text-zinc-600 uppercase">Categories</h2>
              <div role="group" aria-label="Category" className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap lg:gap-1">
                <button
                  type="button"
                  onClick={() => setCategory("all")}
                  aria-pressed={category === "all"}
                  className={`flex min-h-10 items-center justify-between gap-2 rounded-lg px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 lg:w-full ${
                    category === "all" ? "bg-teal-700 font-medium text-white" : "font-normal text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  <span>All posts</span>
                  <span className="tabular-nums">{TOTAL_ARTICLES}</span>
                </button>
                {CATEGORIES.map((c) => {
                  const active = category === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(c.id)}
                      aria-pressed={active}
                      className={`flex min-h-10 items-center justify-between gap-2 rounded-lg px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 lg:w-full ${
                        active ? "bg-teal-700 font-medium text-white" : "font-normal text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${c.dot}`} aria-hidden="true" />
                        <span className="truncate">{c.label}</span>
                      </span>
                      <span className="tabular-nums shrink-0">{CATEGORY_COUNTS[c.id] ?? 0}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                <Mail className="h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                Get new posts by email
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-600">
                One email when we publish. About twice a month, unsubscribe anytime.
              </p>
              <form className="mt-3" onSubmit={handleSubscribe} noValidate>
                <label htmlFor={subscribeEmailId} className="sr-only">
                  Email address
                </label>
                <input
                  id={subscribeEmailId}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (subscribeState !== "idle") setSubscribeState("idle");
                  }}
                  placeholder="you@company.com"
                  autoComplete="email"
                  aria-describedby={subscribeState !== "idle" ? subscribeStatusId : undefined}
                  className="min-h-10 w-full min-w-0 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                />
                <button
                  type="submit"
                  className="mt-2 flex min-h-10 w-full items-center justify-center rounded-lg bg-teal-700 px-3 text-sm font-medium text-white transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                  Subscribe
                </button>
              </form>
              {subscribeState === "success" && (
                <p id={subscribeStatusId} role="status" className="mt-2 text-xs font-medium text-teal-700">
                  Subscribed — check your inbox to confirm.
                </p>
              )}
              {subscribeState === "error" && (
                <p id={subscribeStatusId} role="alert" className="mt-2 text-xs font-medium text-rose-700">
                  Enter a valid email address.
                </p>
              )}
            </div>
          </aside>

          {/* ── Article list ───────────────────────────────────────────── */}
          <section aria-labelledby="article-list-heading" className="mt-10 min-w-0 lg:mt-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 id="article-list-heading" className="text-lg font-semibold text-zinc-900">
                {activeCategoryLabel}
              </h2>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative">
                  <label htmlFor={searchId} className="sr-only">
                    Search articles
                  </label>
                  <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-600" aria-hidden="true" />
                  <input
                    id={searchId}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search articles…"
                    className="min-h-10 w-full min-w-0 rounded-lg border border-zinc-300 bg-white py-2 pr-3 pl-9 text-sm text-zinc-900 placeholder:text-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 sm:w-56"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-zinc-600">
                  <span className="hidden sm:inline">Sort</span>
                  <select
                    id={sortId}
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortMode)}
                    aria-label="Sort articles"
                    className="min-h-10 rounded-lg border border-zinc-300 bg-white px-2.5 text-sm font-medium text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                  >
                    {(Object.keys(SORT_LABEL) as SortMode[]).map((key) => (
                      <option key={key} value={key}>
                        {SORT_LABEL[key]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <p className="mt-3 text-sm text-zinc-600" role="status">
              Showing <span className="tabular-nums font-medium text-zinc-900">{filtered.length}</span> of{" "}
              <span className="tabular-nums font-medium text-zinc-900">{TOTAL_ARTICLES}</span> articles
              {sort === "most-read" && (
                <span className="ml-1 inline-flex items-center gap-1 text-zinc-600">
                  <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                  sorted by reads
                </span>
              )}
            </p>

            {filtered.length === 0 ? (
              <div className="mt-8 rounded-xl border border-dashed border-zinc-300 px-4 py-10 text-center">
                <p className="text-sm text-zinc-600">No articles match “{query}”{category !== "all" ? " in this category" : ""}.</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-3 inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-zinc-300 px-3.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  Clear filters
                </button>
              </div>
            ) : (
              <ul className="mt-2 divide-y divide-zinc-200 border-b border-zinc-200">
                {filtered.map((article) => {
                  const author = AUTHORS[article.author];
                  const cat = CATEGORIES.find((c) => c.id === article.category)!;
                  const isExpanded = expanded.has(article.slug);
                  const excerptId = `excerpt-${article.slug}`;
                  const titleId = `title-${article.slug}`;

                  return (
                    <li key={article.slug} className="min-w-0 py-5 first:pt-4">
                      <article aria-labelledby={titleId} className="flex min-w-0 gap-3.5 sm:gap-4">
                        <AuthorMark seed={author.id} initials={author.initials} name={author.name} className="mt-0.5 h-9 w-9 shrink-0 sm:h-10 sm:w-10" />

                        <div className="min-w-0 flex-1">
                          <div className={`flex items-center gap-1.5 text-xs font-medium ${cat.text}`}>
                            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${cat.dot}`} aria-hidden="true" />
                            {cat.label}
                          </div>

                          <h3 id={titleId} className="mt-1 text-base leading-snug font-semibold text-zinc-900 sm:text-lg" style={{ fontFamily: "var(--font-display-mono)" }}>
                            {article.title}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed font-normal text-zinc-600">{article.dek}</p>

                          <p id={excerptId} hidden={!isExpanded} className="mt-2 max-w-2xl text-sm leading-relaxed font-normal text-zinc-700">
                            {article.excerpt}
                          </p>

                          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-600">
                            <span className="font-medium text-zinc-900">{author.name}</span>
                            <span className="hidden sm:inline">{author.role}</span>
                            <span aria-hidden="true">·</span>
                            <time dateTime={article.date}>{article.dateLabel}</time>
                            <span aria-hidden="true">·</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                              <span className="tabular-nums">{article.readMins} min read</span>
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">{article.reads.toLocaleString()} reads</span>
                            <button
                              type="button"
                              onClick={() => toggleExpanded(article.slug)}
                              aria-expanded={isExpanded}
                              aria-controls={excerptId}
                              className="ml-auto inline-flex min-h-8 items-center gap-1 rounded-md px-2 font-medium text-teal-700 transition-colors hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                            >
                              {isExpanded ? "Show less" : "Read more"}
                            </button>
                          </div>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
