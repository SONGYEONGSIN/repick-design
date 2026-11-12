"use client";

import { Pin } from "lucide-react";
import type { VendorDef, VendorId } from "./data";
import { compositeForView, formatComposite, type ViewMode } from "./format";
import { VendorSwatch, type SwatchTone } from "./vendor-swatch";

interface VendorChipsProps {
  vendors: VendorDef[];
  pinnedId: VendorId;
  hoveredId: VendorId | null;
  view: ViewMode;
  onPin: (id: VendorId) => void;
  onHover: (id: VendorId | null) => void;
}

const STATUS_STYLE: Record<VendorDef["status"], string> = {
  Preferred: "bg-rose-50 text-rose-700",
  Secondary: "bg-zinc-100 text-zinc-600",
  Approved: "bg-zinc-100 text-zinc-600",
};

/**
 * The legend doubles as the selection control: click to pin (persists until
 * changed), hover or keyboard-focus for an ephemeral preview. The preview
 * never fires for the chip that is already pinned — see RadarChart's guard.
 */
export default function VendorChips({
  vendors,
  pinnedId,
  hoveredId,
  view,
  onPin,
  onHover,
}: VendorChipsProps) {
  return (
    <ul className="space-y-2">
      {vendors.map((vendor) => {
        const isPinned = vendor.id === pinnedId;
        const isHovered = vendor.id === hoveredId && !isPinned;
        const tone: SwatchTone = isPinned ? "pinned" : isHovered ? "hover" : "neutral";
        return (
          <li key={vendor.id}>
            <button
              type="button"
              aria-pressed={isPinned}
              onClick={() => onPin(vendor.id)}
              onMouseEnter={() => onHover(vendor.id)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(vendor.id)}
              onBlur={() => onHover(null)}
              className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 ${
                isPinned
                  ? "border-rose-200 bg-rose-50/60"
                  : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
              }`}
            >
              <VendorSwatch marker={vendor.marker} stroke={vendor.stroke} tone={tone} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">
                    {vendor.shortName}
                  </span>
                  {isPinned ? (
                    <Pin className="h-3.5 w-3.5 shrink-0 fill-rose-600 text-rose-600" aria-hidden="true" />
                  ) : null}
                </span>
                <span
                  className={`mt-0.5 inline-block rounded px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide ${STATUS_STYLE[vendor.status]}`}
                >
                  {vendor.status}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-sm font-semibold tabular-nums text-zinc-900">
                  {formatComposite(compositeForView(vendor, view))}
                </span>
                <span className="block text-[11px] font-normal text-zinc-600">composite</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
