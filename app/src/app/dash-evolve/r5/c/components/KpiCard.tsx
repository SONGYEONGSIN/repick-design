"use client";

import type { ComponentType, ReactNode } from "react";
import { Card, DeltaBadge, EyebrowLabel } from "./ui";

export default function KpiCard({
  icon: Icon,
  label,
  value,
  caption,
  delta,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: ReactNode;
  caption?: string;
  delta?: { direction: "up" | "down" | "flat"; text: string } | null;
}) {
  return (
    <Card className="flex min-w-0 flex-1 flex-col gap-2 p-3.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 shrink-0 text-zinc-400 dark:text-zinc-500" aria-hidden="true" />
          <EyebrowLabel>{label}</EyebrowLabel>
        </div>
        {delta ? <DeltaBadge direction={delta.direction} text={delta.text} /> : null}
      </div>
      <p className="text-xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">{value}</p>
      {caption ? <p className="text-xs text-zinc-500 dark:text-zinc-400">{caption}</p> : null}
    </Card>
  );
}
