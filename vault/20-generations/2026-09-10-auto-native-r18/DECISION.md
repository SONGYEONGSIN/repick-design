# auto-native-r18 — DECISION

무인 실행 (스케줄 트리거, N=2 라운드 중 1/2). §0-0 서브에이전트 가용성 확인: `Agent` 도구 사용 가능 확인 후 진행. designer 3개·judge 3개 전부 독립 `Agent` 서브에이전트 호출(서로 다른 인스턴스, 서로의 산출물 비공개) — `self_judged` 아님.

## 타깃 선정

`node -e "... PAGE_TYPES 미채움 조회"` 결과 — 카탈로그 18종 PAGE_TYPES 전부 최소 1건 이상 채워져 있어(`unfilled=[]`) dash/landing/native 균등 난수로 진행, `TARGET=native`. 오늘(2026-09-10, UTC 목요일)은 월요일이 아니므로 native 주기 고정 강제 규칙은 이번엔 무관(우연히도 난수 결과가 native와 일치).

라운드 번호: `auto-ledger.jsonl`에서 native 최대 라운드(r17) + 1 = **r18**.

## 후보

| 후보 | 컨셉 | 파일 |
|---|---|---|
| a | My Impact — buyer-facing read-only CO2/money-saved impact + milestone timeline | `native/src/evolve/r18/a/MyImpactScreen.tsx` |
| b | Saved Searches & Price Alerts — chrome-less settings, per-row immediate apply, inline undo | `native/src/evolve/r18/b/SavedSearchesScreen.tsx` |
| c | Condition Assessment — seller pre-listing grading tool, live computed grade, blocked-workflow band | `native/src/evolve/r18/c/ConditionAssessmentScreen.tsx` |

재배정 큐(`reassign-queue.md` "대기 중"): native 항목 없음(현재 없음) — 3후보 전부 자유 탐색.

## 하드게이트

소스 해시(게이트 직전 동결): `b2d8981c8bcdb0f073fce82adfd3feedab978e45`
`node scripts/gate.mjs --target native --screens evolve-r18-a evolve-r18-b evolve-r18-c` — **12/12 1차 통과, 1-fix 미소모**(`SCORES.md` 참조).

환경 메모(스킬 밖 절차, 이 세션 고유): 이 세션은 Bash 호출 간 셸 env가 유지되지 않아 `PW_CHROMIUM_PATH`를 `~/.bashrc` 최상단(interactive-shell guard 이전)에 박아 영속시켰다(사전 설치된 chromium-1194가 root playwright-core 요구 리비전 1228과 달라 `npx playwright install`은 네트워크 차단으로 실패 — README가 안내한 사전 설치본 사용). `playwright screenshot` CLI는 이 env var를 안 읽어 스크린샷은 `scripts/shot-native.mjs`(라이브러리 직접 호출) 신설로 우회.

## 판정 (JUDGE 패널 — 3렌즈, 각 독립 blind 서브에이전트)

렌즈는 native 타깃 파라미터 표를 따름: 렌즈1=DNA/a11y 준수 · 렌즈2=모바일 앱 완성도 · 렌즈3=화면유형 차별성. 각 judge에게 소스 코드(6파일) + 스크린샷 6장(390/768 × 3후보)만 제공, `candidates/*.md`(컨셉·브리프구멍 보고)·이 파일은 비공개 유지(블라인드).

### 렌즈1 — DNA/a11y 준수: **c > b > a**
c(1위)가 진짜 블록 워크플로 양쪽 절반(실제 문장 + 작동하는 jump 메커닉)을 정확히 구현하고 라이브 리전 정확히 1개. b(2위)는 비-종결액션 설정형이라 밴드 자체가 없는 것이 GENERATION.md §3이 허용하는 유효 선택이고, 라이브 리전 정확히 1개(Removed·Undo 행)로 정확히 스코프. **a(3위)는 실결함**: 같은 화면에 라이브 리전이 **2개**(methodology 아코디언 + 하단 밴드) — GENERATION.md §4 "라이브 리전을 두 개 이상 두지 마라"를 명시 위반. 게다가 methodology 토글은 "진행 가능 여부가 바뀌는 지점"이 아닌 평범한 아코디언이라 애초에 `alert`+`polite`가 불필요.
근거: `MyImpactScreen.tsx:148-150`(methodology 라이브 리전) + `:210-213`(밴드 라이브 리전) 두 곳 독립 컨테이너 확인. b `SavedSearchesScreen.tsx:307-309` 단일. c `ConditionAssessmentScreen.tsx:244` 단일 + `:253/:266/:275` 상호배타 alert.

