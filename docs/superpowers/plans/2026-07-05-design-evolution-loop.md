# Design Evolution Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Obsidian 볼트를 디자인 지식 허브로 두고 Claude Code가 반응형 Next.js 랜딩 후보를 생성 → 자동 채점 → 사람 최종 선택 → 결정을 볼트에 되돌려 기록하는 자기개선 루프(Lean)를 구축한다.

**Architecture:** 별도 서버 앱 없음. `app/`(Next.js App Router)에 후보를 라이브 라우트로 생성해 Lighthouse/접근성 측정이 가능하게 하고, `vault/`(plain markdown)에 지식·점수·결정·ledger를 축적한다. 신규 코드는 얇은 오케스트레이터 스킬 `/design-evolve`와 ledger/스캐폴드 헬퍼 스크립트 하나뿐이며, 생성·심사·측정은 기존 vibe-flow 에이전트/스킬(`designer`, `comparator`, `perf-audit`, `web-design-guidelines`)을 호출한다.

**Tech Stack:** Next.js(App Router, TypeScript) + Tailwind CSS + shadcn/ui base, Node.js 내장 `node:test`, Refero MCP(HTTP), Claude Code skills/agents.

## Global Constraints

- 구축 깊이는 **Lean(A)** 고정. 스튜디오 앱(B)·자율 cron(C)·모델 파인튜닝은 범위 밖 — 만들지 않는다.
- 볼트는 프로젝트 폴더와 통합: 볼트 루트 = `repick-design/vault/`.
- 첫 생성 타깃은 **랜딩페이지** 하나. 다른 페이지 유형은 이 루프 검증 후에만 복제한다.
- 산출물은 반응형 Next.js/React. 3D는 `@react-three/fiber` 선택 레이어이며 기본 후보에는 넣지 않는다.
- 씨앗은 **Refero MCP** 라이브 조회 + 선별 캐시. Refero 전체 스크래핑 금지(ToS·노이즈).
- 기본 후보 개수 N=3.
- ledger는 append-only JSONL. 과거 entry를 수정/삭제하지 않는다.
- 신규 헬퍼 코드는 의존성 추가 없이 Node 내장 모듈만 사용한다(`node:test`, `node:fs`).
- 커밋 메시지는 conventional 형식(접두사 영어 + 한국어 본문).

---

### Task 1: 저장소 부트스트랩 (git + Next.js + 볼트 스켈레톤)

**Files:**
- Create: `repick-design/.gitignore`
- Create: `repick-design/app/` (create-next-app 산출물 전체)
- Create: `repick-design/vault/00-principles/.gitkeep`
- Create: `repick-design/vault/10-references/.gitkeep`
- Create: `repick-design/vault/20-generations/.gitkeep`
- Create: `repick-design/vault/30-ledger/.gitkeep`

**Interfaces:**
- Consumes: 없음 (최초 태스크)
- Produces: `app/`에서 `npm run dev`로 뜨는 Next.js 앱(기본 포트 3000), `vault/` 4개 디렉토리 골격.

- [ ] **Step 1: git 저장소 초기화**

```bash
cd /Users/yss/개발/build/repick-design
git init
```
Expected: `Initialized empty Git repository ...`

- [ ] **Step 2: Next.js 앱 스캐폴드 (비대화형)**

```bash
cd /Users/yss/개발/build/repick-design
npx create-next-app@latest app --typescript --tailwind --app --eslint --src-dir --import-alias "@/*" --use-npm --yes
```
Expected: `app/` 아래 `package.json`, `src/app/`, `tailwind.config.*` 생성. 마지막에 `Success!`.

- [ ] **Step 3: 개발 서버 기동 확인**

```bash
cd /Users/yss/개발/build/repick-design/app && (npm run dev >/tmp/next-dev.log 2>&1 &) ; sleep 8 ; curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3000 ; pkill -f "next dev" || true
```
Expected: `200`

- [ ] **Step 4: 볼트 스켈레톤 생성**

```bash
cd /Users/yss/개발/build/repick-design
mkdir -p vault/00-principles vault/10-references vault/20-generations vault/30-ledger
touch vault/00-principles/.gitkeep vault/10-references/.gitkeep vault/20-generations/.gitkeep vault/30-ledger/.gitkeep
```
Expected: 4개 디렉토리 + .gitkeep 생성.

