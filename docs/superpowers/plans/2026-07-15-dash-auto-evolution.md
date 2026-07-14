# dash 자율 진화 (층 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** dash 루프의 HUMAN GATE를 judge 패널로 대체한 무인 자율 진화 파이프라인 구축 — 격리 delta + 주간 반증 PR + meta-기준 학습 포함.

**Architecture:** 결정론적 검증(그리드 sweep·정적 검사)은 순수 함수로 분리한 node 스크립트가 담당하고(TDD), 파이프라인 오케스트레이션은 두 개의 스킬(`dash-evolve` 야간 라운드, `dash-falsify` 주간 반증)이 담당한다. 학습 데이터는 vault의 append-only jsonl에 격리되고 정본 brief v3는 apply 모드에서만 수정된다.

**Tech Stack:** Node ESM(mjs) + node:test, Playwright(chromium), Next.js 16 dev 서버(포트 3100), gh CLI, Claude Code 스킬/에이전트.

**Spec:** `docs/superpowers/specs/2026-07-15-dash-auto-evolution-design.md` (모든 요구의 원본)

## Global Constraints

- 스크립트는 plain ESM `.mjs`, 테스트는 `node:test` + `assert/strict`, 테스트명은 한국어 (기존 `scripts/design-loop.test.mjs` 패턴).
- jsonl 헬퍼는 기존 `scripts/design-loop.mjs`의 `appendLedger`/`recentDecisions`를 재사용 (경로 인자 generic — 새 헬퍼 만들지 않는다).
- sweep 폭: 모바일 390 + 데스크톱 {1280, 1366, 1440, 1536, 1680, 1920} 각각과 그 −16px 변형(클래식 스크롤바·여유폭 ≥16px 보장). 데스크톱은 페이지·테이블 가로 오버플로 모두 금지, 모바일(<768)은 페이지 오버플로만 금지(테이블 로컬 스크롤 허용).
- Lighthouse 기준: perf ≥80, a11y ≥95. 실행 불가 환경이면 게이트 skip + ledger에 `"lighthouse":"unavailable"` 기록.
- 모든 jsonl은 append-only — 수정·삭제 금지, 갱신은 `supersedes` 필드를 단 새 entry로.
- `vault/00-principles/dash-brief-v3.md`는 자율 라운드에서 절대 수정 금지 (dash-falsify apply 모드에서만).
- dev 서버는 포트 3100 (`npm run dev -- -p 3100`), `.next` 잠금 충돌로 중복 기동 금지 — 이미 떠 있으면 재사용.
- 커밋: conventional 접두사 + 한국어 제목 50자 이내 + `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` 푸터. 구축 작업(이 계획의 태스크)은 main에, 루프 런타임 산출물은 evolve/dash에 커밋.
- 한국어 경로(`/Users/yss/개발/...`) 때문에 `import.meta.url` 비교 시 반드시 `pathToFileURL` 사용 (percent-encoding 불일치 방지).

---

### Task 1: 정적 검사 스크립트 `dash-static-check.mjs`

**Files:**
- Create: `scripts/dash-static-check.mjs`
- Test: `scripts/dash-static-check.test.mjs`

**Interfaces:**
- Consumes: 없음 (의존성 zero — node 내장만)
- Produces: `checkSource(src: string) → Array<{rule, line, text, why}>` (named export), CLI `node scripts/dash-static-check.mjs <file...>` → 위반 JSON 출력, 위반 있으면 exit 1. Task 4의 SKILL.md가 이 CLI를 호출한다.

- [ ] **Step 1: 실패하는 테스트 작성**

`scripts/dash-static-check.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkSource } from './dash-static-check.mjs';

test('next/font 추가 import를 잡는다', () => {
  const v = checkSource(`import { Inter } from 'next/font/google';`);
  assert.equal(v.length, 1);
  assert.equal(v[0].rule, 'no-next-font');
  assert.equal(v[0].line, 1);
});

test('font-serif 클래스를 잡는다', () => {
  const v = checkSource(`<h1 className="font-serif text-4xl">제목</h1>`);
  assert.equal(v[0].rule, 'no-font-serif');
});

test('비결정론(Math.random/Date.now/new Date())을 잡는다', () => {
  const src = `const a = Math.random();\nconst b = Date.now();\nconst c = new Date();`;
  const v = checkSource(src);
  assert.deepEqual(v.map((x) => x.line), [1, 2, 3]);
  assert.ok(v.every((x) => x.rule === 'no-random'));
});

test('이모지를 잡는다 (lucide 아이콘 강제)', () => {
  const v = checkSource(`<span>🚀 출시</span>`);
  assert.equal(v[0].rule, 'no-emoji');
});

test('규칙 준수 소스는 위반 0', () => {
  const src = `import { Rocket } from 'lucide-react';\nconst num = <td className="tabular-nums text-right">1,204</td>;\nconst fixed = new Date('2026-07-01');`;
  assert.deepEqual(checkSource(src), []);
});
```

