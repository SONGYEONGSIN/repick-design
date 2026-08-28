# Candidate c — Lockstep (feed-centric deploy console + SLO bullet grid)

Feed-centric macro (central live stream + side panel), not yet used this way by a dash winner (closest relative, `r18/a` "피드중심 심사큐", lost on weaker dominant-viz/sync work — this build leans harder into the bullet chart's AAA at-a-glance grade from `charts.catalog`). Central deploy feed (filterable by outcome, sortable by duration/recency) is the main content; a right-hand SLO bullet-chart grid — one bar per service, every bar prints its own burn percentage as standing text plus a status icon+badge, no hover required — is the page's single dominant visualization.

Product: platform/SRE ops console. Dark theme, emerald accent, `--font-display-grotesk`.

Interactions (4): ① bullet-row hover/focus reveals exact budget-remaining in a live-region rail ② real status filter + duration/recency sort on the deploy feed ③ 7D/30D error-budget window toggle (rewrites every bullet's own value) ④ ⌘K service search → highlights exactly one bullet row (single consumer, feed untouched).

## 브리프에 없던 것

1. **무엇을 정해야 했나**: 대시보드 하나에 "지배 시각화"가 격자/차트가 아니라 불릿 그리드일 때도 렌즈2의 "즉시가독" 기준(r7/r9/r10 L3)을 충족하는가.
   **무엇으로 정했나**: 예 — `charts.catalog`가 Bullet을 "Performance vs Target (Compact)"에서 등급 **AAA**, "값 상시 표시(hover 아님)"으로 명시하므로 이 요구를 문자 그대로 구현(모든 바가 숫자+상태뱃지+아이콘을 상시 인쇄).
   **왜**: 카탈로그가 이미 답을 갖고 있었음 — 브리프가 "생성형 SVG/CSS 우선"이라 명시했지만 불릿은 단순 `<div>` 막대로도 카탈로그 규정을 100% 충족해 SVG를 쓰지 않기로 함(과잉 설계 회피).

2. **무엇을 정해야 했나**: 피드 중심 아키타입에서 "지배 시각화"를 어디에 둘 것인가 — 중앙(피드 자리)인가 보조 패널인가.
   **무엇으로 정했나**: 보조 패널(우측)에 두되 카드 크기·정보 밀도를 충분히 키워 "부차적 위젯"으로 안 보이게 함.
   **왜**: 브리프의 피드 중심 정의("중앙 실행/활동 스트림 + 양옆 보조 패널")는 지배 시각화의 위치를 지정하지 않음 — 이번 라운드 다른 두 후보가 이미 "중앙 = 시각화"(a는 격자, b는 차트) 배치라 세 번째 후보까지 같은 배치를 쓰면 매크로 다양성 신호가 준다고 판단해 의도적으로 갈랐다.

3. **무엇을 정해야 했나**: 배포 피드 필터/정렬이 SLO 그리드에 영향을 줘야 하는가.
   **무엇으로 정했나**: 아니오, 완전 독립 — `r17`~`r19` 델타(원시 `selectedId` 다중위젯 동기화 함정)를 이번엔 필터/정렬 축에도 선제 적용.
   **왜**: 두 위젯이 서로 다른 시간창(피드=오늘, 버짓=7D/30D)이라 동기화 자체가 의미적으로 어색하기도 함 — 독립성이 설계 편의가 아니라 도메인 논리였다.
