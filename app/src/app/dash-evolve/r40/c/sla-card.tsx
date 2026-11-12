import { ShieldCheck } from "lucide-react";
import { SLA_COMPLIANCE } from "./data";

export default function SlaCard() {
  const { current, target } = SLA_COMPLIANCE;
  const onTrack = current >= target;

  return (
    <div className="flex h-full flex-col rounded-xl border border-white/10 bg-zinc-900 p-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
        <p className="font-medium text-xs text-zinc-400 uppercase tracking-wide">SLA compliance</p>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="font-semibold text-lg text-zinc-50 tabular-nums">{current}%</p>
        <p className="font-normal text-xs text-zinc-400 tabular-nums">of {target}% target</p>
      </div>
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="SLA compliance toward target"
        className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-white/10"
      >
        <div
          className={`h-2 rounded-full ${onTrack ? "bg-cyan-400" : "bg-red-400"}`}
          style={{ width: `${current}%` }}
        />
      </div>
      <p className="mt-1 font-normal text-xs text-zinc-400">
        {onTrack ? "On track for this review period." : `${target - current}pt below target.`}
      </p>
    </div>
  );
}
