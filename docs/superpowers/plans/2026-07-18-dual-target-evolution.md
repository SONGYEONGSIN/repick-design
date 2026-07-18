# 이중 타깃 자율 진화 + LLM Wiki 정렬 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 야간 자율 라운드를 dash/landing 무작위 이중 타깃으로 확장하고, vault를 Karpathy LLM Wiki 패턴(index·lint·ingest 파급)에 정렬.

**Architecture:** 파이프라인 골격은 유지하고 타깃 파라미터 테이블로 분기. 위키 기계 lint는 순수 함수 스크립트(TDD), 판단 lint(모순/stale)는 주간 반증 에이전트가 수행. ledger는 `auto-ledger.jsonl`로 통합(rename), 격리 delta는 타깃별 분리.

**Tech Stack:** Node ESM + node:test(기존 패턴), Claude Code 스킬 2종 개정, Next.js 갤러리 1함수 확장, RemoteTrigger(routine — 컨트롤러 전용).

**Spec:** `docs/superpowers/specs/2026-07-18-dual-target-evolution-design.md`

## Global Constraints

- 스크립트는 plain ESM `.mjs` + `node:test` + 한국어 테스트명, `pathToFileURL` isMain 가드(한국어 경로).
- jsonl append-only — rename(git mv)은 허용, 내용 소급 수정 금지. 기존 ledger 4 entry는 target 필드 없이 유지.
- 정본 2개(`dash-brief-v3.md`, `design-principles.md`)는 자율 라운드 수정 금지 — apply에서만.
- 커밋: conventional + 한국어 + `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` 푸터. 구축 작업은 main에 커밋, **push는 Task 7(컨트롤러)에서 일괄** — main push는 프로덕션 자동 배포이므로 중간 상태 배포 금지.
- dev 서버 3100 실행 중이면 재사용(재기동 금지). 검증 스크립트는 repo 루트에서 실행.
- Task 6(스모크)만 evolve/dash 브랜치에서, 나머지는 main에서 작업.

---

### Task 1: `scripts/wiki-lint.mjs` — 기계 lint 3종 (TDD)

**Files:**
- Create: `scripts/wiki-lint.mjs`
- Test: `scripts/wiki-lint.test.mjs`

**Interfaces:**
- Consumes: 없음 (node 내장만).
- Produces: `extractLinks(md: string) → string[]`(alias·경로 포함 원형 target), `lintVault(files: Record<string,string>) → {orphans: string[], broken: string[], unindexed: string[]}` — `files`의 key는 vault/ 기준 상대경로. CLI `node scripts/wiki-lint.mjs` → vault/ 디스크 스캔, 결과 JSON 출력, 위반 1건 이상이면 exit 1. Task 2(위생 검증)·Task 4(falsify SKILL이 호출)가 소비.

**Lint 규칙 (구현 계약):**
- 링크 추출: `[[target|alias]]` → `target`. 정규식 `/\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g`.
- 링크 해석: target의 마지막 `/` 뒤 basename이 vault 내 어떤 `.md` 파일의 basename(확장자 제외)과 일치하면 해석 성공.
- **broken**: 해석 실패한 링크 — `"<파일>: [[<target>]]"` 형식으로 보고.
- **orphans**: 인바운드 링크 0인 노트. 검사 대상 = `00-principles/*.md` + `30-ledger/*.md` + vault 루트 `*.md`. 제외 = `index.md`(카탈로그), `🏠`로 시작하는 홈 MOC(그래프 루트). 인바운드 집계 시 **index.md발 링크는 세지 않는다**(카탈로그 등재가 고아 검사를 무력화하면 안 됨).
- **unindexed**: `index.md`에 `[[basename]]` 형태로 등재되지 않은 파일. 대상 = orphan 검사 대상 전체 + `20-generations/*/DECISION.md` + `10-references/README.md`. 제외 = `index.md` 자신, README 외 `10-references/*`(README가 대표).

- [ ] **Step 1: 실패하는 테스트 작성**

