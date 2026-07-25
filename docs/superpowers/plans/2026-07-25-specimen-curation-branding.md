# Specimen Curation + Branding (G2.5) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Curate the Specimen gallery down to 15 fully-specced works, replace type-based filters with 7 domain categories, and swap the browser/header logo from the old "RE:" mark to a Specimen brand mark.

**Architecture:** Three sequential tasks, each leaving a green build. (1) Trim the works arrays + assign per-work domain `category` + rewire filters — the visible cull. (2) Delete the orphaned route directories and now-unused works.ts exports. (3) Replace `icon.svg` / remove `favicon.ico` / add a small header mark. No new runtime deps; verification is `next build` + curl smokes (this repo has no React component test harness).

**Tech Stack:** Next.js 16.2.10 (App Router, React 19), Tailwind CSS v4, TypeScript, SVG favicon (file-based metadata).

## Global Constraints

- **This is Next.js 16 (App Router), NOT training-data Next.js** (`app/AGENTS.md`). File-based icons: `app/src/app/icon.svg` + `app/src/app/favicon.ico` are auto-served as favicons; no `icons:` field in metadata.
- **Kept set = exactly these 15 ids** (each already has a full spec in `specimen-specs.data.json`): d29 d30 d31 d32 d33 d34 d35 d36 d37 d38 v0 v6 v7 v8 n1.
- **7 domain categories:** `project · scheduling · ops · finance · analytics · landing · mobile`. Filter chips = `All` + those 7. No `winners`/`dashboard`/`free`/`native` filter keys remain.
- **Domain assignment:** d29,d33→project · d30→scheduling · d31,d34,d38→ops · d32,d35→finance · d36,d37→analytics · v0,v6,v7,v8→landing · n1→mobile.
- **Load-bearing routes to KEEP:** `/` (`(marketing)/page.tsx` = champion landing v0), `/dashboard` (`app/src/app/dashboard/` — linked by `(marketing)/landing-client.tsx` CTAs ×4), `/dash` index (`app/src/app/dash/page.tsx` — imports `DASH_LAB_WORKS`, will show the kept 10).
- **Deep-spec content English-only; page chrome bilingual EN/KO** (`gallery-i18n.ts`).
- Determinism: no `Date.now()`/`Math.random()`/`new Date()`.
- Verification: `cd app && npx next build` (succeeds; `/gallery/[id]` SSG = 15) + curl smokes. `node --test "scripts/**/*.test.mjs"` must stay green.
- Surgical: only the files each task names. Don't restyle untouched files. Individual kept work routes (dash/d29–d38, marketing v6–v8, dashboard) are NOT edited.

---

### Task 1: Cull works + domain categories + filter rewire

Trim the works arrays to the 15 kept works, give each a domain `category`, switch `catalogWorks()` to spread the trimmed arrays, and rewire the filter chips to the 7 domains (drop `winners`). Leaves `FREE_WORKS`/`DASH_WORKS` still defined (Task 2 deletes them) so the still-present `/free` and `/dash` indexes keep compiling.

**Files:**
- Modify: `app/src/lib/works.ts` (Work.category type, LANDING_WORKS, DASH_LAB_WORKS, NATIVE_WORKS, catalogWorks)
- Modify: `app/src/app/gallery/gallery-i18n.ts` (FilterKey, Strings.filters, STRINGS.en/ko)
- Modify: `app/src/app/gallery/gallery-client.tsx` (FilterKey, FILTERS, filter logic)

**Interfaces:**
- Produces: `Work.category: "project"|"scheduling"|"ops"|"finance"|"analytics"|"landing"|"mobile"` (optional); `catalogWorks(): Work[]` (now exactly 15, each with its own `category`).

- [ ] **Step 1: Retype `Work.category` in works.ts**