- [ ] **Step 5: 루트 .gitignore 작성**

```
# deps / build
app/node_modules
app/.next
app/out
# logs
*.log
# os
.DS_Store
```

- [ ] **Step 6: 커밋**

```bash
cd /Users/yss/개발/build/repick-design
git add -A
git commit -m "chore: 저장소 부트스트랩 — Next.js 앱 + 볼트 스켈레톤"
```
Expected: 커밋 성공(파일 다수 추가).

---

### Task 2: 씨앗 심기 (Refero MCP 연결 + 참조 캐시 + design DNA v0)

**Files:**
- Create: `repick-design/vault/00-principles/design-principles.md`
- Create: `repick-design/vault/00-principles/MEMORY.md`
- Create: `repick-design/vault/10-references/README.md`
- Create: `repick-design/vault/10-references/<brand>.design.md` (선별 5~10개)

**Interfaces:**
- Consumes: Task 1의 `vault/` 골격.
- Produces: `design-principles.md`(토큰·톤 v0), `10-references/*.design.md`(RETRIEVE가 읽을 참조 캐시), Refero MCP 등록 상태.

- [ ] **Step 1: Refero MCP 등록**

```bash
claude mcp add --transport http refero https://api.refero.design/mcp --header "Authorization: Bearer <REFERO_TOKEN>"
```
Expected: `Added ... refero`. (첫 호출 시 브라우저 로그인 창이 뜨면 사용자가 로그인)
주: `<REFERO_TOKEN>`은 사용자 Refero 계정 토큰. 토큰이 없으면 대신 무계정 스킬 사용:
```bash
npx skills add https://github.com/referodesign/refero_skill --skill refero-design
```

- [ ] **Step 2: MCP 등록 확인**

```bash
claude mcp list
```
Expected: 목록에 `refero` 포함.

- [ ] **Step 3: 랜딩 스타일 5~10개 조회 후 캐시**

Refero MCP로 "landing page" 계열 스타일 5~10개를 조회하고, 각 결과의 DESIGN.md 본문을 `vault/10-references/<brand>.design.md`로 저장한다. 각 파일 상단에 출처 frontmatter를 단다:

```markdown
---
source: refero
brand: <brand>
fetched: 2026-07-05
tags: [landing]
---

<Refero DESIGN.md 본문 그대로>
```

- [ ] **Step 4: 참조 인덱스 작성** (`10-references/README.md`)

```markdown
# References (씨앗)

Refero MCP로 선별 조회한 랜딩 디자인 스타일 캐시. "내가 골랐다"는 사실 자체가 첫 평가 신호다.

| 파일 | 브랜드 | 고른 이유(한 줄) |
|---|---|---|
| linear.design.md | Linear | 절제된 여백 + 고대비 CTA |
```
(실제 선별한 항목으로 행을 채운다.)

- [ ] **Step 5: design DNA v0 작성** (`00-principles/design-principles.md`)

```markdown
# Design Principles — repick 랜딩 (v0)

> 이 문서가 "현재의 우리 디자인 DNA"다. LEARN 단계가 여기를 surgical하게 갱신한다.

## Voice / Tone
- 한 줄로: (예) 신뢰감 있는 미니멀 — 과장 없이 정보 위계로 승부

## Color Tokens
| 역할 | 값 |
|---|---|
| bg | #0B0B0F |
| fg | #FFFFFF |
| accent | #6E56CF |

## Typography
- 헤딩: Inter / 700 / -0.02em
- 본문: Inter / 400 / 1.6 line-height

## Spacing
- 섹션 상하 패딩 최소 96px (데스크톱)
- 컨텐츠 최대폭 1120px

## Landing 구조 기본형
1. Hero (헤드라인 + 서브 + 단일 CTA)
2. 가치 3분할
3. 소셜프루프
4. 마무리 CTA

## 금지 (anti-slop)
- 의미 없는 그라데이션 남발 X
- 3개 초과 폰트 웨이트 X
```
(실제 브랜드 방향에 맞게 값 조정.)

- [ ] **Step 6: MEMORY 인덱스 초기화** (`00-principles/MEMORY.md`)

```markdown
# MEMORY (학습 인덱스 — 200줄 cap, 한 줄 = 한 학습)

- [design-principles v0](design-principles.md) — 초기 디자인 DNA 씨앗
```

