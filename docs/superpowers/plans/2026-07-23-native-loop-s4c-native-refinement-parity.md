# S4c — native 지식 정제 파리티 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** native 라운드가 웹처럼 §5 delta 추출 → §6 레벨링/질문 → 주간 falsify 승격까지 수행하도록, S4b가 스킵한 native §5·§6을 해제하고 dash-falsify에 native 승격 경로를 추가한다.

**Architecture:** SKILL 2개 prose 편집(dash-evolve §5/§6 해제, dash-falsify native open/apply) + `native-deltas-provisional.jsonl` 신설. §5/§6은 이미 `<DELTAS>`/"해당 타깃 DELTAS"로 parametrized라 native 블록에 DELTAS를 지정하고 스킵 노트를 제거하면 자동으로 native를 탄다. 검증은 실행 코드가 없어(SKILL prose) throwaway 브랜치에서 §5 append·falsify apply 편입을 실제 시연한다.

**Tech Stack:** Markdown(SKILL.md 2개), jsonl(native-deltas), `scripts/design-loop.mjs`(appendLedger, 무변경), node:test(회귀).

## Global Constraints

- **native DELTAS** = `vault/00-principles/native-deltas-provisional.jsonl` (신설, 빈 파일, dash/landing deltas와 나란히). delta 포맷 웹 공용: `{round:'auto-native-r<N>', variant, delta, evidence, judge_votes, confidence, level, status, [supersedes]}`.
- **§5/§6 본문 무변경** — 파라미터(`<DELTAS>`·"해당 타깃 DELTAS") 재사용. native 블록 DELTAS 지정 + 스킵 노트 제거만.
- **native delta 승격 타깃**: 규칙성 → `native/GENERATION.md` 해당 절 / 토큰값 → `native/src/tokens.ts` (default GENERATION.md).
- **native 후보 킵/드롭 = 비범위(S3)** — S4c는 delta 지식만. falsify open native 섹션은 정보 제공, apply는 delta·질문만 액션.
- **웹 무영향**: dash/landing §5/§6·falsify 경로 diff 0(파라미터 재사용, native 분기만 추가). `npm test` 44/44. gate.mjs·works.ts·app 무변경.
- **불변식**: jsonl append-only, main 커밋 금지(라운드/apply는 evolve/dash), native 정본(GENERATION.md/tokens.ts)은 falsify apply만 수정. **한국어 커밋 + conventional 접두사, 푸터 없음.**

---

### Task 1: native-deltas 신설 + dash-evolve §5/§6 native 해제

**Files:**
- Create: `vault/00-principles/native-deltas-provisional.jsonl` (빈 파일)
- Modify: `.claude/skills/dash-evolve/SKILL.md` (native 블록 DELTAS 셀·헤더 문구, §5 스킵 노트)

**Interfaces:**
- Produces: native 라운드가 §5에서 `vault/00-principles/native-deltas-provisional.jsonl`에 delta append, §6에서 이 파일을 정제 대상으로 로드. Task 3·falsify가 소비.

- [ ] **Step 1: native-deltas 빈 파일 생성**

```bash
: > vault/00-principles/native-deltas-provisional.jsonl
ls -la vault/00-principles/native-deltas-provisional.jsonl
```
Expected: 0바이트 파일 생성(dash/landing deltas와 동일 위치).

- [ ] **Step 2: native 블록 DELTAS 셀 지정**

`.claude/skills/dash-evolve/SKILL.md`에서 native 파라미터 표의 DELTAS 행 교체.

old:
```
| DELTAS | N/A (S4c) |
```
new:
```
| DELTAS | `vault/00-principles/native-deltas-provisional.jsonl` |
```

- [ ] **Step 3: native 블록 헤더의 스킵 문구 제거**

old:
```
native는 웹 라우트가 아니라 RN 화면이라 아래 규약을 따른다. **§5 LEARN·§6 정제 게이트는 native에서 건너뛴다(S4c 전까지 승자 기록까지만).**
```
new:
```
native는 웹 라우트가 아니라 RN 화면이라 아래 규약을 따른다. §5 LEARN·§6 정제 게이트도 native에서 수행한다(웹과 동형 — DELTAS만 native 파일).
```