`scripts/wiki-lint.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractLinks, lintVault } from './wiki-lint.mjs';

test('extractLinks는 alias·경로 포함 target을 원형으로 추출한다', () => {
  const md = `[[design-principles]] · [[20-generations/2026-07-06-landing/DECISION|R1]] 텍스트 [[curation-criteria|기준]]`;
  assert.deepEqual(extractLinks(md), ['design-principles', '20-generations/2026-07-06-landing/DECISION', 'curation-criteria']);
});

test('broken: 실존하지 않는 대상 링크를 잡는다', () => {
  const files = {
    '🏠 홈.md': '[[있는노트]] [[없는노트]]',
    '00-principles/있는노트.md': '내용',
    'index.md': '- [[있는노트]]',
  };
  const r = lintVault(files);
  assert.deepEqual(r.broken, ['🏠 홈.md: [[없는노트]]']);
});

test('orphans: 인바운드 0인 노트를 잡되 index.md발 링크는 세지 않는다', () => {
  const files = {
    '🏠 홈.md': '[[a]]',
    '00-principles/a.md': '',
    '00-principles/b.md': '',
    'index.md': '- [[a]]\n- [[b]]',
  };
  const r = lintVault(files);
  assert.deepEqual(r.orphans, ['00-principles/b.md']);
});

test('orphans: 홈 MOC와 index.md 자신은 검사 대상이 아니다', () => {
  const files = { '🏠 홈.md': '', 'index.md': '' };
  assert.deepEqual(lintVault(files).orphans, []);
});

test('unindexed: index.md 미등재를 잡고, 10-references는 README만 요구한다', () => {
  const files = {
    '🏠 홈.md': '[[a]] [[README]] [[DECISION]]',
    '00-principles/a.md': '',
    '10-references/README.md': '',
    '10-references/mercury.design.md': '',
    '20-generations/2026-07-15-auto-dash-r1/DECISION.md': '',
    'index.md': '- [[a]]',
  };
  const r = lintVault(files);
  assert.deepEqual(r.unindexed.sort(), ['10-references/README.md', '20-generations/2026-07-15-auto-dash-r1/DECISION.md']);
});

test('클린 vault는 위반 0', () => {
  const files = {
    '🏠 홈.md': '[[a]] [[README]]',
    '00-principles/a.md': '[[README]]',
    '10-references/README.md': '',
    'index.md': '- [[a]]\n- [[README]]',
  };
  assert.deepEqual(lintVault(files), { orphans: [], broken: [], unindexed: [] });
});
```

- [ ] **Step 2: 실패 확인** — Run: `node --test scripts/wiki-lint.test.mjs` / Expected: FAIL (`Cannot find module`)

- [ ] **Step 3: 구현**

`scripts/wiki-lint.mjs`:

```js
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';
import { pathToFileURL } from 'node:url';

const LINK_RE = /\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g;

export function extractLinks(md) {
  return [...md.matchAll(LINK_RE)].map((m) => m[1]);
}

const stem = (p) => basename(p).replace(/\.md$/, '');
const isHome = (p) => basename(p).startsWith('🏠');

export function lintVault(files) {
  const paths = Object.keys(files);
  const stems = new Set(paths.map(stem));

  const broken = [];
  const inbound = new Set();
  for (const [path, content] of Object.entries(files)) {
    for (const target of extractLinks(content)) {
      const t = stem(target);
      if (!stems.has(t)) broken.push(`${path}: [[${target}]]`);
      else if (path !== 'index.md') inbound.add(t);
    }
  }

  const noteTargets = paths.filter(
    (p) => (p.startsWith('00-principles/') || p.startsWith('30-ledger/') || !p.includes('/')) &&
      p.endsWith('.md') && p !== 'index.md' && !isHome(p),
  );
  const orphans = noteTargets.filter((p) => !inbound.has(stem(p)));

  const indexContent = files['index.md'] ?? '';
  const indexed = new Set(extractLinks(indexContent).map(stem));
  const indexTargets = [
    ...noteTargets,
    ...paths.filter((p) => /^20-generations\/[^/]+\/DECISION\.md$/.test(p)),
    ...paths.filter((p) => p === '10-references/README.md'),
  ];
  const unindexed = indexTargets.filter((p) => !indexed.has(stem(p)));

  return { orphans, broken, unindexed };
}

function readVault(dir) {
  const files = {};
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const full = join(d, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name.endsWith('.md')) files[full.slice(dir.length + 1)] = readFileSync(full, 'utf8');
    }
  };
  walk(dir);
  return files;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const result = lintVault(readVault('vault'));
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.orphans.length + result.broken.length + result.unindexed.length ? 1 : 0);
}
```

- [ ] **Step 4: 테스트 통과** — Run: `node --test scripts/wiki-lint.test.mjs` / Expected: PASS (6 tests). 이어서 `npm test` → 23개 전체 PASS.

- [ ] **Step 5: 현 vault 실측 (위반 발견이 정상)** — Run: `node scripts/wiki-lint.mjs; echo exit=$?` / Expected: exit=1 — index.md 부재로 unindexed 다수 + 🏠·AUTO-RUN-LOG의 `[[20-generations/2026-07-0*...]]` 죽은 링크(해당 디렉토리 main 부재) broken 다수. **이 출력을 그대로 리포트에 기록**(Task 2의 입력).

- [ ] **Step 6: 커밋**

