# 통합 갤러리 /gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 51개 축적 작품(랜딩 6·대시보드 18·자유창작 27 + 동적 자율루프 후보)을 전시 도록 카탈로그 스타일의 단일 페이지 `/gallery`에서 카테고리 탭으로 열람.

**Architecture:** 중앙 레지스트리(`works.ts`)가 메타 단일 출처. `/gallery`는 서버 컴포넌트(evolve fs 스캔) + 클라이언트 탭(선택 탭만 마운트) + 도록 카드(라이브 iframe + 스켈레톤). 기존 `/dash`·`/free`는 레지스트리 import로 교체(렌더 불변).

**Tech Stack:** Next.js 16 App Router(src-dir, `@/*` alias = `src/*`), Tailwind v4, TS. 검증: next build + dash-sweep + dash-static-check + Lighthouse a11y.

**Spec:** `docs/superpowers/specs/2026-07-17-gallery-hub-design.md`

## Global Constraints

- 순백 라이트 고정(도록) — 다크모드 없음. Pretendard 단일(전역 font-sans), 레이블 11px uppercase tracking, 숫자 `tabular-nums`. 세리프·이모지·`next/font` 추가 import 금지.
- 결정론: `Math.random()`/`Date.now()`/인자 없는 `new Date()` 금지. 최근 갱신일은 레지스트리 상수 `LAST_UPDATED = "2026-07-17"`.
- 그리드: 카드 그리드 아이템 `min-w-0`, 390~1920 전 폭 페이지 오버플로 금지(여유 ≥16px), 탭 컨트롤 높이 44px(`h-11`).
- 접근성: 단일 h1, `role=tablist` 완전 구현(aria-selected, ←/→ 키보드), 포커스 가시(`outline-none` 단독 금지), iframe `title` 필수, 대비 AA.
- 인터랙션: 탭 크로스페이드는 `motion-reduce:animate-none` 게이팅, 진입 `opacity:0` 잔존 금지.
- dev 서버: 3100에 이미 실행 중이면 재사용, 없으면 `cd app && npm run dev` (포트 고정됨). 중복 기동 금지.
- 커밋: conventional + 한국어 + `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` 푸터. **push는 Task 5 게이트 통과 후 1회만** — main은 프로덕션 자동 배포이므로 중간 상태를 배포하지 않는다.
- 검증 스크립트는 repo 루트에서 실행: `node scripts/dash-sweep.mjs`, `node scripts/dash-static-check.mjs`.

---

### Task 1: 중앙 레지스트리 `app/src/lib/works.ts`

**Files:**
- Create: `app/src/lib/works.ts`

**Interfaces:**
- Produces: `type Work = { id: string; route: string; brand: string; desc: string; previewH?: number }`, named exports `LANDING_WORKS: Work[]`(6), `DASH_WORKS: Work[]`(18 — d7~d32 16종 + Ridge + 제품 대시보드), `FREE_WORKS: Work[]`(27), `LAST_UPDATED: string`. Task 2가 `DASH_WORKS`(단, `/dash` 페이지는 d-계열 16종만 slice가 아니라 **별도 export `DASH_LAB_WORKS`** 사용)와 `FREE_WORKS`를, Task 3이 전부를 소비.

- [ ] **Step 1: 파일 생성 — 아래 골격 + 기존 배열 이전**