In `app/src/lib/works.ts`, replace the category line in the `Work` type:
```ts
  category?: "dashboard" | "landing" | "free" | "native"; // 갤러리 필터/태그(page.tsx 조립 시 태깅)
```
with:
```ts
  category?: "project" | "scheduling" | "ops" | "finance" | "analytics" | "landing" | "mobile"; // 갤러리 도메인 카테고리(작품별 부여)
```

- [ ] **Step 2: Trim LANDING_WORKS to v0/v6/v7/v8 with categories**

Replace the entire `LANDING_WORKS` array (remove v1–v5; add `category: "landing"` to each kept entry). Keep the existing `route`/`brand`/`desc`/`previewH` values byte-for-byte — only drop v1–v5 and append `category`:
```ts
export const LANDING_WORKS: Work[] = [
  { id: "v0", route: "/", brand: "V0 — Champion", desc: { ko: "현재 프로덕션 랜딩 · 에디토리얼 스플릿 히어로 + 제품 쇼케이스 (자동 라운드 R7 계보 승자)", en: "Live production landing · editorial split hero + product showcase (auto-round R7 lineage winner)" }, previewH: 340, category: "landing" },
  { id: "v6", route: "/v6", brand: "V6 리빌", desc: { ko: "비포/애프터 드래그 리빌 히어로 · 실제 제품사진 슬라이더(role=slider)·스프링 물리, 감각 축 차별 (자동 landing r2 승자)", en: "Before/after drag-to-reveal hero · a real product-photo slider (role=slider) with spring physics, differentiating on tactile feel (auto landing r2 winner)" }, previewH: 340, category: "landing" },
  { id: "v7", route: "/v7", brand: "V7 대조표", desc: { ko: "AI 매칭 대조표 히어로 · 실 table+탭+아코디언 비교 위젯, 폼 계열 최초 표 기반 (자동 landing r4 승자)", en: "AI-match comparison-table hero · a real table + tabs + accordion widget, the form lineage's first table-based entry (auto landing r4 winner)" }, previewH: 340, category: "landing" },
  { id: "v8", route: "/v8", brand: "V8 다이얼", desc: { ko: "매칭 정확도 다이얼 히어로 · 원형 SVG 게이지 결과 시각화, 형태 신규성 (자동 landing r5 승자)", en: "Match-accuracy dial hero · a circular SVG gauge visualizes the result, a formal novelty (auto landing r5 winner)" }, previewH: 340, category: "landing" },
];
```

- [ ] **Step 3: Trim DASH_LAB_WORKS to d29–d38 with domain categories**