- [ ] **Step 4: §5 헤더의 스킵 노트 삭제**

old:
```
## 5. LEARN — 격리 적재
> **native 타깃은 §5·§6을 건너뛴다** (S4c 전까지 delta 미추출·정제 미수행 — 승자 기록까지만). 이하 §5·§6은 dash/landing에만 적용.

승자가 있으면
```
new:
```
## 5. LEARN — 격리 적재
승자가 있으면
```

- [ ] **Step 5: 자기정합 + 회귀 확인**

```bash
grep -n 'N/A (S4c)\|native 타깃은 §5·§6을 건너뛴다\|native에서 건너뛴다' .claude/skills/dash-evolve/SKILL.md
grep -n 'native-deltas-provisional' .claude/skills/dash-evolve/SKILL.md
npm test 2>&1 | grep -E "# (pass|fail)"
```
Expected: 첫 grep 결과 **없음**(스킵 문구 전부 제거됨). 둘째 grep = native 블록 DELTAS 1건. `# pass 44 / # fail 0`.

- [ ] **Step 6: 커밋**

```bash
git add vault/00-principles/native-deltas-provisional.jsonl .claude/skills/dash-evolve/SKILL.md
git commit -m "feat(dash-evolve): native §5·§6 정제 해제 + native-deltas 신설(S4c)"
```

---

### Task 2: dash-falsify native open/apply 승격 경로

**Files:**
- Modify: `.claude/skills/dash-falsify/SKILL.md` (frontmatter description, open §2 섹션, open §2 리뷰 방법, apply §1 delta 승인, apply §4 후보 킵/드롭)

**Interfaces:**
- Consumes: Task 1의 `native-deltas-provisional.jsonl`, native 정본 `native/GENERATION.md`·`native/src/tokens.ts`, auto-ledger의 `auto-native-r*` entry.
- Produces: 주간 falsify가 native delta를 PR에 노출(open)·정본 승격/기각(apply).

- [ ] **Step 1: frontmatter description에 native 반영**

old:
```
description: 자율 진화 주간 반증 (이중 타깃) — evolve/dash 누적분으로 대시보드·랜딩 섹션의 반증 PR 생성(open 모드, 무인) / 사람 리뷰 결과 반영+위키 갱신+squash merge(apply 모드). "/dash-falsify open", "/dash-falsify apply", "반증 PR", "주간 리뷰 반영" 시 사용.
```
new:
```
description: 자율 진화 주간 반증 (다중 타깃) — evolve/dash 누적분으로 대시보드·랜딩·네이티브 섹션의 반증 PR 생성(open 모드, 무인) / 사람 리뷰 결과 반영+위키 갱신+squash merge(apply 모드). "/dash-falsify open", "/dash-falsify apply", "반증 PR", "주간 리뷰 반영" 시 사용.
```

- [ ] **Step 2: open §2에 `## 네이티브` 섹션 추가**

open 모드 §2의 `## 대시보드` / `## 랜딩` bullet(아래 old) 뒤에 native bullet을 추가.

old:
```
   - `## 대시보드` / `## 랜딩` 각각: 주간 라운드 표(auto-ledger에서 해당 target entry(target 필드 없는 레거시 entry는 round id `auto-<t>-r*`에서 유추)), L3 delta 편입 제안(해당 DELTAS의 최신 level=L3 & status=provisional), L1/L2 잔류 요약, 라운드별 DECISION.md 상대경로 링크 + 대표 스크린샷 경로. 해당 타깃 라운드가 없던 주면 섹션에 "이번 주 라운드 없음" 1줄.
