# Specimen 갤러리 G1 — 그리드 + 정체성 + i18n Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/gallery`를 styles.refero.design 느낌(화이트 에디토리얼 단일 카드 그리드 + 검색 + 필터)으로 개편하고, repick 브랜드를 제거해 **Specimen**으로 재정체화하며, 기본 영문 + 한/영 토글(i18n)을 도입한다.

**Architecture:** 2단계 — (1) 데이터/i18n 기반: `Work.desc`를 `{en,ko}`로 바꾸고 ~61작품 영문 desc 작성 + `gallery-i18n.ts` 문자열 사전 + v0 de-brand. (2) UI: `page.tsx`가 카테고리 탭 대신 단일 works 배열(+category 태그)을 넘기고, `gallery-client.tsx`가 refero식 헤더·검색·필터·통합 그리드·언어 토글로, `work-card.tsx`가 refero 카드(미리보기+이름+태그라인+태그칩)로.

**Tech Stack:** Next.js 16 App Router, React(client), TypeScript, Tailwind v4. 컴포넌트 unit 테스트 없음 → 검증 = `next build` + 렌더.

## Global Constraints

- **이름 Specimen** — `Repick Design`·`RE:픽`·`repick` 브랜드 문자열 갤러리 크롬에서 제거(v0 작품 brand도 제네릭화). 개별 작품 라우트(page.tsx들)는 무변경.
- **i18n**: `Work.desc: { en: string; ko: string }`, 크롬 문자열 사전 `STRINGS: Record<Lang,…>`, `Lang = "en"|"ko"`, `DEFAULT_LANG = "en"`. 토글 localStorage 키 `"specimen-lang"`. 하이드레이션 안전(서버·초기 = en).
- **태그라인**: EN `"Interface design systems, auto-evolved for AI agents."` / KO `"AI 에이전트를 위한 인터페이스 디자인 시스템 — 매일 스스로 진화."`
- **레이아웃**: 단일 통합 그리드(카테고리 탭·groupByRound·CollectionMark·winnersOnly 제거) + 검색 + 필터 칩 `All·Dashboard·Landing·Free·Native·Winners`.
- **미리보기 불변**: 웹 iframe / 네이티브 img(`work.image`) 분기 유지.
- **비회귀**: `npm test` 45/45. gate.mjs·SKILL·작품 라우트 무변경. Lighthouse a11y ≥95.
- **한국어 커밋 + conventional 접두사, 푸터 없음.**

---

### Task 1: 데이터 모델(desc {en,ko}) + i18n 사전 + de-brand

**Files:**
- Create: `app/src/app/gallery/gallery-i18n.ts`
- Modify: `app/src/lib/works.ts` (Work.desc 타입 + category 필드, ~61 entry desc {en,ko}, v0 de-brand)

**Interfaces:**
- Produces: `Work.desc: { en: string; ko: string }`, `Work.category?: "dashboard"|"landing"|"free"|"native"`; `gallery-i18n.ts`의 `Lang`·`DEFAULT_LANG`·`STRINGS`·`categoryLabel(cat, lang)`. Task 2가 소비.

- [ ] **Step 1: gallery-i18n.ts 생성**

