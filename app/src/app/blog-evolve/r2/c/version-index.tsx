"use client";

// app/src/app/blog-evolve/r2/c/version-index.tsx
//
// The spine's jump-nav: a compact, always-visible index of every version currently in view (after
// filtering) that (a) scrolls the main list to a version on click and (b) is kept in sync with
// scroll position via IntersectionObserver in the parent, so the active marker reflects where the
// reader actually is, not just where they last clicked. On desktop it's a sticky vertical rail
// beside the spine; below `lg` there is no room for a second column, so it becomes a horizontally
// scrollable strip pinned above the list — still the same functional index, not a decorative
// re-skin, so the "jump to version" and "filter by type" behaviour the brief calls out survives at
// 390px rather than disappearing with the rest of the desktop chrome.
import type { Release } from "./data";
import { TYPE_META } from "./type-meta";

export default function VersionIndex({
  releases,
  activeId,
  onJump,
}: {
  releases: Release[];
  activeId: string | null;
  onJump: (id: string) => void;
}) {
  return (
    <div className="lg:sticky lg:top-20 lg:self-start">
      <p id="version-index-label" className="mb-2 text-xs font-bold tracking-wide text-zinc-500 uppercase">
        Jump to version
      </p>
      {releases.length === 0 ? (
        <p className="text-sm font-normal text-zinc-500">No versions match the current filter.</p>
      ) : (
        <nav aria-labelledby="version-index-label">
          <ul className="flex gap-1.5 overflow-x-auto pb-1 lg:max-h-[calc(100vh-8rem)] lg:flex-col lg:gap-0.5 lg:overflow-x-visible lg:overflow-y-auto lg:pb-0 lg:pr-1">
            {releases.map((release) => {
              const meta = TYPE_META[release.type];
              const isActive = release.id === activeId;
              return (
                <li key={release.id} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => onJump(release.id)}
                    className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 ${
                      isActive ? "bg-blue-50 font-semibold text-blue-700" : "font-normal text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                  >
                    <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${meta.dot}`} />
                    <span className="font-mono tabular-nums">{release.version}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
