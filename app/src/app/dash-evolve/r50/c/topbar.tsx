"use client";

import Image from "next/image";
import { useState } from "react";
import { Bell, Command, FlagTriangleRight, LogOut, Plus, Search, Settings, TrendingDown, User } from "lucide-react";
import type { Environment, Experiment } from "./types";
import { CURRENT_USER, ENVIRONMENTS } from "./data";
import { formatSignedPct, resolveMetric } from "./format";
import { FOCUS_RING, SegmentedControl, useOutsideClose } from "./ui";

/**
 * No left rail on this console (deliberate rail-free bento, see candidate notes). The environment
 * switcher doubles as this page's lightweight section control — it is a real, wired filter (narrows
 * the flags table + its two stat cards), not a set of inert page links to screens this single-page
 * build doesn't have.
 */
export function Topbar({
  envFilter,
  onEnvFilterChange,
  onOpenPalette,
  onOpenNewFlag,
  regressingExperiments,
  onPinFromNotification,
}: {
  envFilter: Environment | "all";
  onEnvFilterChange: (v: Environment | "all") => void;
  onOpenPalette: () => void;
  onOpenNewFlag: () => void;
  regressingExperiments: Experiment[];
  onPinFromNotification: (id: string) => void;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const notifRef = useOutsideClose<HTMLDivElement>(notifOpen, () => setNotifOpen(false));
  const accountRef = useOutsideClose<HTMLDivElement>(accountOpen, () => setAccountOpen(false));

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/85 sm:px-6">
      <div className="flex shrink-0 items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
          <FlagTriangleRight className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <h1 className="font-display-grotesk text-[17px] font-bold tracking-tight text-zinc-900">Flagline</h1>
      </div>

      <div className="hidden lg:block">
        <SegmentedControl options={ENVIRONMENTS} value={envFilter} onChange={onEnvFilterChange} ariaLabel="Scope the console to an environment" />
      </div>

      <button
        type="button"
        onClick={onOpenPalette}
        className={`flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left text-zinc-500 transition-colors duration-150 ease-out hover:border-zinc-300 hover:text-zinc-700 sm:max-w-sm ${FOCUS_RING}`}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-[13px] font-normal">Search flags, experiments…</span>
        <span className="hidden shrink-0 items-center gap-0.5 rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[11px] font-normal text-zinc-500 sm:inline-flex">
          <Command className="h-3 w-3" aria-hidden="true" />K
        </span>
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onOpenNewFlag}
          className={`hidden h-11 items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 text-[13px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-emerald-700 sm:inline-flex ${FOCUS_RING}`}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New flag
        </button>

        <div ref={notifRef} className="relative">
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={notifOpen}
            onClick={() => setNotifOpen((v) => !v)}
            aria-label={`Notifications, ${regressingExperiments.length} guardrail regressions`}
            className={`relative flex h-11 w-11 items-center justify-center rounded-lg text-zinc-500 transition-colors duration-150 ease-out hover:bg-zinc-100 hover:text-zinc-900 ${FOCUS_RING}`}
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
            {regressingExperiments.length > 0 && (
              <span
                className="absolute top-2.5 right-2.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-rose-600 px-0.5 text-[9px] font-bold text-white"
                aria-hidden="true"
              >
                {regressingExperiments.length}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full z-30 mt-2 w-80 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl shadow-zinc-900/10">
              <p className="border-b border-zinc-100 px-4 py-2.5 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
                Conversion regressions
              </p>
              <ul className="max-h-72 overflow-y-auto">
                {regressingExperiments.map((exp) => {
                  const result = resolveMetric(exp.conversion, "conversion");
                  return (
                    <li key={exp.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onPinFromNotification(exp.id);
                          setNotifOpen(false);
                        }}
                        className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left transition-colors duration-150 ease-out hover:bg-zinc-50 ${FOCUS_RING}`}
                      >
                        <TrendingDown className="h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-normal text-zinc-900">{exp.shortName}</span>
                          <span className="block text-[11px] font-semibold text-rose-700 tabular-nums">
                            {formatSignedPct(result.pctChange)} conversion
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
                {regressingExperiments.length === 0 && (
                  <li className="px-4 py-4 text-center text-[13px] font-normal text-zinc-500">No active regressions.</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div ref={accountRef} className="relative">
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={accountOpen}
            onClick={() => setAccountOpen((v) => !v)}
            aria-label={`Open account menu for ${CURRENT_USER.name}`}
            className={`flex h-11 items-center gap-2 rounded-lg px-1.5 transition-colors duration-150 ease-out hover:bg-zinc-100 ${FOCUS_RING}`}
          >
            <Image
              src={`https://images.unsplash.com/photo-${CURRENT_USER.photoId}?q=80&w=96&auto=format&fit=facearea&facepad=2.5`}
              alt={CURRENT_USER.name}
              width={30}
              height={30}
              className="rounded-full border border-zinc-200 object-cover"
            />
          </button>
          {accountOpen && (
            <div className="absolute right-0 top-full z-30 mt-2 w-52 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl shadow-zinc-900/10">
              <p className="border-b border-zinc-100 px-4 py-2.5 text-[13px] font-semibold text-zinc-900">{CURRENT_USER.name}</p>
              <button
                type="button"
                onClick={() => setAccountOpen(false)}
                className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] font-normal text-zinc-700 transition-colors duration-150 ease-out hover:bg-zinc-50 ${FOCUS_RING}`}
              >
                <User className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
                Profile
              </button>
              <button
                type="button"
                onClick={() => setAccountOpen(false)}
                className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] font-normal text-zinc-700 transition-colors duration-150 ease-out hover:bg-zinc-50 ${FOCUS_RING}`}
              >
                <Settings className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
                Preferences
              </button>
              <button
                type="button"
                onClick={() => setAccountOpen(false)}
                className={`flex w-full items-center gap-2.5 border-t border-zinc-100 px-4 py-2.5 text-left text-[13px] font-normal text-zinc-700 transition-colors duration-150 ease-out hover:bg-zinc-50 ${FOCUS_RING}`}
              >
                <LogOut className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
