---
tags: [generation, dash, auto-dash-r16]
---

# auto-dash-r16 / c — Parhelion

**Parhelion** — a fictional twin-region infrastructure-health console whose dominant structure is two full-height mirrored panels (Region A / Region B) placed side by side, each an identical stack of identity header → 6-tile KPI cluster (uptime, p95 latency, error rate, cost/hour, requests/min, active incidents) → a 24h p95-latency mini-chart with an always-visible current value → a compact service-status list (API Gateway, Auth, Primary DB, Message Queue, CDN Edge, Object Storage). This is deliberately not the 3-pane trading-terminal, master-detail, calendar/board, or single-hero-chart-plus-compare-row shapes already used in r13–r15 — the two peer panels *are* the hero, filling most of the viewport, and stack vertically (never side-scroll) on mobile. Theme: genuine light (white/zinc-50 canvas, white cards + `border-zinc-200` + `shadow-sm`), single UI accent = teal-700 for solid fills / teal-600 for outlines and chart lines (violet avoided per this round's ban), display face = `--font-display-grotesk` for the wordmark and page headline only, body/Korean-capable text stays Pretendard. No page-width cap (sidebar 256px + `lg:px-8` padding measured directly — content's right edge at 1920px is exactly the 32px padding, Playwright-verified). Six fictional regions (Ashfield, Cinder Bay, Brackwater, Dunmoor, Fenwick, Elmsgate) each derive their overall status and incident count from their own `services` list rather than a hand-typed field, so the KPI tile, identity badge, and below-fold table can never disagree. Five real `'use client'` interactions: (1) two region-picker dropdowns (each disables whichever region the other slot holds) that re-render both panels' KPIs, chart, and status list; (2) a keyboard-accessible crosshair on each panel's 24h latency chart, shared via one lifted `hoverIndex` state so hovering or arrow-keying either panel's chart draws the crosshair at the same hour on *both* panels at once (Playwright-verified: hovering panel A shows "107 ms · 10 PM" on A and the same-hour "92 ms · 10 PM" on B); (3) a metric-focus segmented control (Uptime/Latency/Errors/Cost) that both highlights the matching KPI tile in each panel and drives the delta/diff summary sentence above the panels; (4) a swap button that flips which region occupies slot A vs B; (5) sortable (`aria-sort`) + status-filterable below-fold service comparison table, plus a ⌘K command palette with curated "Compare X vs Y" quick-pairs that jump straight into a two-region comparison. Route: `app/src/app/dash-evolve/r16/c/page.tsx`.

## 브리프에 없던 것

1. ① "두 엔티티 비교" 도메인을 구체적으로 무엇으로 발명할지 정해야 했다 — 브리프는 예시만 나열(인프라/창고/코호트/경쟁사)하고 리터럴 지표셋은 없다.
   ② 멀티리전 인프라 헬스 콘솔로 확정하고, 지표를 uptime(높을수록 좋음)·p95 latency·error rate·cost/hour(둘 다 낮을수록 좋음) 4종으로 좁혀 metric-focus 토글의 대상으로 삼았다.
   ③ r15/c가 이미 A/B 실험 비교(차트+비교행)를 다뤘으므로 구조적으로 완전히 다른 비교 메커니즘(거울 대칭 패널 2개)이 필요했고, "높을수록/낮을수록 좋음"이 지표마다 다른 인프라 도메인이 delta 계산 로직(리더 판정)에 실제 분기를 요구해 대칭 패널 설계의 정당성을 높인다고 판단했다.

2. ① 리전 이름을 실제 AWS/GCP 리전명(us-east-1 등)으로 할지, 완전 가상 코드네임으로 할지 정해야 했다.
   ② Ashfield·Cinder Bay·Brackwater·Dunmoor·Fenwick·Elmsgate 같은 가상 데이터센터 코드네임을 만들고, provider도 "Northwind Cloud"/"Vantage Cloud"/"Ridgeline Compute" 같은 가상 업체명으로 채웠다.
   ③ 실재 클라우드 사업자 상표를 페이지에 노출하면 그 업체를 사칭/보증하는 것처럼 보일 위험이 있고, 카탈로그 다른 작품들도 가상 브랜드를 발명하는 관례를 따르는 것이 안전하며 결정에 자유도도 크다고 판단했다.