```ts
// app/src/lib/works.ts — 전 작품 메타 단일 출처 (통합 갤러리 + 개별 갤러리 공용)
export type Work = {
  id: string;
  route: string;
  brand: string;
  desc: string;
  previewH?: number; // 카드 미리보기 높이(px), 기본 300
};

export const LAST_UPDATED = "2026-07-17"; // 결정론 규칙: 동적 Date 호출 금지, 갱신 시 수동 수정

// Ⅰ 랜딩 — 챔피언 + 진화 계보 v1~v5. (/lab 은 자체가 인덱스 페이지라 작품 아님 — 제외)
export const LANDING_WORKS: Work[] = [
  { id: "v0", route: "/", brand: "RE:픽 — 챔피언", desc: "현재 프로덕션 랜딩 · 에디토리얼 스플릿 히어로 + 제품 쇼케이스 (자동 라운드 R7 계보 승자)", previewH: 340 },
  { id: "v1", route: "/v1", brand: "V1 시네마틱", desc: "전면 이미지 몰입형 · 시네마틱 무드", previewH: 340 },
  { id: "v2", route: "/v2", brand: "V2 벤토", desc: "벤토 그리드 · 제품 중심 구성", previewH: 340 },
  { id: "v3", route: "/v3", brand: "V3 매거진", desc: "에디토리얼 매거진 · 롱폼 그리드", previewH: 340 },
  { id: "v4", route: "/v4", brand: "V4 대화형", desc: "히어로 3문항 퀴즈 — 사용자 입력이 콘텐츠·전환장치가 되는 인터랙티브 우선", previewH: 340 },
  { id: "v5", route: "/v5", brand: "V5 미니멀", desc: "미니멀 타이포 중심 · '적을수록 프리미엄', 헤어라인 그리드", previewH: 340 },
];

// Ⅱ SaaS 대시보드 — /dash 갤러리 16종(d7~d32, 아래 Step 2에서 원본 이전) + 기준작/제품
export const DASH_LAB_WORKS: Work[] = [
  /* Step 2에서 app/src/app/dash/page.tsx 의 works 배열 16개 entry를 그대로 붙여넣는다 */
];

export const DASH_WORKS: Work[] = [
  ...DASH_LAB_WORKS,
  { id: "rg", route: "/dash-rg", brand: "Ridge", desc: "레퍼런스급 금융 대시보드 · 앱 셸·컴포넌트 시스템·⌘K — 서비스급 문법의 검증 기준작" },
  { id: "app", route: "/dashboard", brand: "RE:픽 대시보드", desc: "RE:픽 제품 대시보드 · 브랜드 다크 사이드바/헤더" },
];

// Ⅲ 자유 창작 — /free 인덱스 27종 (아래 Step 2에서 원본 이전)
export const FREE_WORKS: Work[] = [
  /* Step 2에서 app/src/app/free/page.tsx 의 배열 27개 entry를 그대로 붙여넣는다 */
];
// 인벤토리 제외 기록: /lab(랜딩 인덱스), app/src/app/pages/(main에 부재 — evolve 브랜치 잔재)
```

- [ ] **Step 2: 기존 배열 verbatim 이전**

- `app/src/app/dash/page.tsx`의 `const works = [ ... ]` 안 16개 entry(`d7`~`d32`)를 **한 글자도 바꾸지 말고** `DASH_LAB_WORKS` 배열 안으로 복사한다.
- `app/src/app/free/page.tsx`의 배열 27개 entry(`f1`~`f30`)를 동일하게 `FREE_WORKS` 안으로 복사한다.
- 아직 원본 페이지는 수정하지 않는다(Task 2에서 교체).

- [ ] **Step 3: 무결성 검증**

Run: `node -e "const s=require('fs').readFileSync('app/src/lib/works.ts','utf8'); const c=(re)=>(s.match(re)||[]).length; console.log('landing',c(/route: \"\/(v[1-5])?\"/g), 'dashlab',c(/route: \"\/dash\/d/g), 'dash-extra',c(/\"\/dash-rg\"|\"\/dashboard\"/g), 'free',c(/route: \"\/free\//g));"`
Expected: `landing 6 dashlab 16 dash-extra 2 free 27`

Run: `cd app && npx tsc --noEmit 2>&1 | head -5`
Expected: 에러 없음 (기존 코드의 무관 에러가 나오면 works.ts 관련 에러만 0인지 확인)

- [ ] **Step 4: 커밋**