```ts
// app/src/app/gallery/gallery-i18n.ts — Specimen 갤러리 i18n 문자열 사전
import type { Work } from "@/lib/works";

export type Lang = "en" | "ko";
export const DEFAULT_LANG: Lang = "en";

type FilterKey = "all" | "dashboard" | "landing" | "free" | "native" | "winners";
type Strings = {
  worksLabel: string; tagline: string; langLabel: string;
  searchLabel: string; searchPlaceholder: string; filterLabel: string;
  filters: Record<FilterKey, string>;
  resultsLabel: string; empty: string; footer: string;
  status: Record<"winner" | "dropped" | "pending", string>;
};

export const STRINGS: Record<Lang, Strings> = {
  en: {
    worksLabel: "works",
    tagline: "Interface design systems, auto-evolved for AI agents.",
    langLabel: "Language", searchLabel: "Search works", searchPlaceholder: "Search designs…",
    filterLabel: "Filter",
    filters: { all: "All", dashboard: "Dashboard", landing: "Landing", free: "Free", native: "Native", winners: "Winners" },
    resultsLabel: "results", empty: "No designs match.",
    footer: "An auto-evolving gallery of interface design systems.",
    status: { winner: "Selected", dropped: "Cut", pending: "In review" },
  },
  ko: {
    worksLabel: "작품",
    tagline: "AI 에이전트를 위한 인터페이스 디자인 시스템 — 매일 스스로 진화.",
    langLabel: "언어", searchLabel: "작품 검색", searchPlaceholder: "디자인 검색…",
    filterLabel: "필터",
    filters: { all: "전체", dashboard: "대시보드", landing: "랜딩", free: "자유 창작", native: "네이티브", winners: "채택작" },
    resultsLabel: "개", empty: "해당하는 디자인이 없습니다.",
    footer: "스스로 진화하는 인터페이스 디자인 시스템 갤러리.",
    status: { winner: "채택", dropped: "탈락", pending: "심사 대기" },
  },
};

export function categoryLabel(cat: Work["category"], lang: Lang): string {
  if (!cat) return "";
  return STRINGS[lang].filters[cat];
}
```

- [ ] **Step 2: Work 타입 — desc {en,ko} + category**

`app/src/lib/works.ts`의 Work 타입 교체.

old:
```ts
  desc: string;
  previewH?: number; // 카드 미리보기 높이(px), 기본 300
  status?: "winner" | "dropped" | "pending";
  round?: string;
  target?: "dash" | "landing" | "native";
  date?: string;
  image?: string; // 정적 스크린샷 경로(native 등 이미지 미리보기 work). 있으면 WorkCard가 iframe 대신 <img> 렌더
```
new:
```ts
  desc: { en: string; ko: string }; // 카드 태그라인(이중언어)
  previewH?: number; // 카드 미리보기 높이(px), 기본 300
  status?: "winner" | "dropped" | "pending";
  round?: string;
  target?: "dash" | "landing" | "native";
  date?: string;
  image?: string; // 정적 스크린샷 경로(native 등 이미지 미리보기 work). 있으면 WorkCard가 iframe 대신 <img> 렌더
  category?: "dashboard" | "landing" | "free" | "native"; // 갤러리 필터/태그(page.tsx 조립 시 태깅)
```

- [ ] **Step 3: 전 작품 desc를 {en,ko}로 변환 + v0 de-brand**

`works.ts`의 모든 배열(LANDING_WORKS·DASH_LAB_WORKS·FREE_WORKS·NATIVE_WORKS 및 DASH_WORKS의 rg/app entry) entry에서 `desc: "…"`(현 한글) → `desc: { ko: "<기존 한글 그대로>", en: "<좋은 영문 태그라인>" }`. **영문은 직역이 아니라 refero식 간결·정확한 태그라인 품질**로. v0는 brand·desc에서 RE:픽/repick 제거.

패턴(예 3개 — 나머지 전부 동일 방식):
```ts
// v0: de-brand
{ id: "v0", route: "/", brand: "V0 — Champion", desc: { ko: "현재 프로덕션 랜딩 · 에디토리얼 스플릿 히어로 + 제품 쇼케이스 (자동 라운드 R7 계보 승자)", en: "Live production landing · editorial split hero + product showcase (auto-round R7 lineage winner)" }, previewH: 340 },
// v1
{ id: "v1", route: "/v1", brand: "V1 시네마틱", desc: { ko: "전면 이미지 몰입형 · 시네마틱 무드", en: "Full-bleed immersive imagery · cinematic mood" }, previewH: 340 },
// d29
{ id: "d29", route: "/dash/d29", brand: "Waypoint", desc: { ko: "프로젝트 협업(Asana급) · 순백 라이트, 프로젝트 필터→전 위젯 동기화, 정렬 테이블·간트·워크로드·⌘K", en: "Project collaboration (Asana-grade) · pure-white light, project filter → all-widget sync, sortable table · gantt · workload · ⌘K" } },
```
> **주의**: 모든 entry가 `desc: { en, ko }` 형태여야 tsc 통과(누락 시 타입 에러). brand는 유지(영문 코드네임·V/d 라벨) 단 v0의 RE:픽만 제거. `evolveWorks()`(page.tsx)는 Task 2에서 처리.

