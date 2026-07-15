"use client";

import { ChannelQueueCard } from "./channel-queue-card";
import { AgentWorkloadCard } from "./agent-workload-card";
import { EscalationsCard } from "./escalations-card";
import { SlaComplianceCard } from "./sla-card";
import { AutomationCard, CoverageCard, CsatCard } from "./mini-cards";
import type { ChannelFilter, Period } from "./types";

export type ExpandableCardId = "queue" | "agents" | "escalations";

export function BentoGrid({
  period,
  channel,
  expanded,
  onToggle,
}: {
  period: Period;
  channel: ChannelFilter;
  expanded: Record<ExpandableCardId, boolean>;
  onToggle: (id: ExpandableCardId) => void;
}) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 min-w-0 lg:col-span-7">
        <ChannelQueueCard channel={channel} expanded={expanded.queue} onToggle={() => onToggle("queue")} />
      </div>
      <div className="col-span-12 min-w-0 lg:col-span-5">
        <AgentWorkloadCard channel={channel} expanded={expanded.agents} onToggle={() => onToggle("agents")} />
      </div>

      <div className="col-span-12 min-w-0 lg:col-span-5">
        <EscalationsCard channel={channel} expanded={expanded.escalations} onToggle={() => onToggle("escalations")} />
      </div>
      <div className="col-span-12 min-w-0 lg:col-span-4">
        <SlaComplianceCard period={period} />
      </div>
      <div className="col-span-12 min-w-0 sm:col-span-6 lg:col-span-3">
        <AutomationCard period={period} />
      </div>

      <div className="col-span-12 min-w-0 sm:col-span-6 lg:col-span-4">
        <CsatCard period={period} />
      </div>
      <div className="col-span-12 min-w-0 lg:col-span-8">
        <CoverageCard />
      </div>
    </div>
  );
}