Replace the entire `DASH_LAB_WORKS` array (remove d7–d28; append the domain `category` to each kept entry). Keep each kept entry's existing `route`/`brand`/`desc` byte-for-byte:
```ts
export const DASH_LAB_WORKS: Work[] = [
  { id: "d29", route: "/dash/d29", brand: "Waypoint", desc: { ko: "프로젝트 협업(Asana급) · 순백 라이트, 프로젝트 필터→전 위젯 동기화, 정렬 테이블·간트·워크로드·⌘K", en: "Project collaboration (Asana-grade) · pure-white light, project filter → all-widget sync, sortable table · gantt · workload · ⌘K" }, category: "project" },
  { id: "d30", route: "/dash/d30", brand: "Slotted", desc: { ko: "예약·미팅 스케줄링(Calendly급) · 순백 라이트, 이벤트타입 선택→히트맵·미팅목록 동기화, ⌘K·정렬 테이블", en: "Booking and meeting scheduling (Calendly-grade) · pure-white light, event-type selection syncs heatmap and meeting list, ⌘K and sortable tables" }, category: "scheduling" },
  { id: "d31", route: "/dash/d31", brand: "Conduit", desc: { ko: "워크플로 자동화(n8n급) · 프로덕트 다크, 크로스헤어 차트·상태 필터→테이블·로그 동기화, 에러 급증 알림", en: "Workflow automation (n8n-grade) · product dark, crosshair chart and status filter sync table and log, error-spike alerts" }, category: "ops" },
  { id: "d32", route: "/dash/d32", brand: "Meridian", desc: { ko: "자산 포트폴리오(Coinbase급) · 프로덕트 다크, 기간 토글 가격 차트·자산 선택→차트·상세 동기화, 배분 도넛", en: "Asset portfolio (Coinbase-grade) · product dark, period-toggle price chart, asset selection syncs chart and detail, allocation donut" }, category: "finance" },
  { id: "d33", route: "/dash/d33", brand: "Keel", desc: { ko: "협업 칸반 파이프라인 · 뷰포트락 보드+컬럼 내부 스크롤, 딜 카드 드래그, 예측 차트 (자동 dash r1 승자)", en: "Collaborative kanban pipeline · viewport-locked board with per-column scroll, draggable deal cards, forecast chart (auto dash r1 winner)" }, category: "project" },
  { id: "d34", route: "/dash/d34", brand: "Pulse", desc: { ko: "SLA 라이브옵스 콘솔 · 다크 히어로+벤토, 레일 없는 밀도형 (자동 dash r2 승자)", en: "SLA live-ops console · dark hero + bento layout, a rail-free, high-density build (auto dash r2 winner)" }, category: "ops" },
  { id: "d35", route: "/dash/d35", brand: "Tessera", desc: { ko: "자산배분 트리맵 콕핏 · 중첩 사각 비중 시각화, 즉시 가독 (자동 dash r7 승자)", en: "Asset-allocation treemap cockpit · nested rectangles visualize weighting, instantly legible (auto dash r7 winner)" }, category: "finance" },
  { id: "d36", route: "/dash/d36", brand: "Chute", desc: { ko: "전환 퍼널 전용 페이지 · 트라페조이드 퍼널이 페이지 축, 단계 드롭오프 (자동 dash r8 승자)", en: "A page built around the conversion funnel · a trapezoid funnel forms the page's spine, stage-by-stage drop-off (auto dash r8 winner)" }, category: "analytics" },
  { id: "d37", route: "/dash/d37", brand: "Currents", desc: { ko: "수익귀속 생키 흐름도 · 흐름보존 다단 리본 콘솔 (자동 dash r9 승자)", en: "Revenue-attribution Sankey diagram · a flow-conserving, multi-stage ribbon console (auto dash r9 winner)" }, category: "analytics" },
  { id: "d38", route: "/dash/d38", brand: "Wavelength", desc: { ko: "온콜 로테이션 콘솔 · 24h 레이디얼 다이얼 지배 시각화, 인시던트 대응 (자동 dash r10 승자)", en: "On-call rotation console · dominated by a 24h radial-dial visualization, built for incident response (auto dash r10 winner)" }, category: "ops" },
];
```

- [ ] **Step 4: Add category to NATIVE_WORKS (n1)**

In `NATIVE_WORKS`, append `, category: "mobile"` to the n1 entry object (before its closing `}`). The entry already has `target: "native"` — leave that; just add the `category` field.

- [ ] **Step 5: Rewrite catalogWorks() to spread trimmed arrays**

Replace the entire `catalogWorks()` function:
```ts
/** 정적 카탈로그(진화 후보 제외) — 갤러리 그리드 + 상세 라우트 공용. 각 entry가 자기 도메인 category 보유. */
export function catalogWorks(): Work[] {
  return [...LANDING_WORKS, ...DASH_LAB_WORKS, ...NATIVE_WORKS];
}
```
(Removes the four `.map(w => ({...w, category}))` spreads and the `FREE_WORKS`/`DASH_WORKS` references. `FREE_WORKS` and `DASH_WORKS` remain defined for now — Task 2 deletes them.)

- [ ] **Step 6: Rewrite the filter dictionary in gallery-i18n.ts**