```bash
git add scripts/wiki-lint.mjs scripts/wiki-lint.test.mjs
git commit -m "feat(wiki): 기계 lint 3종(고아·깨진 링크·미등재) — Karpathy 정렬

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: vault 정비 — index.md·landing delta·ledger rename·위생

**Files:**
- Create: `vault/index.md`
- Create: `vault/00-principles/landing-deltas-provisional.jsonl` (빈 파일)
- Rename: `vault/30-ledger/dash-auto-ledger.jsonl` → `vault/30-ledger/auto-ledger.jsonl` (git mv)
- Modify: `vault/🏠 Design Evolution.md` (dash-brief-v3 링크 추가 + 죽은 링크 플레인 텍스트화)
- Modify: `vault/30-ledger/AUTO-RUN-LOG.md` (죽은 링크 플레인 텍스트화)

**Interfaces:**
- Consumes: Task 1의 `node scripts/wiki-lint.mjs` (검증 게이트).
- Produces: lint 0 상태의 vault. Task 3/4의 SKILL이 참조하는 경로: `vault/30-ledger/auto-ledger.jsonl`, `vault/00-principles/landing-deltas-provisional.jsonl`, `vault/index.md`.

- [ ] **Step 1: index.md 작성**

`vault/index.md`:

```markdown
---
tags: [index]
---

# INDEX — vault 전수 카탈로그

> 갱신 의무: 자율 라운드(§7 기록)와 주간 apply가 신규/승격 노트를 여기에 등재한다. lint(`scripts/wiki-lint.mjs`)가 미등재를 잡는다. 홈([[🏠 Design Evolution]])은 선별 목차, 여기는 전수.

## 원칙 (00-principles — 위키 정본층)
- [[dash-brief-v3]] — SaaS 대시보드 생성 브리프 v3 (서비스급 기준·그리드 크래프트 룰)
- [[design-principles]] — 랜딩 디자인 DNA (R7 수렴 정본)
- [[curation-criteria]] — 지식 정제 meta-기준 (L1~L3 레벨·승격 규칙)
- [[questions-queue]] — 정제 게이트 질문 큐 (대기/아카이브)
- [[MEMORY]] — 학습 인덱스 (200줄 cap)

## 원장 (30-ledger — append-only 로그층)
- [[AUTO-RUN-LOG]] — 자율 라운드 실행 로그 (사람용 요약)
- [[NEW-PAGES-LOG]] — 신규 페이지 생성 로그
- auto-ledger.jsonl — 자율 라운드 원장 (target·판정·반증)
- design-ledger.jsonl — 랜딩 R1~R7 계보 원장
- landing-forms.jsonl — 랜딩 형태·선별 학습 원장

## 격리 (00-principles — 잠정 delta)
- dash-deltas-provisional.jsonl — dash 격리 delta
- landing-deltas-provisional.jsonl — landing 격리 delta

## 참조 (10-references — raw 불변층)
- [[README]] — Refero 캐시 45종 인덱스 (개별 파일은 README가 대표)

## 세대 기록 (20-generations — 라운드별 DECISION, evolve 브랜치에서 누적)
_(main 기준 없음 — 라운드 커밋이 DECISION 등재를 추가한다)_
```

- [ ] **Step 2: 빈 delta 파일 + ledger rename**

```bash
touch vault/00-principles/landing-deltas-provisional.jsonl
git mv vault/30-ledger/dash-auto-ledger.jsonl vault/30-ledger/auto-ledger.jsonl
```

- [ ] **Step 3: 🏠 위생** — "## 핵심 노트" 목록에 두 줄 추가:

```markdown
- [[dash-brief-v3]] — 대시보드 생성 브리프 (dash 루프 정본)
- [[index]] — vault 전수 카탈로그
```

그리고 "## 라운드별 결정 (진화 체인)" 섹션의 7개 죽은 링크를 플레인 텍스트로 전환 — 예: `- [[2026-07-07-auto-r2/DECISION|R2]] — a (타이포 극대화)` → `- R2 — a (타이포 극대화) *(기록: design-ledger.jsonl — 원 노트는 정리됨)*`. 같은 방식으로 7줄 전부(R1 수동 포함). `vault/30-ledger/AUTO-RUN-LOG.md`의 "라운드 노트 (백링크)" 섹션 7줄도 동일하게 플레인 텍스트화.

- [ ] **Step 4: 검증** — Run: `node scripts/wiki-lint.mjs; echo exit=$?` / Expected: `{"orphans":[],"broken":[],"unindexed":[]}` + exit=0. 그리고 `node -e "console.log(require('fs').readFileSync('vault/30-ledger/auto-ledger.jsonl','utf8').trim().split('\n').length)"` → `4` (기존 entry 보존).

- [ ] **Step 5: 커밋**

```bash
git add -A vault/ && git commit -m "feat(vault): index 카탈로그·landing delta·ledger 통합 rename·링크 위생

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: dash-evolve SKILL.md 이중 타깃 개정

**Files:**
- Modify: `.claude/skills/dash-evolve/SKILL.md` (전문 교체)

