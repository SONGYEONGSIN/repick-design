"use client";

import { CalendarDays, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { formatDate, SERVICE_BY_ID, STATUS_LABEL, type DayCell } from "./data";
import { BORDER, DIVIDE, NUM, TEXT_CAPTION, TEXT_PRIMARY, TONE, cx } from "./tokens";
import { Badge, InitialsAvatar } from "./ui";

const STATUS_TONE = {
  success: TONE.good,
  rolled_back: TONE.warn,
  failed: TONE.bad,
} as const;

const STATUS_ICON = {
  success: CheckCircle2,
  rolled_back: RotateCcw,
  failed: XCircle,
} as const;

export default function DayDetailPanel({ day }: { day: DayCell | null }) {
  if (!day) {
    return (
      <div className="flex min-h-[9rem] flex-col items-center justify-center gap-2 py-6 text-center">
        <CalendarDays size={20} aria-hidden="true" className={TEXT_CAPTION} />
        <p className={cx("text-sm", TEXT_CAPTION)}>Select a day on the calendar to see its deploy list.</p>
      </div>
    );
  }

  if (day.deployCount === 0) {
    return (
      <div>
        <p className={cx("text-sm font-semibold", TEXT_PRIMARY)}>{formatDate(day.dateMs)}</p>
        <p className={cx("mt-2 text-sm", TEXT_CAPTION)}>No deploys shipped this day.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={cx("text-sm font-semibold", TEXT_PRIMARY)}>{formatDate(day.dateMs)}</p>
        <span className={cx("text-xs", TEXT_CAPTION)}>
          <span className={NUM}>{day.deployCount}</span> deploy{day.deployCount === 1 ? "" : "s"}
          {day.incident ? (
            <>
              {" "}
              &middot; incident, <span className={NUM}>{day.mttrMinutes}</span> min MTTR
            </>
          ) : (
            " · no incident"
          )}
        </span>
      </div>

      <ul className={cx("mt-3 divide-y", DIVIDE)}>
        {day.deploys.map((d) => {
          const service = SERVICE_BY_ID[d.serviceId];
          const StatusIcon = STATUS_ICON[d.status];
          return (
            <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 first:pt-0 last:pb-0">
              <div className="flex min-w-0 items-center gap-2.5">
                <InitialsAvatar initials={d.authorInitials} />
                <div className="min-w-0">
                  <p className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{d.author}</p>
                  <p className="flex items-center gap-1.5 truncate text-xs">
                    <span className={cx("h-1.5 w-1.5 shrink-0 rounded-full", service.dot)} aria-hidden="true" />
                    <span className={TEXT_CAPTION}>{service.name}</span>
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className={cx("text-xs", NUM, TEXT_CAPTION)}>{d.durationMin}m</span>
                <Badge tone={STATUS_TONE[d.status]} Icon={StatusIcon}>
                  {STATUS_LABEL[d.status]}
                </Badge>
              </div>
            </li>
          );
        })}
      </ul>
      <p className={cx("mt-3 border-t pt-2 text-[11px]", BORDER, TEXT_CAPTION)}>Lead time shown per deploy in the table below reflects commit-to-deploy duration.</p>
    </div>
  );
}
