"use client";

import { useId, useMemo, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Clock, Quote, Sparkles } from "lucide-react";
import { INITIAL_VISIBLE, LOAD_STEP, POSTS, TAGS, type Post, type Tag } from "./data";

const DISPLAY_FONT = { fontFamily: "var(--font-display-wide)" } as const;

type FilterValue = "all" | Tag;

function groupByMonth(posts: Post[]) {
  const groups: { month: string; posts: Post[] }[] = [];
  for (const post of posts) {
    const last = groups[groups.length - 1];
    if (last && last.month === post.monthGroup) {
      last.posts.push(post);
    } else {
      groups.push({ month: post.monthGroup, posts: [post] });
    }
  }
  return groups;
}

function MetaRow({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-stone-600">
      <time dateTime={post.dateISO} className="tabular-nums">
        {post.dateLabel}
      </time>
      <span aria-hidden="true">&middot;</span>
      <span className="inline-flex items-center gap-1">
        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="tabular-nums">{post.minutes} min read</span>
      </span>
      <span aria-hidden="true">&middot;</span>
      <span className="rounded-full border border-stone-300 px-2 py-0.5 text-stone-700">{post.tag}</span>
    </div>
  );
}

function FeatureImageEntry({ post }: { post: Post }) {
  return (
    <article className="min-w-0">
      {post.pinned && (
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-800">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Editor&apos;s pick
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-5 sm:gap-8">
        <div className="sm:col-span-3">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-stone-200">
            <Image
              src={`https://picsum.photos/seed/${post.imageSeed}/1200/900`}
              alt={post.imageAlt ?? ""}
              fill
              sizes="(min-width: 640px) 55vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex min-w-0 flex-col justify-center sm:col-span-2">
          <MetaRow post={post} />
          <h3
            style={DISPLAY_FONT}
            className="mt-2 text-2xl leading-tight font-semibold text-stone-900 sm:text-3xl"
          >
            {post.title}
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed font-normal text-stone-700">{post.excerpt}</p>
        </div>
      </div>
    </article>
  );
}

function FeatureQuoteEntry({ post }: { post: Post }) {
  return (
    <article className="min-w-0 rounded-lg border border-stone-200 bg-stone-100 p-6 sm:p-8">
      <MetaRow post={post} />
      <Quote className="mt-4 h-6 w-6 text-orange-700" aria-hidden="true" />
      <p style={DISPLAY_FONT} className="mt-2 max-w-2xl text-2xl leading-snug font-semibold text-stone-900 sm:text-3xl">
        {post.quote}
      </p>
      <h3 className="mt-4 text-base font-semibold text-stone-900">{post.title}</h3>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed font-normal text-stone-700">{post.excerpt}</p>
    </article>
  );
}

function CompactImageEntry({ post }: { post: Post }) {
  return (
    <article className="flex min-w-0 gap-4">
      <div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-md bg-stone-200 sm:w-24">
        <Image
          src={`https://picsum.photos/seed/${post.imageSeed}/400/400`}
          alt={post.imageAlt ?? ""}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <MetaRow post={post} />
        <h3 style={DISPLAY_FONT} className="mt-1.5 text-base font-semibold text-stone-900 sm:text-lg">
          {post.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed font-normal text-stone-700">{post.excerpt}</p>
      </div>
    </article>
  );
}

function CompactEntry({ post }: { post: Post }) {
  return (
    <article className="min-w-0">
      <MetaRow post={post} />
      <h3 style={DISPLAY_FONT} className="mt-1.5 text-base font-semibold text-stone-900 sm:text-lg">
        {post.title}
      </h3>
      <p className="mt-1 max-w-xl text-sm leading-relaxed font-normal text-stone-700">{post.excerpt}</p>
    </article>
  );
}

function PostEntry({ post }: { post: Post }) {
  switch (post.variant) {
    case "feature-image":
      return <FeatureImageEntry post={post} />;
    case "feature-quote":
      return <FeatureQuoteEntry post={post} />;
    case "compact-image":
      return <CompactImageEntry post={post} />;
    default:
      return <CompactEntry post={post} />;
  }
}

/**
 * The page's main structural element: a chronological, visually-varied editorial timeline grouped
 * by month markers, with a tag filter and a "load more" control that extends it. All 8 most-recent
 * posts (spanning three months) render at rest on load — nothing here is gated behind an
 * interaction, per the assignment's explicit requirement.
 */
export default function Timeline() {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const statusId = useId();

  const filtered = useMemo(
    () => (filter === "all" ? POSTS : POSTS.filter((p) => p.tag === filter)),
    [filter],
  );

  const visible = filtered.slice(0, visibleCount);
  const groups = useMemo(() => groupByMonth(visible), [visible]);
  const hasMore = visibleCount < filtered.length;

  function handleFilter(next: FilterValue) {
    setFilter(next);
    setVisibleCount(INITIAL_VISIBLE);
  }

  return (
    <section aria-label="Timeline of posts" className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Filter posts by topic" className="flex flex-wrap gap-1.5">
          <button
            type="button"
            aria-pressed={filter === "all"}
            onClick={() => handleFilter("all")}
            className={
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50 " +
              (filter === "all"
                ? "bg-stone-900 text-stone-50"
                : "border border-stone-300 text-stone-700 hover:bg-stone-100")
            }
          >
            All topics
          </button>
          {TAGS.map((tag) => {
            const active = filter === tag;
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={active}
                onClick={() => handleFilter(tag)}
                className={
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50 " +
                  (active ? "bg-stone-900 text-stone-50" : "border border-stone-300 text-stone-700 hover:bg-stone-100")
                }
              >
                {tag}
              </button>
            );
          })}
        </div>

        <p id={statusId} aria-live="polite" className="text-xs font-medium text-stone-600">
          Showing <span className="tabular-nums">{visible.length}</span> of{" "}
          <span className="tabular-nums">{filtered.length}</span> posts
        </p>
      </div>

      <div className="mt-8 space-y-12">
        {groups.map((group) => (
          <div key={group.month}>
            <h2 className="flex items-center gap-3 text-sm font-semibold tracking-wide text-stone-900">
              <span className="h-px flex-1 bg-stone-300" aria-hidden="true" />
              <span className="shrink-0">{group.month}</span>
              <span className="h-px flex-1 bg-stone-300 sm:hidden" aria-hidden="true" />
            </h2>
            <div className="mt-6 space-y-8 border-l border-stone-200 pl-6 sm:pl-8">
              {group.posts.map((post) => (
                <PostEntry key={post.id} post={post} />
              ))}
            </div>
          </div>
        ))}

        {groups.length === 0 && (
          <p className="text-sm font-normal text-stone-600">No posts match this topic yet.</p>
        )}
      </div>

      <div className="mt-10 flex justify-center">
        {hasMore ? (
          <button
            type="button"
            onClick={() => setVisibleCount((v) => Math.min(v + LOAD_STEP, filtered.length))}
            aria-describedby={statusId}
            className="rounded-full border border-stone-300 bg-stone-50 px-5 py-2.5 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50"
          >
            Load more posts
          </button>
        ) : (
          filtered.length > 0 && (
            <p className="inline-flex items-center gap-2 text-sm font-medium text-stone-600">
              <CheckCircle2 className="h-4 w-4 text-orange-700" aria-hidden="true" />
              You&apos;re all caught up — that&apos;s every post in this topic.
            </p>
          )
        )}
      </div>
    </section>
  );
}
