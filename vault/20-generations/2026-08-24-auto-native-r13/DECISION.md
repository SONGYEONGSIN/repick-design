# auto-native-r13 — DECISION

target: native · round: auto-native-r13 · date: 2026-08-24
후보 source hash(동결): `55565851c39f2eaabb58ce36cd59409c93b3567e`

## 후보

- **a — Payout & Withdraw** (`native/src/evolve/r13/a/PayoutScreen.tsx`): 잔액 헤더 + 프리셋/커스텀 금액 입력 + 계좌 표시 + 조건부 하단 밴드(진짜 블로킹일 때만 상태기계, 아니면 상시 액션바 → 확인 시 밴드 자체가 Cancel/Confirm으로 전환 → Processing → 잔액 차감 성공).
- **b — Seller Onboarding Setup** (`native/src/evolve/r13/b/SellerOnboardingSetupScreen.tsx`): 5단계(프로필→카테고리→배송→정산계좌→검토) 진행률 헤더 + 접이식 스텝 FlatList + 하단 상태기계 밴드(왜 막혔는지 + 스크롤/포커스 이동).
- **c — Support Center** (`native/src/evolve/r13/c/SupportCenterScreen.tsx`): 검색 + 카테고리별 FAQ 아코디언(SectionList) + 하단 상시 액션바(상태기계 아님, "막힌 지점 없음"을 코드 주석으로 명시).

## 하드게이트

3후보 전원 12/12 (`tsc`/`export`/`render`/`iframe`) 1차 통과, 1-fix 불요. 상세는 SCORES.md. 환경 고유 절차(스킬 밖): `PW_CHROMIUM_PATH`/`CHROME_PATH`/`PW_NO_SANDBOX`가 Bash 호출 간 유지되지 않아 첫 실행은 render 3건 전원 실패 — 같은 커맨드에 인라인으로 재수출해 재실행하니 12/12 통과(코드 결함 아님).

## JUDGE 패널 — 3렌즈 완전 동률(3파전)

| 렌즈 | 1위 | 2위 | 3위 |
|---|---|---|---|
| 렌즈1 (DNA/a11y 준수) | **b** | a | c |
| 렌즈2 (모바일 완성도) | **a** | b | c |
| 렌즈3 (화면유형 차별성) | **c** | a | b |

세 렌즈가 각각 다른 후보를 1위로 놓아 **완전 동률**이다(1위 표 b/a/c 각 1표, 다수결 불성립).

### tie-break 적용 — [[curation-criteria]] "주간 반증 판정 기준" ② 그대로 적용
> "3파전 동률 tie-break 예외 — 완전 동률 시 brief 렌즈 우선을 유지하되, archetype 렌즈가 그 후보를 최하위로 명시 판정했으면 동률 우승서 제외하고 나머지 중 brief 1위 재적용."

- brief 렌즈(= 렌즈1, DNA/프로파일 준수)의 1위는 **b**.
- archetype 렌즈(= 렌즈3, 화면유형 차별성)가 **b를 3위(최하위)로 명시 판정**했다(표 참조, 근거: "verification/listing 골격에 가장 근접").
- → 조건 성립. b를 동률 우승 후보에서 제외하고, 나머지(a, c) 중 렌즈1 순위를 재적용한다.
- 렌즈1의 a/c 순위: a(2위) > c(3위, §1 SafeAreaView 위반 + 라이브리전 커버리지 불완전으로 감점).
- → **승자 = a (Payout & Withdraw)**.

## 승자 사유 요약

- 렌즈2(1위, 결정적): 파괴적 행동(출금) 전 확인 다이얼로그를 세 후보 중 유일하게 갖췄고, 이를 별도 네이티브 Alert가 아니라 **이미 검증된 하단 상태기계 밴드 자체를 Cancel/Confirm 두 버튼 행으로 전환**하는 방식으로 구현해 접근성 계약(`accessibilityLiveRegion="polite"`+`accessibilityRole="alert"`)을 재사용했다. 모든 Pressable에 눌림 피드백 100% 적용, 수수료·도착예정시간 등 화면유형 특화 디테일 정확.
- 렌즈1(2위, 근소): 규칙 위반 0건 — RN 관용구·토큰·a11y·결정론 전부 준수. b에 밀린 이유는 위반이 아니라 "밴드의 상태기계가 단일 폼이라 상대적으로 얕다"는 깊이 차이.
- 렌즈3(2위): 카탈로그 어디와도 겹치지 않는 프리셋+커스텀 통화 입력 조합이지만, 밴드가 상태기계에서 "인라인 확인 다이얼로그"로 기능이 바뀌는 지점이 verification/disputes의 jump-to-blocker 원리와는 다른 원리라 c만큼 신선하지는 않다고 판정.

## 탈락 후보 사유

- **b (3위)**: 렌즈1 1위(멀티스텝 위저드 L3 패턴 교과서적 구현: blocked/ready/loading/done 4-tone + scrollToStep+triggerHighlight+focusMissingField)였으나, 렌즈2가 **화면 전체 Pressable 0건 눌림 피드백**을 결정적 감점 사유로 지목("실제 앱이라면 리젝 사유급")했고, 렌즈3은 verification/listing 골격과 가장 근접하다고 판정. 게이트 위반은 없다 — 완성도·차별성 축의 감점.
- **c (3위 — lens1 exclude 이전 기준으로는 최종 3위)**: 렌즈3 1위(신규 골격 + r12/c "완료 화면=상시 액션바" 원리를 read-only 브라우즈 화면이라는 새 맥락에 정확히 확장)였으나, 렌즈1이 **실제 규칙 위반**을 잡았다 — 최상위 래퍼가 `SafeAreaView`가 아니라 `View`(GENERATION.md §1 명시 위반, `SupportCenterScreen.tsx:15-22,87`)이고, "connecting" 중간 전환이 라이브 리전 밖이라 스크린리더 관점에서 무음 DOM 교체(§4 요구 미충족 사례). 렌즈2도 1차 인터랙션(FAQ 아코디언 토글)에 눌림 피드백이 없다고 지적.

## 정제 조치 — 없음

승자 a는 3렌즈 전원이 규칙 위반을 지적하지 않았다. 판정 후 수정 없이 그대로 승격 후보로 유지.

## 미확인 범위 (판정 커버리지)

- 렌즈1: gate.mjs 직접 미실행(오케스트레이터가 별도 수행), 스크린샷은 idle 상태 1장씩만(390/768) — confirm/processing/done(a), 스텝 전이(b), connecting/connected(c) 등은 코드 판독으로만 확인.
- 렌즈2: 위와 동일 — 상태 전이 스크린샷 미제공, 실기기 미검증.
- 렌즈3: listing/ListingCreateScreen.tsx 원본 미열람(2차 인용으로만 b와의 유사도 추정), r12/a·r12/b 소스는 지시대로 의도적으로 미열람, tokens.ts 미열람(스킨 레이어로 판단해 제외).

## 재개·기권

3렌즈 전원 1회 완주, 재개·기권 없음.
