"use client";

import { useEffect, useRef, useState } from "react";
import type { Work } from "@/lib/works";
import { STRINGS, type Lang } from "./gallery-i18n";

/** Desktop preview is authored at this width; the card scales it down to whatever width the grid gives it. */
const PREVIEW_W = 1440;

export function WorkCard({ work, lang, label }: { work: Work; lang: Lang; label: string }) {
  const [loaded, setLoaded] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  // Scale from the measured card width, never a constant — a hardcoded factor goes stale the moment
  // the grid changes and silently crops the right edge of every desktop preview.
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / PREVIEW_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const h = work.previewH ?? 300;
  const t = STRINGS[lang];
  // Catalog works route to their detail page; evolve candidates (id has "/") have no detail page.
  const href = work.id.includes("/") ? work.route : `/gallery/${work.id}`;
  return (
    <a href={href}
      className="group block min-w-0 overflow-hidden rounded-xl border border-zinc-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-sm active:translate-y-0 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0">
      <div ref={frameRef} aria-hidden="true" className="relative w-full overflow-hidden border-b border-zinc-100 bg-zinc-50" style={{ height: h }}>
        {!loaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-zinc-100 to-zinc-50 motion-reduce:animate-none" />}
        {work.category === "mobile" ? (
          <iframe src={work.route} loading="lazy" title={`${work.brand} preview`} tabIndex={-1}
            onLoad={() => setLoaded(true)}
            className={`pointer-events-none absolute left-1/2 top-0 origin-top transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
            style={{ width: "390px", height: "844px", transform: `translateX(-50%) scale(${h / 844})`, border: 0 }} />
        ) : (
          <iframe src={work.route} loading="lazy" title={`${work.brand} preview`} tabIndex={-1} scrolling="no" onLoad={() => setLoaded(true)}
            className={`pointer-events-none absolute left-0 top-0 origin-top-left transition-opacity duration-300 ${loaded && scale > 0 ? "opacity-100" : "opacity-0"}`}
            style={{ width: PREVIEW_W, height: scale > 0 ? h / scale : 1100, transform: `scale(${scale})`, border: 0 }} />
        )}
      </div>
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 truncate text-sm font-bold">{work.brand}</p>
          {work.status && <StatusBadge status={work.status} label={t.status[work.status]} />}
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500 group-hover:line-clamp-none">{work.desc[lang]}</p>
        {label && (
          <div className="mt-2.5">
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">{label}</span>
          </div>
        )}
      </div>
    </a>
  );
}

function StatusBadge({ status, label }: { status: NonNullable<Work["status"]>; label: string }) {
  if (status === "winner") return <span className="shrink-0 rounded-md bg-zinc-900 px-2 py-0.5 text-[11px] font-semibold text-white">{label}</span>;
  if (status === "dropped") return <span className="shrink-0 rounded-md border border-zinc-200 px-2 py-0.5 text-[11px] font-semibold text-zinc-500">{label}</span>;
  return <span className="shrink-0 rounded-md border border-dashed border-zinc-300 px-2 py-0.5 text-[11px] font-semibold text-zinc-600">{label}</span>;
}