- [ ] **Step 7: 커밋**

```bash
cd /Users/yss/개발/build/repick-design
git add vault/
git commit -m "feat: 볼트 씨앗 — Refero 참조 캐시 + design DNA v0"
```
Expected: 커밋 성공.

---

### Task 3: 루프 헬퍼 스크립트 (ledger + run 스캐폴드) — TDD

**Files:**
- Create: `repick-design/scripts/design-loop.mjs`
- Test: `repick-design/scripts/design-loop.test.mjs`

**Interfaces:**
- Consumes: `vault/30-ledger/design-ledger.jsonl`, `vault/20-generations/`.
- Produces: 아래 3개 named export.
  - `appendLedger(entry: object, ledgerPath: string): void` — entry에 JSON 1줄을 파일 끝에 append(개행 포함). 파일 없으면 생성.
  - `recentDecisions(n: number, ledgerPath: string): object[]` — 마지막 n개 entry를 파싱해 배열로 반환(파일 없으면 `[]`). 오래된→최신 순.
  - `newRun(target: string, baseDir: string, dateStr: string): string` — `<baseDir>/<dateStr>-<target>/candidates/` 생성 후 run 디렉토리 절대경로 반환.

- [ ] **Step 1: 실패하는 테스트 작성** (`scripts/design-loop.test.mjs`)

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { appendLedger, recentDecisions, newRun } from './design-loop.mjs';

test('appendLedger는 파일이 없으면 생성하고 JSON 한 줄을 붙인다', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ledger-'));
  const p = join(dir, 'design-ledger.jsonl');
  appendLedger({ run: 'r1', won: true }, p);
  appendLedger({ run: 'r2', won: false }, p);
  const lines = readFileSync(p, 'utf8').trim().split('\n');
  assert.equal(lines.length, 2);
  assert.deepEqual(JSON.parse(lines[0]), { run: 'r1', won: true });
  rmSync(dir, { recursive: true, force: true });
});

test('recentDecisions는 마지막 n개를 오래된→최신 순으로 반환한다', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ledger-'));
  const p = join(dir, 'design-ledger.jsonl');
  appendLedger({ run: 'r1' }, p);
  appendLedger({ run: 'r2' }, p);
  appendLedger({ run: 'r3' }, p);
  const got = recentDecisions(2, p);
  assert.deepEqual(got.map(e => e.run), ['r2', 'r3']);
  rmSync(dir, { recursive: true, force: true });
});

test('recentDecisions는 파일이 없으면 빈 배열을 반환한다', () => {
  assert.deepEqual(recentDecisions(5, join(tmpdir(), 'nope-xyz.jsonl')), []);
});