주의: 마지막 테스트의 `new Date('2026-07-01')`(고정 인자)는 결정론적이므로 통과해야 한다 — 규칙 정규식은 인자 없는 `new Date()`만 잡는다.

- [ ] **Step 2: 실패 확인**

Run: `node --test scripts/dash-static-check.test.mjs`
Expected: FAIL — `Cannot find module ... dash-static-check.mjs`

- [ ] **Step 3: 최소 구현**

`scripts/dash-static-check.mjs`:

```js
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const RULES = [
  { id: 'no-next-font', re: /from\s+['"]next\/font/u, why: 'next/font 추가 import 금지 (Pretendard 전역 단일)' },
  { id: 'no-font-serif', re: /\bfont-serif\b/u, why: '세리프·장식 폰트 금지' },
  { id: 'no-random', re: /Math\.random\(|Date\.now\(|new Date\(\)/u, why: '결정론적 더미 데이터 (합계 정합·하이드레이션)' },
  { id: 'no-emoji', re: /\p{Extended_Pictographic}/u, why: '이모지 금지 — lucide-react 아이콘 사용' },
];

export function checkSource(src) {
  const violations = [];
  src.split('\n').forEach((line, i) => {
    for (const r of RULES) {
      if (r.re.test(line)) {
        violations.push({ rule: r.id, line: i + 1, text: line.trim().slice(0, 80), why: r.why });
      }
    }
  });
  return violations;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  let all = [];
  for (const f of process.argv.slice(2)) {
    all = all.concat(checkSource(readFileSync(f, 'utf8')).map((v) => ({ file: f, ...v })));
  }
  console.log(JSON.stringify(all, null, 2));
  process.exit(all.length ? 1 : 0);
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `node --test scripts/dash-static-check.test.mjs`
Expected: PASS (5 tests)

- [ ] **Step 5: CLI 스모크 — 실존 후보 파일로 실행**

Run: `node scripts/dash-static-check.mjs app/src/app/dash/d29/page.tsx; echo "exit=$?"`
Expected: JSON 배열 출력(빈 배열이면 exit=0). d29는 그리드 감사를 통과한 생존작이므로 위반 0이 정상. 위반이 나오면 규칙 오탐인지 실결함인지 출력을 읽고 판단 — 오탐이면 정규식을 수정하고 Step 1~4 반복.

- [ ] **Step 6: 커밋**

```bash
git add scripts/dash-static-check.mjs scripts/dash-static-check.test.mjs
git commit -m "feat(evolve): 하드게이트 정적 검사 스크립트 (폰트·비결정론·이모지)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: 그리드 sweep 스크립트 `dash-sweep.mjs`

**Files:**
- Create: `package.json` (repo 루트 — playwright devDep + test 스크립트)
- Create: `scripts/dash-sweep.mjs`
- Test: `scripts/dash-sweep.test.mjs`

**Interfaces:**
- Consumes: playwright `chromium` (루트 devDependency)
- Produces: `sweepWidths() → number[]`, `evaluateSweep(measurements) → {pass, failures}` (named exports, 순수 함수), `runSweep(baseUrl, routes, widths?) → measurements` (브라우저 구동), CLI `node scripts/dash-sweep.mjs --base <url> --routes <r1> <r2>...` → 결과 JSON + pass면 exit 0. measurement 형태: `{route, width, scrollWidth, clientWidth, tables: [{sel, scrollWidth, clientWidth}]}`. Task 4의 SKILL.md가 CLI를 호출한다.

- [ ] **Step 1: 루트 package.json 생성 + playwright 설치**

`package.json`:

```json
{
  "name": "repick-design",
  "private": true,
  "scripts": {
    "test": "node --test scripts/"
  },
  "devDependencies": {
    "playwright": "^1.61.1"
  }
}
```

Run: `npm install && npx playwright install chromium --with-deps 2>/dev/null || npx playwright install chromium`
Expected: node_modules 생성, chromium 설치(이미 있으면 skip). 기존 테스트 회귀 확인: `npm test` → design-loop + dash-static-check 전부 PASS.

- [ ] **Step 2: 순수 함수 실패 테스트 작성**

