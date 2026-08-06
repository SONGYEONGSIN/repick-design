"use client";

import { useEffect, useState } from "react";
import { FOCUS_RING } from "./data";

const SECTIONS = [
  { id: "mission", label: "Mission" },
  { id: "letter", label: "Letter" },
  { id: "timeline", label: "Timeline" },
  { id: "values", label: "Values" },
  { id: "team", label: "Team" },
  { id: "careers", label: "Careers" },
] as const;

/**
 * Third wired interaction: tracks which section is in view via IntersectionObserver and highlights
 * the matching nav link with aria-current, a border, and a weight change (never color alone).
 */
export default function ScrollSpyNav() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const elements = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topmost = visible.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b,
        );
        setActive(topmost.target.id);
      },
      { rootMargin: "-10% 0px -75% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Page sections"
      className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85"
    >
      <ul className="mx-auto flex max-w-5xl flex-wrap gap-x-1 gap-y-0 px-4 sm:px-6">
        {SECTIONS.map((section) => {
          const isActive = active === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`inline-block border-b-2 px-2.5 py-3 text-sm transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                  isActive
                    ? "border-amber-700 font-semibold text-zinc-900"
                    : "border-transparent font-normal text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
                }`}
              >
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
