'use client';

import { useId, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Search } from 'lucide-react';
import { CATEGORY_LABELS, COLORS, type CategoryId, type Item } from './data';
import { filterItems, itemLabel } from './estimate-math';

function categoryLabel(c: CategoryId): string {
  return CATEGORY_LABELS[c];
}

interface SearchComboboxProps {
  initialQuery: string;
  onSelect: (item: Item) => void;
}

/**
 * A custom accessible combobox (not a native <select>) implementing the
 * WAI-ARIA combobox-with-listbox pattern: the input itself carries
 * `role="combobox"`, virtual focus moves through the popup via
 * `aria-activedescendant` while real DOM focus never leaves the input, and
 * the popup list carries `role="listbox"` / `role="option"`. Fully keyboard
 * operable: type to filter, ArrowDown/ArrowUp to move, Enter to select,
 * Escape to close. Matching itself is a plain, deterministic substring
 * check against the fixed ITEMS table in data.ts — no network call.
 */
export default function SearchCombobox({ initialQuery, onSelect }: SearchComboboxProps) {
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listboxId = useId();
  const labelId = useId();

  const results = filterItems(query, categoryLabel);

  function openWithResults(nextQuery: string) {
    const next = filterItems(nextQuery, categoryLabel);
    setOpen(next.length > 0 || nextQuery.trim().length > 0);
    setActiveIndex(next.length > 0 ? 0 : -1);
  }

  function selectItem(item: Item) {
    setQuery(itemLabel(item));
    setOpen(false);
    setActiveIndex(-1);
    onSelect(item);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) {
        openWithResults(query);
        return;
      }
      if (results.length > 0) {
        setActiveIndex((i) => Math.min(i < 0 ? 0 : i + 1, results.length - 1));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length > 0) {
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
    } else if (e.key === 'Enter') {
      if (open && activeIndex >= 0 && results[activeIndex]) {
        e.preventDefault();
        selectItem(results[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      if (open) {
        e.preventDefault();
        setOpen(false);
        setActiveIndex(-1);
      }
    }
  }

  const activeOptionId =
    open && activeIndex >= 0 && results[activeIndex] ? `${listboxId}-option-${results[activeIndex].id}` : undefined;

  return (
    <div className="relative w-full">
      <label id={labelId} htmlFor="instant-estimate-search" className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: COLORS.accentTint }}>
        Search your item
      </label>

      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3.5 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2"
        style={{ backgroundColor: COLORS.bg, border: `1px solid ${COLORS.surfaceLine}`, outlineColor: COLORS.accentTint }}
      >
        <Search className="h-5 w-5 shrink-0" aria-hidden="true" style={{ color: COLORS.muted }} />
        <input
          id="instant-estimate-search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={activeOptionId}
          aria-labelledby={labelId}
          autoComplete="off"
          placeholder="e.g. Nike Dunk, vintage denim jacket, leather bag"
          className="w-full min-w-0 bg-transparent text-[15px] font-normal leading-[1.4] outline-none placeholder-[#A1A1AA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ color: COLORS.fg, outlineColor: COLORS.accentTint }}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            openWithResults(e.target.value);
          }}
          onFocus={() => {
            if (query.trim().length > 0) openWithResults(query);
          }}
          onKeyDown={handleKeyDown}
        />
      </div>

      {open && (
        <div
          className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl"
          style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
        >
          {results.length > 0 ? (
            <ul id={listboxId} role="listbox" aria-label="Matching items" className="max-h-72 overflow-y-auto py-1">
              {results.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <li
                    key={item.id}
                    id={`${listboxId}-option-${item.id}`}
                    role="option"
                    aria-selected={isActive}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectItem(item)}
                    className="flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5"
                    style={{ backgroundColor: isActive ? COLORS.surfaceLine : 'transparent' }}
                  >
                    <span className="text-[14px] font-semibold" style={{ color: COLORS.fg }}>
                      {itemLabel(item)}
                    </span>
                    <span className="shrink-0 text-[12px] font-normal" style={{ color: COLORS.muted }}>
                      {CATEGORY_LABELS[item.category]} &middot; Grade {item.grade}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-4 py-3 text-[13px] font-normal leading-[1.5]" style={{ color: COLORS.muted }}>
              No matches for &ldquo;{query}&rdquo;. Try a brand (Nike, Coach) or a category (sneakers, watches).
            </p>
          )}
        </div>
      )}
    </div>
  );
}
