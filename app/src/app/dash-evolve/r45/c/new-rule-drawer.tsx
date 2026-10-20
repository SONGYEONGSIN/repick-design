"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, X } from "lucide-react";
import { DEPARTMENTS, DEPARTMENT_BY_ID, type Priority } from "./data";
import { FOCUS_RING, PriorityBadge } from "./ui";

type Rule = { id: string; fromId: string; toId: string; priority: Priority };

const SEED_RULES: Rule[] = [
  { id: "r1", fromId: "t1-support", toId: "trust-safety", priority: "urgent" },
  { id: "r2", fromId: "billing", toId: "customer-success", priority: "normal" },
  { id: "r3", fromId: "sales", toId: "t1-support", priority: "high" },
];

export default function NewRuleDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [rules, setRules] = useState<Rule[]>(SEED_RULES);
  const [fromId, setFromId] = useState(DEPARTMENTS[0].id);
  const [toId, setToId] = useState(DEPARTMENTS[1].id);
  const [priority, setPriority] = useState<Priority>("normal");

  if (!open) return null;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (fromId === toId) return;
    const rule: Rule = { id: `r-${rules.length + 1}-${fromId}-${toId}`, fromId, toId, priority };
    setRules((prev) => [rule, ...prev]);
  }

  return (
    <div className="fixed inset-0 z-50">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-zinc-900/30" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-rule-heading"
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-zinc-200 bg-white shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-5 py-4">
          <h2 id="new-rule-heading" className="font-semibold text-sm text-zinc-900">
            New routing rule
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <form onSubmit={handleSubmit}>
            <label className="block" htmlFor="nr-from">
              <span className="font-medium text-xs uppercase tracking-[0.06em] text-zinc-500">When tickets arrive in</span>
              <select
                id="nr-from"
                value={fromId}
                onChange={(e) => setFromId(e.target.value)}
                className={`mt-1.5 flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 font-normal text-sm text-zinc-900 ${FOCUS_RING}`}
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block" htmlFor="nr-to">
              <span className="font-medium text-xs uppercase tracking-[0.06em] text-zinc-500">Route to</span>
              <select
                id="nr-to"
                value={toId}
                onChange={(e) => setToId(e.target.value)}
                className={`mt-1.5 flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 font-normal text-sm text-zinc-900 ${FOCUS_RING}`}
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block" htmlFor="nr-priority">
              <span className="font-medium text-xs uppercase tracking-[0.06em] text-zinc-500">If priority is</span>
              <select
                id="nr-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className={`mt-1.5 flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 font-normal text-sm text-zinc-900 ${FOCUS_RING}`}
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
              </select>
            </label>

            {fromId === toId ? <p className="mt-2 font-normal text-xs text-rose-700">A rule needs two different departments.</p> : null}

            <button
              type="submit"
              disabled={fromId === toId}
              className={`mt-4 flex h-10 w-full items-center justify-center rounded-md bg-rose-600 px-3 font-medium text-sm text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400 ${FOCUS_RING}`}
            >
              Save rule
            </button>
          </form>

          <div className="mt-6 border-t border-zinc-200 pt-4">
            <p className="font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">Active rules ({rules.length})</p>
            <ul className="mt-2 flex flex-col gap-2">
              {rules.map((rule) => (
                <li key={rule.id} className="flex items-center justify-between gap-2 rounded-lg border border-zinc-200 px-3 py-2">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span className="truncate font-medium text-sm text-zinc-900">{DEPARTMENT_BY_ID[rule.fromId].short}</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden="true" />
                    <span className="truncate font-medium text-sm text-zinc-900">{DEPARTMENT_BY_ID[rule.toId].short}</span>
                  </div>
                  <PriorityBadge priority={rule.priority} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-zinc-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className={`flex h-10 items-center rounded-md border border-zinc-200 px-3 font-medium text-sm text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
