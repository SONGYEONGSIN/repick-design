"use client";

/**
 * Backhaul — the stage ledger. A funnel is an A11y grade C/D chart type, so this real semantic
 * table is not a hidden fallback tucked behind `sr-only`: it is a designed, always-visible part of
 * the page, printing the same entered / converted / drop-off / drop-rate figures the band encodes.
 * Selecting a row is a second, fully keyboard-reachable path to the same selection the funnel
 * drives, so the visualisation is never the only way to steer the inspector.
 *
 * At `<lg` the three widest columns drop out rather than being compressed under their own text —
 * the remaining three keep ~46/27/27% of the row and stay legible at 390px.
 */

import type { PeriodId, Stage, StageId } from "./data";
import { buildTrend, fmtInt, fmtPct } from "./data";
import { BORDER, DIVIDE, EYEBROW, FOCUS_INSET, HOVER_ROW, NUM, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";
import { Sparkline } from "./ui";

export default function StageLedger({
  stages,
  selectedId,
  onSelect,
  periodId,
  periodLabel,
}: {
  stages: Stage[];
  selectedId: StageId;
  onSelect: (id: StageId) => void;
  periodId: PeriodId;
  periodLabel: string;
}) {
  return (
    <div className="mt-4 overflow-hidden">
      <table className="w-full table-fixed border-collapse text-left">
        <caption className={cx("relative pb-3 text-left text-xs font-normal", TEXT_CAPTION)}>
          Every stage&apos;s entered figure is the previous stage&apos;s converted figure, so the column reconciles down the whole pipeline,{" "}
          {periodLabel.toLowerCase()}. Select a row to drive the inspector below.
        </caption>
        <thead>
          <tr className={cx("border-y", BORDER)}>
            <th scope="col" className={cx("w-[46%] py-2.5 pl-1 pr-2 lg:w-[30%] 2xl:w-[26%]", EYEBROW, TEXT_CAPTION)}>
              Stage
            </th>
            <th scope="col" className={cx("w-[27%] whitespace-nowrap px-2 py-2.5 text-right lg:w-[17%] 2xl:w-[13%]", EYEBROW, TEXT_CAPTION)}>
              Entered
            </th>
            <th scope="col" className={cx("hidden whitespace-nowrap px-2 py-2.5 text-right lg:table-cell lg:w-[18%] 2xl:w-[14%]", EYEBROW, TEXT_CAPTION)}>
              Converted
            </th>
            <th scope="col" className={cx("hidden whitespace-nowrap px-2 py-2.5 text-right lg:table-cell lg:w-[17%] 2xl:w-[13%]", EYEBROW, TEXT_CAPTION)}>
              Dropped
            </th>
            <th scope="col" className={cx("w-[27%] whitespace-nowrap px-2 py-2.5 text-right lg:w-[18%] 2xl:w-[15%]", EYEBROW, TEXT_CAPTION)}>
              Drop rate
            </th>
            <th scope="col" className={cx("hidden whitespace-nowrap py-2.5 pl-2 pr-1 text-right 2xl:table-cell 2xl:w-[19%]", EYEBROW, TEXT_CAPTION)}>
              Pass rate
            </th>
          </tr>
        </thead>
        <tbody className={cx("divide-y", DIVIDE)}>
          {stages.map((s, i) => {
            const active = s.id === selectedId;
            const series = buildTrend(periodId, s.id).map((p) => p.stagePct);
            return (
              <tr key={s.id} className={cx(TRANSITION, active ? "bg-indigo-400/[0.07]" : HOVER_ROW)}>
                <th scope="row" className="py-1 pl-1 pr-2 align-middle">
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => onSelect(s.id)}
                    className={cx("flex min-h-11 w-full items-center gap-2 rounded-lg px-1 text-left", TRANSITION, FOCUS_INSET)}
                  >
                    <span
                      aria-hidden="true"
                      className={cx(
                        "grid h-6 w-6 shrink-0 place-items-center rounded-md border text-[11px] font-semibold",
                        active ? "border-indigo-400/50 bg-indigo-400/15 text-indigo-200" : cx(BORDER, TEXT_CAPTION),
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className={cx("min-w-0 flex-1 text-sm font-semibold leading-snug", active ? "text-indigo-200" : TEXT_PRIMARY)}>{s.name}</span>
                  </button>
                </th>
                <td className={cx("px-2 py-1 text-right text-sm font-normal whitespace-nowrap", NUM, TEXT_SECONDARY)}>{fmtInt(s.entered)}</td>
                <td className={cx("hidden px-2 py-1 text-right text-sm font-normal whitespace-nowrap lg:table-cell", NUM, TEXT_SECONDARY)}>{fmtInt(s.converted)}</td>
                <td className={cx("hidden px-2 py-1 text-right text-sm font-normal whitespace-nowrap lg:table-cell", NUM, s.dropped === 0 ? TEXT_CAPTION : TEXT_SECONDARY)}>
                  {s.dropped === 0 ? "—" : `−${fmtInt(s.dropped)}`}
                </td>
                <td className={cx("px-2 py-1 text-right text-sm font-semibold whitespace-nowrap", NUM, s.dropped === 0 ? TEXT_CAPTION : TEXT_PRIMARY)}>
                  {s.dropped === 0 ? "—" : fmtPct(s.dropRatePct)}
                </td>
                {/* Pass rate is 100 − drop rate, so it is the column that yields below 2xl rather
                    than letting any of the four independent figures compress out of legibility. */}
                <td className="hidden py-1 pl-2 pr-1 2xl:table-cell">
                  <span className="flex items-center justify-end gap-2">
                    <Sparkline values={series} />
                    <span className={cx("shrink-0 text-right text-sm font-normal whitespace-nowrap", NUM, TEXT_SECONDARY)}>{fmtPct(s.passRatePct)}</span>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