**Interfaces:**
- Consumes: Task 2의 경로들(auto-ledger.jsonl, landing-deltas-provisional.jsonl, index.md).
- Produces: 이중 타깃 라운드 플레이북. ledger entry 스키마에 `target` 필드 추가: `{target:'dash'|'landing', round, date, winner, no_winner, hardgate, judges, refuted}`. delta entry는 기존 스키마 동일(파일만 타깃별).

- [ ] **Step 1: 파일 전문을 아래로 교체**

````markdown
---
name: dash-evolve
description: 자율 진화 1라운드 (이중 타깃 — SaaS 대시보드 또는 랜딩페이지를 무작위 선택) — 정본 brief+격리 delta로 후보 3개 생성 → 하드게이트(정적·sweep·a11y) → 3렌즈 judge 다수결 → delta 격리 적재 → 정제 게이트 → evolve/dash 커밋. "/dash-evolve", "자율 라운드" 시 사용. 무인 실행 전제 — 사람 확인 없이 완주하며 no-winner 라운드를 허용한다.
---

# dash-evolve — 자율 라운드 (무인, 이중 타깃)

**불변식: 정본 2개(`vault/00-principles/dash-brief-v3.md`, `vault/00-principles/design-principles.md`)와 `/dash` 갤러리·`/v1~v5`는 절대 수정하지 않는다. jsonl은 append-only. main에 커밋하지 않는다.**

## 0. 준비 — 타깃 선택
- 브랜치: `git checkout evolve/dash` (없으면 `git checkout -b evolve/dash`).
- **타깃 무작위 결정**: `TARGET=$([ $((RANDOM % 2)) -eq 0 ] && echo dash || echo landing)` — 결과는 ledger에 기록되므로 재현성은 ledger가 담보 (후보 코드의 결정론 규칙과 무관한 오케스트레이션 난수).
- 라운드 번호 N = `vault/30-ledger/auto-ledger.jsonl`에서 **해당 타깃의 최대 라운드 번호 + 1** (타깃별 독립 시퀀스):
  `node -e "const ls=require('fs').readFileSync('vault/30-ledger/auto-ledger.jsonl','utf8').trim().split('\n').filter(Boolean).map(JSON.parse); const t='<TARGET>'; console.log(Math.max(0,...ls.filter(e=>e.round.startsWith('auto-'+t+'-r')).map(e=>+e.round.split('-r')[1]))+1)"`
- run id = `auto-<TARGET>-r<N>`. run 디렉토리: `node -e "import('./scripts/design-loop.mjs').then(m=>console.log(m.newRun('auto-<TARGET>-r<N>','vault/20-generations','<오늘 YYYY-MM-DD>')))"`

## 타깃 파라미터 (이하 전 단계에서 치환)

| 변수 | dash | landing |
|---|---|---|
| BRIEF | `vault/00-principles/dash-brief-v3.md` | `vault/00-principles/design-principles.md` |
| DELTAS | `vault/00-principles/dash-deltas-provisional.jsonl` | `vault/00-principles/landing-deltas-provisional.jsonl` |
| ROUTES | `app/src/app/dash-evolve/r<N>/` | `app/src/app/landing-evolve/r<N>/` |
| 중복 금지 | `/dash` 갤러리 등록분 + dash-evolve 누적 아키타입 | `/v1~v5` + landing-evolve 누적 형태(landing-forms.jsonl 용어) |
| judge 렌즈 | brief 준수 / 상용 SaaS 완성도(Mercury·Asana·n8n·Coinbase) / 아키타입 차별성 | DNA 준수 / 상용 랜딩 완성도(Linear·Stripe·Vercel급) / 형태 차별성 |

## 1. RETRIEVE
다음을 전부 읽어 생성 컨텍스트를 구성한다:
- BRIEF 전문 (정본 — 읽기 전용)
- DELTAS 전체 (격리 delta — status가 refuted가 아닌 최신 entry들)
- `vault/00-principles/curation-criteria.md` (meta-기준 — judge·정제 프롬프트에 주입)
- `vault/30-ledger/auto-ledger.jsonl`에서 해당 타깃 최근 5개 (직전 승자·no-winner 사유)
- 중복 금지 목록 (타깃 파라미터 참조) 정리

## 2. GENERATE — 3병렬
- designer(또는 frontend-design-specialist) 에이전트 3개 병렬 호출. 각자에게: RETRIEVE 컨텍스트 + 서로 다른 아키타입/형태 명시 지정(중복 금지 목록 포함) + 산출 경로.
- 경로: ROUTES`{a,b,c}/page.tsx` (+client 컴포넌트 분리 허용, 자기 폴더만).
- 각 후보의 한 줄 컨셉을 `vault/20-generations/<run>/candidates/<v>.md`에 기록.

