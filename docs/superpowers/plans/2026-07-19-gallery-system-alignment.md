# /gallery 시스템 정합 재설계 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** /gallery가 새 시스템 기준(정제 인터랙션·생성형 에셋·하드게이트 통과)을 체현하고, Ⅳ 자율 루프 후보 탭에 auto-ledger 기반 승자/탈락/대기 배지 + 라운드 그룹핑을 주입.

**Architecture:** status 판정을 순수 함수(`evolve-status.ts`)로 분리해 TDD, page.tsx는 ledger 파일을 읽어 후보에 status 부착, gallery-client는 Ⅳ 탭만 라운드 그룹핑 + 승자 필터, 생성형 SVG 표지 마크 신설. 갤러리 자체가 static-check·sweep·a11y 게이트를 통과(도그푸딩).

**Tech Stack:** Node ESM + node:test(순수 함수), Next.js 16 App Router(src-dir, `@/*`=`src/*`), Tailwind v4, TS.

**Spec:** `docs/superpowers/specs/2026-07-19-gallery-system-alignment-design.md`

## Global Constraints

- 순백 도록 미학 유지(bg-white·zinc 계열), Pretendard 단일, tabular-nums, 이모지·세리프 금지. 정제된 인터랙션만(dash 절제선 — 연극적 연출 금지).
- 결정론: `Math.random`/`Date.now`/인자 없는 `new Date()` 금지. SVG 좌표 소수 2자리 반올림.
- 부하 제어 계약 유지: 선택된 탭만 마운트. 카드 그리드 `min-w-0`, 390~1920 전 폭 오버플로 금지.
- a11y: 단일 h1, tablist(←/→/Home/End) 유지, 필터 세그먼트 role=group·aria-pressed, focus-visible 링, 대비 AA.
- ledger 경로: gallery page의 `process.cwd()`는 `app/` 이므로 vault는 `join(cwd, "..", "vault", "30-ledger", "auto-ledger.jsonl")`.
- 커밋: conventional + 한국어 + `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` 푸터. **push는 Task 5(컨트롤러)** — main push는 프로덕션 자동 배포.
- dev 서버 3100 재사용(재기동 금지, 500/미응답이면 종료 후 `rm -rf app/.next` 재기동). Task 4(스모크)만 evolve/dash, 나머지 main.

---

### Task 1: status 판정 순수 함수 `evolve-status.ts` (TDD) + Work 타입 확장

**Files:**
- Create: `app/src/lib/evolve-status.ts`
- Create: `app/src/lib/evolve-status.test.mjs`
- Modify: `app/src/lib/works.ts` (Work 타입에 optional 필드)

**Interfaces:**
- Produces: `type RoundInfo = { winner: string | null; noWinner: boolean; date?: string }`; `parseLedger(text: string) → Map<string, RoundInfo>` (round id 키, **같은 round 뒤 줄이 앞 줄 override** — refuted 최신 줄 유효); `type CandidateStatus = "winner" | "dropped" | "pending"`; `candidateStatus(round, variant, map) → CandidateStatus`. `Work`에 `status?: CandidateStatus`·`round?: string`·`target?: "dash"|"landing"`·`date?: string` 추가. Task 2가 소비.

- [ ] **Step 1: 실패 테스트 작성** — `app/src/lib/evolve-status.test.mjs`

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseLedger, candidateStatus } from './evolve-status.ts';

const LEDGER = [
  JSON.stringify({ target: 'dash', round: 'auto-dash-r7', date: '2026-07-19', winner: 'b', no_winner: false }),
  JSON.stringify({ round: 'auto-dash-r1', winner: 'b', no_winner: false }), // 레거시(target 없음)
  JSON.stringify({ target: 'landing', round: 'auto-landing-r2', date: '2026-07-19', winner: null, no_winner: true }),
  '',
  '{ 깨진 json',
].join('\n');

test('parseLedger: 유효 줄만 파싱, round 키로 매핑', () => {
  const m = parseLedger(LEDGER);
  assert.equal(m.size, 3);
  assert.deepEqual(m.get('auto-dash-r7'), { winner: 'b', noWinner: false, date: '2026-07-19' });
  assert.equal(m.get('auto-landing-r2').noWinner, true);
});

test('parseLedger: 같은 round는 뒤 줄이 override (refuted 최신 유효)', () => {
  const t = [
    JSON.stringify({ round: 'auto-dash-r3', winner: 'a', no_winner: false }),
    JSON.stringify({ round: 'auto-dash-r3', winner: 'a', no_winner: false, refuted: true }),
  ].join('\n');
  const m = parseLedger(t);
  assert.equal(m.size, 1);
  assert.equal(m.get('auto-dash-r3').winner, 'a'); // 최신 줄 반영
});