- [ ] **Step 4: tsc/빌드로 타입 정합 확인**

Run: `cd app && npx next build 2>&1 | tail -8`
Expected: 빌드 성공(모든 works entry가 `desc:{en,ko}`로 타입 정합). ⚠️ 이 시점엔 gallery-client/work-card가 아직 `desc:string`을 기대해 **빌드 에러날 수 있음** — 그 경우 Task 2에서 함께 통과. Task 1 단독 검증은 `npx tsc --noEmit`로 works.ts·gallery-i18n.ts 자체 타입만 확인:
Run: `cd app && npx tsc --noEmit 2>&1 | grep -E "works.ts|gallery-i18n" | head`
Expected: works.ts·gallery-i18n.ts 관련 에러 0(소비처 gallery-client/work-card 에러는 Task 2에서 해소).

- [ ] **Step 5: repick 문자열 확인 + 커밋**

```bash
grep -rn "RE:픽\|repick" app/src/lib/works.ts | grep -v "repick-design\|auto\|round" || echo "브랜드 문자열 제거됨"
git add app/src/lib/works.ts app/src/app/gallery/gallery-i18n.ts
git commit -m "feat(gallery): Work.desc 이중언어({en,ko}) + category + i18n 사전(gallery-i18n) + v0 de-brand(G1)"
```
Expected: v0 RE:픽 제거 확인. 커밋.

---

### Task 2: refero UI — page.tsx · gallery-client.tsx · work-card.tsx

**Files:**
- Modify: `app/src/app/gallery/page.tsx` (단일 works + category 태깅 + title)
- Modify: `app/src/app/gallery/gallery-client.tsx` (전면 재작성 — 헤더·검색·필터·통합 그리드·언어 토글)
- Modify: `app/src/app/gallery/work-card.tsx` (refero 카드 + lang + category 태그)

**Interfaces:**
- Consumes: Task 1의 `Work.desc{en,ko}`·`Work.category`·`STRINGS`·`Lang`·`DEFAULT_LANG`·`categoryLabel`.

- [ ] **Step 1: page.tsx — 단일 works + category + title**

`app/src/app/gallery/page.tsx`에서 `evolveWorks`의 desc·category 반영 + categories 폐기 → 단일 works.

`metadata` 교체:
```ts
export const metadata: Metadata = { title: "Specimen — Interface design systems for AI agents" };
```

`evolveWorks()` 내 `out.push({...})`의 desc를 이중언어 + category로:
```ts
          out.push({
            id: `${target}-${round}/${v}`,
            route: `/${dir}/${round}/${v}`,
            brand: `${label} ${round.toUpperCase()} · ${v.toUpperCase()}`,
            desc: { ko: "자율 진화 라운드 후보", en: "Autonomous evolution round candidate" },
            status: candidateStatus(ledgerRound, v, ledger),
            round: ledgerRound,
            target,
            category: target === "landing" ? "landing" : "dashboard",
            date: info?.date,
          });
```

`GalleryPage()` 교체 (categories → 단일 works):
```tsx
export default function GalleryPage() {
  const works: Work[] = [
    ...LANDING_WORKS.map((w) => ({ ...w, category: "landing" as const })),
    ...DASH_WORKS.map((w) => ({ ...w, category: "dashboard" as const })),
    ...FREE_WORKS.map((w) => ({ ...w, category: "free" as const })),
    ...NATIVE_WORKS.map((w) => ({ ...w, category: "native" as const })),
    ...evolveWorks(),
  ];
  return <GalleryClient works={works} lastUpdated={LAST_UPDATED} />;
}
```

- [ ] **Step 2: gallery-client.tsx 전면 재작성**

`app/src/app/gallery/gallery-client.tsx` 전체를 아래로 교체(카테고리 탭·groupByRound·CollectionMark 제거).

