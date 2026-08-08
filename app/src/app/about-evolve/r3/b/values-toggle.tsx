"use client";

import { useState } from "react";
import { Hammer, ShieldOff } from "lucide-react";
import { FOCUS_RING, VALUE_PAIRS } from "./data";

type Mode = "buildFor" | "pushBackOn";

/**
 * Second wired interaction: a paired-comparison toggle, not an accordion or ARIA tablist. One
 * segmented control switches all four value cards at once between "what we build for" and "what
 * we push back on" framing — the copy genuinely differs per position (not a relabeled header), so
 * the toggle changes real content. Mode is also stated in visible text on every card (not color
 * alone) for the color-blind / no-color-vision reading.
 */
export default function ValuesToggle() {
  const [mode, setMode] = useState<Mode>("buildFor");
  const isBuildFor = mode === "buildFor";

  return (
    <div>
      <div role="group" aria-label="Show values as" className="inline-flex rounded-full border border-zinc-200 bg-zinc-100 p-1">
        <button
          type="button"
          onClick={() => setMode("buildFor")}
          aria-pressed={isBuildFor}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
            isBuildFor ? "bg-white text-emerald-800 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <Hammer aria-hidden="true" className="h-4 w-4" />
          What we build for
        </button>
        <button
          type="button"
          onClick={() => setMode("pushBackOn")}
          aria-pressed={!isBuildFor}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
            !isBuildFor ? "bg-white text-emerald-800 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <ShieldOff aria-hidden="true" className="h-4 w-4" />
          What we push back on
        </button>
      </div>

      <ul aria-live="polite" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {VALUE_PAIRS.map((pair) => {
          const entry = isBuildFor ? pair.buildFor : pair.pushBackOn;
          return (
            <li
              key={pair.id}
              className={`min-w-0 rounded-2xl border p-5 ${
                isBuildFor ? "border-emerald-200 bg-emerald-50/60" : "border-zinc-200 bg-zinc-50"
              }`}
            >
              <p
                className={`text-xs font-medium uppercase tracking-[0.12em] ${
                  isBuildFor ? "text-emerald-700" : "text-zinc-600"
                }`}
              >
                {isBuildFor ? "We build for" : "We push back on"}
              </p>
              <h3 className="mt-2 text-lg font-semibold leading-snug text-zinc-900">{entry.title}</h3>
              <p className="mt-2 text-sm font-normal leading-relaxed text-zinc-600">{entry.body}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
