"use client";

import { useEffect, useId, useRef } from "react";
import BrandTile from "./brand-tile";
import { Check, Download, Plus, Star, X } from "lucide-react";
import type { Integration } from "./data";
import { buildLongDescription, formatCount } from "./data";
import { CATEGORY_ICON, STATUS_STYLE } from "./icons";

interface DetailDrawerProps {
  item: Integration | null;
  installed: boolean;
  onToggleInstall: () => void;
  onClose: () => void;
}

export default function DetailDrawer({ item, installed, onToggleInstall, onClose }: DetailDrawerProps) {
  const reactId = useId();
  const titleId = `${reactId}-drawer-title`;
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!item) return;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  const CategoryIcon = CATEGORY_ICON[item.category];
  const status = STATUS_STYLE[item.status];
  const StatusIcon = status.icon;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto border-l border-zinc-800 bg-zinc-950 p-6 shadow-2xl animate-[rise_0.3s_ease-out_backwards] motion-reduce:animate-none sm:p-8"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400">
            <CategoryIcon className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
            {item.category}
          </span>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close panel"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 outline-none transition-colors hover:bg-zinc-900 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* The mark sits centred on a plain field rather than filling the banner: cropping a square
            logo to 16:9 clips the glyph and reads as a broken image, not a header. */}
        <div className="mt-4 flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
          <BrandTile slug={item.slug} name={item.name} className="h-24 w-24 rounded-xl" />
        </div>

        <div className="mt-5 flex items-start justify-between gap-3">
          <h2 id={titleId} className="text-xl font-semibold text-zinc-50">
            {item.name}
          </h2>
          <span className={`inline-flex flex-none items-center gap-1 text-sm font-medium ${status.className}`}>
            <StatusIcon className="h-4 w-4 flex-none" aria-hidden="true" />
            {item.status}
          </span>
        </div>

        <p className="mt-3 text-sm font-normal leading-relaxed text-zinc-300">
          {buildLongDescription(item)}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Capabilities">
          {item.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-300"
            >
              {tag}
            </li>
          ))}
        </ul>

        <dl className="mt-6 grid grid-cols-3 gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div>
            <dt className="text-xs font-normal text-zinc-400">Price</dt>
            <dd className="mt-0.5 text-sm font-semibold tabular-nums text-zinc-50">{item.priceLabel}</dd>
          </div>
          <div>
            <dt className="text-xs font-normal text-zinc-400">Installs</dt>
            <dd className="mt-0.5 inline-flex items-center gap-1 text-sm font-semibold tabular-nums text-zinc-50">
              <Download className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
              {formatCount(item.installs)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-normal text-zinc-400">Rating</dt>
            <dd className="mt-0.5 inline-flex items-center gap-1 text-sm font-semibold tabular-nums text-zinc-50">
              <Star className="h-3.5 w-3.5 flex-none fill-amber-400 text-amber-400" aria-hidden="true" />
              {item.rating.toFixed(1)}
              <span className="font-normal text-zinc-400">({formatCount(item.reviews)})</span>
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={onToggleInstall}
          aria-pressed={installed}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
            installed
              ? "border border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
              : "bg-emerald-400 text-zinc-950 hover:bg-emerald-300"
          }`}
        >
          {installed ? (
            <>
              <Check className="h-4 w-4 flex-none" aria-hidden="true" />
              Installed
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 flex-none" aria-hidden="true" />
              Install {item.name}
            </>
          )}
        </button>
        <span className="sr-only" role="status" aria-live="polite">
          {installed ? `${item.name} installed.` : ""}
        </span>
      </div>
    </div>
  );
}
