"use client";

import type { Work } from "@/lib/works";

/** Full-bleed continuous marquee of live work previews (duplicated set for a seamless loop). */
export function Showcase({ works, label }: { works: Work[]; label: string }) {
  const tiles = [...works, ...works];
  return (
    <section aria-label={label} className="group relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden border-y border-zinc-200 bg-zinc-50 py-6">
      <ul className="flex w-max gap-5 pl-5 animate-[marquee_60s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {tiles.map((w, i) => (
          <ShowcaseTile key={`${w.id}-${i}`} work={w} duplicate={i >= works.length} />
        ))}
      </ul>
    </section>
  );
}

function ShowcaseTile({ work, duplicate }: { work: Work; duplicate: boolean }) {
  const mobile = work.category === "mobile";
  return (
    <li aria-hidden={duplicate || undefined} className="shrink-0">
      <a href={`/gallery/${work.id}`} tabIndex={duplicate ? -1 : 0}
        className="relative block h-[200px] w-[320px] overflow-hidden rounded-xl border border-zinc-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2">
        <span aria-hidden="true" className="absolute inset-0 block">
          {mobile ? (
            <iframe src={work.route} loading="lazy" tabIndex={-1} title=""
              className="pointer-events-none absolute left-1/2 top-1/2"
              style={{ width: "390px", height: "844px", transform: "translate(-50%, -50%) scale(0.237)", border: 0 }} />
          ) : (
            <iframe src={work.route} loading="lazy" tabIndex={-1} scrolling="no" title=""
              className="pointer-events-none absolute left-0 top-0 origin-top-left"
              style={{ width: "1440px", height: "900px", transform: "scale(0.2223)", border: 0 }} />
          )}
        </span>
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-white via-white/85 to-transparent px-3 pb-2 pt-8">
          <span className="truncate text-xs font-bold text-zinc-900">{work.brand}</span>
        </span>
      </a>
    </li>
  );
}
