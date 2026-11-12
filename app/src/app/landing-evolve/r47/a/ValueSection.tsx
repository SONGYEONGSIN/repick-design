"use client";

import { Check, Scan, ShieldCheck, Truck } from "lucide-react";
import { COLORS, EYEBROW, CAPTION } from "./tokens";
import {
  SPEEDS,
  FASTEST_SPEED,
  CHEAPEST_SPEED,
  deriveSpeed,
  type SpeedId,
} from "./data";

const PARTS = [
  {
    icon: Scan,
    title: "AI matching",
    body: "Every listing is scored against live buyer intent, not just keyword search, so the right match surfaces first.",
  },
  {
    icon: ShieldCheck,
    title: "Verified grading",
    body: "A human-trained model checks condition against 40+ reference points before the grade is ever shown to a buyer.",
  },
  {
    icon: Truck,
    title: "Live delivery",
    body: "The route below is not a static estimate — it recomputes from the same shipping speed you choose up top.",
  },
];

export default function ValueSection({ speedId }: { speedId: SpeedId }) {
  return (
    <section id="value" className="border-t" style={{ borderColor: COLORS.line, backgroundColor: COLORS.bgTint }}>
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <p className={EYEBROW} style={{ color: COLORS.accentStrong }}>
          Why it holds up
        </p>
        <h2
          className="mt-3 max-w-[22ch] text-[32px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[40px]"
          style={{ color: COLORS.fg, fontFamily: "var(--font-display-grotesk)" }}
        >
          Three systems, one visible route.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {PARTS.map((part) => {
            const Icon = part.icon;
            return (
              <div key={part.title} className="min-w-0">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: COLORS.bgTintStrong, color: COLORS.accentStrong }}
                >
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[17px] font-semibold" style={{ color: COLORS.fg }}>
                  {part.title}
                </h3>
                <p className="mt-2 text-[15px] font-normal leading-[1.6]" style={{ color: COLORS.mutedOnTint }}>
                  {part.body}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 min-w-0 overflow-hidden rounded-2xl border bg-white" style={{ borderColor: COLORS.line }}>
          <div className="px-4 pt-4 sm:px-5">
            <p className={CAPTION} style={{ color: COLORS.mutedOnTint }}>
              Live — follows the toggle above
            </p>
          </div>
          <div className="overflow-x-hidden px-2 pb-2 sm:px-3 sm:pb-3">
            <table className="w-full table-fixed border-collapse">
              <caption className="sr-only">
                Comparison of the three shipping speeds, current selection and ETA/cost per speed
              </caption>
              <colgroup>
                <col style={{ width: "34%" }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: "22%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" className={`${CAPTION} px-3 py-2 text-left`} style={{ color: COLORS.mutedOnTint }}>
                    Speed
                  </th>
                  <th scope="col" className={`${CAPTION} px-3 py-2 text-left`} style={{ color: COLORS.mutedOnTint }}>
                    ETA
                  </th>
                  <th scope="col" className={`${CAPTION} px-3 py-2 text-left`} style={{ color: COLORS.mutedOnTint }}>
                    Cost
                  </th>
                  <th scope="col" className={`${CAPTION} px-3 py-2 text-left`} style={{ color: COLORS.mutedOnTint }}>
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {SPEEDS.map((speed) => {
                  const row = deriveSpeed(speed);
                  const isCurrent = speed.id === speedId;
                  return (
                    <tr
                      key={speed.id}
                      style={{ backgroundColor: isCurrent ? COLORS.bgTint : "transparent" }}
                    >
                      <th
                        scope="row"
                        className="px-3 py-2.5 text-left text-[14px] font-semibold"
                        style={{ color: COLORS.fg }}
                      >
                        <span className="flex min-w-0 flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-1.5">
                          {speed.label}
                          {isCurrent && (
                            <span
                              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                              style={{ backgroundColor: COLORS.accent, color: "#FFFFFF" }}
                            >
                              <Check aria-hidden="true" className="h-3 w-3" />
                              Selected
                            </span>
                          )}
                        </span>
                      </th>
                      <td className="px-3 py-2.5 text-[14px] font-normal tabular-nums" style={{ color: COLORS.fg }}>
                        {row.totalLabel}
                      </td>
                      <td className="px-3 py-2.5 text-[14px] font-normal tabular-nums" style={{ color: COLORS.fg }}>
                        {row.costLabel}
                      </td>
                      <td className="px-3 py-2.5 text-[13px] font-normal" style={{ color: COLORS.mutedOnTint }}>
                        {speed.id === FASTEST_SPEED.id ? "Fastest" : speed.id === CHEAPEST_SPEED.id ? "Cheapest" : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
