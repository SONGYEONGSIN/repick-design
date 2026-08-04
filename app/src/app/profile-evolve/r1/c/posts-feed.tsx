"use client";

import { useId, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Clock, Lock } from "lucide-react";
import { POSTS, type PostAccess } from "./data";

const DISPLAY_FONT = { fontFamily: "var(--font-display-wide)" } as const;

const FILTERS: { id: "all" | PostAccess; label: string }[] = [
  { id: "all", label: "All posts" },
  { id: "free", label: "Free" },
  { id: "member", label: "Members only" },
];

export default function PostsFeed() {
  const [filter, setFilter] = useState<"all" | PostAccess>("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const countId = useId();

  const visible = useMemo(
    () => (filter === "all" ? POSTS : POSTS.filter((p) => p.access === filter)),
    [filter],
  );

  return (
    <section id="latest-posts" aria-labelledby="latest-posts-heading" className="border-b border-zinc-800">
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="latest-posts-heading" style={DISPLAY_FONT} className="text-xl font-semibold text-zinc-50 sm:text-2xl">
              Latest posts
            </h2>
            <p id={countId} aria-live="polite" className="mt-1 text-sm font-normal text-zinc-400">
              Showing <span className="tabular-nums">{visible.length}</span> of{" "}
              <span className="tabular-nums">{POSTS.length}</span> posts
            </p>
          </div>

          <div role="group" aria-label="Filter posts by access" className="flex gap-1 rounded-full border border-zinc-700 bg-zinc-900 p-1">
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f.id)}
                  className={
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 " +
                    (active ? "bg-cyan-400 text-zinc-950" : "text-zinc-300 hover:bg-zinc-800")
                  }
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <ul className="mt-8 divide-y divide-zinc-800 border-t border-zinc-800">
          {visible.map((post) => {
            const isOpen = !!expanded[post.id];
            const panelId = `post-panel-${post.id}`;
            return (
              <li key={post.id} className="py-6 first:pt-0">
                <article className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-zinc-400">
                    <time dateTime={post.dateISO} className="tabular-nums">
                      {post.dateLabel}
                    </time>
                    <span aria-hidden="true">&middot;</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="tabular-nums">{post.minutes} min read</span>
                    </span>
                    <span aria-hidden="true">&middot;</span>
                    <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-zinc-300">{post.tag}</span>
                    {post.access === "member" && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-cyan-300">
                        <Lock className="h-3 w-3" aria-hidden="true" />
                        Members only
                      </span>
                    )}
                  </div>

                  <h3 style={DISPLAY_FONT} className="mt-2 text-lg font-semibold text-zinc-50">
                    {post.title}
                  </h3>

                  <p className="mt-2 max-w-2xl text-[15px] leading-relaxed font-normal text-zinc-300">
                    {post.excerptShort}
                  </p>

                  {isOpen && (
                    <p id={panelId} className="mt-2 max-w-2xl text-[15px] leading-relaxed font-normal text-zinc-300">
                      {post.excerptFull}
                    </p>
                  )}

                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setExpanded((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                    className="mt-3 inline-flex items-center gap-1 rounded-full text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                  >
                    {isOpen ? "Show less" : "Read preview"}
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </article>
              </li>
            );
          })}
        </ul>

        {visible.length === 0 && (
          <p className="mt-8 text-sm font-normal text-zinc-400">No posts match this filter yet.</p>
        )}
      </div>
    </section>
  );
}
