"use client";

import { ArrowUpRight, Server } from "lucide-react";
import type { EnvHealthStatus, EnvironmentId } from "../data";
import { ENVIRONMENTS, formatRelative } from "../data";
import { BORDER, FOCUS_RING_INSET, NUM, TEXT_CAPTION, TEXT_PRIMARY, TONE, TRANSITION, cx, type Tone } from "../tokens";
import { Card, CardHeader, Sparkline, StatusDot } from "../ui";

/** Environment health status -> tone. Exported so the command palette can reuse the same mapping. */
export const ENV_STATUS_TONE: Record<EnvHealthStatus, Tone> = { healthy: "good", degraded: "warn", down: "bad" };

export default function EnvironmentPanel({
  activeEnvironmentId,
  filterEnvironmentId,
  onToggleFilter,
}: {
  /** The environment of the currently-selected feed item — highlighted as "synced from the feed". */
  activeEnvironmentId: EnvironmentId | null;
  filterEnvironmentId: EnvironmentId | "all";
  onToggleFilter: (id: EnvironmentId) => void;
}) {
  return (
    <Card padded={false} className="flex min-h-0 flex-col">
      <div className="p-4 pb-3 sm:p-5 sm:pb-3">
        <CardHeader title="Environment health" description="Click a row to filter the feed by environment." />
      </div>
      <ul className="flex min-h-0 flex-col gap-2 overflow-y-auto px-4 pb-4 sm:px-5 sm:pb-5 [scrollbar-width:thin]" aria-label="Environments">
        {ENVIRONMENTS.map((env) => {
          const tone = TONE[ENV_STATUS_TONE[env.status]];
          const isActiveFromFeed = activeEnvironmentId === env.id;
          const isFilterOn = filterEnvironmentId === env.id;
          return (
            <li key={env.id}>
              <button
                type="button"
                onClick={() => onToggleFilter(env.id)}
                aria-pressed={isFilterOn}
                className={cx(
                  "relative w-full rounded-xl border p-3 text-left",
                  BORDER,
                  "bg-zinc-950",
                  TRANSITION,
                  FOCUS_RING_INSET,
                  "hover:border-white/20",
                  isActiveFromFeed && "ring-2 ring-cyan-400 ring-offset-2 ring-offset-zinc-950",
                  isFilterOn && !isActiveFromFeed && "border-white/25",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <StatusDot tone={ENV_STATUS_TONE[env.status]} label={env.name} />
                  <span className={cx("shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-medium leading-none whitespace-nowrap", tone.text, tone.bg, tone.border)}>
                    {env.statusLabel}
                  </span>
                </div>

                <div className="mt-2 flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <p className={cx("truncate text-xs", TEXT_CAPTION)}>{env.region}</p>
                    <p className={cx("mt-1 truncate text-[11px]", NUM, TEXT_CAPTION)}>
                      {env.version} &middot; <Server size={10} aria-hidden="true" className="mb-px inline" /> {env.servicesCount}
                    </p>
                  </div>
                  <Sparkline
                    values={env.health}
                    width={64}
                    height={24}
                    className="shrink-0"
                    strokeClassName={env.status === "degraded" ? "stroke-amber-400" : "stroke-emerald-400"}
                    dotClassName={env.status === "degraded" ? "fill-amber-400" : "fill-emerald-400"}
                  />
                </div>

                <p className={cx("mt-2 text-[11px]", TEXT_CAPTION)}>
                  Last deploy <span className={cx(NUM, TEXT_PRIMARY)}>{formatRelative(env.lastDeployMs)}</span>
                </p>

                {isActiveFromFeed ? (
                  <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-cyan-300">
                    <ArrowUpRight size={11} aria-hidden="true" />
                    Selected activity targets this environment
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