`scripts/dash-sweep.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sweepWidths, evaluateSweep } from './dash-sweep.mjs';

const m = (over = {}) => ({
  route: '/dash-evolve/r1/a', width: 1440,
  scrollWidth: 1440, clientWidth: 1440, tables: [], ...over,
});

test('sweepWidths는 데스크톱 각 폭과 -16px 변형, 모바일 390을 오름차순 중복 없이 반환한다', () => {
  const w = sweepWidths();
  assert.ok(w.includes(390) && w.includes(1280) && w.includes(1264) && w.includes(1920) && w.includes(1904));
  assert.deepEqual(w, [...new Set(w)].sort((a, b) => a - b));
});

test('데스크톱 페이지 가로 오버플로는 실패', () => {
  const r = evaluateSweep([m({ scrollWidth: 1493 })]);
  assert.equal(r.pass, false);
  assert.deepEqual(r.failures[0], { route: '/dash-evolve/r1/a', width: 1440, kind: 'page-overflow', by: 53, sel: null });
});

test('데스크톱 테이블(카드 내) 가로 오버플로는 실패', () => {
  const r = evaluateSweep([m({ tables: [{ sel: 'table#0', scrollWidth: 900, clientWidth: 860 }] })]);
  assert.equal(r.pass, false);
  assert.equal(r.failures[0].kind, 'table-overflow');
  assert.equal(r.failures[0].sel, 'table#0');
});

test('모바일(390) 테이블 로컬 스크롤은 허용, 페이지 오버플로는 실패', () => {
  const ok = evaluateSweep([m({ width: 390, scrollWidth: 390, clientWidth: 390, tables: [{ sel: 'table#0', scrollWidth: 700, clientWidth: 358 }] })]);
  assert.equal(ok.pass, true);
  const bad = evaluateSweep([m({ width: 390, scrollWidth: 543, clientWidth: 390 })]);
  assert.equal(bad.pass, false);
  assert.equal(bad.failures[0].by, 153);
});

test('전 폭 무결하면 pass', () => {
  const r = evaluateSweep(sweepWidths().map((width) => m({ width, scrollWidth: width, clientWidth: width })));
  assert.deepEqual(r, { pass: true, failures: [] });
});
```

- [ ] **Step 3: 실패 확인**

Run: `node --test scripts/dash-sweep.test.mjs`
Expected: FAIL — `Cannot find module ... dash-sweep.mjs`

- [ ] **Step 4: 구현**

`scripts/dash-sweep.mjs`:

```js
import { pathToFileURL } from 'node:url';

export const DESKTOP_WIDTHS = [1280, 1366, 1440, 1536, 1680, 1920];
export const MOBILE_WIDTHS = [390];
export const SLACK = 16; // 클래식 스크롤바(-15px) + 여유폭 ≥16px 규칙

export function sweepWidths() {
  const set = new Set(MOBILE_WIDTHS);
  for (const w of DESKTOP_WIDTHS) {
    set.add(w);
    set.add(w - SLACK);
  }
  return [...set].sort((a, b) => a - b);
}

export function evaluateSweep(measurements) {
  const failures = [];
  for (const m of measurements) {
    const mobile = m.width < 768;
    if (m.scrollWidth > m.clientWidth) {
      failures.push({ route: m.route, width: m.width, kind: 'page-overflow', by: m.scrollWidth - m.clientWidth, sel: null });
    }
    if (!mobile) {
      for (const t of m.tables ?? []) {
        if (t.scrollWidth > t.clientWidth) {
          failures.push({ route: m.route, width: m.width, kind: 'table-overflow', by: t.scrollWidth - t.clientWidth, sel: t.sel });
        }
      }
    }
  }
  return { pass: failures.length === 0, failures };
}

export async function runSweep(baseUrl, routes, widths = sweepWidths()) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const measurements = [];
  for (const route of routes) {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(baseUrl + route, { waitUntil: 'load' });
      await page.waitForTimeout(500); // 차트/폰트 렌더 안정화 (dev HMR 소켓 때문에 networkidle 대신 load 사용)
      const m = await page.evaluate(() => {
        const doc = document.documentElement;
        const els = [...document.querySelectorAll('table, [class*="overflow-x"]')];
        return {
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
          tables: els.map((el, i) => ({
            sel: `${el.tagName.toLowerCase()}#${i}`,
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth,
          })),
        };
      });
      measurements.push({ route, width, ...m });
    }
  }
  await browser.close();
  return measurements;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const args = process.argv.slice(2);
  const base = args[args.indexOf('--base') + 1];
  const routes = args.slice(args.indexOf('--routes') + 1);
  if (!base || routes.length === 0) {
    console.error('usage: node scripts/dash-sweep.mjs --base <url> --routes <route...>');
    process.exit(2);
  }
  const result = evaluateSweep(await runSweep(base, routes));
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.pass ? 0 : 1);
}
```

`runSweep`에서 playwright를 동적 import하는 이유: 테스트가 순수 함수만 쓸 때 브라우저 모듈 로드를 피한다.

- [ ] **Step 5: 테스트 통과 확인**

Run: `npm test`
Expected: PASS (design-loop 4 + static-check 5 + sweep 5)

- [ ] **Step 6: 실서버 통합 확인 (생존작 d29 대상)**

dev 서버가 3100에 없으면 백그라운드 기동: `cd app && npm run dev -- -p 3100`
Run: `node scripts/dash-sweep.mjs --base http://localhost:3100 --routes /dash/d29; echo "exit=$?"`
Expected: d29는 다중 폭 그리드 수정을 거친 생존작이므로 `"pass": true`, exit=0. 실패가 나오면 failures JSON을 읽고 — 측정 로직 결함(예: 의도된 모바일 스크롤 오탐)이면 스크립트 수정 후 Step 2~5 반복, d29의 실결함이면 그대로 보고만 하고 진행(이 태스크 범위 아님).

- [ ] **Step 7: 커밋**

