"use client";

import Image from "next/image";
import { ScanLine } from "lucide-react";
import { ITEMS, formatPrice, scanResult, type ScanItem } from "./data";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400";

export default function ScanReveal({
  activeItem,
  scanPct,
  onSelectItem,
  onScanChange,
}: {
  activeItem: ScanItem;
  scanPct: number;
  onSelectItem: (id: string) => void;
  onScanChange: (pct: number) => void;
}) {
  const { revealed, hidden, confidencePct } = scanResult(activeItem, scanPct);
  const total = activeItem.defects.length;

  return (
    <div>
      <div
        role="group"
        aria-label="Choose an item to scan"
        className="flex flex-wrap gap-2"
      >
        {ITEMS.map((item) => {
          const isActive = item.id === activeItem.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelectItem(item.id)}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors motion-reduce:transition-none ${FOCUS} ${
                isActive
                  ? "border-violet-500 bg-violet-600 text-white"
                  : "border-white/15 bg-white/[0.03] text-zinc-300 hover:border-violet-500/50"
              }`}
            >
              <span className="relative block h-5 w-5 overflow-hidden rounded-full bg-zinc-800">
                <Image
                  src={`https://images.unsplash.com/photo-${item.photoId}?q=80&w=40&auto=format&fit=crop`}
                  alt=""
                  fill
                  sizes="20px"
                  className="object-cover"
                />
              </span>
              {item.name}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-800">
          <Image
            src={`https://images.unsplash.com/photo-${activeItem.photoId}?q=80&w=800&auto=format&fit=crop`}
            alt={activeItem.alt}
            fill
            sizes="(min-width: 1024px) 560px, 90vw"
            className="object-cover"
          />

          {/* Scan line + dim overlay on the not-yet-checked side. Purely visual — the same
              revealed/hidden split is announced in text below, so nothing here is
              aria-hidden's only carrier of information. */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 bg-[#0B0B0F]/55"
            style={{ left: `${scanPct}%` }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-y-0 w-px bg-violet-400 shadow-[0_0_12px_2px_rgba(167,139,250,0.65)]"
            style={{ left: `${scanPct}%` }}
          />

          {activeItem.defects.map((d) => {
            const isRevealed = d.xPct <= scanPct;
            return (
              <span
                key={d.id}
                aria-hidden="true"
                className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-colors duration-200 ${
                  isRevealed
                    ? "border-violet-300 bg-violet-500"
                    : "border-white/40 bg-white/10"
                }`}
                style={{ left: `${d.xPct}%`, top: `${d.yPct}%` }}
              />
            );
          })}
        </div>

        <div>
          <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-violet-400">
            <ScanLine className="h-3.5 w-3.5" aria-hidden="true" />
            live ai scan
          </div>

          <label htmlFor="scan-range" className="mt-4 block text-sm font-semibold text-white">
            Drag to run the scan
          </label>
          <input
            id="scan-range"
            type="range"
            min={0}
            max={100}
            step={1}
            value={scanPct}
            onChange={(e) => onScanChange(Number(e.target.value))}
            aria-label={`AI defect scan position for ${activeItem.name}, ${scanPct} percent, ${revealed.length} of ${total} points checked, ${confidencePct} percent confidence`}
            className={`mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-violet-500 ${FOCUS}`}
          />

          <p className="mt-5 text-3xl font-extrabold tabular-nums tracking-[-0.02em] text-white">
            {confidencePct}%{" "}
            <span className="text-base font-normal text-zinc-400">confidence</span>
          </p>
          <p className="mt-1 text-sm font-normal text-zinc-400">
            {revealed.length} of {total} check-points scanned
          </p>

          <ul className="mt-5 space-y-2">
            {revealed.map((d) => (
              <li
                key={d.id}
                className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm font-normal text-zinc-200"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" aria-hidden="true" />
                {d.label}
              </li>
            ))}
            {hidden.map((d) => (
              <li
                key={d.id}
                className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-normal text-zinc-400"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" aria-hidden="true" />
                Not yet scanned
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
            <span className="text-lg font-extrabold tabular-nums text-white">
              {formatPrice(activeItem.price)}
            </span>
            <span className="text-sm font-normal tabular-nums text-zinc-400 line-through">
              {formatPrice(activeItem.originalPrice)}
            </span>
            <span className="rounded-md bg-violet-600 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-white">
              -{activeItem.discountPct}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