```
new:
```
   - `## 대시보드` / `## 랜딩` 각각: 주간 라운드 표(auto-ledger에서 해당 target entry(target 필드 없는 레거시 entry는 round id `auto-<t>-r*`에서 유추)), L3 delta 편입 제안(해당 DELTAS의 최신 level=L3 & status=provisional), L1/L2 잔류 요약, 라운드별 DECISION.md 상대경로 링크 + 대표 스크린샷 경로. 해당 타깃 라운드가 없던 주면 섹션에 "이번 주 라운드 없음" 1줄.
   - `## 네이티브`: 위와 동형 — 라운드 표(`auto-native-r*`), L3 delta 편입 제안(`vault/00-principles/native-deltas-provisional.jsonl`의 최신 level=L3 & status=provisional), L1/L2 잔류, DECISION.md 링크 + 스크린샷 경로(`shots/<v>-390.png` 모바일). **네이티브는 delta·질문만 반증 대상 — 후보 킵/드롭 제안은 생략(S3)**.
```

- [ ] **Step 3: open §2 리뷰 방법에 native 단서**

old:
```
   - `## 리뷰 방법`: "후보 킵/드롭·delta 승인/기각·질문 답변을 PR 코멘트로 남기고 로컬에서 /dash-falsify apply 실행".
```
new:
```
   - `## 리뷰 방법`: "후보 킵/드롭·delta 승인/기각·질문 답변을 PR 코멘트로 남기고 로컬에서 /dash-falsify apply 실행 (네이티브는 delta 승인/기각·질문만 — 후보 킵/드롭 미지원)".
```

- [ ] **Step 4: apply §1 delta 승인에 native 편입 경로 추가**

old:
```
1. **delta 승인 (타깃별 정본 편입 + ingest 파급)** — dash delta는 `dash-brief-v3.md`에, landing delta는 `design-principles.md`에 surgical 편입. **편입할 때 그 내용을 참조·인접하는 관련 노트(curation-criteria, 반대 타깃 brief의 공통 룰 등)의 상호참조([[링크]])도 동반 갱신한다** — "1건 편입 = 관련 페이지들 터치". provisional에는 `{...원본, status:'promoted', supersedes:'<round>'}` append.
```
new:
```
1. **delta 승인 (타깃별 정본 편입 + ingest 파급)** — dash delta는 `dash-brief-v3.md`에, landing delta는 `design-principles.md`에, **native delta는 규칙성이면 `native/GENERATION.md`의 해당 절(§1~§7), 토큰값이면 `native/src/tokens.ts`에** surgical 편입(default GENERATION.md). **편입할 때 그 내용을 참조·인접하는 관련 노트(curation-criteria, 반대 타깃 brief의 공통 룰 등)의 상호참조([[링크]])도 동반 갱신한다** — "1건 편입 = 관련 페이지들 터치". provisional에는 `{...원본, status:'promoted', supersedes:'<round>'}` append.
```

- [ ] **Step 5: apply §4 후보 킵/드롭에 native 미지원 단서**

old:
```
4. **후보 킵/드롭** — dash 킵: `git mv app/src/app/dash-evolve/r<N>/<v> app/src/app/dash/d<다음>` + `/dash` 갤러리 등재(works.ts `DASH_LAB_WORKS`). landing 킵: `git mv app/src/app/landing-evolve/r<N>/<v> app/src/app/(marketing)/v<다음>` + works.ts `LANDING_WORKS` 등재. 두 경우 모두 `works.ts`의 `LAST_UPDATED`를 오늘 날짜 문자열로 갱신. **챔피언(`/`) 교체는 사용자가 명시적으로 지시할 때만.** 드롭: 해당 후보 디렉토리 삭제.
```
new:
```
4. **후보 킵/드롭** — dash 킵: `git mv app/src/app/dash-evolve/r<N>/<v> app/src/app/dash/d<다음>` + `/dash` 갤러리 등재(works.ts `DASH_LAB_WORKS`). landing 킵: `git mv app/src/app/landing-evolve/r<N>/<v> app/src/app/(marketing)/v<다음>` + works.ts `LANDING_WORKS` 등재. 두 경우 모두 `works.ts`의 `LAST_UPDATED`를 오늘 날짜 문자열로 갱신. **챔피언(`/`) 교체는 사용자가 명시적으로 지시할 때만.** 드롭: 해당 후보 디렉토리 삭제. **네이티브 후보 킵/드롭은 미지원(S3) — native 라운드는 delta·질문만 반영하고 후보 디렉토리(`native/src/evolve/`)는 evolve/dash에 유지.**
```

- [ ] **Step 6: 자기정합 + 변경 범위 + 회귀**

```bash
grep -c '## 네이티브\|native delta는 규칙성\|네이티브 후보 킵/드롭은 미지원\|다중 타깃' .claude/skills/dash-falsify/SKILL.md
git diff --stat -- . ':!docs'
npm test 2>&1 | grep -E "# (pass|fail)"
```
Expected: 첫 grep ≥ 4(네이티브 섹션·apply 편입·후보 미지원·다중 타깃 문구 존재). git diff = `dash-falsify/SKILL.md`(+ Task1의 dash-evolve·native-deltas는 이미 커밋). `# pass 44 / # fail 0`.