## 3. HARD GATE (하나라도 실패 → 1회 수정 기회 → 재실패 시 탈락)
- dev 서버: 3100 응답 확인(`curl -s -o /dev/null -w '%{http_code}' http://localhost:3100/`), 없으면 `cd app && npm run dev` 백그라운드 기동(이 라운드가 띄웠으면 마지막에 종료).
- **정적**: `node scripts/dash-static-check.mjs <ROUTES-루트 상대경로>/<v>/*.tsx` — 위반 JSON을 해당 designer에 전달해 1회 수정.
- **sweep**: `node scripts/dash-sweep.mjs --base http://localhost:3100 --routes <라우트 a b c>` — 실패 후보만 failures JSON 전달해 1회 수정 후 재sweep. (랜딩도 동일한 그리드 룰 — 전 폭 오버플로 금지.)
- **Lighthouse**: `npx lighthouse http://localhost:3100<라우트> --only-categories=performance,accessibility --preset=desktop --output=json --output-path=stdout --chrome-flags="--headless" 2>/dev/null` → a11y ≥95(하드게이트). perf는 기록만 — dev 서버 측정치는 탈락 사유로 쓰지 않는다. 명령 자체 실패 시 skip + `"lighthouse":"unavailable"` 기록.
- 게이트 결과를 `vault/20-generations/<run>/SCORES.md`에 표로 기록.

## 4. JUDGE 패널 (생존 후보 2개 이상일 때; 1개면 단독 심사로 승자/no-winner만 판정)
- 스크린샷: 후보별 4폭 캡처 → `npx playwright screenshot --viewport-size=<w>,900 http://localhost:3100<라우트> vault/20-generations/<run>/shots/<v>-<w>.png` (w ∈ 1280, 1440, 1920, 390).
- judge 3개 병렬(Agent 도구, comparator 계열). 공통 입력: 스크린샷 + 소스 경로 (컨셉·순서 비공개 — 블라인드). 렌즈는 타깃 파라미터 표를 따른다 (렌즈 1=정본 대조, 렌즈 2=상용 완성도, 렌즈 3=구조 차별성).
- judge가 응답 없이 정지하면 1회 재디스패치, 재실패 시 해당 렌즈 기권 — 잔여 2렌즈 다수결(동률이면 렌즈 1 우선, 렌즈 1 기권 시 렌즈 2 우선). 기권은 DECISION.md에 명시.
- 각 judge 출력: 랭킹 + 후보별 한 줄 사유 + (전원 미달 시) no-winner 표.
- 집계: 1위 표 다수결. **no-winner 표 2개 이상이면 라운드 no-winner** — 억지 승자 금지.
- 판정 전문을 `vault/20-generations/<run>/DECISION.md`에 기록.

## 5. LEARN — 격리 적재
승자가 있으면 판정 사유에서 재사용 가능한 delta **1개**를 추출해 DELTAS에 append:
```bash
node -e "import('./scripts/design-loop.mjs').then(m=>m.appendLedger({round:'auto-<TARGET>-r<N>',variant:'<v>',delta:'<한 줄>',evidence:'<judge 사유 인용>',judge_votes:{lens1:'<v>',lens2:'<v>',lens3:'<v>'},confidence:'<high|low>',level:'L1',status:'provisional'},'<DELTAS>'))"
```
level은 L1로 — 상승은 정제 게이트가 판단.

## 6. 지식 정제 게이트
- 해당 타깃 DELTAS 전체 로드 → 클러스터링: 유사 delta 묶음, 충돌 쌍 식별 (타깃 간 교차 충돌도 — 예: dash delta가 landing 정본과 모순되면 질문 대상).
- **레벨 재책정**: curation-criteria.md 체크리스트로 판정. 재현(2라운드+)·기계 검증 가능 delta는 `{...원본, level:'L2'|'L3', supersedes:'<원본 round>', status:'provisional'}` append (원줄 수정 금지).
- **질문 강제 생성**: ① 충돌 쌍 ② meta-기준으로 정당화 불가 — `questions-queue.md` "대기 중"에 append(질문에 target 표기 + 배경 + 잠정 가설). 동일 유형 중복 금지.

## 7. 기록 + 커밋
- auto-ledger append: `{target:'<TARGET>', round:'auto-<TARGET>-r<N>', date:'<YYYY-MM-DD>', winner:'<v>'|null, no_winner:<bool>, hardgate:{sweep:'...', static:'...', lighthouse:'...'}, judges:{lens1:'<v>',lens2:'<v>',lens3:'<v>'}, refuted:null}` → `vault/30-ledger/auto-ledger.jsonl`
- **index.md 갱신**: `vault/index.md`의 "세대 기록" 섹션에 `- [[DECISION]]` 형태로 이번 run의 DECISION을 등재 (경로 포함형: `[[20-generations/<run>/DECISION|<run>]]`).
- no-winner면 사유를 DECISION.md에 남기고 후보 route 유지(주간 반증에서 일괄 드롭).
- `git add -A && git commit -m "feat(dash-evolve): <TARGET> r<N> <승자 v — 아키타입/형태 | no-winner>"` (+ Co-Authored-By 푸터) → `git push origin evolve/dash`.
````

