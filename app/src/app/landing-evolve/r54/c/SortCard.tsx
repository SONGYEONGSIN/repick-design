"use client";

import { useState } from "react";
import { GripVertical } from "lucide-react";
import type { BucketDef, Item } from "./data";
import { formatUsd } from "./stats";
import { CAPTION, CARD_BORDER_HEX, FOCUS_RING, MUTED_TEXT, ZONE_BORDER_HEX } from "./tokens";

type SortCardProps = {
  item: Item;
  otherBuckets: BucketDef[];
  onMove: (itemId: string, bucketId: BucketDef["id"]) => void;
};

/**
 * One item card. It is a real native drag source (mouse/trackpad) AND carries a full keyboard-
 * and-touch equivalent: a "Move to <bucket>" button per other bucket, each a plain tabbable
 * `<button>` whose visible text is its entire accessible name (no aria-label divergence). Native
 * HTML drag-and-drop has no reliable touch-screen path, so the buttons are not a fallback for
 * keyboard users only -- they are the universal, always-available way to operate this device.
 */
export function SortCard({ item, otherBuckets, onMove }: SortCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      draggable
      onDragStart={(event: React.DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData("text/plain", item.id);
        event.dataTransfer.effectAllowed = "move";
        setIsDragging(true);
      }}
      onDragEnd={() => setIsDragging(false)}
      role="group"
      aria-label={`${item.name}, ${item.category}, ${item.grade} condition, ${formatUsd(item.listPrice)} if listed for cash`}
      className={`flex flex-col gap-2 rounded-xl border bg-white p-3 transition-opacity ${isDragging ? "opacity-40" : "opacity-100"}`}
      style={{ borderColor: CARD_BORDER_HEX }}
    >
      <div className="flex items-start gap-2">
        <GripVertical aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-[#A1A1AA]" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold leading-snug">{item.name}</p>
          <p className={`${CAPTION} ${MUTED_TEXT} truncate`}>
            {item.category} &middot; {item.grade}
          </p>
        </div>
        <p className="flex-none text-[13px] font-semibold tabular-nums">{formatUsd(item.listPrice)}</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {otherBuckets.map((bucket) => (
          <button
            key={bucket.id}
            type="button"
            onClick={() => onMove(item.id, bucket.id)}
            className={`${FOCUS_RING} inline-flex min-h-9 items-center rounded-full border px-2.5 text-[12px] font-semibold`}
            style={{ borderColor: ZONE_BORDER_HEX }}
          >
            Move to {bucket.label}
          </button>
        ))}
      </div>
    </div>
  );
}
