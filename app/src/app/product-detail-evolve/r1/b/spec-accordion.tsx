"use client";

import { useState } from "react";
import { ChevronDown, Cpu, Cable, Box, Package } from "lucide-react";
import { SPEC_SECTIONS, FOCUS, cx } from "./data";

const SECTION_ICONS: Record<string, typeof Cpu> = {
  preamps: Cpu,
  io: Cable,
  build: Box,
  box: Package,
};

/** Expandable spec sections. The first section starts open so the page's deepest proof (measured
 * preamp specs) is one glance away, not hidden behind a click — the rest stay collapsed to keep
 * the datasheet scannable. Each header is a real <button> with aria-expanded/aria-controls. */
export default function SpecAccordion() {
  const [open, setOpen] = useState<Set<string>>(new Set([SPEC_SECTIONS[0].id]));

  function toggle(id: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white">
      {SPEC_SECTIONS.map((section) => {
        const isOpen = open.has(section.id);
        const Icon = SECTION_ICONS[section.id] ?? Cpu;
        return (
          <div key={section.id}>
            <h3 className="m-0">
              <button
                type="button"
                onClick={() => toggle(section.id)}
                aria-expanded={isOpen}
                aria-controls={`spec-panel-${section.id}`}
                id={`spec-header-${section.id}`}
                className={cx(
                  "flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-zinc-50",
                  FOCUS,
                )}
              >
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-orange-50">
                  <Icon className="h-4.5 w-4.5 text-orange-700" aria-hidden="true" />
                </span>
                <span className="flex-1 text-base font-medium text-zinc-900">{section.title}</span>
                <ChevronDown
                  className={cx(
                    "h-4.5 w-4.5 flex-none text-zinc-600 transition-transform duration-200 motion-reduce:transition-none",
                    isOpen && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={`spec-panel-${section.id}`}
              role="region"
              aria-labelledby={`spec-header-${section.id}`}
              hidden={!isOpen}
              className="px-5 pb-5"
            >
              <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {section.items.map((item) => (
                  <div key={item.label} className="flex items-baseline justify-between gap-4 border-b border-dashed border-zinc-200 pb-2 sm:justify-start">
                    <dt className="text-sm font-normal text-zinc-600">{item.label}</dt>
                    <dd className="m-0 text-right text-sm font-medium text-zinc-900 sm:ml-auto sm:text-left">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        );
      })}
    </div>
  );
}