```bash
git add package.json package-lock.json scripts/dash-sweep.mjs scripts/dash-sweep.test.mjs
git commit -m "feat(evolve): 그리드 다중 폭 sweep 하드게이트 (playwright)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: vault 시드 파일 + 홈 링크 (고아 금지)

**Files:**
- Create: `vault/00-principles/curation-criteria.md`
- Create: `vault/00-principles/questions-queue.md`
- Create: `vault/00-principles/dash-deltas-provisional.jsonl` (빈 파일)
- Create: `vault/30-ledger/dash-auto-ledger.jsonl` (빈 파일)
- Modify: `vault/🏠 Design Evolution.md` (핵심 노트 목록에 링크 추가)

**Interfaces:**
- Consumes: 없음
- Produces: Task 4/5의 SKILL.md가 참조하는 4개 파일 경로와 jsonl entry 스키마. **delta entry**: `{round, variant, delta, evidence, judge_votes, confidence, level, status, supersedes?}` (`status` ∈ `provisional|promoted|refuted`, `level` ∈ `L1|L2|L3`). **auto-ledger entry**: `{round, date, winner, no_winner, hardgate: {sweep, static, lighthouse}, judges: {brief, visual, archetype}, refuted, refute_reason?}` (`winner`는 variant 문자열 또는 null, `refuted`는 주간 apply에서 채움 — 그 전까지 null).

- [ ] **Step 1: curation-criteria.md 작성**

```markdown
---
tags: [principles, meta]
---

# 지식 정제 기준 (meta) — 어떤 기준으로 지식을 정제하는가

> delta("무엇을 배웠나")와 분리해 관리하는 정제 기준. 질문 답변에서 계속 정교화된다.
> 소비자: [[dash-brief-v3]] 자율 라운드의 정제 게이트 + judge 패널 프롬프트.

## 레벨 체크리스트 (delta 책정)
- **L1 관찰** — 1회 발생, 특정 후보에 종속.
- **L2 패턴** — 2개 라운드 이상 재현되었거나 하드게이트로 기계 검증 가능.
- **L3 원칙 후보** — 특정 후보/아키타입을 넘는 일반성 + 기존 원칙과 무충돌 + 반증 가능한 서술.

## 승격 규칙
- L3만 주간 반증 PR의 brief 편입 제안에 오른다. L1/L2는 provisional 잔류, 재현 시 supersedes entry로 레벨 상승.
- 고아 지식 승격 금지 — 관련 노트로의 [[링크]] 1개 이상 필수.

## 조직 원칙
- 지식은 에이전트별이 아니라 업무 카테고리별(landing 루프 / dash 루프)로 나눈다 — 에이전트 귀속은 ledger가 기록.
- 루프 공통 지식은 00-principles 공용 노트 1곳에만 두고 각 brief가 [[링크]]로 참조 (복사 금지).

## 축적된 기준 (질문 답변에서 추출 — append만)
_(아직 없음)_
```

- [ ] **Step 2: questions-queue.md 작성**

```markdown
---
tags: [ledger, questions]
---

# 질문 큐 — 정제 게이트가 사람에게 묻는 것

> 생성 조건: ① delta 간 충돌 감지 ② 병합/랭킹 판단을 [[curation-criteria]]로 정당화 불가.
> 형식: 질문 + 배경(충돌 delta 인용) + AI의 잠정 가설. 답변되면 meta-기준 추출 후 아카이브로 이동.

## 대기 중
_(없음)_

## 아카이브 (답변 완료)
_(없음)_
```

- [ ] **Step 3: 빈 jsonl 두 개 생성**

Run: `touch vault/00-principles/dash-deltas-provisional.jsonl vault/30-ledger/dash-auto-ledger.jsonl`

- [ ] **Step 4: 🏠 홈 노트에 링크 추가 (고아 방지)**

`vault/🏠 Design Evolution.md`의 "## 핵심 노트" 섹션 마지막에 추가:

```markdown
- [[curation-criteria]] — 지식 정제 meta-기준 (dash 자율 진화)
- [[questions-queue]] — 정제 게이트 질문 큐
```

- [ ] **Step 5: 검증 — 링크 대상 실존 확인**

Run: `ls vault/00-principles/curation-criteria.md vault/00-principles/questions-queue.md vault/00-principles/dash-deltas-provisional.jsonl vault/30-ledger/dash-auto-ledger.jsonl`
Expected: 4개 경로 모두 출력 (에러 없음)

- [ ] **Step 6: 커밋**

```bash
git add vault/
git commit -m "feat(vault): 자율 진화 시드 — 정제 기준·질문 큐·격리 ledger

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: 야간 라운드 스킬 `.claude/skills/dash-evolve/SKILL.md`

**Files:**
- Create: `.claude/skills/dash-evolve/SKILL.md`

