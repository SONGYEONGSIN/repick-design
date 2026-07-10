"use client";

import { useId } from "react";
import styles from "./sheet.module.css";
import { DEPARTMENTS, type Lot, STATUS_META, estimateLabel, formatUSD } from "./data";

interface LotTableProps {
  lots: Lot[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function LotTable({ lots, selectedId, onSelect }: LotTableProps) {
  const headingId = useId();

  return (
    <section id="catalogue" aria-labelledby={headingId} className="scroll-mt-24 border border-[var(--rule)] bg-[var(--paper-card)]">
      <div className="border-b border-[var(--rule)] px-4 py-3 sm:px-5">
        <h2 id={headingId} className="text-sm font-semibold tracking-wide text-[var(--ink)]">
          카탈로그 — 로트 전체 목록
        </h2>
        <p className="mt-0.5 text-xs text-[var(--ink-muted)]">{lots.length}개 로트 · 로트를 선택하면 도켓과 보드에 동기화됩니다</p>
      </div>

      <div className={`overflow-x-auto ${styles.thinScroll}`}>
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <caption className="sr-only">Sale 214 카탈로그 로트 전체 목록, 추정가와 낙찰 결과 포함</caption>
          <thead>
            <tr className="border-b border-[var(--rule-strong)] text-left text-xs text-[var(--ink-muted)]">
              <th scope="col" className="px-4 py-2 font-medium sm:px-5">
                로트
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                부문
              </th>
              <th scope="col" className="px-3 py-2 text-right font-medium">
                추정가
              </th>
              <th scope="col" className="px-3 py-2 text-right font-medium">
                결과
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                상태
              </th>
            </tr>
          </thead>
          <tbody>
            {lots.map((l) => {
              const isSelected = l.id === selectedId;
              const dept = DEPARTMENTS.find((d) => d.code === l.department);
              return (
                <tr
                  key={l.id}
                  className={`border-b border-[var(--rule)] last:border-b-0 ${isSelected ? "bg-[var(--accent-red-soft)]" : ""}`}
                >
                  <th scope="row" className="px-4 py-2.5 text-left font-normal sm:px-5">
                    <button
                      type="button"
                      onClick={() => onSelect(l.id)}
                      aria-current={isSelected ? "true" : undefined}
                      className="block w-full min-w-0 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-red)]"
                    >
                      <span className="flex items-baseline gap-2">
                        <span className="font-mono text-xs tabular-nums text-[var(--ink-muted)]">
                          {String(l.lotNo).padStart(3, "0")}
                        </span>
                        <span className="truncate font-display text-sm italic text-[var(--ink)]">{l.title}</span>
                      </span>
                      <span className="block truncate pl-[2.1rem] text-xs text-[var(--ink-muted)]">{l.artist}</span>
                      {isSelected && <span className="sr-only"> (선택됨)</span>}
                    </button>
                  </th>
                  <td className="px-3 py-2.5 text-xs text-[var(--ink-muted)]">
                    <span title={dept?.full}>{dept?.label}</span>
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-xs tabular-nums text-[var(--ink)]">
                    {estimateLabel(l)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-xs tabular-nums text-[var(--ink)]">
                    {l.status === "hammered" && l.hammerPrice != null
                      ? formatUSD(l.hammerPrice)
                      : l.status === "live" && l.currentBid != null
                        ? formatUSD(l.currentBid)
                        : "—"}
                  </td>
                  <td className="px-3 py-2.5">
                    <StatusPill status={l.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: Lot["status"] }) {
  const meta = STATUS_META[status];
  const color =
    status === "hammered"
      ? "var(--accent-green)"
      : status === "live"
        ? "var(--accent-red)"
        : status === "passed"
          ? "var(--ink-muted)"
          : "var(--ink-muted)";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color }}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {meta.label}
    </span>
  );
}
