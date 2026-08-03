import { Activity } from "lucide-react";
import type { SwitchOption } from "./data";

interface Meter {
  label: string;
  valueText: string;
  pct: number;
}

function buildMeters(sw: SwitchOption): Meter[] {
  return [
    { label: "Actuation force", valueText: `${sw.actuationG} gf`, pct: Math.round((sw.actuationG / 70) * 100) },
    { label: "Sound level", valueText: `${sw.soundDb} dB`, pct: Math.round((sw.soundDb / 80) * 100) },
    { label: "Travel distance", valueText: `${sw.travelMm.toFixed(1)} mm`, pct: Math.round((sw.travelMm / 5) * 100) },
  ];
}

/** Telemetry panel — reads only the switch axis. No local state at all: every value here is a pure
 * function of the `sw` prop, so a change in the configuration panel is visible here on the very
 * next render with nothing to keep in sync. */
export default function FeelPanel({ sw }: { sw: SwitchOption }) {
  const meters = buildMeters(sw);
  return (
    <section
      id="feel"
      aria-labelledby="feel-heading"
      className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-sky-50">
          <Activity className="h-4.5 w-4.5 text-sky-700" aria-hidden="true" />
        </span>
        <h2 id="feel-heading" className="text-base font-semibold tracking-tight text-slate-900">
          Feel &amp; sound
        </h2>
      </div>
      <p className="mt-2 text-sm font-normal text-slate-600">{sw.soundDesc}</p>

      <ul role="list" className="mt-4 flex flex-col gap-3">
        {meters.map((m) => (
          <li key={m.label}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-normal text-slate-600">{m.label}</span>
              <span className="text-sm font-medium text-slate-900 tabular-nums">{m.valueText}</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-sky-700" style={{ width: `${m.pct}%` }} />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-col gap-1 border-t border-slate-200 pt-3 text-sm">
        <span className="font-normal text-slate-600">
          <span className="font-medium text-slate-900">{sw.lifecycle}</span> — {sw.bestFor}
        </span>
      </div>
    </section>
  );
}
