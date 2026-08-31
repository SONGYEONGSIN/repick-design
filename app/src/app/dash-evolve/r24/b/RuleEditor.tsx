"use client";

import { useState } from "react";
import { Plus, Trash2, Info } from "lucide-react";
import { ATTRIBUTE_OPTIONS, OPERATOR_OPTIONS, type FlagRecord, type Rule } from "./data";

let nextRuleSeq = 1;

function RuleRow({
  rule,
  onChange,
  onRemove,
}: {
  rule: Rule;
  onChange: (next: Rule) => void;
  onRemove: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-orange-400/25 bg-orange-400/[0.06] px-3 py-2.5">
        <p className="text-sm text-orange-200">Remove this targeting rule?</p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-zinc-300 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded-md bg-orange-400/90 px-2.5 py-1 text-xs font-medium text-zinc-950 hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
          >
            Confirm remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
      <label className="min-w-0">
        <span className="mb-1 block text-[11px] uppercase tracking-wide text-zinc-400">Attribute</span>
        <select
          value={rule.attribute}
          onChange={(e) => onChange({ ...rule, attribute: e.target.value })}
          className="h-9 w-full rounded-md border border-white/10 bg-zinc-950 px-2 text-xs text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        >
          {ATTRIBUTE_OPTIONS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </label>
      <label className="min-w-0">
        <span className="mb-1 block text-[11px] uppercase tracking-wide text-zinc-400">Operator</span>
        <select
          value={rule.operator}
          onChange={(e) => onChange({ ...rule, operator: e.target.value })}
          className="h-9 w-full rounded-md border border-white/10 bg-zinc-950 px-2 text-xs text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        >
          {OPERATOR_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </label>
      <label className="min-w-0">
        <span className="mb-1 block text-[11px] uppercase tracking-wide text-zinc-400">Value</span>
        <input
          type="text"
          value={rule.value}
          onChange={(e) => onChange({ ...rule, value: e.target.value })}
          placeholder="e.g. Enterprise"
          className="h-9 w-full rounded-md border border-white/10 bg-zinc-950 px-2 text-xs text-zinc-100 placeholder:text-zinc-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        />
      </label>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label="Remove rule"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 text-zinc-400 hover:border-orange-400/30 hover:text-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export default function RuleEditor({ flag }: { flag: FlagRecord }) {
  const [rules, setRules] = useState<Rule[]>(flag.rules);
  const [tab, setTab] = useState<"rules" | "activity">("rules");

  function addRule() {
    nextRuleSeq += 1;
    setRules((r) => [...r, { id: `new-${nextRuleSeq}`, attribute: ATTRIBUTE_OPTIONS[0], operator: OPERATOR_OPTIONS[0], value: "" }]);
  }

  function onTabKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      setTab((t) => (t === "rules" ? "activity" : "rules"));
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col border-t border-white/10">
      <div role="tablist" aria-label="Flag detail" className="flex gap-1 border-b border-white/10 px-3 pt-2.5" onKeyDown={onTabKeyDown}>
        <button
          type="button"
          role="tab"
          id="tab-rules"
          aria-selected={tab === "rules"}
          aria-controls="panel-rules"
          tabIndex={tab === "rules" ? 0 : -1}
          onClick={() => setTab("rules")}
          className={`rounded-t-md px-3 py-1.5 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
            tab === "rules" ? "border-b-2 border-sky-400 text-zinc-50" : "border-b-2 border-transparent text-zinc-400 hover:text-zinc-300"
          }`}
        >
          Targeting rules
        </button>
        <button
          type="button"
          role="tab"
          id="tab-activity"
          aria-selected={tab === "activity"}
          aria-controls="panel-activity"
          tabIndex={tab === "activity" ? 0 : -1}
          onClick={() => setTab("activity")}
          className={`rounded-t-md px-3 py-1.5 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
            tab === "activity" ? "border-b-2 border-sky-400 text-zinc-50" : "border-b-2 border-transparent text-zinc-400 hover:text-zinc-300"
          }`}
        >
          Activity
        </button>
      </div>

      {tab === "rules" ? (
        <div id="panel-rules" role="tabpanel" aria-labelledby="tab-rules" tabIndex={0} className="min-h-0 flex-1 overflow-y-auto p-3">
          <p className="mb-3 text-xs text-zinc-400">
            Users must match every rule below to be eligible for this flag&rsquo;s rollout percentage.
          </p>
          {rules.length === 0 ? (
            <div className="rounded-lg border border-dashed border-white/15 px-4 py-6 text-center">
              <Info className="mx-auto mb-2 size-4 text-zinc-400" aria-hidden="true" />
              <p className="text-sm text-zinc-400">No targeting rules yet.</p>
              <p className="mt-0.5 text-xs text-zinc-400">Everyone in the rollout percentage is eligible. Add a rule to scope this flag.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {rules.map((rule) => (
                <RuleRow
                  key={rule.id}
                  rule={rule}
                  onChange={(next) => setRules((rs) => rs.map((r) => (r.id === rule.id ? next : r)))}
                  onRemove={() => setRules((rs) => rs.filter((r) => r.id !== rule.id))}
                />
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={addRule}
            className="mt-3 flex items-center gap-1.5 rounded-lg border border-dashed border-white/15 px-3 py-2 text-xs font-medium text-zinc-300 hover:border-sky-400/40 hover:text-sky-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            <Plus className="size-3.5" aria-hidden="true" /> Add rule
          </button>
        </div>
      ) : (
        <div id="panel-activity" role="tabpanel" aria-labelledby="tab-activity" tabIndex={0} className="min-h-0 flex-1 overflow-y-auto p-3">
          <ul className="space-y-3">
            {flag.activity.map((entry) => (
              <li key={entry.id} className="border-l-2 border-white/10 pl-3">
                <p className="text-sm text-zinc-200">{entry.text}</p>
                <p className="mt-0.5 text-xs text-zinc-400">
                  {entry.date} · {entry.actor}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
