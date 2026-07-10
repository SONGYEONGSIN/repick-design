"use client";

import { useId, useMemo } from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import styles from "./sheet.module.css";
import {
  type Lot,
  STATUS_META,
  deltaVsMid,
  estimateLabel,
  formatCompactUSD,
  formatDelta,
  formatUSD,
  getScaleMax,
} from "./data";

interface EstimateSpreadProps {
  lots: Lot[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const ROW_GRID = "grid grid-cols-[3.25rem_13rem_1fr_7rem] gap-x-3 items-center";

export function EstimateSpread({ lots, selectedId, onSelect }: EstimateSpreadProps) {
  const headingId = useId();
  const scaleMax = useMemo(() => getScaleMax(lots), [lots]);
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <section
      id="estimate-spread"
      aria-labelledby={headingId}
      className="scroll-mt-24 border border-[var(--rule)] bg-[var(--paper-card)]"
    >
      <div className="flex items-baseline justify-between gap-4 border-b border-[var(--rule)] px-4 py-3 sm:px-5">
        <div>
          <h2 id={headingId} className="text-sm font-semibold tracking-wide text-[var(--ink)]">
            추정가 스프레드 — 로트별 낙찰 분포
          </h2>
          <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
            카탈로그 순, 추정가 밴드 대비 낙찰가 · 진행중 로트는 현재 응찰가로 표시
          </p>
        </div>
        <ul className="hidden shrink-0 flex-col gap-1 text-xs text-[var(--ink-muted)] sm:flex" aria-hidden="true">
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-px w-4 bg-[var(--rule-strong)]" />
            추정가 밴드
          </li>
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rotate-45 bg-[var(--accent-red)]" />
            상단 추정가 초과 낙찰
          </li>
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rotate-45 bg-[var(--accent-green)]" />
            추정가 이내 낙찰
          </li>
        </ul>
      </div>

      <div className={`overflow-x-auto ${styles.thinScroll}`}>
        <div className="min-w-[640px]">
          <div className={`${ROW_GRID} border-b border-[var(--rule-strong)] px-4 py-1.5 sm:px-5`}>
            <span />
            <span />
            <div className="relative h-4" aria-hidden="true">
              {ticks.map((t) => (
                <span
                  key={t}
                  className="absolute top-0 -translate-x-1/2 font-mono text-xs tabular-nums text-[var(--ink-muted)]"
                  style={{ left: `${t * 100}%` }}
                >
                  {formatCompactUSD(scaleMax * t)}
                </span>
              ))}
            </div>
            <span className="text-right text-xs text-[var(--ink-muted)]">낙찰 / 추정대비</span>
          </div>

          <ul className="max-h-[560px] overflow-y-auto">
            {lots.map((l) => {
              const lowPct = (l.estimateLow / scaleMax) * 100;
              const highPct = (l.estimateHigh / scaleMax) * 100;
              const isSelected = l.id === selectedId;
              const delta = deltaVsMid(l);
              const isAboveHigh = l.hammerPrice != null && l.hammerPrice > l.estimateHigh;
              const markerColor =
                l.status === "hammered" ? (isAboveHigh ? "var(--accent-red)" : "var(--accent-green)") : undefined;
              const markerPct =
                l.status === "hammered" && l.hammerPrice != null
                  ? (l.hammerPrice / scaleMax) * 100
                  : l.status === "live" && l.currentBid != null
                    ? (l.currentBid / scaleMax) * 100
                    : null;

              return (
                <li key={l.id} className="border-b border-[var(--rule)] last:border-b-0">
                  <button
                    type="button"
                    onClick={() => onSelect(l.id)}
                    aria-current={isSelected ? "true" : undefined}
                    aria-label={`로트 ${String(l.lotNo).padStart(3, "0")}. ${l.artist}, ${l.title}. 추정가 ${estimateLabel(l)}. ${
                      l.status === "hammered"
                        ? `낙찰가 ${formatUSD(l.hammerPrice ?? 0)}.`
                        : l.status === "live"
                          ? `현재 응찰가 ${formatUSD(l.currentBid ?? 0)}, 진행중.`
                          : l.status === "passed"
                            ? "유찰."
                            : "상정 예정."
                    }`}
                    className={`${ROW_GRID} w-full px-4 py-2.5 text-left transition-colors duration-150 hover:bg-black/[0.03] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent-red)] sm:px-5 ${
                      isSelected ? "bg-[var(--accent-red-soft)]" : ""
                    }`}
                  >
                    <span className="font-mono text-xs tabular-nums text-[var(--ink-muted)]">
                      {String(l.lotNo).padStart(3, "0")}
                    </span>

                    <span className="min-w-0">
                      <span className="block truncate font-display text-sm italic text-[var(--ink)]">
                        {l.title}
                      </span>
                      <span className="block truncate text-xs text-[var(--ink-muted)]">
                        {l.artist} · {l.year}
                      </span>
                    </span>

                    <span className="relative h-5" aria-hidden="true">
                      <span
                        className="absolute top-1/2 h-px -translate-y-1/2 bg-[var(--rule-strong)]"
                        style={{ left: `${lowPct}%`, width: `${Math.max(highPct - lowPct, 0.5)}%` }}
                      />
                      <span
                        className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-[var(--rule-strong)]"
                        style={{ left: `${lowPct}%` }}
                      />
                      <span
                        className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-[var(--rule-strong)]"
                        style={{ left: `${highPct}%` }}
                      />
                      {markerPct != null && (
                        <span
                          className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 ${
                            l.status === "live" ? styles.liveDot : ""
                          }`}
                          style={{ left: `${markerPct}%`, backgroundColor: markerColor ?? "var(--accent-red)" }}
                        />
                      )}
                    </span>

                    <span className="flex flex-col items-end gap-0.5 text-right">
                      {l.status === "hammered" && l.hammerPrice != null && delta != null ? (
                        <>
                          <span className="font-mono text-sm font-medium tabular-nums text-[var(--ink)]">
                            {formatUSD(l.hammerPrice)}
                          </span>
                          <DeltaBadge ratio={delta} />
                        </>
                      ) : l.status === "live" && l.currentBid != null ? (
                        <>
                          <span className="font-mono text-sm font-medium tabular-nums text-[var(--accent-red)]">
                            {formatUSD(l.currentBid)}
                          </span>
                          <span className="text-xs font-medium text-[var(--accent-red)]">
                            {STATUS_META.live.label}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-[var(--ink-muted)]">{STATUS_META[l.status].label}</span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function DeltaBadge({ ratio }: { ratio: number }) {
  const { text, direction } = formatDelta(ratio);
  const color = direction === "up" ? "var(--accent-green)" : direction === "down" ? "var(--ink-muted)" : "var(--ink-muted)";
  const Icon = direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : Minus;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color }}>
      <Icon aria-hidden="true" className="h-3 w-3" />
      {text}
    </span>
  );
}
