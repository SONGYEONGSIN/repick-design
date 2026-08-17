"use client";

import { Radio } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Experiment } from "./data";
import { currentCi, currentLift, formatDate, formatLift, NOW_MS, numberFmt, round1, significanceState, startedMs, totalSample, TRAFFIC_TICKS } from "./data";
import { STATUS_LABEL, STATUS_TONE, TEXT_CAPTION, TEXT_PRIMARY, TONE, cx, NUM } from "./tokens";
import { Badge, CardHeader, EyebrowLabel, SignificanceBadge, ToneDot } from "./ui";

const DAY_MS = 86_400_000;
const TICK_MS = 2400;

/** Live mini-chart: a deterministic 12-value sequence advanced on a fixed interval — never
 *  Math.random/Date.now. Paused entirely when the user prefers reduced motion. */
function useLiveTraffic() {
  const [tick, setTick] = useState(0);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion.current) return;
    const id = window.setInterval(() => setTick((t) => (t + 1) % TRAFFIC_TICKS.length), TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  return tick;
}

export default function SignificancePanel({ experiment }: { experiment: Experiment }) {
  const tick = useLiveTraffic();
  const lift = currentLift(experiment);
  const ci = currentCi(experiment);
  const sig = significanceState(ci.ciLow, ci.ciHigh);
  const total = totalSample(experiment);
  const controlPct = round1((experiment.controlSample / total) * 100);
  const variantPct = round1(100 - controlPct);
  const daysRunning = Math.round((NOW_MS - startedMs(experiment)) / DAY_MS) + 1;

  const windowSize = 6;
  const trafficWindow = Array.from({ length: windowSize }, (_, i) => TRAFFIC_TICKS[(tick - windowSize + 1 + i + TRAFFIC_TICKS.length * 2) % TRAFFIC_TICKS.length]);
  const trafficMax = Math.max(...TRAFFIC_TICKS);
  const currentTraffic = TRAFFIC_TICKS[tick];

  return (
    <div className="flex h-full flex-col">
      <CardHeader
        title="Statistical significance"
        description="Selected experiment"
        action={<Badge tone={TONE[STATUS_TONE[experiment.status]]}>{STATUS_LABEL[experiment.status]}</Badge>}
      />

      <p className={cx("mt-3 text-sm font-medium", TEXT_PRIMARY)}>{experiment.name}</p>
      <p className={cx("mt-1 text-xs leading-relaxed", TEXT_CAPTION)}>{experiment.hypothesis}</p>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className={cx("text-xl font-semibold", NUM, sig === "significant-negative" ? "text-rose-400" : TEXT_PRIMARY)}>{formatLift(lift)}</span>
        <span className={cx("text-xs", NUM, TEXT_CAPTION)}>
          95% CI {formatLift(ci.ciLow)} to {formatLift(ci.ciHigh)}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>Owner</dt>
          <dd className={cx("mt-0.5", TEXT_PRIMARY)}>{experiment.owner}</dd>
        </div>
        <div>
          <dt className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>Started</dt>
          <dd className={cx("mt-0.5", NUM, TEXT_PRIMARY)}>{formatDate(startedMs(experiment))}</dd>
        </div>
        <div>
          <dt className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>Days running</dt>
          <dd className={cx("mt-0.5", NUM, TEXT_PRIMARY)}>{daysRunning}</dd>
        </div>
        <div>
          <dt className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>Outcome</dt>
          <dd className="mt-0.5">
            <SignificanceBadge state={sig} />
          </dd>
        </div>
      </dl>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <EyebrowLabel>Sample split</EyebrowLabel>
          <span className={cx("text-xs", NUM, TEXT_CAPTION)}>{numberFmt.format(total)} participants</span>
        </div>
        <div className="mt-1.5 flex h-2 overflow-hidden rounded-full bg-zinc-800" role="img" aria-label={`${controlPct}% control, ${variantPct}% variant`}>
          <span className="h-full bg-zinc-400" style={{ width: `${controlPct}%` }} />
          <span className="h-full bg-cyan-400" style={{ width: `${variantPct}%` }} />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-xs">
          <span className={cx("flex items-center gap-1.5", TEXT_CAPTION)}>
            <ToneDot tone="neutral" /> Control · <span className={NUM}>{numberFmt.format(experiment.controlSample)}</span>
          </span>
          <span className={cx("flex items-center gap-1.5", TEXT_CAPTION)}>
            <span aria-hidden="true" className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" /> Variant ·{" "}
            <span className={NUM}>{numberFmt.format(experiment.variantSample)}</span>
          </span>
        </div>
      </div>

      <div className="mt-5 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between">
          <EyebrowLabel>Live traffic</EyebrowLabel>
          <span className="flex items-center gap-1 text-[11px] font-medium text-cyan-400">
            <Radio size={11} aria-hidden="true" className="motion-safe:animate-pulse motion-reduce:animate-none" />
            Live
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className={cx("text-xl font-semibold", NUM, TEXT_PRIMARY)}>{currentTraffic}</span>
          <span className={cx("text-xs", TEXT_CAPTION)}>sessions / min on variant</span>
        </div>
        <div className="mt-2 flex h-8 items-end gap-1" aria-hidden="true">
          {trafficWindow.map((v, i) => (
            <span key={i} className="flex-1 rounded-sm bg-cyan-400/60 last:bg-cyan-400" style={{ height: `${Math.max(12, round1((v / trafficMax) * 100))}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