**Interfaces:**
- Consumes: Task 1 CLI(`dash-static-check.mjs`), Task 2 CLI(`dash-sweep.mjs`), Task 3 파일 4개 + entry 스키마, 기존 `design-loop.mjs`의 `appendLedger`/`recentDecisions`/`newRun`.
- Produces: `/dash-evolve` 스킬 — 클라우드 routine과 Task 6 스모크가 호출. 산출물: `app/src/app/dash-evolve/r<N>/<v>/` 후보, `vault/20-generations/auto-dash-r<N>/` 기록, jsonl append, evolve/dash 커밋.

- [ ] **Step 1: SKILL.md 작성 (아래 전문 그대로)**

````markdown
---
name: dash-evolve
description: dash 루프 자율 진화 1라운드 — brief v3+격리 delta로 후보 3개 생성 → 하드게이트(sweep·정적·Lighthouse) → 3렌즈 judge 다수결 → delta 격리 적재 → 정제 게이트(질문 생성) → evolve/dash 커밋. "/dash-evolve", "dash 자율 라운드" 시 사용. 무인 실행 전제 — 사람 확인 없이 완주하며 no-winner 라운드를 허용한다.
---

# dash-evolve — 자율 라운드 (무인)

**불변식: `vault/00-principles/dash-brief-v3.md`와 `/dash` 갤러리는 절대 수정하지 않는다. jsonl은 append-only. main에 커밋하지 않는다.**

## 0. 준비
- 브랜치: `git checkout evolve/dash` (없으면 `git checkout -b evolve/dash`).
- 라운드 번호 N = `dash-auto-ledger.jsonl` 줄 수 + 1. run id = `auto-dash-r<N>`.
- run 디렉토리: `node -e "import('./scripts/design-loop.mjs').then(m=>console.log(m.newRun('auto-dash-r<N>','vault/20-generations','<오늘 YYYY-MM-DD>')))"`

## 1. RETRIEVE
다음을 전부 읽어 생성 컨텍스트를 구성한다:
- `vault/00-principles/dash-brief-v3.md` 전문 (정본 — 읽기 전용)
- `vault/00-principles/dash-deltas-provisional.jsonl` 전체 (격리 delta — status가 refuted가 아닌 최신 entry들)
- `vault/00-principles/curation-criteria.md` (meta-기준 — judge·정제 프롬프트에 주입)
- `vault/30-ledger/dash-auto-ledger.jsonl` 최근 5개 (직전 승자·no-winner 탈락 사유)
- 기존 아키타입 목록: `/dash` 갤러리 14종 + `app/src/app/dash-evolve/` 하위 기존 라운드의 아키타입 — 중복 금지 목록으로 정리

## 2. GENERATE — 3병렬
- designer(또는 frontend-design-specialist) 에이전트 3개 병렬 호출. 각자에게: RETRIEVE 컨텍스트 + 서로 다른 레이아웃 아키타입 명시 지정(중복 금지 목록 포함) + 산출 경로.
- 경로: `app/src/app/dash-evolve/r<N>/{a,b,c}/page.tsx` (+client 컴포넌트 분리 허용, 자기 폴더만).
- 각 후보의 한 줄 컨셉을 `vault/20-generations/<run>/candidates/<v>.md`에 기록.

## 3. HARD GATE (하나라도 실패 → 1회 수정 기회 → 재실패 시 탈락)
- dev 서버: 3100 응답 확인(`curl -s -o /dev/null -w '%{http_code}' http://localhost:3100/`), 없으면 `cd app && npm run dev -- -p 3100` 백그라운드 기동(이 라운드가 띄웠으면 마지막에 종료).
- **정적**: `node scripts/dash-static-check.mjs app/src/app/dash-evolve/r<N>/<v>/*.tsx` — 위반 JSON을 해당 designer에 전달해 1회 수정.
- **sweep**: `node scripts/dash-sweep.mjs --base http://localhost:3100 --routes /dash-evolve/r<N>/a /dash-evolve/r<N>/b /dash-evolve/r<N>/c` — 실패 후보만 failures JSON을 전달해 1회 수정 후 해당 route만 재sweep.
- **Lighthouse**: `npx lighthouse http://localhost:3100/dash-evolve/r<N>/<v> --only-categories=performance,accessibility --preset=desktop --output=json --output-path=stdout --chrome-flags="--headless" 2>/dev/null` → perf ≥80, a11y ≥95. 명령 자체가 실패(미설치·chrome 부재)하면 게이트 skip하고 ledger hardgate에 `"lighthouse":"unavailable"` 기록.
- 게이트 결과를 `vault/20-generations/<run>/SCORES.md`에 표로 기록.

## 4. JUDGE 패널 (생존 후보 2개 이상일 때; 1개면 그 후보를 단독 심사해 승자/no-winner만 판정)
- 스크린샷: 후보별 4폭 캡처 → `npx playwright screenshot --viewport-size=<w>,900 http://localhost:3100/dash-evolve/r<N>/<v> vault/20-generations/<run>/shots/<v>-<w>.png` (w ∈ 1280, 1440, 1920, 390).
- judge 3개 병렬(Agent 도구, 각각 comparator 계열). 공통 입력: 후보 스크린샷 + 소스 경로 (생성 컨셉·순서는 비공개 — 블라인드). 렌즈:
  1. **brief**: brief v3 전문 대조 — 규칙 위반·완성도 기준 미달 지적
  2. **visual**: Mercury/Asana/n8n/Coinbase 대비 상용 서비스급인가 — 스크린샷 중심
  3. **archetype**: 기존 아키타입 목록 대비 구조 차별성
