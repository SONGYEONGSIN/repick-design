# Candidate c — Flowline (hero + single dominant forecast, inline-stats variant)

Hero + single dominant visualization, but explicitly the brief's own "변주" instruction: "KPI도 4카드 가로줄만이 아니라 히어로 숫자+보조 지표, 인라인 스탯 등 변주" — no four-tile KPI `<dl>` row at all. A large "days of cover" headline number sits beside two inline stat chips (reorder countdown, at-risk SKU count); below, a single Line + Confidence-Band forecast chart (`charts.catalog` "Time-Series Forecast", grade AA) is the page's dominant visualization, with an independent SKU risk table beneath it.

Product: Flowline, an inventory-forecasting console for a DTC/wholesale operator. Dark theme (n8n/Coinbase-grade), teal accent, **no display-font override** — Pretendard only, the brief's "designation is available, not required" clause, and deliberately the axis furthest from r20's all-three-candidates grotesk/wide split.

Interactions (4): ① chart-day hover/focus (invisible `foreignObject` scrubber buttons along the x-axis, stepped every 5/10/15 days depending on horizon) → live-region crosshair with exact projected units + confidence range ② SKU table real risk-tier filter chips + column-header sort (days-of-cover / on-hand) ③ forecast-horizon segmented toggle (30D/60D/90D) that recomputes the chart's entire series ④ warehouse-scope segmented toggle (All/East DC/West DC) that recomputes the chart and the hero stats via a shared scale factor — deliberately scoped to the chart+hero only, not threaded into the SKU table (which always shows both warehouses, its own column making the split visible instead).

## 브리프에 없던 것

1. **무엇을 정해야 했나**: "Segmented" 제네릭 컴포넌트가 `T extends string`로 만들어져 있는데, 예보 구간(30/60/90)이 자연스럽게는 숫자 타입 — 그대로 쓰면 타입 에러.
   **무엇으로 정했나**: 세그먼트 상태는 문자열 리터럴(`"30"|"60"|"90"`)로 유지하고 `buildSeries` 호출 직전에만 `Number(...)`로 변환.
   **왜**: 게이트 1차 실행에서 `tsc` 하드페일로 실측 발견(TS2322 3건) — 컴포넌트 재설계보다 상태 표현을 문자열로 맞추는 쪽이 최소 변경.
2. **무엇을 정해야 했나**: 창고 스코프 토글이 예보 차트뿐 아니라 SKU 테이블에도 적용돼야 하는지 — 최초 초안은 두 위젯을 공유 상태로 연결했었다.
   **무엇으로 정했나**: 공유를 풀고 SKU 테이블은 항상 전 창고를 보여주며(창고는 열로 표시) 자기 필터·정렬만 갖게 함.
   **왜**: `r17`~`r20` 델타(원시 selectedId/스코프를 형제 위젯에 threading하면 렌즈3이 "상호치환 가능한 셸"로 감점)를 카피 문구("적용은 독립적이다")를 실제 구현과 반드시 일치시키기 위해 사전 회피 — 처음엔 문구만 쓰고 구현이 안 맞았던 것을 스스로 잡아 고침.
3. **무엇을 정해야 했나**: 연속형 라인차트에서 "값 상시 병기"(r7/r9/r10 L3) 규칙을 어떻게 지킬지 — 60~90개 점 전부에 라벨을 못 박음.
   **무엇으로 정했나**: "오늘" 지점과 "재주문선 교차 지점" 두 개의 핵심 값만 SVG 텍스트로 상시 라벨링하고, 나머지는 hover/focus 크로스헤어로.
   **왜**: r9 델타(게이지·Sankey처럼 핵심 값은 상시, 나머지는 인터랙션)의 연속형 변종 — 모든 점을 라벨링하면 시각적 잡음이 되므로 "at-a-glance로 반드시 알아야 하는 두 값"만 항상 보이게 하는 것으로 규칙의 취지를 만족.
