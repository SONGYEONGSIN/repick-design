"use client";

import { useMemo, useState } from "react";
import { ACTOR_RISK, actorById, type ActorWindow } from "./data";
import { BORDER_SOFT, NUM, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, cx } from "./tokens";
import { CardHead, Progress, Segmented, SortHeader } from "./ui";

const WINDOW_OPTIONS: { id: ActorWindow; label: string }[] = [
  { id: "24h", label: "24h" },
  { id: "7d", label: "7D" },
  { id: "30d", label: "30D" },
];

type SortKey = "events" | "critical" | "risk";

/**
 * Independent widget — scoped only by the 24h/7d/30d control below, never by the event-stream
 * filters (severity/actor/category/search) above. ACTOR_RISK is a hand-authored per-window dataset
 * (data.ts), not a live filter of EVENTS, so this table's sort and window state never touch, and are
 * never touched by, the stream or the summary cards.
 */
export default function ActorTable() {
  const [win, setWin] = useState<ActorWindow>("7d");
  const [sortKey, setSortKey] = useState<SortKey>("events");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const rows = useMemo(() => {
    const copy = [...ACTOR_RISK];
    copy.sort((a, b) => {
      const av = sortKey === "events" ? a.events[win] : sortKey === "critical" ? a.critical[win] : a.risk[win];
      const bv = sortKey === "events" ? b.events[win] : sortKey === "critical" ? b.critical[win] : b.risk[win];
      return sortDir === "desc" ? bv - av : av - bv;
    });
    return copy;
  }, [win, sortKey, sortDir]);

  return (
    <div>
      <CardHead
        title="Actor risk index"
        hint="Ranked by activity and severity in the selected window — independent of the stream filters."
        action={<Segmented options={WINDOW_OPTIONS} value={win} onChange={setWin} ariaLabel="Actor risk window" />}
      />

      <div className="mt-3 overflow-hidden">
        <table className="w-full table-fixed border-collapse text-sm">
          <colgroup>
            <col className="w-[46%]" />
            <col className="w-[18%]" />
            <col className="hidden w-[16%] sm:table-column" />
            <col className="w-[20%] sm:w-[20%]" />
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER_SOFT)}>
              <th scope="col" className={cx("py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>
                Actor
              </th>
              <SortHeader label="Events" active={sortKey === "events"} dir={sortDir} onClick={() => toggleSort("events")} className="text-right [&_button]:ml-auto" />
              <SortHeader label="Critical" active={sortKey === "critical"} dir={sortDir} onClick={() => toggleSort("critical")} className="hidden text-right sm:table-cell [&_button]:ml-auto" />
              <SortHeader label="Risk" active={sortKey === "risk"} dir={sortDir} onClick={() => toggleSort("risk")} className="text-right [&_button]:ml-auto" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const actor = actorById(r.actorId);
              return (
                <tr key={r.actorId} className={cx("border-b last:border-0", BORDER_SOFT)}>
                  <td className="py-2 pr-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <actor.Icon size={13} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
                      <span className="min-w-0">
                        <span className={cx("block truncate text-xs font-medium", TEXT_PRIMARY)}>{actor.name}</span>
                        <span className={cx("block truncate text-[10px] font-normal", TEXT_AUX)}>{r.lastSeen}</span>
                      </span>
                    </div>
                  </td>
                  <td className={cx("whitespace-nowrap py-2 text-right text-xs font-medium", TEXT_MUTED, NUM)}>{r.events[win]}</td>
                  <td className={cx("hidden whitespace-nowrap py-2 text-right text-xs font-medium sm:table-cell", r.critical[win] > 0 ? "text-rose-400" : TEXT_MUTED, NUM)}>{r.critical[win]}</td>
                  <td className="py-2 pl-2">
                    <div className="flex items-center justify-end gap-2">
                      <span className={cx("w-7 shrink-0 text-right text-xs font-medium", TEXT_PRIMARY, NUM)}>{r.risk[win]}</span>
                      <span className="w-12 shrink-0">
                        <Progress value={r.risk[win]} label={`${actor.name} risk score`} />
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