- 각 judge 출력: 후보 랭킹 + 후보별 한 줄 사유 + (전원 미달이면) no-winner 표.
- 집계: 1위 표 다수결. 동률이면 brief 렌즈의 1위. **no-winner 표 2개 이상이면 라운드 no-winner** — 억지 승자 금지.
- 판정 전문을 `vault/20-generations/<run>/DECISION.md`에 기록.

## 5. LEARN — 격리 적재
승자가 있으면 판정 사유에서 재사용 가능한 delta **1개**를 추출해 append:
```bash
node -e "import('./scripts/design-loop.mjs').then(m=>m.appendLedger({round:'auto-dash-r<N>',variant:'<v>',delta:'<한 줄>',evidence:'<judge 사유 인용>',judge_votes:{brief:'<v>',visual:'<v>',archetype:'<v>'},confidence:'<high|low>',level:'L1',status:'provisional'},'vault/00-principles/dash-deltas-provisional.jsonl'))"
```
level은 일단 L1로 넣는다 — 상승은 6단계 정제 게이트가 판단.

## 6. 지식 정제 게이트
- provisional 전체 로드(`recentDecisions(999, ...)`) → 클러스터링: 유사 delta 묶음, 충돌 쌍 식별.
- **레벨 재책정**: curation-criteria.md의 체크리스트로 각 클러스터 판정. 재현(2라운드+)이나 기계 검증 가능성이 확인된 delta는 `{...원본, level:'L2'|'L3', supersedes:'<원본 round>', status:'provisional'}`로 새 entry append (원줄 수정 금지).
- **질문 강제 생성**: ① 충돌 쌍 발견 ② 병합/랭킹 판단을 meta-기준으로 정당화 불가 — 둘 중 하나면 `questions-queue.md`의 "대기 중"에 append: 질문 + 배경(충돌 delta 인용) + 잠정 가설. 이미 대기 중인 동일 유형 질문이 있으면 중복 생성 금지.

## 7. 기록 + 커밋
- auto-ledger append: `{round:'auto-dash-r<N>', date:'<YYYY-MM-DD>', winner:'<v>'|null, no_winner:<bool>, hardgate:{sweep:'pass|<탈락 v들>', static:'pass|<탈락 v들>', lighthouse:'pass|<수치>|unavailable'}, judges:{brief:'<v>',visual:'<v>',archetype:'<v>'}, refuted:null}`
- no-winner면 탈락 사유 요약을 DECISION.md에 남기고 후보 route는 유지(주간 반증에서 일괄 드롭).
- `git add -A && git commit -m "feat(dash-evolve): r<N> <승자 v — 아키타입 | no-winner>"` (+ Co-Authored-By 푸터). push는 원격 등록 후: `git push -u origin evolve/dash`.
````

- [ ] **Step 2: 스킬 인식 확인**

Run: `head -4 .claude/skills/dash-evolve/SKILL.md`
Expected: frontmatter에 `name: dash-evolve`와 한 줄 `description` 노출. (스킬 목록 반영은 새 세션에서 이뤄지므로 파일 구조 확인까지만.)

- [ ] **Step 3: 커밋**