```tsx
"use client";

import { useEffect, useState } from "react";
import type { Work } from "@/lib/works";
import { WorkCard } from "./work-card";
import { STRINGS, DEFAULT_LANG, categoryLabel, type Lang } from "./gallery-i18n";

type FilterKey = "all" | "dashboard" | "landing" | "free" | "native" | "winners";
const FILTERS: FilterKey[] = ["all", "dashboard", "landing", "free", "native", "winners"];

export function GalleryClient({ works, lastUpdated }: { works: Work[]; lastUpdated: string }) {
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const t = STRINGS[lang];

  useEffect(() => {
    const saved = localStorage.getItem("specimen-lang");
    if (saved === "en" || saved === "ko") setLang(saved);
  }, []);
  function pickLang(l: Lang) { setLang(l); localStorage.setItem("specimen-lang", l); }

  const q = query.trim().toLowerCase();
  const shown = works.filter((w) => {
    if (filter === "winners") { if (w.status !== "winner") return false; }
    else if (filter !== "all") { if (w.category !== filter) return false; }
    if (q && !`${w.brand} ${w.desc.en} ${w.desc.ko}`.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto max-w-7xl px-6 py-14 md:px-10">
        <header className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                Specimen · <span className="tabular-nums">{works.length}</span> {t.worksLabel} · Rev <span className="tabular-nums">{lastUpdated}</span>
              </p>
              <h1 className="mt-4 text-5xl font-extrabold leading-[1.04] tracking-tight md:text-6xl">Specimen</h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-500">{t.tagline}</p>
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

          <div className="flex flex-col gap-4 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
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
        </header>

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
```

- [ ] **Step 3: work-card.tsx 재작성 (refero 카드 + lang + 태그)**

`app/src/app/gallery/work-card.tsx` 전체 교체.

```tsx
"use client";

import { useState } from "react";
import type { Work } from "@/lib/works";
import { STRINGS, type Lang } from "./gallery-i18n";

export function WorkCard({ work, lang, label }: { work: Work; lang: Lang; label: string }) {
  const [loaded, setLoaded] = useState(false);
  const h = work.previewH ?? 300;
  const t = STRINGS[lang];
  return (
    <a href={work.route}
      className="group block min-w-0 overflow-hidden rounded-xl border border-zinc-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-sm active:translate-y-0 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0">
      <div aria-hidden="true" className="relative w-full overflow-hidden border-b border-zinc-100 bg-zinc-50" style={{ height: h }}>
        {!loaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-zinc-100 to-zinc-50 motion-reduce:animate-none" />}
        {work.image ? (
          <img src={work.image} alt="" width={390} height={844} loading="lazy" onLoad={() => setLoaded(true)}
            className={`absolute left-1/2 top-1/2 max-h-full w-auto -translate-x-1/2 -translate-y-1/2 object-contain transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`} />
        ) : (
          <iframe src={work.route} loading="lazy" title={`${work.brand} preview`} tabIndex={-1} scrolling="no" onLoad={() => setLoaded(true)}
            className={`pointer-events-none absolute left-0 top-0 origin-top-left transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
            style={{ width: "1440px", height: "1100px", transform: "scale(0.34)", border: 0 }} />
        )}
      </div>
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 truncate text-sm font-bold">{work.brand}</p>
          {work.status && <StatusBadge status={work.status} label={t.status[work.status]} />}
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500 group-hover:line-clamp-none">{work.desc[lang]}</p>
        {label && (
          <div className="mt-2.5">
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">{label}</span>
          </div>
        )}
      </div>
    </a>
  );
}

