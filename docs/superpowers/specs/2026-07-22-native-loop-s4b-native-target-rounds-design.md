# 멀티플랫폼 진화 루프 — S4b: native 타깃 라운드

- 날짜: 2026-07-22
- 상태: 사용자 승인 완료 (구현 계획 수립 전)
- 상위 프로그램: 자율 진화 루프 멀티플랫폼 재설계. 선행 = S0(Expo PoC ✅)·S1(designer 네이티브 생성 ✅)·S2(게이트 디스패처 ✅ 병합)·S4a(웹 게이트 gate.mjs 채택 ✅ 병합). 이 문서는 **S4b**만 다룬다.

## 0. 상위 프로그램 맥락

| # | 하위 프로젝트 | 상태 |
|---|---|---|
| S0 | Expo 단일 타깃 PoC | ✅ |
| S1 | designer 네이티브 온디맨드 생성 | ✅ |
| S2 | 검증 게이트 디스패처 (`gate.mjs`) | ✅ 병합 |
| S4a | dash-evolve 웹 게이트 gate.mjs 채택 | ✅ 병합 |
| **S4b** | **native 타깃 라운드 (선택·생성·게이트·판정·ledger 승자 기록)** | ← 이 문서 |
| S4c | native 지식 정제 파리티 (delta 추출·§6 정제) | 후속 |
| S3 | 미리보기·갤러리 통합 | 후속 |
| S5 | 카탈로그 192색·98UX 전수 수용 | 후속 |

> S4b는 라운드 **실행**만(생성→게이트→판정→승자 기록). native 지식 **정제**(delta/refinement)는 S4c로 분할.

## 1. 목표

dash-evolve 자율 루프가 native를 3번째 균등 타깃으로 추가한다. native 라운드는 RN 후보 3개를 생성해 `gate.mjs --target native`로 검증하고, 모바일 렌즈 judge로 승자를 뽑아 ledger에 기록한다. **payoff: S2 게이트 디스패처 + S1 designer 생성이 실제 야간 루프에 편입돼 "native 라운드가 무인 실행된다"를 실증.** native의 §5 LEARN(delta 추출)·§6 정제 게이트는 이 문서 범위 밖(S4c).

## 2. 확정된 결정

| 결정 | 선택 |
|---|---|
| 후보 등록 | evolve/dash 브랜치의 `native/src/evolve/r<N>/{a,b,c}/` + `screens.{ts,json}`에 slug `evolve-r<N>-{a,b,c}` 직접 등재 (main은 watchlist/match만 — 깨끗) |
| gate.mjs 수정 | **없음** — S2 native 브랜치 그대로 채택 |
| 타깃 선택 | `RANDOM%3` — dash/landing/native 균등 |
| 후보 수 | 3 (웹 파리티) |
| §5·§6 native | **스킵 (S4c)** — 승자 기록까지만 |
| SKILL 구조 | 단일 dash-evolve SKILL에 native 열 추가 (분리 안 함) |

## 3. §0 선택 + 라운드 번호

- 타깃 선택: `TARGET=$(case $((RANDOM%3)) in 0) echo dash;; 1) echo landing;; 2) echo native;; esac)`. 결과는 ledger로 재현성 담보(현행 규칙 계승).
- 라운드 번호 N: 현행 공식 일반화 — ledger에서 `auto-native-r<번호>` 최대 + 1. native 시퀀스는 독립(dash/landing과 별도).
- run id = `auto-native-r<N>`. run 디렉토리(메타/candidates/shots/DECISION) = `newRun('auto-native-r<N>', 'vault/20-generations', '<오늘>')`(design-loop.mjs, target-제네릭). **RN 코드는 별도 위치** `native/src/evolve/r<N>/`.

## 4. 타깃 파라미터 표 — native 열

기존 표(dash|landing)에 native 열 추가. 각 셀:

| 변수 | native |
|---|---|
| BRIEF | `native/GENERATION.md`(7절) + `native/src/tokens.ts`(DNA 토큰) — 읽기 전용 정본 |
| DELTAS | **N/A (S4c)** — native 라운드는 delta 미사용 |
| ROUTES | `native/src/evolve/r<N>/{a,b,c}/` (RN 화면 코드) |
| 등록 | `native/src/evolve/r<N>/{a,b,c}/`를 `native/screens.ts`(import + COMPONENTS[`evolve-r<N>-<v>`])·`native/screens.json`(`"evolve-r<N>-<v>":{"check":"<검사문자열>"}`)에 등재 |
| 게이트 slug | `evolve-r<N>-a evolve-r<N>-b evolve-r<N>-c` |
| 중복 금지 | 기존 native 화면(match/watchlist) + native-evolve 누적 화면유형 |
| judge 렌즈 | 1=DNA 준수(GENERATION.md·tokens) / 2=모바일 앱 완성도(iOS·Android 관용구·네이티브급) / 3=화면유형 차별성 |
| assets·인터랙션 | RN 관용구(Pressable·FlatList·SafeAreaView) + 모바일 인터랙션(제스처·상태 전환). 이모지 금지·결정론 유지 |

## 5. §2 GENERATE (native)

- designer(또는 frontend-design-specialist) 3개 병렬. 각자 입력: `native/GENERATION.md` + `native/src/tokens.ts` + 서로 다른 화면유형 지정(중복 금지 목록 포함) + 산출 경로 `native/src/evolve/r<N>/<v>/`.
- 산출: `native/src/evolve/r<N>/<v>/`에 RN 화면(+데이터). GENERATION.md 규칙 준수(RN 관용구·토큰 import·결정론·a11y).
- **등록**: 각 후보를 `native/screens.ts`(import 문 + `COMPONENTS["evolve-r<N>-<v>"] = <컴포넌트>`)와 `native/screens.json`(`"evolve-r<N>-<v>": {"check": "<화면 대표 텍스트>"}`)에 등재. (evolve/dash 브랜치에만 — main 무변경.)
- 각 후보 한 줄 컨셉을 `vault/20-generations/<run>/candidates/<v>.md`에 기록.