```bash
git add .claude/skills/dash-evolve/SKILL.md
git commit -m "feat(skill): dash-evolve 자율 라운드 파이프라인

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: 주간 반증 스킬 `.claude/skills/dash-falsify/SKILL.md`

**Files:**
- Create: `.claude/skills/dash-falsify/SKILL.md`

**Interfaces:**
- Consumes: Task 3 스키마(delta·ledger entry), Task 4가 쌓는 evolve/dash 산출물, gh CLI.
- Produces: `/dash-falsify open`(주간 routine이 호출 — PR 생성/갱신), `/dash-falsify apply`(사람 리뷰 후 로컬 세션이 호출 — 반영+squash merge).

- [ ] **Step 1: SKILL.md 작성 (아래 전문 그대로)**

````markdown
---
name: dash-falsify
description: dash 자율 진화 주간 반증 — evolve/dash 누적분으로 반증 PR 생성(open 모드, 무인) / 사람 리뷰 결과 반영+squash merge(apply 모드). "/dash-falsify open", "/dash-falsify apply", "반증 PR", "주간 리뷰 반영" 시 사용.
---

# dash-falsify — 주간 반증

인자: `open`(기본) 또는 `apply`.

## open 모드 (무인 — 주간 routine)
1. `git fetch && git log origin/main..origin/evolve/dash --oneline` — 누적 커밋 없으면 "반증할 산출물 없음" 로그만 남기고 종료.
2. PR 본문 조립 (전부 자동 산출):
   - **주간 라운드 표**: auto-ledger에서 이번 주 라운드별 winner/no-winner/hardgate 요약
   - **L3 편입 제안**: provisional에서 최신 level=L3 & status=provisional인 delta 목록 (delta·evidence·재현 라운드)
   - **L1/L2 잔류 요약**: 개수 + 대표 클러스터
   - **질문 큐**: questions-queue.md "대기 중" 전문
   - **judge 근거**: 각 라운드 DECISION.md 상대경로 링크 + 대표 스크린샷 경로
   - **링크 그래프 요약**: 이번 주 신규 vault .md의 `[[링크]]` 수(`grep -o '\[\[[^]]*\]\]' <file> | wc -l`), 0개인 고아 노트 목록
   - **리뷰 방법 안내**: "후보 킵/드롭·delta 승인/기각·질문 답변을 PR 코멘트로 남기고 로컬에서 `/dash-falsify apply` 실행"
3. 열린 반증 PR이 있으면 `gh pr edit <num> --body <조립본>`, 없으면:
   `gh pr create --base main --head evolve/dash --title "feat(dash): 주간 자율 진화 반증 r<시작>~r<끝>" --body <조립본>`

## apply 모드 (로컬 세션 — 사람 리뷰 완료 후)
입력: PR 코멘트(`gh pr view <num> --comments`) 또는 대화로 받은 ① 후보 킵/드롭 ② delta 승인/기각 ③ 질문 답변. 셋 중 입력이 없는 항목은 그 항목만 건너뛴다.
1. **delta 승인** → `dash-brief-v3.md`에 surgical 편입(있으면 강화, 없으면 추가 — 무관 부분 수정 금지) + provisional에 `{...원본, status:'promoted', supersedes:'<round>'}` append.
2. **delta 기각** → provisional에 `{...원본, status:'refuted', supersedes:'<round>'}` append + auto-ledger 해당 라운드에 `{round, date, refuted:true, refute_reason:'<사유>'}` append. **refute rate**(이번 리뷰에서 기각된 judge 승자 수 / 전체 승자 판정 수)를 계산해 40% 초과면 "judge 렌즈 개선 필요" finding을 사용자에게 보고.
3. **질문 답변** → 답변에서 재사용 가능한 정제 기준을 추출해 curation-criteria.md "축적된 기준"에 append, 해당 질문은 questions-queue.md 아카이브로 이동.
4. **후보 킵** → `git mv app/src/app/dash-evolve/r<N>/<v> app/src/app/dash/d<다음 번호>` + `/dash` 갤러리 page.tsx에 카드 등록. **드롭** → 해당 후보 디렉토리 삭제.
5. 반영 커밋(evolve/dash) → `cd app && npx next build` 통과 확인 → `gh pr merge <num> --squash` (PR 제목이 conventional 형식인지 확인).

## 금지
- open 모드에서 어떤 파일도 수정하지 않는다 (PR 생성/갱신만).
- apply 모드에서 사람 입력 없는 delta를 임의로 승인/기각하지 않는다.
````

- [ ] **Step 2: 스킬 파일 구조 확인**

Run: `head -4 .claude/skills/dash-falsify/SKILL.md`
Expected: frontmatter `name: dash-falsify` + description.

- [ ] **Step 3: 커밋**

```bash
git add .claude/skills/dash-falsify/SKILL.md
git commit -m "feat(skill): dash-falsify 주간 반증 PR·반영 스킬

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: 로컬 스모크 라운드 (파이프라인 배선 검증)

**Files:**
- Create: (실행 산출물) `app/src/app/dash-evolve/r1/{a,b}/`, `vault/20-generations/<date>-auto-dash-r1/`, jsonl append 2건
- Modify: 없음 (스크립트·스킬 결함 발견 시에만 해당 태스크로 돌아가 수정)

**Interfaces:**
- Consumes: Task 1~5 전부.
- Produces: 검증된 파이프라인 + evolve/dash 브랜치의 첫 라운드 커밋. Task 7의 클라우드 dry-run은 이 스모크가 통과해야 의미가 있다.

- [ ] **Step 1: evolve/dash 브랜치 생성 후 라운드 실행**

Run: `git checkout -b evolve/dash` 후 이 세션에서 `/dash-evolve`를 후보 2개(a, b)로 축소 실행 (비용 절약 — GENERATE 병렬 2개로만, 나머지 단계는 SKILL.md 그대로).
Expected: 라운드가 사람 개입 없이 완주.

- [ ] **Step 2: 산출물 체크리스트 검증**

Run 및 Expected:
- `ls app/src/app/dash-evolve/r1/` → `a b`
- `ls vault/20-generations/*auto-dash-r1/` → `candidates DECISION.md SCORES.md shots` (no-winner여도 DECISION.md 존재)
- `tail -1 vault/30-ledger/dash-auto-ledger.jsonl` → round=auto-dash-r1, hardgate/judges 필드 채워짐
- 승자 존재 시 `tail -1 vault/00-principles/dash-deltas-provisional.jsonl` → status=provisional, level=L1
- `git log evolve/dash --oneline -1` → `feat(dash-evolve): r1 ...`
- `git diff main..evolve/dash -- vault/00-principles/dash-brief-v3.md` → 출력 없음 (**정본 불변 확인**)