```bash
git add app/src/lib/works.ts
git commit -m "feat(gallery): 작품 메타 중앙 레지스트리 works.ts (51종)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: `/dash`·`/free` 레지스트리 import 교체 (렌더 불변)

**Files:**
- Modify: `app/src/app/dash/page.tsx` (배열 제거 → import)
- Modify: `app/src/app/free/page.tsx` (배열 제거 → import)

**Interfaces:**
- Consumes: Task 1의 `DASH_LAB_WORKS`, `FREE_WORKS`.
- Produces: 없음 (동작 불변이 계약).

- [ ] **Step 1: 교체 전 기준값 측정**

dev 서버(3100) 확인 후:
Run: `for r in /dash /free; do echo "$r: $(curl -s http://localhost:3100$r | grep -o 'href=\"'$r'/' | wc -l | tr -d ' ')"; done`
Expected: `/dash: 16`, `/free: 27` — 이 숫자를 기록해 둔다.

- [ ] **Step 2: dash/page.tsx 교체**

파일 상단에 `import { DASH_LAB_WORKS } from "@/lib/works";` 추가, `const works = [ ... ];` 블록 전체 삭제, 배열 사용처(`works.map` 등)를 `DASH_LAB_WORKS`로 치환. Card 컴포넌트·나머지 마크업은 일절 수정 금지.

- [ ] **Step 3: free/page.tsx 교체**

동일 패턴: `import { FREE_WORKS } from "@/lib/works";` + 로컬 배열 삭제 + 사용처 치환. (free 페이지의 로컬 배열 변수명은 파일에서 확인 — works 또는 유사명.)

- [ ] **Step 4: 회귀 검증**

Run: Step 1과 동일 명령.
Expected: `/dash: 16`, `/free: 27` — **완전 동일**. 다르면 이전 누락/중복이므로 Task 1 Step 3부터 재확인.

- [ ] **Step 5: 커밋**

```bash
git add app/src/app/dash/page.tsx app/src/app/free/page.tsx
git commit -m "refactor(gallery): dash·free 갤러리를 works.ts 레지스트리로 전환

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: `/gallery` 도록 페이지 구현

**Files:**
- Create: `app/src/app/gallery/page.tsx` (서버 — evolve fs 스캔 + 조립)
- Create: `app/src/app/gallery/gallery-client.tsx` (클라이언트 — 탭·크로스페이드)
- Create: `app/src/app/gallery/work-card.tsx` (클라이언트 — 카드·스켈레톤)

**Interfaces:**
- Consumes: Task 1의 `Work`, `LANDING_WORKS`, `DASH_WORKS`, `FREE_WORKS`, `LAST_UPDATED`.
- Produces: `/gallery` 라우트. `GalleryClient({ categories })`의 category 형태: `{ key: string; numeral: string; label: string; works: Work[] }`.

- [ ] **Step 1: page.tsx (서버 컴포넌트)**

```tsx
import type { Metadata } from "next";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { DASH_WORKS, FREE_WORKS, LANDING_WORKS, LAST_UPDATED, type Work } from "@/lib/works";
import { GalleryClient } from "./gallery-client";

export const metadata: Metadata = { title: "RE:PICK 전작 도록 — Collected Works" };

/** evolve/dash 브랜치 체크아웃에서만 존재하는 자율 루프 후보를 열거 (main/프로덕션 = 자동 숨김) */
function evolveWorks(): Work[] {
  const base = join(process.cwd(), "src/app/dash-evolve");
  if (!existsSync(base)) return [];
  const out: Work[] = [];
  for (const round of readdirSync(base).filter((d) => /^r\d+$/.test(d)).sort()) {
    for (const v of readdirSync(join(base, round)).sort()) {
      if (existsSync(join(base, round, v, "page.tsx"))) {
        out.push({ id: `${round}/${v}`, route: `/dash-evolve/${round}/${v}`, brand: `${round.toUpperCase()} · ${v.toUpperCase()}`, desc: "자율 진화 라운드 후보 — 주간 반증 대기 (미승격)" });
      }
    }
  }
  return out;
}

export default function GalleryPage() {
  const evolve = evolveWorks();
  const categories = [
    { key: "landing", numeral: "Ⅰ", label: "랜딩", works: LANDING_WORKS },
    { key: "dash", numeral: "Ⅱ", label: "SaaS 대시보드", works: DASH_WORKS },
    { key: "free", numeral: "Ⅲ", label: "자유 창작", works: FREE_WORKS },
    ...(evolve.length > 0 ? [{ key: "evolve", numeral: "Ⅳ", label: "자율 루프 후보", works: evolve }] : []),
  ];
  return <GalleryClient categories={categories} lastUpdated={LAST_UPDATED} />;
}
```

