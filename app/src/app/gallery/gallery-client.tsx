"use client";

import { useState } from "react";
import type { Work } from "@/lib/works";
import { WorkCard } from "./work-card";
import { Showcase } from "./showcase";
import { STRINGS, categoryLabel, useLang, type FilterKey } from "./gallery-i18n";

/**
 * Canonical chip order for the page-type axis. The gallery renders only the types that actually have
 * works (plus "all"), so types the evolution loop has not produced yet stay invisible instead of
 * showing as dead filters — new chips appear on their own as rounds land.
 */
const FILTER_ORDER: FilterKey[] = [
  "all", "dashboard", "settings", "landing", "scene", "catalog", "product-detail", "paywall",
  "login", "profile", "404", "blog", "about", "careers", "contact", "developers",
  "integration", "media-kit", "mobile",
];

export function GalleryClient({ works, lastUpdated }: { works: Work[]; lastUpdated: string }) {
  const [lang, pickLang] = useLang();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const t = STRINGS[lang];
  const SHOWCASE_IDS = ["d29", "d32", "d37", "d38", "v8", "n2"];
  const showcaseWorks = SHOWCASE_IDS.map((id) => works.find((w) => w.id === id)).filter((w): w is NonNullable<typeof w> => Boolean(w));


  // Only offer chips for page types present in the catalog — an empty filter reads as a broken gallery.
  const present = new Set(works.map((w) => w.category).filter(Boolean));
  const FILTERS = FILTER_ORDER.filter((f) => f === "all" || present.has(f));

  const q = query.trim().toLowerCase();
  const shown = works.filter((w) => {
    if (filter !== "all" && w.category !== filter) return false;
    if (q && !`${w.brand} ${w.desc.en} ${w.desc.ko}`.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-zinc-900">
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
                  className={`h-8 rounded-md px-3 text-xs font-semibold uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 ${lang === l ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-800"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">{t.hero.headline}</h1>
            <p className="max-w-2xl text-base leading-relaxed text-zinc-600">{t.hero.subcopy}</p>
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              <a href="#browse" className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold normal-case tracking-normal text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900">
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
            className="h-10 w-full rounded-lg border border-zinc-200 px-3.5 text-sm placeholder:text-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 sm:max-w-xs" />
          <div role="group" aria-label={t.filterLabel} className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}
                className={`h-8 rounded-full border px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 ${filter === f ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 text-zinc-600 hover:border-zinc-400"}`}>
                {t.filters[f]}
              </button>
            ))}
          </div>
        </div>

        {/* zinc-400 은 흰 바탕에서 2.62:1 로 AA 미달이다(11px = 소형 텍스트, 하한 4.5). zinc-500 이
            4.83:1 로 통과한다 — Lighthouse 실측과 손계산이 같은 값을 냈다. */}
        <p aria-live="polite" className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          <span className="tabular-nums">{shown.length}</span> {t.resultsLabel}
        </p>

        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 items-start">
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
