"use client";

import { useId } from "react";
import { CircleDot, CircleX, Gavel } from "lucide-react";
import styles from "./sheet.module.css";
import { type Lot, STATUS_META, formatUSD } from "./data";

interface LotRailProps {
  lots: Lot[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function LotRail({ lots, selectedId, onSelect }: LotRailProps) {
  const headingId = useId();

  return (
    <section
      id="lot-board"
      aria-labelledby={headingId}
      className="flex min-w-0 flex-col border border-[var(--rule)] bg-[var(--paper-card)] lg:h-full"
    >
      <div className="border-b border-[var(--rule)] px-4 py-3 sm:px-5">
        <h2 id={headingId} className="text-sm font-semibold tracking-wide text-[var(--ink)]">
          로트 보드
        </h2>
        <p className="mt-0.5 text-xs text-[var(--ink-muted)]">응찰권 스텁 — 로트를 선택해 상세를 확인</p>
      </div>

      <ul
        className={`flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-4 sm:px-5 lg:flex-1 lg:flex-col lg:snap-none lg:gap-0 lg:divide-y lg:divide-[var(--rule)] lg:overflow-x-visible lg:overflow-y-auto lg:px-0 lg:py-0 ${styles.thinScroll}`}
      >
        {lots.map((l) => {
          const isSelected = l.id === selectedId;
          const meta = STATUS_META[l.status];
          return (
            <li key={l.id} className="w-56 shrink-0 snap-start lg:w-auto lg:shrink">
              <button
                type="button"
                onClick={() => onSelect(l.id)}
                aria-current={isSelected ? "true" : undefined}
                className={`${styles.ticket} flex w-full flex-col gap-2 bg-[var(--paper-card)] px-4 py-3 pl-5 text-left transition-colors duration-150 hover:bg-black/[0.03] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent-red)] ${
                  isSelected ? "bg-[var(--accent-red-soft)]" : ""
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold tabular-nums text-[var(--ink-muted)]">
                    LOT {String(l.lotNo).padStart(3, "0")}
                  </span>
                  <StatusStamp status={l.status} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-base italic text-[var(--ink)]">{l.title}</span>
                  <span className="block truncate text-xs text-[var(--ink-muted)]">{l.artist}</span>
                </span>
                <span className="text-sm text-[var(--ink)]">
                  {l.status === "hammered" && l.hammerPrice != null ? (
                    <span className="font-mono tabular-nums">{formatUSD(l.hammerPrice)}</span>
                  ) : l.status === "live" && l.currentBid != null ? (
                    <>
                      <span className="font-mono tabular-nums">{formatUSD(l.currentBid)}</span> 응찰중
                    </>
                  ) : l.status === "passed" ? (
                    <span className="text-[var(--ink-muted)]">{meta.description}</span>
                  ) : (
                    <>
                      추정가 <span className="font-mono tabular-nums">{formatUSD(l.estimateLow)}</span>~
                    </>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function StatusStamp({ status }: { status: Lot["status"] }) {
  if (status === "hammered") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold tracking-wide text-[var(--accent-green)]">
        <Gavel aria-hidden="true" className="h-3 w-3" />
        SOLD
      </span>
    );
  }
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold tracking-wide text-[var(--accent-red)]">
        <span className={styles.liveDot}>
          <CircleDot aria-hidden="true" className="h-3 w-3" />
        </span>
        ON THE BLOCK
      </span>
    );
  }
  if (status === "passed") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold tracking-wide text-[var(--ink-muted)]">
        <CircleX aria-hidden="true" className="h-3 w-3" />
        PASSED
      </span>
    );
  }
  return <span className="text-xs font-medium tracking-wide text-[var(--ink-muted)]">예정</span>;
}
