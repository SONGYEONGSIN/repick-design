"use client";

import { useMemo, useRef, useState } from "react";
import {
  Search,
  X,
  Check,
  Mail,
  Phone,
  Clock4,
  RotateCcw,
  ArrowRight,
  Info,
  Package,
  CreditCard,
  ShieldCheck,
  Lock,
  Handshake,
  Megaphone,
} from "lucide-react";
import { CATEGORIES, COMPANY, DAY_LABELS, DESKS, FOCUS_RING, formatCoverage, type Category, type Desk, type IconKey } from "./data";

const ICONS: Record<IconKey, typeof Package> = {
  package: Package,
  "credit-card": CreditCard,
  "shield-check": ShieldCheck,
  lock: Lock,
  handshake: Handshake,
  megaphone: Megaphone,
};

type Filter = "All" | Category;

function matches(desk: Desk, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (desk.name.toLowerCase().includes(q)) return true;
  if (desk.summary.toLowerCase().includes(q)) return true;
  if (desk.handles.some((h) => h.toLowerCase().includes(q))) return true;
  return desk.tags.some((t) => t.includes(q));
}

/**
 * The page's one interactive device: a text query plus category chips that live-narrow this fixed,
 * deterministic six-desk array. It is not a clock control — nothing here reads or accepts a time of
 * day. Every desk (address, phone where one exists, hours, response target) is already fully
 * rendered at mount, unfiltered — search and the chips only reorder which cards are visible; they are
 * never a gate in front of a channel.
 */
