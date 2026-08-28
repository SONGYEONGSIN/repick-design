"use client";

import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { SLOS, formatPct, sloStatus } from "./data";
import { FOCUS, NUM, SLO_BADGE, SLO_FILL, SLO_LABEL, TEXT_AUX, TEXT_PRIMARY, cx } from "./tokens";

const STATUS_ICON = { good: CheckCircle2, warn: AlertTriangle, bad: XCircle } as const;

export type Period = "burn7d" | "burn30d";

export default function SloBulletGrid({ period, highlightedId }: { period: Period; highlightedId: string | null }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div>
      <ul className="space-y-2" aria-label="Error budget burn per service">
        {SLOS.map((s) => {
          const burn = s[period];
          const status = sloStatus(burn);
          const Icon = STATUS_ICON[status];
          const isActive = active === s.id;
          const isHighlighted = highlightedId === s.id;
          return (
            <li key={s.id}>
              <button
                type="button"
                onMouseEnter={() => setActive(s.id)}
                onFocus={() => setActive(s.id)}
                onMouseLeave={() => setActive((cur) => (cur === s.id ? null : cur))}
                onBlur={() => setActive((cur) => (cur === s.id ? null : cur))}
                className={cx(
                  "w-full rounded-lg border px-2.5 py-2 text-left",
                  FOCUS,
                  isHighlighted ? "border-emerald-500" : "border-transparent",
                  (isActive || isHighlighted) && "bg-white/[0.04]",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={cx("truncate font-mono text-[12.5px] font-medium", TEXT_PRIMARY)}>{s.name}</span>
                  <span className={cx("inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium", SLO_BADGE[status])}>
                    <Icon size={10} aria-hidden="true" />
                    {SLO_LABEL[status]}
                    <span className={NUM}>{formatPct(burn, 0)}</span>
                  </span>
                </div>
                <div className="relative mt-1.5 h-3 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${Math.min(100, burn)}%`, backgroundColor: SLO_FILL[status] }} />
                  <span aria-hidden="true" className="absolute inset-y-0 w-px bg-white/40" style={{ left: "80%" }} />
                </div>
                <p className={cx("mt-1 text-[10.5px] font-normal", NUM, TEXT_AUX)}>{`${formatPct(burn, 0)} of budget burned · target ${s.target}% · danger line at 80%`}</p>
              </button>
            </li>
          );
        })}
      </ul>

      <div aria-live="polite" className={cx("mt-2.5 min-h-[1.5rem] rounded-lg border border-white/10 px-3 py-1.5 text-[12px] font-normal", TEXT_AUX)}>
        {active ? (
          (() => {
            const s = SLOS.find((row) => row.id === active)!;
            const burn = s[period];
            const remaining = Math.max(0, 100 - burn);
            return <span className={NUM}>{`${s.name} · ${formatPct(remaining, 1)} of error budget remaining · target ${s.target}%`}</span>;
          })()
        ) : (
          "Hover or focus a service for its exact budget remaining."
        )}
      </div>
    </div>
  );
}
