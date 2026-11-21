"use client";

import { Fingerprint, History, Image as ImageIcon, ScanLine, Tag } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  CHECKS,
  WAVE_BASELINE,
  WAVE_VIEWBOX,
  buildWavePath,
  computeComposite,
  type ActiveChecks,
  type CheckId,
} from "./waveform";
import { ACCENT, ACCENT_TINT, BORDER_SOFT, MUTED } from "./theme";

const ICONS: Record<CheckId, LucideIcon> = {
  condition: ScanLine,
  authenticity: Fingerprint,
  sellerHistory: History,
  priceBenchmark: Tag,
  photoMatch: ImageIcon,
};

interface PulseWaveformProps {
  active: ActiveChecks;
  onToggle: (id: CheckId) => void;
  variant?: "full" | "compact";
  idPrefix: string;
}

export default function PulseWaveform({
  active,
  onToggle,
  variant = "full",
  idPrefix,
}: PulseWaveformProps) {
  const composite = computeComposite(active);
  const d = buildWavePath(active);
  const activeCount = CHECKS.filter((c) => active[c.id]).length;
  const compact = variant === "compact";

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: MUTED }}
          >
            Composite verification confidence
          </p>
          <p
            className="mt-1 tabular-nums font-extrabold leading-none text-white"
            style={{
              fontFamily: "var(--font-display-mono)",
              fontSize: compact ? "2.25rem" : "3rem",
            }}
          >
            {composite}
            <span style={{ color: ACCENT_TINT }} className="text-xl">
              %
            </span>
          </p>
        </div>
        <p className="shrink-0 text-sm tabular-nums" style={{ color: MUTED }}>
          {activeCount}/{CHECKS.length} checks active
        </p>
      </div>

      <svg
        viewBox={WAVE_VIEWBOX}
        className="mt-4 w-full"
        role="img"
        aria-label={`Verification confidence waveform. ${activeCount} of ${CHECKS.length} checks active, reading ${composite} percent composite confidence.`}
      >
        <line
          x1="0"
          y1={WAVE_BASELINE}
          x2="800"
          y2={WAVE_BASELINE}
          stroke={BORDER_SOFT}
          strokeWidth="1"
        />
        <path
          d={d}
          fill="none"
          stroke={ACCENT}
          strokeWidth={compact ? 2 : 2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="mt-3 flex gap-1.5 sm:gap-2">
        {CHECKS.map((check) => {
          const Icon = ICONS[check.id];
          const isOn = active[check.id];
          const inputId = `${idPrefix}-${check.id}`;
          return (
            <button
              key={check.id}
              id={inputId}
              type="button"
              aria-pressed={isOn}
              onClick={() => onToggle(check.id)}
              style={{
                flexGrow: check.weight,
                flexBasis: 0,
                borderColor: isOn ? ACCENT : BORDER_SOFT,
                backgroundColor: isOn ? "rgba(47, 182, 255, 0.12)" : "rgba(255, 255, 255, 0.03)",
                outlineColor: ACCENT_TINT,
              }}
              className="flex min-w-0 flex-1 flex-col items-start gap-1 rounded-lg border px-2 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8FD9FF] sm:px-2.5"
            >
              <Icon aria-hidden="true" className="h-3.5 w-3.5" style={{ color: ACCENT_TINT }} />
              <span className="truncate text-[11px] font-semibold leading-tight text-white sm:text-xs">
                {check.shortLabel}
              </span>
              <span className="text-[10px] tabular-nums" style={{ color: MUTED }}>
                {isOn ? check.onScore : check.offScore}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
