"use client";

import Image from "next/image";
import type { Finding } from "../lib/data";
import { Card, CardHeader, ColumnBadge, SeverityBadge } from "./ui";

/**
 * Pure consumer of the "finding pin" set by clicking a Kanban card. Independent from the category
 * pin above: picking a category here changes nothing, and picking a finding never changes the
 * category pin. Defaults to the single worst open finding so this card is never an empty shell.
 */
export function FindingDetailCard({ finding, categoryName }: { finding: Finding; categoryName: string }) {
  return (
    <Card className="flex min-w-0 flex-col">
      <CardHeader
        title="Finding Detail"
        subtitle="Pinned from the board"
        action={<span className="text-[11px] font-medium tabular-nums text-zinc-400">{finding.id}</span>}
      />
      <div className="flex-1 px-5 py-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <SeverityBadge severity={finding.severity} />
          <ColumnBadge column={finding.column} />
          <span className="rounded-md bg-zinc-800 px-1.5 py-0.5 text-[11px] font-medium text-zinc-400">
            {categoryName}
          </span>
        </div>

        <p className="mt-3 text-sm font-medium leading-snug text-zinc-50">{finding.title}</p>
        <p className="mt-2 text-xs leading-relaxed text-zinc-400">{finding.note}</p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
          <div className="flex min-w-0 items-center gap-2">
            <Image
              src={`https://images.unsplash.com/photo-${finding.owner.photoId}?q=80&w=64&h=64&fit=crop&crop=faces`}
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 shrink-0 rounded-full object-cover"
            />
            <span className="truncate text-xs text-zinc-400">{finding.owner.name}</span>
          </div>
          <span className="shrink-0 text-xs tabular-nums text-zinc-400">Due {finding.due}</span>
        </div>
      </div>
    </Card>
  );
}
