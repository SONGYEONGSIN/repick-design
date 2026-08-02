"use client";

import { useEffect, useRef, useState } from "react";
import { SECTIONS, FOCUS, cx, usd } from "./data";

/** Desktop-only scroll-spy rail. An IntersectionObserver — not a scroll-position calculation —
 * tracks which section owns the largest visible share of the viewport and highlights that entry;
 * clicking any entry is a plain in-page anchor, so it also works with JS disabled or before
 * hydration. The price echoed at the bottom is read from the same state the hero uses, so the two
 * numbers can never drift apart. */
export default function SectionNav({ price }: { price: number }) {
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  const ratios = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const elements = SECTIONS.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => Boolean(el));
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.current.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let bestId: string = SECTIONS[0].id;
        let bestRatio = 0;
        for (const [id, ratio] of ratios.current) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestRatio > 0) setActive(bestId);
      },
      { rootMargin: "-96px 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Page sections" className="sticky top-24 hidden w-56 flex-none lg:block">
      <ul role="list" className="flex flex-col gap-0.5 border-l border-zinc-200 pl-4">
        {SECTIONS.map((section) => {
          const isActive = active === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cx(
                  "-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors",
                  isActive ? "border-orange-700 font-medium text-orange-700" : "border-transparent font-normal text-zinc-600 hover:text-zinc-900",
                  FOCUS,
                )}
              >
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4">
        <p className="text-xs font-normal text-zinc-600">From</p>
        <p className="text-2xl font-semibold tracking-tight text-zinc-900 tabular-nums">{usd(price)}</p>
        <a
          href="#overview"
          className={cx(
            "mt-3 flex w-full items-center justify-center rounded-lg bg-orange-700 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-800",
            FOCUS,
          )}
        >
          Jump to purchase
        </a>
      </div>
    </nav>
  );
}
