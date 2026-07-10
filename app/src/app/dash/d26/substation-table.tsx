"use client";

import { LOAD_TIER_LABEL, SUBSTATIONS, loadTier, mwFormatter, pctFormatter, type Snapshot } from "./data";
import { StatusPill } from "./ui";
import styles from "./console.module.css";

interface SubstationTableProps {
  snapshot: Snapshot;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const TIER_BAR_COLOR: Record<string, string> = {
  normal: "bg-[var(--ink-1)]",
  elevated: "bg-[var(--caution)]",
  overload: "bg-[var(--alarm)]",
};

export default function SubstationTable({ snapshot, selectedId, onSelect }: SubstationTableProps) {
  return (
    <div className={`${styles.scrollX} overflow-x-auto`}>
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <caption className="sr-only">변전소별 부하 현황</caption>
        <thead>
          <tr className="border-b border-[var(--hair)] text-left">
            <th scope="col" className="py-2 pr-3 font-mono text-xs font-medium uppercase tracking-[0.08em] text-[var(--ink-2)]">
              변전소
            </th>
            <th scope="col" className="py-2 pr-3 font-mono text-xs font-medium uppercase tracking-[0.08em] text-[var(--ink-2)]">
              모선
            </th>
            <th scope="col" className="py-2 pr-3 text-right font-mono text-xs font-medium uppercase tracking-[0.08em] text-[var(--ink-2)]">
              부하(MW)
            </th>
            <th scope="col" className="py-2 pr-3 text-right font-mono text-xs font-medium uppercase tracking-[0.08em] text-[var(--ink-2)]">
              용량(MW)
            </th>
            <th scope="col" className="py-2 pr-3 font-mono text-xs font-medium uppercase tracking-[0.08em] text-[var(--ink-2)]">
              부하율
            </th>
            <th scope="col" className="py-2 font-mono text-xs font-medium uppercase tracking-[0.08em] text-[var(--ink-2)]">
              상태
            </th>
          </tr>
        </thead>
        <tbody>
          {SUBSTATIONS.map((sub) => {
            const state = snapshot.subs.find((s) => s.subId === sub.id);
            const loadMW = state?.loadMW ?? 0;
            const ratio = (loadMW / sub.capacityMW) * 100;
            const tier = loadTier(ratio);
            const isSelected = selectedId === sub.id;
            return (
              <tr
                key={sub.id}
                className={`border-b border-[var(--hair)] last:border-b-0 ${isSelected ? "bg-[var(--bg-2)]" : ""}`}
              >
                <th scope="row" className="py-2.5 pr-3 text-left font-normal">
                  <button
                    type="button"
                    onClick={() => onSelect(sub.id)}
                    aria-pressed={isSelected}
                    className="min-h-11 rounded-sm px-1 text-left font-semibold tracking-tight text-[var(--ink-0)] underline decoration-[var(--hair-strong)] decoration-1 underline-offset-4 hover:decoration-[var(--cyan)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
                  >
                    {sub.name}
                    <span className="ml-1.5 font-mono text-xs font-normal text-[var(--ink-2)]">{sub.tag}</span>
                  </button>
                </th>
                <td className="py-2.5 pr-3 font-mono tabular-nums text-[var(--ink-1)]">BUS-{sub.bus}</td>
                <td className="py-2.5 pr-3 text-right font-mono tabular-nums text-[var(--ink-0)]">{mwFormatter.format(loadMW)}</td>
                <td className="py-2.5 pr-3 text-right font-mono tabular-nums text-[var(--ink-2)]">{mwFormatter.format(sub.capacityMW)}</td>
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-2">
                    <div
                      role="img"
                      aria-label={`부하율 ${pctFormatter.format(ratio)}퍼센트`}
                      className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--bg-2)]"
                    >
                      <div className={`h-full ${TIER_BAR_COLOR[tier]}`} style={{ width: `${Math.min(100, ratio)}%` }} />
                    </div>
                    <span className="font-mono text-xs tabular-nums text-[var(--ink-1)]">{pctFormatter.format(ratio)}%</span>
                  </div>
                </td>
                <td className="py-2.5">
                  <StatusPill tone={tier}>{LOAD_TIER_LABEL[tier]}</StatusPill>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
