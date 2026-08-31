"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Env, FlagRecord } from "./data";
import { StatusBadge, ProgressBar, Sparkline, OwnerAvatar } from "./ui";

type SortKey = "name" | "rollout" | "status";

export default function FlagList({
  flags,
  env,
  selectedId,
  onSelect,
  resolvePct,
}: {
  flags: FlagRecord[];
  env: Env;
  selectedId: string;
  onSelect: (id: string) => void;
  resolvePct: (flag: FlagRecord) => number;
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = flags.filter(
      (f) => f.name.toLowerCase().includes(q) || f.key.toLowerCase().includes(q)
    );
    const sorted = [...filtered].sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name);
      if (sortKey === "rollout") return resolvePct(b) - resolvePct(a);
      return a.status.localeCompare(b.status);
    });
    return sorted;
  }, [flags, query, sortKey, resolvePct]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-2 border-b border-white/10 p-3">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Filter flags by name or key</span>
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter flags…"
            className="h-9 w-full rounded-lg border border-white/10 bg-white/[0.03] pl-8 pr-2 text-sm text-zinc-100 placeholder:text-zinc-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          />
        </label>
        <label className="shrink-0">
          <span className="sr-only">Sort flags</span>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="h-9 rounded-lg border border-white/10 bg-white/[0.03] px-2 text-xs text-zinc-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            <option value="name">Name A–Z</option>
            <option value="rollout">Rollout % high–low</option>
            <option value="status">Status</option>
          </select>
        </label>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto p-1.5" aria-label="Flags">
        {rows.length === 0 && (
          <li className="px-3 py-8 text-center text-sm text-zinc-400">No flags match &ldquo;{query}&rdquo;.</li>
        )}
        {rows.map((f) => {
          const pct = resolvePct(f);
          const selected = f.id === selectedId;
          return (
            <li key={f.id}>
              <button
                type="button"
                onClick={() => onSelect(f.id)}
                aria-current={selected ? "true" : undefined}
                className={`mb-1 flex w-full flex-col gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                  selected
                    ? "border-sky-400/30 bg-sky-400/[0.08]"
                    : "border-transparent hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-100">{f.name}</p>
                    <p className="truncate font-mono text-[11px] text-zinc-400">{f.key}</p>
                  </div>
                  <StatusBadge status={f.status} />
                </div>
                <div className="flex items-center gap-2.5">
                  <OwnerAvatar name={f.owner.name} seed={f.owner.seed} size={20} />
                  <div className="min-w-0 flex-1">
                    <ProgressBar value={pct} label={`${f.name} rollout in ${env}`} />
                  </div>
                  <span className="w-9 shrink-0 text-right text-xs tabular-nums text-zinc-400">{pct}%</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Prod trend (14d)</span>
                  <Sparkline points={f.trend} />
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