export default function DirectoryClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Filter>("All");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () => DESKS.filter((d) => (category === "All" || d.category === category) && matches(d, query)),
    [query, category],
  );

  const filtersActive = query !== "" || category !== "All";

  function clearFilters() {
    setQuery("");
    setCategory("All");
    inputRef.current?.focus();
  }

  function jumpTo(name: string) {
    setCategory("All");
    setQuery(name);
    inputRef.current?.focus();
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
      <aside aria-label="Filter desks" className="lg:sticky lg:top-24">
        <div role="group" aria-label="Filter by category" className="flex flex-row flex-wrap gap-2 lg:flex-col lg:flex-nowrap lg:items-stretch lg:gap-1.5">
          {(["All", ...CATEGORIES] as Filter[]).map((cat) => {
            const active = category === cat;
            const count = cat === "All" ? DESKS.length : DESKS.filter((d) => d.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(cat)}
                className={`inline-flex items-center justify-between gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors lg:rounded-lg ${FOCUS_RING} ${
                  active
                    ? "border-orange-700 bg-orange-700 text-white"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-orange-300 hover:text-orange-700"
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  {active && <Check aria-hidden="true" className="h-3.5 w-3.5 flex-none" />}
                  {cat}
                </span>
                <span className={`tabular-nums ${active ? "text-white" : "text-zinc-500"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 hidden rounded-xl border border-zinc-200 bg-zinc-50 p-4 lg:block">
          <p className="text-sm font-semibold text-zinc-900">Not sure yet?</p>
          <p className="mt-1 text-sm font-normal leading-relaxed text-zinc-600">
            Write to the general inbox and a person routes it by hand.
          </p>
          <a
            href={`mailto:${COMPANY.generalEmail}`}
            className={`mt-3 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-orange-700 hover:text-orange-800 ${FOCUS_RING}`}
          >
            <Mail aria-hidden="true" className="h-4 w-4 flex-none" />
            <span className="break-all">{COMPANY.generalEmail}</span>
          </a>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="sticky top-0 z-10 -mx-1 bg-white/95 px-1 pb-4 pt-1 backdrop-blur supports-[backdrop-filter]:bg-white/80 lg:static lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-0 lg:backdrop-blur-none">
          <label htmlFor="desk-search" className="sr-only">
            Search desks by keyword
          </label>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              ref={inputRef}
              id="desk-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by what happened — tracking, refund, locked out…"
              className="w-full rounded-full border border-zinc-300 bg-white py-2.5 pl-10 pr-10 text-sm font-normal text-zinc-900 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
            />
            {query !== "" && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-zinc-500 hover:text-orange-700 ${FOCUS_RING}`}
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p aria-live="polite" className="text-sm font-normal text-zinc-600">
              <span className="font-semibold tabular-nums text-zinc-900">{filtered.length}</span> of{" "}
              <span className="tabular-nums">{DESKS.length}</span> desks match
            </p>
            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className={`inline-flex items-center gap-1.5 rounded text-sm font-normal text-zinc-600 hover:text-orange-700 ${FOCUS_RING}`}
              >
                <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
                Clear filters
              </button>
            )}
          </div>
        </div>

        <ul role="list" className="mt-5 space-y-4">
          {filtered.map((desk) => {
            const Icon = ICONS[desk.icon];
            return (
              <li key={desk.id} className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h3 className="text-lg font-bold tracking-tight text-zinc-900">{desk.name}</h3>
                        <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-600">
                          {desk.category}
                        </span>
                      </div>
                      <p className="mt-1 max-w-xl text-sm font-normal leading-relaxed text-zinc-600">{desk.summary}</p>
                    </div>
                  </div>

                  <div className="flex flex-none flex-col items-start gap-2">
                    <a
                      href={`mailto:${desk.email}`}
                      className={`inline-flex max-w-full items-center gap-1.5 rounded-full bg-orange-700 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-orange-800 ${FOCUS_RING}`}
                    >
                      <Mail aria-hidden="true" className="h-3.5 w-3.5 flex-none" />
                      <span className="break-all">{desk.email}</span>
                    </a>
                    {desk.phone && (
                      <a
                        href={`tel:${desk.phone}`}
                        className={`inline-flex items-center gap-1.5 rounded text-sm font-semibold text-orange-700 hover:text-orange-800 ${FOCUS_RING}`}
                      >
                        <Phone aria-hidden="true" className="h-3.5 w-3.5 flex-none" />
                        {desk.phoneLabel}
                      </a>
                    )}
                  </div>
                </div>

                <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
                  {desk.handles.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm font-normal text-zinc-700">
                      <Check aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 flex-none text-orange-700" />
                      <span className="min-w-0">{h}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => jumpTo(desk.notFor.targetName)}
                  className={`mt-3 inline-flex items-center gap-1.5 rounded text-sm font-normal text-zinc-600 underline underline-offset-2 hover:text-orange-700 ${FOCUS_RING}`}
                >
                  <span className="min-w-0">
                    {desk.notFor.text} Jump to {desk.notFor.targetName}
                  </span>
                  <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 flex-none" />
                </button>

                <div className="mt-5 border-t border-zinc-100 pt-4">
                  <p className="text-sm font-normal text-zinc-700">
                    Desk lead: <span className="font-semibold text-zinc-900">{desk.ownerName}</span>, {desk.ownerTitle}
                  </p>
                  <p className="mt-1.5 text-sm font-normal tabular-nums text-zinc-700">
                    {formatCoverage(desk.coverageDays)} · {desk.hoursRange}
                  </p>
                  <div aria-hidden="true" className="mt-2 flex gap-1">
                    {DAY_LABELS.map((d) => {
                      const covered = desk.coverageDays.includes(d);
                      return (
                        <span
                          key={d}
                          className={`flex h-6 w-6 flex-none items-center justify-center rounded text-[11px] font-semibold tabular-nums ${
                            covered ? "bg-orange-100 text-orange-800" : "bg-zinc-100 text-zinc-600"
                          }`}
                        >
                          {d[0]}
                        </span>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-sm font-normal text-zinc-600">{desk.responseTarget}</p>
                  <p className="mt-1.5 flex items-start gap-1.5 text-xs font-normal text-zinc-500">
                    <Clock4 aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 flex-none text-zinc-500" />
                    <span className="min-w-0">{desk.afterHours}</span>
                  </p>
                </div>
              </li>
            );
          })}

          {filtered.length === 0 && (
            <li className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
              <Info aria-hidden="true" className="mx-auto h-6 w-6 text-zinc-500" />
              <p className="mt-3 text-base font-semibold text-zinc-900">No desk matches your filters.</p>
              <p className="mt-1 text-sm font-normal text-zinc-600">Try a different word, or clear filters and browse all six.</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={clearFilters}
                  className={`inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:border-orange-300 hover:text-orange-700 ${FOCUS_RING}`}
                >
                  <RotateCcw aria-hidden="true" className="h-4 w-4" />
                  Clear filters
                </button>
                <a
                  href={`mailto:${COMPANY.generalEmail}`}
                  className={`inline-flex items-center gap-1.5 rounded-full bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800 ${FOCUS_RING}`}
                >
                  <Mail aria-hidden="true" className="h-4 w-4" />
                  {COMPANY.generalEmail}
                </a>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
