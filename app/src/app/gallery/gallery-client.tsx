"use client";

import { useRef, useState } from "react";
import type { Work } from "@/lib/works";
import { WorkCard } from "./work-card";

type Category = { key: string; numeral: string; label: string; works: Work[] };

export function GalleryClient({ categories, lastUpdated }: { categories: Category[]; lastUpdated: string }) {
  const [active, setActive] = useState(categories[0].key);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = categories.find((c) => c.key === active) ?? categories[0];
  const total = categories.reduce((n, c) => n + c.works.length, 0);

  function onTabKeyDown(e: React.KeyboardEvent, idx: number) {
    let next: number;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      next = (idx + (e.key === "ArrowRight" ? 1 : categories.length - 1)) % categories.length;
    } else if (e.key === "Home") {
      next = 0;
    } else if (e.key === "End") {
      next = categories.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    setActive(categories[next].key);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto max-w-7xl px-6 py-14 md:px-10">
        {/* 도록 표지 */}
        <header>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Repick Design — Collected Works · <span className="tabular-nums">{total}</span> Works ·{" "}
            <span className="tabular-nums">{categories.length}</span> Sections · Rev <span className="tabular-nums">{lastUpdated}</span>
          </p>
          <h1 className="mt-5 text-5xl font-extrabold leading-[1.04] tracking-tight md:text-7xl">
            전작 도록<span aria-hidden="true" className="align-top text-2xl font-bold text-zinc-400 md:text-3xl">*</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-500">
            랜딩·SaaS 대시보드·자유 창작 — 진화 루프가 축적한 모든 페이지를 한 지면에 수록한 카탈로그.
            카드는 실제 페이지의 라이브 미리보기입니다.
          </p>
        </header>

        {/* 목차 (탭) */}
        <div role="tablist" aria-label="작품 카테고리" className="mt-12 flex flex-wrap gap-x-8 gap-y-2 border-b border-zinc-200">
          {categories.map((c, i) => {
            const selected = c.key === active;
            return (
              <button
                key={c.key}
                ref={(el) => { tabRefs.current[i] = el; }}
                role="tab"
                aria-selected={selected}
                aria-controls={`panel-${c.key}`}
                id={`tab-${c.key}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(c.key)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
                className={`-mb-px flex h-11 items-center gap-2 border-b-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 ${
                  selected ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
                }`}
              >
                <span className="font-mono text-[11px]">{c.numeral}</span>
                {c.label}
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-zinc-600">
                  {c.works.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* 선택된 섹션만 마운트 — key 교체로 크로스페이드 재생 */}
        <section
          key={current.key}
          role="tabpanel"
          id={`panel-${current.key}`}
          aria-labelledby={`tab-${current.key}`}
          className="mt-10 animate-[gallery-fade_240ms_ease-out] motion-reduce:animate-none"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {current.works.map((w) => (
              <WorkCard key={w.id} work={w} numeral={current.numeral} />
            ))}
          </div>
        </section>

        <footer className="mt-16 border-t border-zinc-200 pt-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-500">
            Printed by autonomous evolution loop · repick-design
          </p>
        </footer>
      </main>
    </div>
  );
}
