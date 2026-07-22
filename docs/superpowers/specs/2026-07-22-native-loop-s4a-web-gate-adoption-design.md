# 멀티플랫폼 진화 루프 — S4a: dash-evolve 웹 게이트를 gate.mjs로 채택

- 날짜: 2026-07-22
- 상태: 사용자 승인 완료 (구현 계획 수립 전)
- 상위 프로그램: 자율 진화 루프 멀티플랫폼 재설계. 선행 = S0(Expo PoC ✅)·S1(designer 네이티브 생성 ✅)·S2(게이트 디스패처 ✅ 병합). 이 문서는 **S4a**만 다룬다.

## 0. 상위 프로그램 맥락

| # | 하위 프로젝트 | 상태 |
|---|---|---|
| S0 | Expo 단일 타깃 PoC | ✅ |
| S1 | designer 네이티브 온디맨드 생성 | ✅ |
| S2 | 검증 게이트 디스패처 (`gate.mjs`) | ✅ 병합 (squash 98658c2) |
| **S4a** | **dash-evolve 웹 게이트를 gate.mjs로 채택 (동작 보존)** | ← 이 문서 |
| S4b | native 타깃 라운드 (선택·생성·판정·ledger 파리티) | 후속 |
| S3 | 미리보기·갤러리 통합 | 후속 |
| S5 | 카탈로그 192색·98UX 전수 수용 | 후속 |

> S4를 S4a(web 게이트 채택, 작고 안전)와 S4b(native 라운드, 큼)로 분할. 이 문서는 S4a — S2 gate.mjs를 **기존 웹 야간 루프에 연결**하는 seam 확립.

## 1. 목표

dash-evolve SKILL §3 HARD GATE의 prose 게이트 호출(dash-static-check·dash-sweep·Lighthouse 개별 실행)을 **통일 디스패처 `node scripts/gate.mjs --target web` 호출**로 교체한다. **dash/landing 라운드 동작 보존** — 게이트 판정 기준(a11y≥95·오버플로 0·정적 위반 0)·ledger 스키마·갤러리·타입 유니온 전부 불변. 얻는 것: 단일 게이트 진실 소스, SKILL prose 드리프트 제거, S4b가 확장할 SKILL↔gate seam 확립.

## 2. 확정된 결정

| 결정 | 선택 |
|---|---|
| 게이트 호출 단위 | **후보별 1회씩 (3×)** — 각 후보 v에 `gate.mjs --target web --routes /<TARGET>-evolve/r<N>/<v>` |
| gate.mjs 수정 | **없음** — S2 그대로 채택 (후보별 단일 라우트라 `runWeb`의 Lighthouse `routes[0]` 한계가 무의미) |
| ledger hardgate | **3키 free-text 형태 유지** — 텍스트만 gate verdict에서 소싱 (consumer 무변경) |
| S4a 범위 | SKILL.md 재배선만 — native·타입·스키마·갤러리 = S4b |

## 3. §3 HARD GATE 재배선

현행 §3은 세 도구를 개별 실행(static 후보별·sweep 3라우트 배치·Lighthouse 라우트별)하고 실패 후보에 1회 수정을 먹인다. 재배선 후:

- **후보별 호출**: 각 후보 v ∈ {a,b,c}에 대해
  `node scripts/gate.mjs --target web --routes /<TARGET>-evolve/r<N>/<v>`
  → verdict `{target:'web', pass, gates:[{name:'static'…},{name:'sweep'…},{name:'a11y'…},{name:'perf'…}], violations}`.
