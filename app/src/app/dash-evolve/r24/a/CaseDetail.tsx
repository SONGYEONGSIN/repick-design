"use client";

import { useId, useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Headphones,
  Info,
  MessageSquareText,
  MoreHorizontal,
  Phone,
  Pin,
  Send,
  TrendingUp,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import {
  CASES,
  formatAge,
  formatMinutes,
  formatMrr,
  statusLabel,
  type Period,
  type SupportCase,
} from "./data";
import { AgentAvatar, InitialsAvatar } from "./Avatar";
import { SlaChart } from "./SlaChart";
import { Card, ConfirmDialog, DropdownMenu, FOCUS_RING, HealthDot, MenuItem, PriorityBadge, StatusBadge } from "./ui";

const AGENT_ROSTER = Array.from(new Map(CASES.map((c) => [c.assignee.id, c.assignee])).values());

type Tab = "timeline" | "notes" | "activity";
type SortKey = "updated" | "priority";

export function CaseDetail({
  kase,
  onUpdate,
}: {
  kase: SupportCase;
  onUpdate: (id: string, updater: (c: SupportCase) => SupportCase) => void;
}) {
  const [tab, setTab] = useState<Tab>("timeline");
  const [period, setPeriod] = useState<Period>("30d");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [noteText, setNoteText] = useState("");
  const tabsId = useId();

  const relatedCases = useMemo(
    () => CASES.filter((c) => c.customer.company === kase.customer.company && c.id !== kase.id),
    [kase.customer.company, kase.id]
  );
  const [relatedSort, setRelatedSort] = useState<SortKey>("updated");
  const relatedSorted = useMemo(() => {
    const arr = [...relatedCases];
    if (relatedSort === "updated") arr.sort((a, b) => a.ageHours - b.ageHours);
    else
      arr.sort(
        (a, b) =>
          ({ urgent: 0, high: 1, normal: 2, low: 3 }[a.priority] - { urgent: 0, high: 1, normal: 2, low: 3 }[b.priority])
      );
    return arr;
  }, [relatedCases, relatedSort]);

  const isResolved = kase.status === "resolved";
  const isUrgent = kase.priority === "urgent";

  function addTimeline(body: string) {
    onUpdate(kase.id, (c) => ({
      ...c,
      timeline: [...c.timeline, { id: `${c.id}-t${c.timeline.length + 1}`, role: "agent", actor: "You", time: "Just now", body }],
    }));
  }
  function addNote(body: string) {
    onUpdate(kase.id, (c) => ({
      ...c,
      notes: [...c.notes, { id: `${c.id}-n${c.notes.length + 1}`, author: "You", time: "Just now", body }],
    }));
  }
  function addActivity(body: string) {
    onUpdate(kase.id, (c) => ({
      ...c,
      activity: [...c.activity, { id: `${c.id}-a${c.activity.length + 1}`, time: "Just now", body }],
    }));
  }
  function escalate() {
    if (isUrgent) return;
    onUpdate(kase.id, (c) => ({ ...c, priority: "urgent" }));
    addActivity("Escalated to Urgent by You");
  }
  function assign(agentId: string) {
    const agent = AGENT_ROSTER.find((a) => a.id === agentId);
    if (!agent || agent.id === kase.assignee.id) return;
    onUpdate(kase.id, (c) => ({ ...c, assignee: agent }));
    addActivity(`Reassigned to ${agent.name}`);
  }
  function resolveCase() {
    onUpdate(kase.id, (c) => ({ ...c, status: "resolved", slaState: "met", slaDueMinutes: null }));
    addActivity("Status changed: " + statusLabel(kase.status) + " → Resolved");
    setConfirmOpen(false);
  }
  function reopenCase() {
    onUpdate(kase.id, (c) => ({ ...c, status: "open", slaState: "on-track", slaDueMinutes: 60 }));
    addActivity("Status changed: Resolved → Open");
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "timeline", label: "Timeline", count: kase.timeline.length },
    { key: "notes", label: "Notes", count: kase.notes.length },
    { key: "activity", label: "Activity", count: kase.activity.length },
  ];

  function onTabKeyDown(e: KeyboardEvent<HTMLButtonElement>, idx: number) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const next = (idx + dir + tabs.length) % tabs.length;
      setTab(tabs[next].key);
      (document.getElementById(`${tabsId}-tab-${tabs[next].key}`) as HTMLElement | null)?.focus();
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-zinc-50">
      {/* header */}
      <div className="shrink-0 border-b border-zinc-200 bg-white px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              <span className="font-mono tabular-nums">{kase.id}</span>
              <span aria-hidden="true">&middot;</span>
              <span className="inline-flex items-center gap-1 font-medium text-teal-700">
                <Pin className="size-3 fill-teal-600 text-teal-600" aria-hidden="true" />
                Pinned to this view
              </span>
            </div>
            <h2 className="mt-1 text-lg font-semibold leading-snug text-zinc-900">{kase.subject}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <StatusBadge status={kase.status} />
              <PriorityBadge priority={kase.priority} />
              <SlaPill kase={kase} />
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={escalate}
              disabled={isUrgent}
              className={`inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white ${FOCUS_RING}`}
            >
              <TrendingUp className="size-4" aria-hidden="true" />
              {isUrgent ? "Escalated" : "Escalate"}
            </button>

            <DropdownMenu
              label="Assign case"
              triggerClassName={`inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
              triggerContent={
                <>
                  <UserPlus className="size-4" aria-hidden="true" />
                  Assign
                  <ChevronDown className="size-3.5 text-zinc-400" aria-hidden="true" />
                </>
              }
            >
              {(close) => (
                <>
                  {AGENT_ROSTER.map((a) => (
                    <MenuItem
                      key={a.id}
                      onClick={() => {
                        assign(a.id);
                        close();
                      }}
                    >
                      <span className="flex w-full items-center justify-between">
                        <span className="flex items-center gap-2">
                          <AgentAvatar agent={a} size={20} />
                          {a.name}
                        </span>
                        {a.id === kase.assignee.id && <span className="size-1.5 rounded-full bg-teal-600" aria-hidden="true" />}
                      </span>
                    </MenuItem>
                  ))}
                </>
              )}
            </DropdownMenu>

            {isResolved ? (
              <button
                type="button"
                onClick={reopenCase}
                className={`inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 ${FOCUS_RING}`}
              >
                Reopen case
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className={`inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-2 text-sm font-medium text-white hover:bg-teal-800 ${FOCUS_RING}`}
              >
                <CheckCircle2 className="size-4" aria-hidden="true" />
                Resolve case
              </button>
            )}

            <DropdownMenu
              label="More actions"
              align="right"
              triggerClassName={`inline-flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 ${FOCUS_RING}`}
              triggerContent={<MoreHorizontal className="size-4" aria-hidden="true" />}
            >
              {(close) => (
                <MenuItem
                  danger
                  onClick={() => {
                    close();
                    setConfirmOpen(true);
                  }}
                >
                  Close case
                </MenuItem>
              )}
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* body */}
      <div className="grid flex-1 grid-cols-12 gap-4 p-5">
        <div className="col-span-12 flex min-w-0 flex-col gap-4 xl:col-span-7">
          <Card className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div role="tablist" aria-label="Case detail views" className="flex items-center gap-1 border-b border-zinc-200 px-3 pt-2.5">
              {tabs.map((t, i) => (
                <button
                  key={t.key}
                  id={`${tabsId}-tab-${t.key}`}
                  role="tab"
                  aria-selected={tab === t.key}
                  aria-controls={`${tabsId}-panel-${t.key}`}
                  tabIndex={tab === t.key ? 0 : -1}
                  onClick={() => setTab(t.key)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                  className={`relative rounded-t-md px-3 py-2 text-sm font-medium ${FOCUS_RING} ${
                    tab === t.key ? "text-teal-700" : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  {t.label}
                  <span className="ml-1.5 text-xs tabular-nums text-zinc-400">{t.count}</span>
                  {tab === t.key && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-teal-700" aria-hidden="true" />}
                </button>
              ))}
            </div>

            <div
              role="tabpanel"
              id={`${tabsId}-panel-timeline`}
              aria-labelledby={`${tabsId}-tab-timeline`}
              hidden={tab !== "timeline"}
              className="flex min-h-0 flex-1 flex-col"
            >
              <h3 className="sr-only">Timeline</h3>
              <ol className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                {kase.timeline.map((ev) => (
                  <li key={ev.id} className="flex gap-3">
                    <span
                      className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border ${
                        ev.role === "customer"
                          ? "border-zinc-200 bg-zinc-100 text-zinc-500"
                          : ev.role === "agent"
                            ? "border-teal-200 bg-teal-50 text-teal-700"
                            : "border-zinc-200 bg-white text-zinc-400"
                      }`}
                    >
                      {ev.role === "customer" ? (
                        <User className="size-3.5" aria-hidden="true" />
                      ) : ev.role === "agent" ? (
                        <Headphones className="size-3.5" aria-hidden="true" />
                      ) : (
                        <Info className="size-3.5" aria-hidden="true" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-1.5">
                        <span className="text-sm font-medium text-zinc-900">{ev.actor}</span>
                        <span className="text-xs text-zinc-400">{ev.time}</span>
                      </div>
                      <p className="mt-0.5 text-sm leading-relaxed text-zinc-600">{ev.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <form
                className="shrink-0 border-t border-zinc-200 p-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!replyText.trim()) return;
                  addTimeline(replyText.trim());
                  setReplyText("");
                }}
              >
                <label htmlFor={`${tabsId}-reply`} className="sr-only">
                  Reply to customer
                </label>
                <textarea
                  id={`${tabsId}-reply`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={2}
                  placeholder="Reply to the customer&hellip;"
                  className={`w-full resize-none rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 ${FOCUS_RING}`}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className={`inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS_RING}`}
                  >
                    <Send className="size-3.5" aria-hidden="true" />
                    Send reply
                  </button>
                </div>
              </form>
            </div>

            <div
              role="tabpanel"
              id={`${tabsId}-panel-notes`}
              aria-labelledby={`${tabsId}-tab-notes`}
              hidden={tab !== "notes"}
              className="flex min-h-0 flex-1 flex-col"
            >
              <h3 className="sr-only">Internal notes</h3>
              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {kase.notes.length === 0 && (
                  <p className="text-sm text-zinc-500">No internal notes yet. Notes are only visible to your team.</p>
                )}
                {kase.notes.map((n) => (
                  <div key={n.id} className="rounded-lg border border-amber-200 bg-amber-50/60 p-3">
                    <div className="flex items-baseline gap-1.5 text-xs text-zinc-500">
                      <span className="font-medium text-zinc-800">{n.author}</span>
                      <span>{n.time}</span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-700">{n.body}</p>
                  </div>
                ))}
              </div>
              <form
                className="shrink-0 border-t border-zinc-200 p-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!noteText.trim()) return;
                  addNote(noteText.trim());
                  setNoteText("");
                }}
              >
                <label htmlFor={`${tabsId}-note`} className="sr-only">
                  Add an internal note
                </label>
                <textarea
                  id={`${tabsId}-note`}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={2}
                  placeholder="Add an internal note&hellip;"
                  className={`w-full resize-none rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 ${FOCUS_RING}`}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={!noteText.trim()}
                    className={`inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS_RING}`}
                  >
                    <MessageSquareText className="size-3.5" aria-hidden="true" />
                    Add note
                  </button>
                </div>
              </form>
            </div>

            <div
              role="tabpanel"
              id={`${tabsId}-panel-activity`}
              aria-labelledby={`${tabsId}-tab-activity`}
              hidden={tab !== "activity"}
              className="min-h-0 flex-1 overflow-y-auto px-4 py-4"
            >
              <h3 className="sr-only">Activity log</h3>
              <ul className="space-y-2.5">
                {kase.activity.map((a) => (
                  <li key={a.id} className="flex items-baseline gap-2 text-sm">
                    <span className="w-16 shrink-0 text-xs text-zinc-400">{a.time}</span>
                    <span className="text-zinc-600">{a.body}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        <div className="col-span-12 flex min-w-0 flex-col gap-4 xl:col-span-5">
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-zinc-900">Customer</h3>
            <div className="mt-3 flex items-center gap-2.5">
              <InitialsAvatar name={kase.customer.company} size={36} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-900">{kase.customer.company}</p>
                <p className="truncate text-xs text-zinc-500">{kase.requester.name} &middot; {kase.requester.email}</p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 border-t border-zinc-100 pt-4 text-sm">
              <InfoRow icon={Building2} label="Plan">
                {kase.customer.plan}
              </InfoRow>
              <InfoRow icon={Users} label="Seats">
                <span className="tabular-nums">{kase.customer.seats}</span>
              </InfoRow>
              <InfoRow icon={CalendarDays} label="MRR">
                <span className="tabular-nums">{formatMrr(kase.customer.mrr)}</span>
              </InfoRow>
              <InfoRow icon={CalendarDays} label="Customer since">
                <span className="tabular-nums">{kase.customer.sinceYear}</span>
              </InfoRow>
              <InfoRow icon={Phone} label="Phone">
                <span className="tabular-nums">{kase.customer.phone}</span>
              </InfoRow>
              <InfoRow icon={Mail} label="Health">
                <HealthDot health={kase.customer.health} />
              </InfoRow>
            </dl>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900">Response time trend</h3>
              <span className="text-xs text-zinc-400">Queue avg &middot; minutes</span>
            </div>
            <div className="mt-3">
              <SlaChart data={kase.sla} period={period} onPeriodChange={setPeriod} targetMinutes={kase.targetResponseMinutes} />
            </div>
          </Card>
        </div>

        <div className="col-span-12">
          <RelatedCasesTable cases={relatedSorted} company={kase.customer.company} sort={relatedSort} onSort={setRelatedSort} />
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Resolve this case?"
        description={`This marks ${kase.id} as resolved and notifies ${kase.requester.name}. You can reopen it later if needed.`}
        confirmLabel="Resolve case"
        onConfirm={resolveCase}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Building2;
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-zinc-500">
        <Icon className="size-3" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-0.5 font-medium text-zinc-800">{children}</dd>
    </div>
  );
}

function SlaPill({ kase }: { kase: SupportCase }) {
  if (kase.slaState === "met" || kase.slaState === "missed" || kase.slaDueMinutes === null) {
    return (
      <span className="text-xs text-zinc-500">
        SLA {kase.slaState === "met" ? "met" : "missed"} &middot; first response {formatMinutes(kase.firstResponseMinutes)}
      </span>
    );
  }
  const breached = kase.slaState === "breached";
  const atRisk = kase.slaState === "at-risk";
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        breached ? "text-red-700" : atRisk ? "text-amber-700" : "text-zinc-500"
      }`}
    >
      {(breached || atRisk) && <AlertTriangle className="size-3" aria-hidden="true" />}
      SLA {breached ? "breached" : atRisk ? "at risk" : "on track"} &middot;{" "}
      {breached ? `${formatMinutes(Math.abs(kase.slaDueMinutes ?? 0))} overdue` : `${formatMinutes(kase.slaDueMinutes ?? 0)} left`}
    </span>
  );
}

