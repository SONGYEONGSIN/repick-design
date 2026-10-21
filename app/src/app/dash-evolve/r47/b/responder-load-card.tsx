"use client";

import { ENGINEERS, computeResponderLoad, type Incident } from "./data";
import { Avatar, Card } from "./ui";

/** Each engineer's active-incident count is `incidents.filter(...)`, not typed out — it always
 *  matches the sum shown elsewhere (header "active" count = the sum of every row here). */
export function ResponderLoadCard({ incidents }: { incidents: Incident[] }) {
  const rows = computeResponderLoad(incidents);
  const totalActive = rows.reduce((sum, r) => sum + r.activeCount, 0);

  return (
    <Card as="section" ariaLabelledBy="responder-title" className="p-4 sm:p-5">
      <h2 id="responder-title" className="text-sm font-semibold text-zinc-50">
        Responder Load
      </h2>
      <p className="mt-0.5 font-normal text-xs text-zinc-400">{totalActive} active incidents assigned across on-call</p>

      <ul className="mt-4 space-y-2.5">
        {rows.map(({ engineerId, activeCount }) => {
          const engineer = ENGINEERS[engineerId];
          return (
            <li key={engineerId} className="flex items-center gap-2.5">
              <Avatar name={engineer.name} avatarId={engineer.avatarId} size={28} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-xs text-zinc-200">{engineer.name}</p>
                <p className="truncate font-normal text-[11px] text-zinc-500">{engineer.role}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 font-medium text-[11px] tabular-nums ${
                  activeCount >= 2 ? "bg-rose-950 text-rose-300" : "bg-white/5 text-zinc-300"
                }`}
              >
                {activeCount}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
