# S2 게이트 디스패처 + 공통 판정 계약 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 웹·네이티브로 갈라진 검증 게이트를 단일 디스패처 `scripts/gate.mjs`로 통일하고, 양 타깃이 동일한 판정 JSON을 반환하게 한다.

**Architecture:** `gate.mjs`는 (1) 서브게이트 출력을 공통 항목으로 바꾸는 **순수 정규화 함수** + (2) 그것을 조립하는 `buildVerdict` + (3) 타깃별 IO 오케스트레이터(runWeb/runNative) + (4) CLI로 구성. 기존 웹 스크립트(dash-static-check·dash-sweep)와 네이티브 validate.sh는 **재작성 없이 호출**만 하고 gate.mjs가 정규화한다. 네이티브는 `EXPO_PUBLIC_SCREEN`으로 App.tsx 화면을 스위칭해 복수 화면을 게이트한다.

**Tech Stack:** Node 20+ ESM(`.mjs`), `node:test`, `node:child_process`(spawnSync), 기존 playwright(dash-sweep), Expo Web 정적 export, bash.

## Global Constraints

- **공통 판정 계약(불변)**: 양 타깃 반환 = `{ target: 'web'|'native', pass: boolean, gates: {name,pass,detail}[], violations: {gate,...}[] }`. exit 0(pass)/1(fail). gates 항목은 정확히 `name`·`pass`·`detail` 3키.
- **기존 웹 스크립트 무변경**: `scripts/dash-static-check.mjs`·`scripts/dash-sweep.mjs` diff 0 — gate.mjs가 import/호출만.
- **웹 게이트 기준 불변**: a11y ≥ 95(하드), 오버플로 0. Lighthouse 실행 불가 시 `unavailable`(하드페일 아님). perf는 기록만(절대 fail 아님).
- **SKILL·ledger·judge 무변경**: `.claude/skills/**`·`vault/**`·`app/**` diff 0 (S4/S3 범위).
- **결정론**: gate.mjs·screens.ts에 `Math.random`/`Date.now`/인자 없는 `new Date()` 금지.
- **한국어 커밋 메시지 + conventional 접두사**. 네이티브 렌더 검사 문자열: watchlist=`관심목록`, match=`AI 매칭 결과`.

---

### Task 1: 공통 판정 계약 — 순수 정규화 함수 + buildVerdict

디스패처의 심장. 각 서브게이트 출력을 공통 gate 항목으로 바꾸는 순수 함수와, 그것을 verdict로 조립하는 함수. IO 없음 → 전부 `node:test`로 검증(스펙 §6.4 정규화 순수함수 TDD, §6.3 계약 동형).

**Files:**
- Create: `scripts/gate.mjs` (순수 함수 파트만)
- Test: `scripts/gate.test.mjs`

**Interfaces:**
- Produces (later tasks 소비):
  - `normalizeStatic(violations: object[]) → {name:'static',pass,detail,violations}`
  - `normalizeSweep(result: {pass,failures}) → {name:'sweep',pass,detail,violations}`
  - `normalizeA11y(score: number|'unavailable') → {name:'a11y',pass,detail,violations}`
  - `normalizePerf(score: number|'unavailable') → {name:'perf',pass:true,detail,violations:[]}`
  - `NATIVE_STEPS: string[]`, `normalizeNativeRun(screen: string, stdout: string, exitOk: boolean) → gateItem[]`
  - `buildVerdict(target: string, gates: gateItem[]) → {target,pass,gates,violations}` — gate 항목에서 내부 `violations`를 떼어 최상위 `violations[]`로 병합, gates는 `{name,pass,detail}`만 남긴다.
  - `parseArgs(argv: string[]) → {target,routes,files,screens,base}`

- [ ] **Step 1: 실패 테스트 작성** — `scripts/gate.test.mjs`

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeStatic, normalizeSweep, normalizeA11y, normalizePerf,
  normalizeNativeRun, buildVerdict, parseArgs,
} from './gate.mjs';

test('normalizeStatic — 위반 0이면 pass', () => {
  const g = normalizeStatic([]);
  assert.equal(g.name, 'static');
  assert.equal(g.pass, true);
  assert.equal(g.detail, '위반 0');
});

