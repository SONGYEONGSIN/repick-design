"use client";

import { useId } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { QUICK_FILTERS } from "./data";
import { ACCENT_BG, ACCENT_TEXT_ON_FILL, FOCUS, MUTED_TEXT, PANEL_BORDER } from "./tokens";
import { useMounted } from "./useMounted";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  resultsId: string;
}

/**
 * The input mechanic itself: a plain labelled text field (never a hidden-label
 * icon-only control — the label is always visibly present, so there's no
 * button-name/label collapse at any width) plus four tap-to-fill quick-filter
 * chips. Both write to the SAME `query` state the parent owns, so typing and
 * tapping a chip run through the identical filterAndRank path — there's exactly
 * one source of truth for "what the visitor searched."
 *
 * `aria-controls={resultsId}` on the input points screen readers at the live
 * region the parent renders the match count + result rows into.
 */
export default function SearchBar({ query, onQueryChange, resultsId }: SearchBarProps) {
  const inputId = useId();
  const mounted = useMounted();
  const reduceMotion = usePrefersReducedMotion();
  const animateChips = mounted && !reduceMotion;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#BCA7F3]"
      >
        Search comparable listings
      </label>
      <div
        className={`mt-2 flex items-center gap-2 rounded-xl border ${PANEL_BORDER} bg-[#15141C] px-3.5 py-2.5`}
      >
        <Search className="h-4 w-4 shrink-0 text-[#A1A1AA]" aria-hidden="true" />
        <input
          id={inputId}
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Try “camera”, “Rolex”, or “Nike”"
          aria-controls={resultsId}
          className={`min-w-0 flex-1 bg-transparent text-[15px] font-normal leading-none text-white placeholder:text-[#A1A1AA] ${FOCUS} rounded-md`}
        />
      </div>

      <div role="group" aria-label="Quick search filters" className="mt-3 flex flex-wrap gap-2">
        {QUICK_FILTERS.map((filter) => {
          const active = query.trim().toLowerCase() === filter.query;
          return (
            <motion.button
              key={filter.id}
              type="button"
              aria-pressed={active}
              onClick={() => onQueryChange(filter.query)}
              className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${FOCUS} ${
                active
                  ? `${ACCENT_BG} border-transparent ${ACCENT_TEXT_ON_FILL}`
                  : `border-[#28262F] bg-transparent text-white hover:border-[#7C4FE0]`
              }`}
              whileHover={animateChips ? { scale: 1.04 } : undefined}
              whileTap={animateChips ? { scale: 0.97 } : undefined}
            >
              {filter.label}
            </motion.button>
          );
        })}
      </div>
      {/* 12px -> 0.44 * 12 = 5.28px/char -> max-w-[370px] -> 370 / 5.28 ≈ 70.1 chars/line. */}
      <p className={`mt-2 max-w-[370px] text-[12px] font-normal leading-[1.4] ${MUTED_TEXT}`}>
        Matches update as you type — every result below is a real listing from our
        fixed comp set, scored live against what you entered.
      </p>
    </div>
  );
}
