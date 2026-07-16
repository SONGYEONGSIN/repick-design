"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Circle,
  CircleDashed,
  CircleDot,
  CircleEllipsis,
  Copy,
  GitPullRequest,
  Inbox,
  MessageSquare,
  Plus,
  Tag,
  UserPlus,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
  XCircle,
} from "lucide-react";
import { Avatar, Badge, EyebrowLabel, ProgressBar, UnassignedAvatar } from "./ui";
import {
  ActivityEvent,
  Issue,
  IssueStatus,
  LABEL_META,
  PRIORITY_META,
  PRIORITY_ORDER,
  Priority,
  STATUS_META,
  STATUS_ORDER,
  memberById,
} from "../lib/data";
import { numberFormatter } from "../lib/format";

const STATUS_ICON: Record<IssueStatus, typeof Circle> = {
  backlog: CircleDashed,
  todo: Circle,
  "in-progress": CircleDot,
  "in-review": CircleEllipsis,
  done: CheckCircle2,
  cancelled: XCircle,
};

const PRIORITY_ICON: Record<Priority, typeof Circle> = {
  urgent: AlertTriangle,
  high: SignalHigh,
  medium: SignalMedium,
  low: SignalLow,
  none: SignalZero,
};

const ACTIVITY_ICON: Record<ActivityEvent["type"], typeof Circle> = {
  created: Plus,
  status: CircleDot,
  priority: AlertTriangle,
  label: Tag,
  comment: MessageSquare,
  pr: GitPullRequest,
  assigned: UserPlus,
};

