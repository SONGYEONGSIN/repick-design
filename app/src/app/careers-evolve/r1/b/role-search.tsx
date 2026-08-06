"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronDown, MapPin, Search, Users2, X } from "lucide-react";
import { ROLES, type Role } from "./data";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

function filterRoles(query: string): Role[] {
  const q = query.trim().toLowerCase();
  if (q === "") return ROLES;
  return ROLES.filter((role) =>
    `${role.title} ${role.team} ${role.location}`.toLowerCase().includes(q),
  );
}

function mailtoFor(role: Role): string {
  const subject = encodeURIComponent(`Application: ${role.title}`);
  return `mailto:careers@portside.io?subject=${subject}`;
}

export function RoleSearch() {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});

  const filtered = useMemo(() => filterRoles(query), [query]);

  function scrollToOption(id: string) {
    const el = itemRefs.current[id];
    if (!el) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "nearest" });
  }

  function selectRole(role: Role, index: number) {
    setActiveIndex(index);
    setExpandedId((prev) => (prev === role.id ? null : role.id));
    scrollToOption(role.id);
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    const next = filterRoles(value);
    setActiveIndex(next.length > 0 ? 0 : -1);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (filtered.length === 0 && event.key !== "Escape") return;
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        setActiveIndex((prev) => {
          const next = prev < filtered.length - 1 ? prev + 1 : filtered.length - 1;
          const role = filtered[next];
          if (role) scrollToOption(role.id);
          return next;
        });
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        setActiveIndex((prev) => {
          const next = prev > 0 ? prev - 1 : 0;
          const role = filtered[next];
          if (role) scrollToOption(role.id);
          return next;
        });
        break;
      }
      case "Enter": {
        event.preventDefault();
        const role = filtered[activeIndex];
        if (role) selectRole(role, activeIndex);
        break;
      }
      case "Escape": {
        if (query !== "") {
          event.preventDefault();
          handleQueryChange("");
        }
        break;
      }
      default:
        break;
    }
  }

  const activeOption = activeIndex >= 0 ? filtered[activeIndex] : undefined;
  const resultText =
    filtered.length === 0
      ? `No roles match "${query}"`
      : `${filtered.length} role${filtered.length === 1 ? "" : "s"} found`;

  return (
    <div>
      <label htmlFor="role-search-input" className="block text-sm font-bold text-zinc-900">
        Search open roles
      </label>
      <p className="mt-1 text-sm font-normal text-zinc-600">
        Type a title, team, or location. Use the arrow keys to move through results and Enter
        to open a role.
      </p>

      <div className="relative mt-4">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id="role-search-input"
          type="text"
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded="true"
          aria-haspopup="listbox"
          aria-owns="role-listbox"
          aria-controls="role-listbox"
          aria-autocomplete="list"
          aria-activedescendant={activeOption ? `role-option-${activeOption.id}` : undefined}
          autoComplete="off"
          placeholder="e.g. engineer, sales, Berlin"
          className={`w-full rounded-full border border-zinc-300 bg-white py-3 pl-11 pr-11 text-base font-normal text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING}`}
        />
        {query !== "" && (
          <button
            type="button"
            onClick={() => {
              handleQueryChange("");
              inputRef.current?.focus();
            }}
            className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 ${FOCUS_RING}`}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <p className="mt-3 text-sm font-medium text-zinc-700" aria-live="polite">
        {resultText}
      </p>

      <ul
        id="role-listbox"
        role="listbox"
        aria-label="Open roles"
        className="mt-4 space-y-3"
      >
        {filtered.map((role, index) => {
          const isActive = index === activeIndex;
          const isExpanded = expandedId === role.id;
          return (
            <li
              key={role.id}
              role="option"
              id={`role-option-${role.id}`}
              aria-selected={isActive}
              ref={(el) => {
                itemRefs.current[role.id] = el;
              }}
              className={`min-w-0 rounded-2xl border bg-white transition-colors ${
                isActive ? "border-orange-400" : "border-zinc-200"
              }`}
            >
              <button
                type="button"
                tabIndex={-1}
                aria-expanded={isExpanded}
                aria-controls={`role-detail-${role.id}`}
                onClick={() => selectRole(role, index)}
                className={`flex w-full min-w-0 items-start justify-between gap-4 rounded-2xl px-5 py-4 text-left ${FOCUS_RING}`}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-bold text-zinc-900">{role.title}</span>
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">
                      {role.employment}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-normal text-zinc-600">
                    <span className="inline-flex items-center gap-1.5">
                      <Users2 className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
                      {role.team}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
                      {role.location}
                    </span>
                    <span>{role.level}</span>
                  </div>
                </div>
                <ChevronDown
                  className={`mt-1 h-5 w-5 flex-shrink-0 text-zinc-500 transition-transform motion-reduce:transition-none ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {isExpanded && (
                <div
                  id={`role-detail-${role.id}`}
                  className="border-t border-zinc-200 px-5 py-4"
                >
                  <p className="text-sm font-normal leading-relaxed text-zinc-700">
                    {role.blurb}
                  </p>
                  <p className="mt-3 text-sm font-bold text-zinc-900">What you will do</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-normal leading-relaxed text-zinc-700">
                    {role.duties.map((duty) => (
                      <li key={duty}>{duty}</li>
                    ))}
                  </ul>
                  <a
                    href={mailtoFor(role)}
                    className={`mt-4 inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2 text-sm font-medium text-white hover:bg-orange-700 ${FOCUS_RING}`}
                  >
                    Apply for this role
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {filtered.length === 0 && (
        <p className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-6 text-sm font-normal text-zinc-600">
          Try a different team, title, or location — open roles span Engineering, Design, Data,
          Sales, Support, and Operations.
        </p>
      )}
    </div>
  );
}
