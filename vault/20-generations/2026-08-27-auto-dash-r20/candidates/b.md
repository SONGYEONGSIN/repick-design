# Candidate b — Fathom (3-pane treasury trading desk)

Brief's own suggested archetype ("3-페인 마켓: 좌 워치리스트 레일 + 중앙 대형 차트 + 우 상세/피드, 트레이딩 터미널식"), not yet used literally by any dash winner. Fixed-width watchlist rail (8 FX/rate instruments, live sparklines, Up/Down filter) on the left; a candlestick+line chart with always-visible price/change/high/low header stats in the center; an independent whole-desk fill feed on the right that never reacts to the chart's selected instrument — explicit anti-convergence choice (see below).

Product: institutional treasury desk. Dark theme, blue accent, no display-font override (Pretendard only, on purpose — see below).

Interactions (4): ① candlestick crosshair, hover or keyboard-focus, ephemeral (no state persists, no sibling reacts) ② real Up/Down filter on the watchlist ③ 5D/10D/20D range toggle on the chart ④ selecting a watchlist row (or a ⌘K palette entry) recomputes only the chart's own dataset — single consumer, fills feed untouched.

## 브리프에 없던 것

1. **무엇을 정해야 했나**: 워치리스트 선택이 우측 체결 피드에도 반영돼야 하는가(고전적 마스터-디테일처럼 필터링).
   **무엇으로 정했나**: 아니오 — 우측 피드는 항상 데스크 전체 체결을 보여주고 선택과 무관.
   **왜**: `r17`~`r19` delta 세 건이 반복 지목한 "`selectedId` 원시 threading → 상호대체가능한 셸" 함정을 원천 회피. `r19`가 정확히 이 기법(부분재계산+비영속 반응 분리)으로 렌즈3 1위를 받은 선례를 다른 도메인(트레이딩 데스크)에 재적용.

2. **무엇을 정해야 했나**: 캔들스틱 20거래일치를 어떻게 결정론적으로 생성하나(`Math.random` 금지).
   **무엇으로 정했나**: 종목별 고정 seed(base·amp·freq·phase·drift)로 삼각함수 기반 OHLC를 코드 생성, 소수 2~4자리 반올림.
   **왜**: 브리프 "SVG 좌표 소수 2자리" 규칙을 가격 데이터에도 유추 적용 — 차트 카탈로그가 데이터 형태를 규정하지 않아 직접 결정.

3. **무엇을 정해야 했나**: 이 라운드에서 후보 하나는 디스플레이 활자를 지정하지 않아도 되는지.
   **무엇으로 정했나**: 지정 안 함(순수 Pretendard) — 화이트리스트 3종 중 아무것도 안 씀.
   **왜**: 브리프 "지정은 쓸 수 있는 것이지 반드시 써야 하는 것이 아니다" 문구를 그대로 적용. 직전 두 라운드 승자(r18 grotesk·r19 wide/mono)와 겹치지 않는 가장 안전한 선택이기도 함.

4. **무엇을 정해야 했나**: SVG 안의 포커스 가능한 히트타깃(`<rect>`)에 `aria-label`을 다는 것이 axe에서 유효한가.
   **무엇으로 정했나**: `role="button"`을 명시적으로 부여(라운드 중 `aria-prohibited-attr` 하드페일로 실측 발견 — role 없는 `<rect>`에 `aria-label`은 무효).
   **왜**: 이 발견은 브리프 구멍이라기보다 axe 규칙의 실측 학습이라 데이터로만 남김. 재현되면 `page-brief-core`의 시맨틱 규칙표에 편입 후보.