- [ ] **Step 2: gallery-client.tsx**

```tsx
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
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (idx + (e.key === "ArrowRight" ? 1 : categories.length - 1)) % categories.length;
    setActive(categories[next].key);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-10">
        {/* 도록 표지 */}
        <header>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
            Repick Design — Collected Works · <span className="tabular-nums">{total}</span> Works ·{" "}
            <span className="tabular-nums">{categories.length}</span> Sections · Rev <span className="tabular-nums">{lastUpdated}</span>
          </p>
          <h1 className="mt-5 text-5xl font-extrabold leading-[1.04] tracking-tight md:text-7xl">
            전작 도록<span className="align-top text-2xl font-bold text-zinc-300 md:text-3xl">*</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-500">
            랜딩·SaaS 대시보드·자유 창작 — 진화 루프가 축적한 모든 페이지를 한 지면에 수록한 카탈로그.
            카드는 실제 페이지의 라이브 미리보기입니다.
          </p>
        </header>

        {/* 목차 (탭) */}
        <nav role="tablist" aria-label="작품 카테고리" className="mt-12 flex flex-wrap gap-x-8 gap-y-1 border-b border-zinc-200">
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
                  selected ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <span className="font-mono text-xs">{c.numeral}</span>
                {c.label}
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-zinc-500">
                  {c.works.length}
                </span>
              </button>
            );
          })}
        </nav>

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
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
            Printed by autonomous evolution loop · repick-design
          </p>
        </footer>
      </div>
    </div>
  );
}
```

`globals.css`에 keyframes 1개 추가 (`app/src/app/globals.css` 말미):

```css
@keyframes gallery-fade {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: none; }
}
```

(진입 애니메이션은 from→to 완주형 — `opacity:0` 잔존 없음, `motion-reduce:animate-none`으로 게이팅.)

- [ ] **Step 3: work-card.tsx**

```tsx
"use client";

import { useState } from "react";
import type { Work } from "@/lib/works";

export function WorkCard({ work, numeral }: { work: Work; numeral: string }) {
  const [loaded, setLoaded] = useState(false);
  const h = work.previewH ?? 300;
  return (
    <a
      href={work.route}
      className="group block min-w-0 overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0"
    >
      <div className="relative w-full overflow-hidden border-b border-zinc-100 bg-zinc-50" style={{ height: h }}>
        {!loaded && (
          <div aria-hidden className="absolute inset-0 animate-pulse bg-gradient-to-b from-zinc-100 to-zinc-50 motion-reduce:animate-none" />
        )}
        <iframe
          src={work.route}
          loading="lazy"
          title={`${work.brand} 미리보기`}
          tabIndex={-1}
          scrolling="no"
          onLoad={() => setLoaded(true)}
          className={`pointer-events-none absolute left-0 top-0 origin-top-left transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          style={{ width: "1440px", height: "1100px", transform: "scale(0.34)", border: 0 }}
        />
      </div>
      <div className="flex items-start justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{work.brand}</p>
          <p className="mt-0.5 line-clamp-1 text-xs leading-relaxed text-zinc-500 transition-all group-hover:line-clamp-3">{work.desc}</p>
        </div>
        <span className="shrink-0 rounded-md bg-zinc-100 px-2 py-1 font-mono text-[11px] font-semibold tabular-nums text-zinc-600">
          {numeral}·{work.id}
        </span>
      </div>
    </a>
  );
}
```

- [ ] **Step 4: 동작 확인**

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3100/gallery`
Expected: 200

Run: `curl -s http://localhost:3100/gallery | grep -c "<iframe"`
Expected: `6` — 서버 렌더 HTML에 기본 탭(Ⅰ 랜딩, 6작품)의 iframe만 존재 (부하 제어 계약: 미선택 카테고리는 DOM에 없음)

- [ ] **Step 5: 커밋**