test('candidateStatus: 승자/탈락/대기 판정', () => {
  const m = parseLedger(LEDGER);
  assert.equal(candidateStatus('auto-dash-r7', 'b', m), 'winner');
  assert.equal(candidateStatus('auto-dash-r7', 'a', m), 'dropped');
  assert.equal(candidateStatus('auto-landing-r2', 'a', m), 'pending'); // no_winner
  assert.equal(candidateStatus('auto-dash-r99', 'a', m), 'pending'); // ledger 없음
});
```

- [ ] **Step 2: 실패 확인** — Run: `cd app && node --test src/lib/evolve-status.test.mjs` / Expected: FAIL (모듈 없음). 주의: `.ts` import를 node:test가 실행하려면 Node 22의 타입 스트립이 필요 — 안 되면 테스트 import를 `./evolve-status.ts`가 아니라 실행 가능한 형태로: **evolve-status는 순수 TS지만 타입 어노테이션 최소화**하고, Node 22 `--experimental-strip-types`가 기본 동작. 실행 커맨드에서 실패하면 `node --experimental-strip-types --test src/lib/evolve-status.test.mjs` 사용.

- [ ] **Step 3: 구현** — `app/src/lib/evolve-status.ts`

```ts
export type RoundInfo = { winner: string | null; noWinner: boolean; date?: string };
export type CandidateStatus = "winner" | "dropped" | "pending";

export function parseLedger(text: string): Map<string, RoundInfo> {
  const map = new Map<string, RoundInfo>();
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    let e: { round?: unknown; winner?: unknown; no_winner?: unknown; date?: unknown };
    try {
      e = JSON.parse(t);
    } catch {
      continue;
    }
    if (!e || typeof e.round !== "string") continue;
    map.set(e.round, {
      winner: typeof e.winner === "string" ? e.winner : null,
      noWinner: e.no_winner === true,
      date: typeof e.date === "string" ? e.date : undefined,
    });
  }
  return map;
}

export function candidateStatus(round: string, variant: string, map: Map<string, RoundInfo>): CandidateStatus {
  const info = map.get(round);
  if (!info || info.noWinner) return "pending";
  return info.winner === variant ? "winner" : "dropped";
}
```

- [ ] **Step 4: works.ts 타입 확장** — `Work` 타입에 필드 추가 (기존 필드 유지):

```ts
export type Work = {
  id: string;
  route: string;
  brand: string;
  desc: string;
  previewH?: number;
  status?: "winner" | "dropped" | "pending";
  round?: string;
  target?: "dash" | "landing";
  date?: string;
};
```

- [ ] **Step 5: 테스트 통과** — Run: `cd app && node --test src/lib/evolve-status.test.mjs` (안 되면 `--experimental-strip-types` 추가) / Expected: 3 PASS. + repo 루트 `npm test` 회귀(기존 스크립트 테스트 영향 없음 — app 하위라 무관, 그래도 실행해 확인).

- [ ] **Step 6: 커밋**

```bash
git add app/src/lib/evolve-status.ts app/src/lib/evolve-status.test.mjs app/src/lib/works.ts
git commit -m "feat(gallery): evolve 후보 status 판정 순수함수 + Work 타입 확장

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: page.tsx evolveWorks — ledger 읽어 status 부착

**Files:**
- Modify: `app/src/app/gallery/page.tsx` (evolveWorks 함수 교체)

**Interfaces:**
- Consumes: Task 1의 `parseLedger`·`candidateStatus`, `Work` 확장 필드.
- Produces: evolveWorks가 각 후보에 status·round·target·date 부착. Task 3(client)이 이 필드로 그룹핑·배지.

- [ ] **Step 1: evolveWorks 교체** — import 추가(`readFileSync`, evolve-status) + 함수 교체:

```tsx
import type { Metadata } from "next";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { DASH_WORKS, FREE_WORKS, LANDING_WORKS, LAST_UPDATED, type Work } from "@/lib/works";
import { parseLedger, candidateStatus } from "@/lib/evolve-status";
import { GalleryClient } from "./gallery-client";

export const metadata: Metadata = { title: "RE:PICK 전작 도록 — Collected Works" };

/** evolve/dash 브랜치 체크아웃에서만 존재하는 자율 루프 후보를 열거 (main/프로덕션 = 자동 숨김) */
function evolveWorks(): Work[] {
  const ledgerPath = join(process.cwd(), "..", "vault", "30-ledger", "auto-ledger.jsonl");
  const ledger = existsSync(ledgerPath) ? parseLedger(readFileSync(ledgerPath, "utf8")) : new Map();
  const out: Work[] = [];
  for (const [dir, label, target] of [
    ["dash-evolve", "DASH", "dash"],
    ["landing-evolve", "LANDING", "landing"],
  ] as const) {
    const base = join(process.cwd(), "src/app", dir);
    if (!existsSync(base)) continue;
    const rounds = readdirSync(base)
      .filter((d) => /^r\d+$/.test(d))
      .sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
    for (const round of rounds) {
      const ledgerRound = `auto-${target}-${round}`;
      const info = ledger.get(ledgerRound);
      for (const v of readdirSync(join(base, round)).sort()) {
        if (existsSync(join(base, round, v, "page.tsx"))) {
          out.push({
            id: `${target}-${round}/${v}`,
            route: `/${dir}/${round}/${v}`,
            brand: `${label} ${round.toUpperCase()} · ${v.toUpperCase()}`,
            desc: "자율 진화 라운드 후보",
            status: candidateStatus(ledgerRound, v, ledger),
            round: ledgerRound,
            target,
            date: info?.date,
          });
        }
      }
    }
  }
  return out;
}
```

(`GalleryPage` 본체는 무변경 — categories 조립·evolve 탭 조건부는 그대로.)

- [ ] **Step 2: 타입 확인** — Run: `cd app && npx tsc --noEmit 2>&1 | head -5` / Expected: 0 에러 (`target` 리터럴이 `"dash"|"landing"`로 좁혀지는지 — `as const` 튜플 3요소).

- [ ] **Step 3: main 동작(회귀)** — main엔 evolve 디렉토리 없음: Run: `curl -s http://localhost:3100/gallery | grep -c "자율 루프 후보"` / Expected: `0` (Ⅳ 탭 미노출, ledger 읽어도 후보 0).

- [ ] **Step 4: 커밋**

```bash
git add app/src/app/gallery/page.tsx
git commit -m "feat(gallery): evolveWorks가 auto-ledger 읽어 승패 status 부착

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: UI — 라운드 그룹핑·승자 필터·status 배지·표지 마크

**Files:**
- Modify: `app/src/app/gallery/gallery-client.tsx` (Ⅳ 탭 그룹핑 + 필터 + 표지 마크 렌더)
- Modify: `app/src/app/gallery/work-card.tsx` (status 배지)
- Create: `app/src/app/gallery/collection-mark.tsx` (생성형 SVG)

**Interfaces:**
- Consumes: Task 1/2의 Work.status·round·target·date.
- Produces: 없음(최종 UI).

- [ ] **Step 1: collection-mark.tsx 생성** (결정론적 생성형 SVG — 카테고리별 작품 수 도트 스트립)

```tsx
export function CollectionMark({ sections }: { sections: { label: string; count: number }[] }) {
  const TICK = 3;
  const GAP = 2;
  const GROUP_GAP = 12;
  const H = 20;
  const rects: { x: number }[] = [];
  let x = 0;
  sections.forEach((s, si) => {
    for (let i = 0; i < s.count; i++) {
      rects.push({ x: Number(x.toFixed(2)) });
      x += TICK + GAP;
    }
    if (si < sections.length - 1) x += GROUP_GAP;
  });
  const width = Number(Math.max(x - GAP, TICK).toFixed(2));
  return (
    <svg
      aria-hidden="true"
      width={width}
      height={H}
      viewBox={`0 0 ${width} ${H}`}
      className="mt-6 h-5 max-w-full text-zinc-300"
      preserveAspectRatio="xMinYMid meet"
    >
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={0} width={TICK} height={H} rx={1} className="fill-current" />
      ))}
    </svg>
  );
}
```

- [ ] **Step 2: work-card.tsx에 status 배지 추가** — 배지 클러스터를 세로 스택으로 바꾸고 status 배지를 id 배지 위에:

work-card.tsx의 하단 캡션 `<div className="flex items-start justify-between...">` 안 오른쪽 `<span>{numeral}·{work.id}</span>`를 아래로 교체:

```tsx
        <div className="flex shrink-0 flex-col items-end gap-1">
          {work.status && <StatusBadge status={work.status} />}
          <span className="rounded-md bg-zinc-100 px-2 py-1 font-mono text-[11px] font-semibold tabular-nums text-zinc-600">
            {numeral}·{work.id}
          </span>
        </div>
