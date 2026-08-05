"use client";

// app/src/app/blog-evolve/r2/c/release-card.tsx
//
// One entry on the spine. Every card uses the same template — deliberately: r1's timeline
// candidate alternated between four card templates by position, which this round was briefed to
// avoid repeating. Here the single recurring shape *is* the point: a changelog reads as one
// consistent ledger, not a magazine layout.
import { ChevronDown } from "lucide-react";
import type { Release } from "./data";
import { TYPE_META } from "./type-meta";
import CoverArt from "./cover-art";
import Avatar from "./avatar";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export default function ReleaseCard({
  release,
  expanded,
  onToggleExpanded,
  registerRef,
}: {
  release: Release;
  expanded: boolean;
  onToggleExpanded: () => void;
  registerRef: (el: HTMLLIElement | null) => void;
}) {
  const meta = TYPE_META[release.type];
  const Icon = meta.icon;
  const detailId = `changelog-${release.id}`;

  return (
    <li ref={registerRef} id={`release-${release.id}`} data-release-id={release.id} className="relative scroll-mt-24 pl-12 sm:pl-14">
      <span aria-hidden="true" className={`absolute top-1 left-[11px] flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white sm:left-[15px] ${meta.dot}`} />

      <article className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row">
          <CoverArt
            seedKey={release.id}
            hue={meta.hue}
            icon={Icon}
            title={release.title}
            className="aspect-[16/9] shrink-0 sm:aspect-square sm:h-24 sm:w-24"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
              <span className="font-mono text-sm font-bold tabular-nums text-zinc-900">{release.version}</span>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${meta.badgeBg} ${meta.badgeText}`}>
                <Icon aria-hidden="true" className="h-3 w-3" />
                {meta.label}
              </span>
              <time className="text-xs font-normal text-zinc-500">{release.date}</time>
            </div>

            <h3 className="mt-1.5 text-base font-bold text-zinc-900 sm:text-lg">{release.title}</h3>
            <p className="mt-1.5 text-sm font-normal text-zinc-600">{release.summary}</p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Avatar name={release.authorName} size={24} />
                <span className="text-xs font-normal text-zinc-600">
                  <span className="font-semibold text-zinc-700">{release.authorName}</span> · {release.authorRole}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-3">
          <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
            {release.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-normal text-zinc-600">
                {tag}
              </li>
            ))}
          </ul>

          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={detailId}
            onClick={onToggleExpanded}
            className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-blue-700 hover:text-blue-800 ${FOCUS}`}
          >
            {expanded ? "Hide full changelog" : "View full changelog"}
            <ChevronDown aria-hidden="true" strokeWidth={2.25} className={`h-4 w-4 transition-transform motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>

        {expanded && (
          <div id={detailId} className="mt-3 rounded-xl bg-zinc-50 p-3.5 sm:p-4">
            <h4 className="text-xs font-bold tracking-wide text-zinc-700 uppercase">Full changelog</h4>
            <ul className="mt-2 space-y-1.5">
              {release.changes.map((change, i) => (
                <li key={i} className="flex gap-2 text-sm font-normal text-zinc-600">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </li>
  );
}
