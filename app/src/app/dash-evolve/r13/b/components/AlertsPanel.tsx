"use client";

import { CheckCircle2, GitCommitHorizontal, Radio } from "lucide-react";
import Image from "next/image";
import { ALERTS, formatRelative, SERVICE_BY_ID, SEVERITY_LABEL, SEVERITY_TONE, unsplashAvatar } from "../data";
import { BORDER, NUM, TEXT_CAPTION, TEXT_PRIMARY, TONE, cx } from "../tokens";
import { Badge, Card, CardHeader } from "../ui";

export default function AlertsPanel({ selectedEventId }: { selectedEventId: string | null }) {
  const openCount = ALERTS.filter((a) => a.status === "open").length;

  return (
    <Card padded={false} className="flex min-h-0 flex-col">
      <div className="p-4 pb-3 sm:p-5 sm:pb-3">
        <CardHeader
          title="Active alerts"
          description={`${openCount} open · on-call rotation`}
          action={
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400">
              <Radio size={12} aria-hidden="true" />
              Live
            </span>
          }
        />
      </div>
      <ul className="flex min-h-0 flex-col gap-2 overflow-y-auto px-4 pb-4 sm:px-5 sm:pb-5 [scrollbar-width:thin]" aria-label="Active alerts">
        {ALERTS.map((alert) => {
          const related = selectedEventId !== null && alert.relatedEventId === selectedEventId;
          const service = SERVICE_BY_ID[alert.serviceId];
          return (
            <li
              key={alert.id}
              className={cx(
                "rounded-xl border p-3",
                BORDER,
                "bg-zinc-950",
                related && "ring-2 ring-cyan-400 ring-offset-2 ring-offset-zinc-950 border-white/20",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <Badge tone={TONE[SEVERITY_TONE[alert.severity]]}>{SEVERITY_LABEL[alert.severity]}</Badge>
                <span className={cx("shrink-0 text-[11px]", NUM, TEXT_CAPTION)}>{formatRelative(alert.openedAtMs)}</span>
              </div>

              <p className={cx("mt-2 text-sm leading-snug", TEXT_PRIMARY)}>{alert.title}</p>

              <p className={cx("mt-1.5 truncate text-xs", TEXT_CAPTION)}>
                {service.name}
                {alert.environment ? ` · ${alert.environment}` : " · CI only"}
              </p>

              <div className="mt-2.5 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-1.5">
                  <Image
                    src={unsplashAvatar(alert.onCall.avatarId, 48)}
                    alt={`${alert.onCall.name} profile photo`}
                    width={18}
                    height={18}
                    className="h-[18px] w-[18px] shrink-0 rounded-full object-cover"
                  />
                  <span className={cx("truncate text-xs", TEXT_CAPTION)}>{alert.onCall.name}</span>
                </div>
                {alert.status === "acknowledged" ? (
                  <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-zinc-400">
                    <CheckCircle2 size={12} aria-hidden="true" />
                    Ack&apos;d
                  </span>
                ) : null}
              </div>

              {related ? (
                <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-cyan-300">
                  <GitCommitHorizontal size={11} aria-hidden="true" />
                  Related to the selected activity
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