test('newRun은 run/candidates 디렉토리를 만들고 run 경로를 반환한다', () => {
  const dir = mkdtempSync(join(tmpdir(), 'gen-'));
  const runPath = newRun('landing', dir, '2026-07-05');
  assert.ok(runPath.endsWith('2026-07-05-landing'));
  assert.ok(existsSync(join(runPath, 'candidates')));
  rmSync(dir, { recursive: true, force: true });
});
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
cd /Users/yss/개발/build/repick-design && node --test scripts/design-loop.test.mjs
```
Expected: FAIL — `Cannot find module './design-loop.mjs'` 류.

- [ ] **Step 3: 최소 구현 작성** (`scripts/design-loop.mjs`)

```javascript
import { appendFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

export function appendLedger(entry, ledgerPath) {
  appendFileSync(ledgerPath, JSON.stringify(entry) + '\n');
}

export function recentDecisions(n, ledgerPath) {
  if (!existsSync(ledgerPath)) return [];
  const lines = readFileSync(ledgerPath, 'utf8').split('\n').filter(Boolean);
  return lines.slice(-n).map((l) => JSON.parse(l));
}

export function newRun(target, baseDir, dateStr) {
  const runPath = join(baseDir, `${dateStr}-${target}`);
  mkdirSync(join(runPath, 'candidates'), { recursive: true });
  return runPath;
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
cd /Users/yss/개발/build/repick-design && node --test scripts/design-loop.test.mjs
```
Expected: PASS — `# pass 4`, `# fail 0`.

- [ ] **Step 5: 커밋**

```bash
cd /Users/yss/개발/build/repick-design
git add scripts/
git commit -m "feat: 루프 헬퍼 — ledger append/read + run 스캐폴드 (TDD)"
```
Expected: 커밋 성공.

---

### Task 4: `/design-evolve` 오케스트레이터 스킬 작성

**Files:**
- Create: `repick-design/.claude/skills/design-evolve/SKILL.md`

**Interfaces:**
- Consumes: Task 2 볼트 지식, Task 3 헬퍼(`scripts/design-loop.mjs`), 기존 에이전트/스킬(`designer`, `comparator`, `perf-audit`, `web-design-guidelines`).
- Produces: `/design-evolve "landing"` 호출로 5단계를 순차 실행하는 스킬. 후보는 `app/src/app/candidates/<run>/<variant>/page.tsx`에 생성되어 `http://localhost:3000/candidates/<run>/<variant>`로 렌더된다.

- [ ] **Step 1: 스킬 파일 작성** (`.claude/skills/design-evolve/SKILL.md`)

````markdown
---
name: design-evolve
description: 디자인 진화 루프 1회 실행 — 볼트 지식으로 반응형 Next.js 랜딩 후보 N개 생성 → 자동 채점(perf/a11y/블라인드 비평) → 상위 2~3개 사람에게 제시 → 최종 선택을 볼트/ledger에 기록. "디자인 생성", "랜딩 후보 뽑아줘", "/design-evolve" 시 사용. 인자: 타깃(기본 landing), N(기본 3).
---

# Design Evolve — 5단계 루프

인자: `$TARGET`(기본 `landing`), `$N`(기본 3). 볼트 루트 `vault/`, 앱 `app/`.

## 1. RETRIEVE
- `vault/00-principles/design-principles.md` 전문을 읽는다(현재 디자인 DNA).
- `vault/10-references/`에서 `$TARGET` 태그가 붙은 참조 3~5개를 읽는다. 부족하면 Refero MCP로 `$TARGET` 스타일을 조회해 `vault/10-references/<brand>.design.md`로 캐시 후 읽는다.
- `node scripts/design-loop.mjs`의 `recentDecisions(5, "vault/30-ledger/design-ledger.jsonl")` 결과를 컨텍스트에 포함(최근 학습 반영).
- run 디렉토리 생성: `newRun($TARGET, "vault/20-generations", <오늘 YYYY-MM-DD>)`.

## 2. GENERATE
- `designer`(또는 `frontend-design-specialist`) 에이전트를 $N회 병렬 호출. 각 호출에 RETRIEVE 컨텍스트(원칙+참조+최근 결정)를 전달하고 서로 다른 방향을 지시(예: A=여백 중심, B=대비 중심, C=타이포 중심).
- 각 후보를 `app/src/app/candidates/<run>/<variant>/page.tsx`로 저장(반응형, Tailwind, 원칙의 토큰 사용). variant ∈ {a,b,c...}.
- 각 후보 소스 사본과 한 줄 컨셉을 `vault/20-generations/<run>/candidates/<variant>.md`에 기록.

## 3. AUTO-SCORE (자동 1차 필터)
- `app`에서 dev 서버를 띄운다(백그라운드). 각 후보 URL에 대해:
  - 객관: `/perf-audit http://localhost:3000/candidates/<run>/<variant>` (Lighthouse: Perf/LCP/CLS/TBT).
  - 접근성/UX: `/web-design-guidelines`로 후보 소스 감사(위반 수).
  - 토큰 준수: 후보에서 사용된 색상 hex가 `design-principles.md` Color Tokens 안에 있는지 점검(벗어난 hex 개수).
- 심사: `comparator` 에이전트로 후보들을 블라인드 A/B 랭킹 + `design-principles.md` 대조 비평(한 줄씩).
- 위 결과를 표로 `vault/20-generations/<run>/SCORES.md`에 기록하고 종합 상위 2~3개를 선정. dev 서버는 종료.

## 4. HUMAN GATE
- 사용자에게 상위 2~3개만 제시: 각 후보의 렌더 URL + 점수 요약 + 심사 한 줄. `npm run dev`로 직접 보라고 안내.
- 사용자의 승자 선택 + 한 줄 이유를 받는다. (사용자 응답 없이 다음 단계로 진행 금지.)
- `vault/20-generations/<run>/DECISION.md`에 승자/이유/탈락 사유를 기록.

## 5. LEARN
- 승자의 "이유"에서 재사용 가능한 규칙을 1개 추출해 `design-principles.md`를 surgical하게 갱신(있으면 강화, 없으면 추가). 무관한 부분은 건드리지 않는다.
- `appendLedger(entry, "vault/30-ledger/design-ledger.jsonl")` 호출. entry 스키마:
  `{run, candidate, won:true, reason, metrics:{perf,a11y,lcp_ms}, principle_delta}`
- `00-principles/MEMORY.md`에 한 줄 추가(200줄 cap 유지).
- 승자 페이지를 `app/src/app/page.tsx`로 승격(현재 최선의 랜딩).
- 완료 요약을 사용자에게 보고: 무엇이 이겼는지, 원칙이 어떻게 바뀌었는지.

## 금지
- 사람 선택 없이 원칙/ledger를 갱신하지 않는다(사람이 최종 신호).
- 과거 ledger entry 수정 금지(append-only).
- 요청 타깃 외 페이지 생성 금지(랜딩 루프 검증 우선).
````

- [ ] **Step 2: 스킬 인식 확인**

```bash
cd /Users/yss/개발/build/repick-design && test -f .claude/skills/design-evolve/SKILL.md && head -5 .claude/skills/design-evolve/SKILL.md
```
Expected: frontmatter의 `name: design-evolve`가 출력됨.

- [ ] **Step 3: 커밋**

```bash
cd /Users/yss/개발/build/repick-design
git add .claude/
git commit -m "feat: /design-evolve 오케스트레이터 스킬 (5단계 루프)"
```
Expected: 커밋 성공.

---

### Task 5: 엔드투엔드 검증 — 루프 1회차 + 폐루프 증명(2회차)

**Files:**
- Modify: `repick-design/vault/00-principles/design-principles.md` (1회차 LEARN 결과)
- Create: `repick-design/vault/20-generations/<run>/{SCORES.md,DECISION.md}` (루프 산출)
- Create: `repick-design/vault/30-ledger/design-ledger.jsonl` (1회차 entry)

**Interfaces:**
- Consumes: Task 1~4 전체.
- Produces: 성공 기준(§9) 충족 증거 — 무중단 완주 + 2회차 RETRIEVE가 1회차 결정을 실제 반영.

- [ ] **Step 1: 1회차 루프 실행**

`/design-evolve "landing"` 호출. 5단계가 순차 진행되어 HUMAN GATE에서 상위 2~3 후보가 제시되는지 확인.

- [ ] **Step 2: 사람 선택 + LEARN 반영 확인**

승자 선택 후:
```bash
cd /Users/yss/개발/build/repick-design
test -f vault/30-ledger/design-ledger.jsonl && node --test scripts/design-loop.test.mjs >/dev/null 2>&1 ; node -e "import('./scripts/design-loop.mjs').then(m=>console.log(m.recentDecisions(1,'vault/30-ledger/design-ledger.jsonl')))"
```
Expected: ledger에 1회차 entry 1개(`won:true`, `principle_delta` 채워짐)가 출력됨.

- [ ] **Step 3: 폐루프 증명 — 2회차 RETRIEVE 반영 확인**

`/design-evolve "landing"` 2회차 호출. RETRIEVE 단계 로그/서술에서 1회차 `DECISION.md` 또는 `principle_delta`가 컨텍스트로 인용되고, 생성 후보 중 최소 하나가 1회차에서 추가된 원칙(예: hero 패딩 규칙)을 실제로 반영하는지 확인.
Expected: 2회차 후보가 1회차 학습을 반영 = 폐루프 성립.

- [ ] **Step 4: 최종 커밋**

```bash
cd /Users/yss/개발/build/repick-design
git add vault/ app/src/app/page.tsx
git commit -m "feat: 디자인 진화 루프 1회차 완주 — 폐루프 검증"
```
Expected: 커밋 성공.

---

## 완료 정의 (Definition of Done)

- `/design-evolve "landing"` 1회 호출로 3후보 생성 → 자동 채점 → 상위 2~3 제시 → 사람 선택 → ledger append 까지 무중단 완주.
- 2회차 실행 시 1회차 결정이 RETRIEVE 컨텍스트로 실제 반영됨(폐루프).
- `vault/`에 원칙·참조·생성·결정·ledger가 축적되고 git 이력으로 진화가 추적됨.
