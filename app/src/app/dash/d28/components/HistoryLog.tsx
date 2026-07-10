import type { HistoryEntry } from "../data";
import { StatusChip } from "./StatusChip";
import styles from "../console.module.css";

export function HistoryLog({ entries }: { entries: HistoryEntry[] }) {
  return (
    <section aria-labelledby="history-heading" id="history" className="min-w-0 scroll-mt-20 lg:col-span-3">
      <h2 id="history-heading" className="mb-3 text-sm font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--hf-text)" }}>
        07 — Hold / Recycle Log
      </h2>
      <div className={`${styles.panel} p-4 sm:p-6`}>
        <div className={styles.scrollX}>
          <table className="w-full min-w-[280px] border-collapse text-left text-sm">
            <caption className="sr-only">Log of holds and recycles called during this count</caption>
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--hf-border)" }}>
                {["T-Time", "Duration", "Called by"].map((h) => (
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
              {entries.map((e) => (
                <tr key={e.tTime} className="border-b align-top" style={{ borderColor: "var(--hf-border)" }}>
                  <th scope="row" className="px-2 py-2.5 font-mono font-medium tabular-nums" style={{ color: "var(--hf-text)" }}>
                    {e.tTime}
                  </th>
                  <td className="px-2 py-2.5 font-mono tabular-nums" style={{ color: "var(--hf-text-2)" }}>
                    {e.duration}
                    {e.ongoing && (
                      <span className="mt-1 block">
                        <StatusChip tone="hold" label="Ongoing" />
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-2.5" style={{ color: "var(--hf-text-2)" }}>
                    {e.calledBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-3 flex flex-col gap-2 border-t pt-3" style={{ borderColor: "var(--hf-border)" }}>
          {entries.map((e) => (
            <li key={`${e.tTime}-note`} className="text-xs leading-snug" style={{ color: "var(--hf-text-2)" }}>
              <span className="font-mono font-semibold" style={{ color: "var(--hf-text)" }}>
                {e.tTime}
              </span>{" "}
              — {e.reason}. {e.resolution}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
