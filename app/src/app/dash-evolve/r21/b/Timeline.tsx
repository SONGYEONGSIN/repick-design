import { Check } from "lucide-react";
import type { RiskCase } from "./data";
import { formatDate } from "./data";
import { TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, cx } from "./tokens";

export default function Timeline({ riskCase }: { riskCase: RiskCase }) {
  return (
    <ol className="flex flex-col gap-0">
      {riskCase.milestones.map((m, i) => {
        const last = i === riskCase.milestones.length - 1;
        return (
          <li key={m.label} className="flex gap-3">
            <span className="flex flex-col items-center">
              <span
                aria-hidden="true"
                className={cx(
                  "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2",
                  m.done ? "border-rose-700 bg-rose-700 text-white" : "border-zinc-300 bg-white",
                )}
              >
                {m.done ? <Check size={11} aria-hidden="true" /> : null}
              </span>
              {!last ? <span aria-hidden="true" className={cx("w-px flex-1", m.done ? "bg-rose-200" : "bg-zinc-200")} style={{ minHeight: "1.5rem" }} /> : null}
            </span>
            <span className="min-w-0 flex-1 pb-4">
              <span className={cx("block text-[13px] font-medium", m.done ? TEXT_PRIMARY : TEXT_MUTED)}>{m.label}</span>
              <span className={cx("block text-[11px] font-normal", TEXT_AUX)}>{m.done ? formatDate(m.date) : `Due ${formatDate(m.date)}`}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
