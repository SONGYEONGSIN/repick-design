"use client";

import { useState } from "react";
import { Check, Flag, Clock } from "lucide-react";
import { INITIAL_APPROVALS, formatUsd, type Approval, type ApprovalStatus } from "./data";
import { Badge } from "./ui";

export function ApprovalsFeed() {
  const [approvals, setApprovals] = useState<Approval[]>(INITIAL_APPROVALS);

  function setStatus(id: string, status: ApprovalStatus) {
    setApprovals((cur) => cur.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  const pendingCount = approvals.filter((a) => a.status === "pending").length;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-50">Approvals queue</h2>
        <span className="text-xs text-zinc-400">
          <span className="font-medium tabular-nums text-zinc-50">{pendingCount}</span> pending
        </span>
      </div>
      <ul className="flex max-h-96 flex-col gap-2 overflow-y-auto overflow-x-hidden pr-1">
        {approvals.map((a) => {
          const resolved = a.status !== "pending";
          return (
            <li
              key={a.id}
              className={`rounded-lg border p-3 ${
                a.status === "approved"
                  ? "border-lime-400/30 bg-lime-400/5"
                  : a.status === "flagged"
                    ? "border-rose-400/30 bg-rose-400/5"
                    : "border-white/10 bg-zinc-900"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-zinc-50">{a.vendorName}</div>
                  <div className="mt-0.5 truncate text-xs text-zinc-400">{a.note}</div>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-zinc-50">{formatUsd(a.amount)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="truncate text-xs text-zinc-400">
                  {a.submittedBy} · {a.requestedIso}
                </span>
                {resolved ? (
                  <Badge tone={a.status === "approved" ? "lime" : "rose"}>
                    {a.status === "approved" ? <Check className="h-3 w-3" aria-hidden="true" /> : <Flag className="h-3 w-3" aria-hidden="true" />}
                    {a.status}
                  </Badge>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setStatus(a.id, "approved")}
                      className="flex h-8 items-center gap-1 rounded-md bg-lime-400/15 px-2 text-xs font-medium text-lime-300 transition-colors hover:bg-lime-400/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 motion-reduce:transition-none"
                    >
                      <Check className="h-3 w-3" aria-hidden="true" />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(a.id, "flagged")}
                      className="flex h-8 items-center gap-1 rounded-md bg-white/5 px-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-rose-400/15 hover:text-rose-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 motion-reduce:transition-none"
                    >
                      <Flag className="h-3 w-3" aria-hidden="true" />
                      Flag
                    </button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {pendingCount === 0 ? (
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-400">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          All requests triaged for this cycle.
        </div>
      ) : null}
    </div>
  );
}