test('normalizeStatic — 위반 있으면 fail + 개수', () => {
  const g = normalizeStatic([{ rule: 'no-emoji', line: 3 }]);
  assert.equal(g.pass, false);
  assert.equal(g.detail, '위반 1');
  assert.equal(g.violations.length, 1);
});

test('normalizeSweep — pass 전파', () => {
  assert.equal(normalizeSweep({ pass: true, failures: [] }).pass, true);
  const f = normalizeSweep({ pass: false, failures: [{ route: '/x', width: 1280 }] });
  assert.equal(f.pass, false);
  assert.equal(f.detail, '오버플로 1');
});

test('normalizeA11y — 95 미만은 fail, 이상은 pass', () => {
  assert.equal(normalizeA11y(94).pass, false);
  assert.equal(normalizeA11y(95).pass, true);
  assert.equal(normalizeA11y(100).detail, '100');
});

test('normalizeA11y — unavailable은 pass(하드페일 아님)', () => {
  const g = normalizeA11y('unavailable');
  assert.equal(g.pass, true);
  assert.equal(g.detail, 'unavailable');
});

test('normalizePerf — 항상 pass(기록만)', () => {
  assert.equal(normalizePerf(10).pass, true);
  assert.equal(normalizePerf('unavailable').pass, true);
});

test('normalizeNativeRun — 4단계 마커 전부 있으면 pass', () => {
  const out = 'GATE_STEP:tsc:ok\nGATE_STEP:export:ok\nGATE_STEP:render:ok\nGATE_STEP:iframe:ok';
  const gates = normalizeNativeRun('watchlist', out, true);
  assert.equal(gates.length, 4);
  assert.ok(gates.every((g) => g.pass));
  assert.equal(gates[0].name, 'watchlist/tsc');
});

test('normalizeNativeRun — render 마커 없으면 해당 게이트 fail', () => {
  const out = 'GATE_STEP:tsc:ok\nGATE_STEP:export:ok';
  const gates = normalizeNativeRun('match', out, false);
  assert.equal(gates.find((g) => g.name === 'match/render').pass, false);
  assert.equal(gates.find((g) => g.name === 'match/render').detail, '실패');
});

test('buildVerdict — 전 게이트 pass면 pass, violations 병합·gates는 3키만', () => {
  const v = buildVerdict('web', [
    normalizeStatic([]), normalizeSweep({ pass: true, failures: [] }),
    normalizeA11y(100), normalizePerf(98),
  ]);
  assert.equal(v.pass, true);
  assert.equal(v.violations.length, 0);
  for (const g of v.gates) assert.deepEqual(Object.keys(g).sort(), ['detail', 'name', 'pass']);
});

test('buildVerdict — 한 게이트라도 fail이면 fail + violations에 gate명 태그', () => {
  const v = buildVerdict('web', [normalizeStatic([{ rule: 'no-emoji', line: 3 }])]);
  assert.equal(v.pass, false);
  assert.equal(v.violations[0].gate, 'static');
  assert.equal(v.violations[0].rule, 'no-emoji');
});

test('계약 동형 — web·native verdict가 동일 스키마', () => {
  const web = buildVerdict('web', [
    normalizeStatic([]), normalizeSweep({ pass: true, failures: [] }),
    normalizeA11y(100), normalizePerf(98),
  ]);
  const native = buildVerdict('native', normalizeNativeRun(
    'watchlist', 'GATE_STEP:tsc:ok GATE_STEP:export:ok GATE_STEP:render:ok GATE_STEP:iframe:ok', true));
  for (const v of [web, native]) {
    assert.deepEqual(Object.keys(v).sort(), ['gates', 'pass', 'target', 'violations']);
    for (const g of v.gates) assert.deepEqual(Object.keys(g).sort(), ['detail', 'name', 'pass']);
  }
});

