"use client";

import { useState } from "react";
import { Building2, ChevronDown, Globe } from "lucide-react";
import AvatarMonogram from "./avatar-monogram";
import {
  FOCUS_RING,
  FUNCTION_NODES,
  PEOPLE,
  REGION_NODES,
  peopleFor,
  type GroupKey,
} from "./data";

/**
 * First + second wired interaction, combined in one hierarchical view:
 *
 * 1. Regroup toggle — a two-option segmented control (real <button> pair, aria-pressed, not a
 *    native <select>) that re-slices the same 12 people by function or by region. Switching it
 *    swaps which four nodes exist and which people sit under which node — the tree is rebuilt
 *    from the same PEOPLE array, not a second copy of the data.
 * 2. Node expand/collapse — each node is a real <button> with aria-expanded + aria-controls
 *    driving a native `hidden` attribute on its panel (no CSS-only hiding), laid out as an actual
 *    tree (a shared trunk line with a horizontal tick to each node) rather than a flat
 *    divide-y list, so collapsing/expanding reads as opening a branch, not toggling a row.
 *
 * Reset on regroup: switching function/region collapses back to "first node open" rather than
 * carrying over ids that may not exist in the new grouping (function ids and region ids are
 * disjoint strings) — deterministic, not empty-by-default.
 */
export default function OrgBreakdown() {
  const [group, setGroup] = useState<GroupKey>("function");
  const nodes = group === "function" ? FUNCTION_NODES : REGION_NODES;
  const [openId, setOpenId] = useState<string>(FUNCTION_NODES[0].id);

  function switchGroup(next: GroupKey) {
    if (next === group) return;
    setGroup(next);
    setOpenId(next === "function" ? FUNCTION_NODES[0].id : REGION_NODES[0].id);
  }

  return (
    <div>
      <div role="group" aria-label="Group the team by" className="inline-flex rounded-full border border-zinc-800 p-1">
        <button
          type="button"
          aria-pressed={group === "function"}
          onClick={() => switchGroup("function")}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm ${FOCUS_RING} ${
            group === "function" ? "bg-blue-400 font-semibold text-zinc-950" : "font-normal text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Building2 aria-hidden="true" className="h-3.5 w-3.5" />
          By function
        </button>
        <button
          type="button"
          aria-pressed={group === "region"}
          onClick={() => switchGroup("region")}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm ${FOCUS_RING} ${
            group === "region" ? "bg-blue-400 font-semibold text-zinc-950" : "font-normal text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Globe aria-hidden="true" className="h-3.5 w-3.5" />
          By region
        </button>
      </div>

      <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-4 sm:px-6">
        <span className="text-sm font-semibold tracking-tight text-zinc-50">Ordinal</span>
        <span className="ml-2 text-sm font-normal tabular-nums text-zinc-400">
          {PEOPLE.length} people &middot; {nodes.length} {group === "function" ? "functions" : "regions"}
        </span>
      </div>

      <ul className="relative mt-2 ml-4 border-l border-zinc-800 pl-6 sm:ml-6">
        {nodes.map((node) => {
          const members = peopleFor(group, node.id);
          const isOpen = openId === node.id;
          const panelId = `node-panel-${group}-${node.id}`;
          return (
            <li key={node.id} className="relative py-3">
              <span aria-hidden="true" className="absolute -left-6 top-8 h-px w-6 bg-zinc-800" />
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? "" : node.id)}
                className={`flex w-full items-start justify-between gap-4 rounded-lg px-3 py-3 text-left hover:bg-zinc-900/60 ${FOCUS_RING}`}
              >
                <span>
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-base font-semibold text-zinc-50">{node.label}</span>
                    <span className="text-sm font-normal tabular-nums text-zinc-400">{members.length} people</span>
                  </span>
                  <span className="mt-1 block max-w-xl text-sm font-normal leading-relaxed text-zinc-400">{node.blurb}</span>
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={`mt-1.5 h-5 w-5 flex-none text-zinc-500 transition-transform motion-reduce:transition-none ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div id={panelId} hidden={!isOpen} className="px-3 pb-2 pt-2">
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {members.map((m) => (
                    <li
                      key={m.name}
                      className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3"
                    >
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
    </div>
  );
}
