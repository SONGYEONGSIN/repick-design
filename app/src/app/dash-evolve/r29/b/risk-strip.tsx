"use client";

import { orgRiskMetrics, actorRiskMetrics, getNode, type SecurityEvent } from "./data";
import { Card, SectionLabel, BulletGauge } from "./ui";

function fmtMetric(v: number, key: string): string {
  return key === "anomaly-rate" ? v.toFixed(1) : String(Math.round(v));
}

export function RiskStripCard({
  pinnedEvent, headingId,
}: { pinnedEvent: SecurityEvent | null; headingId: string }) {
  const actor = pinnedEvent ? getNode(pinnedEvent.actorId) : null;
  const metrics = pinnedEvent ? actorRiskMetrics(pinnedEvent.actorId) : orgRiskMetrics();

  return (
    <Card>
      <SectionLabel as="h2">
        <span id={headingId}>Risk Posture</span>
      </SectionLabel>
      <p className="mt-1 text-xs font-normal text-zinc-500">
        {actor ? (
          <>Scoped to <span className="font-medium text-zinc-700">{actor.name}</span> — pin another event to change this.</>
        ) : (
          "Org-wide, last 30 days. Pin a feed event to scope these to one actor."
        )}
      </p>

      <div className="mt-4 space-y-4">
        {metrics.map((m) => (
          <BulletGauge
            key={m.key}
            label={m.label}
            current={m.current}
            target={m.target}
            unit={m.unit}
            goodDirection={m.goodDirection}
            formattedCurrent={fmtMetric(m.current, m.key)}
            formattedTarget={fmtMetric(m.target, m.key)}
          />
        ))}
      </div>
    </Card>
  );
}