function RelatedCasesTable({
  cases,
  company,
  sort,
  onSort,
}: {
  cases: SupportCase[];
  company: string;
  sort: SortKey;
  onSort: (s: SortKey) => void;
}) {
  function toggle(key: SortKey) {
    onSort(key);
  }
  const ariaSort = (key: SortKey): "ascending" | "none" => (sort === key ? "ascending" : "none");

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-zinc-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-zinc-900">Other cases from {company}</h3>
      </div>
      {cases.length === 0 ? (
        <p className="px-4 py-6 text-sm text-zinc-500">No other open cases from this customer right now.</p>
      ) : (
        <div className="overflow-x-auto">
          {/* min-w keeps every column at or above its computed content minimum (badge + icon + padding)
              even inside a mobile-narrow card; table-fixed then only ever grows column width from there,
              so a badge can never be squeezed into overlap. Comfortably under this width already at
              1280px+ (the two-up detail grid gives this table 500px+), so desktop never sees the scrollbar
              this produces only below that. */}
          <table className="w-full min-w-[560px] table-fixed border-collapse text-sm">
            <caption className="sr-only">Other support cases from {company}</caption>
            <colgroup>
              <col style={{ width: "44%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "18%" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-[11px] uppercase tracking-wide text-zinc-500">
                <th scope="col" className="px-4 py-2 font-semibold">
                  Subject
                </th>
                <th scope="col" className="px-2 py-2 font-semibold">
                  Status
                </th>
                <th scope="col" aria-sort={ariaSort("priority")} className="px-2 py-2 font-semibold">
                  <button type="button" onClick={() => toggle("priority")} className={`inline-flex items-center gap-1 ${FOCUS_RING}`}>
                    Priority
                    <ChevronDown className={`size-3 ${sort === "priority" ? "text-teal-700" : "text-zinc-300"}`} aria-hidden="true" />
                  </button>
                </th>
                <th scope="col" aria-sort={ariaSort("updated")} className="px-4 py-2 text-right font-semibold">
                  <button type="button" onClick={() => toggle("updated")} className={`inline-flex items-center gap-1 ${FOCUS_RING}`}>
                    Age
                    <ChevronDown className={`size-3 ${sort === "updated" ? "text-teal-700" : "text-zinc-300"}`} aria-hidden="true" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id} className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50">
                  <td className="truncate px-4 py-2.5 text-zinc-800">{c.subject}</td>
                  <td className="px-2 py-2.5">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-2 py-2.5">
                    <PriorityBadge priority={c.priority} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-right tabular-nums text-zinc-500">{formatAge(c.ageHours)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
