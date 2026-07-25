"use client";

import { useEffect, useState } from "react";
import type { Work } from "@/lib/works";
import { WorkCard } from "./work-card";
import { Showcase } from "./showcase";
import { STRINGS, DEFAULT_LANG, categoryLabel, type Lang } from "./gallery-i18n";

type FilterKey = "all" | "project" | "scheduling" | "ops" | "finance" | "analytics" | "landing" | "mobile";
const FILTERS: FilterKey[] = ["all", "project", "scheduling", "ops", "finance", "analytics", "landing", "mobile"];

export function GalleryClient({ works, lastUpdated }: { works: Work[]; lastUpdated: string }) {
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const t = STRINGS[lang];
  const SHOWCASE_IDS = ["d29", "d32", "d37", "d38", "v8", "n2"];
  const showcaseWorks = SHOWCASE_IDS.map((id) => works.find((w) => w.id === id)).filter((w): w is NonNullable<typeof w> => Boolean(w));

  useEffect(() => {
    const saved = localStorage.getItem("specimen-lang");
    if (saved === "en" || saved === "ko") setLang(saved);
  }, []);
  function pickLang(l: Lang) { setLang(l); localStorage.setItem("specimen-lang", l); }

  const q = query.trim().toLowerCase();
  const shown = works.filter((w) => {
    if (filter !== "all" && w.category !== filter) return false;
    if (q && !`${w.brand} ${w.desc.en} ${w.desc.ko}`.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto max-w-7xl px-6 py-14 md:px-10">
        <section className="flex flex-col gap-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-lg bg-zinc-900 font-mono text-lg font-bold text-white">S</span>
              <span className="text-lg font-extrabold tracking-tight">Specimen</span>
            </div>
            <div role="group" aria-label={t.langLabel} className="inline-flex shrink-0 rounded-lg border border-zinc-200 p-0.5">
              {(["en", "ko"] as const).map((l) => (
                <button key={l} type="button" aria-pressed={lang === l} onClick={() => pickLang(l)}
                  className={`h-8 rounded-md px-3 text-xs font-semibold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 ${lang === l ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-800"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">{t.hero.headline}</h1>
            <p className="max-w-2xl text-base leading-relaxed text-zinc-600">{t.hero.subcopy}</p>
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
              <a href="#browse" className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold normal-case tracking-normal text-white transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2">
                {t.hero.browseCta} ↓
              </a>
              <span>· <span className="tabular-nums">{works.length}</span> {t.worksLabel} · Rev <span className="tabular-nums">{lastUpdated}</span></span>
            </div>
          </div>
        </section>

        <Showcase works={showcaseWorks} label={t.hero.showcaseLabel} />

        <div id="browse" className="mt-12 flex flex-col gap-4 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <input type="search" aria-label={t.searchLabel} value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="h-10 w-full rounded-lg border border-zinc-200 px-3.5 text-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 sm:max-w-xs" />
          <div role="group" aria-label={t.filterLabel} className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}
                className={`h-8 rounded-full border px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 ${filter === f ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 text-zinc-600 hover:border-zinc-400"}`}>
                {t.filters[f]}
              </button>
            ))}
          </div>
        </div>

        <p aria-live="polite" className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
          <span className="tabular-nums">{shown.length}</span> {t.resultsLabel}
        </p>

        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((w) => <WorkCard key={w.id} work={w} lang={lang} label={categoryLabel(w.category, lang)} />)}
        </div>
        {shown.length === 0 && <p className="mt-10 text-sm text-zinc-500">{t.empty}</p>}

        <footer className="mt-16 border-t border-zinc-200 pt-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-500">{t.footer}</p>
        </footer>
      </main>
    </div>
  );
}
