"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import AvatarMonogram from "./avatar-monogram";
import { FOCUS_RING, PODS } from "./data";

/**
 * First wired interaction: click a pod header to reveal its member roster. Every pod's name,
 * headcount, and one-sentence blurb are rendered unconditionally (the About content contract — a
 * People section must show something real before any click), and the first pod starts expanded so
 * at least one full roster is visible on initial load, not just after interaction. Uses native
 * <button> + aria-expanded + a real hidden attribute on the collapsed panel, the most robust
 * disclosure pattern available (no CSS-only hiding that axe or reduced-motion can disagree with).
 */
export default function OrgPods() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set([PODS[0].id]));

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <ul className="divide-y divide-zinc-800 border-y border-zinc-800">
      {PODS.map((pod) => {
        const isOpen = openIds.has(pod.id);
        const panelId = `pod-panel-${pod.id}`;
        return (
          <li key={pod.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(pod.id)}
              className={`flex w-full items-start justify-between gap-4 py-6 text-left ${FOCUS_RING}`}
            >
              <span>
                <span className="flex items-baseline gap-3">
                  <span className="text-lg font-semibold text-zinc-50">{pod.name}</span>
                  <span className="text-sm font-normal tabular-nums text-zinc-400">{pod.headcount} people</span>
                </span>
                <span className="mt-1.5 block max-w-2xl text-sm font-normal leading-relaxed text-zinc-400">
                  {pod.blurb}
                </span>
              </span>
              <ChevronDown
                aria-hidden="true"
                className={`mt-1 h-5 w-5 flex-none text-zinc-500 transition-transform motion-reduce:transition-none ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div id={panelId} hidden={!isOpen} className="pb-6">
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {pod.members.map((m) => (
                  <li key={m.name} className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
                    <AvatarMonogram initials={m.initials} accent={m.accent} className="h-10 w-10 flex-none" />
                    <span>
                      <span className="block text-sm font-semibold text-zinc-50">{m.name}</span>
                      <span className="block text-sm font-normal text-zinc-400">{m.role}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