### 렌즈2 — 모바일 완성도: **c > b > a**
c(1위) — 등급 산출이 실제 가중평균+결함캡 계산(`data.ts:121-143`)이고 `scrollToIndex`+`onScrollToIndexFailed` 폴백까지 구현해 "실제 계산" 요구를 가장 깊이 충족. b(2위) — 상호작용 표면이 가장 넓고(토글·칩·스테퍼·세그먼트·삭제) 전부 실제 state 변경으로 추적되며 Empty state까지 정직하게 도달 가능. a(3위) — 두 인터랙션(methodology 토글, Share) 모두 실제로 동작하나 세 후보 중 "주 액션"의 기계적 해상도가 가장 얕음(Share는 카피만 바뀜, 정직하지만 가장 옅은 결말).

### 렌즈3 — 화면유형 차별성: **b > c > a**
b(1위) — "사용자 소유 쿼리 객체 컬렉션을 개별 관리"라는 조작 문법이 카탈로그에 없던 신규 조합. 재사용은 토글 컴포넌트 하나(`Preferences.tsx`와 동일 track/thumb 지오메트리)에 국한. c(2위) — 컨셉(라이브 유저 입력 기반 계산값)은 `PriceSuggestionScreen`(정적 comps 기반)과 명확히 구별되는 정당한 신규 축이나, 밴드의 **구체적 구현**(`bandBlocked*`/`bandReady*`/`bandDone*` 스타일 키 명명, "Tap to go there" 문구, `onScrollToIndexFailed` 폴백)이 `SellerVerificationScreen`/`DisputeCenterScreen`과 키 단위로 거의 일치 — 원리 재사용은 정당하나 구체적 형태 재사용은 약함. **a(3위, 실질적 재탕 판정)** — 하단 액션바의 상태명(`shared`/`setShared`/`handleShare`)과 스타일 블록이 바로 직전 라운드 `evolve/r17/a`(SellerScorecardScreen)와 사실상 동일하고, 마일스톤 마커도 `AuthenticationCertificateScreen`의 체크포인트 마커를 거의 그대로 재스킨 — 컨셉 층위(구매자 미러링)는 정당했으나 그 컨셉을 구현한 두 핵심 장치(액션·시각 메타포)가 재사용에 그쳤다는 것이 렌즈3의 핵심 근거.

## 집계

1위표: **c 2표(렌즈1·렌즈2)**, **b 1표(렌즈3)**. 완전 동률(1-1-1)이 아니므로 curation-criteria tie-break 예외 미적용 — 단순 2:1 다수결로 **승자 c 확정**.

렌즈3이 지목한 a의 재사용 문제(§LEARN 참조)는 순위와 별개로 다음 라운드 GENERATE 지시에 반영할 가치가 있는 관측이다.

## 3-1. 판정 후 수정

승자 c에 규칙 위반 없음(렌즈1 확인 — 라이브 리전 1개, RN 관용구·토큰·영문카피·결정론 전부 통과). **수정 없이 그대로 승격 후보로 유지.**

## 정제 조치

없음.

## 기록

- `variety`: native는 DNA 고정(라이트/인디고/시스템) — `theme: light (RN 고정 DNA)`, `accent: indigo #4f46e5 (RN 고정 DNA)`, `face: system (RN 고정 DNA)` (이전 라운드들과 동일 값, 승격 대상 아님).
- LEARN 절 delta는 §5에서 append.
