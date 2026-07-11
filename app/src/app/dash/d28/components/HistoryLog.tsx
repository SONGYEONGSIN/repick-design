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
        {/* Two columns (not three) so the table always fits the card's
            inner width without a local scrollbar — "Called by" is folded
            into the T-Time cell as a labelled second line instead of its
            own narrow column. */}
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <caption className="sr-only">Log of holds and recycles called during this count, including which station called each one</caption>
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--hf-border)" }}>
              {["T-Time", "Duration"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="w-1/2 px-1.5 py-2 text-[11px] font-semibold uppercase tracking-[0.06em]"
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
                <th scope="row" className="px-1.5 py-2.5 text-left font-medium" style={{ color: "var(--hf-text)" }}>
                  <span className="block font-mono tabular-nums">{e.tTime}</span>
                  <span className="mt-0.5 block text-[11px] font-normal normal-case" style={{ color: "var(--hf-text-3)" }}>
                    Called by {e.calledBy}
                  </span>
                </th>
                <td className="px-1.5 py-2.5 font-mono tabular-nums" style={{ color: "var(--hf-text-2)" }}>
                  {e.duration}
                  {e.ongoing && (
                    <span className="mt-1 block">
                      {/* "LIVE" (not "Ongoing") keeps the badge narrow enough
                          to always clear the Duration column with headroom
                          to spare, matching the 4-char abbreviation family
                          used in 06 — Weather Constraints. */}
                      <StatusChip tone="hold" label="LIVE" />
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
