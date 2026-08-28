"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { CATEGORY_META, visibleCorrections, type Category } from "./data";

/**
 * "Why we corrected this" — a disclosure list of the corrections currently in view, derived from
 * the same active-category set as the redline paragraph. A second proof surface the category
 * filter recomputes: turning a category off removes its row here as well as its markup above.
 */
export default function EvidenceList({ active }: { active: ReadonlySet<Category> }) {
  const corrections = visibleCorrections(active);
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(new Set());
  const baseId = useId();

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  if (corrections.length === 0) {
    return (
      <p className="mt-4 rounded-lg border border-dashed border-zinc-200 px-3 py-3 text-[13px] text-zinc-500">
        No categories selected — turn on a filter above to see repick&apos;s evidence for this
        listing.
      </p>
    );
  }

  return (
    <ul className="mt-4 divide-y divide-zinc-100 rounded-lg border border-zinc-200">
      {corrections.map((correction) => {
        const meta = CATEGORY_META[correction.category];
        const Icon = meta.icon;
        const panelId = `${baseId}-${correction.id}`;
        const open = openIds.has(correction.id);
        return (
          <li key={correction.id}>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => toggle(correction.id)}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13px] font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0369a1]"
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-[#0369a1]" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate">{meta.label} evidence</span>
              <ChevronDown
                className={`h-3.5 w-3.5 shrink-0 text-zinc-500 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none"
              style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
              aria-hidden={!open}
            >
              <div className="overflow-hidden">
                <p
                  id={panelId}
                  className="px-3 pb-3 text-[13px] leading-[1.6] text-zinc-600"
                >
                  {correction.reason}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
