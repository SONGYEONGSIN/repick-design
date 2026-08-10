"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CircleDot, SendHorizonal, Wrench } from "lucide-react";

import { STUCK } from "./data";

const DISPLAY = { fontFamily: "var(--font-display-grotesk)" } as const;

export function WaitingQueue() {
  const [selected, setSelected] = useState<string[]>([]);
  const [queued, setQueued] = useState<string[]>([]);

  const pending = useMemo(() => STUCK.filter((item) => !queued.includes(item.id)), [queued]);
  const picked = useMemo(
    () => pending.filter((item) => selected.includes(item.id)),
    [pending, selected],
  );
  const toHubspot = picked.filter((item) => item.target === "HubSpot").length;
  const toKestrel = picked.filter((item) => item.target === "Kestrel").length;

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handBack() {
    if (picked.length === 0) return;
    const ids = picked.map((item) => item.id);
    setQueued((prev) => [...prev, ...ids]);
    setSelected([]);
  }

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-zinc-800">
      <ul className="divide-y divide-zinc-800">
        {STUCK.map((item) => {
          const isQueued = queued.includes(item.id);
          const isSelected = selected.includes(item.id);

          return (
            <li
              key={item.id}
              className={`min-w-0 px-4 py-4 sm:px-5 ${
                isSelected ? "bg-orange-400/5" : "bg-zinc-900/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id={`stuck-${item.id}`}
                  checked={isSelected}
                  disabled={isQueued}
                  onChange={() => toggle(item.id)}
                  className="mt-1 size-4 shrink-0 accent-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:opacity-40"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <label
                      htmlFor={`stuck-${item.id}`}
                      className={`text-sm font-semibold ${
                        isQueued ? "text-zinc-400" : "cursor-pointer text-zinc-50"
                      }`}
                      style={DISPLAY}
                    >
                      {item.label}
                    </label>
                    <span className="break-words font-mono text-xs font-normal text-zinc-300">
                      {item.field}
                    </span>
                    <span className="text-xs tabular-nums text-zinc-400">{item.id}</span>
                  </div>

                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">{item.reason}</p>

                  <p className="mt-1.5 flex items-start gap-1.5 text-sm text-zinc-400">
                    <Wrench aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                    {item.fix}
                  </p>

                  <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-2.5 py-0.5 text-xs font-medium text-zinc-200">
                      <SendHorizonal aria-hidden className="size-3.5 text-orange-300" />
                      Releases into {item.target}
                    </span>
                    {isQueued ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-xs font-medium text-emerald-200">
                        <CheckCircle2 aria-hidden className="size-3.5" />
                        Handed to run #4418
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-xs font-medium text-amber-200">
                        <CircleDot aria-hidden className="size-3.5" />
                        Held, will not retry on its own
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 bg-zinc-900 px-4 py-4 sm:px-5">
        <p aria-live="polite" className="text-sm text-zinc-300">
          {picked.length === 0 ? (
            <>
              Nothing picked.{" "}
              <span className="tabular-nums">{pending.length}</span> still held,{" "}
              <span className="tabular-nums">{queued.length}</span> handed back this session.
            </>
          ) : (
            <>
              <span className="font-medium tabular-nums text-zinc-50">{picked.length}</span> picked
              — <span className="tabular-nums">{toHubspot}</span> write into HubSpot,{" "}
              <span className="tabular-nums">{toKestrel}</span> into Kestrel. Run #4418 picks them
              up; anything still wrong at the source comes straight back.
            </>
          )}
        </p>
        <button
          type="button"
          onClick={handBack}
          disabled={picked.length === 0}
          className="inline-flex items-center gap-2 rounded-md bg-orange-400 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-300"
        >
          <SendHorizonal aria-hidden className="size-4" />
          Hand back to run #4418
        </button>
      </div>
    </div>
  );
}
