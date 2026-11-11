"use client";

import { useState } from "react";
import type { PeriodData } from "../lib/data";
import { Card } from "./ui";
import { ProcessMap } from "./ProcessMap";
import { EdgeInspector } from "./EdgeInspector";
import { PathTable } from "./PathTable";
import { StageDetailCard } from "./StageDetailCard";

/**
 * Groups the dominant chart and its required accessible fallback together. `hoveredId` is local
 * to this section and ephemeral (mouse hover on the chart, or keyboard focus landing on a table
 * row's pin button) — it never touches `pinnedStageId`, which is lifted one level up only because
 * both the chart's nodes and the table's pin buttons can set it.
 */
export function FlowSection({
  data,
  pinnedStageId,
  onPinStage,
  tableAnchorId,
}: {
  data: PeriodData;
  pinnedStageId: string | null;
  onPinStage: (id: string) => void;
  tableAnchorId: string;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
      <Card className="min-w-0 xl:col-span-12">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-base font-semibold text-zinc-50">Pipeline flow — {data.label}</h2>
          <p className="text-xs font-normal text-zinc-400">
            {data.stages.length} stages &middot; checkout to production
          </p>
        </div>
        <div className="mt-4">
          <ProcessMap
            data={data}
            pinnedStageId={pinnedStageId}
            onPinStage={onPinStage}
            hoveredId={hoveredId}
            onHover={setHoveredId}
          />
        </div>
        <div className="mt-4">
          <EdgeInspector data={data} hoveredId={hoveredId} />
        </div>
      </Card>

      <Card id={tableAnchorId} className="min-w-0 xl:col-span-7">
        <h2 className="mb-4 text-base font-semibold text-zinc-50">Path summary</h2>
        <PathTable data={data} pinnedStageId={pinnedStageId} onPinStage={onPinStage} onHoverEdge={setHoveredId} />
      </Card>

      <div className="min-w-0 xl:col-span-5">
        <StageDetailCard data={data} pinnedStageId={pinnedStageId} />
      </div>
    </div>
  );
}