- [ ] **Step 2: 검증** — Run: `head -4 .claude/skills/dash-evolve/SKILL.md` (frontmatter 유지) + `grep -c "TARGET" .claude/skills/dash-evolve/SKILL.md` → 8 이상.

- [ ] **Step 3: 커밋**

```bash
git add .claude/skills/dash-evolve/SKILL.md
git commit -m "feat(skill): dash-evolve 이중 타깃 — 무작위 dash/landing + index 갱신

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: dash-falsify SKILL.md 개정 — 타깃 섹션·랜딩 apply·위키 건전성

**Files:**
- Modify: `.claude/skills/dash-falsify/SKILL.md` (전문 교체)

**Interfaces:**
- Consumes: Task 1 CLI(wiki-lint), Task 2 경로(auto-ledger, landing-deltas, index.md), Task 3 ledger 스키마(target 필드).
- Produces: 이중 타깃 주간 반증 플레이북 (open/apply).

- [ ] **Step 1: 파일 전문을 아래로 교체**

````markdown
---
name: dash-falsify
description: 자율 진화 주간 반증 (이중 타깃) — evolve/dash 누적분으로 대시보드·랜딩 섹션의 반증 PR 생성(open 모드, 무인) / 사람 리뷰 결과 반영+위키 갱신+squash merge(apply 모드). "/dash-falsify open", "/dash-falsify apply", "반증 PR", "주간 리뷰 반영" 시 사용.
---

# dash-falsify — 주간 반증 (이중 타깃)

인자: `open`(기본) 또는 `apply`.

## open 모드 (무인 — 주간 routine)
1. `git fetch && git log origin/main..origin/evolve/dash --oneline` — 누적 커밋이 없으면 "반증할 산출물 없음" 로그만 남기고 종료. 누적 커밋이 있으면 이후 모든 파일 읽기(auto-ledger·provisional·questions-queue·DECISION.md·index.md)는 evolve/dash 컨텍스트에서 한다 — `git checkout evolve/dash` 또는 `git show origin/evolve/dash:<경로>` (main 워킹트리에서 읽으면 본문이 빈 채 조립된다).
2. PR 본문 조립 — **타깃별 섹션**:
   - `## 대시보드` / `## 랜딩` 각각: 주간 라운드 표(auto-ledger에서 해당 target entry), L3 delta 편입 제안(해당 DELTAS의 최신 level=L3 & status=provisional), L1/L2 잔류 요약, 라운드별 DECISION.md 상대경로 링크 + 대표 스크린샷 경로. 해당 타깃 라운드가 없던 주면 섹션에 "이번 주 라운드 없음" 1줄.
   - `## 질문 큐`: questions-queue.md "대기 중" 전문 (target 표기 포함).
   - `## 위키 건전성`: ① 기계 — `node scripts/wiki-lint.mjs` 실행 결과 JSON(위반 0이면 "clean") ② 판단 — 페이지 간 모순·stale 주장(최신 delta가 정본과 충돌하는 사례) 스캔 결과를 2~3줄로.
   - `## 리뷰 방법`: "후보 킵/드롭·delta 승인/기각·질문 답변을 PR 코멘트로 남기고 로컬에서 /dash-falsify apply 실행".
3. 열린 반증 PR이 있으면 `gh pr edit`로 본문 갱신, 없으면 `gh pr create --base main --head evolve/dash` (제목: "feat(evolve): 주간 자율 진화 반증 <기간>").

