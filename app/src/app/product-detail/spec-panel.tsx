"use client";

import { useState } from "react";
import { ChevronDown, Gauge, Box, Cable, ClipboardCheck } from "lucide-react";
import { STATIC_SPEC_SECTIONS, FOCUS, cx, type Grade, type SwitchOption, type SpecSection } from "./data";

const SECTION_ICONS: Record<string, typeof Gauge> = {
  switches: Gauge,
  deck: Box,
  connectivity: Cable,
  grading: ClipboardCheck,
};

/** Full spec sheet as an accordion of `<dl>` groups — the "switches" group is built from the live
 * selection and starts open, so the deepest proof point (measured actuation force and sound level
 * for the switch actually chosen) is visible without a click. Every `<dl>` keeps a flat
 * `dl > div > (dt, dd)` structure with no icon inside the group, matching the fix for the
 * axe definition-list/dlitem regression logged against round 1. */
export default function SpecPanel({ sw, grade }: { sw: SwitchOption; grade: Grade }) {
  const sections: SpecSection[] = [
    {
      id: "switches",
      title: "Switches & feel",
      items: [
        { label: "Selected switch", value: sw.label },
        { label: "Actuation force", value: `${sw.actuationG} gf` },
        { label: "Sound level", value: `${sw.soundDb} dB — ${sw.soundDesc}` },
        { label: "Travel distance", value: `${sw.travelMm.toFixed(1)} mm` },
        { label: "Rated lifecycle", value: sw.lifecycle },
        { label: "Stabilizers", value: "Screw-in, factory-lubed" },
      ],
    },
    ...STATIC_SPEC_SECTIONS,
    {
      id: "grading",
      title: "Condition & fulfillment",
      items: [
        { label: "Grade", value: grade.label },
        { label: "Cosmetic notes", value: grade.condition },
        { label: "Warranty", value: grade.warranty },
        { label: "Ships", value: grade.shipsIn },
      ],
    },
  ];

  const [open, setOpen] = useState<Set<string>>(new Set(["switches"]));

  function toggle(id: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section
      id="specs"
      aria-labelledby="specs-heading"
      className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
    >
      <h2 id="specs-heading" className="text-base font-semibold tracking-tight text-slate-900">
        Specifications
      </h2>
      <p className="mt-2 text-sm font-normal text-slate-600">
        Switches &amp; feel opens by default and tracks your configuration above — expand the rest as
        needed.
      </p>

      <div className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200">
        {sections.map((section) => {
          const isOpen = open.has(section.id);
          const Icon = SECTION_ICONS[section.id] ?? Gauge;
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
                    "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-slate-50",
                    FOCUS,
                  )}
                >
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-sky-50">
                    <Icon className="h-4 w-4 text-sky-700" aria-hidden="true" />
                  </span>
                  <span className="flex-1 text-sm font-medium text-slate-900">{section.title}</span>
                  <ChevronDown
                    className={cx(
                      "h-4 w-4 flex-none text-slate-600 transition-transform duration-200 motion-reduce:transition-none",
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
                className="px-4 pb-4"
              >
                <dl className="grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {section.items.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-baseline justify-between gap-4 border-b border-dashed border-slate-200 pb-2 sm:justify-start"
                    >
                      <dt className="text-sm font-normal text-slate-600">{item.label}</dt>
                      <dd className="m-0 text-right text-sm font-medium text-slate-900 sm:ml-auto sm:text-left">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