In `app/src/app/gallery/gallery-i18n.ts`, replace the `FilterKey` type:
```ts
type FilterKey = "all" | "project" | "scheduling" | "ops" | "finance" | "analytics" | "landing" | "mobile";
```
Replace `STRINGS.en.filters`:
```ts
    filters: { all: "All", project: "Project", scheduling: "Scheduling", ops: "Ops", finance: "Finance", analytics: "Analytics", landing: "Landing", mobile: "Mobile" },
```
Replace `STRINGS.ko.filters`:
```ts
    filters: { all: "전체", project: "프로젝트", scheduling: "일정", ops: "운영", finance: "금융", analytics: "분석", landing: "랜딩", mobile: "모바일" },
```
(`categoryLabel()` needs no change — it already reads `STRINGS[lang].filters[cat]`.)

- [ ] **Step 7: Rewire FILTERS + filter logic in gallery-client.tsx**

In `app/src/app/gallery/gallery-client.tsx`, replace the local `FilterKey` type + `FILTERS` const:
```ts
type FilterKey = "all" | "project" | "scheduling" | "ops" | "finance" | "analytics" | "landing" | "mobile";
const FILTERS: FilterKey[] = ["all", "project", "scheduling", "ops", "finance", "analytics", "landing", "mobile"];
```
Replace the filter predicate inside `shown` (drop the `winners` branch):
```ts
  const shown = works.filter((w) => {
    if (filter !== "all" && w.category !== filter) return false;
    if (q && !`${w.brand} ${w.desc.en} ${w.desc.ko}`.toLowerCase().includes(q)) return false;
    return true;
  });
```

- [ ] **Step 8: Verify build + gallery state**

Run: `cd app && npx next build`
Expected: succeeds; `/gallery/[id]` prerenders exactly 15 static paths.

- [ ] **Step 9: Smoke the gallery + filters + /dash**

Run: `cd app && (npx next start -p 3100 &) && sleep 4 && echo "cards:" && curl -s localhost:3100/gallery | grep -oE 'href="/gallery/[a-z0-9]+"' | sort -u | wc -l && echo "chips:" && curl -s localhost:3100/gallery | grep -oE '>(All|Project|Scheduling|Ops|Finance|Analytics|Landing|Mobile)<' | sort -u | wc -l && echo "winners chip present?" && curl -s localhost:3100/gallery | grep -c ">Winners<" && curl -s -o /dev/null -w "dash:%{http_code}\n" localhost:3100/dash && kill %1 2>/dev/null`
Expected: cards = 15, chips = 8 (All + 7), winners chip = 0, dash:200.

- [ ] **Step 10: Commit**

```bash
git add app/src/lib/works.ts app/src/app/gallery/gallery-i18n.ts app/src/app/gallery/gallery-client.tsx
git commit -m "feat(gallery): Specimen 15작품 큐레이션 + 도메인 카테고리 7종 (Winners 칩 제거)"
```

---

### Task 2: Delete orphaned routes + unused works.ts exports

Remove the culled work route directories and the now-unused `FREE_WORKS`/`DASH_WORKS`/`rg`/`app` works.ts entries. All targets verified to have no references outside the gallery.

**Files:**
- Delete (dirs): `app/src/app/free/`, `app/src/app/dash/{d7,d9,d12,d16,d20,d22,d23,d24,d25,d26,d27,d28}/`, `app/src/app/dash-rg/`, `app/src/app/(marketing)/{v1,v2,v3,v4,v5,lab}/`
- Modify: `app/src/lib/works.ts` (remove FREE_WORKS export; remove DASH_WORKS export + `rg` + `app` entries)

**Interfaces:**
- Consumes: `catalogWorks()` no longer references FREE_WORKS/DASH_WORKS (Task 1). `/dash` imports `DASH_LAB_WORKS` (untouched). `/free` index is deleted here (its only `FREE_WORKS` consumer).

- [ ] **Step 1: Delete the culled route directories**