export default function DetailPane({
  issue,
  onBack,
  onChangeStatus,
  onChangePriority,
  onToggleSubIssue,
  className = "",
}: {
  issue: Issue | undefined;
  onBack: () => void;
  onChangeStatus: (issueId: string, status: IssueStatus) => void;
  onChangePriority: (issueId: string, priority: Priority) => void;
  onToggleSubIssue: (issueId: string, subIssueId: string) => void;
  className?: string;
}) {
  if (!issue) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 px-6 py-16 text-center ${className}`}>
        <Inbox className="h-6 w-6 text-zinc-400" aria-hidden="true" />
        <p className="text-sm font-medium text-zinc-700">No issue selected</p>
        <p className="max-w-xs text-xs text-zinc-500">
          Choose an issue from the list to see its full detail, sub-issues, and activity here.
        </p>
      </div>
    );
  }

  const assignee = memberById(issue.assigneeId ?? undefined);
  const subDone = issue.subIssues?.filter((s) => s.done).length ?? 0;
  const subTotal = issue.subIssues?.length ?? 0;

  return (
    <div className={`flex h-full flex-col overflow-y-auto ${className}`}>
      <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-2.5 sm:px-5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to issue list"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-600 outline-none hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 lg:hidden"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <CopyIdButton id={issue.id} />
        <div className="ml-auto flex items-center gap-2">
          <StatusMenu status={issue.status} onChange={(s) => onChangeStatus(issue.id, s)} />
          <PriorityMenu priority={issue.priority} onChange={(p) => onChangePriority(issue.id, p)} />
        </div>
      </div>

      <div className="min-w-0 flex-1 px-4 py-4 sm:px-6 sm:py-5">
        <h2 className="text-lg font-semibold leading-snug tracking-tight text-zinc-900">
          {issue.title}
        </h2>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
          <MetaField label="Assignee">
            {assignee ? (
              <span className="flex min-w-0 items-center gap-1.5">
                <Avatar src={assignee.avatar} name={assignee.name} size={18} />
                <span className="truncate text-xs font-medium text-zinc-800">{assignee.name}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                <UnassignedAvatar size={18} />
                Unassigned
              </span>
            )}
          </MetaField>
          <MetaField label="Cycle">
            <span className="text-xs font-medium text-zinc-800">{issue.cycle}</span>
          </MetaField>
          <MetaField label="Estimate">
            <span className="text-xs font-medium tabular-nums text-zinc-800">{issue.estimate} pts</span>
          </MetaField>
          <MetaField label="Created">
            <span className="text-xs font-medium tabular-nums text-zinc-800">{issue.createdLabel}</span>
          </MetaField>
        </dl>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {issue.labels.map((label) => (
            <Badge key={label} className={LABEL_META[label]?.badgeClass ?? ""}>
              {label}
            </Badge>
          ))}
        </div>

        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-700">{issue.description}</p>

        {issue.subIssues && issue.subIssues.length > 0 ? (
          <div className="mt-6 max-w-3xl">
            <div className="flex items-center justify-between">
              <EyebrowLabel>Sub-issues</EyebrowLabel>
              <span className="text-xs tabular-nums text-zinc-500">
                {numberFormatter.format(subDone)}/{numberFormatter.format(subTotal)}
              </span>
            </div>
            <div className="mt-1.5">
              <ProgressBar
                value={(subDone / subTotal) * 100}
                className="bg-indigo-500"
                ariaLabel={`Sub-issues complete: ${subDone} of ${subTotal}`}
              />
            </div>
            <ul className="mt-2 space-y-0.5">
              {issue.subIssues.map((sub) => (
                <li key={sub.id}>
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-zinc-50">
                    <input
                      type="checkbox"
                      checked={sub.done}
                      onChange={() => onToggleSubIssue(issue.id, sub.id)}
                      className="h-3.5 w-3.5 shrink-0 rounded border-zinc-300 accent-indigo-600"
                    />
                    <span className={`text-sm ${sub.done ? "text-zinc-400 line-through" : "text-zinc-700"}`}>
                      {sub.title}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {issue.linkedPr ? (
          <div className="mt-6 max-w-3xl">
            <EyebrowLabel>Linked pull request</EyebrowLabel>
            <div className="mt-1.5 flex items-center gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5">
              <GitPullRequest
                className={`h-4 w-4 shrink-0 ${issue.linkedPr.status === "merged" ? "text-violet-600" : "text-emerald-600"}`}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-zinc-900">{issue.linkedPr.title}</p>
                <p className="text-[11px] tabular-nums text-zinc-500">{issue.linkedPr.id}</p>
              </div>
              <Badge
                className={
                  issue.linkedPr.status === "merged"
                    ? "border-violet-200 bg-violet-50 text-violet-700"
                    : issue.linkedPr.status === "draft"
                      ? "border-zinc-200 bg-zinc-100 text-zinc-600"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }
              >
                {issue.linkedPr.status}
              </Badge>
            </div>
          </div>
        ) : null}

        <div className="mt-6 max-w-3xl">
          <EyebrowLabel>Activity</EyebrowLabel>
          <ol className="mt-3 space-y-3">
            {issue.activity.map((event) => (
              <ActivityRow key={event.id} event={event} />
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function MetaField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}

function ActivityRow({ event }: { event: ActivityEvent }) {
  const actor = memberById(event.actorId);
  const Icon = ACTIVITY_ICON[event.type];

  if (event.type === "comment") {
    return (
      <li className="flex gap-2.5">
        {actor ? (
          <Avatar src={actor.avatar} name={actor.name} size={24} />
        ) : (
          <UnassignedAvatar size={24} />
        )}
        <div className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-900">{actor?.name ?? "Unknown"}</span>
            <span className="text-[11px] tabular-nums text-zinc-500">{event.timestampLabel}</span>
          </div>
          <p className="mt-0.5 text-xs leading-relaxed text-zinc-700">{event.text}</p>
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-2.5 text-xs text-zinc-600">
      <Icon className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate">
        <span className="font-medium text-zinc-800">{actor?.name ?? "Unknown"}</span> {event.text}
      </span>
      <span className="shrink-0 tabular-nums text-zinc-500">{event.timestampLabel}</span>
    </li>
  );
}

function CopyIdButton({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — no-op, button remains a no-risk affordance.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium tabular-nums text-zinc-500 outline-none transition-colors motion-reduce:transition-none hover:bg-zinc-50 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
    >
      {id}
      {copied ? (
        <Check className="h-3 w-3 text-emerald-600" aria-hidden="true" />
      ) : (
        <Copy className="h-3 w-3" aria-hidden="true" />
      )}
      <span className="sr-only" aria-live="polite">
        {copied ? "Issue ID copied" : ""}
      </span>
    </button>
  );
}

function StatusMenu({
  status,
  onChange,
}: {
  status: IssueStatus;
  onChange: (status: IssueStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const meta = STATUS_META[status];
  const Icon = STATUS_ICON[status];

  useOutsideClose(ref, open, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 ${meta.badgeClass}`}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {meta.label}
      </button>
      {open ? (
        <div role="menu" aria-label="Change status" className="absolute left-0 z-30 mt-1.5 w-44 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg">
          {STATUS_ORDER.map((s) => {
            const ItemIcon = STATUS_ICON[s];
            const itemMeta = STATUS_META[s];
            return (
              <button
                key={s}
                role="menuitemradio"
                aria-checked={s === status}
                type="button"
                onClick={() => {
                  onChange(s);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  s === status ? "bg-zinc-100 font-medium text-zinc-900" : "text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                <ItemIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {itemMeta.label}
                {s === status ? <Check className="ml-auto h-3.5 w-3.5 text-indigo-600" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function PriorityMenu({
  priority,
  onChange,
}: {
  priority: Priority;
  onChange: (priority: Priority) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const meta = PRIORITY_META[priority];
  const Icon = PRIORITY_ICON[priority];

  useOutsideClose(ref, open, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium outline-none transition-colors motion-reduce:transition-none hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 ${meta.textClass}`}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {meta.label}
      </button>
      {open ? (
        <div role="menu" aria-label="Change priority" className="absolute right-0 z-30 mt-1.5 w-40 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg">
          {PRIORITY_ORDER.map((p) => {
            const ItemIcon = PRIORITY_ICON[p];
            const itemMeta = PRIORITY_META[p];
            return (
              <button
                key={p}
                role="menuitemradio"
                aria-checked={p === priority}
                type="button"
                onClick={() => {
                  onChange(p);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  p === priority ? "bg-zinc-100 font-medium text-zinc-900" : "text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                <ItemIcon className={`h-3.5 w-3.5 shrink-0 ${itemMeta.textClass}`} aria-hidden="true" />
                {itemMeta.label}
                {p === priority ? <Check className="ml-auto h-3.5 w-3.5 text-indigo-600" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function useOutsideClose(ref: RefObject<HTMLElement | null>, open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, ref, close]);
}