- [ ] **Step 7: 커밋**

```bash
git add .claude/skills/dash-falsify/SKILL.md
git commit -m "feat(dash-falsify): native 승격 경로 — open ## 네이티브 섹션 + apply native delta 편입(S4c)"
```

---

### Task 3: 검증 dry-run — §5 추출 → §6 레벨링 → falsify open/apply

Task 1·2의 native 정제 경로가 실제로 도는지 throwaway 브랜치에서 시연한다. **산출물(delta entry·GENERATION.md 편입 demo)은 main 병합 대상이 아니다** — 메커니즘 증명만. 컨트롤러 직접 실행 권장(판단 동반).

**Files:** (throwaway) `vault/00-principles/native-deltas-provisional.jsonl` append, `native/GENERATION.md` demo 편입.

**Interfaces:** Consumes Task1·2 SKILL 경로 + S4b 스모크(smoke/native-r1)의 auto-native-r1 승자 a 판정.

- [ ] **Step 1: 검증 브랜치 준비**

```bash
git checkout -b smoke/s4c-native-refine   # feature 브랜치 위
```

- [ ] **Step 2: §5 native delta 추출 → native-deltas append (포맷 검증)**

S4b 스모크 승자 a(NotificationCenter, 렌즈1 DNA 1위)의 판정 사유에서 재사용 가능한 delta 1개 추출.

```bash
node -e "import('./scripts/design-loop.mjs').then(m=>m.appendLedger({round:'auto-native-r1',variant:'a',delta:'미읽음/활성 상태는 단일 액센트 닷 하나로 국한 — 타입 배지 등 부가 정보는 중립 아웃라인 유지(색분리 회피)',evidence:'렌즈1(DNA) 1위: 타입 배지 색분리 유혹 회피, 액센트를 미읽음 닷에만 국한한 최다 절제',judge_votes:{lens1:'a',lens2:'c',lens3:'b'},confidence:'low',level:'L1',status:'provisional'},'vault/00-principles/native-deltas-provisional.jsonl'))"
node -e "const e=JSON.parse(require('fs').readFileSync('vault/00-principles/native-deltas-provisional.jsonl','utf8').trim());console.log('round',e.round,'| level',e.level,'| status',e.status,'| target추론',e.round.startsWith('auto-native')?'native':'?')"
```
Expected: 마지막 줄 = `round auto-native-r1 | level L1 | status provisional | target추론 native`. **§5 native가 웹과 동일 포맷 delta를 native-deltas에 적재함을 실증.**

- [ ] **Step 3: §6 레벨링 dry-run (판단)**

`curation-criteria.md` 체크리스트로 이 delta의 레벨을 판정한다(스크립트 없음 — 판단). 1라운드만 존재하므로 **재현(2라운드+) 미충족 → L1 유지가 정상**. 충돌 쌍 없음(단일 delta). meta-기준으로 정당화 가능(절제 원칙과 정합) → 질문 강제 생성 불요.
Expected(기록): "L1 유지 — 재현 2라운드+ 필요, 충돌·질문 없음"을 확인. (레벨 append 없음 = 정상.)

- [ ] **Step 4: falsify open dry-run (`## 네이티브` 조립 시연)**