- **판정**: `pass:true` → 통과. `pass:false` → `verdict.violations`(위반 상세)를 해당 designer v에 전달해 **1회 수정**(현행 1-fix 규칙 계승) 후 재호출. 재실패 → 탈락.
- **demux 불필요**: 후보별 단일 라우트라 violations가 전부 그 후보 소속. filesForRoute가 `app/src/app/<route>/**/*.tsx`를 정적 검사, 해당 라우트만 sweep·Lighthouse.
- **게이트 기준은 gate.mjs가 강제**: `normalizeA11y`가 a11y<95 하드페일, Lighthouse 불가 시 `unavailable`(하드페일 아님), `normalizePerf`는 항상 pass(기록만) — SKILL이 별도 임계 규칙을 안 걸어도 gate.mjs가 보장. **회귀 없음**: 현행도 Lighthouse를 라우트별로 돌린다.
- **dev 서버 3100 전제 유지** — gate.mjs 웹 브랜치가 3100을 sweep/Lighthouse 대상으로 씀(현행과 동일). 없으면 §3 기동 규칙 유지.
- **기록**: `verdict.gates`를 `vault/20-generations/<run>/SCORES.md`에 표로 기록.

## 4. §7 ledger — 스키마 불변, 소스만 교체

`auto-ledger.jsonl` entry의 `hardgate:{static, sweep, lighthouse}` **3키 free-text 형태를 유지**한다(evolve-status.ts·works.ts·갤러리 consumer 무변경). 단 텍스트를 gate.mjs verdict에서 소싱:
- `hardgate.static` ← 후보별 static gate detail 요약
- `hardgate.sweep` ← 후보별 sweep gate detail 요약
- `hardgate.lighthouse` ← 후보별 a11y gate detail(+ perf gate detail 기록) 요약

target·round·winner·no_winner·judges·refuted 필드 전부 불변.

## 5. 변경 파일

| 파일 | 변경 |
|---|---|
| `.claude/skills/dash-evolve/SKILL.md` | §3 재작성(후보별 gate.mjs 호출 + 1-fix 루프), §7 hardgate 소싱 문구, frontmatter description의 "하드게이트(정적·sweep·a11y)" → "하드게이트(gate.mjs --target web)" |
| `scripts/gate.mjs` | **무변경** |
| `app/src/lib/evolve-status.ts`·`works.ts`, 갤러리 | **무변경** (스키마·타입 유니온 불변) |

## 6. 검증

SKILL은 런타임 에이전트가 실행하는 prose라 unit 코드가 없다. 검증은 재현 + 정합:

1. **게이트 재현 증명**: evolve/dash의 기존 통과 후보 라우트 하나(예: 최근 승자 `/<TARGET>-evolve/r<N>/<v>`)에 3100 서버 띄우고 `node scripts/gate.mjs --target web --routes <그 라우트>` 실행 → `pass:true`, gates(static·sweep·a11y·perf). 과거 prose 게이트가 내린 판정(통과)과 일치 = 채택이 동작 보존임을 실증.
2. **SKILL 자기정합**: 재작성된 §3이 앞뒤 단계와 어긋나지 않는지 리뷰 — §2 산출 경로(`ROUTES{a,b,c}/page.tsx`)와 §3 라우트(`/<TARGET>-evolve/r<N>/<v>`) 일치, §3 SCORES.md 기록 → §4 judge 입력 연결, §7 hardgate 소스가 §3 verdict과 정합.
3. **비회귀**: `git diff` 대상이 `SKILL.md` 단일 — `scripts/gate.mjs`·`app/`·`vault/` 정본·타입 diff 0. `npm test` 44/44 불변(게이트 코드 무변경). 프로덕션 200.
4. **전체 야간 라운드 스모크는 불필요** — 동작 보존 변경이므로 게이트 재현 + prose 정합으로 충분(생성·judge 파이프라인 무변경).

## 7. 비범위

- native 타깃 선택·generate/gate/judge/ledger 파리티 → **S4b**.
- ledger `hardgate` 구조를 gate verdict JSON으로 교체(3키 free-text 폐기) → 보류(consumer 변경 유발, 필요 시 후속).
- gate.mjs의 empty-routes 가드·per-route Lighthouse 확장 → 보류(후보별 단일 라우트 호출이라 불필요).
- 갤러리 native 미리보기 → **S3**.