```

파일 하단(컴포넌트 밖)에 StatusBadge 추가:

```tsx
function StatusBadge({ status }: { status: NonNullable<Work["status"]> }) {
  if (status === "winner") {
    return <span className="rounded-md bg-zinc-900 px-2 py-0.5 text-[11px] font-semibold text-white">채택</span>;
  }
  if (status === "dropped") {
    return <span className="rounded-md border border-zinc-200 px-2 py-0.5 text-[11px] font-semibold text-zinc-500">탈락</span>;
  }
  return <span className="rounded-md border border-dashed border-zinc-300 px-2 py-0.5 text-[11px] font-semibold text-zinc-400">심사 대기</span>;
}
```

- [ ] **Step 3: gallery-client.tsx — 표지 마크 + Ⅳ 탭 그룹핑·필터**

상단 import에 추가: `import { CollectionMark } from "./collection-mark";`. 컴포넌트 본체에 필터 상태 + 그룹핑 헬퍼 추가, `<section>` 렌더를 교체.

(a) 컴포넌트 최상단 훅 추가(기존 useState/useRef 뒤):
```tsx
  const [winnersOnly, setWinnersOnly] = useState(false);
  const isEvolve = current.key === "evolve";
  const shown = isEvolve && winnersOnly ? current.works.filter((w) => w.status === "winner") : current.works;
```

(b) 헤더의 `<p>...카탈로그...</p>` 바로 뒤에 표지 마크 삽입:
```tsx
          <CollectionMark sections={categories.map((c) => ({ label: c.label, count: c.works.length }))} />