## apply 모드 (로컬 세션 — 사람 리뷰 완료 후)
입력: PR 코멘트(`gh pr view <num> --comments`) 또는 대화로 받은 ① 후보 킵/드롭 ② delta 승인/기각 ③ 질문 답변. 입력 없는 항목은 건너뛴다.
1. **delta 승인 (타깃별 정본 편입 + ingest 파급)** — dash delta는 `dash-brief-v3.md`에, landing delta는 `design-principles.md`에 surgical 편입. **편입할 때 그 내용을 참조·인접하는 관련 노트(curation-criteria, 반대 타깃 brief의 공통 룰 등)의 상호참조([[링크]])도 동반 갱신한다** — "1건 편입 = 관련 페이지들 터치". provisional에는 `{...원본, status:'promoted', supersedes:'<round>'}` append.
2. **delta 기각** — provisional에 `{...원본, status:'refuted', supersedes:'<round>'}` append + auto-ledger에 해당 라운드 원본 entry 전체를 spread한 `{...원본, refuted:true, refute_reason:'<사유>'}`를 append(자기완결 줄 유지 — 같은 round의 최신 줄이 유효). **refute rate**(기각된 judge 승자 / 전체 승자 판정, 타깃 통합)를 계산해 40% 초과면 "judge 렌즈 개선 필요" finding을 사용자에게 보고.
3. **질문 답변** — 답변에서 재사용 가능한 정제 기준을 추출해 curation-criteria.md "축적된 기준"에 append, 해당 질문은 questions-queue.md 아카이브로 이동.
4. **후보 킵/드롭** — dash 킵: `git mv app/src/app/dash-evolve/r<N>/<v> app/src/app/dash/d<다음>` + `/dash` 갤러리 등재(works.ts `DASH_LAB_WORKS`). landing 킵: `git mv app/src/app/landing-evolve/r<N>/<v> app/src/app/(marketing)/v<다음>` + works.ts `LANDING_WORKS` 등재. 두 경우 모두 `works.ts`의 `LAST_UPDATED`를 오늘 날짜 문자열로 갱신. **챔피언(`/`) 교체는 사용자가 명시적으로 지시할 때만.** 드롭: 해당 후보 디렉토리 삭제.
5. **위키 마감** — index.md에 승격/신규 노트 등재 반영 → `node scripts/wiki-lint.mjs` 재실행, 위반 0 확인(승격이 만든 깨진 링크·미등재 즉시 수정).
6. 반영 커밋(evolve/dash) → `cd app && npx next build` 통과 확인 → `gh pr merge <num> --squash` (PR 제목 conventional 확인). 머지 후 `git fetch origin && git checkout -B evolve/dash origin/evolve/dash && git rebase main && git push --force-with-lease origin evolve/dash` — 반드시 **origin/evolve/dash 기준으로 로컬 브랜치를 재설정한 뒤** rebase(낡은 로컬 브랜치를 rebase하면 그 사이 착지한 야간 라운드 커밋이 force-push로 유실된다 — 2026-07-15 실사고). reset --hard main이 아닌 rebase(PR open 이후 커밋 보존).

## 금지
- open 모드에서 어떤 파일도 수정하지 않는다 (PR 생성/갱신만).
- apply 모드에서 사람 입력 없는 delta를 임의로 승인/기각하지 않는다.
````

- [ ] **Step 2: 검증** — `grep -c "위키 건전성\|wiki-lint" .claude/skills/dash-falsify/SKILL.md` → 3 이상, `grep -c "LANDING_WORKS" ...` → 1.

- [ ] **Step 3: 커밋**

```bash
git add .claude/skills/dash-falsify/SKILL.md
git commit -m "feat(skill): dash-falsify 이중 타깃 — 랜딩 apply·위키 건전성 게이트

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: 갤러리 evolveWorks 이중 스캔

**Files:**
- Modify: `app/src/app/gallery/page.tsx` (evolveWorks 함수 교체)

**Interfaces:**
- Consumes: 기존 `Work` 타입.
- Produces: Ⅳ 탭에 DASH/LANDING 라벨 공존.

- [ ] **Step 1: evolveWorks를 아래로 교체** (숫자 정렬 comparator 유지)

```tsx
/** evolve/dash 브랜치 체크아웃에서만 존재하는 자율 루프 후보를 열거 (main/프로덕션 = 자동 숨김) */
function evolveWorks(): Work[] {
  const out: Work[] = [];
  for (const [dir, label] of [
    ["dash-evolve", "DASH"],
    ["landing-evolve", "LANDING"],
  ] as const) {
    const base = join(process.cwd(), "src/app", dir);
    if (!existsSync(base)) continue;
    const rounds = readdirSync(base)
      .filter((d) => /^r\d+$/.test(d))
      .sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
    for (const round of rounds) {
      for (const v of readdirSync(join(base, round)).sort()) {
        if (existsSync(join(base, round, v, "page.tsx"))) {
          out.push({
            id: `${label.toLowerCase()}-${round}/${v}`,
            route: `/${dir}/${round}/${v}`,
            brand: `${label} ${round.toUpperCase()} · ${v.toUpperCase()}`,
            desc: "자율 진화 라운드 후보 — 주간 반증 대기 (미승격)",
          });
        }
      }
    }
  }
  return out;
}
```

- [ ] **Step 2: 검증** — `cd app && npx tsc --noEmit` → 0 errors. main에는 두 디렉토리 모두 없으므로 로컬 `/gallery`는 3탭 유지: `curl -s http://localhost:3100/gallery | grep -c "자율 루프 후보"` → 0.

- [ ] **Step 3: 커밋**