```bash
cd /Users/yss/개발/build/repick-design
git rm -r app/src/app/free
git rm -r app/src/app/dash/d7 app/src/app/dash/d9 app/src/app/dash/d12 app/src/app/dash/d16 app/src/app/dash/d20 app/src/app/dash/d22 app/src/app/dash/d23 app/src/app/dash/d24 app/src/app/dash/d25 app/src/app/dash/d26 app/src/app/dash/d27 app/src/app/dash/d28
git rm -r app/src/app/dash-rg
git rm -r "app/src/app/(marketing)/v1" "app/src/app/(marketing)/v2" "app/src/app/(marketing)/v3" "app/src/app/(marketing)/v4" "app/src/app/(marketing)/v5" "app/src/app/(marketing)/lab"
```

- [ ] **Step 2: Remove FREE_WORKS from works.ts**

Delete the entire `FREE_WORKS` block (the `// Ⅲ 자유 창작 …` comment line through the closing `];` of the array, plus the trailing `// 인벤토리 제외 기록 …` comment if it only documents removed works — keep it only if still accurate). Confirm no other file imports `FREE_WORKS` (the `/free` index that did was deleted in Step 1).

- [ ] **Step 3: Remove DASH_WORKS + rg + app from works.ts**

Delete the `DASH_WORKS` export block:
```ts
export const DASH_WORKS: Work[] = [
  ...DASH_LAB_WORKS,
  { id: "rg", route: "/dash-rg", brand: "Ridge", desc: { ... } },
  { id: "app", route: "/dashboard", brand: "App — Dashboard", desc: { ... } },
];
```
(These `rg`/`app` entries live only inside `DASH_WORKS`; deleting the block removes them. `/dashboard` route is a separate directory and stays live.)

- [ ] **Step 4: Verify build + deleted vs kept routes**

Run: `cd app && npx next build`
Expected: succeeds (no missing-import / unresolved-reference errors). `/gallery/[id]` still 15 paths; `/dash`, `/dashboard`, `/`, `/v6`,`/v7`,`/v8`, `/dash/d29`…`d38` still build; no `/free/*`, `/v1`…`/v5`, `/lab`, `/dash-rg`, `/dash/d7`…`d28` in the route manifest.

- [ ] **Step 5: Smoke deleted (404) vs kept (200)**

Run: `cd app && (npx next start -p 3100 &) && sleep 4 && for p in /free/f1 /v1 /lab /dash-rg /dash/d7; do curl -s -o /dev/null -w "$p %{http_code}\n" localhost:3100$p; done && for p in / /dashboard /dash /gallery/d29 /v6; do curl -s -o /dev/null -w "$p %{http_code}\n" localhost:3100$p; done && kill %1 2>/dev/null`
Expected: deleted paths → 404; kept paths → 200.

- [ ] **Step 6: Confirm no dangling references + tests green**

Run: `cd /Users/yss/개발/build/repick-design && grep -rn "FREE_WORKS\|DASH_WORKS\|dash-rg\|/free/f\|(marketing)/lab" app/src 2>/dev/null | grep -v "node_modules"; node --test "scripts/**/*.test.mjs" 2>&1 | grep -E "^# (tests|pass|fail)"`
Expected: grep prints nothing (no dangling refs); tests pass, fail 0.

- [ ] **Step 7: Commit**

```bash
git add -A app/src
git commit -m "chore(gallery): Specimen 이전 작품 정리 — free/구세대 dash/v1~v5·lab·dash-rg 라우트+메타 삭제"
```

---

### Task 3: Specimen brand mark (favicon + header)

Replace the "RE:" favicon with a Specimen "S" mark, remove the stale `favicon.ico`, and add a small mark to the gallery header wordmark lockup.

**Files:**
- Modify: `app/src/app/icon.svg`
- Delete: `app/src/app/favicon.ico`
- Modify: `app/src/app/gallery/gallery-client.tsx` (header wordmark lockup)

- [ ] **Step 1: Replace icon.svg with the Specimen "S" mark**

Overwrite `app/src/app/icon.svg` with:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="22" fill="#18181b"/>
  <text x="50" y="50" dy="0.34em" text-anchor="middle"
        font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
        font-size="60" font-weight="700" fill="#ffffff">S</text>
