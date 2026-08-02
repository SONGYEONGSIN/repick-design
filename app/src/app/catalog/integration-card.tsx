"use client";

import BrandTile from "./brand-tile";
import { Download, Star } from "lucide-react";
import type { Integration } from "./data";
import { formatCount } from "./data";
import { CATEGORY_ICON, STATUS_STYLE } from "./icons";

interface IntegrationCardProps {
  item: Integration;
  view: "grid" | "list";
  index: number;
  onSelect: (item: Integration) => void;
}

/** Entrance stagger capped so a long grid never queues a multi-second reveal. */
function entranceDelayMs(index: number): number {
  return Math.min(index, 11) * 35;
}

export default function IntegrationCard({ item, view, index, onSelect }: IntegrationCardProps) {
  const CategoryIcon = CATEGORY_ICON[item.category];
  const status = STATUS_STYLE[item.status];
  const StatusIcon = status.icon;

  const thumb = (
    <div
      className={
        view === "grid"
          ? "relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-800"
          : "relative h-20 w-20 flex-none overflow-hidden rounded-lg bg-zinc-800 sm:h-24 sm:w-24"
      }
    >
      <BrandTile slug={item.slug} name={item.name} className="absolute inset-0 h-full w-full" />
    </div>
  );

  const metaRow = (
    <div className="flex items-center justify-between gap-2">
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400">
        <CategoryIcon className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
        {item.category}
      </span>
      <span className={`inline-flex items-center gap-1 text-xs font-medium ${status.className}`}>
        <StatusIcon className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
        {item.status}
      </span>
    </div>
  );

  const footerRow = (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-400">
      <span className="font-semibold tabular-nums text-zinc-100">{item.priceLabel}</span>
      <span className="inline-flex items-center gap-1 tabular-nums">
        <Download className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
        {formatCount(item.installs)}
      </span>
      <span className="inline-flex items-center gap-1 tabular-nums">
        <Star className="h-3.5 w-3.5 flex-none fill-amber-400 text-amber-400" aria-hidden="true" />
        {item.rating.toFixed(1)}
        <span className="text-zinc-400">({formatCount(item.reviews)})</span>
      </span>
    </div>
  );

  if (view === "list") {
    return (
      <li role="listitem" className="min-w-0">
        <button
          type="button"
          onClick={() => onSelect(item)}
          style={{ animationDelay: `${entranceDelayMs(index)}ms` }}
          className="flex w-full min-w-0 items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-left transition-colors animate-[rise_0.4s_ease-out_backwards] hover:border-zinc-700 hover:bg-zinc-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 motion-reduce:animate-none"
        >
          {thumb}
          <div className="min-w-0 flex-1">
            {metaRow}
            <p className="mt-1.5 truncate text-base font-semibold text-zinc-50">{item.name}</p>
            <p className="mt-0.5 line-clamp-1 text-sm font-normal text-zinc-400">{item.description}</p>
            {footerRow}
          </div>
        </button>
      </li>
    );
  }

  return (
    <li role="listitem" className="min-w-0">
      <button
        type="button"
        onClick={() => onSelect(item)}
        style={{ animationDelay: `${entranceDelayMs(index)}ms` }}
        className="flex h-full w-full min-w-0 flex-col rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-left transition-colors animate-[rise_0.4s_ease-out_backwards] hover:border-zinc-700 hover:bg-zinc-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 motion-reduce:animate-none"
      >
        {thumb}
        <div className="mt-3">{metaRow}</div>
        <p className="mt-2 truncate text-base font-semibold text-zinc-50">{item.name}</p>
        <p className="mt-1 line-clamp-2 text-sm font-normal text-zinc-400">{item.description}</p>
        {footerRow}
      </button>
    </li>
  );
}
