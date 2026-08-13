"use client";

import { CheckCircle2, ChevronDown, GitBranch, Hammer, Loader2, RotateCcw, Rocket, XCircle } from "lucide-react";
import Image from "next/image";
import {
  diffTotals,
  formatDuration,
  formatRelative,
  formatWhen,
  KIND_LABEL,
  SERVICE_BY_ID,
  STATUS_LABEL,
  unsplashAvatar,
  type EventStatus,
  type FeedEvent,
} from "../data";
import { FOCUS_RING, FOCUS_RING_INSET, HOVER_ACTIVE_BG, MONO, NUM, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TONE, TRANSITION, cx } from "../tokens";
import { Badge } from "../ui";

const STATUS_TONE: Record<EventStatus, "good" | "bad" | "pending" | "altered"> = {
  success: "good",
  failed: "bad",
  running: "pending",
  rolled_back: "altered",
};

const STATUS_ICON = {
  success: CheckCircle2,
  failed: XCircle,
  running: Loader2,
  rolled_back: RotateCcw,
} as const;

export default function FeedItem({
  event,
  selected,
  expanded,
  onSelect,
  onToggleExpand,
}: {
  event: FeedEvent;
  selected: boolean;
  expanded: boolean;
  onSelect: () => void;
  onToggleExpand: () => void;
}) {
  const service = SERVICE_BY_ID[event.serviceId];
  const StatusIcon = STATUS_ICON[event.status];
  const KindIcon = event.kind === "build" ? Hammer : Rocket;
  const detailId = `${event.id}-detail`;
  const totals = diffTotals(event.files);

  return (
    <li className={cx("rounded-xl border transition-[background-color,border-color,box-shadow]", "border-white/10", selected ? "border-cyan-400/50 bg-white/[0.04] ring-1 ring-cyan-400/60" : "bg-zinc-950 hover:border-white/20")}>
      <div className="flex items-stretch">
        <button
          type="button"
          onClick={onSelect}
          aria-pressed={selected}
          className={cx("min-w-0 flex-1 rounded-l-xl px-3.5 py-3 text-left sm:px-4", TRANSITION, FOCUS_RING_INSET, !selected && HOVER_ACTIVE_BG)}
        >
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Badge tone={TONE[STATUS_TONE[event.status]]} Icon={StatusIcon === Loader2 ? undefined : StatusIcon}>
              {event.status === "running" ? (
                <Loader2 size={11} aria-hidden="true" className="motion-safe:animate-spin" />
              ) : null}
              {STATUS_LABEL[event.status]}
            </Badge>
            <span className={cx("inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>
              <KindIcon size={11} aria-hidden="true" />
              {KIND_LABEL[event.kind]}
            </span>
            <span className={cx("inline-flex items-center gap-1.5 truncate text-sm font-semibold", TEXT_PRIMARY)}>
              <span className={cx("h-1.5 w-1.5 shrink-0 rounded-full", service.dot)} aria-hidden="true" />
              {service.name}
            </span>
            {event.environment ? <span className={cx("truncate text-xs", TEXT_CAPTION)}>&rarr; {event.environment}</span> : null}
          </div>

          <p className={cx("mt-1.5 truncate text-sm", TEXT_SECONDARY)}>{event.commitMessage}</p>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className={cx("inline-flex items-center gap-1 text-xs", MONO, NUM, TEXT_CAPTION)}>{event.commitSha}</span>
            <span className={cx("inline-flex items-center gap-1 text-xs", TEXT_CAPTION)}>
              <GitBranch size={11} aria-hidden="true" />
              {event.branch}
            </span>
            <span className="inline-flex min-w-0 items-center gap-1.5 text-xs">
              <Image
                src={unsplashAvatar(event.author.avatarId, 40)}
                alt={`${event.author.name} profile photo`}
                width={16}
                height={16}
                className="h-4 w-4 shrink-0 rounded-full object-cover"
              />
              <span className={cx("truncate", TEXT_CAPTION)}>{event.author.name}</span>
            </span>
            <span className={cx("ml-auto shrink-0 whitespace-nowrap text-xs", NUM, TEXT_CAPTION)}>
              {event.durationSec !== null ? formatDuration(event.durationSec) + " · " : ""}
              {formatRelative(event.startedAtMs)}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={onToggleExpand}
          aria-expanded={expanded}
          aria-controls={detailId}
          aria-label={`${expanded ? "Collapse" : "Expand"} details for ${event.commitMessage}`}
          className={cx("flex w-11 shrink-0 items-center justify-center rounded-r-xl border-l border-white/10", TRANSITION, FOCUS_RING, HOVER_ACTIVE_BG)}
        >
          <ChevronDown size={16} aria-hidden="true" className={cx(TEXT_CAPTION, "transition-transform motion-reduce:transition-none", expanded && "rotate-180")} />
        </button>
      </div>

      {expanded ? (
        <div id={detailId} className="border-t border-white/10 px-3.5 py-3 sm:px-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="min-w-0">
              <h3 className={cx("text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>
                Commit diff &middot; <span className={NUM}>{totals.filesChanged}</span> file{totals.filesChanged === 1 ? "" : "s"}
              </h3>
              <ul className="mt-2 flex flex-col gap-1">
                {event.files.map((f) => (
                  <li key={f.path} className="flex items-center gap-2 text-xs">
                    <span className={cx("min-w-0 flex-1 truncate", MONO, TEXT_SECONDARY)}>{f.path}</span>
                    <span className={cx("shrink-0", NUM, "text-emerald-400")}>+{f.additions}</span>
                    <span className={cx("shrink-0", NUM, "text-rose-400")}>-{f.deletions}</span>
                  </li>
                ))}
              </ul>
              <p className={cx("mt-2 text-xs", NUM, TEXT_CAPTION)}>
                <span className="text-emerald-400">+{totals.additions}</span> <span className="text-rose-400">-{totals.deletions}</span> across {totals.filesChanged} file
                {totals.filesChanged === 1 ? "" : "s"}
              </p>
            </div>

            <div className="min-w-0">
              <h3 className={cx("text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>Log excerpt</h3>
              <pre className={cx("mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap break-words rounded-lg border border-white/10 bg-black/40 p-2.5 text-[11px] leading-relaxed", MONO, TEXT_SECONDARY, "[scrollbar-width:thin]")}>
                {event.logLines.join("\n")}
              </pre>
              <p className={cx("mt-2 text-[11px]", TEXT_CAPTION)}>Started {formatWhen(event.startedAtMs)}</p>
            </div>
          </div>
        </div>
      ) : null}
    </li>
  );
}
