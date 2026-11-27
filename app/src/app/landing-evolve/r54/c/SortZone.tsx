"use client";

import { useState } from "react";
import type { BucketDef, BucketId, Item } from "./data";
import { SortCard } from "./SortCard";
import { MUTED_TEXT, STAT_LABEL, ZONE_BORDER_HEX, ZONE_SURFACE_HEX } from "./tokens";

type SortZoneProps = {
  bucket: BucketDef;
  items: Item[];
  total: number;
  allBuckets: BucketDef[];
  onMove: (itemId: string, bucketId: BucketId) => void;
};

/**
 * One labelled drop zone. Native `onDragOver`/`onDrop` is the pointer path; every card inside
 * also exposes a full "Move to <other bucket>" button set, so this zone is reachable and
 * operable with zero pointer input.
 */
export function SortZone({ bucket, items, total, allBuckets, onMove }: SortZoneProps) {
  const [isOver, setIsOver] = useState(false);
  const Icon = bucket.icon;
  const otherBuckets = allBuckets.filter((b) => b.id !== bucket.id);

  return (
    <div
      onDragOver={(event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsOver(false);
        const itemId = event.dataTransfer.getData("text/plain");
        if (itemId) onMove(itemId, bucket.id);
      }}
      role="group"
      aria-label={`${bucket.label} lane, ${items.length} of ${total} items`}
      className="flex min-w-0 flex-col gap-3 rounded-2xl border p-4 transition-colors"
      style={{
        borderColor: isOver ? "#A1A1AA" : ZONE_BORDER_HEX,
        backgroundColor: isOver ? "#F4F4F5" : ZONE_SURFACE_HEX,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`flex h-6 w-6 flex-none items-center justify-center rounded-full ${bucket.fillClass}`}>
            <Icon aria-hidden className={`h-3.5 w-3.5 ${bucket.onFillTextClass}`} />
          </span>
          <p className="text-[14px] font-semibold leading-snug">{bucket.label}</p>
        </div>
        <p className={`${STAT_LABEL} ${MUTED_TEXT} tabular-nums`}>
          {items.length} / {total}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {items.length === 0 ? (
          <p className={`rounded-xl border border-dashed p-4 text-center text-[13px] font-normal ${MUTED_TEXT}`} style={{ borderColor: ZONE_BORDER_HEX }}>
            No items here yet.
          </p>
        ) : (
          items.map((item) => <SortCard key={item.id} item={item} otherBuckets={otherBuckets} onMove={onMove} />)
        )}
      </div>
    </div>
  );
}