Task 2의 open 규칙대로 `## 네이티브` 섹션을 손으로 조립해 본다(실제 PR 생성 X — 조립 가능성 확인). smoke/native-r1의 auto-native-r1 데이터 참조.
```
## 네이티브
| 라운드 | 승자 | hardgate |
|---|---|---|
| auto-native-r1 | a (NotificationCenter) | tsc/export/render/iframe 전원 pass |
- L3 승격 제안: 없음 (현재 L1 1건)
- L1/L2 잔류: L1 1건 — "미읽음은 단일 액센트 닷 국한"
- DECISION: (smoke) 20-generations/2026-07-22-auto-native-r1/DECISION.md | 스크린샷: shots/a-390.png
- (후보 킵/드롭 생략 — S3)
```
Expected(기록): 섹션이 라운드 표 + delta 제안 + DECISION/스크린샷 링크로 빠짐없이 조립됨 = open native 규칙 정합.

- [ ] **Step 5: falsify apply dry-run (native delta 정본 편입 시연)**

이 delta는 규칙성(액센트 국한 원칙) → `native/GENERATION.md` §3 DNA 절에 surgical 편입 시연.
- `native/GENERATION.md`의 `## 3. DNA` 절에 1줄 추가(예: "- 미읽음/활성 등 상태 강조는 단일 액센트 요소 하나로 국한 — 부가 배지는 중립 아웃라인(색분리 회피)."). Edit로 적용.
- provisional에 promoted append:
```bash
node -e "import('./scripts/design-loop.mjs').then(m=>m.appendLedger({round:'auto-native-r1',variant:'a',delta:'미읽음/활성 상태는 단일 액센트 닷 하나로 국한',status:'promoted',supersedes:'auto-native-r1'},'vault/00-principles/native-deltas-provisional.jsonl'))"
grep -c '상태 강조는 단일 액센트' native/GENERATION.md
tail -1 vault/00-principles/native-deltas-provisional.jsonl | node -e "process.stdin.on('data',d=>console.log('promoted?',JSON.parse(d).status==='promoted'))"
```
Expected: GENERATION.md에 규칙 1줄 편입(grep=1), provisional 마지막 줄 `promoted? true`. **apply native delta 승격이 native 정본(GENERATION.md)에 반영됨을 실증.**

- [ ] **Step 6: dry-run 정리 (throwaway 폐기)**

```bash
git checkout .   # demo 편집(GENERATION.md·native-deltas) 폐기 — feature 브랜치의 빈 native-deltas 유지
git checkout feat/s4c-native-refinement
git branch -D smoke/s4c-native-refine
```
Expected: feature 브랜치는 Task1·2 편집 + **빈** native-deltas만. demo 산출물 미병합.

---

## Self-Review

- **Spec coverage**: native-deltas 신설(spec §3)→T1S1 · dash-evolve §5/§6 해제(spec §4)→T1S2~S4 · falsify open native(spec §5.1)→T2S2 · falsify apply native 승인/기각(spec §5.2)→T2S4 · 후보 킵/드롭 S3 이월(spec §5.2·§7)→T2S3/S5 · §5 native 추출 검증(spec §6.1)→T3S2 · §6 레벨링(spec §6.2)→T3S3 · open dry-run(spec §6.3)→T3S4 · apply dry-run(spec §6.4)→T3S5 · 웹 무영향·회귀(spec §6.5)→T1S5/T2S6 · 비회귀 3파일(spec §6.6)→T2S6. 전 요구 매핑됨.
- **Placeholder scan**: old/new 전문·명령·기대출력 구체. `<N>`·`<v>`·`<round>`·`<다음>`은 SKILL 런타임 치환자(기존 관례). TBD/TODO 없음.
- **Type consistency**: delta 포맷(`round/variant/delta/evidence/judge_votes/confidence/level/status/supersedes`)이 §5 appendLedger·T3 append·falsify 편입 전반 일관. native DELTAS 경로 `vault/00-principles/native-deltas-provisional.jsonl`가 T1·T2·T3 동일 표기. 승격 타깃(GENERATION.md 규칙/tokens.ts 값)이 spec §2·T2S4·T3S5 일치.
- **실행 모드 주의**: T3는 컨트롤러 판단(§6 레벨링·open 조립·apply 편입) 동반 — Inline 실행 권장.
