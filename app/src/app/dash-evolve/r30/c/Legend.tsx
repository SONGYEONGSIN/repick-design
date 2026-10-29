"use client";

import { STATUS_META, type HealthStatus } from "./data";

const ORDER: HealthStatus[] = ["healthy", "degraded", "critical"];

export default function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2" role="group" aria-label="Connection health legend">
      {ORDER.map((status) => {
        const meta = STATUS_META[status];
        const Icon = meta.icon;
        return (
          <div key={status} className="flex items-center gap-2">
            <svg width="22" height="8" viewBox="0 0 22 8" aria-hidden="true" className="shrink-0">
              <line
                x1="1"
                y1="4"
                x2="21"
                y2="4"
                strokeWidth={status === "critical" ? 2.5 : 2}
                strokeLinecap="round"
                strokeDasharray={meta.edgeDash}
                className={meta.edgeStroke}
              />
            </svg>
            <Icon aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 ${meta.text}`} />
            <span className="text-xs font-normal text-zinc-600">{meta.label}</span>
          </div>
        );
      })}
    </div>
  );
}
