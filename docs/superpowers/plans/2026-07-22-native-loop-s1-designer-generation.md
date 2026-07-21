# S1: designer 네이티브 온디맨드 생성 증명 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `native/`에 DNA 토큰(`tokens.ts`)·생성 가이드(`GENERATION.md`)·게이트 스크립트(`validate.sh`)를 갖추고, designer 에이전트가 MatchList와 다른 도메인의 RN 화면 1개를 온디맨드 생성해 4-게이트를 통과함을 증명.

**Architecture:** S0 PoC 위에 재사용 인프라 3종을 얹고(토큰 추출 + 회귀, 생성 가이드, validate.sh), designer를 1회 dispatch해 새 RN 화면을 생성·검증. 자율 루프(SKILL/ledger/judge)는 미변경.

**Tech Stack:** Expo(~57)/React Native/react-native-web/TS, bash(validate.sh), playwright(루트 node_modules), designer 에이전트.

**Spec:** `docs/superpowers/specs/2026-07-22-native-loop-s1-designer-generation-design.md`

## Global Constraints

- **웹 루프·프로덕션 무변경**: `app/`·`vault/`·기존 스킬 diff 0. S1은 `native/`만.
- repick DNA(RN): 순백 라이트 `#ffffff`, 단일 액센트 `#4f46e5`(indigo-600), near-monochrome zinc 계조, 이모지 금지, 서비스급 절제. 색·간격은 `tokens.ts` import(하드코딩 금지).
- 결정론: `Math.random`/`Date.now`/인자 없는 `new Date()` 금지.
- RN 관용구: 순수 텍스트는 반드시 `Text`, 리스트는 `FlatList`, `StyleSheet.create()`(인라인 style 지양), a11y는 `accessibilityRole`/`accessibilityLabel`.
- 포트 8091(Next 3100 회피). Expo Web 서버는 백그라운드 기동·검증 후 정리.
- playwright는 루트 node_modules를 **`require.resolve('playwright')` 상대 해석**으로(절대경로 하드코딩 금지 — 클라우드 이식성, S0 승계 finding).
- 커밋: conventional + 한국어 + `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` 푸터. push는 Task 5(컨트롤러).
- dev 서버 3100(Next)은 S1과 무관 — 건드리지 않음.

---

### Task 1: `native/src/tokens.ts` — DNA 토큰 추출 + MatchList 리팩터(회귀)

**Files:**
- Create: `native/src/tokens.ts`
- Modify: `native/src/MatchList.tsx` (하드코딩 색상 → 토큰 참조)

**Interfaces:**
- Consumes: 없음.
- Produces: `export const tokens` (아래 스키마). Task 2 GENERATION.md가 규약으로 참조, Task 4 designer 산출물이 import.

```ts
// tokens 스키마
tokens.color.bg        // "#ffffff"
tokens.color.accent    // "#4f46e5"
tokens.color.onAccent  // "#ffffff"
tokens.color.ink       // "#18181b"
tokens.color.ink2      // "#27272a"
tokens.color.muted     // "#52525b"
tokens.color.faint     // "#71717a"
tokens.color.border    // "#e4e4e7"
tokens.space(n: number) // n*4 (간격 리듬)
tokens.radius.md       // 12
```

- [ ] **Step 1: tokens.ts 작성**

```ts
// native/src/tokens.ts — repick DNA → RN StyleSheet 토큰 (S0 PoC 실증값 추출)
export const tokens = {
  color: {
    bg: "#ffffff",
    accent: "#4f46e5", // indigo-600 (단일 액센트)
    onAccent: "#ffffff",
    ink: "#18181b",
    ink2: "#27272a",
    muted: "#52525b",
    faint: "#71717a",
    border: "#e4e4e7",
  },
  space: (n: number) => n * 4, // 4/8 간격 리듬
  radius: { md: 12, sm: 6 },
} as const;
```