```

(c) `<section>` 내부(`<div className="grid...">{current.works.map...}</div>`)를 아래로 교체:
```tsx
          {isEvolve ? (
            <>
              <div role="group" aria-label="후보 필터" className="mb-6 inline-flex rounded-lg border border-zinc-200 p-0.5">
                {([["전체", false], ["승자만", true]] as const).map(([label, val]) => (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={winnersOnly === val}
                    onClick={() => setWinnersOnly(val)}
                    className={`h-8 rounded-md px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 ${
                      winnersOnly === val ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="space-y-10">
                {groupByRound(shown).map((g) => (
                  <div key={g.key}>
                    <h2 className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                      {g.header} · <span className="tabular-nums">{g.works.length}</span>
                    </h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {g.works.map((w) => (
                        <WorkCard key={w.id} work={w} numeral={current.numeral} />
                      ))}
                    </div>
                  </div>
                ))}
                {shown.length === 0 && <p className="text-sm text-zinc-500">승자가 아직 없습니다.</p>}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {current.works.map((w) => (
                <WorkCard key={w.id} work={w} numeral={current.numeral} />
              ))}
            </div>
          )}
```

(d) 파일 하단(컴포넌트 밖)에 groupByRound 헬퍼 추가:
```tsx
function groupByRound(works: Work[]): { key: string; header: string; works: Work[] }[] {
  const groups: { key: string; header: string; works: Work[] }[] = [];
  for (const w of works) {
    const key = w.round ?? "기타";
    let g = groups.find((x) => x.key === key);
    if (!g) {
      const rn = w.round?.split("-r")[1] ?? "";
      const head = `${(w.target ?? "").toUpperCase()} · R${rn}${w.date ? " · " + w.date : ""}`.replace(/^ · /, "");
      g = { key, header: head, works: [] };
      groups.push(g);
    }
    g.works.push(w);
  }
  return groups;
}
```

주의: `h1`은 헤더에 하나뿐(그룹 헤더는 `h2` — 헤딩 위계 유지).

- [ ] **Step 4: 동작 확인(main — 배지 없음)** — Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3100/gallery` → 200. 그리고 `curl -s http://localhost:3100/gallery | grep -c "채택\|탈락"` → `0` (main엔 evolve 후보 없어 배지 없음). 표지 마크 SVG 존재: `curl -s http://localhost:3100/gallery | grep -c "<svg"` → ≥1.

- [ ] **Step 5: 커밋**

```bash
git add app/src/app/gallery/
git commit -m "feat(gallery): Ⅳ 탭 라운드 그룹핑·승자 배지·필터·생성형 표지 마크

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: 검증 게이트 + evolve/dash 배지 스모크

**Files:** 없음(게이트 실패 시에만 해당 파일 수정).

**Interfaces:**
- Consumes: Task 1~3 전부.
- Produces: 게이트 통과 + Ⅳ 탭 승자/탈락/그룹 실측.

- [ ] **Step 1: 정적(이미지 규칙 포함)** — Run: `node scripts/dash-static-check.mjs app/src/app/gallery/page.tsx app/src/app/gallery/gallery-client.tsx app/src/app/gallery/work-card.tsx app/src/app/gallery/collection-mark.tsx app/src/lib/works.ts app/src/lib/evolve-status.ts; echo exit=$?` / Expected: `[]` exit=0.
- [ ] **Step 2: sweep** — Run: `node scripts/dash-sweep.mjs --base http://localhost:3100 --routes /gallery; echo exit=$?` / Expected: `"pass": true` exit=0 (표지 마크 SVG가 모바일 390 오버플로 유발 안 함 — max-w-full 확인).
- [ ] **Step 3: build** — Run: `cd app && npx next build 2>&1 | tail -5` / Expected: 에러 없이 완료.
- [ ] **Step 4: Lighthouse a11y** — Run: `npx -y lighthouse http://localhost:3100/gallery --only-categories=accessibility --preset=desktop --output=json --output-path=/tmp/lh-gal.json --chrome-flags="--headless" >/dev/null 2>&1; node -e "console.log('a11y', Math.round(require('/tmp/lh-gal.json').categories.accessibility.score*100))"` / Expected: ≥95. 미달 시 위반 audit 고쳐 재측정(불가 환경이면 사유 기록).
- [ ] **Step 5: evolve/dash 배지 실측** — `git stash -u`(있으면) 없이: `git fetch origin && git checkout -B evolve/dash origin/evolve/dash && git rebase main`(충돌 시 both-changes). dev 서버 3100이 evolve 워킹트리 서빙하도록 함(이미 실행 중이면 파일 감지). 그다음:
  - `curl -s http://localhost:3100/gallery | grep -o "자율 루프 후보"` → 존재(Ⅳ 탭)
  - Ⅳ 탭 HTML은 기본 미선택이라 배지가 서버 렌더에 없을 수 있음 → **승자 배지 로직 검증은 렌더된 evolve 탭에서**: 클라이언트 탭이라 SSR HTML엔 landing(기본 탭)만. 대신 데이터 검증: `node -e "import('./app/src/lib/evolve-status.ts').then(async m=>{const fs=require('fs');const led=m.parseLedger(fs.readFileSync('vault/30-ledger/auto-ledger.jsonl','utf8'));console.log('r7 승자 b =', m.candidateStatus('auto-dash-r7','b',led), '| r7 a =', m.candidateStatus('auto-dash-r7','a',led))})"` → `winner | dropped` (ledger 승자와 배지 판정 일치 대조).
  - `git diff main..evolve/dash -- vault/` → 갤러리 변경이 vault 안 건드림(무관).
- [ ] **Step 6: main 복귀** — 서버가 evolve 서빙 중이면 보류 판단(Task 5가 브랜치 명시). 게이트 결과 기록.

---

### Task 5: push + 배포 (컨트롤러 전용 — 서브에이전트 금지)

**Files:** 없음.

- [ ] **Step 1: main push** — main 체크아웃 확인 후 `git push`. Vercel git 자동 배포 확인(2~3분).
- [ ] **Step 2: 프로덕션 검증** — `curl -s -o /dev/null -w "%{http_code}" https://repick-design.vercel.app/gallery` → 200. evolve 탭 미노출: `curl -s https://repick-design.vercel.app/gallery | grep -c "자율 루프 후보"` → 0. 표지 마크: `grep -c "<svg"` → ≥1.
- [ ] **Step 3: evolve/dash push** — Task 4가 rebase했으면 `git push --force-with-lease origin evolve/dash`(있을 때만).

---

## Self-Review 결과

- **Spec coverage**: §3 데이터(ledger status)→Task 1(순수함수)+Task 2(통합), §4.1 그룹핑·§4.2 배지·§4.3 필터·§4.4 표지 마크→Task 3, §5 게이트 도그푸딩→Task 4(static 이미지규칙·sweep·a11y·build), §6 파일 5개 매핑, §7 검증→Task 4/5, §8 비범위(judge 근거·Ⅰ~Ⅲ 재설계·챔피언 교체 없음) 준수.
- **회귀 안전**: main엔 evolve 없어 배지/그룹 미표시·Ⅳ 탭 미노출(Task 2 Step 3·Task 3 Step 4). 기존 3탭·크로스페이드·부하제어 계약 유지.
- **타입 일관성**: `CandidateStatus`·RoundInfo·Work 확장 필드가 Task 1 정의 ↔ Task 2 사용 ↔ Task 3 배지/그룹에서 일치. groupByRound·StatusBadge·CollectionMark 명칭 일관.
