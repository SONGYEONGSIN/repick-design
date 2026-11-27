"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { GeneratedCopy as GeneratedCopyType } from "./data";
import { usePrefersReducedMotion } from "./hooks";

type Segment = { text: string; keywordId: string | null };

/** Splits the paragraph into plain-text / keyword-phrase segments by locating each keyword's
 *  exact substring once, left to right. Pure string work — no regex backtracking surprises, no
 *  overlap handling needed because every phrase in data.ts was written to appear exactly once. */
function splitIntoSegments(paragraph: string, keywords: GeneratedCopyType["keywords"]): Segment[] {
  const matches = keywords
    .map((k) => ({ id: k.id, start: paragraph.indexOf(k.phrase), phrase: k.phrase }))
    .filter((m) => m.start !== -1)
    .sort((a, b) => a.start - b.start);

  const segments: Segment[] = [];
  let cursor = 0;
  for (const m of matches) {
    if (m.start < cursor) continue; // guard against any accidental overlap
    if (m.start > cursor) segments.push({ text: paragraph.slice(cursor, m.start), keywordId: null });
    segments.push({ text: paragraph.slice(m.start, m.start + m.phrase.length), keywordId: m.id });
    cursor = m.start + m.phrase.length;
  }
  if (cursor < paragraph.length) segments.push({ text: paragraph.slice(cursor), keywordId: null });
  return segments;
}

export function GeneratedCopy({
  copy,
  swapKey,
}: {
  copy: GeneratedCopyType;
  /** Changing this key is what tells the crossfade a *new* paragraph has arrived. */
  swapKey: string;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const markRefs = useRef(new Map<string, HTMLElement | null>());

  const segments = useMemo(() => splitIntoSegments(copy.paragraph, copy.keywords), [copy]);
  const highlightId = hoverId ?? activeId;

  function handleChipClick(id: string, label: string) {
    const nextActive = activeId === id ? null : id;
    setActiveId(nextActive);
    if (nextActive) {
      setAnnouncement(`Highlighted in the listing: ${label}`);
      const node = markRefs.current.get(id);
      node?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "center",
      });
    } else {
      setAnnouncement("");
    }
  }

  return (
    <div>
      <div
        aria-hidden="true"
        className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#0f766e]"
      >
        <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
        Generated listing
      </div>

      <div className="min-h-[2.75em]" aria-live="off">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={`${swapKey}-tagline`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
            className="font-[family-name:var(--font-display-mono)] text-xl font-semibold leading-snug text-[#0f766e] sm:text-2xl"
          >
            {copy.tagline}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="relative mt-3 max-w-[480px] min-h-[7.5em]" aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={swapKey}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-base leading-[1.6] text-zinc-800"
          >
            {segments.map((seg, i) => {
              if (!seg.keywordId) return <span key={i}>{seg.text}</span>;
              const isHighlighted = seg.keywordId === highlightId;
              return (
                <mark
                  key={i}
                  ref={(node) => {
                    markRefs.current.set(seg.keywordId as string, node);
                  }}
                  tabIndex={-1}
                  className={
                    "rounded-sm px-0.5 bg-transparent text-zinc-800 transition-colors " +
                    (isHighlighted
                      ? "bg-[#0d9488]/20 font-semibold underline decoration-[#0f766e] decoration-2 underline-offset-2"
                      : "")
                  }
                >
                  {seg.text}
                </mark>
              );
            })}
          </motion.p>
        </AnimatePresence>
      </div>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Selling points extracted from this listing">
        {copy.keywords.map((kw) => {
          const isActive = kw.id === activeId;
          return (
            <li key={kw.id} className="list-none">
              <button
                type="button"
                aria-pressed={isActive}
                onMouseEnter={() => setHoverId(kw.id)}
                onMouseLeave={() => setHoverId(null)}
                onFocus={() => setHoverId(kw.id)}
                onBlur={() => setHoverId(null)}
                onClick={() => handleChipClick(kw.id, kw.label)}
                className={
                  "rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e] " +
                  (isActive
                    ? "border-[#0f766e] bg-[#0f766e] text-white"
                    : "border-zinc-300 bg-white text-zinc-700 hover:border-[#0f766e] hover:text-[#0f766e]")
                }
              >
                {kw.label}
              </button>
            </li>
          );
        })}
      </ul>

      <p className="sr-only" role="status">
        {announcement}
      </p>
    </div>
  );
}
