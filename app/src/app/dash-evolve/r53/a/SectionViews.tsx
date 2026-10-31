"use client";

import { useState } from "react";
import { CreditCard, Landmark, Banknote, Smartphone, Building2, Globe, Clock, Users } from "lucide-react";
import { Card, CardHeader, Switch, TierBadge } from "./ui";
import {
  CHANNEL_BREAKDOWN,
  CHANNEL_LABELS,
  DAILY_VOLUME,
  INITIAL_RULES,
  type Channel,
  type DetectionRule,
} from "./data";

const CHANNEL_ICON: Record<Channel, typeof CreditCard> = {
  card: CreditCard,
  ach: Landmark,
  wire: Banknote,
  p2p: Smartphone,
};

export function QueuesView() {
  const max = Math.max(...CHANNEL_BREAKDOWN.map((c) => c.total));
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {CHANNEL_BREAKDOWN.map((c) => {
        const Icon = CHANNEL_ICON[c.channel];
        return (
          <Card key={c.channel} className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300">
                <Icon size={15} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-zinc-50">{CHANNEL_LABELS[c.channel]}</p>
                <p className="text-[11px] text-zinc-400">{c.total} signals, last 14 days</p>
              </div>
            </div>
            <div className="mt-4 flex h-20 items-end gap-2">
              {(["high", "medium", "low"] as const).map((tier) => {
                const value = c[tier];
                return (
                  <div key={tier} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                    <span className="text-[11px] font-medium tabular-nums text-zinc-300">{value}</span>
                    <div
                      className={`w-full rounded-sm ${
                        tier === "high" ? "bg-red-500/70" : tier === "medium" ? "bg-amber-500/60" : "bg-zinc-600"
                      }`}
                      style={{ height: `${max > 0 ? Math.max((value / max) * 100, 4) : 4}%` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex justify-center gap-4 text-[10px] text-zinc-400">
              <span>High</span>
              <span>Med</span>
              <span>Low</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export function RulesView() {
  const [rules, setRules] = useState<DetectionRule[]>(INITIAL_RULES);

  function toggle(id: string) {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
  }

  return (
    <Card>
      <CardHeader title="Detection rules" subtitle={`${rules.filter((r) => r.active).length} of ${rules.length} active`} />
      <ul className="divide-y divide-white/5">
        {rules.map((rule) => (
          <li key={rule.id} className="flex items-start justify-between gap-4 py-3.5">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-zinc-100">{rule.name}</p>
                <TierBadge tier={rule.tier} />
              </div>
              <p className="mt-1 text-xs text-zinc-400">{rule.description}</p>
            </div>
            <Switch checked={rule.active} onChange={() => toggle(rule.id)} label={`Toggle ${rule.name}`} />
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function ReportsView() {
  return (
    <Card>
      <CardHeader title="Daily signal totals" subtitle="Full 14-day window, by severity" />
      <table className="w-full table-fixed">
        <caption className="sr-only relative">Daily signal totals by severity over the last 14 days.</caption>
        <colgroup>
          <col style={{ width: "32%" }} />
          <col style={{ width: "17%" }} />
          <col style={{ width: "17%" }} />
          <col style={{ width: "17%" }} />
          <col style={{ width: "17%" }} />
        </colgroup>
        <thead>
          <tr className="border-b border-white/10 text-left">
            <th scope="col" className="px-2 py-2 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
              Day
            </th>
            <th scope="col" className="px-2 py-2 text-right text-[11px] font-medium uppercase tracking-wide text-zinc-400">
              Total
            </th>
            <th scope="col" className="px-2 py-2 text-right text-[11px] font-medium uppercase tracking-wide text-zinc-400">
              High
            </th>
            <th scope="col" className="px-2 py-2 text-right text-[11px] font-medium uppercase tracking-wide text-zinc-400">
              Med
            </th>
            <th scope="col" className="px-2 py-2 text-right text-[11px] font-medium uppercase tracking-wide text-zinc-400">
              Low
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {DAILY_VOLUME.map((d) => (
            <tr key={d.day}>
              <td className="whitespace-nowrap px-2 py-2 text-xs text-zinc-200">{d.label}</td>
              <td className="px-2 py-2 text-right text-xs font-medium tabular-nums text-zinc-100">{d.total}</td>
              <td className="px-2 py-2 text-right text-xs tabular-nums text-red-400">{d.high}</td>
              <td className="px-2 py-2 text-right text-xs tabular-nums text-amber-400">{d.medium}</td>
              <td className="px-2 py-2 text-right text-xs tabular-nums text-zinc-400">{d.low}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

export function SettingsView() {
  const rows = [
    { icon: Building2, label: "Workspace", value: "Northfield Bank — Retail" },
    { icon: Globe, label: "Region", value: "US-East" },
    { icon: Clock, label: "Timezone", value: "America/New_York (UTC-04:00)" },
    { icon: Users, label: "Members", value: "14 analysts, 3 admins" },
  ];
  return (
    <Card>
      <CardHeader title="Workspace settings" subtitle="Read-only in this preview" />
      <dl className="divide-y divide-white/5">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div key={row.label} className="flex items-center justify-between gap-4 py-3">
              <dt className="flex items-center gap-2 text-xs text-zinc-400">
                <Icon size={14} aria-hidden="true" />
                {row.label}
              </dt>
              <dd className="truncate text-xs font-medium text-zinc-100">{row.value}</dd>
            </div>
          );
        })}
      </dl>
    </Card>
  );
}