## 6. §3 HARD GATE (native)

- 웹과 달리 3100 dev 서버 불요 — gate.mjs native 브랜치가 Expo Web(8091)을 자체 export·serve.
- **후보 게이트**: `node scripts/gate.mjs --target native --screens evolve-r<N>-a evolve-r<N>-b evolve-r<N>-c` → 공통 verdict `{target:'native', pass, gates:[{name:'evolve-r<N>-a/tsc'…}… 후보×4], violations}`.
- **1-fix 루프**: `pass:false`면 `verdict.violations`(gate명 = `<slug>/<tsc|export|render|iframe>` + screen/step 태그)를 해당 후보 designer에 전달해 **1회 수정** 후 재호출. 재통과 → 생존, 재실패 → 탈락.
- **게이트 기준**(디스패처 강제): tsc·export·render·iframe 각 단계 통과 필수(`GATE_STEP:*:ok` 마커). 화면별 4단계 전부 pass여야 그 후보 생존.
- 각 후보 `verdict.gates`를 `vault/20-generations/<run>/SCORES.md`에 표로 기록.

## 7. §4 JUDGE (native)

- **스크린샷**: 후보별 Expo Web 모바일 렌더 — `EXPO_PUBLIC_SCREEN=<slug> npx expo export --platform web --output-dir dist --clear`(native/) → `serve dist -l 8091` → `npx playwright screenshot --viewport-size=<w>,844 http://localhost:8091/ vault/20-generations/<run>/shots/<v>-<w>.png` (w ∈ 390, 768 모바일·태블릿폭). 웹 judge의 데스크톱 폭 대신 모바일 폭.
- judge 3개 병렬(comparator 계열). 공통 입력: 스크린샷 + `native/src/evolve/r<N>/<v>/` 소스(컨셉·순서 비공개 — 블라인드). 렌즈 = §4 파라미터 표(1=DNA 준수, 2=모바일 완성도, 3=화면유형 차별).
- 집계·기권·no-winner 규칙은 웹과 동일(1위 다수결, no-winner 표 2+ → 라운드 no-winner, judge 무응답 시 1회 재디스패치→기권). 판정 전문을 `vault/20-generations/<run>/DECISION.md`에 기록.

## 8. §5·§6 native SKIP + §7 기록

- **§5 LEARN·§6 정제 게이트**: native는 **건너뛴다**(S4c). SKILL에 "native 타깃은 S4c 전까지 §5·§6 미수행 — 승자 기록까지만" 명시. (dash/landing은 현행대로 수행.)
- **§7 ledger append**: `{target:'native', round:'auto-native-r<N>', date:'<YYYY-MM-DD>', winner:'<v>'|null, no_winner:<bool>, hardgate:{tsc:'...', export:'...', render:'...', iframe:'...'}, judges:{lens1:'<v>',lens2:'<v>',lens3:'<v>'}, refuted:null}` → `vault/30-ledger/auto-ledger.jsonl`. hardgate 4키는 §3 verdict.gates(후보별 4단계)에서 소싱.
- index.md 세대 기록 등재·커밋(`git push origin evolve/dash`)은 현행과 동일.
- **불변식 유지**: native 정본(GENERATION.md·tokens.ts) 미수정, jsonl append-only, main 커밋 금지.

## 9. 타입 정합 — works.ts

- `app/src/lib/works.ts`의 `target?: "dash" | "landing"` → `target?: "dash" | "landing" | "native"` (타입 정합; evolve-status.ts는 target 미참조라 무변경). native ledger entry가 웹 갤러리 스캔에 유입돼도 무해(evolveWorks는 웹 라우트 디렉토리만 스캔).

## 10. 검증

1. **native 스모크 라운드 1회**(evolve/dash 브랜치, TARGET 강제 native): §2 후보 3개 생성·등재 → §3 `gate.mjs --target native --screens evolve-r1-a b c` 후보×4게이트 통과(1-fix 실동작 확인) → §4 모바일 스크린샷·judge 승자 → §7 `auto-native-r1` ledger 기록. **end-to-end 무인 실행 실증**.
2. **등록 정합**: 생성 후보가 screens.ts COMPONENTS·screens.json 양쪽에 등재돼 `EXPO_PUBLIC_SCREEN=<slug>`로 렌더 전환됨(gate render 단계 통과 = 등재 정합 증거).
3. **gate.mjs 무변경**: `scripts/gate.mjs` diff 0.
4. **works.ts union 확장 회귀**: `cd app && npx next build` 통과, `npm test` 44/44 불변, `/gallery` 200(native entry 유입돼도 무해).
5. **main 무영향**: main 브랜치엔 SKILL.md·works.ts 변경만(native 후보 코드는 evolve/dash에만). `curl https://repick-design.vercel.app/` 200.

## 11. 비범위

- native delta 추출(§5)·정제 게이트(§6)·native-deltas-provisional.jsonl 신설 → **S4c**.
- 갤러리 native 후보 미리보기(iframe) → **S3**.
- native 승자 승격(정본 편입·permanent 화면화) → 주간 falsify(별도).
- gate.mjs 수정(--registry 등) → 불요(screens.{ts,json} 직접 등재).
- SKILL 분리(native 전용 SKILL) → 과설계, 단일 유지.
