import type { WeatherRow } from "../data";
import { StatusChip } from "./StatusChip";
import styles from "../console.module.css";

// Short, consistent 4-char status labels so the column never forces the
// table past the card's inner width on desktop (≥1024px) — the full words
// ("Within" / "Violation") are still available to assistive tech via the
// row's Parameter + Status header context.
const STATUS_LABEL: Record<WeatherRow["status"], string> = {
  within: "PASS",
  violation: "VIOL",
};

// Column widths only take effect at lg+ (table-fixed there guarantees the
// table never exceeds the card's inner width, so no horizontal scroll is
// ever needed on desktop). Below lg the table keeps its original
// content-driven auto layout + local scroll, unchanged.
const COLUMNS: { label: string; width: string }[] = [
  { label: "Parameter", width: "lg:w-[25%]" },
  { label: "Limit", width: "lg:w-[17%]" },
  { label: "Current", width: "lg:w-[16%]" },
  { label: "Margin", width: "lg:w-[14%]" },
  { label: "Status", width: "lg:w-[28%]" },
];

export function WeatherPanel({ rows }: { rows: WeatherRow[] }) {
  return (
    <section aria-labelledby="weather-heading" id="weather" className="min-w-0 scroll-mt-20 lg:col-span-5">
      <h2 id="weather-heading" className="mb-3 text-sm font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--hf-text)" }}>
        06 — Weather Constraints
      </h2>
      <div className={`${styles.panel} p-4 sm:p-6`}>
        <div className={`${styles.scrollX} ${styles.scrollFade}`}>
          <table className="w-full min-w-[480px] border-collapse text-left text-sm lg:min-w-0 lg:table-fixed">
            <caption className="sr-only">Current weather launch constraints and margins</caption>
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--hf-border)" }}>
                {COLUMNS.map(({ label, width }) => (
                  <th
                    key={label}
                    scope="col"
                    className={`px-1.5 py-2 text-[11px] font-semibold uppercase tracking-[0.06em] lg:px-2 ${width}`}
                    style={{ color: "var(--hf-text-3)" }}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.parameter} className="border-b align-top" style={{ borderColor: "var(--hf-border)" }}>
                  <th scope="row" className="px-1.5 py-2.5 text-left font-medium lg:px-2" style={{ color: "var(--hf-text)" }}>
                    {r.parameter}
                  </th>
                  <td className="px-1.5 py-2.5 font-mono tabular-nums lg:px-2" style={{ color: "var(--hf-text-2)" }}>
                    {r.limit}
                  </td>
                  <td className="px-1.5 py-2.5 font-mono tabular-nums lg:px-2" style={{ color: "var(--hf-text)" }}>
                    {r.current}
                  </td>
                  <td
                    className="px-1.5 py-2.5 font-mono tabular-nums lg:px-2"
                    style={{ color: r.status === "violation" ? "var(--hf-nogo)" : "var(--hf-go)" }}
                  >
                    {r.margin}
                  </td>
                  <td className="px-1.5 py-2.5 lg:px-2">
                    <StatusChip
                      tone={r.status === "violation" ? "nogo" : "go"}
                      label={STATUS_LABEL[r.status]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
