"use client";

import { useState } from "react";
import type { Work } from "@/lib/works";

export function WorkCard({ work, numeral }: { work: Work; numeral: string }) {
  const [loaded, setLoaded] = useState(false);
  const h = work.previewH ?? 300;
  return (
    <a
      href={work.route}
      className="group block min-w-0 overflow-hidden rounded-xl border border-zinc-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-sm active:translate-y-0 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0"
    >
      <div aria-hidden="true" className="relative w-full overflow-hidden border-b border-zinc-100 bg-zinc-50" style={{ height: h }}>
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-zinc-100 to-zinc-50 motion-reduce:animate-none" />
        )}
        <iframe
          src={work.route}
          loading="lazy"
          title={`${work.brand} 미리보기`}
          tabIndex={-1}
          scrolling="no"
          onLoad={() => setLoaded(true)}
          className={`pointer-events-none absolute left-0 top-0 origin-top-left transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          style={{ width: "1440px", height: "1100px", transform: "scale(0.34)", border: 0 }}
        />
      </div>
      <div className="flex items-start justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{work.brand}</p>
          <p className="mt-0.5 line-clamp-1 text-xs leading-relaxed text-zinc-500 group-hover:line-clamp-3 group-focus-visible:line-clamp-3">{work.desc}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {work.status && <StatusBadge status={work.status} />}
          <span className="rounded-md bg-zinc-100 px-2 py-1 font-mono text-[11px] font-semibold tabular-nums text-zinc-600">
            {numeral}·{work.id}
          </span>
        </div>
      </div>
    </a>
  );
}

function StatusBadge({ status }: { status: NonNullable<Work["status"]> }) {
  if (status === "winner") {
    return <span className="rounded-md bg-zinc-900 px-2 py-0.5 text-[11px] font-semibold text-white">채택</span>;
  }
  if (status === "dropped") {
    return <span className="rounded-md border border-zinc-200 px-2 py-0.5 text-[11px] font-semibold text-zinc-500">탈락</span>;
  }
  return <span className="rounded-md border border-dashed border-zinc-300 px-2 py-0.5 text-[11px] font-semibold text-zinc-600">심사 대기</span>;
}