3. ① "서비스 상태 배지" 요약(활성 인시던트 수, 리전 전체 상태)을 손으로 입력할지, 개별 서비스 상태에서 계산할지 정해야 했다 — 브리프는 "합계 정합"만 요구하고 구체적 파생 규칙은 없다.
   ② `services` 배열을 유일한 소스로 삼아 `deriveIncidents`/`deriveOverallStatus` 두 함수로 활성 인시던트 수와 리전 전체 배지를 항상 계산해서 내도록 했다(손으로 입력한 카운트 필드를 아예 두지 않음).
   ③ d47(Vela)의 `data.ts` 주석이 이미 "파생 집계는 항상 계산에서, 손으로 타이핑하지 않는다"는 관례를 명시하고 있었고, 두 패널이 거울처럼 나란히 보이는 이 화면에서는 배지·타일·테이블 세 곳이 서로 다른 숫자를 보여주는 사고가 특히 눈에 띄기 쉬워 이 관례를 그대로 계승하는 편이 안전했다.

4. ① 두 패널 사이에 공유 크로스헤어를 둘지, 패널마다 독립 크로스헤어로 둘지 정해야 했다 — 브리프의 "차트 호버 크로스헤어 툴팁" 항목은 단일 차트 기준 설명뿐이다.
   ② `hoverIndex`를 부모(`ParhelionClient`)로 끌어올려 두 `MiniLineChart`가 같은 인덱스를 공유하게 만들어, 한쪽을 호버/포커스하면 같은 시각(hour)이 양쪽 모두에 동시에 표시되게 했다.
   ③ 이 라운드의 배정 자체가 "거울 대칭 패널이 히어로"이므로, 크로스헤어를 공유하는 것이 "같은 시점을 양쪽에서 동시에 비교한다"는 트윈 비교 콘셉트를 인터랙션 차원에서 직접 증명하는 가장 자연스러운 선택이라고 판단했다(임의 선택이 아니라 배정된 매크로 셰이프에서 연역).

5. ① `ACCENT_SOLID`(흰 글자 온 티얼 배경)에 쓸 정확한 티얼 톤을 정해야 했다 — 카탈로그의 Productivity Tool 라이트 팔레트는 teal `#0D9488`(tailwind teal-600)를 primary로 제시하지만, 계산해보니 흰 글자 대비가 3.74:1로 4.5:1 미달이었다.
   ② 배경을 teal-700(`#0F766E`)으로 한 단계 낮춰 대비 5.47:1을 확보했고, hover/active는 teal-800/900으로 더 어둡게 이어갔다. 아웃라인·포커스링·차트 선(비텍스트 요소)은 원래의 teal-600을 그대로 유지했다(3:1 UI-컴포넌트 기준은 이미 충족).
   ③ page-brief-core의 실측 사례("rose-500(3.75)→rose-600(4.53) 아닌 rose-700(6.03)으로: 여유 0.03의 '딱 맞음'은 쓰지 않는다")를 그대로 따라, 경계값에 딱 걸치는 단계 대신 한 단계 더 어두운 확실한 여유를 선택했다.

6. ① region-picker 트리거 버튼의 접근 가능한 이름을 어떻게 구성할지 정해야 했다 — "Region A" 접두어(sr-only)만 `aria-labelledby`로 걸면 화면에 보이는 리전명("Ashfield")이 접근 가능한 이름에서 빠져 `label-content-name-mismatch` 위험이 생긴다.
   ② `aria-labelledby`가 sr-only 라벨 id와 버튼 자신의 id를 모두 참조하도록 이어붙여("Region A" + 버튼 내부의 보이는 텍스트를 합성), 슬롯 배지 글자("A"/"B")와 셰브런 아이콘은 `aria-hidden`으로 빼서 중복 낭독을 막았다.
   ③ page-brief-core가 이미 문서화한 사고(⌘K 검색 라벨을 `sm:inline`으로만 두면 "라벨 없는 아이콘"이 되고, 반대로 `aria-label`을 강제로 달면 이번엔 보이는 텍스트와 어긋나는 `label-content-name-mismatch`로 옮겨간다는 정확히 같은 트레이드오프)를 이 컴포넌트에도 그대로 적용해, "접두어 라벨 + 실제 보이는 콘텐츠를 합성"하는 절충으로 두 하드게이트를 동시에 피했다.