test('parseArgs — target/routes/screens 파싱', () => {
  assert.deepEqual(parseArgs(['--target', 'web', '--routes', '/dash/d29']),
    { target: 'web', routes: ['/dash/d29'], files: [], screens: [], base: 'http://localhost:3100' });
  const n = parseArgs(['--target', 'native', '--screens', 'watchlist', 'match']);
  assert.deepEqual(n.screens, ['watchlist', 'match']);
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `node --test scripts/gate.test.mjs`
Expected: FAIL — `Cannot find module './gate.mjs'` (또는 export 미정의)

- [ ] **Step 3: 순수 함수 구현** — `scripts/gate.mjs` (파일 신설, 순수 파트만)

```js
import { pathToFileURL } from 'node:url';

/* ───────── 순수 정규화 ───────── */

export function normalizeStatic(violations) {
  const pass = violations.length === 0;
  return { name: 'static', pass, detail: pass ? '위반 0' : `위반 ${violations.length}`, violations };
}

export function normalizeSweep(result) {
  const failures = result.failures ?? [];
  const pass = result.pass === true;
  return { name: 'sweep', pass, detail: pass ? '전 폭 오버플로 0' : `오버플로 ${failures.length}`, violations: failures };
}

export function normalizeA11y(score) {
  if (score === 'unavailable') return { name: 'a11y', pass: true, detail: 'unavailable', violations: [] };
  const pass = score >= 95;
  return { name: 'a11y', pass, detail: String(score), violations: pass ? [] : [{ score, threshold: 95 }] };
}

export function normalizePerf(score) {
  return { name: 'perf', pass: true, detail: score === 'unavailable' ? 'unavailable' : String(score), violations: [] };
}

export const NATIVE_STEPS = ['tsc', 'export', 'render', 'iframe'];

export function normalizeNativeRun(screen, stdout, exitOk) {
  return NATIVE_STEPS.map((step) => {
    const pass = stdout.includes(`GATE_STEP:${step}:ok`);
    return {
      name: `${screen}/${step}`,
      pass,
      detail: pass ? '통과' : exitOk ? '미실행' : '실패',
      violations: pass ? [] : [{ screen, step }],
    };
  });
}

/* ───────── verdict 조립 ───────── */

export function buildVerdict(target, gates) {
  const pass = gates.every((g) => g.pass);
  const violations = gates.flatMap((g) => (g.violations ?? []).map((v) => ({ gate: g.name, ...v })));
  const stripped = gates.map(({ violations: _v, ...rest }) => rest);
  return { target, pass, gates: stripped, violations };
}

/* ───────── CLI 인자 파싱 ───────── */

export function parseArgs(argv) {
  const out = { target: null, routes: [], files: [], screens: [], base: 'http://localhost:3100' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--target') out.target = argv[++i];
    else if (a === '--base') out.base = argv[++i];
    else if (a === '--routes') while (argv[i + 1] && !argv[i + 1].startsWith('--')) out.routes.push(argv[++i]);
    else if (a === '--files') while (argv[i + 1] && !argv[i + 1].startsWith('--')) out.files.push(argv[++i]);
    else if (a === '--screens') while (argv[i + 1] && !argv[i + 1].startsWith('--')) out.screens.push(argv[++i]);
  }
  return out;
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `node --test scripts/gate.test.mjs`
Expected: PASS (13개 테스트)

- [ ] **Step 5: 커밋**

```bash
git add scripts/gate.mjs scripts/gate.test.mjs
git commit -m "feat(gate): S2 공통 판정 계약 — 순수 정규화 함수 + buildVerdict"
```

---

### Task 2: 웹 브랜치 오케스트레이션 (runWeb + Lighthouse + CLI)

기존 dash-static-check·dash-sweep·Lighthouse를 호출해 공통 verdict로 정규화하는 웹 경로. 재작성 없이 감싼다(스펙 §4.1). 라우트→tsx 파일 유도 헬퍼 포함. 증명: d29(통과작) 회귀(스펙 §6.1).

**Files:**
- Modify: `scripts/gate.mjs` (IO 오케스트레이터 + CLI 추가 — Task 1 순수 파트 아래에 이어붙임)
- Test: `scripts/gate.test.mjs` (`filesForRoute` 케이스 추가)

**Interfaces:**
- Consumes: Task 1의 `normalizeStatic/normalizeSweep/normalizeA11y/normalizePerf/buildVerdict/parseArgs`; 기존 `./dash-static-check.mjs`의 `checkSource(src)`; 기존 `./dash-sweep.mjs`의 `runSweep(base,routes)`·`evaluateSweep(measurements)`.
- Produces: `filesForRoute(route, appRoot?) → string[]`; `runWeb({routes,files,base}) → Promise<verdict>`; CLI 엔트리(`--target web`).

- [ ] **Step 1: 실패 테스트 작성** — `scripts/gate.test.mjs`에 append

```js
import { filesForRoute } from './gate.mjs';

test('filesForRoute — d29 라우트에서 tsx 파일을 모은다', () => {
  const files = filesForRoute('/dash/d29');
  assert.ok(files.length > 0);
  assert.ok(files.every((f) => f.endsWith('.tsx')));
  assert.ok(files.some((f) => f.endsWith('page.tsx')));
  assert.ok(files.every((f) => f.startsWith('app/src/app/dash/d29/')));
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `node --test scripts/gate.test.mjs`
Expected: FAIL — `filesForRoute is not a function`

- [ ] **Step 3: 웹 오케스트레이터 + CLI 구현** — `scripts/gate.mjs`에 append (Task 1 파일 하단, 순수 파트 다음)

```js
import { readFileSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

/* ───────── 웹 브랜치 (IO) ───────── */

export function filesForRoute(route, appRoot = 'app/src/app') {
  const dir = appRoot + route;
  return readdirSync(dir, { recursive: true })
    .filter((f) => typeof f === 'string' && f.endsWith('.tsx'))
    .map((f) => `${dir}/${f}`);
}

function runLighthouse(url) {
  const r = spawnSync('npx', ['lighthouse', url,
    '--only-categories=performance,accessibility', '--preset=desktop',
    '--output=json', '--output-path=stdout', '--chrome-flags=--headless'],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0 || !r.stdout) return 'unavailable';
  try {
    const j = JSON.parse(r.stdout);
    return {
      a11y: Math.round((j.categories.accessibility.score ?? 0) * 100),
      perf: Math.round((j.categories.performance.score ?? 0) * 100),
    };
  } catch {
    return 'unavailable';
  }
}

export async function runWeb({ routes, files, base }) {
  const { checkSource } = await import('./dash-static-check.mjs');
  const { runSweep, evaluateSweep } = await import('./dash-sweep.mjs');
  const tsxFiles = files.length ? files : routes.flatMap((r) => filesForRoute(r));
  const staticViolations = tsxFiles.flatMap((f) =>
    checkSource(readFileSync(f, 'utf8')).map((v) => ({ file: f, ...v })));
  const sweep = evaluateSweep(await runSweep(base, routes));
  const lh = runLighthouse(base + routes[0]);
  const gates = [
    normalizeStatic(staticViolations),
    normalizeSweep(sweep),
    normalizeA11y(lh === 'unavailable' ? 'unavailable' : lh.a11y),
    normalizePerf(lh === 'unavailable' ? 'unavailable' : lh.perf),
  ];
  return buildVerdict('web', gates);
}

/* ───────── CLI ───────── */

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const opts = parseArgs(process.argv.slice(2));
  let verdict;
  if (opts.target === 'web') {
    verdict = await runWeb(opts);
  } else {
    console.error('usage: node scripts/gate.mjs --target web --routes <route...> [--files <f...>]');
    process.exit(2);
  }
  console.log(JSON.stringify(verdict, null, 2));
  process.exit(verdict.pass ? 0 : 1);
}
```

> 주: `import`문은 파일 상단으로 끌어올려도 되지만, 리뷰 편의상 브랜치별로 근접 배치. 최종 정리 시 `readFileSync`/`readdirSync`/`spawnSync` import를 Task 1의 `pathToFileURL` import 옆으로 병합 가능(동작 동일).

- [ ] **Step 4: 단위 테스트 통과 확인**

Run: `node --test scripts/gate.test.mjs`
Expected: PASS (14개)

- [ ] **Step 5: 웹 타깃 통합 실행(회귀 증명 §6.1)**

```bash
# dev 서버 3100 기동(없으면)
( cd app && rm -rf .next && PORT=3100 npm run dev >/tmp/dev3100.log 2>&1 & )
for i in $(seq 1 40); do [ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3100/dash/d29)" = "200" ] && break; sleep 1; done
node scripts/gate.mjs --target web --routes /dash/d29
echo "exit=$?"
```
Expected: JSON `{"target":"web","pass":true,"gates":[{"name":"static",...},{"name":"sweep",...},{"name":"a11y",...},{"name":"perf",...}],"violations":[]}`, `exit=0`. (Lighthouse가 이 환경에서 안 돌면 a11y `detail:"unavailable"`이어도 pass — static·sweep가 통과작 d29에서 위반 0이면 전체 pass.)

- [ ] **Step 6: 커밋**

```bash
git add scripts/gate.mjs scripts/gate.test.mjs
git commit -m "feat(gate): 웹 브랜치 — static·sweep·Lighthouse 정규화 + CLI"
```

---

### Task 3: 네이티브 screen 레지스트리 + App.tsx 화면 스위처

`EXPO_PUBLIC_SCREEN`으로 렌더 화면을 고르게 한다(M1 — 복수 화면 게이트의 전제). 미지정 시 기존 화면(watchlist) 유지 → 회귀 무해(스펙 §6.5).

**Files:**
- Create: `native/screens.json` (slug→검사문자열 — gate.mjs가 읽는 단일 소스)
- Create: `native/src/screens.ts` (slug→컴포넌트 레지스트리 + `resolveScreen`)
- Modify: `native/App.tsx` (WatchList 직접 렌더 → `resolveScreen(process.env.EXPO_PUBLIC_SCREEN)`)

**Interfaces:**
- Produces: `native/screens.json` = `{ "<slug>": { "check": "<렌더 검사문자열>" } }`; `native/src/screens.ts`의 `resolveScreen(slug?: string) → React 컴포넌트`, `DEFAULT_SCREEN`, `ScreenSlug`. Task 5의 runNative가 `screens.json`을 소비.
- Consumes: 기존 `native/src/watchlist/WatchList.tsx`의 `WatchList`, `native/src/MatchList.tsx`의 `MatchList`.

- [ ] **Step 1: 검사문자열 레지스트리 작성** — `native/screens.json`

```json
{
  "watchlist": { "check": "관심목록" },
  "match": { "check": "AI 매칭 결과" }
}
```

- [ ] **Step 2: 컴포넌트 레지스트리 작성** — `native/src/screens.ts`

```ts
import type { ComponentType } from "react";
import { WatchList } from "./watchlist/WatchList";
import { MatchList } from "./MatchList";

const COMPONENTS = { watchlist: WatchList, match: MatchList } as const satisfies Record<string, ComponentType>;

export type ScreenSlug = keyof typeof COMPONENTS;
export const DEFAULT_SCREEN: ScreenSlug = "watchlist";

export function resolveScreen(slug?: string): ComponentType {
  const key = slug && slug in COMPONENTS ? (slug as ScreenSlug) : DEFAULT_SCREEN;
  return COMPONENTS[key];
}
```

- [ ] **Step 3: App.tsx 스위칭 적용** — `native/App.tsx` 전체 교체

```tsx
import { SafeAreaView, StyleSheet } from "react-native";
import { resolveScreen } from "./src/screens";

const Screen = resolveScreen(process.env.EXPO_PUBLIC_SCREEN);

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <Screen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
});
```

- [ ] **Step 4: tsc 회귀 확인**

Run: `cd native && npx tsc --noEmit && echo TSC_OK`
Expected: `TSC_OK`. (만약 `process.env` 타입 미해결로 실패하면 — Expo 프로젝트는 보통 `@types/node`·`expo-env.d.ts`로 타입됨 — 실패 시 `native/`에 `expo-env.d.ts`가 있는지 확인하고 없으면 `/// <reference types="expo/types" />`를 `screens.ts` 상단에 1줄 추가. 그 외 코드 변경 금지.)

- [ ] **Step 5: 기본 화면 회귀 + match 스위칭 렌더 확인**

```bash
cd native
# 기본(env 미설정) → watchlist
npx expo export --platform web --output-dir dist >/dev/null 2>&1
( npx serve dist -l 8091 >/dev/null 2>&1 & ); sleep 3
curl -s http://localhost:8091/ | grep -q "관심목록\|root" && echo DEFAULT_OK
lsof -ti :8091 | xargs -r kill
# match 스위칭
EXPO_PUBLIC_SCREEN=match npx expo export --platform web --output-dir dist >/dev/null 2>&1
( npx serve dist -l 8091 >/dev/null 2>&1 & ); sleep 3
node -e 'import("node:module").then(async ({createRequire})=>{const req=createRequire(process.cwd()+"/../");const {chromium}=req("playwright");const b=await chromium.launch();const p=await b.newPage();await p.goto("http://localhost:8091/",{waitUntil:"load"});await p.waitForTimeout(1500);const t=await p.evaluate(()=>document.body.innerText);await b.close();console.log(t.includes("AI 매칭 결과")?"MATCH_OK":"MATCH_FAIL:"+t.slice(0,80));})'
lsof -ti :8091 | xargs -r kill
```
Expected: `DEFAULT_OK` 그리고 `MATCH_OK` (env로 화면이 바뀜 = M1 전제 성립).

- [ ] **Step 6: 커밋**

```bash
git add native/screens.json native/src/screens.ts native/App.tsx
git commit -m "feat(native): screen 레지스트리 + EXPO_PUBLIC_SCREEN 스위처 (M1)"
```

---

### Task 4: validate.sh 하드닝(#3) + 단계 마커 + SCREEN 인자

렌더 검사 문자열을 `node -e` 문자열 보간이 아니라 **env로 전달**(#3 — 따옴표·특수문자 안전), 화면 스위칭용 2번째 인자 추가(M1), gate.mjs가 파싱할 `GATE_STEP:<step>:ok` 마커 방출.

**Files:**
- Modify: `native/scripts/validate.sh`

**Interfaces:**
- Produces: `bash native/scripts/validate.sh "<검사문자열>" [screen]` — 성공 시 각 단계 후 `GATE_STEP:<tsc|export|render|iframe>:ok`를 stdout에 출력, 최종 exit 0. `screen` 인자는 `EXPO_PUBLIC_SCREEN`으로 expo export에 주입. Task 5의 runNative가 이 마커를 소비.

- [ ] **Step 1: validate.sh 교체** — `native/scripts/validate.sh` 전체

```bash
#!/usr/bin/env bash
# native/scripts/validate.sh — 4-게이트. 사용: bash native/scripts/validate.sh "<렌더 검사 문자열>" [screen]
set -euo pipefail
CHECK="${1:?사용: validate.sh <렌더 검사 문자열> [screen]}"
SCREEN="${2:-}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NATIVE="$ROOT/native"
PORT=8091

cleanup() { lsof -ti :$PORT 2>/dev/null | xargs -r kill 2>/dev/null || true; }
trap cleanup EXIT

echo "[1/4] tsc"
( cd "$NATIVE" && npx tsc --noEmit )
echo "GATE_STEP:tsc:ok"

echo "[2/4] expo export (web)"
( cd "$NATIVE" && EXPO_PUBLIC_SCREEN="$SCREEN" npx expo export --platform web --output-dir dist >/dev/null 2>&1 )
echo "GATE_STEP:export:ok"

echo "[3/4] serve + render"
cleanup
( cd "$NATIVE" && npx serve dist -l $PORT >/dev/null 2>&1 & )
for i in $(seq 1 30); do
  [ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:$PORT/ 2>/dev/null)" = "200" ] && break
  sleep 1
done
[ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:$PORT/)" = "200" ] || { echo "serve 200 실패"; exit 1; }
CHECK="$CHECK" ROOT="$ROOT" PORT="$PORT" node -e '
const { createRequire } = require("node:module");
const req = createRequire(process.env.ROOT + "/");
const { chromium } = req("playwright");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto("http://localhost:" + process.env.PORT + "/", { waitUntil: "load" });
  await p.waitForTimeout(1500);
  const t = await p.evaluate(() => document.body.innerText); await b.close();
  if (!t.includes(process.env.CHECK)) { console.error("렌더 검사 실패: " + process.env.CHECK + " 없음"); process.exit(1); }
  console.log("render OK");
})();
'
echo "GATE_STEP:render:ok"

echo "[4/4] iframe"
node "$NATIVE/scripts/iframe-check.mjs" "http://localhost:$PORT/" "$CHECK"
echo "GATE_STEP:iframe:ok"

echo "✅ validate 4/4 통과"
```

- [ ] **Step 2: 기본 화면 검증(#3 하드닝 회귀)**

Run: `bash native/scripts/validate.sh "관심목록"`
Expected: `[1/4]`~`[4/4]` 진행, `GATE_STEP:tsc:ok`·`:export:ok`·`:render:ok`·`:iframe:ok` 4줄, 마지막 `✅ validate 4/4 통과`, exit 0.

- [ ] **Step 3: SCREEN 인자 + 특수문자 검사문자열 검증**

Run: `bash native/scripts/validate.sh "AI 매칭 결과" match`
Expected: 4/4 통과 + 4개 마커. (공백 포함 문자열이 env 경유로 안전 전달됨 = #3 해소.)

- [ ] **Step 4: 커밋**

```bash
git add native/scripts/validate.sh
git commit -m "fix(native): validate.sh — 검사문자열 env 전달(#3) + GATE_STEP 마커 + SCREEN 인자"
```

---

### Task 5: 네이티브 브랜치 오케스트레이션 (runNative + CLI 분기)

각 화면에 `EXPO_PUBLIC_SCREEN`·검사문자열로 validate.sh를 돌리고 마커를 정규화해 공통 verdict 반환. 증명: match+watchlist 두 화면 모두 pass(스펙 §6.2 — M1 복수 화면 게이트 성립).

**Files:**
- Modify: `scripts/gate.mjs` (runNative 추가 + CLI에 `--target native` 분기)

**Interfaces:**
- Consumes: Task 1 `normalizeNativeRun/buildVerdict`; Task 3 `native/screens.json`; Task 4 validate.sh 마커.
- Produces: `runNative({screens}) → verdict`; CLI `--target native --screens <s...>`.

- [ ] **Step 1: runNative 구현 + CLI 분기 확장** — `scripts/gate.mjs`

runNative를 웹 오케스트레이터 다음(CLI 블록 앞)에 추가:

```js
/* ───────── 네이티브 브랜치 (IO) ───────── */

export function runNative({ screens }) {
  const registry = JSON.parse(readFileSync('native/screens.json', 'utf8'));
  let gates = [];
  for (const screen of screens) {
    const entry = registry[screen];
    if (!entry) throw new Error(`unknown screen: ${screen} (native/screens.json에 없음)`);
    const r = spawnSync('bash', ['native/scripts/validate.sh', entry.check, screen], {
      encoding: 'utf8',
      env: { ...process.env, EXPO_PUBLIC_SCREEN: screen },
      maxBuffer: 64 * 1024 * 1024,
    });
    const stdout = (r.stdout ?? '') + (r.stderr ?? '');
    gates = gates.concat(normalizeNativeRun(screen, stdout, r.status === 0));
  }
  return buildVerdict('native', gates);
}
```

기존 CLI 블록의 분기를 확장:

```js
  if (opts.target === 'web') {
    verdict = await runWeb(opts);
  } else if (opts.target === 'native') {
    verdict = runNative(opts);
  } else {
    console.error('usage: node scripts/gate.mjs --target web|native ...');
    process.exit(2);
  }
```

- [ ] **Step 2: 단위 테스트 불변 확인**

Run: `node --test scripts/gate.test.mjs`
Expected: PASS (14개 — runNative는 IO라 단위 대상 아님, 회귀만 확인).

- [ ] **Step 3: 네이티브 타깃 통합 실행(증명 §6.2)**

```bash
node scripts/gate.mjs --target native --screens watchlist match
echo "exit=$?"
```
Expected: JSON `{"target":"native","pass":true,"gates":[8개 — watchlist/tsc..iframe, match/tsc..iframe 전부 pass],"violations":[]}`, `exit=0`.

- [ ] **Step 4: 커밋**

```bash
git add scripts/gate.mjs
git commit -m "feat(gate): 네이티브 브랜치 — validate.sh 화면별 실행 정규화 (M1 복수 화면)"
```

---

### Task 6: 무회귀 검증 + README 인계

기존 웹 스크립트·테스트 불변, 프로덕션 무영향 확인(스펙 §6.5·§6.6). native/README.md에 S2 결과·게이트 사용법 인계.

**Files:**
- Modify: `native/README.md` (S2 절 추가)

**Interfaces:** 없음(문서 + 검증).

- [ ] **Step 1: 전체 단위 테스트 + 웹 스크립트 불변 확인**

```bash
npm test
git diff --stat main -- scripts/dash-static-check.mjs scripts/dash-sweep.mjs .claude/skills vault app
```
Expected: `npm test` 전부 PASS(기존 dash-static-check/dash-sweep/wiki-lint/design-loop 테스트 + gate 테스트). 두 번째 명령 출력 **비어 있음**(웹 스크립트·SKILL·vault·app 무변경 = S3/S4 범위 침범 없음).

- [ ] **Step 2: 프로덕션 무영향 확인**

Run: `curl -s -o /dev/null -w '%{http_code}\n' https://repick-design.vercel.app/`
Expected: `200` (S2는 gate.mjs·native·scripts 신설/수정만 — 배포 산출물 불변).

- [ ] **Step 3: README S2 절 추가** — `native/README.md` 하단에 append

```markdown

## S2 — 게이트 디스패처 (2026-07-22)

단일 디스패처 `scripts/gate.mjs`가 웹·네이티브 검증을 공통 판정 JSON으로 통일한다.

- 공통 계약: `{ target, pass, gates:[{name,pass,detail}], violations }` + exit 0/1.
- 웹: `node scripts/gate.mjs --target web --routes /dash/d29` (dev 서버 3100 전제) — dash-static-check·dash-sweep·Lighthouse 정규화.
- 네이티브: `node scripts/gate.mjs --target native --screens watchlist match` — 화면별 `EXPO_PUBLIC_SCREEN`+검사문자열로 validate.sh 실행, `GATE_STEP:*:ok` 마커 정규화.
- 화면 추가: `native/screens.json`(검사문자열) + `native/src/screens.ts`(컴포넌트) 두 곳에 slug 등록.
- S1 이월 해소: M1(복수 화면 게이트=EXPO_PUBLIC_SCREEN 스위처)·#3(검사문자열 env 전달)·공통 계약.
- 비범위: SKILL HARD GATE의 gate.mjs 채택·ledger·타깃 선택 = S4. 갤러리 통합 = S3.
```

- [ ] **Step 4: 커밋**

```bash
git add native/README.md
git commit -m "docs(native): S2 게이트 디스패처 사용법·인계 노트"
```

---

## Self-Review

- **Spec coverage**: §3 공통계약→Task1(buildVerdict)·§4.1 웹→Task2·§4.2 M1→Task3, #3→Task4, 공통계약(native)→Task5·§5 파일표→Task1~5·§6.1 웹증명→Task2 S5·§6.2 네이티브증명→Task5 S3·§6.3 동형→Task1 테스트·§6.4 순수 TDD→Task1·§6.5 회귀→Task3 S5/Task6 S1·§6.6 무드리프트→Task6 S1/S2. 전 요구 매핑됨.
- **Placeholder scan**: 모든 코드 스텝에 실제 코드. TBD/TODO 없음.
- **Type consistency**: gate 항목 = `{name,pass,detail}`(+내부 violations, buildVerdict가 제거) 일관. `resolveScreen`/`DEFAULT_SCREEN`/`ScreenSlug` Task3 정의 → Task5는 screens.json만 참조(컴포넌트 미참조, 타입 충돌 없음). `NATIVE_STEPS`·`normalizeNativeRun` Task1 정의 → Task5 소비. `parseArgs` 반환키(target/routes/files/screens/base) → runWeb/runNative 소비 키 일치.
```