</svg>
```

- [ ] **Step 2: Remove the stale favicon.ico**

```bash
git rm app/src/app/favicon.ico
```
(Next 16 serves `icon.svg` as the favicon via file-based metadata; modern browsers use the SVG. No regeneration needed.)

- [ ] **Step 3: Add the mark to the gallery header wordmark**

In `app/src/app/gallery/gallery-client.tsx`, wrap the `<h1>Specimen</h1>` (currently a standalone `<h1 className="mt-4 …">Specimen</h1>`) in a lockup with the mark. Replace that `<h1>` line with:
```tsx
              <div className="mt-4 flex items-center gap-3">
                <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-zinc-900 font-mono text-2xl font-bold text-white">S</span>
                <h1 className="text-5xl font-extrabold leading-[1.04] tracking-tight md:text-6xl">Specimen</h1>
              </div>
```
(The tagline `<p>` directly below stays unchanged.)

- [ ] **Step 4: Verify build + favicon/mark**

Run: `cd app && npx next build`
Expected: succeeds.

- [ ] **Step 5: Smoke the mark + no "RE:" residue**

Run: `cd app && (npx next start -p 3100 &) && sleep 4 && echo "icon.svg has RE:?" && curl -s localhost:3100/icon.svg | grep -c "RE:" && echo "icon.svg has S mark?" && curl -s localhost:3100/icon.svg | grep -c ">S<" && echo "old favicon.ico gone?" && curl -s -o /dev/null -w "%{http_code}\n" localhost:3100/favicon.ico && echo "header mark on /gallery?" && curl -s localhost:3100/gallery | grep -oE 'rounded-xl bg-zinc-900[^"]*">S<' | head -1 && kill %1 2>/dev/null`
Expected: icon.svg "RE:" = 0, ">S<" ≥ 1, favicon.ico → 404 (removed), header mark match printed.

- [ ] **Step 6: Commit**

```bash
git add app/src/app/icon.svg app/src/app/gallery/gallery-client.tsx
git commit -m "feat(brand): Specimen 브랜드 마크 — icon.svg S 레터마크 교체·favicon.ico 제거·헤더 록업"
```

---

## Self-Review

**1. Spec coverage:**
- §3 cull to 15 + domain categories → Task 1 (arrays + catalogWorks + categories). ✅
- §3.4 route directory deletion → Task 2 Step 1. ✅
- §3.2 works.ts edits (trim arrays, delete FREE_WORKS/DASH_WORKS/rg/app) → Task 1 (trims) + Task 2 (deletions). ✅
- §3.5 keep `/`, `/dashboard`, `/dash` → Global Constraints + Task 2 Step 5 smoke. ✅
- §4 domain filters + remove Winners + i18n → Task 1 Steps 6–7. ✅
- §5 icon.svg replace + favicon.ico remove + header mark → Task 3. ✅
- §6 verification (build, 404/200, i18n, favicon, node --test) → each task's smoke steps. ✅
- §3.6 "coming soon" branch kept → no task removes it (untouched, correct). ✅

**2. Placeholder scan:** Task 2 Step 3's `desc: { ... }` is an elision of the existing `rg`/`app` desc objects the implementer is DELETING (not writing) — the instruction is "delete the whole DASH_WORKS block", so the elision is safe (no new content needed). No `TBD`/`TODO`/vague directives elsewhere; every code step has concrete content.

**3. Type consistency:** `Work.category` domain union (Task 1 Step 1) matches the per-entry `category` values (Steps 2–4), the `FilterKey` in both `gallery-i18n.ts` (Step 6) and `gallery-client.tsx` (Step 7), and the `STRINGS.filters` keys (Step 6). `catalogWorks(): Work[]` signature unchanged (only body). `categoryLabel(cat, lang)` still resolves via `STRINGS[lang].filters[cat]` for every domain.