- [ ] **Step 2: MatchList.tsx 하드코딩 → 토큰 참조** — import 추가(`import { tokens } from "./tokens";`) 후, `StyleSheet.create({...})` 안 색상·간격 리터럴을 토큰으로 치환. 예:
  - `backgroundColor: "#ffffff"` → `backgroundColor: tokens.color.bg`
  - `color: "#18181b"` → `tokens.color.ink`, `#27272a`→`ink2`, `#52525b`→`muted`, `#71717a`→`faint`
  - `borderColor: "#e4e4e7"` → `tokens.color.border`
  - `backgroundColor: ACCENT`(#4f46e5)와 상단 `const ACCENT` 제거 → `tokens.color.accent`, grade 텍스트 `color:"#ffffff"`→`tokens.color.onAccent`
  - `borderRadius: 12` → `tokens.radius.md`, `borderRadius: 6` → `tokens.radius.sm`
  - `paddingHorizontal: 20`→`tokens.space(5)`, `paddingTop: 56`→`tokens.space(14)`, `gap: 12`→`tokens.space(3)`, `padding: 16`→`tokens.space(4)` 등 4배수 매핑(비-4배수 값 6·2는 `tokens.space` 대신 그대로 두어도 됨 — 시각 불변 우선).

  **원칙: 시각 결과 불변**(토큰 값이 원 하드코딩과 동일하므로 렌더 픽셀 동일). tabular-nums·fontWeight 등 비색상 스타일은 무변경.

- [ ] **Step 3: 타입체크 회귀** — Run: `cd native && npx tsc --noEmit; echo "exit=$?"` / Expected: `exit=0`.

- [ ] **Step 4: 렌더 회귀(하드코딩 제거가 화면 안 깨뜨림)** — Expo Web export·서빙 후 Playwright 텍스트 검사로 "AI 매칭 결과"·"Contax"가 여전히 렌더되는지 확인(S0 serve-web.md의 검사 스니펫 재사용):
```
cd native && npx expo export --platform web --output-dir dist 2>&1 | tail -3
(cd native && npx serve dist -l 8091 &) ; sleep 3
curl -s -o /dev/null -w "http=%{http_code}\n" http://localhost:8091/
node -e "const {createRequire}=require('node:module');const req=createRequire('/Users/yss/개발/build/repick-design/');const {chromium}=req('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('http://localhost:8091/',{waitUntil:'load'});await p.waitForTimeout(1500);const t=await p.evaluate(()=>document.body.innerText);await b.close();console.log('HEADING:',t.includes('AI 매칭 결과'),'CARD:',t.includes('Contax'));})()"
lsof -ti :8091 | xargs -r kill
```
Expected: http=200 + `HEADING: true CARD: true` (토큰 리팩터 후 렌더 불변).

- [ ] **Step 5: 커밋**

```bash
git add native/src/tokens.ts native/src/MatchList.tsx
git commit -m "feat(native): DNA 토큰 추출 tokens.ts + MatchList 토큰 참조 리팩터

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: `native/GENERATION.md` — 네이티브 생성 가이드

**Files:**
- Create: `native/GENERATION.md`

**Interfaces:**
- Consumes: Task 1 tokens.ts(규약 참조).
- Produces: designer가 RN 생성 전 읽는 가이드. Task 4 dispatch가 이 파일을 designer 입력으로 전달.

- [ ] **Step 1: GENERATION.md 작성** (S0 인계 노트를 실행 가능 규칙으로 정식화)

```markdown
# 네이티브(RN/Expo) 생성 가이드 — designer 입력

repick 자율 루프가 네이티브 타깃 화면을 생성할 때 designer가 따르는 규칙. 웹 brief(dash-brief-v3)의 네이티브 대응.

## 1. RN 관용구 (웹 코드 금지)
- `div` → `View`(flex 기본). 순수 텍스트 노드 불가 — **모든 텍스트는 `<Text>`로 감싼다**.
- 버튼/클릭 영역 → `Pressable`. 리스트 → `FlatList`(`.map()` 대신 data/renderItem).
- 최상위 래퍼 → `SafeAreaView`.
- 스타일 → `StyleSheet.create({...})`. 인라인 `style={{...}}` 지양.
- import: `import { View, Text, Pressable, FlatList, SafeAreaView, StyleSheet } from "react-native";`

## 2. 토큰 (하드코딩 금지)
- 색·간격·radius는 `import { tokens } from "./tokens";`(또는 상대경로) 후 `tokens.color.*`/`tokens.space(n)`/`tokens.radius.*` 사용.
- 색 하드코딩(`#xxxxxx`) 금지 — 토큰에 없으면 토큰에 먼저 추가.

## 3. DNA
- 순백 라이트(`tokens.color.bg`), near-monochrome + **단일 액센트**(`tokens.color.accent`)만 강조.
- 서비스급 절제 — 연극적 발광·장식 금지. 이모지 금지(아이콘 필요 시 벡터/텍스트).

## 4. 접근성
- `aria-label` → `accessibilityLabel`, `role="button"` → `accessibilityRole="button"`, 헤딩 → `accessibilityRole="header"`.

## 5. 결정론
- 더미 데이터에 `Math.random`/`Date.now`/인자 없는 `new Date()` 금지. 고정값·계산.

## 6. 산출 구조
- `native/src/<screen-slug>/` 폴더에 화면 컴포넌트 + `data.ts`(결정론 더미). `App.tsx`가 렌더하도록 연결(또는 화면 export).

## 7. 검증 (생성 후 반드시 통과)
- `bash native/scripts/validate.sh "<화면의 대표 텍스트>"` 4-게이트(tsc·export·렌더·iframe) 통과.
```

- [ ] **Step 2: 검증** — Run: `grep -c "tokens\|accessibilityRole\|FlatList\|validate.sh" native/GENERATION.md` → 4 이상 (핵심 규칙 포함 확인).

- [ ] **Step 3: 커밋**

```bash
git add native/GENERATION.md
git commit -m "feat(native): 네이티브 생성 가이드 GENERATION.md — designer 입력

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: `native/scripts/validate.sh` — 4-게이트 스크립트 + iframe-check 이식성

**Files:**
- Create: `native/scripts/validate.sh`
- Modify: `native/scripts/iframe-check.mjs` (절대경로 → require.resolve 상대 해석)

**Interfaces:**
- Consumes: S0의 expo export·iframe-check.
- Produces: `bash native/scripts/validate.sh "<검사문자열>"` → 4-게이트 순차 실행, 전부 통과 시 exit 0. Task 4가 designer 산출물 검증에 사용.

- [ ] **Step 1: iframe-check.mjs 이식성 수정** — 절대경로 import를 상대 해석으로:

기존:
```js
import pkg from '/Users/yss/개발/build/repick-design/node_modules/playwright/index.js';
const { chromium } = pkg;
```
교체:
```js
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
```
(나머지 로직 무변경. `require('playwright')`가 루트 node_modules를 상대 해석 — 절대경로·OS 의존 제거.)

- [ ] **Step 2: validate.sh 작성**

```bash
#!/usr/bin/env bash
# native/scripts/validate.sh — S1 4-게이트. 사용: bash native/scripts/validate.sh "<렌더 검사 문자열>"
set -euo pipefail
CHECK="${1:?사용: validate.sh <렌더 검사 문자열>}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NATIVE="$ROOT/native"
PORT=8091

cleanup() { lsof -ti :$PORT 2>/dev/null | xargs -r kill 2>/dev/null || true; }
trap cleanup EXIT

echo "[1/4] tsc"
( cd "$NATIVE" && npx tsc --noEmit )

echo "[2/4] expo export (web)"
( cd "$NATIVE" && npx expo export --platform web --output-dir dist >/dev/null 2>&1 )

echo "[3/4] serve + render"
cleanup
( cd "$NATIVE" && npx serve dist -l $PORT >/dev/null 2>&1 & )
for i in $(seq 1 30); do
  [ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:$PORT/ 2>/dev/null)" = "200" ] && break
  sleep 1
done
[ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:$PORT/)" = "200" ] || { echo "serve 200 실패"; exit 1; }
node -e "
const { createRequire } = require('node:module');
const req = createRequire('$ROOT/');
const { chromium } = req('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://localhost:$PORT/', { waitUntil: 'load' }); await p.waitForTimeout(1500);
  const t = await p.evaluate(() => document.body.innerText); await b.close();
  if (!t.includes('$CHECK')) { console.error('렌더 검사 실패: \"$CHECK\" 없음'); process.exit(1); }
  console.log('render OK');
})();
"

echo "[4/4] iframe"
node "$NATIVE/scripts/iframe-check.mjs" "http://localhost:$PORT/"

echo "✅ validate 4/4 통과"
```

- [ ] **Step 3: 실행 권한 + iframe-check가 CHECK 문자열도 받도록 일반화(선택)** — iframe-check.mjs는 현재 "AI 매칭 결과" 하드코딩. Task 4 화면은 다른 텍스트라, iframe-check의 검사 문자열을 2번째 인자로 받게 일반화:
`const CHECK = process.argv[3] || 'AI 매칭 결과';` 로 바꾸고 `inner.includes(CHECK)`로. validate.sh의 iframe 호출도 `node "$NATIVE/scripts/iframe-check.mjs" "http://localhost:$PORT/" "$CHECK"`로.
그리고 `chmod +x native/scripts/validate.sh`.

- [ ] **Step 4: 현 MatchList로 validate.sh 스모크** — Run: `bash native/scripts/validate.sh "AI 매칭 결과"; echo "exit=$?"`
Expected: `[1/4]`~`[4/4]` + `✅ validate 4/4 통과` + `exit=0`. 실패 게이트가 있으면 그 단계 수정 후 재실행.

- [ ] **Step 5: 커밋** (dist는 gitignore — 스크립트만)

```bash
git add native/scripts/validate.sh native/scripts/iframe-check.mjs
git commit -m "feat(native): validate.sh 4-게이트 + iframe-check 이식성(require.resolve)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: designer 온디맨드 RN 화면 생성 + 검증

**Files:**
- Create: `native/src/<screen>/` (designer 산출 — 예: `native/src/watchlist/`)
- Modify: `native/App.tsx` (새 화면 렌더 or 화면 스위처 — 최소 변경)

**Interfaces:**
- Consumes: Task 1 tokens.ts, Task 2 GENERATION.md, Task 3 validate.sh.
- Produces: MatchList와 다른 도메인의 RN 화면 1개 + validate.sh 통과 기록.

- [ ] **Step 1: designer 에이전트 dispatch** — (이 태스크 구현자가 Agent 도구로 designer 또는 general-purpose 1개 호출)
  - 입력: `native/GENERATION.md` 전문 + `native/src/tokens.ts` + PoC 예시(`native/src/MatchList.tsx`를 스타일 few-shot으로) + 지시: "repick(AI 중고 매칭) 도메인에서 **MatchList와 다른 화면** 하나를 RN으로 생성 — 예: **관심목록(watchlist)**: 저장한 매물 리스트 + 가격변동 배지 + 알림 토글. GENERATION.md 규칙 준수(tokens import·FlatList·Text 래핑·accessibility·결정론·이모지 없음). 산출: `native/src/watchlist/WatchList.tsx` + `native/src/watchlist/data.ts`."
  - 산출 경로 확정: `native/src/watchlist/`.
- [ ] **Step 2: App.tsx에 새 화면 연결** — `App.tsx`가 새 화면을 렌더하도록 최소 수정(예: `import { WatchList } from "./src/watchlist/WatchList";` 후 `<WatchList/>`로 교체, 또는 둘 다 보이게 스택). S1 증명엔 새 화면이 렌더되면 충분 — MatchList 대신 WatchList 렌더로.
- [ ] **Step 3: 규칙 준수 정적 확인** — Run:
  - `grep -c "from \"react-native\"" native/src/watchlist/WatchList.tsx` → ≥1
  - `grep -cE "Math\.random|Date\.now|new Date\(\)" native/src/watchlist/*.tsx native/src/watchlist/*.ts` → 0 (결정론)
  - `grep -cE "#[0-9a-fA-F]{6}" native/src/watchlist/WatchList.tsx` → 0 (색 하드코딩 금지 — tokens 사용)
  - `grep -c "tokens" native/src/watchlist/WatchList.tsx` → ≥1
  - `grep -c "accessibility" native/src/watchlist/WatchList.tsx` → ≥1
  위반 시 designer에 1회 수정 dispatch 후 재확인.
- [ ] **Step 4: validate.sh 통과** — WatchList의 대표 텍스트(예: 헤딩 "관심목록")로:
Run: `bash native/scripts/validate.sh "관심목록"; echo "exit=$?"`
Expected: `✅ validate 4/4 통과` + `exit=0`. 실패 시 designer 1회 수정 후 재검증.
- [ ] **Step 5: 커밋**

```bash
git add native/src/watchlist/ native/App.tsx
git commit -m "feat(native): designer 온디맨드 생성 — 관심목록 RN 화면 (S1 증명)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: S1 판정 + README + push (컨트롤러 전용)

**Files:**
- Modify: `native/README.md` (S1 결과 추가)

- [ ] **Step 1: 종합 재검증** — tokens 회귀(MatchList 여전히 렌더) + validate.sh("관심목록") 통과를 순차 재실행. 하나라도 실패면 S1=실패로 README 기록 후 escalate.
- [ ] **Step 2: README에 S1 섹션 추가** — `native/README.md`에: S1 판정(✅/❌), designer가 생성한 화면(watchlist)·validate.sh 출력, tokens.ts·GENERATION.md·validate.sh 역할, **S2 인계**(validate.sh를 웹↔네이티브 타깃 분기의 네이티브 브랜치로 흡수 — S4의 자율 라운드가 이 게이트를 부를 준비).
- [ ] **Step 3: 커밋 + push**

```bash
git add native/README.md
git commit -m "docs(native): S1 판정 + S2 인계 노트

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
git push
```

- [ ] **Step 4: 배포 무영향** — `native/`는 Vercel rootDirectory(`app`) 밖: `curl -s -o /dev/null -w "%{http_code}" https://repick-design.vercel.app/` → 200 유지. 웹 루프 diff 0 확인(`git diff <S1 base>..HEAD --stat -- app/ vault/`).

---

## Self-Review 결과

- **Spec coverage**: §3.1 tokens.ts+회귀→Task 1, §3.2 GENERATION.md→Task 2, §3.3 validate.sh(playwright 상대해석)→Task 3, §4 온디맨드 절차→Task 4, §5 검증(validate·회귀·다른화면·프로덕션)→Task 4/5, §6 비범위(S4 재배선·S2 분기 정식화·NativeWind·3병렬 없음) 준수.
- **타입/명칭 일관성**: `tokens.color.*`/`tokens.space`/`tokens.radius` 스키마가 Task 1 정의 ↔ Task 2 가이드 ↔ Task 4 산출 규칙에서 일치. validate.sh 인터페이스(`<검사문자열>` 인자) Task 3 정의 ↔ Task 4/5 호출 일치.
- **일반화 증거**: Task 4가 MatchList와 다른 도메인(watchlist) 생성 + Step 3 정적 확인으로 "베끼기 아님" 검증.
- **웹 무변경**: 전 태스크 `native/`만. Task 5 Step 4가 프로덕션·웹 diff 0 확인.
