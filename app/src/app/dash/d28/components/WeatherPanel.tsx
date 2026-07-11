import type { WeatherRow } from "../data";
import { StatusChip } from "./StatusChip";
import styles from "../console.module.css";

export function WeatherPanel({ rows }: { rows: WeatherRow[] }) {
  return (
    <section aria-labelledby="weather-heading" id="weather" className="min-w-0 scroll-mt-20 lg:col-span-5">
      <h2 id="weather-heading" className="mb-3 text-sm font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--hf-text)" }}>
        06 — Weather Constraints
      </h2>
      <div className={`${styles.panel} p-4 sm:p-6`}>
        <div className={`${styles.scrollX} ${styles.scrollFade}`}>
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
            <caption className="sr-only">Current weather launch constraints and margins</caption>
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--hf-border)" }}>
                {["Parameter", "Limit", "Current", "Margin", "Status"].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="px-2 py-2 text-[11px] font-semibold uppercase tracking-[0.06em]"
                    style={{ color: "var(--hf-text-3)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.parameter} className="border-b" style={{ borderColor: "var(--hf-border)" }}>
                  <th scope="row" className="px-2 py-2.5 text-left font-medium" style={{ color: "var(--hf-text)" }}>
                    {r.parameter}
                  </th>
                  <td className="px-2 py-2.5 font-mono tabular-nums" style={{ color: "var(--hf-text-2)" }}>
                    {r.limit}
                  </td>
                  <td className="px-2 py-2.5 font-mono tabular-nums" style={{ color: "var(--hf-text)" }}>
                    {r.current}
                  </td>
                  <td
                    className="px-2 py-2.5 font-mono tabular-nums"
                    style={{ color: r.status === "violation" ? "var(--hf-nogo)" : "var(--hf-go)" }}
                  >
                    {r.margin}
                  </td>
                  <td className="px-2 py-2.5">
                    <StatusChip
                      tone={r.status === "violation" ? "nogo" : "go"}
                      label={r.status === "violation" ? "Violation" : "Within"}
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