```bash
git add app/src/app/gallery/ app/src/app/globals.css
git commit -m "feat(gallery): 전작 도록 /gallery — 카테고리 탭 + 라이브 카드

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: 검증 게이트 일괄 실행

**Files:** 없음 (수정은 게이트 실패 시에만 — 실패한 항목을 고치고 해당 태스크 커밋에 fixup)

**Interfaces:**
- Consumes: Task 1~3 산출물 전부, `scripts/dash-sweep.mjs`·`scripts/dash-static-check.mjs`.
- Produces: 게이트 통과 기록 (Task 5의 폴리시 전제).

- [ ] **Step 1: 정적 검사** — Run: `node scripts/dash-static-check.mjs app/src/app/gallery/page.tsx app/src/app/gallery/gallery-client.tsx app/src/app/gallery/work-card.tsx app/src/lib/works.ts; echo exit=$?` / Expected: `[]` + exit=0
- [ ] **Step 2: 그리드 sweep** — Run: `node scripts/dash-sweep.mjs --base http://localhost:3100 --routes /gallery; echo exit=$?` / Expected: `"pass": true` + exit=0
- [ ] **Step 3: 빌드** — Run: `cd app && npx next build 2>&1 | tail -5` / Expected: 에러 없이 완료, `/gallery` 라우트 목록에 표시
- [ ] **Step 4: Lighthouse a11y** — Run: `npx -y lighthouse http://localhost:3100/gallery --only-categories=accessibility --preset=desktop --output=json --output-path=/tmp/lh-gallery.json --chrome-flags="--headless" >/dev/null 2>&1; node -e "const r=require('/tmp/lh-gallery.json');console.log('a11y', Math.round(r.categories.accessibility.score*100))"` / Expected: `a11y 95` 이상. 명령 자체가 실행 불가면 실패 사유를 리포트에 기록하고 진행(자율 루프와 동일한 unavailable 정책) — 단 수치가 나왔는데 95 미만이면 위반 항목(`r.categories.accessibility.auditRefs` 중 score<1)을 고쳐 재측정.
- [ ] **Step 5: 회귀 재확인** — Run: Task 2 Step 1 명령 / Expected: `/dash: 16`, `/free: 27`

---

### Task 5: /design-polish 폴리시 패스 + 배포

**Files:**
- Modify: `app/src/app/gallery/*` (폴리시가 제안하는 마감 수정 — 도록 방향의 의도된 미학은 존중)

**Interfaces:**
- Consumes: Task 4 통과 상태.
- Produces: 프로덕션 배포된 `/gallery`.

- [ ] **Step 1: 폴리시 실행** — 이 레포의 `/design-polish` 스킬을 `app/src/app/gallery` 대상으로 1회 실행 (4-검토 병렬: 타이포/스페이싱·인터랙션·접근성·시각 위계). 제안 중 도록 컨셉과 상충하지 않는 마감 항목만 적용.
- [ ] **Step 2: 게이트 재실행** — Task 4의 Step 1·2·3을 다시 실행, 전부 통과 확인.
- [ ] **Step 3: 커밋 + push (1회)**

```bash
git add app/src/app/gallery/
git commit -m "polish(gallery): 도록 폴리시 패스 — 프로덕션 마감

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
git push
```

- [ ] **Step 4: 배포 확인** — push 후 Vercel 자동 배포 대기(2~3분), Run: `curl -s -o /dev/null -w "%{http_code}\n" https://repick-design.vercel.app/gallery` / Expected: 200. 이때 프로덕션 HTML에 evolve 탭이 **없는지**도 확인: `curl -s https://repick-design.vercel.app/gallery | grep -c "자율 루프 후보"` → `0`.

---

## Self-Review 결과

- **Spec coverage**: §2 레지스트리→Task 1, §2 기존 페이지 교체→Task 2, §3 시각/완성도(도록 표지·목차·카드·인터랙션 3종: 크로스페이드/카드 hover/스켈레톤/키보드 내비 = 4종 구현)→Task 3, §4 evolve 동적 탭→Task 3 Step 1, §6 검증 1~7→Task 4(1~6번)+Task 5(7번 폴리시), §7 비범위 준수.
- **인벤토리 판정 기록**: /lab 제외(자체 인덱스), pages/ 제외(main 부재) — works.ts 주석에 명시 (Task 1).
- **타입 일관성**: `Work`·category 형태·export 명칭이 Task 1 Interfaces와 Task 3 코드에서 일치 확인.
