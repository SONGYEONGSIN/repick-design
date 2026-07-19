"use client";

import { TrendingDown } from "lucide-react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useRef } from "react";
import { formatCount, formatPct, round2, STAGE_COUNTS, STAGES, stagePct, transitionsForPeriod, type PeriodId, type StageId } from "./data";
import { FOCUS_RING_INSET, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";

/**
 * 화면을 지배하는 단계형 전환 퍼널 — 각 단계는 폭이 카운트를 인코딩하는 가로 밴드.
 * 밴드 사이 커넥터는 이탈 수·비율 + 최상위 이탈 사유를 즉시 가독 텍스트로 노출한다(호버 불필요).
 * 밴드를 선택하면 우측/하단 상세 패널과 세그먼트 테이블이 동기화된다.
 */
export default function FunnelCanvas({
  period,
  selectedIdx,
  onSelect,
}: {
  period: PeriodId;
  selectedIdx: number;
  onSelect: (idx: number) => void;
}) {
  const counts = STAGE_COUNTS[period];
  const transitions = transitionsForPeriod(period);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function move(delta: number) {
    const next = Math.min(STAGES.length - 1, Math.max(0, selectedIdx + delta));
    onSelect(next);
    refs.current[next]?.focus();
  }

  function onKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      move(-STAGES.length);
    } else if (e.key === "End") {
      e.preventDefault();
      move(STAGES.length);
    }
  }

  const widthFracs = counts.map((c) => Math.max(c / counts[0], 0.05));

  return (
    <div role="listbox" aria-label="Checkout funnel stages" aria-activedescendant={`stage-${STAGES[selectedIdx].id}`} className="flex flex-col">
      {STAGES.map((stage, i) => {
        const selected = i === selectedIdx;
        const topFrac = i === 0 ? 1 : widthFracs[i - 1];
        const botFrac = widthFracs[i];
        const topL = round2(100 - topFrac * 100);
        const topR = round2(100 + topFrac * 100);
        const botL = round2(100 - botFrac * 100);
        const botR = round2(100 + botFrac * 100);
        const points = `${topL},0 ${topR},0 ${botR},100 ${botL},100`;
        const opacity = round2(0.82 - i * 0.07);
        const Icon = stage.Icon;

        return (
          <div key={stage.id}>
            <button
              id={`stage-${stage.id}`}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="option"
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onSelect(i)}
              onKeyDown={onKeyDown}
              className={cx(
                "group w-full rounded-xl border p-3 text-left sm:p-3.5",
                TRANSITION,
                FOCUS_RING_INSET,
                selected
                  ? "border-violet-300 bg-violet-50/70 dark:border-violet-500/50 dark:bg-violet-500/10"
                  : "border-transparent hover:border-zinc-200 hover:bg-zinc-50 dark:hover:border-zinc-800 dark:hover:bg-white/[0.03]",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className={cx(
                      "grid h-7 w-7 shrink-0 place-items-center rounded-lg",
                      selected ? "bg-violet-600 text-white" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
                    )}
                  >
                    <Icon size={14} aria-hidden="true" />
                  </span>
                  <span className={cx("truncate text-sm font-semibold", TEXT_PRIMARY)}>{stage.label}</span>
                </span>
                <span className="flex shrink-0 items-baseline gap-2 tabular-nums">
                  <span className={cx("text-base font-semibold sm:text-lg", TEXT_PRIMARY)}>{formatCount(counts[i])}</span>
                  <span className={cx("text-xs", TEXT_CAPTION)}>{formatPct(stagePct(period, i))} of visits</span>
                </span>
              </div>

              <div className="mt-2 h-6 w-full sm:h-7" aria-hidden="true">
                <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
                  <polygon
                    points={points}
                    className={selected ? "fill-violet-600 stroke-violet-700 dark:stroke-violet-300" : "fill-violet-500 stroke-violet-600/40 dark:stroke-violet-400/30"}
                    style={{ fillOpacity: selected ? 0.95 : opacity }}
                    strokeWidth={selected ? 1.5 : 1}
                  />
                </svg>
              </div>
            </button>

            {i < STAGES.length - 1 ? <DropConnector t={transitions[i]} /> : null}
          </div>
        );
      })}
    </div>
  );
}

function DropConnector({ t }: { t: ReturnType<typeof transitionsForPeriod>[number] }) {
  const top = t.reasons[0];
  return (
    <div className="flex items-center gap-2 py-1.5 pl-3">
      <TrendingDown size={13} aria-hidden="true" className="shrink-0 text-rose-500 dark:text-rose-400" />
      <p className={cx("truncate text-xs", TEXT_SECONDARY)}>
        <span className="font-medium tabular-nums text-rose-700 dark:text-rose-300">
          {formatCount(t.dropCount)} dropped ({formatPct(t.dropPct)})
        </span>
        <span className={cx("mx-1.5", TEXT_CAPTION)}>·</span>
        <span className={TEXT_CAPTION}>
          Top reason: {top.label} ({top.pct}%)
        </span>
      </p>
    </div>
  );
}

export type { StageId };