- [ ] **Step 3: 결함 수정 루프**

스모크에서 발견된 결함은 해당 태스크(스크립트면 Task 1/2의 TDD 사이클, 스킬 문구면 Task 4/5)로 돌아가 수정하고 main에 커밋 후, evolve/dash를 `git rebase main`으로 갱신해 재실행. 통과할 때까지 반복.

- [ ] **Step 4: main 복귀**

Run: `git checkout main`
Expected: 스모크 산출물은 evolve/dash에만 존재.

---

### Task 7: GitHub 퍼블리싱 + routine 등록 + 클라우드 dry-run

**Files:**
- Modify: git config (repo-local), 원격/routine 설정 (파일 아님)

**Interfaces:**
- Consumes: Task 6까지의 전체 결과물, gh CLI(인증 완료 상태), `/schedule` 스킬.
- Produces: 가동 중인 자율 루프 — 야간 routine(매일 03:00 KST `/dash-evolve`), 주간 routine(일요일 06:00 KST `/dash-falsify open`).

- [ ] **Step 1: git 신원 설정 (repo-local)**

```bash
git config user.name "영신송"
git config user.email "ysong2526@gmail.com"
```

- [ ] **Step 2: GitHub private repo 생성 + 푸시**

```bash
gh repo create repick-design --private --source . --push
git push -u origin evolve/dash
```

Expected: `gh repo view --json url`로 private repo URL 확인, 두 브랜치 푸시 완료. (조직/이름 충돌 시 사용자에게 대체 이름 확인 — 이 단계만 예외적으로 질문 허용.)

- [ ] **Step 3: routine 2개 등록**

`/schedule` 스킬로 등록:
1. **야간 라운드**: 매일 03:00 Asia/Seoul, repo=repick-design, branch=evolve/dash, prompt="/dash-evolve 를 실행해 자율 라운드 1회를 완주하라. 무인 실행 — 사람 확인 없이 no-winner 라운드를 허용하며, 완료 후 evolve/dash에 push까지 수행."
2. **주간 반증**: 매주 일요일 06:00 Asia/Seoul, prompt="/dash-falsify open 을 실행해 주간 반증 PR을 생성/갱신하라."

Expected: 두 routine이 목록에 표시.

- [ ] **Step 4: 클라우드 dry-run 1회**

야간 routine을 즉시 1회 수동 트리거(run now). 완료 후 확인:
- evolve/dash에 새 라운드 커밋이 push됐는가
- ledger의 `hardgate.lighthouse` 값 — `unavailable`이면 스펙 §7의 폴백이 이미 동작한 것 (sweep+정적 게이트만으로 운용, 별도 조치 불요). 수치가 나오면 Lighthouse 게이트 정상.
- 스크린샷·DECISION.md가 vault에 존재하는가 (클라우드 playwright 동작 검증)
- 실패 시: routine 로그를 읽고 원인을 스크립트/스킬/환경으로 분류 — 스크립트·스킬 결함은 해당 태스크 수정 후 재트리거, 환경 제약(브라우저 미지원 등)은 스펙 §7 리스크에 따라 사용자에게 보고 후 결정.

- [ ] **Step 5: 운용 시작 기록 + 커밋**

`vault/30-ledger/AUTO-RUN-LOG.md` 말미에 dash 자율 루프 가동 기록 추가:

```markdown

---

# dash 자율 진화 가동 (2026-07-15~)
- 모드: 클라우드 routine — 매일 03:00 KST 1라운드(/dash-evolve), 일요일 06:00 KST 반증 PR(/dash-falsify open)
- 격리: delta는 dash-deltas-provisional.jsonl, 정본 brief v3는 주간 apply에서만 갱신
- 사람: 주 1회 PR 리뷰(킵/드롭·delta 승인/기각·질문 답변) 후 /dash-falsify apply
```

```bash
git add vault/30-ledger/AUTO-RUN-LOG.md
git commit -m "docs(vault): dash 자율 진화 루프 가동 기록

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
git push
```

---

## Self-Review 결과 (계획 작성 후 점검 완료)

- **Spec coverage**: §4.1~4.7→Task 4, §5→Task 5, §6 파일 6개→Task 1(static)/2(sweep)/3(vault 4개)+Task 4/5(스킬 2개), §7 선행작업→Task 2(playwright)/6(스모크)/7(GitHub·routine·dry-run·Lighthouse 폴백). §8 비범위 준수 — landing 루프·갤러리 자동 갱신 없음.
- **스키마 일관성**: delta/ledger entry 필드는 Task 3 Interfaces가 단일 출처, Task 4 §5·§7과 Task 5 apply가 동일 필드 사용 확인.
- **경로 일관성**: 후보 `app/src/app/dash-evolve/r<N>/<v>/`, run `vault/20-generations/<date>-auto-dash-r<N>/` — Task 4/6 일치 확인.