```bash
git add app/src/app/gallery/page.tsx
git commit -m "feat(gallery): 자율 루프 탭 landing-evolve 이중 스캔

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: 로컬 landing 스모크 (evolve/dash에서, target 강제)

**Files:** 실행 산출물만 (`app/src/app/landing-evolve/r1/{a,b}/`, run 디렉토리, jsonl append) — 결함 발견 시 해당 태스크로 복귀 수정.

**Interfaces:**
- Consumes: Task 1~5 전부.
- Produces: 검증된 이중 타깃 파이프라인 + evolve/dash 첫 landing 라운드.

- [ ] **Step 1: 브랜치 준비** — `git fetch origin && git checkout -B evolve/dash origin/evolve/dash && git rebase main` (origin 기준 — 안전 규칙). rebase 후 main의 Task 1~5 커밋이 포함됐는지 `git log --oneline -3` 확인.
- [ ] **Step 2: 라운드 실행** — `.claude/skills/dash-evolve/SKILL.md`를 플레이북으로 **TARGET=landing 강제**(무작위 생략 — 스모크 명시) + 후보 2개(a,b)로 1라운드 완주. dev 서버 3100 재사용.
- [ ] **Step 3: 체크리스트**
  - `ls app/src/app/landing-evolve/r1/` → `a b`
  - `tail -1 vault/30-ledger/auto-ledger.jsonl` → `"target":"landing"`, `"round":"auto-landing-r1"` 포함
  - 승자 존재 시 `tail -1 vault/00-principles/landing-deltas-provisional.jsonl` → status=provisional
  - `git diff main..evolve/dash -- vault/00-principles/design-principles.md` → **출력 없음 (정본 불변)**
  - `grep -c "auto-landing-r1" vault/index.md` → 1 (index 갱신 의무 이행)
  - `node scripts/wiki-lint.mjs; echo exit=$?` → exit=0
  - `curl -s http://localhost:3100/gallery | grep -o "LANDING R1"` → 존재 (Ⅳ 탭 이중 라벨)
- [ ] **Step 4: main 복귀** — `git checkout main`. 스모크 산출물은 evolve/dash에만.

---

### Task 7: routine 갱신 + 배포 (컨트롤러 전용 — 서브에이전트 디스패치 금지)

**Files:** 없음 (원격 설정 + push)

- [ ] **Step 1: nightly routine 프롬프트 갱신** — RemoteTrigger update(trig_01LpWcnPq9kGhdqVtjTqWwEX): 기존 프롬프트의 "무인 자율 진화 1라운드" 지시를 이중 타깃으로 개정 — SKILL.md §0의 무작위 타깃 결정을 따르고, 타깃 파라미터 테이블 준수, 성공 기준에 "auto-ledger에 target 필드 포함 entry append" 추가. (weekly routine은 SKILL.md 참조 방식이라 프롬프트 변경 불요 — 단 ledger 경로 언급이 있으면 auto-ledger.jsonl로 정정.)
- [ ] **Step 2: main push** — `git push` (Task 1~5 커밋 일괄). Vercel git 자동 배포 확인: 2~3분 후 새 git 소스 배포 존재 여부(없으면 `npx vercel --prod`로 수동 배포 — 지난 이례 재발 여부 기록).
- [ ] **Step 3: evolve/dash push** — Task 6이 이미 rebase+라운드 커밋을 만들었으므로 `git push --force-with-lease origin evolve/dash`(Task 6 종료 시점에 미푸시라면).
- [ ] **Step 4: AUTO-RUN-LOG에 이중 타깃 전환 1줄 기록** 후 커밋·push:

```markdown
- 2026-07-18: 이중 타깃 가동 — 야간 라운드가 dash/landing 무작위 50/50, ledger 통합(auto-ledger.jsonl, target 필드), 위키 lint 게이트 추가
```

```bash
git add vault/30-ledger/AUTO-RUN-LOG.md && git commit -m "docs(vault): 이중 타깃 가동 기록

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" && git push
```

---

## Self-Review 결과

- **Spec coverage**: §3.1→Task 3 §0, §3.2 테이블→Task 3, §3.3 rename→Task 2, §3.4→Task 4, §3.5→Task 5, §3.6→Task 7, §4.1 index→Task 2(+Task 3 §7·Task 4 apply 5 갱신 의무), §4.2 lint→Task 1(기계)+Task 4 open(판단), §4.3 ingest 파급·위생→Task 4 apply 1·Task 2 Step 3, §6 검증→Task 1/2/6, §7 비범위 준수.
- **스키마 일관성**: ledger `target` 필드(Task 3 §7 ↔ Task 6 체크리스트), judge_votes 키가 lens1~3으로 일반화(기존 brief/visual/archetype과 다름 — 의도: 타깃별 렌즈 명이 다르므로; 기존 4 entry와의 혼재는 소비자(falsify 표 조립)가 키 이름 불문 값만 쓰므로 무해).
- **경로 일관성**: auto-ledger.jsonl·landing-deltas-provisional.jsonl·index.md가 Task 2 산출과 Task 3/4/6 참조에서 일치.