function StatusBadge({ status, label }: { status: NonNullable<Work["status"]>; label: string }) {
  if (status === "winner") return <span className="shrink-0 rounded-md bg-zinc-900 px-2 py-0.5 text-[11px] font-semibold text-white">{label}</span>;
  if (status === "dropped") return <span className="shrink-0 rounded-md border border-zinc-200 px-2 py-0.5 text-[11px] font-semibold text-zinc-500">{label}</span>;
  return <span className="shrink-0 rounded-md border border-dashed border-zinc-300 px-2 py-0.5 text-[11px] font-semibold text-zinc-600">{label}</span>;
}
```

- [ ] **Step 4: collection-mark import 정리**

`gallery-client.tsx`에서 CollectionMark를 더 안 쓴다(재작성으로 제거됨). `app/src/app/gallery/collection-mark.tsx`가 다른 곳에서 import되지 않으면 파일 삭제.
Run: `grep -rl "collection-mark\|CollectionMark" app/src | grep -v gallery-client`
Expected: 결과 없음 → `git rm app/src/app/gallery/collection-mark.tsx`. (결과 있으면 삭제 보류.)

- [ ] **Step 5: 빌드 + 렌더 검증**

```bash
lsof -ti :3100 | xargs -r kill 2>/dev/null; rm -rf app/.next
( cd app && npx next build 2>&1 | tail -6 )
( cd app && PORT=3100 npm run dev >/tmp/dev3100.log 2>&1 & )
for i in $(seq 1 40); do [ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3100/gallery)" = "200" ] && break; sleep 1; done
html=$(curl -s http://localhost:3100/gallery)
echo "Specimen 워드마크: $(echo "$html" | grep -c 'Specimen')"
echo "영문 태그라인(기본): $(echo "$html" | grep -c 'auto-evolved for AI agents')"
echo "필터칩(Dashboard): $(echo "$html" | grep -c 'Dashboard')"
echo "repick/RE:픽 잔존(0이어야): $(echo "$html" | grep -c 'RE:픽\|Repick Design')"
lsof -ti :3100 | xargs -r kill
```
Expected: Specimen ≥1 · 영문 태그라인 ≥1 · Dashboard ≥1 · repick/RE:픽 = 0.

- [ ] **Step 6: a11y + 회귀 + 커밋**

```bash
( cd app && PORT=3100 npm run dev >/tmp/dev3100.log 2>&1 & ); sleep 3
for i in $(seq 1 40); do [ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3100/gallery)" = "200" ] && break; sleep 1; done
npx lighthouse http://localhost:3100/gallery --only-categories=accessibility --preset=desktop --output=json --output-path=stdout --chrome-flags="--headless" 2>/dev/null | node -e "process.stdin.on('data',d=>{try{console.log('a11y',Math.round(JSON.parse(d).categories.accessibility.score*100))}catch{console.log('a11y unavailable')}})"
lsof -ti :3100 | xargs -r kill
npm test 2>&1 | grep -E "# (pass|fail)"
git add app/src/app/gallery/page.tsx app/src/app/gallery/gallery-client.tsx app/src/app/gallery/work-card.tsx
git rm -q app/src/app/gallery/collection-mark.tsx 2>/dev/null || true
git commit -m "feat(gallery): refero식 통합 그리드+검색+필터+언어토글 UI (Specimen G1)"
```
Expected: a11y ≥95(또는 unavailable) · `# pass 45` · 커밋.

---

## Self-Review

- **Spec coverage**: 이름 Specimen·de-brand(spec §2·§4)→T1S3/T2 · 태그라인(spec §2)→T1S1 STRINGS · i18n desc{en,ko}(spec §3·§4)→T1S1~S3 · 언어토글(spec §3)→T2S2 · 단일 works+category(spec §5)→T1S2/T2S1 · refero 헤더·검색·필터·그리드(spec §6)→T2S2 · refero 카드(spec §7)→T2S3 · 빌드/렌더(spec §8.1)→T2S5 · i18n 검증(§8.2)→T2S5 · 검색·필터(§8.3)→T2S5 · 미리보기 회귀(§8.4)→T2S3(분기 유지) · a11y(§8.5)→T2S6 · 45/45(§8.6)→T2S6. 전 요구 매핑.
- **Placeholder scan**: 코드 전문·명령·기대출력 구체. desc 번역은 "~61 entry 동일 방식"(패턴 3예시 제시) — 데이터 반복이라 열거 불가피, TODO 아님. 없음.
- **Type consistency**: `desc:{en,ko}`(T1) → `work.desc[lang]`·`work.desc.en/ko`(T2 gallery-client·work-card) 일관. `category`(T1 타입, T2 page 태깅) → `categoryLabel(w.category,lang)`(T2). `Lang`·`STRINGS`·`DEFAULT_LANG`·`categoryLabel` export명 T1↔T2 일치. `FilterKey` 유니온이 category 값 + all/winners.
- **주의**: T1 단독 빌드는 소비처(gallery-client/work-card) 미변경이라 실패 가능 — T1 검증은 tsc로 works.ts/gallery-i18n 자체만(Step4), 전체 빌드는 T2에서. T2가 desc string→{en,ko} 소비 전환 완료.
